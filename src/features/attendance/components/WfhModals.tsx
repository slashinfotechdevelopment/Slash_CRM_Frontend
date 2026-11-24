import React from 'react';
import { FormModal } from '@/components/templates/FormModal';
import { Input } from '@/components/ui/Input';

interface WfhModalsProps {
  isSubmitModalOpen: boolean;
  onCloseSubmit: () => void;
  startDate: string;
  onStartDateChange: (val: string) => void;
  endDate: string;
  onEndDateChange: (val: string) => void;
  reason: string;
  onReasonChange: (val: string) => void;
  isSubmitting: boolean;
  onSubmitWfh: (e: React.FormEvent) => Promise<void>;

  isRejectModalOpen: boolean;
  onCloseReject: () => void;
  rejectionReason: string;
  onRejectionReasonChange: (val: string) => void;
  isRejecting: boolean;
  onRejectSubmit: (e: React.FormEvent) => Promise<void>;
}

export const WfhModals: React.FC<WfhModalsProps> = ({
  isSubmitModalOpen,
  onCloseSubmit,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  reason,
  onReasonChange,
  isSubmitting,
  onSubmitWfh,
  isRejectModalOpen,
  onCloseReject,
  rejectionReason,
  onRejectionReasonChange,
  isRejecting,
  onRejectSubmit,
}) => {
  return (
    <>
      {/* Submit WFH Modal */}
      <FormModal
        isOpen={isSubmitModalOpen}
        onClose={onCloseSubmit}
        title="Apply for Work From Home"
        subtitle="Submit a date range for authorized remote work"
        onSubmit={onSubmitWfh}
        isSubmitting={isSubmitting}
        submitLabel="Submit Request"
        submitVariant="primary"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              required
            />
            <Input
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              required
            />
          </div>

          <Input
            label="Business Justification / Reason"
            placeholder="Explain reason for remote work..."
            value={reason}
            onChange={(e) => onReasonChange(e.target.value)}
            required
          />
        </div>
      </FormModal>

      {/* Reject WFH Modal */}
      <FormModal
        isOpen={isRejectModalOpen}
        onClose={onCloseReject}
        title="Reject WFH Request"
        subtitle="Provide comments explaining the reason for rejection"
        onSubmit={onRejectSubmit}
        isSubmitting={isRejecting}
        submitLabel="Confirm Rejection"
        submitVariant="danger"
      >
        <div className="space-y-4">
          <Input
            label="Rejection Reason"
            placeholder="e.g. In-person team sprint alignment required"
            value={rejectionReason}
            onChange={(e) => onRejectionReasonChange(e.target.value)}
            required
          />
        </div>
      </FormModal>
    </>
  );
};
