import React from 'react';
import { FormModal } from '@/components/templates/FormModal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

interface AttendanceActionModalsProps {
  isCheckInOpen: boolean;
  onCheckInClose: () => void;
  checkInLocation: string;
  onCheckInLocationChange: (val: string) => void;
  checkInRemarks: string;
  onCheckInRemarksChange: (val: string) => void;
  onCheckInSubmit: (e: React.FormEvent) => void;

  isCheckOutOpen: boolean;
  onCheckOutClose: () => void;
  checkOutRemarks: string;
  onCheckOutRemarksChange: (val: string) => void;
  onCheckOutSubmit: (e: React.FormEvent) => void;

  isStartBreakOpen: boolean;
  onStartBreakClose: () => void;
  selectedBreakType: string;
  onSelectedBreakTypeChange: (val: string) => void;
  breakRemarks: string;
  onBreakRemarksChange: (val: string) => void;
  onStartBreakSubmit: (e: React.FormEvent) => void;

  isSubmitting: boolean;
}

export const AttendanceActionModals: React.FC<AttendanceActionModalsProps> = ({
  isCheckInOpen,
  onCheckInClose,
  checkInLocation,
  onCheckInLocationChange,
  checkInRemarks,
  onCheckInRemarksChange,
  onCheckInSubmit,

  isCheckOutOpen,
  onCheckOutClose,
  checkOutRemarks,
  onCheckOutRemarksChange,
  onCheckOutSubmit,

  isStartBreakOpen,
  onStartBreakClose,
  selectedBreakType,
  onSelectedBreakTypeChange,
  breakRemarks,
  onBreakRemarksChange,
  onStartBreakSubmit,

  isSubmitting,
}) => {
  return (
    <>
      {/* Check In Modal */}
      <FormModal
        isOpen={isCheckInOpen}
        onClose={onCheckInClose}
        title="Employee Check In"
        subtitle="Confirm your attendance check-in for the active shift"
        onSubmit={onCheckInSubmit}
        isSubmitting={isSubmitting}
        submitLabel="Confirm Check In"
        submitVariant="primary"
      >
        <div className="space-y-4">
          <Input
            label="Location / Desk (Optional)"
            placeholder="e.g. Headquarters - Floor 3"
            value={checkInLocation}
            onChange={(e) => onCheckInLocationChange(e.target.value)}
          />
          <Input
            label="Remarks (Optional)"
            placeholder="Starting morning work"
            value={checkInRemarks}
            onChange={(e) => onCheckInRemarksChange(e.target.value)}
          />
        </div>
      </FormModal>

      {/* Check Out Modal */}
      <FormModal
        isOpen={isCheckOutOpen}
        onClose={onCheckOutClose}
        title="Employee Check Out"
        subtitle="Conclude your current attendance session"
        onSubmit={onCheckOutSubmit}
        isSubmitting={isSubmitting}
        submitLabel="Confirm Check Out"
        submitVariant="danger"
      >
        <div className="space-y-4">
          <Input
            label="Remarks (Optional)"
            placeholder="Completed scheduled tasks for today"
            value={checkOutRemarks}
            onChange={(e) => onCheckOutRemarksChange(e.target.value)}
          />
        </div>
      </FormModal>

      {/* Start Break Modal */}
      <FormModal
        isOpen={isStartBreakOpen}
        onClose={onStartBreakClose}
        title="Start Break"
        subtitle="Select your break type and record departure"
        onSubmit={onStartBreakSubmit}
        isSubmitting={isSubmitting}
        submitLabel="Start Break"
        submitVariant="primary"
      >
        <div className="space-y-4">
          <Select
            label="Break Type"
            value={selectedBreakType}
            onChange={(e) => onSelectedBreakTypeChange(e.target.value)}
            options={[
              { value: 'LUNCH', label: 'Lunch Break' },
              { value: 'TEA', label: 'Tea / Refreshment' },
              { value: 'PERSONAL', label: 'Personal Break' },
            ]}
          />
          <Input
            label="Remarks (Optional)"
            placeholder="Optional remarks"
            value={breakRemarks}
            onChange={(e) => onBreakRemarksChange(e.target.value)}
          />
        </div>
      </FormModal>
    </>
  );
};
