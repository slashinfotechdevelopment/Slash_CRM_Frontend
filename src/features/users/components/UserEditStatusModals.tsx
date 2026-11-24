import React from 'react';
import { FormModal } from '@/components/templates/FormModal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { UserDetail, UserStatus, UpdateUserPayload, UpdateUserStatusPayload } from '@/api/types/users.types';

export interface UserEditStatusModalsProps {
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
}

export const UserEditStatusModals: React.FC<UserEditStatusModalsProps> = ({
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
    </>
  );
};
