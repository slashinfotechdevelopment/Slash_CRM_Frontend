import React from 'react';
import { FormModal } from '@/components/templates/FormModal';
import { Select } from '@/components/ui/Select';
import { UserDetail } from '@/api/types/users.types';
import { RoleItem } from '@/api/types/roles.types';

export interface UserRoleModalsProps {
  user: UserDetail | null;
  formError: string | null;
  isSubmitting: boolean;

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
}

export const UserRoleModals: React.FC<UserRoleModalsProps> = ({
  user,
  formError,
  isSubmitting,
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
}) => {
  return (
    <>
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
    </>
  );
};
