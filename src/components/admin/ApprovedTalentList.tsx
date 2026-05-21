import { useState } from 'react';
import { TalentData } from '@/types/talent';
import { Button } from "@/components/ui/button";
import { ExternalLink, Trash2, CheckSquare, Mail } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import TalentProfileModal from '../talent/TalentProfileModal';
import { supabase } from '@/lib/supabase';
import { toast } from "@/components/ui/use-toast";
import { useQueryClient } from '@tanstack/react-query';

interface ApprovedTalentListProps {
  talents: TalentData[];
  onDelete: (talent: TalentData) => void;
}

const getInitials = (name: string) =>
  name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);

const AVATAR_COLORS = [
  'bg-emerald-100 text-emerald-800',
  'bg-amber-100 text-amber-800',
  'bg-violet-100 text-violet-800',
  'bg-sky-100 text-sky-800',
  'bg-orange-100 text-orange-800',
  'bg-rose-100 text-rose-800',
];

const avatarColor = (name: string) =>
  AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

const ApprovedTalentList = ({ talents, onDelete }: ApprovedTalentListProps) => {
  const [selectedTalent, setSelectedTalent] = useState<TalentData | null>(null);
  const [resendingId, setResendingId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const handleResendInvite = async (talent: TalentData) => {
    setResendingId(talent.id);
    const result = await supabase.functions.invoke('invite-talent', {
      body: { application_id: talent.id },
    });
    setResendingId(null);
    if (result.error || result.data?.error) {
      toast({
        title: "Resend failed",
        description: result.error?.message ?? String(result.data?.error),
        variant: "destructive",
      });
    } else {
      queryClient.invalidateQueries({ queryKey: ['talent_applications'] });
      toast({ title: "Invite sent", description: `Setup link sent to ${talent.email}.` });
    }
  };

  if (talents.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm py-16 text-center">
        <CheckSquare className="h-8 w-8 text-slate-300 mx-auto mb-3" />
        <p className="text-slate-500 text-sm font-medium">No approved talent yet</p>
        <p className="text-slate-400 text-xs mt-1">Approved applicants will appear here</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            {talents.length} talent{talents.length !== 1 ? 's' : ''} in pool
          </p>
          <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            Active
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                <th className="px-5 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Talent</th>
                <th className="px-5 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Specialization</th>
                <th className="px-5 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Location</th>
                <th className="px-5 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Contact</th>
                <th className="px-5 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-right text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {talents.map((talent) => (
                <tr key={talent.id} className="hover:bg-amber-50/30 transition-colors group">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${avatarColor(talent.name)}`}>
                        {getInitials(talent.name)}
                      </div>
                      <span className="text-sm font-medium text-slate-800">{talent.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full font-medium">
                      {talent.category}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-600">{talent.location}</td>
                  <td className="px-5 py-3.5 text-xs text-slate-500">{talent.email}</td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Approved
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      {talent.userId === null && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-3 text-xs text-slate-600 hover:text-blue-700 hover:bg-blue-50 gap-1.5"
                          onClick={() => handleResendInvite(talent)}
                          disabled={resendingId === talent.id}
                          title="Resend setup link"
                        >
                          <Mail className="h-3.5 w-3.5" />
                          {resendingId === talent.id ? 'Sending…' : 'Resend invite'}
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-3 text-xs text-slate-600 hover:text-amber-700 hover:bg-amber-50 gap-1.5"
                        onClick={() => setSelectedTalent(talent)}
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        Profile
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-3 text-xs text-slate-400 hover:text-rose-600 hover:bg-rose-50 gap-1.5"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove from talent pool?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This permanently removes <strong>{talent.name}</strong> from the talent pool, including their resume file. This cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              onClick={() => onDelete(talent)}
                            >
                              Remove
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedTalent && (
        <TalentProfileModal
          talent={selectedTalent}
          isOpen={!!selectedTalent}
          onClose={() => setSelectedTalent(null)}
        />
      )}
    </>
  );
};

export default ApprovedTalentList;
