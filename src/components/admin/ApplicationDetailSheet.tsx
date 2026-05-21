import React, { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Mail, Phone, MapPin, Briefcase, Clock, ExternalLink,
  Download, Linkedin, Instagram, Twitter, CheckCircle2, XCircle,
  FileText, User, Globe, Loader2,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';
import type { TalentApplication } from '@/lib/database.types';
import type { TalentData } from '@/types/talent';

interface Props {
  application: TalentApplication | null;
  onClose: () => void;
  onApprove: (talent: TalentData) => void;
  onReject: (talent: TalentData, reason: string) => void;
}

function toTalentData(app: TalentApplication): TalentData {
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

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-widest mb-1.5">{children}</p>
);

const Field = ({ label, value }: { label: string; value: string | null | undefined }) =>
  value ? (
    <div>
      <SectionLabel>{label}</SectionLabel>
      <p className="text-sm text-slate-700">{value}</p>
    </div>
  ) : null;

const Divider = () => <hr className="border-slate-100" />;

const ApplicationDetailSheet = ({ application, onClose, onApprove, onReject }: Props) => {
  const queryClient = useQueryClient();
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [cvLoading, setCvLoading] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [notesSaving, setNotesSaving] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    if (!application) {
      setCvUrl(null);
      setAdminNotes('');
      setRejectReason('');
      return;
    }
    setAdminNotes(application.admin_notes ?? '');

    if (application.resume_url) {
      setCvLoading(true);
      supabase.storage
        .from('resumes')
        .createSignedUrl(application.resume_url, 3600)
        .then(({ data }) => {
          setCvUrl(data?.signedUrl ?? null);
        })
        .catch(() => setCvUrl(null))
        .finally(() => setCvLoading(false));
    } else {
      setCvUrl(null);
    }
  }, [application?.id]);

  const saveNotes = async () => {
    if (!application) return;
    setNotesSaving(true);
    const { error } = await supabase
      .from('talent_applications')
      .update({ admin_notes: adminNotes })
      .eq('id', application.id);
    setNotesSaving(false);
    if (error) {
      toast({ title: 'Failed to save notes', description: error.message, variant: 'destructive' });
    } else {
      queryClient.invalidateQueries({ queryKey: ['talent_applications', 'all'] });
      toast({ title: 'Notes saved' });
    }
  };

  const handleApprove = () => {
    if (!application) return;
    onApprove(toTalentData(application));
    onClose();
  };

  const handleReject = () => {
    if (!application) return;
    onReject(toTalentData(application), rejectReason);
    setRejectOpen(false);
    setRejectReason('');
    onClose();
  };

  const app = application;

  return (
    <>
      <Sheet open={!!app} onOpenChange={(open) => { if (!open) onClose(); }}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {app && (
            <>
              <SheetHeader className="mb-6">
                <SheetTitle className="text-base font-semibold text-slate-900">
                  {app.first_name} {app.last_name}
                </SheetTitle>
                <SheetDescription className="text-xs text-slate-500">
                  Application submitted {new Date(app.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-5">
                {/* Contact */}
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-slate-400" /> Contact
                  </p>
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <a href={`mailto:${app.email}`} className="flex items-center gap-2 text-amber-600 hover:text-amber-700">
                      <Mail className="h-3.5 w-3.5 flex-shrink-0" /> {app.email}
                    </a>
                    {app.phone && (
                      <a href={`tel:${app.phone}`} className="flex items-center gap-2 text-slate-600 hover:text-slate-800">
                        <Phone className="h-3.5 w-3.5 flex-shrink-0" /> {app.phone}
                      </a>
                    )}
                    <span className="flex items-center gap-2 text-slate-600">
                      <MapPin className="h-3.5 w-3.5 flex-shrink-0" /> {app.city}, {app.country}
                    </span>
                  </div>
                </div>

                <Divider />

                {/* Professional */}
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5 text-slate-400" /> Professional
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Specialization', value: app.specialization },
                      { label: 'Experience', value: app.experience_level },
                      { label: 'Availability', value: app.availability },
                    ].map(({ label, value }) => (
                      <div key={label} className="bg-slate-50 rounded-lg px-3 py-2">
                        <SectionLabel>{label}</SectionLabel>
                        <p className="text-xs text-slate-700 font-medium">{value || '—'}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skills */}
                {app.skills?.length > 0 && (
                  <>
                    <Divider />
                    <div>
                      <SectionLabel>Skills</SectionLabel>
                      <div className="flex flex-wrap gap-1.5">
                        {app.skills.map((s) => (
                          <span key={s} className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-100 rounded-full text-[11px] font-medium">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Bio */}
                {app.bio && (
                  <>
                    <Divider />
                    <div>
                      <SectionLabel>Bio</SectionLabel>
                      <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{app.bio}</p>
                    </div>
                  </>
                )}

                <Divider />

                {/* CV / Portfolio / Social */}
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                    <Globe className="h-3.5 w-3.5 text-slate-400" /> Links & Documents
                  </p>

                  {/* CV */}
                  <div>
                    <SectionLabel>CV / Resume</SectionLabel>
                    {cvLoading ? (
                      <span className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" /> Generating download link…
                      </span>
                    ) : cvUrl ? (
                      <a
                        href={cvUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-600 hover:text-amber-700"
                      >
                        <Download className="h-3.5 w-3.5" /> Download CV
                      </a>
                    ) : (
                      <p className="text-xs text-slate-400 italic">No CV uploaded</p>
                    )}
                  </div>

                  {/* Portfolio */}
                  {app.portfolio_url && (
                    <div>
                      <SectionLabel>Portfolio</SectionLabel>
                      <a
                        href={app.portfolio_url.startsWith('http') ? app.portfolio_url : `https://${app.portfolio_url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-amber-600 hover:text-amber-700 font-medium"
                      >
                        <ExternalLink className="h-3.5 w-3.5" /> View Portfolio
                      </a>
                    </div>
                  )}

                  {/* Social */}
                  {(app.linkedin || app.instagram || app.twitter) && (
                    <div>
                      <SectionLabel>Social</SectionLabel>
                      <div className="flex flex-col gap-1.5">
                        {app.linkedin && (
                          <a href={app.linkedin.startsWith('http') ? app.linkedin : `https://${app.linkedin}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-blue-700">
                            <Linkedin className="h-3.5 w-3.5" /> {app.linkedin}
                          </a>
                        )}
                        {app.instagram && (
                          <a href={`https://instagram.com/${app.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-pink-600">
                            <Instagram className="h-3.5 w-3.5" /> {app.instagram}
                          </a>
                        )}
                        {app.twitter && (
                          <a href={`https://twitter.com/${app.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-sky-500">
                            <Twitter className="h-3.5 w-3.5" /> {app.twitter}
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Heard from */}
                {app.heard_from && (
                  <>
                    <Divider />
                    <Field label="How they heard about us" value={app.heard_from} />
                  </>
                )}

                <Divider />

                {/* Admin notes */}
                <div>
                  <p className="text-xs font-semibold text-slate-900 flex items-center gap-1.5 mb-2">
                    <FileText className="h-3.5 w-3.5 text-slate-400" /> Admin Notes
                  </p>
                  <Textarea
                    rows={4}
                    placeholder="Internal notes (not visible to applicant)…"
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    className="text-xs resize-none"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2 h-7 text-xs"
                    onClick={saveNotes}
                    disabled={notesSaving}
                  >
                    {notesSaving ? 'Saving…' : 'Save notes'}
                  </Button>
                </div>

                <Divider />

                {/* Actions */}
                <div className="flex items-center gap-3 pt-1 pb-4">
                  <Button
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
                    onClick={handleApprove}
                  >
                    <CheckCircle2 className="h-4 w-4" /> Approve
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 gap-1.5"
                    onClick={() => setRejectOpen(true)}
                  >
                    <XCircle className="h-4 w-4" /> Reject
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Reject reason dialog */}
      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">Reject Application</DialogTitle>
            <DialogDescription className="text-sm">
              Rejecting <strong className="text-slate-700">{app?.first_name} {app?.last_name}</strong>'s application. You may optionally provide a reason.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Reason for rejection (optional)"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            className="min-h-[90px] text-sm resize-none"
          />
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => { setRejectOpen(false); setRejectReason(''); }}>
              Cancel
            </Button>
            <Button variant="destructive" size="sm" onClick={handleReject}>
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ApplicationDetailSheet;
