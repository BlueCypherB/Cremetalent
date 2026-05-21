import { Clock, CheckCircle2, XCircle } from 'lucide-react';

interface AdminDashboardStatsProps {
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
}

const StatCard = ({
  label,
  description,
  count,
  icon: Icon,
  colorClasses,
}: {
  label: string;
  description: string;
  count: number;
  icon: React.ElementType;
  colorClasses: {
    iconBg: string;
    iconText: string;
    countText: string;
    accent: string;
    badge?: string;
  };
}) => (
  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
    <div className={`h-1 w-full ${colorClasses.accent}`} />
    <div className="p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="text-xs text-slate-400 mt-0.5">{description}</p>
        </div>
        <div className={`p-2.5 rounded-lg ${colorClasses.iconBg}`}>
          <Icon className={`h-4 w-4 ${colorClasses.iconText}`} />
        </div>
      </div>
      <div className="flex items-end gap-2">
        <span className={`text-4xl font-bold tabular-nums leading-none ${colorClasses.countText}`}>
          {count}
        </span>
        {colorClasses.badge && count > 0 && (
          <span className={`text-xs font-medium mb-0.5 ${colorClasses.badge}`}>
            needs review
          </span>
        )}
      </div>
    </div>
  </div>
);

const AdminDashboardStats = ({ pendingCount, approvedCount, rejectedCount }: AdminDashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      <StatCard
        label="Pending Review"
        description="Awaiting your decision"
        count={pendingCount}
        icon={Clock}
        colorClasses={{
          accent: 'bg-amber-400',
          iconBg: 'bg-amber-50',
          iconText: 'text-amber-600',
          countText: pendingCount > 0 ? 'text-amber-600' : 'text-slate-800',
          badge: 'text-amber-500',
        }}
      />
      <StatCard
        label="Approved Talent"
        description="Active in the talent pool"
        count={approvedCount}
        icon={CheckCircle2}
        colorClasses={{
          accent: 'bg-emerald-400',
          iconBg: 'bg-emerald-50',
          iconText: 'text-emerald-600',
          countText: 'text-emerald-600',
        }}
      />
      <StatCard
        label="Rejected"
        description="Archived applications"
        count={rejectedCount}
        icon={XCircle}
        colorClasses={{
          accent: 'bg-rose-300',
          iconBg: 'bg-rose-50',
          iconText: 'text-rose-500',
          countText: 'text-slate-600',
        }}
      />
    </div>
  );
};

export default AdminDashboardStats;
