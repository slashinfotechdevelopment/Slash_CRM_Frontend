import { ColumnDef } from '@/components/templates/DataTable';
import { Badge } from '@/components/ui/Badge';
import { DepartmentItem } from '@/api/types/roles.types';
import { Building2, GitFork, Eye, Edit2, Trash2 } from 'lucide-react';
import { formatDate } from '@/utils/formatters';

interface UseDepartmentColumnsOptions {
  onView: (dept: DepartmentItem) => void;
  onEdit: (dept: DepartmentItem) => void;
  onDelete: (dept: DepartmentItem) => void;
}

export function useDepartmentColumns({
  onView,
  onEdit,
  onDelete,
}: UseDepartmentColumnsOptions): ColumnDef<DepartmentItem>[] {
  return [
    {
      header: 'Department & Code',
      cell: (dept) => (
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 flex-shrink-0 mt-0.5">
            <Building2 className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1 text-left">
            <span className="font-semibold text-slate-900 block">{dept.name}</span>
            <span className="text-xs font-mono text-slate-500 block mt-0.5">{dept.code}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Hierarchy / Parent',
      cell: (dept) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-600">
          {dept.parent ? (
            <>
              <GitFork className="w-3.5 h-3.5 text-slate-400" />
              <span>{dept.parent.name}</span>
            </>
          ) : (
            <span className="text-slate-400">Root Department</span>
          )}
        </div>
      ),
    },
    {
      header: 'Employees',
      cell: (dept) => {
        const count = (dept as unknown as { userCount?: number }).userCount ?? dept.employeeCount ?? 0;
        return (
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
            {count} members
          </span>
        );
      },
    },
    {
      header: 'Status',
      cell: (dept) => (
        <Badge variant={dept.status === 'ACTIVE' ? 'success' : 'neutral'} dot size="sm">
          {dept.status}
        </Badge>
      ),
    },
    {
      header: 'Created',
      cell: (dept) => <span className="text-xs text-slate-500">{formatDate(dept.createdAt)}</span>,
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (dept) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => onView(dept)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => onEdit(dept)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            title="Edit Department"
          >
            <Edit2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => onDelete(dept)}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Deactivate Department"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];
}
