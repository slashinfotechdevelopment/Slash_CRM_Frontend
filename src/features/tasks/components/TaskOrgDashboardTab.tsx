import React from 'react';
import { OrgDashboardData } from '@/api/types/task.types';

interface TaskOrgDashboardTabProps {
  orgData: OrgDashboardData | null;
}

export const TaskOrgDashboardTab: React.FC<TaskOrgDashboardTabProps> = ({ orgData }) => {
  if (!orgData) return null;

  const totalTasks = orgData.totalTasks ?? 0;
  const completedTasks = orgData.statusCounts?.COMPLETED ?? 0;
  const completionPercentage = orgData.completionPercentage ?? (totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0);
  const overdueCount = orgData.slaMetrics?.overdueTasks ?? orgData.overdueCount ?? 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Enterprise Tasks</div>
          <div className="text-3xl font-bold text-slate-900 mt-1">{totalTasks}</div>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Completion Rate</div>
          <div className="text-3xl font-bold text-emerald-600 mt-1">{completionPercentage}%</div>
        </div>
        <div className="bg-white border border-rose-200 bg-rose-50/20 p-4 rounded-xl shadow-xs">
          <div className="text-xs font-semibold text-rose-600 uppercase">Overdue SLA Breaches</div>
          <div className="text-3xl font-bold text-rose-600 mt-1">{overdueCount}</div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200">
          <h3 className="text-sm font-bold text-slate-900">Department Deliverables Matrix</h3>
        </div>
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
            <tr>
              <th className="p-3">Department</th>
              <th className="p-3">Total Tasks</th>
              <th className="p-3">Completed</th>
              <th className="p-3">Throughput Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orgData.departmentDistribution?.map((d) => {
              const total = d.totalTasks ?? d.taskCount ?? 0;
              const completed = d.completedTasks ?? d.completedCount ?? 0;
              const rate = d.completionPercentage ?? (total > 0 ? Math.round((completed / total) * 100) : 0);
              return (
                <tr key={d.departmentId} className="hover:bg-slate-50/50">
                  <td className="p-3 font-semibold text-slate-800">{d.departmentName}</td>
                  <td className="p-3 font-semibold">{total}</td>
                  <td className="p-3 text-emerald-600 font-semibold">{completed}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${rate}%` }} />
                      </div>
                      <span className="font-semibold">{rate}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
