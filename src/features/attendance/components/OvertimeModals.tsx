import React from 'react';
import { FormModal } from '@/components/templates/FormModal';
import { Input } from '@/components/ui/Input';
import { OvertimeRequest } from '@/api/types/attendance.types';
import { formatDate } from '@/utils/formatters';

interface OvertimeModalsProps {
  isSubmitModalOpen: boolean;
  onCloseSubmit: () => void;
  attendanceDate: string;
  onAttendanceDateChange: (val: string) => void;
  startHour: string;
  onStartHourChange: (val: string) => void;
  endHour: string;
  onEndHourChange: (val: string) => void;
  reason: string;
  onReasonChange: (val: string) => void;
  isSubmitting: boolean;
  onSubmitOvertime: (e: React.FormEvent) => Promise<void>;

  isApproveModalOpen: boolean;
  onCloseApprove: () => void;
  selectedReq: OvertimeRequest | null;
  approvedMinutes: number;
  onApprovedMinutesChange: (val: number) => void;
  approveNotes: string;
  onApproveNotesChange: (val: string) => void;
  isApproving: boolean;
  onApproveSubmit: (e: React.FormEvent) => Promise<void>;

  isRejectModalOpen: boolean;
  onCloseReject: () => void;
  rejectionReason: string;
  onRejectionReasonChange: (val: string) => void;
  isRejecting: boolean;
  onRejectSubmit: (e: React.FormEvent) => Promise<void>;
}

export const OvertimeModals: React.FC<OvertimeModalsProps> = ({
  isSubmitModalOpen,
  onCloseSubmit,
  attendanceDate,
  onAttendanceDateChange,
  startHour,
  onStartHourChange,
  endHour,
  onEndHourChange,
  reason,
  onReasonChange,
  isSubmitting,
  onSubmitOvertime,
  isApproveModalOpen,
  onCloseApprove,
  selectedReq,
  approvedMinutes,
  onApprovedMinutesChange,
  approveNotes,
  onApproveNotesChange,
  isApproving,
  onApproveSubmit,
  isRejectModalOpen,
  onCloseReject,
  rejectionReason,
  onRejectionReasonChange,
  isRejecting,
  onRejectSubmit,
}) => {
  return (
    <>
      {/* Submit Overtime Modal */}
      <FormModal
        isOpen={isSubmitModalOpen}
        onClose={onCloseSubmit}
        title="Submit Overtime Request"
        subtitle="Specify attendance date, authorization window, and justification"
        onSubmit={onSubmitOvertime}
        isSubmitting={isSubmitting}
        submitLabel="Submit Overtime"
        submitVariant="primary"
      >
        <div className="space-y-4">
          <Input
            label="Attendance Date"
            type="date"
            value={attendanceDate}
            onChange={(e) => onAttendanceDateChange(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Start Time (HH:mm)"
              type="time"
              value={startHour}
              onChange={(e) => onStartHourChange(e.target.value)}
              required
            />
            <Input
              label="End Time (HH:mm)"
              type="time"
              value={endHour}
              onChange={(e) => onEndHourChange(e.target.value)}
              required
            />
          </div>

          <Input
            label="Reason / Business Justification"
            placeholder="e.g. Critical release deployment and emergency support"
            value={reason}
            onChange={(e) => onReasonChange(e.target.value)}
            required
          />
        </div>
      </FormModal>

      {/* Approve Overtime Modal */}
      <FormModal
        isOpen={isApproveModalOpen}
        onClose={onCloseApprove}
        title="Approve Overtime Request"
        subtitle={selectedReq ? `Reviewing request for ${selectedReq.user?.name} on ${formatDate(selectedReq.attendanceDate)}` : undefined}
        onSubmit={onApproveSubmit}
        isSubmitting={isApproving}
        submitLabel="Authorize Overtime"
        submitVariant="primary"
      >
        <div className="space-y-4">
          <Input
            label="Authorized Duration (Minutes)"
            type="number"
            value={approvedMinutes}
            onChange={(e) => onApprovedMinutesChange(Number(e.target.value))}
            min={1}
            max={720}
            required
          />

          <Input
            label="Manager Remarks (Optional)"
            placeholder="Approval comments..."
            value={approveNotes}
            onChange={(e) => onApproveNotesChange(e.target.value)}
          />
        </div>
      </FormModal>

      {/* Reject Overtime Modal */}
      <FormModal
        isOpen={isRejectModalOpen}
        onClose={onCloseReject}
        title="Reject Overtime Request"
        subtitle="Explain the reason for rejecting the overtime request"
        onSubmit={onRejectSubmit}
        isSubmitting={isRejecting}
        submitLabel="Confirm Rejection"
        submitVariant="danger"
      >
        <div className="space-y-4">
          <Input
            label="Rejection Reason"
            placeholder="e.g. Monthly overtime budget quota reached"
            value={rejectionReason}
            onChange={(e) => onRejectionReasonChange(e.target.value)}
            required
          />
        </div>
      </FormModal>
    </>
  );
};
