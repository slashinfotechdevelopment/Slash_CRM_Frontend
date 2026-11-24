import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@/components/templates/DataTable';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { TaskItem, ActiveTimerResponse } from '@/api/types/task.types';
import { Play, Pause, Eye } from 'lucide-react';
import { formatDate } from '@/utils/formatters';

interface UseMyTaskColumnsOptions {
  activeTimer: ActiveTimerResponse | null;
  onOpenPause: () => void;
  onResumeTimer: () => void;
  onPlayTimer: (task: TaskItem) => void;
}

export function useMyTaskColumns({
  activeTimer,
  onOpenPause,
  onResumeTimer,
  onPlayTimer,
}: UseMyTaskColumnsOptions): ColumnDef<TaskItem>[] {
  const navigate = useNavigate();

  return [
    {
      header: 'Task Code & Title',
      cell: (item) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              {item.taskCode}
            </span>
            {item.priority === 'URGENT' && <Badge variant="danger">Urgent</Badge>}
            {item.priority === 'HIGH' && <Badge variant="warning">High</Badge>}
            {item.priority === 'MEDIUM' && <Badge variant="neutral">Medium</Badge>}
            {item.priority === 'LOW' && <Badge variant="success">Low</Badge>}
          </div>
          <div
            className="font-medium text-slate-900 hover:text-brand-primary cursor-pointer line-clamp-1"
            onClick={() => navigate(`/tasks/${item.id}`)}
          >
            {item.title}
          </div>
        </div>
      ),
    },
    {
      header: 'Status',
      cell: (item) => {
        const isCurrentActive = activeTimer?.task?.id === item.id;
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <Badge
                variant={
                  item.status === 'COMPLETED'
                    ? 'success'
                    : item.status === 'IN_PROGRESS'
                    ? 'accent'
                    : item.status === 'IN_REVIEW'
                    ? 'warning'
                    : 'neutral'
                }
              >
                {item.status.replace('_', ' ')}
              </Badge>
              {isCurrentActive && activeTimer.isRunning && (
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              )}
            </div>
            {item.progress > 0 && item.status !== 'COMPLETED' && (
              <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-brand-primary h-1.5 rounded-full"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            )}
          </div>
        );
      },
    },
    {
      header: 'Due Date',
      cell: (item) => (
        <div className="text-xs text-slate-600">
          {formatDate(item.dueDate)}
        </div>
      ),
    },
    {
      header: 'Timer Actions',
      cell: (item) => {
        const isRunning = activeTimer?.isRunning && activeTimer?.task?.id === item.id;
        const isPaused = activeTimer?.isPaused && activeTimer?.task?.id === item.id;

        if (item.status === 'COMPLETED' || item.status === 'CANCELLED') {
          return <span className="text-xs text-slate-400 italic">Closed</span>;
        }

        return (
          <div className="flex items-center gap-1.5">
            {isRunning ? (
              <Button
                size="sm"
                variant="outline"
                onClick={onOpenPause}
                className="text-amber-600 border-amber-200 hover:bg-amber-50 flex items-center gap-1 px-2.5 py-1 text-xs"
              >
                <Pause className="w-3.5 h-3.5" /> Pause
              </Button>
            ) : isPaused ? (
              <Button
                size="sm"
                variant="primary"
                onClick={onResumeTimer}
                className="flex items-center gap-1 px-2.5 py-1 text-xs"
              >
                <Play className="w-3.5 h-3.5" /> Resume
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onPlayTimer(item)}
                className="text-brand-primary hover:bg-slate-50 flex items-center gap-1 px-2.5 py-1 text-xs"
              >
                <Play className="w-3.5 h-3.5" /> Start Timer
              </Button>
            )}

            <Button
              size="sm"
              variant="ghost"
              onClick={() => navigate(`/tasks/${item.id}`)}
              title="View Details"
            >
              <Eye className="w-4 h-4 text-slate-400" />
            </Button>
          </div>
        );
      },
    },
  ];
}
