import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/Badge';
import { TaskItem, TaskStatus, TaskPriority } from '@/api/types/task.types';
import { Calendar, UserCheck, Eye, Edit2 } from 'lucide-react';
import { formatDate } from '@/utils/formatters';

export const KANBAN_COLUMNS: { status: TaskStatus; label: string; color: string }[] = [
  { status: 'TODO', label: 'To Do', color: 'border-slate-300' },
  { status: 'IN_PROGRESS', label: 'In Progress', color: 'border-blue-400' },
  { status: 'ON_HOLD', label: 'On Hold', color: 'border-amber-400' },
  { status: 'IN_REVIEW', label: 'In Review', color: 'border-purple-400' },
  { status: 'REOPENED', label: 'Reopened', color: 'border-rose-400' },
  { status: 'COMPLETED', label: 'Completed', color: 'border-emerald-400' },
];

interface TaskKanbanBoardProps {
  tasks: TaskItem[];
  onOpenEdit: (task: TaskItem) => void;
  onOpenAssign: (task: TaskItem) => void;
}

export const TaskKanbanBoard: React.FC<TaskKanbanBoardProps> = ({
  tasks,
  onOpenEdit,
  onOpenAssign,
}) => {
  const navigate = useNavigate();
  const { isSuperAdmin, hasPermission } = useAuth();
  const canAssign = isSuperAdmin || hasPermission('tasks.assign');
  const canEdit = isSuperAdmin || hasPermission('tasks.update');

  const getPriorityBadge = (p: TaskPriority) => {
    switch (p) {
      case 'URGENT':
        return <Badge variant="danger">Urgent</Badge>;
      case 'HIGH':
        return <Badge variant="warning">High</Badge>;
      case 'MEDIUM':
        return <Badge variant="neutral">Medium</Badge>;
      case 'LOW':
      default:
        return <Badge variant="success">Low</Badge>;
    }
  };

  return (
    <div className="w-full overflow-x-auto pb-6 pt-1">
      <div className="inline-flex items-start gap-4 min-w-full">
        {KANBAN_COLUMNS.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.status);
          return (
            <div
              key={col.status}
              className={`bg-slate-50/80 rounded-xl p-3 border-t-4 ${col.color} border border-slate-200 flex flex-col w-[270px] min-w-[270px] max-w-[270px] flex-shrink-0`}
            >
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200">
              <span className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                {col.label}
              </span>
              <span className="text-xs bg-white text-slate-600 font-semibold px-2 py-0.5 rounded-full border border-slate-200">
                {colTasks.length}
              </span>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
              {colTasks.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400 italic">No tasks</div>
              ) : (
                colTasks.map((t) => (
                  <div
                    key={t.id}
                    className="bg-white border border-slate-200 rounded-lg p-3 shadow-2xs hover:shadow-sm transition-all space-y-2 group"
                  >
                    <div className="flex items-start justify-between gap-1">
                      <span className="text-[11px] font-mono text-slate-400 font-semibold">
                        {t.taskCode}
                      </span>
                      {getPriorityBadge(t.priority)}
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate(`/tasks/${t.id}`)}
                      className="text-left font-semibold text-xs text-slate-900 group-hover:text-brand-primary line-clamp-2 transition-colors cursor-pointer w-full"
                    >
                      {t.title}
                    </button>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{t.dueDate ? formatDate(t.dueDate) : '-'}</span>
                      </div>
                      <div className="flex items-center gap-1 font-medium">
                        {t.assignee ? (
                          <span className="truncate max-w-[90px]">{t.assignee.name}</span>
                        ) : (
                          <span className="italic text-slate-400">Unassigned</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-1 pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => navigate(`/tasks/${t.id}`)}
                        className="p-1 text-slate-400 hover:text-brand-primary rounded"
                        title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      {canAssign && (
                        <button
                          type="button"
                          onClick={() => onOpenAssign(t)}
                          className="p-1 text-slate-400 hover:text-brand-primary rounded"
                          title="Reassign Task"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {canEdit && (
                        <button
                          type="button"
                          onClick={() => onOpenEdit(t)}
                          className="p-1 text-slate-400 hover:text-brand-primary rounded"
                          title="Edit Task"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
      </div>
    </div>
  );
};
