import { supabase } from '@/lib/supabase';
import type { TalentApplication } from '@/lib/database.types';

export type { TalentApplication };

export async function approveTalent(
  id: string
): Promise<{ inviteSent: boolean; inviteError?: string }> {
  const { error } = await supabase
    .from('talent_applications')
    .update({
      status: 'approved',
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) throw new Error(error.message);

  const { data: app } = await supabase
    .from('talent_applications')
    .select('email, first_name')
    .eq('id', id)
    .single();

  // Auto-create auth account and get a branded setup link (no Supabase email sent)
  const inviteResult = await supabase.functions.invoke('invite-talent', {
    body: { application_id: id },
  });

  let inviteSent = false;
  let inviteError: string | undefined;
  let setupLink: string | null = null;

  if (inviteResult.error) {
    inviteError = inviteResult.error.message;
  } else if (inviteResult.data?.error) {
    inviteError = String(inviteResult.data.error);
  } else {
    inviteSent = true;
    setupLink = inviteResult.data?.setup_link ?? null;
  }

  if (app) {
    const setupSection = setupLink
      ? `<p>Use the link below to set your password and access your talent profile:</p><p><a href="${setupLink}" style="background:#d4af37;color:#000;padding:10px 20px;text-decoration:none;border-radius:4px;display:inline-block;">Set Up Your Account</a></p>`
      : `<p>Our team will reach out shortly with your login instructions.</p>`;

    const inviteNote = inviteError
      ? `<p>Our team will reach out separately with login instructions.</p>`
      : setupSection;

    supabase.functions.invoke('send-email', {
      body: {
        to: app.email,
        subject: 'Your CrémeTalent Application Has Been Approved!',
        html: `<p>Dear ${app.first_name},</p><p>Congratulations! Your application has been approved and your profile is now visible in our talent pool.</p>${inviteNote}<p>Warm regards,<br/>The CrémeTalent Team</p>`,
      },
    }).catch(() => null);
  }

  return { inviteSent, inviteError };
}

export async function rejectTalent(id: string, rejectionReason: string): Promise<void> {
  const { error } = await supabase
    .from('talent_applications')
    .update({
      status: 'rejected',
      rejection_reason: rejectionReason,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) throw new Error(error.message);

  const { data } = await supabase
    .from('talent_applications')
    .select('email, first_name')
    .eq('id', id)
    .single();

  if (data) {
    supabase.functions.invoke('send-email', {
      body: {
        to: data.email,
        subject: 'Update on Your CrémeTalent Application',
        html: `<p>Dear ${data.first_name},</p><p>Thank you for your interest in joining CrémeTalent. After careful review, we are unable to accept your application at this time.${rejectionReason ? `<br/><br/><strong>Feedback:</strong> ${rejectionReason}` : ''}</p><p>We encourage you to reapply in the future.</p><p>Warm regards,<br/>The CrémeTalent Team</p>`,
      },
    }).catch(() => null);
  }
}

export async function deleteTalent(id: string): Promise<void> {
  const { data: row } = await supabase
    .from('talent_applications')
    .select('resume_url')
    .eq('id', id)
    .maybeSingle();

  if (row?.resume_url) {
    await supabase.storage.from('resumes').remove([row.resume_url]).catch(() => null);
  }

  const { error } = await supabase
    .from('talent_applications')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
}

export function applicationToTalentData(app: TalentApplication) {
  return {
    id: app.id,
    name: `${app.first_name} ${app.last_name}`,
    photo: app.profile_photo_url ?? null,
    location: `${app.city}, ${app.country}`,
    category: app.specialization,
    experience: app.experience_level,
    availability: app.availability,
    bio: app.bio,
    skills: app.skills,
    portfolio: app.portfolio_url ? [app.portfolio_url] : [],
    email: app.email,
    status: app.status,
    notes: app.rejection_reason ?? '',
    matchScore: 0,
    lastContact: app.reviewed_at?.split('T')[0] ?? app.created_at.split('T')[0],
    userId: app.user_id ?? null,
  };
}
