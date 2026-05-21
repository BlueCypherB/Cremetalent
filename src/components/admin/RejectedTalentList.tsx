import { TalentData } from '@/types/talent';
import { Button } from "@/components/ui/button";
import { Trash2, XSquare } from 'lucide-react';
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

interface RejectedTalentListProps {
  talents: TalentData[];
  onDelete: (talent: TalentData) => void;
}

const getInitials = (name: string) =>
  name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);

const RejectedTalentList = ({ talents, onDelete }: RejectedTalentListProps) => {
  if (talents.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm py-16 text-center">
        <XSquare className="h-8 w-8 text-slate-300 mx-auto mb-3" />
        <p className="text-slate-500 text-sm font-medium">No rejected applications</p>
        <p className="text-slate-400 text-xs mt-1">Rejected applicants will be archived here</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
          {talents.length} archived record{talents.length !== 1 ? 's' : ''}
        </p>
        <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
          Archived
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100">
              <th className="px-5 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Applicant</th>
              <th className="px-5 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Specialization</th>
              <th className="px-5 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Experience</th>
              <th className="px-5 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Rejection Reason</th>
              <th className="px-5 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Status</th>
              <th className="px-5 py-3 text-right text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {talents.map((talent) => (
              <tr key={talent.id} className="hover:bg-slate-50/60 transition-colors group">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 flex-shrink-0">
                      {getInitials(talent.name)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">{talent.name}</p>
                      <p className="text-[11px] text-slate-400">{talent.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                    {talent.category}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-sm text-slate-500">{talent.experience}</td>
                <td className="px-5 py-3.5 max-w-xs">
                  {talent.notes ? (
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{talent.notes}</p>
                  ) : (
                    <span className="text-xs text-slate-300 italic">No reason provided</span>
                  )}
                </td>
                <td className="px-5 py-3.5">
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-rose-50 text-rose-600 border border-rose-100">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                    Rejected
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex justify-end">
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
                          <AlertDialogTitle>Delete this record?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This permanently removes <strong>{talent.name}</strong>'s record. This cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() => onDelete(talent)}
                          >
                            Delete
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
  );
};

export default RejectedTalentList;
