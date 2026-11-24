import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { RolePermissionItem } from '@/api/types/roles.types';
import { KeyRound, Trash2 } from 'lucide-react';

interface RolePermissionsTableProps {
  permissions: RolePermissionItem[];
  isSuperAdmin: boolean;
  onRemove: (item: RolePermissionItem) => void;
}

export const RolePermissionsTable: React.FC<RolePermissionsTableProps> = ({
  permissions,
  isSuperAdmin,
  onRemove,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-brand-primary" />
            <span>Assigned Role Permissions</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Active permissions granting functional access to users with this role.
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
          {permissions.length} Total
        </span>
      </div>

      {permissions.length === 0 ? (
        <div className="p-8 text-center text-slate-500 text-sm">
          No permissions assigned to this role yet. Click "Add Permission" or "Configure All" to assign.
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {permissions.map((item, idx) => {
            const permName = item.permission?.name || item.name || item.permissionId;
            const permCode = item.permission?.code || item.code || '';
            const permDesc = item.permission?.description || (item.module ? `Module: ${item.module}` : null);
            return (
              <div
                key={item.permissionId || item.id || idx}
                className="px-6 py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm font-semibold text-slate-900">
                      {permName}
                    </span>
                    {permCode && (
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {permCode}
                      </span>
                    )}
                    <Badge variant="accent" size="sm">
                      Scope: {item.dataScope}
                    </Badge>
                  </div>
                  {permDesc && (
                    <p className="text-xs text-slate-500 mt-0.5 truncate">
                      {permDesc}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  disabled={isSuperAdmin}
                  onClick={() => onRemove(item)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    isSuperAdmin
                      ? 'text-slate-300 cursor-not-allowed'
                      : 'text-slate-400 hover:text-red-600 hover:bg-red-50'
                  }`}
                  title={
                    isSuperAdmin
                      ? 'Cannot remove permissions from system Super Admin role'
                      : 'Remove Permission'
                  }
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
