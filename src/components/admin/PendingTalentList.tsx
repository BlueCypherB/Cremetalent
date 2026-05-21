import React, { useState } from 'react';
import { TalentData } from '@/types/talent';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, XCircle, Mail, MapPin, Briefcase, Clock, ExternalLink, Users, Eye } from 'lucide-react';
import type { TalentApplication } from '@/lib/database.types';
import ApplicationDetailSheet from '@/components/admin/ApplicationDetailSheet';

interface PendingTalentListProps {
  talents: TalentData[];
  rawApplications: TalentApplication[];
  onApprove: (talent: TalentData) => void;
  onReject: (talent: TalentData, rejectionReason: string) => void;
}

const getInitials = (name: string) =>
  name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);

const AVATAR_COLORS = [
  'bg-amber-100 text-amber-800',
  'bg-emerald-100 text-emerald-800',
  'bg-violet-100 text-violet-800',
  'bg-sky-100 text-sky-800',
  'bg-rose-100 text-rose-800',
  'bg-orange-100 text-orange-800',
];

const avatarColor = (name: string) =>
  AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

const PendingTalentList = ({ talents, rawApplications, onApprove, onReject }: PendingTalentListProps) => {
  const [selectedTalent, setSelectedTalent] = useState<TalentData | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [detailApplication, setDetailApplication] = useState<TalentApplication | null>(null);

  const handleReject = () => {
    if (selectedTalent) {
      onReject(selectedTalent, rejectionReason);
      setRejectionReason('');
      setSelectedTalent(null);
      setIsDialogOpen(false);
    }
  };

  if (talents.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm py-16 text-center">
        <Users className="h-8 w-8 text-slate-300 mx-auto mb-3" />
        <p className="text-slate-500 text-sm font-medium">No pending applications</p>
        <p className="text-slate-400 text-xs mt-1">New applicants will appear here for review</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {talents.map((talent) => (
        <div
          key={talent.id}
          className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:border-amber-200 transition-colors"
        >
          {/* Card top accent */}
          <div className="h-0.5 w-full bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200" />

          <div className="p-5">
            {/* Header row */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${avatarColor(talent.name)}`}>
                  {getInitials(talent.name)}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-slate-900 truncate">{talent.name}</h3>
                  <a
                    href={`mailto:${talent.email}`}
                    className="text-xs text-slate-500 flex items-center gap-1 hover:text-amber-600 transition-colors mt-0.5"
                  >
                    <Mail className="h-3 w-3" />
                    {talent.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  className="shadow-none h-8 px-3 text-xs gap-1.5"
                  onClick={() => setDetailApplication(rawApplications.find(r => r.id === talent.id) ?? null)}
                >
                  <Eye className="h-3.5 w-3.5" />
                  View Details
                </Button>
                <Button
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-none h-8 px-3 text-xs gap-1.5"
                  onClick={() => onApprove(talent)}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Approve
                </Button>

                <Dialog
                  open={isDialogOpen && selectedTalent?.id === talent.id}
                  onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (!open) {
                      setSelectedTalent(null);
                      setRejectionReason('');
                    }
                  }}
                >
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 shadow-none h-8 px-3 text-xs gap-1.5"
                      onClick={() => {
                        setSelectedTalent(talent);
                        setIsDialogOpen(true);
                      }}
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      Reject
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-base">Reject Application</DialogTitle>
                      <DialogDescription className="text-sm">
                        Rejecting <strong className="text-slate-700">{talent.name}</strong>'s application. You may optionally provide a reason.
                      </DialogDescription>
                    </DialogHeader>
                    <Textarea
                      placeholder="Reason for rejection (optional)"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      className="min-h-[90px] text-sm resize-none"
                    />
                    <DialogFooter>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedTalent(null);
                          setRejectionReason('');
                          setIsDialogOpen(false);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button variant="destructive" size="sm" onClick={handleReject}>
                        Confirm Rejection
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Detail grid */}
            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {[
                  { icon: Briefcase, label: 'Specialization', value: talent.category },
                  { icon: Clock, label: 'Experience', value: talent.experience },
                  { icon: MapPin, label: 'Location', value: talent.location },
                  { icon: Clock, label: 'Availability', value: talent.availability },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="bg-slate-50 rounded-lg px-3 py-2">
                    <p className="text-[10px] text-slate-400 uppercase font-medium tracking-wide mb-1 flex items-center gap-1">
                      <Icon className="h-2.5 w-2.5" />
                      {label}
                    </p>
                    <p className="text-xs text-slate-700 font-medium">{value || '—'}</p>
                  </div>
                ))}
              </div>

              {talent.skills.length > 0 && (
                <div className="mb-3">
                  <p className="text-[10px] text-slate-400 uppercase font-medium tracking-wide mb-1.5">Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {talent.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-100 rounded-full text-[11px] font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {talent.bio && (
                <div className="mb-3">
                  <p className="text-[10px] text-slate-400 uppercase font-medium tracking-wide mb-1">Bio</p>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{talent.bio}</p>
                </div>
              )}

              {talent.portfolio[0] && (
                <a
                  href={talent.portfolio[0].startsWith('http') ? talent.portfolio[0] : `https://${talent.portfolio[0]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-amber-600 hover:text-amber-700 font-medium"
                >
                  <ExternalLink className="h-3 w-3" />
                  View Portfolio
                </a>
              )}
            </div>
          </div>
        </div>
      ))}

      <ApplicationDetailSheet
        application={detailApplication}
        onClose={() => setDetailApplication(null)}
        onApprove={onApprove}
        onReject={onReject}
      />
    </div>
  );
};

export default PendingTalentList;
