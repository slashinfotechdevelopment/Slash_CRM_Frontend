import React from 'react';

interface AdminActivityCardsProps {
  onlineCount: number;
  totalPersonnel: number;
  totalSessionsInRange: number;
  totalHours: number;
}

export const AdminActivityCards: React.FC<AdminActivityCardsProps> = ({
  onlineCount,
  totalPersonnel,
  totalSessionsInRange,
  totalHours,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
            Live Personnel Online
          </span>
        </div>
        <div className="text-2xl font-extrabold text-neutral-900 mt-2">
          {onlineCount} <span className="text-sm font-normal text-neutral-400">/ {totalPersonnel}</span>
        </div>
        <span className="text-xs text-emerald-600 mt-1 block">Active web sessions right now</span>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-sm">
        <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block">
          Total Sessions Logged
        </span>
        <div className="text-2xl font-extrabold text-neutral-900 mt-2">
          {totalSessionsInRange}
        </div>
        <span className="text-xs text-neutral-400 mt-1 block">Across filtered date window</span>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-sm">
        <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block">
          Cumulative Work Hours
        </span>
        <div className="text-2xl font-extrabold text-neutral-900 mt-2">
          {totalHours} hrs
        </div>
        <span className="text-xs text-neutral-400 mt-1 block">Computed session telemetry</span>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-sm">
        <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block">
          Organization Headcount
        </span>
        <div className="text-2xl font-extrabold text-brand-primary mt-2">
          {totalPersonnel}
        </div>
        <span className="text-xs text-neutral-400 mt-1 block">Provisioned users</span>
      </div>
    </div>
  );
};
