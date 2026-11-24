import React from 'react';
import { TeamDashboardData } from '@/api/types/task.types';
import { Badge } from '@/components/ui/Badge';

interface TaskTeamDashboardTabProps {
  teamData: TeamDashboardData | null;
}

export const TaskTeamDashboardTab: React.FC<TaskTeamDashboardTabProps> = ({ teamData }) => {
  if (!teamData) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Team Tasks Volume</div>
          <div className="text-3xl font-bold text-slate-900 mt-1">{teamData.totalTasks}</div>
        </div>
        <div className="bg-white border border-rose-200 bg-rose-50/20 p-4 rounded-xl shadow-xs">
          <div className="text-xs font-semibold text-rose-600 uppercase">Team Overdue</div>
          <div className="text-3xl font-bold text-rose-600 mt-1">{teamData.deadlines?.overdueTasks || 0}</div>
        </div>
        <div className="bg-white border border-amber-200 bg-amber-50/20 p-4 rounded-xl shadow-xs">
          <div className="text-xs font-semibold text-amber-600 uppercase">Due Today</div>
          <div className="text-3xl font-bold text-amber-600 mt-1">{teamData.deadlines?.dueTodayTasks || 0}</div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200">
          <h3 className="text-sm font-bold text-slate-900">Live Active Timer Roster</h3>
          <p className="text-xs text-slate-500">Real-time view of what team members are currently working on.</p>
        </div>
        {teamData.activeTimerRoster?.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 italic">
            No active timers running in your team right now.
          </div>
        ) : (
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="p-3">Team Member</th>
                <th className="p-3">Current Task</th>
                <th className="p-3">Status</th>
                <th className="p-3">Elapsed Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {teamData.activeTimerRoster?.map((m) => (
                <tr key={m.userId} className="hover:bg-slate-50/50">
                  <td className="p-3">
                    <span className="font-semibold text-slate-800">{m.userName}</span>
                    <span className="text-slate-400 block font-mono text-[10px]">{m.userCode}</span>
                  </td>
                  <td className="p-3">
                    <span className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded font-semibold text-slate-600 mr-2">{m.taskCode}</span>
                    <span className="text-slate-800">{m.taskTitle}</span>
                  </td>
                  <td className="p-3">
                    <Badge variant={m.status === 'RUNNING' ? 'success' : 'warning'}>
                      {m.status}
                    </Badge>
                  </td>
                  <td className="p-3 font-mono font-semibold">
                    {Math.floor(m.elapsedSeconds / 3600)}h {Math.floor((m.elapsedSeconds % 3600) / 60)}m
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
