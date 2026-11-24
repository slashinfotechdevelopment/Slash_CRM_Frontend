import React from 'react';
import { FormModal } from '@/components/templates/FormModal';
import { Select } from '@/components/ui/Select';
import { PermissionItem, PermissionGroup, DataScope, RoleDetail } from '@/api/types/roles.types';

interface AddPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: RoleDetail | null;
  unassignedPermissions: PermissionItem[];
  selectedPermissionId: string;
  selectedDataScope: DataScope;
  isSubmitting: boolean;
  errorMessage: string | null;
  onPermissionChange: (id: string) => void;
  onDataScopeChange: (scope: DataScope) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export const AddPermissionModal: React.FC<AddPermissionModalProps> = ({
  isOpen,
  onClose,
  role,
  unassignedPermissions,
  selectedPermissionId,
  selectedDataScope,
  isSubmitting,
  errorMessage,
  onPermissionChange,
  onDataScopeChange,
  onSubmit,
}) => {
  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Assign Permission to Role"
      subtitle={`Role: ${role?.name}`}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      submitLabel="Assign Permission"
      errorMessage={errorMessage}
    >
      <Select
        label="Select System Permission"
        placeholder="Choose a permission to grant..."
        value={selectedPermissionId}
        options={unassignedPermissions.map((p) => ({
          value: p.id,
          label: `${p.name} (${p.code})`,
        }))}
        onChange={(e) => onPermissionChange(e.target.value)}
        required
      />

      <Select
        label="Data Authorization Scope"
        value={selectedDataScope}
        options={[
          { value: 'ALL', label: 'ALL - Full Organization Access' },
          { value: 'DEPARTMENT', label: 'DEPARTMENT - User Department Records' },
          { value: 'TEAM', label: 'TEAM - Direct Team Members Only' },
          { value: 'OWN', label: 'OWN - Personal Records Only' },
        ]}
        onChange={(e) => onDataScopeChange(e.target.value as DataScope)}
        required
      />
    </FormModal>
  );
};

interface BulkPermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupedPermissions: PermissionGroup[];
  bulkSelectedIds: Record<string, DataScope>;
  isSubmitting: boolean;
  errorMessage: string | null;
  onToggleAllGroup: (group: PermissionGroup, deselect: boolean) => void;
  onTogglePermission: (permissionId: string, checked: boolean) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export const BulkPermissionsModal: React.FC<BulkPermissionsModalProps> = ({
  isOpen,
  onClose,
  groupedPermissions,
  bulkSelectedIds,
  isSubmitting,
  errorMessage,
  onToggleAllGroup,
  onTogglePermission,
  onSubmit,
}) => {
  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Configure Role Permissions"
      subtitle="Select the comprehensive set of capabilities for this role."
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      submitLabel="Save Permissions"
      errorMessage={errorMessage}
      maxWidth="2xl"
    >
      <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
        {groupedPermissions.map((group) => {
          const allChecked = group.permissions.every((p) => !!bulkSelectedIds[p.id]);
          return (
            <div key={group.module} className="border border-slate-200 rounded-xl p-4 bg-slate-50/40">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm uppercase tracking-wider text-slate-800">
                    {group.module}
                  </span>
                  <span className="text-xs text-slate-500">
                    ({group.permissions.length} items)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onToggleAllGroup(group, allChecked)}
                  className="text-xs text-brand-primary hover:underline font-semibold"
                >
                  {allChecked ? 'Deselect All' : 'Select All'}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {group.permissions.map((p) => {
                  const isSelected = !!bulkSelectedIds[p.id];
                  return (
                    <label
                      key={p.id}
                      className={`flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-white border-brand-primary/40 shadow-sm ring-1 ring-brand-primary/20'
                          : 'bg-white/60 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => onTogglePermission(p.id, e.target.checked)}
                        className="mt-0.5 rounded border-slate-300 text-brand-primary focus:ring-brand-primary/30"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-800 leading-tight">
                          {p.name}
                        </p>
                        <p className="text-[11px] font-mono text-slate-500 truncate mt-0.5">
                          {p.code}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </FormModal>
  );
};
