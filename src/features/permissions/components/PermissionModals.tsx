import React from 'react';
import { FormModal } from '@/components/templates/FormModal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { PermissionItem, CreatePermissionDto, UpdatePermissionDto, RecordStatus } from '@/api/types/roles.types';

interface PermissionModalsProps {
  isCreateModalOpen: boolean;
  onCloseCreate: () => void;
  createForm: CreatePermissionDto;
  onCreateModuleChange: (val: string) => void;
  onCreateActionChange: (val: string) => void;
  onCreateFieldChange: (field: keyof CreatePermissionDto, val: string) => void;
  onCreateSubmit: (e: React.FormEvent) => Promise<void>;

  isEditModalOpen: boolean;
  onCloseEdit: () => void;
  selectedPermission: PermissionItem | null;
  editForm: UpdatePermissionDto;
  onEditFieldChange: (field: keyof UpdatePermissionDto, val: unknown) => void;
  onEditSubmit: (e: React.FormEvent) => Promise<void>;

  isViewModalOpen: boolean;
  onCloseView: () => void;

  isSubmitting: boolean;
  formError: string | null;
}

export const PermissionModals: React.FC<PermissionModalsProps> = ({
  isCreateModalOpen,
  onCloseCreate,
  createForm,
  onCreateModuleChange,
  onCreateActionChange,
  onCreateFieldChange,
  onCreateSubmit,
  isEditModalOpen,
  onCloseEdit,
  selectedPermission,
  editForm,
  onEditFieldChange,
  onEditSubmit,
  isViewModalOpen,
  onCloseView,
  isSubmitting,
  formError,
}) => {
  return (
    <>
      {/* Create Permission Modal */}
      <FormModal
        isOpen={isCreateModalOpen}
        onClose={onCloseCreate}
        title="Create System Permission"
        subtitle="Register a new discrete action code for access control."
        onSubmit={onCreateSubmit}
        isSubmitting={isSubmitting}
        submitLabel="Create Permission"
        errorMessage={formError}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Module Group"
            placeholder="e.g. leads"
            value={createForm.module}
            onChange={(e) => onCreateModuleChange(e.target.value)}
            required
          />
          <Input
            label="Action"
            placeholder="e.g. export"
            value={createForm.action}
            onChange={(e) => onCreateActionChange(e.target.value)}
            required
          />
        </div>

        <Input
          label="Permission Code (Auto-Formatted)"
          placeholder="e.g. leads.export"
          value={createForm.code}
          onChange={(e) => onCreateFieldChange('code', e.target.value.toLowerCase())}
          helperText="Must match module.action format."
          required
        />

        <Input
          label="Display Name"
          placeholder="e.g. Export CRM Leads"
          value={createForm.name}
          onChange={(e) => onCreateFieldChange('name', e.target.value)}
          required
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-700">Description</label>
          <textarea
            rows={3}
            value={createForm.description}
            onChange={(e) => onCreateFieldChange('description', e.target.value)}
            placeholder="What capability does this permission grant..."
            className="w-full text-sm p-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
          />
        </div>
      </FormModal>

      {/* Edit Permission Modal */}
      <FormModal
        isOpen={isEditModalOpen}
        onClose={onCloseEdit}
        title={`Edit Permission: ${selectedPermission?.name}`}
        subtitle={`Code: ${selectedPermission?.code}`}
        onSubmit={onEditSubmit}
        isSubmitting={isSubmitting}
        submitLabel="Save Changes"
        errorMessage={formError}
      >
        <Input
          label="Display Name"
          value={editForm.name}
          onChange={(e) => onEditFieldChange('name', e.target.value)}
          required
        />
        <Select
          label="Status"
          value={editForm.status}
          options={[
            { value: 'ACTIVE', label: 'ACTIVE' },
            { value: 'INACTIVE', label: 'INACTIVE' },
          ]}
          onChange={(e) => onEditFieldChange('status', e.target.value as RecordStatus)}
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-700">Description</label>
          <textarea
            rows={3}
            value={editForm.description}
            onChange={(e) => onEditFieldChange('description', e.target.value)}
            placeholder="Describe this permission..."
            className="w-full text-sm p-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
          />
        </div>
      </FormModal>

      {/* View Permission Modal */}
      <FormModal
        isOpen={isViewModalOpen}
        onClose={onCloseView}
        title="Permission Details"
        subtitle={selectedPermission?.name}
        onSubmit={(e) => {
          e.preventDefault();
          onCloseView();
        }}
        submitLabel="Close"
      >
        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-xs text-slate-400">Permission ID</span>
            <span className="font-mono text-xs text-slate-800">{selectedPermission?.id}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-xs text-slate-400">Code</span>
            <span className="font-mono text-xs font-bold text-brand-primary">
              {selectedPermission?.code}
            </span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-xs text-slate-400">Module</span>
            <span className="text-xs font-semibold uppercase">{selectedPermission?.module}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-xs text-slate-400">Action</span>
            <span className="text-xs font-mono">{selectedPermission?.action}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-xs text-slate-400">Status</span>
            <Badge variant={selectedPermission?.status === 'ACTIVE' ? 'success' : 'neutral'} size="sm">
              {selectedPermission?.status}
            </Badge>
          </div>
          <div className="py-1.5">
            <span className="text-xs text-slate-400 block mb-1">Description</span>
            <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              {selectedPermission?.description || 'No description provided.'}
            </p>
          </div>
        </div>
      </FormModal>
    </>
  );
};
