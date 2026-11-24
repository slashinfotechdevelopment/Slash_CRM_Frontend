import React from 'react';
import { FormModal } from '@/components/templates/FormModal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import {
  CorrectionRequest,
  CorrectionType,
  VerificationOutcome,
} from '@/api/types/attendance.types';
import { formatDate, formatTime } from '@/utils/formatters';
import { getCorrectionStatusBadge, formatCorrectionType } from './useCorrectionColumns';

interface CorrectionModalsProps {
  // Submit modal
  isSubmitOpen: boolean;
  onSubmitClose: () => void;
  attendanceDate: string;
  onAttendanceDateChange: (val: string) => void;
  correctionType: CorrectionType;
  onCorrectionTypeChange: (val: CorrectionType) => void;
  checkInTime: string;
  onCheckInTimeChange: (val: string) => void;
  checkOutTime: string;
  onCheckOutTimeChange: (val: string) => void;
  reason: string;
  onReasonChange: (val: string) => void;
  evidenceRef: string;
  onEvidenceRefChange: (val: string) => void;
  onSubmitCorrection: (e: React.FormEvent) => void;
  isSubmitting: boolean;

  // Detail modal
  isDetailOpen: boolean;
  onDetailClose: () => void;
  selectedCorrection: CorrectionRequest | null;
  loadingDetail: boolean;

  // Approve modal
  isApproveOpen: boolean;
  onApproveClose: () => void;
  approveNotes: string;
  onApproveNotesChange: (val: string) => void;
  verifiedEvidenceRef: string;
  onVerifiedEvidenceRefChange: (val: string) => void;
  evidenceOutcome: VerificationOutcome;
  onEvidenceOutcomeChange: (val: VerificationOutcome) => void;
  onApproveSubmit: (e: React.FormEvent) => void;
  isApproving: boolean;

  // Reject modal
  isRejectOpen: boolean;
  onRejectClose: () => void;
  rejectionReason: string;
  onRejectionReasonChange: (val: string) => void;
  onRejectSubmit: (e: React.FormEvent) => void;
  isRejecting: boolean;
}

export const CorrectionModals: React.FC<CorrectionModalsProps> = ({
  isSubmitOpen,
  onSubmitClose,
  attendanceDate,
  onAttendanceDateChange,
  correctionType,
  onCorrectionTypeChange,
  checkInTime,
  onCheckInTimeChange,
  checkOutTime,
  onCheckOutTimeChange,
  reason,
  onReasonChange,
  evidenceRef,
  onEvidenceRefChange,
  onSubmitCorrection,
  isSubmitting,

  isDetailOpen,
  onDetailClose,
  selectedCorrection,
  loadingDetail,

  isApproveOpen,
  onApproveClose,
  approveNotes,
  onApproveNotesChange,
  verifiedEvidenceRef,
  onVerifiedEvidenceRefChange,
  evidenceOutcome,
  onEvidenceOutcomeChange,
  onApproveSubmit,
  isApproving,

  isRejectOpen,
  onRejectClose,
  rejectionReason,
  onRejectionReasonChange,
  onRejectSubmit,
  isRejecting,
}) => {
  return (
    <>
      {/* Submit Correction Modal */}
      <FormModal
        isOpen={isSubmitOpen}
        onClose={onSubmitClose}
        title="Submit Attendance Correction Request"
        subtitle="Request adjustment for missed clock events or biometric reader errors"
        onSubmit={onSubmitCorrection}
        isSubmitting={isSubmitting}
        submitLabel="Submit Correction"
        submitVariant="primary"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Attendance Date"
              type="date"
              value={attendanceDate}
              onChange={(e) => onAttendanceDateChange(e.target.value)}
              required
            />
            <Select
              label="Discrepancy Type"
              value={correctionType}
              onChange={(e) => onCorrectionTypeChange(e.target.value as CorrectionType)}
              options={[
                { value: 'INCORRECT_CHECK_OUT', label: 'Incorrect Check Out' },
                { value: 'MISSED_CHECK_OUT', label: 'Missed Check Out' },
                { value: 'INCORRECT_CHECK_IN', label: 'Incorrect Check In' },
                { value: 'MISSED_CHECK_IN', label: 'Missed Check In' },
                { value: 'INCORRECT_BREAK', label: 'Incorrect Break Interval' },
                { value: 'OTHER', label: 'Other Correction' },
              ]}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Requested Check In Time (HH:mm)"
              type="time"
              value={checkInTime}
              onChange={(e) => onCheckInTimeChange(e.target.value)}
            />
            <Input
              label="Requested Check Out Time (HH:mm)"
              type="time"
              value={checkOutTime}
              onChange={(e) => onCheckOutTimeChange(e.target.value)}
            />
          </div>

          <Input
            label="Reason for Discrepancy"
            placeholder="e.g. Turnstile scanner error during evening checkout"
            value={reason}
            onChange={(e) => onReasonChange(e.target.value)}
            required
          />

          <Input
            label="Supporting Evidence Reference (Optional)"
            placeholder="e.g. Access card log, CCTV ref, Jira ticket"
            value={evidenceRef}
            onChange={(e) => onEvidenceRefChange(e.target.value)}
          />
        </div>
      </FormModal>

      {/* Details View Modal */}
      <FormModal
        isOpen={isDetailOpen}
        onClose={onDetailClose}
        title="Correction Request Details"
        subtitle={
          selectedCorrection
            ? `${selectedCorrection.user?.name || 'Employee'} - ${formatDate(selectedCorrection.attendanceDate)}`
            : undefined
        }
        onSubmit={(e) => {
          e.preventDefault();
          onDetailClose();
        }}
        submitLabel="Close"
        submitVariant="primary"
      >
        {loadingDetail ? (
          <div className="py-8 text-center text-xs text-neutral-500">Loading details...</div>
        ) : selectedCorrection ? (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 bg-neutral-50 p-3 rounded-lg border border-neutral-200/60">
              <div>
                <span className="text-neutral-500 block">Correction Type</span>
                <span className="font-semibold text-neutral-900">
                  {formatCorrectionType(selectedCorrection.correctionType)}
                </span>
              </div>
              <div>
                <span className="text-neutral-500 block">Status</span>
                <span className="mt-0.5 inline-block">
                  {getCorrectionStatusBadge(selectedCorrection.status)}
                </span>
              </div>
              <div>
                <span className="text-neutral-500 block">Requested In</span>
                <span className="font-medium text-neutral-800">
                  {selectedCorrection.requestedCheckInAt
                    ? formatTime(selectedCorrection.requestedCheckInAt)
                    : '—'}
                </span>
              </div>
              <div>
                <span className="text-neutral-500 block">Requested Out</span>
                <span className="font-medium text-neutral-800">
                  {selectedCorrection.requestedCheckOutAt
                    ? formatTime(selectedCorrection.requestedCheckOutAt)
                    : '—'}
                </span>
              </div>
            </div>

            <div>
              <span className="font-semibold text-neutral-800 block mb-1">Reason:</span>
              <p className="bg-neutral-50 p-2.5 rounded border border-neutral-200 text-neutral-700">
                {selectedCorrection.reason}
              </p>
            </div>

            {selectedCorrection.evidenceMetadata && (
              <div>
                <span className="font-semibold text-neutral-800 block mb-1">
                  Evidence Reference:
                </span>
                <p className="bg-neutral-50 p-2 rounded border border-neutral-200 text-neutral-700 font-mono text-[11px]">
                  {JSON.stringify(selectedCorrection.evidenceMetadata)}
                </p>
              </div>
            )}

            {selectedCorrection.managerNotes && (
              <div>
                <span className="font-semibold text-neutral-800 block mb-1">Manager Notes:</span>
                <p className="bg-neutral-50 p-2.5 rounded border border-neutral-200 text-neutral-700">
                  {selectedCorrection.managerNotes}
                </p>
              </div>
            )}
          </div>
        ) : null}
      </FormModal>

      {/* Approve Modal */}
      <FormModal
        isOpen={isApproveOpen}
        onClose={onApproveClose}
        title="Approve Attendance Correction"
        subtitle="Verify evidence and apply deterministic attendance recalculation"
        onSubmit={onApproveSubmit}
        isSubmitting={isApproving}
        submitLabel="Approve Correction"
        submitVariant="primary"
      >
        <div className="space-y-4">
          <Input
            label="Manager Approval Notes (Optional)"
            placeholder="Verified swipe records and system activity"
            value={approveNotes}
            onChange={(e) => onApproveNotesChange(e.target.value)}
          />

          <Input
            label="Verified Evidence Ref (Optional)"
            placeholder="e.g. Audit ticket or floor gate security report"
            value={verifiedEvidenceRef}
            onChange={(e) => onVerifiedEvidenceRefChange(e.target.value)}
          />

          <Select
            label="Evidence Audit Outcome"
            value={evidenceOutcome}
            onChange={(e) => onEvidenceOutcomeChange(e.target.value as VerificationOutcome)}
            options={[
              { value: 'VERIFIED', label: 'Verified & Corroborated' },
              { value: 'WAIVED_POLICY', label: 'Policy Exception Granted' },
              { value: 'SYSTEM_ERROR', label: 'Hardware Reader Outage' },
            ]}
          />
        </div>
      </FormModal>

      {/* Reject Modal */}
      <FormModal
        isOpen={isRejectOpen}
        onClose={onRejectClose}
        title="Reject Attendance Correction"
        subtitle="Provide explicit feedback on why the correction claim was rejected"
        onSubmit={onRejectSubmit}
        isSubmitting={isRejecting}
        submitLabel="Reject Correction"
        submitVariant="danger"
      >
        <div className="space-y-4">
          <Input
            label="Rejection Reason"
            placeholder="e.g. CCTV does not corroborate presence at requested timestamp"
            value={rejectionReason}
            onChange={(e) => onRejectionReasonChange(e.target.value)}
            required
          />
        </div>
      </FormModal>
    </>
  );
};
