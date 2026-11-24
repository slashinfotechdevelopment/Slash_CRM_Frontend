import React from 'react';
import { Target, Layers, TrendingUp, Award } from 'lucide-react';
import { LeadMetricsSummary, LeadItem } from '@/api/types/lead.types';
import { formatCurrency } from '@/utils/formatters';

interface PipelineFunnelCardsProps {
  totalFunnelValue: number;
  totalFunnelLeads: number;
  summary: LeadMetricsSummary | null;
  leads: LeadItem[];
}

export const PipelineFunnelCards: React.FC<PipelineFunnelCardsProps> = ({
  totalFunnelValue,
  totalFunnelLeads,
  summary,
  leads,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white p-5 rounded-xl border border-neutral-200/80 shadow-xs">
        <div className="flex items-center justify-between text-neutral-500 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Total Pipeline Value</span>
          <Target className="w-4 h-4 text-primary-600" />
        </div>
        <div className="text-2xl font-bold text-neutral-900">
          {formatCurrency(totalFunnelValue, 'INR')}
        </div>
        <p className="text-[11px] text-neutral-400 mt-1">Across all qualified opportunities</p>
      </div>

      <div className="bg-white p-5 rounded-xl border border-neutral-200/80 shadow-xs">
        <div className="flex items-center justify-between text-neutral-500 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Active Prospects</span>
          <Layers className="w-4 h-4 text-emerald-600" />
        </div>
        <div className="text-2xl font-bold text-neutral-900">
          {totalFunnelLeads}
        </div>
        <p className="text-[11px] text-neutral-400 mt-1">Total active deal flow</p>
      </div>

      <div className="bg-white p-5 rounded-xl border border-neutral-200/80 shadow-xs">
        <div className="flex items-center justify-between text-neutral-500 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Conversion Rate</span>
          <TrendingUp className="w-4 h-4 text-amber-600" />
        </div>
        <div className="text-2xl font-bold text-emerald-600">
          {summary?.conversionRate != null ? `${summary.conversionRate}%` : '0%'}
        </div>
        <p className="text-[11px] text-neutral-400 mt-1">Lead-to-won closure velocity</p>
      </div>

      <div className="bg-white p-5 rounded-xl border border-neutral-200/80 shadow-xs">
        <div className="flex items-center justify-between text-neutral-500 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Won Accounts</span>
          <Award className="w-4 h-4 text-indigo-600" />
        </div>
        <div className="text-2xl font-bold text-neutral-900">
          {summary?.wonLeads ?? leads.filter((l) => l.status === 'CONVERTED').length}
        </div>
        <p className="text-[11px] text-neutral-400 mt-1">Successful deal executions</p>
      </div>
    </div>
  );
};
