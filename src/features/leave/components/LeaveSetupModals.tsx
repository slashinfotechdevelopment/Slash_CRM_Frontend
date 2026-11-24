import React from 'react';
import { FormModal } from '@/components/templates/FormModal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import {
  LeaveType,
  LeaveCategory,
  LeaveAccrualFrequency,
  CreateLeaveTypePayload,
  UpdateLeaveTypePayload,
  CreatePolicyVersionPayload,
} from '@/api/types/leave.types';

interface LeaveSetupModalsProps {
  isCreateModalOpen: boolean;
  onCloseCreate: () => void;
  createForm: CreateLeaveTypePayload;
  setCreateForm: React.Dispatch<React.SetStateAction<CreateLeaveTypePayload>>;
  isSubmittingCreate: boolean;
  createError: string | null;
  onCreateSubmit: () => Promise<void>;

  editingType: LeaveType | null;
  onCloseEdit: () => void;
  editForm: UpdateLeaveTypePayload;
  setEditForm: React.Dispatch<React.SetStateAction<UpdateLeaveTypePayload>>;
  isSubmittingEdit: boolean;
  editError: string | null;
  onEditSubmit: () => Promise<void>;

  selectedType: LeaveType | null;
  isVersionModalOpen: boolean;
  onCloseVersion: () => void;
  versionForm: CreatePolicyVersionPayload;
  setVersionForm: React.Dispatch<React.SetStateAction<CreatePolicyVersionPayload>>;
  isSubmittingVersion: boolean;
  versionError: string | null;
  onVersionSubmit: () => Promise<void>;
}

export const LeaveSetupModals: React.FC<LeaveSetupModalsProps> = ({
  isCreateModalOpen,
  onCloseCreate,
  createForm,
  setCreateForm,
  isSubmittingCreate,
  createError,
  onCreateSubmit,
  editingType,
  onCloseEdit,
  editForm,
  setEditForm,
  isSubmittingEdit,
  editError,
  onEditSubmit,
  selectedType,
  isVersionModalOpen,
  onCloseVersion,
  versionForm,
  setVersionForm,
  isSubmittingVersion,
  versionError,
  onVersionSubmit,
}) => {
  return (
    <>
      {/* Create Leave Type Modal */}
      <FormModal
        isOpen={isCreateModalOpen}
        onClose={onCloseCreate}
        title="Create New Leave Type"
        onSubmit={onCreateSubmit}
        isSubmitting={isSubmittingCreate}
        submitLabel="Create Leave Type"
      >
        <div className="space-y-4 text-xs">
          {createError && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
              {createError}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Type Code (e.g. CASUAL, SICK) <span className="text-red-500">*</span>
              </label>
              <Input
                value={createForm.code}
                onChange={(e) => setCreateForm({ ...createForm, code: e.target.value.toUpperCase() })}
                placeholder="CASUAL"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Leave Name <span className="text-red-500">*</span>
              </label>
              <Input
                value={createForm.name}
                onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                placeholder="Casual Leave"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Category</label>
              <Select
                value={createForm.category}
                onChange={(e) => setCreateForm({ ...createForm, category: e.target.value as LeaveCategory })}
                options={[
                  { label: 'Paid Leave', value: 'PAID' },
                  { label: 'Unpaid / Loss of Pay', value: 'UNPAID' },
                  { label: 'Compensatory Off', value: 'COMPENSATORY' },
                ]}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Annual Allocation (Days)</label>
              <Input
                type="number"
                step="0.5"
                value={String(createForm.annualAllocation)}
                onChange={(e) => setCreateForm({ ...createForm, annualAllocation: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Accrual Frequency</label>
              <Select
                value={createForm.accrualFrequency}
                onChange={(e) => setCreateForm({ ...createForm, accrualFrequency: e.target.value as LeaveAccrualFrequency })}
                options={[
                  { label: 'Annual (All upfront)', value: 'ANNUAL' },
                  { label: 'Monthly Credit', value: 'MONTHLY' },
                  { label: 'Quarterly Credit', value: 'QUARTERLY' },
                ]}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Carry Forward Cap (Days)</label>
              <Input
                type="number"
                value={String(createForm.carryForwardLimit)}
                onChange={(e) => setCreateForm({ ...createForm, carryForwardLimit: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="flex items-center gap-4 pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={createForm.allowHalfDay}
                onChange={(e) => setCreateForm({ ...createForm, allowHalfDay: e.target.checked })}
                className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500 h-4 w-4"
              />
              <span>Allow Half-Day</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={createForm.requiresDocument}
                onChange={(e) => setCreateForm({ ...createForm, requiresDocument: e.target.checked })}
                className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500 h-4 w-4"
              />
              <span>Require Certificate</span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">Description</label>
            <textarea
              value={createForm.description}
              onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
              rows={2}
              className="w-full text-xs p-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
        </div>
      </FormModal>

      {/* Edit Leave Type Modal */}
      {editingType && (
        <FormModal
          isOpen={!!editingType}
          onClose={onCloseEdit}
          title={`Edit Leave Type: ${editingType.name}`}
          onSubmit={onEditSubmit}
          isSubmitting={isSubmittingEdit}
          submitLabel="Save Changes"
        >
          <div className="space-y-4 text-xs">
            {editError && (
              <div className="p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
                {editError}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <Input
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Category</label>
                <Select
                  value={editForm.category}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value as LeaveCategory })}
                  options={[
                    { label: 'Paid Leave', value: 'PAID' },
                    { label: 'Unpaid / Loss of Pay', value: 'UNPAID' },
                    { label: 'Compensatory Off', value: 'COMPENSATORY' },
                  ]}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Payment Classification</label>
                <Select
                  value={editForm.isPaid ? 'PAID' : 'UNPAID'}
                  onChange={(e) => setEditForm({ ...editForm, isPaid: e.target.value === 'PAID' })}
                  options={[
                    { label: 'Paid', value: 'PAID' },
                    { label: 'Unpaid', value: 'UNPAID' },
                  ]}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Description</label>
              <textarea
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                rows={2}
                className="w-full text-xs p-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>

            <div className="flex items-center gap-4 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editForm.isActive}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setEditForm({ ...editForm, isActive: checked, status: checked ? 'ACTIVE' : 'INACTIVE' });
                  }}
                  className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500 h-4 w-4"
                />
                <span className="font-semibold text-neutral-800">Active Status</span>
              </label>
            </div>
          </div>
        </FormModal>
      )}

      {/* New Policy Version Modal */}
      {selectedType && (
        <FormModal
          isOpen={isVersionModalOpen}
          onClose={onCloseVersion}
          title={`Create Policy Version for ${selectedType.name}`}
          onSubmit={onVersionSubmit}
          isSubmitting={isSubmittingVersion}
          submitLabel="Publish Version"
        >
          <div className="space-y-4 text-xs">
            {versionError && (
              <div className="p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
                {versionError}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Effective From <span className="text-red-500">*</span>
                </label>
                <Input
                  type="date"
                  value={versionForm.effectiveFrom}
                  onChange={(e) => setVersionForm({ ...versionForm, effectiveFrom: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Annual Allocation (Days)</label>
                <Input
                  type="number"
                  step="0.5"
                  value={String(versionForm.annualAllocation)}
                  onChange={(e) => setVersionForm({ ...versionForm, annualAllocation: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Accrual Frequency</label>
                <Select
                  value={versionForm.accrualFrequency}
                  onChange={(e) => setVersionForm({ ...versionForm, accrualFrequency: e.target.value as LeaveAccrualFrequency })}
                  options={[
                    { label: 'Annual (All upfront)', value: 'ANNUAL' },
                    { label: 'Monthly Credit', value: 'MONTHLY' },
                    { label: 'Quarterly Credit', value: 'QUARTERLY' },
                  ]}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Carry Forward Cap</label>
                <Input
                  type="number"
                  value={String(versionForm.carryForwardLimit)}
                  onChange={(e) => setVersionForm({ ...versionForm, carryForwardLimit: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="flex items-center gap-4 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={versionForm.allowHalfDay}
                  onChange={(e) => setVersionForm({ ...versionForm, allowHalfDay: e.target.checked })}
                  className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500 h-4 w-4"
                />
                <span>Allow Half-Day</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={versionForm.excludeWeeklyOffs}
                  onChange={(e) => setVersionForm({ ...versionForm, excludeWeeklyOffs: e.target.checked })}
                  className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500 h-4 w-4"
                />
                <span>Exclude Weekly-Offs</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={versionForm.excludeHolidays}
                  onChange={(e) => setVersionForm({ ...versionForm, excludeHolidays: e.target.checked })}
                  className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500 h-4 w-4"
                />
                <span>Exclude Holidays</span>
              </label>
            </div>
          </div>
        </FormModal>
      )}
    </>
  );
};
