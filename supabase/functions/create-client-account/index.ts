import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CreateClientPayload {
  email: string
  password: string
  full_name: string
  company_name?: string
  phone?: string
  location?: string
  intake_submission_id?: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
    const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    if (!SERVICE_ROLE_KEY) {
      return new Response(
        JSON.stringify({ error: 'SUPABASE_SERVICE_ROLE_KEY not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const body = await req.json() as CreateClientPayload

    if (!body.email || !body.password || !body.full_name) {
      return new Response(
        JSON.stringify({ error: 'email, password, and full_name are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (body.password.length < 8) {
      return new Response(
        JSON.stringify({ error: 'Password must be at least 8 characters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    })

    // Check if user with this email already exists
    const { data: existing } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 })
    const matched = existing?.users?.find(
      (u) => u.email?.toLowerCase() === body.email.toLowerCase()
    )

    if (matched) {
      // Check if already a client
      const { data: existingClient } = await admin
        .from('client_accounts')
        .select('id')
        .eq('id', matched.id)
        .maybeSingle()

      if (existingClient) {
        return new Response(
          JSON.stringify({ error: 'An account with this email already exists. Please sign in.' }),
          { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // Create auth user with email_confirm: true (no confirmation email sent)
    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email: body.email,
      password: body.password,
      email_confirm: true,
      user_metadata: { full_name: body.full_name },
    })

    if (createErr || !created?.user) {
      return new Response(
        JSON.stringify({ error: createErr?.message ?? 'Failed to create user' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const userId = created.user.id

    // Insert client_accounts row
    const { error: insertErr } = await admin.from('client_accounts').insert({
      id: userId,
      full_name: body.full_name,
      email: body.email,
      company_name: body.company_name ?? null,
      phone: body.phone ?? null,
      location: body.location ?? null,
    })

    if (insertErr) {
      // Rollback: delete the auth user we just created
      await admin.auth.admin.deleteUser(userId)
      return new Response(
        JSON.stringify({ error: `Account created but profile insert failed: ${insertErr.message}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Link intake submission if provided
    if (body.intake_submission_id) {
      await admin
        .from('client_intake_submissions')
        .update({ user_id: userId })
        .eq('id', body.intake_submission_id)
        // Non-fatal — link is a nice-to-have
        .then(() => null)
        .catch(() => null)
    }

    // Send welcome email (non-blocking, non-fatal)
    const SITE_URL = Deno.env.get('SITE_URL') ?? 'http://localhost:5173'
    supabaseFireAndForget(admin, {
      to: body.email,
      subject: 'Welcome to CrémeTalent!',
      html: `<p>Dear ${body.full_name},</p><p>Your CrémeTalent client account has been created successfully. You can now log in and post job listings directly on the platform.</p><p><a href="${SITE_URL}/client/dashboard" style="background:#d4af37;color:#000;padding:10px 20px;text-decoration:none;border-radius:4px;display:inline-block;">Go to Dashboard</a></p><p>Warm regards,<br/>The CrémeTalent Team</p>`,
    })

    return new Response(
      JSON.stringify({ ok: true, user_id: userId }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: String(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

// Fire-and-forget helper that never throws
// deno-lint-ignore no-explicit-any
function supabaseFireAndForget(admin: any, emailPayload: { to: string; subject: string; html: string }) {
  admin.functions.invoke('send-email', { body: emailPayload }).catch(() => null)
}
