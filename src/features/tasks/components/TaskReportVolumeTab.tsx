import React from 'react';
import { TaskSummaryReportData } from '@/api/types/task.types';

interface TaskReportVolumeTabProps {
  summaryReport: TaskSummaryReportData | null;
}

export const TaskReportVolumeTab: React.FC<TaskReportVolumeTabProps> = ({ summaryReport }) => {
  if (!summaryReport) return null;

  const totalTasks = summaryReport.totalTasks ?? 0;
  const completedTasks = summaryReport.completedTasks ?? 0;
  const completionPercentage = summaryReport.completionPercentage ?? (totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Total Tasks</div>
          <div className="text-3xl font-bold text-slate-900 mt-1">{totalTasks}</div>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Completed Deliverables</div>
          <div className="text-3xl font-bold text-emerald-600 mt-1">{completedTasks}</div>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Completion Rate</div>
          <div className="text-3xl font-bold text-brand-primary mt-1">{completionPercentage}%</div>
        </div>
      </div>

      {/* Status & Priority Matrices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">By Workflow Status</h3>
          <div className="space-y-2">
            {Object.entries(summaryReport.statusCounts || summaryReport.byStatus || {}).length === 0 ? (
              <div className="py-4 text-center text-xs text-slate-400">No status data available</div>
            ) : (
              Object.entries(summaryReport.statusCounts || summaryReport.byStatus || {}).map(([st, cnt]) => (
                <div key={st} className="flex items-center justify-between p-2 rounded hover:bg-slate-50 border-b border-slate-100 text-xs">
                  <span className="font-medium text-slate-700">{st.replace('_', ' ')}</span>
                  <span className="font-bold text-slate-900">{cnt}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">By Priority Level</h3>
          <div className="space-y-2">
            {Object.entries(summaryReport.priorityCounts || summaryReport.byPriority || {}).length === 0 ? (
              <div className="py-4 text-center text-xs text-slate-400">No priority data available</div>
            ) : (
              Object.entries(summaryReport.priorityCounts || summaryReport.byPriority || {}).map(([pr, cnt]) => (
                <div key={pr} className="flex items-center justify-between p-2 rounded hover:bg-slate-50 border-b border-slate-100 text-xs">
                  <span className="font-medium text-slate-700">{pr}</span>
                  <span className="font-bold text-slate-900">{cnt}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
