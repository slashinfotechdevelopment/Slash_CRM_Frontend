import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ColumnDef } from '@/components/templates/DataTable';
import { Badge } from '@/components/ui/Badge';
import {
  TaskItem,
  TaskPriority,
  TaskStatus,
} from '@/api/types/task.types';
import {
  Eye,
  UserCheck,
  Edit2,
  Trash2,
  RotateCcw,
  Ban,
} from 'lucide-react';
import { formatDate } from '@/utils/formatters';

interface UseTaskColumnsOptions {
  openAssign: (task: TaskItem) => void;
  openEdit: (task: TaskItem) => void;
  openReopen: (task: TaskItem) => void;
  openCancel: (task: TaskItem) => void;
  handleDeleteTask: (task: TaskItem) => void;
}

export function useTaskColumns({
  openAssign,
  openEdit,
  openReopen,
  openCancel,
  handleDeleteTask,
}: UseTaskColumnsOptions): ColumnDef<TaskItem>[] {
  const navigate = useNavigate();
  const { isSuperAdmin, hasPermission } = useAuth();
  const canAssign = isSuperAdmin || hasPermission('tasks.assign');
  const canEdit = isSuperAdmin || hasPermission('tasks.update');
  const canDelete = isSuperAdmin || hasPermission('tasks.delete');

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

  const getStatusBadge = (s: TaskStatus) => {
    switch (s) {
      case 'COMPLETED':
        return <Badge variant="success">Completed</Badge>;
      case 'IN_PROGRESS':
        return <Badge variant="accent">In Progress</Badge>;
      case 'IN_REVIEW':
        return <Badge variant="warning">In Review</Badge>;
      case 'ON_HOLD':
        return <Badge variant="neutral">On Hold</Badge>;
      case 'REOPENED':
      case 'CANCELLED':
        return <Badge variant="danger">{s}</Badge>;
      case 'TODO':
      default:
        return <Badge variant="neutral">To Do</Badge>;
    }
  };

  return [
    {
      header: 'Task',
      cell: (item) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold text-slate-500">{item.taskCode}</span>
            <button
              type="button"
              onClick={() => navigate(`/tasks/${item.id}`)}
              className="text-sm font-semibold text-slate-900 hover:text-brand-primary transition-colors text-left"
            >
              {item.title}
            </button>
          </div>
          {item.tagMappings && item.tagMappings.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {item.tagMappings.map((m) => (
                <span
                  key={m.id}
                  className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                  style={{
                    backgroundColor: m.tag.color ? `${m.tag.color}20` : 'var(--color-border-subtle)',
                    color: m.tag.color || 'var(--color-text-body)',
                  }}
                >
                  {m.tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
      ),
    },
    {
      header: 'Status',
      cell: (item) => getStatusBadge(item.status),
    },
    {
      header: 'Priority',
      cell: (item) => getPriorityBadge(item.priority),
    },
    {
      header: 'Assignee',
      cell: (item) =>
        item.assignee ? (
          <div>
            <div className="font-medium text-slate-800 text-xs">{item.assignee.name}</div>
            <div className="text-[10px] text-slate-400 font-mono">{item.assignee.userCode}</div>
          </div>
        ) : (
          <span className="text-slate-400 italic text-xs">Unassigned</span>
        ),
    },
    {
      header: 'Department',
      cell: (item) => (
        <span className="text-xs text-slate-600">
          {item.department ? item.department.name : '-'}
        </span>
      ),
    },
    {
      header: 'Due Date',
      cell: (item) => (
        <span className="text-xs text-slate-600">
          {item.dueDate ? formatDate(item.dueDate) : '-'}
        </span>
      ),
    },
    {
      header: 'Progress',
      cell: (item) => (
        <div className="flex items-center gap-2">
          <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-brand-primary h-1.5 rounded-full" style={{ width: `${item.progress || 0}%` }} />
          </div>
          <span className="text-[11px] font-medium text-slate-600">{item.progress || 0}%</span>
        </div>
      ),
    },
    {
      header: 'Actions',
      cell: (item) => (
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => navigate(`/tasks/${item.id}`)}
            className="p-1 text-slate-400 hover:text-brand-primary rounded"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          {canAssign && (
            <button
              type="button"
              onClick={() => openAssign(item)}
              className="p-1 text-slate-400 hover:text-brand-primary rounded"
              title="Reassign Task"
            >
              <UserCheck className="w-4 h-4" />
            </button>
          )}
          {canEdit && (
            <button
              type="button"
              onClick={() => openEdit(item)}
              className="p-1 text-slate-400 hover:text-brand-primary rounded"
              title="Edit Task"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
          {canEdit &&
            (item.status === 'COMPLETED' || item.status === 'CANCELLED' ? (
              <button
                type="button"
                onClick={() => openReopen(item)}
                className="p-1 text-slate-400 hover:text-indigo-600 rounded"
                title="Reopen Task"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => openCancel(item)}
                className="p-1 text-slate-400 hover:text-amber-600 rounded"
                title="Cancel Task"
              >
                <Ban className="w-4 h-4" />
              </button>
            ))}
          {canDelete && (
            <button
              type="button"
              onClick={() => handleDeleteTask(item)}
              className="p-1 text-slate-400 hover:text-rose-600 rounded"
              title="Delete Task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    },
  ];
}
