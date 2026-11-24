import React from 'react';
import { FormModal } from '@/components/templates/FormModal';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import {
  UserDetail,
  UserPermissionOverrideItem,
  DataScopeType,
  PermissionEffectType,
} from '@/api/types/users.types';
import { PermissionItem } from '@/api/types/roles.types';
import { Trash2 } from 'lucide-react';

export interface UserPermissionModalsProps {
  user: UserDetail | null;
  formError: string | null;
  isSubmitting: boolean;

  // Permission Overrides
  isPermissionsModalOpen: boolean;
  onClosePermissions: () => void;
  permOverrides: UserPermissionOverrideItem[];
  setPermOverrides: React.Dispatch<React.SetStateAction<UserPermissionOverrideItem[]>>;
  newOverride: UserPermissionOverrideItem;
  setNewOverride: React.Dispatch<React.SetStateAction<UserPermissionOverrideItem>>;
  availablePermissions: PermissionItem[];
  modalFilteredPerms: PermissionItem[];
  overridePermSearch: string;
  setOverridePermSearch: (v: string) => void;
  onPermissionsSubmit: (e: React.FormEvent) => void;
  onAddOverride: () => void;
}

export const UserPermissionModals: React.FC<UserPermissionModalsProps> = ({
  user,
  formError,
  isSubmitting,
  isPermissionsModalOpen,
  onClosePermissions,
  permOverrides,
  setPermOverrides,
  newOverride,
  setNewOverride,
  availablePermissions,
  modalFilteredPerms,
  overridePermSearch,
  setOverridePermSearch,
  onPermissionsSubmit,
  onAddOverride,
}) => {
  return (
    <FormModal
      isOpen={isPermissionsModalOpen}
      onClose={onClosePermissions}
      title="Configure Direct Permission Overrides"
      subtitle={`Set explicit ALLOW/DENY rules and scopes for ${user?.name}.`}
      errorMessage={formError}
      isSubmitting={isSubmitting}
      submitLabel="Save Overrides"
      maxWidth="lg"
      onSubmit={onPermissionsSubmit}
    >
      <div className="space-y-4">
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Add New Permission Override
          </h4>
          <div>
            <label className="text-[11px] font-semibold text-slate-600 block mb-1">
              Filter Permissions (130+ available)
            </label>
            <input
              type="text"
              placeholder="Type name or code to search..."
              value={overridePermSearch}
              onChange={(e) => setOverridePermSearch(e.target.value)}
              className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-brand-primary"
            />
          </div>
          <div>
            <Select
              label={`Select Permission (${modalFilteredPerms.length} matches)`}
              placeholder="Choose a permission..."
              value={newOverride.permissionId}
              options={[
                { value: '', label: 'Choose a permission...' },
                ...modalFilteredPerms.map((p) => ({
                  value: p.id,
                  label: `${p.name} (${p.code}) [${p.module}]`,
                })),
              ]}
              onChange={(e) => {
                const sel = availablePermissions.find((p) => p.id === e.target.value);
                setNewOverride((prev) => ({
                  ...prev,
                  permissionId: e.target.value,
                  code: sel?.code,
                }));
              }}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
            <div>
              <Select
                label="Effect"
                value={newOverride.effect}
                options={[
                  { value: 'ALLOW', label: 'ALLOW (Grant Access)' },
                  { value: 'DENY', label: 'DENY (Explicitly Block)' },
                ]}
                onChange={(e) =>
                  setNewOverride((prev) => ({
                    ...prev,
                    effect: e.target.value as PermissionEffectType,
                  }))
                }
              />
            </div>
            <div>
              <Select
                label="Data Scope"
                disabled={newOverride.effect === 'DENY'}
                value={newOverride.dataScope || 'ALL'}
                options={[
                  { value: 'ALL', label: 'Scope: ALL' },
                  { value: 'DEPARTMENT', label: 'Scope: DEPARTMENT' },
                  { value: 'ASSIGNED', label: 'Scope: ASSIGNED' },
                  { value: 'OWN', label: 'Scope: OWN' },
                ]}
                onChange={(e) =>
                  setNewOverride((prev) => ({
                    ...prev,
                    dataScope: e.target.value as DataScopeType,
                  }))
                }
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                Justification / Reason
              </label>
              <input
                type="text"
                placeholder="Optional business reason..."
                value={newOverride.reason || ''}
                onChange={(e) => setNewOverride((prev) => ({ ...prev, reason: e.target.value }))}
                className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-brand-primary"
              />
            </div>
            <div>
              <Button type="button" variant="primary" size="md" onClick={onAddOverride} className="w-full text-xs">
                + Add Override
              </Button>
            </div>
          </div>
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Configured Direct Overrides ({permOverrides.length})
          </h4>
          {permOverrides.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center border border-dashed border-slate-200 rounded-lg">
              No direct overrides configured. The user inherits all permissions from assigned roles.
            </p>
          ) : (
            <div className="border border-slate-200 rounded-lg divide-y divide-slate-100 max-h-52 overflow-y-auto">
              {permOverrides.map((override, index) => {
                const permMatch = availablePermissions.find(
                  (p) => p.code === override.code || p.id === override.permissionId
                );
                return (
                  <div
                    key={index}
                    className="p-3 flex items-center justify-between gap-3 text-xs bg-white hover:bg-slate-50"
                  >
                    <div className="min-w-0 space-y-0.5">
                      <div className="font-semibold text-slate-900 truncate">
                        {permMatch?.name || override.code || override.permissionId}
                      </div>
                      <div className="flex items-center gap-2 text-slate-500 font-mono text-[11px]">
                        <span>{override.code || permMatch?.code}</span>
                        <span>•</span>
                        <span
                          className={
                            override.effect === 'ALLOW' ? 'text-emerald-600 font-bold' : 'text-red-600 font-bold'
                          }
                        >
                          {override.effect}
                        </span>
                        {override.dataScope && (
                          <>
                            <span>•</span>
                            <span>{override.dataScope}</span>
                          </>
                        )}
                      </div>
                      {override.reason && (
                        <div className="text-[11px] text-slate-500 italic truncate max-w-sm">
                          {override.reason}
                        </div>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setPermOverrides((prev) => prev.filter((_, i) => i !== index))
                      }
                      className="p-1 text-slate-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </FormModal>
  );
};
