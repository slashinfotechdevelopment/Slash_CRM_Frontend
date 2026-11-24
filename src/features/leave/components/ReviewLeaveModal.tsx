import React from 'react';
import { FormModal } from '@/components/templates/FormModal';
import { LeaveRequest, LeaveApprovalDecision } from '@/api/types/leave.types';

interface ReviewLeaveModalProps {
  selectedRequest: LeaveRequest | null;
  onClose: () => void;
  reviewDecision: LeaveApprovalDecision;
  onDecisionChange: (d: LeaveApprovalDecision) => void;
  reviewComments: string;
  onCommentsChange: (c: string) => void;
  isSubmitting: boolean;
  errorMessage: string | null;
  onSubmit: () => Promise<void>;
}

export const ReviewLeaveModal: React.FC<ReviewLeaveModalProps> = ({
  selectedRequest,
  onClose,
  reviewDecision,
  onDecisionChange,
  reviewComments,
  onCommentsChange,
  isSubmitting,
  errorMessage,
  onSubmit,
}) => {
  if (!selectedRequest) return null;

  return (
    <FormModal
      isOpen={!!selectedRequest}
      onClose={() => {
        if (!isSubmitting) onClose();
      }}
      title={
        selectedRequest.status === 'CANCELLATION_PENDING'
          ? `Review Cancellation: ${selectedRequest.user?.name}`
          : `Review Leave Application: ${selectedRequest.user?.name}`
      }
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      submitLabel={reviewDecision === 'APPROVED' ? 'Confirm Approval' : 'Confirm Rejection'}
    >
      <div className="space-y-4 text-xs">
        {errorMessage && (
          <div className="p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
            {errorMessage}
          </div>
        )}

        <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 grid grid-cols-2 gap-2">
          <div>
            <span className="text-neutral-500 block">Applicant</span>
            <span className="font-semibold text-neutral-900">{selectedRequest.user?.name}</span>
          </div>
          <div>
            <span className="text-neutral-500 block">Leave Type</span>
            <span className="font-semibold text-neutral-900">{selectedRequest.leaveType?.name}</span>
          </div>
          <div>
            <span className="text-neutral-500 block">Duration</span>
            <span className="font-semibold text-neutral-900">
              {Number(selectedRequest.totalDays ?? (selectedRequest as unknown as { daysRequested?: number }).daysRequested ?? 1)} days
            </span>
          </div>
          <div>
            <span className="text-neutral-500 block">Dates</span>
            <span className="font-mono text-neutral-800">
              {(selectedRequest.startDate || '').split('T')[0]} → {(selectedRequest.endDate || '').split('T')[0]}
            </span>
          </div>
        </div>

        <div>
          <span className="text-neutral-500 block font-semibold mb-1">
            {selectedRequest.status === 'CANCELLATION_PENDING'
              ? 'Cancellation Justification:'
              : 'Application Reason:'}
          </span>
          <div className="p-2.5 bg-white rounded border border-neutral-200 text-neutral-800">
            {selectedRequest.status === 'CANCELLATION_PENDING'
              ? selectedRequest.cancellationReason
              : selectedRequest.reason}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">Decision:</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-emerald-700">
              <input
                type="radio"
                name="decision"
                checked={reviewDecision === 'APPROVED'}
                onChange={() => onDecisionChange('APPROVED')}
              />
              <span>Approve Request</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-medium text-rose-700">
              <input
                type="radio"
                name="decision"
                checked={reviewDecision === 'REJECTED'}
                onChange={() => onDecisionChange('REJECTED')}
              />
              <span>Reject Request</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">
            Review Comments (Optional):
          </label>
          <textarea
            value={reviewComments}
            onChange={(e) => onCommentsChange(e.target.value)}
            rows={3}
            placeholder="Optional notes or instructions for the employee..."
            className="w-full text-xs p-2.5 rounded-lg border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>
      </div>
    </FormModal>
  );
};
