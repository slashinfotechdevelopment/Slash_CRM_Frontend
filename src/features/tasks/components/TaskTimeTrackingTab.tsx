import React from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { TaskTimeEntry, TaskTimeSummary } from '@/api/types/task.types';
import { Play, Pause, Square } from 'lucide-react';
import { formatDate } from '@/utils/formatters';

interface TaskTimeTrackingTabProps {
  timeSummary: TaskTimeSummary | null;
  timeEntries: TaskTimeEntry[];
  onPlay: () => void;
  onResume: () => void;
  onOpenPause: () => void;
  onOpenStop: () => void;
}

export const TaskTimeTrackingTab: React.FC<TaskTimeTrackingTabProps> = ({
  timeSummary,
  timeEntries,
  onPlay,
  onResume,
  onOpenPause,
  onOpenStop,
}) => {
  return (
    <div className="space-y-6">
      {timeSummary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
            <div className="text-xs font-semibold text-slate-500 uppercase">Total Working Hours</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">{timeSummary.totalWorkingHours} hrs</div>
            <div className="text-xs text-slate-400 mt-0.5">{Math.round(timeSummary.totalWorkingSeconds / 60)} minutes</div>
          </div>
          <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
            <div className="text-xs font-semibold text-slate-500 uppercase">Total Pause Duration</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              {timeSummary.totalPauseHours ?? Math.round(((timeSummary.totalPausedMinutes ?? 0) / 60) * 10) / 10} hrs
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              {Math.round((timeSummary.totalPauseSeconds ?? timeSummary.totalPausedSeconds ?? 0) / 60)} minutes
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-slate-900">Work Intervals & Pauses</h3>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={onPlay}>
              <Play className="w-3.5 h-3.5 mr-1" /> Start Timer
            </Button>
            <Button size="sm" variant="outline" onClick={onResume}>
              <Play className="w-3.5 h-3.5 mr-1" /> Resume
            </Button>
            <Button size="sm" variant="outline" onClick={onOpenPause}>
              <Pause className="w-3.5 h-3.5 mr-1" /> Pause
            </Button>
            <Button size="sm" variant="outline" onClick={onOpenStop}>
              <Square className="w-3.5 h-3.5 mr-1" /> Stop
            </Button>
          </div>
        </div>

        {timeEntries.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 italic">
            No time entries logged on this task yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="p-3">Started At</th>
                  <th className="p-3">Ended At</th>
                  <th className="p-3">Duration</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Logged By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {timeEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-50/50">
                    <td className="p-3 font-mono">{formatDate(entry.startedAt)}</td>
                    <td className="p-3 font-mono">
                      {entry.endedAt ? formatDate(entry.endedAt) : <Badge variant="accent">In Progress</Badge>}
                    </td>
                    <td className="p-3 font-semibold">{Number((entry.durationSeconds / 3600).toFixed(2))} hrs</td>
                    <td className="p-3">
                      <Badge
                        variant={
                          entry.status === 'RUNNING'
                            ? 'success'
                            : entry.status === 'PAUSED'
                            ? 'warning'
                            : 'neutral'
                        }
                      >
                        {entry.status}
                      </Badge>
                    </td>
                    <td className="p-3">{entry.user?.name || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
