import TalentCard from '@/components/talent/TalentCard';
import { Skeleton } from "@/components/ui/skeleton";
import { TalentData } from '@/types/talent';
import { Users, Search } from 'lucide-react';

interface TalentResultsProps {
  filteredTalent: TalentData[];
  isLoading?: boolean;
  totalCount?: number;
}

const CardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
    <div className="h-0.5 w-full bg-slate-100" />
    <div className="p-5 pb-4">
      <div className="flex items-start gap-3">
        <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2 pt-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <div className="flex gap-1.5 mt-3">
        <Skeleton className="h-6 w-28 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    </div>
    <div className="h-px bg-slate-100 mx-5" />
    <div className="px-5 pt-4 pb-3 space-y-2">
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-3/4" />
    </div>
    <div className="px-5 pb-5 space-y-3">
      <div className="flex gap-1.5">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-5 w-14 rounded-full" />
      </div>
      <Skeleton className="h-3 w-28" />
      <Skeleton className="h-9 w-full rounded-lg mt-2" />
    </div>
  </div>
);

const TalentResults = ({ filteredTalent, isLoading = false, totalCount }: TalentResultsProps) => {
  if (isLoading) {
    return (
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-5">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-8 w-28 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  const hasSortedByMatch = filteredTalent.some(t => (t.matchScore ?? 0) > 0);
  const sorted = hasSortedByMatch
    ? [...filteredTalent].sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0))
    : filteredTalent;

  return (
    <div className="flex-1 min-w-0">
      {/* Results header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-slate-400" />
          <span className="text-sm text-slate-600">
            <strong className="text-slate-900 font-semibold">{filteredTalent.length}</strong>
            {totalCount && filteredTalent.length !== totalCount
              ? ` of ${totalCount} professionals`
              : ` professional${filteredTalent.length !== 1 ? 's' : ''}`}
          </span>
          {hasSortedByMatch && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
              sorted by match
            </span>
          )}
        </div>
      </div>

      {/* Grid */}
      {sorted.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {sorted.map(talentItem => (
            <TalentCard key={talentItem.id} talent={talentItem} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm py-20 text-center">
          <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <Search className="h-6 w-6 text-slate-300" />
          </div>
          <h3 className="text-base font-semibold text-slate-700 mb-1">No results found</h3>
          <p className="text-sm text-slate-400 max-w-xs mx-auto leading-relaxed">
            Try adjusting your filters or search terms to discover more creative professionals.
          </p>
        </div>
      )}
    </div>
  );
};

export default TalentResults;
