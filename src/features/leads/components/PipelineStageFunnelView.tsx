import React from 'react';
import { formatCurrency } from '@/utils/formatters';

export interface FunnelStageItem {
  id: string;
  name: string;
  code: string;
  color: string;
  count: number;
  value: number;
}

interface PipelineStageFunnelViewProps {
  totalFunnelLeads: number;
  totalFunnelValue: number;
  funnelStages: FunnelStageItem[];
}

export const PipelineStageFunnelView: React.FC<PipelineStageFunnelViewProps> = ({
  totalFunnelLeads,
  totalFunnelValue,
  funnelStages,
}) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-neutral-200/80 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-neutral-800">Pipeline Funnel Distribution</h3>
        <span className="text-xs text-neutral-500 font-mono">
          Reconciled: {totalFunnelLeads} leads • {formatCurrency(totalFunnelValue, 'INR')}
        </span>
      </div>
      <div className="space-y-3">
        {funnelStages.map((st) => {
          const pct = totalFunnelLeads > 0 ? Math.round((st.count / totalFunnelLeads) * 100) : 0;

          return (
            <div key={st.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-neutral-800">{st.name}</span>
                  <span className="text-[11px] text-neutral-400">({st.count} leads • {pct}%)</span>
                </div>
                <span className="font-semibold text-neutral-700">{formatCurrency(st.value, 'INR')}</span>
              </div>
              <div className="w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-600 transition-all duration-500 rounded-full"
                  style={{ width: `${Math.max(st.count > 0 ? 8 : 2, pct)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
