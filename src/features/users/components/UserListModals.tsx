import React from 'react';
import { FormModal } from '@/components/templates/FormModal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import {
  UserItem,
  UserStatus,
  CreatableUserType,
  CreateUserPayload,
  UpdateUserPayload,
  UpdateUserStatusPayload,
} from '@/api/types/users.types';
import { RoleItem, DepartmentItem } from '@/api/types/roles.types';

export interface UserListModalsProps {
  // Create Modal
  isCreateModalOpen: boolean;
  onCloseCreate: () => void;
  createForm: CreateUserPayload;
  setCreateForm: React.Dispatch<React.SetStateAction<CreateUserPayload>>;
  onCreateSubmit: (e: React.FormEvent) => void;

  // Edit Modal
  isEditModalOpen: boolean;
  onCloseEdit: () => void;
  selectedUser: UserItem | null;
  editForm: UpdateUserPayload;
  setEditForm: React.Dispatch<React.SetStateAction<UpdateUserPayload>>;
  onEditSubmit: (e: React.FormEvent) => void;

  // Status Modal
  isStatusModalOpen: boolean;
  onCloseStatus: () => void;
  statusForm: UpdateUserStatusPayload;
  setStatusForm: React.Dispatch<React.SetStateAction<UpdateUserStatusPayload>>;
  onStatusSubmit: (e: React.FormEvent) => void;

  // Metadata
  availableRoles: RoleItem[];
  availableDepartments: DepartmentItem[];
  isSubmitting: boolean;
  formError: string | null;
}

export const UserListModals: React.FC<UserListModalsProps> = ({
  isCreateModalOpen,
  onCloseCreate,
  createForm,
  setCreateForm,
  onCreateSubmit,
  isEditModalOpen,
  onCloseEdit,
  selectedUser,
  editForm,
  setEditForm,
  onEditSubmit,
  isStatusModalOpen,
  onCloseStatus,
  statusForm,
  setStatusForm,
  onStatusSubmit,
  availableRoles,
  availableDepartments,
  isSubmitting,
  formError,
}) => {
  return (
    <>
      {/* CREATE USER MODAL */}
      <FormModal
        isOpen={isCreateModalOpen}
        onClose={onCloseCreate}
        title="Create New User Account"
        subtitle="Provision a new employee, admin, or client account with role and department assignments."
        errorMessage={formError}
        isSubmitting={isSubmitting}
        submitLabel="Create User Account"
        onSubmit={onCreateSubmit}
        maxWidth="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Account Type"
              required
              options={[
                { value: 'EMPLOYEE', label: 'Employee (Internal Staff)' },
                { value: 'ADMIN', label: 'Admin (System Administrator)' },
                { value: 'CLIENT', label: 'Client (External Partner)' },
              ]}
              value={createForm.userType}
              onChange={(e) =>
                setCreateForm((prev) => ({
                  ...prev,
                  userType: e.target.value as CreatableUserType,
                }))
              }
            />

            <Input
              label="Full Name"
              required
              placeholder="e.g. Vikram Sharma"
              value={createForm.name}
              onChange={(e) => setCreateForm((prev) => ({ ...prev, name: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              type="email"
              required
              placeholder="e.g. vikram.sharma@slashinfotech.com"
              value={createForm.email}
              onChange={(e) => setCreateForm((prev) => ({ ...prev, email: e.target.value }))}
              helperText="An initial verification code will be dispatched to this address."
            />

            <Input
              label="Mobile Number"
              placeholder="+919876543210"
              value={createForm.phone || ''}
              onChange={(e) => setCreateForm((prev) => ({ ...prev, phone: e.target.value }))}
              helperText="Indian mobile format (+91 followed by 10 digits)"
            />
          </div>

          {createForm.userType === 'EMPLOYEE' && (
            <Input
              label="Job Designation"
              placeholder="e.g. Senior Software Engineer"
              value={createForm.designation || ''}
              onChange={(e) => setCreateForm((prev) => ({ ...prev, designation: e.target.value }))}
            />
          )}

          {/* Department Selection */}
          <Select
            label="Department"
            placeholder="Select Primary Department (Optional)"
            value={createForm.departments?.[0] || ''}
            options={[
              { value: '', label: 'Select Primary Department (Optional)' },
              ...availableDepartments.map((dept) => ({
                value: dept.id,
                label: `${dept.name} (${dept.code})`,
              })),
            ]}
            onChange={(e) => {
              const val = e.target.value;
              setCreateForm((prev) => ({
                ...prev,
                departments: val ? [val] : [],
              }));
            }}
          />

          {/* Role Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Assign Roles</label>
            <div className="p-3 border border-slate-200 rounded-lg max-h-40 overflow-y-auto space-y-2 bg-slate-50/50">
              {availableRoles.length === 0 ? (
                <p className="text-xs text-slate-400">Loading roles...</p>
              ) : (
                availableRoles
                  .filter((r) => r.code !== 'SUPER_ADMIN')
                  .map((role) => {
                    const isChecked = createForm.roles?.includes(role.id) || createForm.roles?.includes(role.code);
                    return (
                      <label
                        key={role.id}
                        className="flex items-center gap-2.5 text-xs text-slate-800 cursor-pointer hover:text-slate-900 select-none"
                      >
                        <input
                          type="checkbox"
                          checked={!!isChecked}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setCreateForm((prev) => {
                              const curr = prev.roles || [];
                              return {
                                ...prev,
                                roles: checked
                                  ? [...curr, role.id]
                                  : curr.filter((r) => r !== role.id && r !== role.code),
                              };
                            });
                          }}
                          className="w-4 h-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary"
                        />
                        <span className="font-medium">{role.name}</span>
                        <span className="text-slate-400 font-mono text-[11px]">({role.code})</span>
                      </label>
                    );
                  })
              )}
            </div>
            <p className="text-xs text-slate-500">
              Users can be assigned multiple roles to combine capabilities.
            </p>
          </div>
        </div>
      </FormModal>

      {/* EDIT USER MODAL */}
      <FormModal
        isOpen={isEditModalOpen}
        onClose={onCloseEdit}
        title="Edit User Profile"
        subtitle={`Update profile information for ${selectedUser?.name || 'user'}.`}
        errorMessage={formError}
        isSubmitting={isSubmitting}
        submitLabel="Save Changes"
        onSubmit={onEditSubmit}
      >
        <div className="space-y-4">
          <Input
            label="Full Name"
            required
            placeholder="User full name"
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
            label="Designation / Job Title"
            placeholder="e.g. Senior Software Engineer"
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
        subtitle={`Update operational status for ${selectedUser?.name} (${selectedUser?.userCode}).`}
        errorMessage={formError}
        isSubmitting={isSubmitting}
        submitLabel="Update Status"
        onSubmit={onStatusSubmit}
      >
        <div className="space-y-4">
          <Select
            label="Operational Status"
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
              placeholder="e.g. Employee requested leave of absence, or policy review required."
              value={statusForm.reason || ''}
              onChange={(e) => setStatusForm((prev) => ({ ...prev, reason: e.target.value }))}
            />
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 leading-relaxed">
            <strong>Security Notice:</strong> Setting an account to <strong>INACTIVE</strong> immediately revokes all active sessions, invalidates refresh tokens, and prevents new sign-ins.
          </div>
        </div>
      </FormModal>
    </>
  );
};
