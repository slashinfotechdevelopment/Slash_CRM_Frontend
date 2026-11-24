import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@/components/templates/DataTable';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { UserItem } from '@/api/types/users.types';
import {
  Eye,
  Edit2,
  Trash2,
  RotateCcw,
  ShieldAlert,
  Building2,
} from 'lucide-react';

interface UseUserColumnsOptions {
  isCurrentSuperAdmin: boolean;
  currentUserId?: string;
  onOpenEdit: (user: UserItem) => void;
  onOpenStatus: (user: UserItem) => void;
  onDelete: (user: UserItem) => void;
  onRestore: (user: UserItem) => void;
}

export function useUserColumns({
  isCurrentSuperAdmin,
  currentUserId,
  onOpenEdit,
  onOpenStatus,
  onDelete,
  onRestore,
}: UseUserColumnsOptions): ColumnDef<UserItem>[] {
  const navigate = useNavigate();

  return [
    {
      accessorKey: 'name',
      header: 'User Account',
      cell: (row) => {
        const initials = row.name
          .split(' ')
          .map((n) => n[0])
          .slice(0, 2)
          .join('')
          .toUpperCase();

        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-sm shrink-0 overflow-hidden">
              {row.profileMedia?.fileUrl ? (
                <img
                  src={row.profileMedia.fileUrl}
                  alt={row.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{initials}</span>
              )}
            </div>
            <div className="min-w-0 max-w-sm">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => navigate(`/users/${row.id}`)}
                  className="font-semibold text-slate-900 hover:text-brand-primary transition-colors text-left truncate"
                >
                  {row.name}
                </button>
                {row.designation && (
                  <span className="text-xs text-indigo-700 font-medium bg-indigo-50/70 border border-indigo-100/60 px-1.5 py-0.5 rounded truncate">
                    {row.designation}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 truncate mt-0.5">
                <span className="font-mono font-medium text-slate-600 bg-slate-50 px-1 rounded border border-slate-200">
                  {row.userCode}
                </span>
                <span>•</span>
                <span className="truncate">{row.email}</span>
                {row.phone && (
                  <>
                    <span>•</span>
                    <span className="text-slate-400">{row.phone}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'userType',
      header: 'Account Type',
      cell: (row) => {
        const typeCode = row.userType?.code;
        if (typeCode === 'SUPER_ADMIN') {
          return <Badge variant="primary">Super Admin</Badge>;
        }
        if (typeCode === 'ADMIN') {
          return <Badge variant="info">Admin</Badge>;
        }
        if (typeCode === 'EMPLOYEE') {
          return <Badge variant="neutral">Employee</Badge>;
        }
        return <Badge variant="warning">Client</Badge>;
      },
    },
    {
      accessorKey: 'roles',
      header: 'Roles & Department',
      cell: (row) => {
        const primaryDept = row.departments?.find((d) => d.isPrimary) || row.departments?.[0];
        return (
          <div className="space-y-1.5 max-w-[260px]">
            {row.roles && row.roles.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {row.roles.slice(0, 2).map((r) => (
                  <Badge key={r.id || r.code} variant="neutral" size="sm">
                    {r.name || r.code}
                  </Badge>
                ))}
                {row.roles.length > 2 && (
                  <Badge variant="neutral" size="sm">
                    +{row.roles.length - 2}
                  </Badge>
                )}
              </div>
            ) : (
              <span className="text-xs text-slate-400">No roles</span>
            )}

            {primaryDept ? (
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
                <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate max-w-[170px]">{primaryDept.name}</span>
                {primaryDept.isPrimary && (
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-1 py-0.5 rounded font-mono">
                    Primary
                  </span>
                )}
              </div>
            ) : (
              <div className="text-xs text-slate-400">No department</div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: (row) => {
        if (row.deletedAt) {
          return <Badge variant="danger">Deleted</Badge>;
        }
        if (row.status === 'ACTIVE') {
          return <Badge variant="success">Active</Badge>;
        }
        return <Badge variant="neutral">Inactive</Badge>;
      },
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: (row) => {
        const isSelf = currentUserId === row.id;
        const isSuperAdminRow = row.roles?.some((r) => r.code === 'SUPER_ADMIN');
        const isDeleted = !!row.deletedAt;

        return (
          <div
            className="flex items-center justify-end gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/users/${row.id}`)}
              className="p-1.5 text-slate-500 hover:text-slate-900"
              title="View User Details"
            >
              <Eye className="w-4 h-4" />
            </Button>

            {!isDeleted ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onOpenEdit(row)}
                  className="p-1.5 text-slate-500 hover:text-slate-900"
                  title="Edit User Profile"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onOpenStatus(row)}
                  className="p-1.5 text-slate-500 hover:text-slate-900"
                  title="Toggle Active/Inactive"
                >
                  <ShieldAlert className="w-4 h-4" />
                </Button>

                {!isSuperAdminRow && !isSelf && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(row)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50"
                    title="Soft-Delete User"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </>
            ) : (
              isCurrentSuperAdmin && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRestore(row)}
                  className="p-1.5 text-brand-primary hover:bg-brand-primary/10"
                  title="Restore Soft-Deleted Account"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              )
            )}
          </div>
        );
      },
    },
  ];
}
