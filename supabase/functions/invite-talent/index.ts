import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface InvitePayload {
  application_id: string
  redirect_to?: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
    const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const SITE_URL = Deno.env.get('SITE_URL') ?? 'http://localhost:5173'

    if (!SERVICE_ROLE_KEY) {
      return new Response(
        JSON.stringify({ error: 'SUPABASE_SERVICE_ROLE_KEY not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { application_id, redirect_to } = await req.json() as InvitePayload
    if (!application_id) {
      return new Response(
        JSON.stringify({ error: 'Missing application_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false }
    })

    // Fetch the application
    const { data: app, error: fetchErr } = await admin
      .from('talent_applications')
      .select('id, email, first_name, user_id')
      .eq('id', application_id)
      .single()

    if (fetchErr || !app) {
      return new Response(
        JSON.stringify({ error: fetchErr?.message ?? 'Application not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Already linked? Return the existing setup link if possible.
    if (app.user_id) {
      const finalRedirect = redirect_to ?? `${SITE_URL}/talent/set-password`
      const { data: linkData } = await admin.auth.admin.generateLink({
        type: 'recovery',
        email: app.email,
        options: { redirectTo: finalRedirect },
      })
      return new Response(
        JSON.stringify({
          ok: true,
          already_linked: true,
          user_id: app.user_id,
          setup_link: linkData?.properties?.action_link ?? null,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const finalRedirect = redirect_to ?? `${SITE_URL}/talent/set-password`

    // Check if a user with this email already exists
    const { data: existing } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 })
    const matched = existing?.users?.find((u) => u.email?.toLowerCase() === app.email.toLowerCase())

    let userId: string
    let setupLink: string | null = null

    if (matched) {
      userId = matched.id
      // Generate a password-reset link for the existing user (does NOT send any email)
      const { data: linkData } = await admin.auth.admin.generateLink({
        type: 'recovery',
        email: app.email,
        options: { redirectTo: finalRedirect },
      })
      setupLink = linkData?.properties?.action_link ?? null
    } else {
      // Create user without sending any Supabase email (email_confirm: true skips confirmation)
      const randomPassword = crypto.randomUUID() + crypto.randomUUID()
      const { data: created, error: createErr } = await admin.auth.admin.createUser({
        email: app.email,
        password: randomPassword,
        email_confirm: true,
        user_metadata: { first_name: app.first_name },
      })

      if (createErr || !created?.user) {
        return new Response(
          JSON.stringify({ error: createErr?.message ?? 'User creation failed' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      userId = created.user.id

      // Generate a password-recovery link the talent uses to set their own password
      const { data: linkData, error: linkErr } = await admin.auth.admin.generateLink({
        type: 'recovery',
        email: app.email,
        options: { redirectTo: finalRedirect },
      })

      if (linkErr) {
        // User was created; link generation failed — still proceed but note it
        console.error('generateLink failed:', linkErr.message)
      }

      setupLink = linkData?.properties?.action_link ?? null
    }

    // Link user_id back to the application
    const { error: linkErr } = await admin
      .from('talent_applications')
      .update({ user_id: userId })
      .eq('id', application_id)

    if (linkErr) {
      return new Response(
        JSON.stringify({
          error: `User created but link failed: ${linkErr.message}`,
          user_id: userId,
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ ok: true, user_id: userId, invited: !matched, setup_link: setupLink }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: String(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
