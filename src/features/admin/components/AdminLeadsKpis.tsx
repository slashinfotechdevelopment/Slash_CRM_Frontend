import React from 'react';
import { AdminLeadsSummaryResponse } from '@/api/types/admin.types';

interface AdminLeadsKpisProps {
  summary: AdminLeadsSummaryResponse | null;
}

export const AdminLeadsKpis: React.FC<AdminLeadsKpisProps> = ({ summary }) => {
  const conversionRate = summary?.conversionRatePercentage ?? 0;
  const newLeads = summary?.newLeads ?? 0;
  const convertedLeads = summary?.convertedLeads ?? 0;
  const lostLeads = summary?.lostLeads ?? 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-sm">
        <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block">
          Acquired Leads
        </span>
        <div className="text-2xl font-extrabold text-neutral-900 mt-1">
          {newLeads}
        </div>
        <span className="text-xs text-neutral-400 mt-1 block">Created in date window</span>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-sm">
        <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block">
          Converted Opportunities
        </span>
        <div className="text-2xl font-extrabold text-emerald-600 mt-1">
          {convertedLeads}
        </div>
        <span className="text-xs text-emerald-600/70 mt-1 block">Successfully closed</span>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-sm">
        <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block">
          Conversion Win Rate
        </span>
        <div className="text-2xl font-extrabold text-brand-primary mt-1">
          {conversionRate}%
        </div>
        <span className="text-xs text-neutral-400 mt-1 block">Won / Total leads</span>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-sm">
        <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block">
          Lost / Closed Leads
        </span>
        <div className="text-2xl font-extrabold text-neutral-700 mt-1">
          {lostLeads}
        </div>
        <span className="text-xs text-neutral-400 mt-1 block">Unconverted accounts</span>
      </div>
    </div>
  );
};
