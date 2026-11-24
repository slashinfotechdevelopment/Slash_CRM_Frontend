import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@/components/templates/DataTable';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { RoleItem } from '@/api/types/roles.types';
import { Shield, KeyRound, Edit2, RotateCcw, Trash2 } from 'lucide-react';
import { formatDate } from '@/utils/formatters';

interface UseRoleColumnsOptions {
  onEdit: (role: RoleItem) => void;
  onDelete: (role: RoleItem) => void;
  onRestore: (role: RoleItem) => void;
}

export function useRoleColumns({
  onEdit,
  onDelete,
  onRestore,
}: UseRoleColumnsOptions): ColumnDef<RoleItem>[] {
  const navigate = useNavigate();

  return [
    {
      header: 'Role Name & Code',
      cell: (role) => (
        <div className="flex items-start gap-3">
          <div
            className={`p-2 rounded-lg flex-shrink-0 mt-0.5 ${
              role.isSystem ? 'bg-indigo-50 text-brand-primary' : 'bg-slate-100 text-slate-700'
            }`}
          >
            <Shield className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1 text-left">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-semibold text-slate-900">{role.name}</span>
              {role.isSystem && (
                <Badge variant="primary" size="sm">
                  System Protected
                </Badge>
              )}
              {role.deletedAt && (
                <Badge variant="danger" size="sm">
                  Deleted
                </Badge>
              )}
            </div>
            <span className="text-xs font-mono text-slate-500 block mt-0.5">{role.code}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Description',
      accessorKey: 'description',
      cell: (role) => (
        <span
          className="text-xs text-slate-600 line-clamp-2 max-w-sm"
          title={role.description || undefined}
        >
          {role.description || '-'}
        </span>
      ),
    },
    {
      header: 'Users',
      cell: (role) => {
        const count = (role as unknown as { _count?: { users?: number } })._count?.users ?? role.userCount ?? 0;
        return (
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 whitespace-nowrap inline-flex items-center">
            {count} assigned
          </span>
        );
      },
    },
    {
      header: 'Permissions',
      cell: (role) => {
        const count = (role as unknown as { _count?: { permissions?: number } })._count?.permissions ?? role.permissionCount ?? 0;
        return (
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 whitespace-nowrap inline-flex items-center">
            {count} active
          </span>
        );
      },
    },
    {
      header: 'Status',
      cell: (role) => (
        <Badge variant={role.status === 'ACTIVE' ? 'success' : 'neutral'} dot size="sm">
          {role.status}
        </Badge>
      ),
    },
    {
      header: 'Created',
      cell: (role) => <span className="text-xs text-slate-500 whitespace-nowrap">{formatDate(role.createdAt)}</span>,
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (role) => {
        const isSuperAdmin = role.isSystem || role.code === 'SUPER_ADMIN' || role.code === 'ADMIN';
        return (
          <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/roles/${role.id}`)}
              leftIcon={<KeyRound className="w-3.5 h-3.5" />}
              title="Manage Permissions"
            >
              Permissions
            </Button>

            {!role.deletedAt && (
              <button
                type="button"
                disabled={isSuperAdmin}
                onClick={() => onEdit(role)}
                className={`p-1.5 rounded-lg transition-colors ${
                  isSuperAdmin
                    ? 'text-slate-300 cursor-not-allowed'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                }`}
                title={isSuperAdmin ? 'System roles cannot be modified' : 'Edit Role'}
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}

            {role.deletedAt ? (
              <button
                type="button"
                onClick={() => onRestore(role)}
                className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                title="Restore Role"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={isSuperAdmin}
                onClick={() => onDelete(role)}
                className={`p-1.5 rounded-lg transition-colors ${
                  isSuperAdmin
                    ? 'text-slate-300 cursor-not-allowed'
                    : 'text-slate-400 hover:text-red-600 hover:bg-red-50'
                }`}
                title={isSuperAdmin ? 'Protected system roles cannot be deleted' : 'Delete Role'}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        );
      },
    },
  ];
}
