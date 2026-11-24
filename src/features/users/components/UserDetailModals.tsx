import React from 'react';
import { FormModal } from '@/components/templates/FormModal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import {
  UserDetail,
  UserStatus,
  UpdateUserPayload,
  UpdateUserStatusPayload,
  UserPermissionOverrideItem,
  DataScopeType,
  PermissionEffectType,
} from '@/api/types/users.types';
import { RoleItem, DepartmentItem, PermissionItem } from '@/api/types/roles.types';
import { Trash2 } from 'lucide-react';

export interface UserDetailModalsProps {
  user: UserDetail | null;
  formError: string | null;
  isSubmitting: boolean;

  // Edit
  isEditModalOpen: boolean;
  onCloseEdit: () => void;
  editForm: UpdateUserPayload;
  setEditForm: React.Dispatch<React.SetStateAction<UpdateUserPayload>>;
  onEditSubmit: (e: React.FormEvent) => void;

  // Status
  isStatusModalOpen: boolean;
  onCloseStatus: () => void;
  statusForm: UpdateUserStatusPayload;
  setStatusForm: React.Dispatch<React.SetStateAction<UpdateUserStatusPayload>>;
  onStatusSubmit: (e: React.FormEvent) => void;

  // Add Role
  isAddRoleModalOpen: boolean;
  onCloseAddRole: () => void;
  selectedRoleToAdd: string;
  setSelectedRoleToAdd: (v: string) => void;
  availableRoles: RoleItem[];
  onAddRoleSubmit: (e: React.FormEvent) => void;

  // Replace Roles
  isReplaceRolesModalOpen: boolean;
  onCloseReplaceRoles: () => void;
  selectedRolesToReplace: string[];
  setSelectedRolesToReplace: React.Dispatch<React.SetStateAction<string[]>>;
  onReplaceRolesSubmit: (e: React.FormEvent) => void;

  // Departments
  isDepartmentsModalOpen: boolean;
  onCloseDepartments: () => void;
  deptAssignments: { id: string; isPrimary: boolean }[];
  setDeptAssignments: React.Dispatch<
    React.SetStateAction<{ id: string; isPrimary: boolean }[]>
  >;
  availableDepartments: DepartmentItem[];
  onDepartmentsSubmit: (e: React.FormEvent) => void;

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

export const UserDetailModals: React.FC<UserDetailModalsProps> = ({
  user,
  formError,
  isSubmitting,
  isEditModalOpen,
  onCloseEdit,
  editForm,
  setEditForm,
  onEditSubmit,
  isStatusModalOpen,
  onCloseStatus,
  statusForm,
  setStatusForm,
  onStatusSubmit,
  isAddRoleModalOpen,
  onCloseAddRole,
  selectedRoleToAdd,
  setSelectedRoleToAdd,
  availableRoles,
  onAddRoleSubmit,
  isReplaceRolesModalOpen,
  onCloseReplaceRoles,
  selectedRolesToReplace,
  setSelectedRolesToReplace,
  onReplaceRolesSubmit,
  isDepartmentsModalOpen,
  onCloseDepartments,
  deptAssignments,
  setDeptAssignments,
  availableDepartments,
  onDepartmentsSubmit,
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
    <>
      {/* EDIT USER MODAL */}
      <FormModal
        isOpen={isEditModalOpen}
        onClose={onCloseEdit}
        title="Edit User Profile"
        subtitle={`Update profile information for ${user?.name}.`}
        errorMessage={formError}
        isSubmitting={isSubmitting}
        submitLabel="Save Changes"
        onSubmit={onEditSubmit}
      >
        <div className="space-y-4">
          <Input
            label="Full Legal Name"
            required
            placeholder="Full Name"
            value={editForm.name || ''}
            onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
          />
          <Input
            label="Mobile Number"
            placeholder="+919876543210"
            value={editForm.phone || ''}
            onChange={(e) => setEditForm((prev) => ({ ...prev, phone: e.target.value }))}
            helperText="Indian mobile format (+91 followed by 10 digits)"
          />
          <Input
            label="Job Designation"
            placeholder="e.g. Senior Frontend Engineer"
            value={editForm.designation || ''}
            onChange={(e) => setEditForm((prev) => ({ ...prev, designation: e.target.value }))}
          />
        </div>
      </FormModal>

      {/* CHANGE STATUS MODAL */}
      <FormModal
        isOpen={isStatusModalOpen}
        onClose={onCloseStatus}
        title="Change Account Status"
        subtitle={`Update operational status for ${user?.name} (${user?.userCode}).`}
        errorMessage={formError}
        isSubmitting={isSubmitting}
        submitLabel="Update Status"
        onSubmit={onStatusSubmit}
      >
        <div className="space-y-4">
          <Select
            label="Account Status"
            required
            options={[
              { value: 'ACTIVE', label: 'ACTIVE - Account operational' },
              { value: 'INACTIVE', label: 'INACTIVE - Account suspended / locked' },
            ]}
            value={statusForm.status}
            onChange={(e) =>
              setStatusForm((prev) => ({ ...prev, status: e.target.value as UserStatus }))
            }
          />
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Reason / Business Justification
            </label>
            <textarea
              rows={3}
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
              placeholder="e.g. Employee sabbatical leave or policy compliance review."
              value={statusForm.reason || ''}
              onChange={(e) => setStatusForm((prev) => ({ ...prev, reason: e.target.value }))}
            />
          </div>
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 leading-relaxed">
            <strong>Security Notice:</strong> Setting an account to <strong>INACTIVE</strong> immediately terminates all active user sessions and denies token refresh.
          </div>
        </div>
      </FormModal>

      {/* ADD SINGLE ROLE MODAL */}
      <FormModal
        isOpen={isAddRoleModalOpen}
        onClose={onCloseAddRole}
        title="Assign Role to User"
        subtitle={`Grant supplementary privileges to ${user?.name}.`}
        errorMessage={formError}
        isSubmitting={isSubmitting}
        submitLabel="Assign Role"
        onSubmit={onAddRoleSubmit}
      >
        <div className="space-y-4">
          <Select
            label="Role to Assign"
            required
            options={[
              { value: '', label: 'Select a role to assign...' },
              ...availableRoles
                .filter((r) => !user?.roles?.some((ur) => ur.id === r.id))
                .map((r) => ({
                  value: r.id,
                  label: `${r.name} (${r.code})`,
                })),
            ]}
            value={selectedRoleToAdd}
            onChange={(e) => setSelectedRoleToAdd(e.target.value)}
          />
        </div>
      </FormModal>

      {/* REPLACE ALL ROLES MODAL */}
      <FormModal
        isOpen={isReplaceRolesModalOpen}
        onClose={onCloseReplaceRoles}
        title="Replace All User Roles"
        subtitle={`Select the definitive role set for ${user?.name}. Previous roles will be removed.`}
        errorMessage={formError}
        isSubmitting={isSubmitting}
        submitLabel="Apply Role Set"
        onSubmit={onReplaceRolesSubmit}
      >
        <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
          {availableRoles.map((role) => {
            const isChecked = selectedRolesToReplace.includes(role.id);
            return (
              <label
                key={role.id}
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  isChecked
                    ? 'border-brand-primary bg-brand-primary/5'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary"
                  checked={isChecked}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedRolesToReplace((prev) => [...prev, role.id]);
                    } else {
                      setSelectedRolesToReplace((prev) => prev.filter((id) => id !== role.id));
                    }
                  }}
                />
                <div className="min-w-0">
                  <div className="font-semibold text-xs text-slate-900">{role.name}</div>
                  <div className="font-mono text-[11px] text-slate-500">{role.code}</div>
                  {role.description && (
                    <div className="text-[11px] text-slate-600 line-clamp-1">{role.description}</div>
                  )}
                </div>
              </label>
            );
          })}
        </div>
      </FormModal>

      {/* CONFIGURE DEPARTMENTS MODAL */}
      <FormModal
        isOpen={isDepartmentsModalOpen}
        onClose={onCloseDepartments}
        title="Configure Department Memberships"
        subtitle={`Assign departments for ${user?.name}. Exactly one department must be marked as primary.`}
        errorMessage={formError}
        isSubmitting={isSubmitting}
        submitLabel="Save Departments"
        onSubmit={onDepartmentsSubmit}
      >
        <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
          {availableDepartments.map((dept) => {
            const assignment = deptAssignments.find((a) => a.id === dept.id);
            const isSelected = !!assignment;
            const isPrimary = assignment?.isPrimary || false;
            return (
              <div
                key={dept.id}
                className={`p-3 rounded-lg border flex items-center justify-between gap-3 ${
                  isSelected ? 'border-brand-primary bg-brand-primary/5' : 'border-slate-200 bg-white'
                }`}
              >
                <label className="flex items-center gap-3 cursor-pointer min-w-0 flex-1">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary"
                    checked={isSelected}
                    onChange={(e) => {
                      if (e.target.checked) {
                        const hasPrimary = deptAssignments.some((a) => a.isPrimary);
                        setDeptAssignments((prev) => [
                          ...prev,
                          { id: dept.id, isPrimary: !hasPrimary },
                        ]);
                      } else {
                        setDeptAssignments((prev) => prev.filter((a) => a.id !== dept.id));
                      }
                    }}
                  />
                  <div className="min-w-0">
                    <div className="font-semibold text-xs text-slate-900 truncate">{dept.name}</div>
                    <div className="font-mono text-[11px] text-slate-500">{dept.code}</div>
                  </div>
                </label>
                {isSelected && (
                  <button
                    type="button"
                    onClick={() => {
                      setDeptAssignments((prev) =>
                        prev.map((a) => ({ ...a, isPrimary: a.id === dept.id }))
                      );
                    }}
                    className={`px-2 py-1 text-[11px] font-semibold rounded ${
                      isPrimary
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {isPrimary ? 'Primary' : 'Make Primary'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </FormModal>

      {/* CONFIGURE PERMISSION OVERRIDES MODAL */}
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
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                Select Permission ({modalFilteredPerms.length} matches)
              </label>
              <select
                className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-brand-primary"
                value={newOverride.permissionId}
                onChange={(e) => {
                  const sel = availablePermissions.find((p) => p.id === e.target.value);
                  setNewOverride((prev) => ({
                    ...prev,
                    permissionId: e.target.value,
                    code: sel?.code,
                  }));
                }}
              >
                <option value="">Choose a permission...</option>
                {modalFilteredPerms.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.code}) [{p.module}]
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Effect</label>
                <select
                  className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  value={newOverride.effect}
                  onChange={(e) =>
                    setNewOverride((prev) => ({
                      ...prev,
                      effect: e.target.value as PermissionEffectType,
                    }))
                  }
                >
                  <option value="ALLOW">ALLOW (Grant Access)</option>
                  <option value="DENY">DENY (Explicitly Block)</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Data Scope</label>
                <select
                  className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-brand-primary disabled:opacity-50"
                  disabled={newOverride.effect === 'DENY'}
                  value={newOverride.dataScope || 'ALL'}
                  onChange={(e) =>
                    setNewOverride((prev) => ({
                      ...prev,
                      dataScope: e.target.value as DataScopeType,
                    }))
                  }
                >
                  <option value="ALL">Scope: ALL</option>
                  <option value="DEPARTMENT">Scope: DEPARTMENT</option>
                  <option value="ASSIGNED">Scope: ASSIGNED</option>
                  <option value="OWN">Scope: OWN</option>
                </select>
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
    </>
  );
};
