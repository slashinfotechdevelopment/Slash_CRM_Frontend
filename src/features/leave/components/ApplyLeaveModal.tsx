import React from 'react';
import { FormModal } from '@/components/templates/FormModal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { LeaveType, LeaveBalance } from '@/api/types/leave.types';

interface ApplyLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  leaveTypes: LeaveType[];
  selectedTypeBalance?: LeaveBalance;
  applyForm: {
    leaveTypeId: string;
    startDate: string;
    endDate: string;
    isHalfDay: boolean;
    halfDayPeriod: 'FIRST_HALF' | 'SECOND_HALF';
    reason: string;
  };
  setApplyForm: React.Dispatch<
    React.SetStateAction<{
      leaveTypeId: string;
      startDate: string;
      endDate: string;
      isHalfDay: boolean;
      halfDayPeriod: 'FIRST_HALF' | 'SECOND_HALF';
      reason: string;
    }>
  >;
  estimatedDays: number;
  isApplying: boolean;
  applyError: string | null;
  onSubmit: () => Promise<void>;
}

export const ApplyLeaveModal: React.FC<ApplyLeaveModalProps> = ({
  isOpen,
  onClose,
  leaveTypes,
  selectedTypeBalance,
  applyForm,
  setApplyForm,
  estimatedDays,
  isApplying,
  applyError,
  onSubmit,
}) => {
  return (
    <FormModal
      isOpen={isOpen}
      onClose={() => {
        if (!isApplying) onClose();
      }}
      title="Apply for Leave"
      onSubmit={onSubmit}
      isSubmitting={isApplying}
      submitLabel="Submit Application"
    >
      <div className="space-y-4 text-sm">
        {applyError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs">
            {applyError}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">
            Leave Type <span className="text-red-500">*</span>
          </label>
          <Select
            value={applyForm.leaveTypeId}
            onChange={(e) => setApplyForm({ ...applyForm, leaveTypeId: e.target.value })}
            options={leaveTypes.map((t) => ({
              label: `${t.name} (${t.isPaid ? 'Paid' : 'Unpaid'})`,
              value: t.id,
            }))}
          />
          {selectedTypeBalance && (
            <div className="mt-1.5 text-xs text-neutral-500 flex items-center justify-between bg-neutral-50 p-2 rounded border border-neutral-200">
              <span>Available Balance:</span>
              <span className="font-semibold text-neutral-900">
                {selectedTypeBalance.availableDays} days
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="isHalfDay"
            checked={applyForm.isHalfDay}
            onChange={(e) =>
              setApplyForm({
                ...applyForm,
                isHalfDay: e.target.checked,
                endDate: e.target.checked ? applyForm.startDate : applyForm.endDate,
              })
            }
            className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500 h-4 w-4"
          />
          <label htmlFor="isHalfDay" className="text-xs font-medium text-neutral-800 cursor-pointer">
            Apply for Half-Day (0.5 day)
          </label>
        </div>

        {applyForm.isHalfDay && (
          <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-200 space-y-2">
            <label className="block text-xs font-semibold text-blue-900">Half-Day Session:</label>
            <div className="flex items-center gap-4 text-xs">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="halfDayPeriod"
                  value="FIRST_HALF"
                  checked={applyForm.halfDayPeriod === 'FIRST_HALF'}
                  onChange={() => setApplyForm({ ...applyForm, halfDayPeriod: 'FIRST_HALF' })}
                />
                <span>First Half (Morning)</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="halfDayPeriod"
                  value="SECOND_HALF"
                  checked={applyForm.halfDayPeriod === 'SECOND_HALF'}
                  onChange={() => setApplyForm({ ...applyForm, halfDayPeriod: 'SECOND_HALF' })}
                />
                <span>Second Half (Afternoon)</span>
              </label>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              {applyForm.isHalfDay ? 'Date' : 'Start Date'} <span className="text-red-500">*</span>
            </label>
            <Input
              type="date"
              value={applyForm.startDate}
              onChange={(e) => {
                const val = e.target.value;
                setApplyForm((prev) => ({
                  ...prev,
                  startDate: val,
                  endDate: prev.isHalfDay ? val : prev.endDate || val,
                }));
              }}
            />
          </div>

          {!applyForm.isHalfDay && (
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                End Date <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                value={applyForm.endDate}
                min={applyForm.startDate}
                onChange={(e) => setApplyForm({ ...applyForm, endDate: e.target.value })}
              />
            </div>
          )}
        </div>

        <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 flex items-center justify-between text-xs">
          <span className="text-neutral-600">Calculated Working Days:</span>
          <span className="font-bold text-neutral-900 text-sm">
            {estimatedDays} {estimatedDays === 1 ? 'day' : 'days'}
          </span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">
            Reason / Justification <span className="text-red-500">*</span>
          </label>
          <textarea
            value={applyForm.reason}
            onChange={(e) => setApplyForm({ ...applyForm, reason: e.target.value })}
            rows={3}
            placeholder="Brief reason for your leave request..."
            className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
          />
        </div>
      </div>
    </FormModal>
  );
};
