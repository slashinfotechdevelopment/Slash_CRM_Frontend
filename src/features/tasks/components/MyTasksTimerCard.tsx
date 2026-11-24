import React from 'react';
import { Button } from '@/components/ui/Button';
import { ActiveTimerResponse, TaskTimeSummary } from '@/api/types/task.types';
import { Play, Pause, Square, Clock } from 'lucide-react';

interface MyTasksTimerCardProps {
  activeTimer: ActiveTimerResponse | null;
  timeSummary: TaskTimeSummary | null;
  elapsedDisplay: number;
  formatDuration: (sec: number) => string;
  onPauseClick: () => void;
  onResume: (taskId: string) => void;
  onStopClick: () => void;
}

export const MyTasksTimerCard: React.FC<MyTasksTimerCardProps> = ({
  activeTimer,
  timeSummary,
  elapsedDisplay,
  formatDuration,
  onPauseClick,
  onResume,
  onStopClick,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Active Timer Card */}
      <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`inline-block w-2.5 h-2.5 rounded-full ${
                activeTimer?.isRunning
                  ? 'bg-emerald-500 animate-pulse'
                  : activeTimer?.isPaused
                  ? 'bg-amber-500'
                  : 'bg-slate-300'
              }`}
            />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {activeTimer?.isRunning
                ? 'Timer Running'
                : activeTimer?.isPaused
                ? 'Timer Paused'
                : 'No Active Timer'}
            </span>
          </div>

          {activeTimer?.task ? (
            <div className="mt-2">
              <h3 className="font-semibold text-slate-900 text-sm sm:text-base">
                {activeTimer.task.title}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Task Code:{' '}
                <span className="font-mono font-medium text-slate-700">
                  {activeTimer.task.taskCode}
                </span>{' '}
                {activeTimer.isPaused && activeTimer.activePause && (
                  <span className="text-amber-600 font-medium ml-2">
                    Paused: {activeTimer.activePause.reason.replace(/_/g, ' ')}
                  </span>
                )}
              </p>
            </div>
          ) : (
            <p className="text-xs text-slate-500 mt-2">
              Select a task from your queue below to start logging billable hours.
            </p>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-2xl sm:text-3xl font-mono font-bold text-slate-900">
              {formatDuration(elapsedDisplay)}
            </div>
            <div className="text-xs text-slate-400">Current Session</div>
          </div>

          {activeTimer?.task && (
            <div className="flex items-center gap-2">
              {activeTimer.isRunning && (
                <Button variant="outline" size="sm" onClick={onPauseClick}>
                  <Pause className="w-4 h-4 mr-1 text-amber-600" /> Pause
                </Button>
              )}
              {activeTimer.isPaused && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onResume(activeTimer.task!.id)}
                >
                  <Play className="w-4 h-4 mr-1" /> Resume
                </Button>
              )}
              <Button variant="danger" size="sm" onClick={onStopClick}>
                <Square className="w-4 h-4 mr-1" /> Stop
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Telemetry Summary Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-slate-500 uppercase font-semibold">
          <span>Today's Work Telemetry</span>
          <Clock className="w-4 h-4 text-slate-400" />
        </div>
        <div className="grid grid-cols-2 gap-4 mt-3">
          <div>
            <div className="text-xl font-bold text-slate-900">
              {timeSummary ? `${Math.round(timeSummary.totalWorkingHours * 10) / 10} hrs` : '0 hrs'}
            </div>
            <div className="text-xs text-slate-400">Total Logged</div>
          </div>
          <div>
            <div className="text-xl font-bold text-amber-600">
              {timeSummary ? `${Math.round((timeSummary.totalPauseHours || 0) * 10) / 10} hrs` : '0 hrs'}
            </div>
            <div className="text-xs text-slate-400">Total Paused</div>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Daily Breakdown Sessions:</span>
          <span className="font-bold text-slate-800">
            {timeSummary?.dailyBreakdown?.length ?? 0}
          </span>
        </div>
      </div>
    </div>
  );
};
