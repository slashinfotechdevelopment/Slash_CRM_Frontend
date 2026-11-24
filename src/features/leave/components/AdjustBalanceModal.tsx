import React from 'react';
import { FormModal } from '@/components/templates/FormModal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { LeaveType } from '@/api/types/leave.types';
import { UserItem } from '@/api/types/users.types';

interface AdjustBalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: UserItem[];
  leaveTypes: LeaveType[];
  adjustForm: {
    userId: string;
    leaveTypeId: string;
    adjustedDays: number;
    reason: string;
  };
  setAdjustForm: React.Dispatch<
    React.SetStateAction<{
      userId: string;
      leaveTypeId: string;
      adjustedDays: number;
      reason: string;
    }>
  >;
  isSubmitting: boolean;
  errorMessage: string | null;
  onSubmit: () => Promise<void>;
}

export const AdjustBalanceModal: React.FC<AdjustBalanceModalProps> = ({
  isOpen,
  onClose,
  users,
  leaveTypes,
  adjustForm,
  setAdjustForm,
  isSubmitting,
  errorMessage,
  onSubmit,
}) => {
  return (
    <FormModal
      isOpen={isOpen}
      onClose={() => {
        if (!isSubmitting) onClose();
      }}
      title="Manual Leave Balance Adjustment"
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      submitLabel="Commit Adjustment"
    >
      <div className="space-y-4 text-xs">
        {errorMessage && (
          <div className="p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
            {errorMessage}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">
            Select Employee <span className="text-red-500">*</span>
          </label>
          <Select
            value={adjustForm.userId}
            onChange={(e) => setAdjustForm((prev) => ({ ...prev, userId: e.target.value }))}
            options={users.map((u) => ({
              label: `${u.name} (${u.email})`,
              value: u.id,
            }))}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">
            Select Leave Type <span className="text-red-500">*</span>
          </label>
          <Select
            value={adjustForm.leaveTypeId}
            onChange={(e) => setAdjustForm((prev) => ({ ...prev, leaveTypeId: e.target.value }))}
            options={leaveTypes.map((t) => ({
              label: t.name,
              value: t.id,
            }))}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">
            Adjustment Delta Days (Positive to Credit, Negative to Debit) <span className="text-red-500">*</span>
          </label>
          <Input
            type="number"
            step="0.5"
            value={String(adjustForm.adjustedDays)}
            onChange={(e) =>
              setAdjustForm((prev) => ({
                ...prev,
                adjustedDays: parseFloat(e.target.value) || 0,
              }))
            }
          />
          <span className="text-[10px] text-neutral-500 mt-1 block">
            Example: 2.0 to grant 2 extra days, -1.0 to deduct 1 day.
          </span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">
            Audit Reason & Justification <span className="text-red-500">*</span>
          </label>
          <textarea
            value={adjustForm.reason}
            onChange={(e) => setAdjustForm((prev) => ({ ...prev, reason: e.target.value }))}
            rows={3}
            placeholder="e.g. Compensatory off grant for production weekend deployment..."
            className="w-full text-xs p-2.5 rounded-lg border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>
      </div>
    </FormModal>
  );
};
