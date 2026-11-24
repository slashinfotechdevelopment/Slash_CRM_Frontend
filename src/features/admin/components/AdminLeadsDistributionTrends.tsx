import React from 'react';
import { AdminLeadsSummaryResponse, LeadTrendPoint } from '@/api/types/admin.types';

interface AdminLeadsDistributionTrendsProps {
  summary: AdminLeadsSummaryResponse | null;
  trend: LeadTrendPoint[];
}

export const AdminLeadsDistributionTrends: React.FC<AdminLeadsDistributionTrendsProps> = ({
  summary,
  trend,
}) => {
  return (
    <>
      {summary && summary.countByStage && summary.countByStage.length > 0 && (
        <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-neutral-900 text-sm">Pipeline Progression Distribution</h2>
            <span className="text-xs text-neutral-500">Active CRM stages</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {summary.countByStage.map((st) => (
              <div
                key={st.stageId}
                className="p-3 rounded-lg border border-neutral-200/80 bg-neutral-50/50 flex flex-col justify-between"
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: st.color || 'var(--color-info)' }}
                  />
                  <span className="text-xs font-semibold text-neutral-700 truncate" title={st.stageName}>
                    {st.stageName}
                  </span>
                </div>
                <div className="text-xl font-bold text-neutral-900 mt-2 font-mono">
                  {st.count}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lead Creation vs Conversion Time-series Bar Chart */}
      <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-neutral-900 text-sm">Acquisition vs Conversion Trend</h2>
            <p className="text-xs text-neutral-500 mt-0.5">Daily time-series comparison</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-primary-500" />
              <span className="text-neutral-600">New Leads</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-emerald-500" />
              <span className="text-neutral-600">Converted</span>
            </div>
          </div>
        </div>

        {trend.length === 0 ? (
          <div className="p-8 text-center text-xs text-neutral-400">
            No time-series lead movements in the selected window.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="flex items-end gap-2 h-44 pt-6 pb-2 min-w-[500px]">
              {trend.map((pt, idx) => {
                const maxVal = Math.max(
                  1,
                  ...trend.map((p) => Math.max(p.newLeads, p.convertedLeads))
                );
                const newHeight = Math.round((pt.newLeads / maxVal) * 110);
                const convHeight = Math.round((pt.convertedLeads / maxVal) * 110);
                const dateLabel = pt.period || pt.date || '';

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full">
                    <div className="w-full flex items-end justify-center gap-1 mb-1">
                      <div
                        style={{ height: `${Math.max(4, newHeight)}px` }}
                        className="w-3 sm:w-4 bg-primary-500 rounded-t-xs transition-all hover:bg-primary-600"
                        title={`New Leads: ${pt.newLeads}`}
                      />
                      <div
                        style={{ height: `${Math.max(4, convHeight)}px` }}
                        className="w-3 sm:w-4 bg-emerald-500 rounded-t-xs transition-all hover:bg-emerald-600"
                        title={`Converted: ${pt.convertedLeads}`}
                      />
                    </div>
                    <span className="text-[10px] text-neutral-400 font-mono truncate max-w-[40px]">
                      {dateLabel.length > 5 ? dateLabel.slice(5) : dateLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
