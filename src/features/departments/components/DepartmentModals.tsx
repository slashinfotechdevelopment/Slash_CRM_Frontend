import { FormModal } from '@/components/templates/FormModal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import {
  DepartmentItem,
  CreateDepartmentDto,
  UpdateDepartmentDto,
  RecordStatus,
} from '@/api/types/roles.types';

interface DepartmentModalsProps {
  isCreateModalOpen: boolean;
  onCloseCreate: () => void;
  createForm: CreateDepartmentDto;
  setCreateForm: React.Dispatch<React.SetStateAction<CreateDepartmentDto>>;
  onCreateSubmit: (e: React.FormEvent) => void;

  isEditModalOpen: boolean;
  onCloseEdit: () => void;
  editForm: UpdateDepartmentDto;
  setEditForm: React.Dispatch<React.SetStateAction<UpdateDepartmentDto>>;
  onEditSubmit: (e: React.FormEvent) => void;

  isViewModalOpen: boolean;
  onCloseView: () => void;
  selectedDepartment: DepartmentItem | null;

  parentOptions: { value: string; label: string }[];
  isSubmitting: boolean;
  formError: string | null;
}

export const DepartmentModals: React.FC<DepartmentModalsProps> = ({
  isCreateModalOpen,
  onCloseCreate,
  createForm,
  setCreateForm,
  onCreateSubmit,
  isEditModalOpen,
  onCloseEdit,
  editForm,
  setEditForm,
  onEditSubmit,
  isViewModalOpen,
  onCloseView,
  selectedDepartment,
  parentOptions,
  isSubmitting,
  formError,
}) => {
  return (
    <>
      {/* Create Department Modal */}
      <FormModal
        isOpen={isCreateModalOpen}
        onClose={onCloseCreate}
        title="Create Department"
        subtitle="Provision a dynamic department for your organization."
        onSubmit={onCreateSubmit}
        isSubmitting={isSubmitting}
        submitLabel="Create Department"
        errorMessage={formError}
      >
        <Input
          label="Department Code"
          placeholder="e.g. MARKETING"
          value={createForm.code}
          onChange={(e) => setCreateForm((p: CreateDepartmentDto) => ({ ...p, code: e.target.value.toUpperCase() }))}
          helperText="Uppercase alphanumeric letters and underscores only."
          required
        />
        <Input
          label="Department Name"
          placeholder="e.g. Marketing & Communications"
          value={createForm.name}
          onChange={(e) => setCreateForm((p: CreateDepartmentDto) => ({ ...p, name: e.target.value }))}
          required
        />
        <Select
          label="Parent Department (Optional Hierarchy)"
          placeholder="None (Root Level Department)"
          value={createForm.parentId || ''}
          options={parentOptions}
          onChange={(e) => setCreateForm((p: CreateDepartmentDto) => ({ ...p, parentId: e.target.value }))}
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-700">Description (Optional)</label>
          <textarea
            rows={3}
            value={createForm.description}
            onChange={(e) => setCreateForm((p: CreateDepartmentDto) => ({ ...p, description: e.target.value }))}
            placeholder="Operational scope of this department..."
            className="w-full text-sm p-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
          />
        </div>
      </FormModal>

      {/* Edit Department Modal */}
      <FormModal
        isOpen={isEditModalOpen}
        onClose={onCloseEdit}
        title={`Edit Department: ${selectedDepartment?.name || ''}`}
        subtitle={`Code: ${selectedDepartment?.code || ''}`}
        onSubmit={onEditSubmit}
        isSubmitting={isSubmitting}
        submitLabel="Save Changes"
        errorMessage={formError}
      >
        <Input
          label="Department Name"
          value={editForm.name}
          onChange={(e) => setEditForm((p: UpdateDepartmentDto) => ({ ...p, name: e.target.value }))}
          required
        />
        <Select
          label="Parent Department"
          placeholder="None (Root Level Department)"
          value={editForm.parentId || ''}
          options={parentOptions.filter((o) => o.value !== selectedDepartment?.id)}
          onChange={(e) => setEditForm((p: UpdateDepartmentDto) => ({ ...p, parentId: e.target.value }))}
        />
        <Select
          label="Status"
          value={editForm.status}
          options={[
            { value: 'ACTIVE', label: 'ACTIVE' },
            { value: 'INACTIVE', label: 'INACTIVE' },
          ]}
          onChange={(e) => setEditForm((p: UpdateDepartmentDto) => ({ ...p, status: e.target.value as RecordStatus }))}
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-700">Description</label>
          <textarea
            rows={3}
            value={editForm.description}
            onChange={(e) => setEditForm((p: UpdateDepartmentDto) => ({ ...p, description: e.target.value }))}
            placeholder="Description..."
            className="w-full text-sm p-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
          />
        </div>
      </FormModal>

      {/* View Department Modal */}
      <FormModal
        isOpen={isViewModalOpen}
        onClose={onCloseView}
        title="Department Overview"
        subtitle={selectedDepartment?.name}
        onSubmit={(e) => {
          e.preventDefault();
          onCloseView();
        }}
        submitLabel="Close"
        showCancel={false}
      >
        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-xs text-slate-400">Department ID</span>
            <span className="font-mono text-xs text-slate-800">{selectedDepartment?.id || '—'}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-xs text-slate-400">Code</span>
            <span className="font-mono text-xs font-bold text-brand-primary">
              {selectedDepartment?.code || '—'}
            </span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-xs text-slate-400">Parent Department</span>
            <span className="text-xs font-semibold text-slate-800">
              {selectedDepartment?.parent?.name || (selectedDepartment as unknown as { parentDepartment?: { name?: string } })?.parentDepartment?.name || 'Root Level'}
            </span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-xs text-slate-400">Assigned Employees</span>
            <span className="text-xs font-bold text-emerald-700">
              {(selectedDepartment as unknown as { userCount?: number; statistics?: { totalEmployees?: number } })?.userCount ?? selectedDepartment?.employeeCount ?? (selectedDepartment as unknown as { statistics?: { totalEmployees?: number } })?.statistics?.totalEmployees ?? 0} members
            </span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-xs text-slate-400">Status</span>
            <Badge variant={selectedDepartment?.status === 'ACTIVE' ? 'success' : 'neutral'} dot size="sm">
              {selectedDepartment?.status || 'ACTIVE'}
            </Badge>
          </div>
          <div className="py-1.5">
            <span className="text-xs text-slate-400 block mb-1">Description</span>
            <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              {selectedDepartment?.description || 'No description provided.'}
            </p>
          </div>
        </div>
      </FormModal>
    </>
  );
};
