import React from 'react';

interface AdminTasksSummaryCardsProps {
  totalTasks: number;
  totalCompleted: number;
  totalPending: number;
  totalOverdue: number;
  orgCompletionRate: number;
}

export const AdminTasksSummaryCards: React.FC<AdminTasksSummaryCardsProps> = ({
  totalTasks,
  totalCompleted,
  totalPending,
  totalOverdue,
  orgCompletionRate,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-sm">
        <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block">
          Organization Tasks
        </span>
        <div className="text-2xl font-extrabold text-neutral-900 mt-1">{totalTasks}</div>
        <span className="text-xs text-neutral-400 mt-1 block">Excluding cancelled</span>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-sm">
        <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block">
          Turned In Deliverables
        </span>
        <div className="text-2xl font-extrabold text-emerald-600 mt-1">{totalCompleted}</div>
        <span className="text-xs text-emerald-600/70 mt-1 block">Successfully completed</span>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-sm">
        <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block">
          In-Flight Work
        </span>
        <div className="text-2xl font-extrabold text-neutral-800 mt-1">{totalPending}</div>
        <span className="text-xs text-neutral-400 mt-1 block">TODO & In Progress</span>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-sm">
        <span className="text-[11px] font-semibold text-rose-600 uppercase tracking-wider block">
          SLA Breaches
        </span>
        <div className="text-2xl font-extrabold text-rose-600 mt-1">{totalOverdue}</div>
        <span className="text-xs text-rose-500 mt-1 block">Past deadline</span>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-sm">
        <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block">
          Throughput Rate
        </span>
        <div className="text-2xl font-extrabold text-brand-primary mt-1">{orgCompletionRate}%</div>
        <span className="text-xs text-neutral-400 mt-1 block">Completion efficiency</span>
      </div>
    </div>
  );
};
