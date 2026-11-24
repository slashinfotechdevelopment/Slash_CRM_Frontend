import React from 'react';
import { EmployeeDashboardData } from '@/api/types/task.types';
import { CheckCircle2, Clock, AlertTriangle, Calendar } from 'lucide-react';
import { formatDate } from '@/utils/formatters';

interface TaskMyDashboardTabProps {
  empData: EmployeeDashboardData | null;
}

export const TaskMyDashboardTab: React.FC<TaskMyDashboardTabProps> = ({ empData }) => {
  if (!empData) return null;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase">
            <span>My Assigned Tasks</span>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-3xl font-bold text-slate-900 mt-1">{empData.assignedTasks || 0}</div>
          <div className="text-xs text-slate-400 mt-1">Pending Deliverables</div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase">
            <span>Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-bold text-emerald-600 mt-1">
            {empData.statusCounts?.COMPLETED || 0}
          </div>
          <div className="text-xs text-emerald-600/70 mt-1">Turned in deliverables</div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase">
            <span>Overdue Breaches</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-3xl font-bold text-rose-600 mt-1">
            {empData.deadlines?.overdueTasks || 0}
          </div>
          <div className="text-xs text-rose-500/70 mt-1">Needs urgent attention</div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase">
            <span>Upcoming</span>
            <Calendar className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-3xl font-bold text-slate-900 mt-1">
            {empData.deadlines?.upcomingTasks || 0}
          </div>
          <div className="text-xs text-slate-400 mt-1">Due in coming days</div>
        </div>
      </div>

      {/* Status Breakdown Grid */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Status Breakdown
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {Object.entries(empData.statusCounts || {}).map(([st, cnt]) => (
            <div key={st} className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
              <div className="text-xs font-medium text-slate-500 uppercase tracking-tight">{st.replace('_', ' ')}</div>
              <div className="text-xl font-bold text-slate-900 mt-1">{String(cnt)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Today's Telemetry & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Today's Timer Telemetry
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-xs text-slate-500 block">Working Hours</span>
              <span className="text-2xl font-bold text-slate-900">{empData.timerTelemetry?.todayWorkingHours || 0} hrs</span>
            </div>
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-xs text-slate-500 block">Pause Duration</span>
              <span className="text-2xl font-bold text-slate-900">{empData.timerTelemetry?.todayPausedHours || 0} hrs</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Recent Activity
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {empData.recentActivity?.length === 0 ? (
              <div className="text-xs text-slate-400 italic">No recent activity.</div>
            ) : (
              empData.recentActivity?.map((act: { id: string; taskCode: string; action: string; createdAt: string }) => (
                <div key={act.id} className="text-xs flex items-center justify-between p-2 rounded hover:bg-slate-50 border-b border-slate-100">
                  <div>
                    <span className="font-semibold text-slate-800">{act.taskCode}</span>: {act.action}
                  </div>
                  <span className="text-slate-400">{formatDate(act.createdAt)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
