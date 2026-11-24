import React from 'react';
import { FormModal } from '@/components/templates/FormModal';
import { AttendanceRecord, ShiftDefinition } from '@/api/types/attendance.types';
import { formatDate } from '@/utils/formatters';

interface EffectiveShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRecord: AttendanceRecord | null;
  effectiveShift: ShiftDefinition | null;
  loadingShift: boolean;
}

export const EffectiveShiftModal: React.FC<EffectiveShiftModalProps> = ({
  isOpen,
  onClose,
  selectedRecord,
  effectiveShift,
  loadingShift,
}) => {
  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Effective Shift Policy"
      subtitle={
        selectedRecord
          ? `Shift assignment for ${selectedRecord.user?.name} on ${formatDate(selectedRecord.attendanceDate)}`
          : undefined
      }
      onSubmit={(e) => {
        e.preventDefault();
        onClose();
      }}
      submitLabel="Close"
      submitVariant="primary"
    >
      {loadingShift ? (
        <div className="py-8 text-center text-sm text-neutral-500">Loading effective shift...</div>
      ) : effectiveShift ? (
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3 bg-neutral-50 p-3 rounded-lg border border-neutral-200/60">
            <div>
              <span className="text-neutral-500 block">Shift Name</span>
              <span className="font-semibold text-neutral-900 text-sm">{effectiveShift.name}</span>
            </div>
            <div>
              <span className="text-neutral-500 block">Shift Code</span>
              <span className="font-mono text-neutral-900">{effectiveShift.code}</span>
            </div>
            <div>
              <span className="text-neutral-500 block">Timing</span>
              <span className="font-medium text-neutral-900">
                {effectiveShift.startTime} - {effectiveShift.endTime}
                {effectiveShift.isOvernight && ' (Overnight)'}
              </span>
            </div>
            <div>
              <span className="text-neutral-500 block">Grace Period</span>
              <span className="font-medium text-neutral-900">{effectiveShift.gracePeriodMinutes} mins</span>
            </div>
            <div>
              <span className="text-neutral-500 block">Half-Day Threshold</span>
              <span className="font-medium text-neutral-900">{effectiveShift.halfDayThresholdMinutes} mins</span>
            </div>
            <div>
              <span className="text-neutral-500 block">Full-Day Threshold</span>
              <span className="font-medium text-neutral-900">{effectiveShift.fullDayThresholdMinutes} mins</span>
            </div>
          </div>

          {effectiveShift.breakPolicy && (
            <div className="border-t border-neutral-200/60 pt-3">
              <span className="font-semibold text-neutral-800 block mb-1">
                Break Policy Allowance: {effectiveShift.breakPolicy.paidAllowanceMinutes} paid mins
              </span>
              <div className="space-y-1">
                {effectiveShift.breakPolicy.breakTypes?.map((b: { name?: string; code?: string; breakTypeId?: string; maxDurationMinutes?: number }, idx: number) => (
                  <div key={idx} className="flex justify-between text-neutral-600 bg-neutral-100/60 px-2 py-1 rounded">
                    <span>{b.name || b.code || b.breakTypeId}</span>
                    <span>Max {b.maxDurationMinutes} mins</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="py-8 text-center text-sm text-neutral-500">
          No effective shift assignment found for this date. Default organization policy applies.
        </div>
      )}
    </FormModal>
  );
};
