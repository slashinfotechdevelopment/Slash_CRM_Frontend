import React from 'react';
import { FormModal } from '@/components/templates/FormModal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ShiftDefinition } from '@/api/types/attendance.types';
import { UserItem } from '@/api/types/users.types';

interface ShiftModalsProps {
  // Shift modal
  isShiftModalOpen: boolean;
  onShiftModalClose: () => void;
  isEditingShift: boolean;
  shiftCode: string;
  onShiftCodeChange: (val: string) => void;
  shiftName: string;
  onShiftNameChange: (val: string) => void;
  startTime: string;
  onStartTimeChange: (val: string) => void;
  endTime: string;
  onEndTimeChange: (val: string) => void;
  isOvernight: boolean;
  onIsOvernightChange: (val: boolean) => void;
  gracePeriodMinutes: number;
  onGracePeriodMinutesChange: (val: number) => void;
  paidBreakAllowance: number;
  onPaidBreakAllowanceChange: (val: number) => void;
  halfDayThresholdMinutes: number;
  onHalfDayThresholdMinutesChange: (val: number) => void;
  fullDayThresholdMinutes: number;
  onFullDayThresholdMinutesChange: (val: number) => void;
  onShiftSubmit: (e: React.FormEvent) => void;
  isShiftSubmitting: boolean;

  // Assign modal
  isAssignModalOpen: boolean;
  onAssignModalClose: () => void;
  isEditingAssignment: boolean;
  assignUserId: string;
  onAssignUserIdChange: (val: string) => void;
  assignShiftId: string;
  onAssignShiftIdChange: (val: string) => void;
  assignStartDate: string;
  onAssignStartDateChange: (val: string) => void;
  assignEndDate: string;
  onAssignEndDateChange: (val: string) => void;
  usersList: UserItem[];
  shifts: ShiftDefinition[];
  onAssignSubmit: (e: React.FormEvent) => void;
  isAssignSubmitting: boolean;
}

export const ShiftModals: React.FC<ShiftModalsProps> = ({
  isShiftModalOpen,
  onShiftModalClose,
  isEditingShift,
  shiftCode,
  onShiftCodeChange,
  shiftName,
  onShiftNameChange,
  startTime,
  onStartTimeChange,
  endTime,
  onEndTimeChange,
  isOvernight,
  onIsOvernightChange,
  gracePeriodMinutes,
  onGracePeriodMinutesChange,
  paidBreakAllowance,
  onPaidBreakAllowanceChange,
  halfDayThresholdMinutes,
  onHalfDayThresholdMinutesChange,
  fullDayThresholdMinutes,
  onFullDayThresholdMinutesChange,
  onShiftSubmit,
  isShiftSubmitting,

  isAssignModalOpen,
  onAssignModalClose,
  isEditingAssignment,
  assignUserId,
  onAssignUserIdChange,
  assignShiftId,
  onAssignShiftIdChange,
  assignStartDate,
  onAssignStartDateChange,
  assignEndDate,
  onAssignEndDateChange,
  usersList,
  shifts,
  onAssignSubmit,
  isAssignSubmitting,
}) => {
  return (
    <>
      {/* Create / Edit Shift Definition Modal */}
      <FormModal
        isOpen={isShiftModalOpen}
        onClose={onShiftModalClose}
        title={isEditingShift ? 'Edit Shift Definition' : 'Create New Shift Definition'}
        subtitle="Configure daily work schedule, grace window, and threshold rules"
        onSubmit={onShiftSubmit}
        isSubmitting={isShiftSubmitting}
        submitLabel={isEditingShift ? 'Save Changes' : 'Create Shift'}
        submitVariant="primary"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Shift Code"
              placeholder="e.g. GENERAL_09_18"
              value={shiftCode}
              onChange={(e) => onShiftCodeChange(e.target.value)}
              disabled={isEditingShift}
              required
            />
            <Input
              label="Shift Name"
              placeholder="e.g. Day Shift (9 AM - 6 PM)"
              value={shiftName}
              onChange={(e) => onShiftNameChange(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Start Time (HH:mm)"
              type="time"
              value={startTime}
              onChange={(e) => onStartTimeChange(e.target.value)}
              required
            />
            <Input
              label="End Time (HH:mm)"
              type="time"
              value={endTime}
              onChange={(e) => onEndTimeChange(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center gap-2 py-1">
            <input
              type="checkbox"
              id="isOvernight"
              checked={isOvernight}
              onChange={(e) => onIsOvernightChange(e.target.checked)}
              className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="isOvernight" className="text-xs font-medium text-neutral-800">
              Overnight Shift (Crosses calendar midnight)
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Grace Period (Minutes)"
              type="number"
              value={gracePeriodMinutes}
              onChange={(e) => onGracePeriodMinutesChange(Number(e.target.value))}
              min={0}
              max={180}
            />
            <Input
              label="Paid Break Allowance (Minutes)"
              type="number"
              value={paidBreakAllowance}
              onChange={(e) => onPaidBreakAllowanceChange(Number(e.target.value))}
              min={0}
              max={360}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Half-Day Threshold (Minutes)"
              type="number"
              value={halfDayThresholdMinutes}
              onChange={(e) => onHalfDayThresholdMinutesChange(Number(e.target.value))}
              min={60}
              max={720}
            />
            <Input
              label="Full-Day Threshold (Minutes)"
              type="number"
              value={fullDayThresholdMinutes}
              onChange={(e) => onFullDayThresholdMinutesChange(Number(e.target.value))}
              min={120}
              max={1440}
            />
          </div>
        </div>
      </FormModal>

      {/* Assign Shift Modal */}
      <FormModal
        isOpen={isAssignModalOpen}
        onClose={onAssignModalClose}
        title={isEditingAssignment ? 'Edit Shift Assignment' : 'Assign Shift to Employee'}
        subtitle="Set or update employee shift schedule and valid date boundaries"
        onSubmit={onAssignSubmit}
        isSubmitting={isAssignSubmitting}
        submitLabel={isEditingAssignment ? 'Update Assignment' : 'Assign Shift'}
        submitVariant="primary"
      >
        <div className="space-y-4">
          <Select
            label="Employee"
            value={assignUserId}
            onChange={(e) => onAssignUserIdChange(e.target.value)}
            disabled={isEditingAssignment}
            options={usersList.map((u) => ({
              value: u.id,
              label: `${u.name} (${u.email})`,
            }))}
            required
          />

          <Select
            label="Shift Definition"
            value={assignShiftId}
            onChange={(e) => onAssignShiftIdChange(e.target.value)}
            options={shifts.map((s) => ({
              value: s.id,
              label: `${s.name} (${s.startTime} - ${s.endTime})`,
            }))}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Start Date"
              type="date"
              value={assignStartDate}
              onChange={(e) => onAssignStartDateChange(e.target.value)}
              required
            />
            <Input
              label="End Date (Optional)"
              type="date"
              value={assignEndDate}
              onChange={(e) => onAssignEndDateChange(e.target.value)}
            />
          </div>
        </div>
      </FormModal>
    </>
  );
};
