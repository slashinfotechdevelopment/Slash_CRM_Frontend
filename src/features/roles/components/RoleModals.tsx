import { FormModal } from '@/components/templates/FormModal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { RoleItem, CreateRoleDto, UpdateRoleDto, RecordStatus } from '@/api/types/roles.types';

interface RoleModalsProps {
  isCreateModalOpen: boolean;
  onCloseCreate: () => void;
  createForm: CreateRoleDto;
  setCreateForm: React.Dispatch<React.SetStateAction<CreateRoleDto>>;
  onCreateSubmit: (e: React.FormEvent) => void;

  isEditModalOpen: boolean;
  onCloseEdit: () => void;
  selectedRole: RoleItem | null;
  editForm: UpdateRoleDto;
  setEditForm: React.Dispatch<React.SetStateAction<UpdateRoleDto>>;
  onEditSubmit: (e: React.FormEvent) => void;

  isSubmitting: boolean;
  formError: string | null;
}

export const RoleModals: React.FC<RoleModalsProps> = ({
  isCreateModalOpen,
  onCloseCreate,
  createForm,
  setCreateForm,
  onCreateSubmit,
  isEditModalOpen,
  onCloseEdit,
  selectedRole,
  editForm,
  setEditForm,
  onEditSubmit,
  isSubmitting,
  formError,
}) => {
  return (
    <>
      {/* Create Role Modal */}
      <FormModal
        isOpen={isCreateModalOpen}
        onClose={onCloseCreate}
        title="Create Custom Role"
        subtitle="Define a new role code and display name for organizational permissions."
        onSubmit={onCreateSubmit}
        isSubmitting={isSubmitting}
        submitLabel="Create Role"
        errorMessage={formError}
      >
        <Input
          label="Role Code"
          placeholder="e.g. REGIONAL_SALES_LEAD"
          value={createForm.code}
          onChange={(e) => setCreateForm((p: CreateRoleDto) => ({ ...p, code: e.target.value.toUpperCase() }))}
          helperText="Uppercase alphanumeric characters with underscores only."
          required
        />
        <Input
          label="Role Name"
          placeholder="e.g. Regional Sales Lead"
          value={createForm.name}
          onChange={(e) => setCreateForm((p: CreateRoleDto) => ({ ...p, name: e.target.value }))}
          required
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-700">Description (Optional)</label>
          <textarea
            rows={3}
            value={createForm.description}
            onChange={(e) => setCreateForm((p: CreateRoleDto) => ({ ...p, description: e.target.value }))}
            placeholder="Briefly describe the purpose of this role..."
            className="w-full text-sm p-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
          />
        </div>
      </FormModal>

      {/* Edit Role Modal */}
      <FormModal
        isOpen={isEditModalOpen}
        onClose={onCloseEdit}
        title={`Edit Role: ${selectedRole?.name || ''}`}
        subtitle={`Role Code: ${selectedRole?.code || ''}`}
        onSubmit={onEditSubmit}
        isSubmitting={isSubmitting}
        submitLabel="Save Changes"
        errorMessage={formError}
      >
        <Input
          label="Role Name"
          value={editForm.name}
          onChange={(e) => setEditForm((p: UpdateRoleDto) => ({ ...p, name: e.target.value }))}
          required
        />
        <Select
          label="Operational Status"
          value={editForm.status}
          options={[
            { value: 'ACTIVE', label: 'ACTIVE' },
            { value: 'INACTIVE', label: 'INACTIVE' },
          ]}
          onChange={(e) => setEditForm((p: UpdateRoleDto) => ({ ...p, status: e.target.value as RecordStatus }))}
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-700">Description</label>
          <textarea
            rows={3}
            value={editForm.description}
            onChange={(e) => setEditForm((p: UpdateRoleDto) => ({ ...p, description: e.target.value }))}
            placeholder="Role description..."
            className="w-full text-sm p-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
          />
        </div>
      </FormModal>
    </>
  );
};
