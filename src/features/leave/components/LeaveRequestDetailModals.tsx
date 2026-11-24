import React from 'react';
import { FormModal } from '@/components/templates/FormModal';
import { Badge } from '@/components/ui/Badge';
import { LeaveRequest, LeaveRequestStatus } from '@/api/types/leave.types';

interface LeaveRequestDetailModalsProps {
  selectedRequest: LeaveRequest | null;
  onCloseDetail: () => void;
  requestToCancel: LeaveRequest | null;
  onCloseCancel: () => void;
  cancelReason: string;
  onCancelReasonChange: (reason: string) => void;
  isCancelling: boolean;
  cancelError: string | null;
  onConfirmCancel: () => Promise<void>;
}

export const LeaveRequestDetailModals: React.FC<LeaveRequestDetailModalsProps> = ({
  selectedRequest,
  onCloseDetail,
  requestToCancel,
  onCloseCancel,
  cancelReason,
  onCancelReasonChange,
  isCancelling,
  cancelError,
  onConfirmCancel,
}) => {
  const getStatusBadge = (status: LeaveRequestStatus) => {
    switch (status) {
      case 'APPROVED':
        return <Badge variant="success">Approved</Badge>;
      case 'PENDING':
        return <Badge variant="warning">Pending Approval</Badge>;
      case 'REJECTED':
        return <Badge variant="danger">Rejected</Badge>;
      case 'CANCELLED':
        return <Badge variant="neutral">Cancelled</Badge>;
      case 'CANCELLATION_PENDING':
        return <Badge variant="info">Cancellation Requested</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <>
      {/* View Detail Modal */}
      {selectedRequest && (
        <FormModal
          isOpen={!!selectedRequest}
          onClose={onCloseDetail}
          title={`Leave Request Details: ${selectedRequest.leaveType?.name || 'Leave'}`}
          onSubmit={async () => onCloseDetail()}
          submitLabel="Close"
          isSubmitting={false}
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 bg-neutral-50 p-3 rounded-lg border border-neutral-200">
              <div>
                <span className="text-neutral-500 block">Status</span>
                <span className="mt-1 inline-block">{getStatusBadge(selectedRequest.status)}</span>
              </div>
              <div>
                <span className="text-neutral-500 block">Duration</span>
                <span className="font-semibold text-neutral-900 text-sm mt-1 inline-block">
                  {Number(selectedRequest.totalDays ?? selectedRequest.daysRequested ?? 0)}{' '}
                  {Number(selectedRequest.totalDays ?? selectedRequest.daysRequested ?? 0) === 1 ? 'day' : 'days'}
                </span>
              </div>
              <div>
                <span className="text-neutral-500 block">Start Date</span>
                <span className="font-mono text-neutral-800">{(selectedRequest.startDate || '').split('T')[0]}</span>
              </div>
              <div>
                <span className="text-neutral-500 block">End Date</span>
                <span className="font-mono text-neutral-800">{(selectedRequest.endDate || '').split('T')[0]}</span>
              </div>
            </div>

            <div>
              <span className="text-neutral-500 block font-semibold mb-1">Reason for Leave:</span>
              <div className="p-3 bg-white rounded border border-neutral-200 text-neutral-800">
                {selectedRequest.reason}
              </div>
            </div>

            {selectedRequest.reviewerNotes && (
              <div className="p-3 bg-amber-50/60 rounded border border-amber-200">
                <span className="text-amber-900 font-semibold block mb-1">
                  Manager Review Notes ({selectedRequest.reviewer?.name || 'Reviewer'}):
                </span>
                <p className="text-amber-800">{selectedRequest.reviewerNotes}</p>
                {selectedRequest.reviewedAt && (
                  <span className="text-[10px] text-amber-600 block mt-1">
                    Reviewed on {new Date(selectedRequest.reviewedAt).toLocaleString()}
                  </span>
                )}
              </div>
            )}

            {selectedRequest.cancellationReason && (
              <div className="p-3 bg-neutral-100 rounded border border-neutral-200">
                <span className="text-neutral-900 font-semibold block mb-1">Cancellation Reason:</span>
                <p className="text-neutral-700">{selectedRequest.cancellationReason}</p>
              </div>
            )}
          </div>
        </FormModal>
      )}

      {/* Cancel Leave Form Modal */}
      {requestToCancel && (
        <FormModal
          isOpen={!!requestToCancel}
          onClose={() => {
            if (!isCancelling) onCloseCancel();
          }}
          title={
            requestToCancel.status === 'APPROVED'
              ? 'Request Cancellation of Approved Leave'
              : 'Cancel Pending Leave Request'
          }
          onSubmit={onConfirmCancel}
          isSubmitting={isCancelling}
          submitLabel={requestToCancel.status === 'APPROVED' ? 'Submit Cancellation' : 'Confirm Cancel'}
        >
          <div className="space-y-3 text-xs">
            {cancelError && (
              <div className="p-2 bg-red-50 text-red-700 text-xs rounded border border-red-200">
                {cancelError}
              </div>
            )}
            <p className="text-neutral-600">
              {requestToCancel.status === 'APPROVED'
                ? 'Since this leave is already approved, submitting cancellation will notify your manager for cancellation review. Please state your cancellation reason:'
                : 'Are you sure you want to cancel this pending leave application? Please state your reason:'}
            </p>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Cancellation Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => onCancelReasonChange(e.target.value)}
                placeholder="Cancellation justification (e.g. travel plans postponed)..."
                rows={3}
                className="w-full text-xs p-2.5 rounded-lg border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>
          </div>
        </FormModal>
      )}
    </>
  );
};
