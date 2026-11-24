import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import {
  UserDetail,
  EffectivePermissionsResponse,
  EffectivePermissionItem,
} from '@/api/types/users.types';
import {
  KeyRound,
  Trash2,
  Plus,
  Sliders,
  Search,
} from 'lucide-react';

interface UserPermissionsTabProps {
  user: UserDetail | null;
  effectivePermsData: EffectivePermissionsResponse | null;
  filteredPermissions: EffectivePermissionItem[];
  modulesList: string[];
  permSearch: string;
  onPermSearchChange: (v: string) => void;
  permModuleFilter: string;
  onPermModuleFilterChange: (v: string) => void;
  isSuperAdmin: boolean;
  isDeleted: boolean;
  onOpenAddRole: () => void;
  onOpenReplaceRoles: () => void;
  onOpenPermissionsModal: () => void;
  onRemoveRole: (roleId: string, roleName: string) => void;
}

export const UserPermissionsTab: React.FC<UserPermissionsTabProps> = ({
  user,
  effectivePermsData,
  filteredPermissions,
  modulesList,
  permSearch,
  onPermSearchChange,
  permModuleFilter,
  onPermModuleFilterChange,
  isSuperAdmin,
  isDeleted,
  onOpenAddRole,
  onOpenReplaceRoles,
  onOpenPermissionsModal,
  onRemoveRole,
}) => {
  return (
    <div className="space-y-6">
      {/* Roles Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">Assigned RBAC Roles</h3>
            <p className="text-xs text-slate-500">
              Users inherit permissions aggregated from all assigned roles.
            </p>
          </div>
          {!isDeleted && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenReplaceRoles}
                className="flex items-center gap-1.5 text-xs"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Replace All Roles</span>
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={onOpenAddRole}
                className="flex items-center gap-1.5 text-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Assign Role</span>
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {user?.roles?.length === 0 ? (
            <div className="col-span-full py-8 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-slate-200">
              No roles assigned to this user yet.
            </div>
          ) : (
            user?.roles?.map((role) => (
              <div
                key={role.id || role.code}
                className="p-4 bg-white border border-slate-200 rounded-xl flex items-start justify-between gap-3 shadow-xs"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm truncate">{role.name}</span>
                    {role.isSystem && (
                      <Badge variant="neutral" size="sm">
                        System
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs font-mono text-slate-500">{role.code}</p>
                  {role.description && (
                    <p className="text-xs text-slate-600 line-clamp-2">{role.description}</p>
                  )}
                </div>

                {!isDeleted && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveRole(role.id, role.name)}
                    className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 -mr-1 -mt-1"
                    title={`Remove role ${role.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <hr className="border-slate-200" />

      {/* Effective Permissions Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">Effective Permissions</h3>
            <p className="text-xs text-slate-500">
              Computed capabilities derived from assigned roles and direct ALLOW/DENY user overrides.
            </p>
          </div>
          {!isDeleted && !isSuperAdmin && (
            <Button
              variant="primary"
              size="sm"
              onClick={onOpenPermissionsModal}
              className="flex items-center gap-1.5 text-xs"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Configure Permission Overrides</span>
            </Button>
          )}
        </div>

        {/* Permissions Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search permissions..."
              value={permSearch}
              onChange={(e) => onPermSearchChange(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-primary"
            />
          </div>

          <div className="w-full sm:w-48">
            <Select
              value={permModuleFilter}
              onChange={(e) => onPermModuleFilterChange(e.target.value)}
              placeholder={`All Modules (${modulesList.length})`}
              options={[
                { value: '', label: `All Modules (${modulesList.length})` },
                ...modulesList.map((m) => ({ value: m, label: m })),
              ]}
            />
          </div>

          <span className="text-xs text-slate-500 sm:ml-auto">
            Showing {filteredPermissions.length} of {effectivePermsData?.permissions?.length || 0}
          </span>
        </div>

        {/* Permissions Table */}
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
              <tr>
                <th className="py-3 px-4">Permission</th>
                <th className="py-3 px-4">Module</th>
                <th className="py-3 px-4">Effect</th>
                <th className="py-3 px-4">Scope</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4">Justification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredPermissions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-slate-400">
                    No permissions match the active search criteria.
                  </td>
                </tr>
              ) : (
                filteredPermissions.map((perm) => (
                  <tr key={perm.code} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-2.5 px-4">
                      <div className="font-semibold text-slate-900 text-xs">{perm.name}</div>
                      <div className="font-mono text-[11px] text-slate-500">{perm.code}</div>
                    </td>
                    <td className="py-2.5 px-4">
                      <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                        {perm.module}
                      </span>
                    </td>
                    <td className="py-2.5 px-4">
                      {perm.effect === 'ALLOW' ? (
                        <Badge variant="success" size="sm">
                          ALLOW
                        </Badge>
                      ) : (
                        <Badge variant="danger" size="sm">
                          DENY
                        </Badge>
                      )}
                    </td>
                    <td className="py-2.5 px-4">
                      <span className="font-mono text-xs text-slate-700">{perm.dataScope || 'ALL'}</span>
                    </td>
                    <td className="py-2.5 px-4">
                      <span className="text-xs text-slate-600 font-medium">{perm.source}</span>
                    </td>
                    <td className="py-2.5 px-4 text-xs text-slate-500">
                      {perm.reason || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
