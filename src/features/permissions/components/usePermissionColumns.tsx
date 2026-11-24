import { ColumnDef } from '@/components/templates/DataTable';
import { Badge } from '@/components/ui/Badge';
import { PermissionItem } from '@/api/types/roles.types';
import { KeyRound, Eye, Edit2, Trash2 } from 'lucide-react';

interface UsePermissionColumnsProps {
  onView: (perm: PermissionItem) => void;
  onEdit: (perm: PermissionItem) => void;
  onDelete: (perm: PermissionItem) => void;
}

export const usePermissionColumns = ({
  onView,
  onEdit,
  onDelete,
}: UsePermissionColumnsProps): ColumnDef<PermissionItem>[] => {
  return [
    {
      header: 'Permission & Code',
      cell: (perm) => (
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-indigo-50 text-brand-primary flex-shrink-0 mt-0.5">
            <KeyRound className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1 text-left">
            <span className="font-semibold text-slate-900 block">{perm.name}</span>
            <span className="text-xs font-mono text-slate-500 block mt-0.5">{perm.code}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Module',
      cell: (perm) => (
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 uppercase">
          {perm.module}
        </span>
      ),
    },
    {
      header: 'Action',
      cell: (perm) => (
        <span className="text-xs font-mono text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
          {perm.action}
        </span>
      ),
    },
    {
      header: 'Description',
      accessorKey: 'description',
      cell: (perm) => (
        <span className="text-xs text-slate-500 line-clamp-1 max-w-xs">
          {perm.description || '-'}
        </span>
      ),
    },
    {
      header: 'Status',
      cell: (perm) => (
        <Badge variant={perm.status === 'ACTIVE' ? 'success' : 'neutral'} dot size="sm">
          {perm.status}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (perm) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => onView(perm)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onEdit(perm)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            title="Edit Permission"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(perm)}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete Permission"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];
};
