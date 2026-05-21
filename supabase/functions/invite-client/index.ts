import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface InvitePayload {
  intake_submission_id: string
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

    const { intake_submission_id, redirect_to } = await req.json() as InvitePayload
    if (!intake_submission_id) {
      return new Response(
        JSON.stringify({ error: 'Missing intake_submission_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false }
    })

    // Fetch the intake submission
    const { data: submission, error: fetchErr } = await admin
      .from('client_intake_submissions')
      .select('id, email, full_name, company_name, phone, website, industry, client_account_id')
      .eq('id', intake_submission_id)
      .single()

    if (fetchErr || !submission) {
      return new Response(
        JSON.stringify({ error: fetchErr?.message ?? 'Submission not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // If a client account is already linked, return the existing setup link
    if (submission.client_account_id) {
      const finalRedirect = redirect_to ?? `${SITE_URL}/client/set-password`
      const { data: linkData } = await admin.auth.admin.generateLink({
        type: 'recovery',
        email: submission.email,
        options: { redirectTo: finalRedirect },
      })
      return new Response(
        JSON.stringify({
          ok: true,
          already_linked: true,
          client_account_id: submission.client_account_id,
          setup_link: linkData?.properties?.action_link ?? null,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const finalRedirect = redirect_to ?? `${SITE_URL}/client/set-password`

    // Check if a user with this email already exists in auth
    const { data: existing } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 })
    const matched = existing?.users?.find(
      (u) => u.email?.toLowerCase() === submission.email.toLowerCase()
    )

    let userId: string
    let setupLink: string | null = null

    if (matched) {
      userId = matched.id
      // Generate a password-reset link for existing users
      const { data: linkData } = await admin.auth.admin.generateLink({
        type: 'recovery',
        email: submission.email,
        options: { redirectTo: finalRedirect },
      })
      setupLink = linkData?.properties?.action_link ?? null
    } else {
      // Create a new auth user with a random password (they will set their own)
      const randomPassword = crypto.randomUUID() + crypto.randomUUID()
      const { data: created, error: createErr } = await admin.auth.admin.createUser({
        email: submission.email,
        password: randomPassword,
        email_confirm: true,
        user_metadata: { full_name: submission.full_name, company_name: submission.company_name },
      })

      if (createErr || !created?.user) {
        return new Response(
          JSON.stringify({ error: createErr?.message ?? 'User creation failed' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      userId = created.user.id

      // Generate a password-recovery link the client uses to set their password
      const { data: linkData, error: linkErr } = await admin.auth.admin.generateLink({
        type: 'recovery',
        email: submission.email,
        options: { redirectTo: finalRedirect },
      })

      if (linkErr) {
        console.error('generateLink failed:', linkErr.message)
      }

      setupLink = linkData?.properties?.action_link ?? null
    }

    // Check if a client_accounts row already exists for this user (idempotent)
    const { data: existingAccount } = await admin
      .from('client_accounts')
      .select('id')
      .eq('id', userId)
      .maybeSingle()

    if (!existingAccount) {
      const { error: insertErr } = await admin
        .from('client_accounts')
        .insert({
          id: userId,
          full_name: submission.full_name,
          company_name: submission.company_name,
          email: submission.email,
          phone: submission.phone ?? null,
          website: submission.website ?? null,
          industry: submission.industry ?? null,
          is_active: true,
        })

      if (insertErr) {
        return new Response(
          JSON.stringify({
            error: `User created but client_accounts insert failed: ${insertErr.message}`,
            user_id: userId,
          }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // Link the intake submission to the client account
    const { error: linkErr } = await admin
      .from('client_intake_submissions')
      .update({ client_account_id: userId })
      .eq('id', intake_submission_id)

    if (linkErr) {
      console.error('Failed to link intake submission:', linkErr.message)
    }

    return new Response(
      JSON.stringify({
        ok: true,
        user_id: userId,
        invited: !matched,
        setup_link: setupLink,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: String(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
