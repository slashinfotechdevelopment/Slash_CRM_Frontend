import { useState } from 'react';
import { useToast } from '@/hooks/useToast';
import { useConfirm } from '@/hooks/useConfirm';
import { attendanceConnector } from '@/connectors/attendance.connector';
import {
  CorrectionRequest,
  CorrectionType,
  VerificationOutcome,
} from '@/api/types/attendance.types';
import { formatDate } from '@/utils/formatters';

export const useCorrectionsManagement = (
  onRefreshMy: () => void,
  onRefreshTeam: () => void
) => {
  const toast = useToast();
  const confirm = useConfirm();

  // Submit modal state
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [attendanceDate, setAttendanceDate] = useState('');
  const [correctionType, setCorrectionType] = useState<CorrectionType>('INCORRECT_CHECK_OUT');
  const [checkInTime, setCheckInTime] = useState('');
  const [checkOutTime, setCheckOutTime] = useState('');
  const [reason, setReason] = useState('');
  const [evidenceRef, setEvidenceRef] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // View Details modal state
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedCorrection, setSelectedCorrection] = useState<CorrectionRequest | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Approve modal state
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [approveNotes, setApproveNotes] = useState('');
  const [verifiedEvidenceRef, setVerifiedEvidenceRef] = useState('');
  const [evidenceOutcome, setEvidenceOutcome] = useState<VerificationOutcome>('VERIFIED');
  const [isApproving, setIsApproving] = useState(false);

  // Reject modal state
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);

  const handleSubmitCorrection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!attendanceDate || !reason.trim() || reason.trim().length < 5) {
      toast.warning('Validation Error', 'Attendance date and reason (min 5 characters) are required.');
      return;
    }

    try {
      setIsSubmitting(true);
      const requestedCheckInAt = checkInTime
        ? new Date(`${attendanceDate}T${checkInTime}:00+05:30`).toISOString()
        : undefined;
      const requestedCheckOutAt = checkOutTime
        ? new Date(`${attendanceDate}T${checkOutTime}:00+05:30`).toISOString()
        : undefined;

      await attendanceConnector.createCorrectionRequest({
        attendanceDate,
        correctionType,
        requestedCheckInAt,
        requestedCheckOutAt,
        reason: reason.trim(),
        evidenceMetadata: evidenceRef ? { evidenceReference: evidenceRef.trim() } : undefined,
      });

      toast.success('Submitted', 'Attendance correction request submitted.');
      setIsSubmitOpen(false);
      setAttendanceDate('');
      setReason('');
      setEvidenceRef('');
      onRefreshMy();
    } catch (err: unknown) {
      toast.danger('Submission Failed', err instanceof Error ? err.message : 'Could not submit correction request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewDetail = async (req: CorrectionRequest) => {
    try {
      setSelectedCorrection(req);
      setIsDetailOpen(true);
      setLoadingDetail(true);
      const details = await attendanceConnector.getCorrectionRequestById(req.id);
      setSelectedCorrection(details);
    } catch (err: unknown) {
      toast.danger('Error', err instanceof Error ? err.message : 'Failed to fetch correction details.');
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleCancelRequest = async (req: CorrectionRequest) => {
    const res = await confirm({
      title: 'Cancel Correction Request',
      message: `Cancel pending correction request for ${formatDate(req.attendanceDate)}?`,
      confirmLabel: 'Cancel Request',
      tone: 'warning',
    });

    if (!res.confirmed) return;

    try {
      await attendanceConnector.cancelCorrectionRequest(req.id);
      toast.success('Cancelled', 'Correction request cancelled.');
      onRefreshMy();
    } catch (err: unknown) {
      toast.danger('Action Failed', err instanceof Error ? err.message : 'Unable to cancel request.');
    }
  };

  const handleOpenApprove = (req: CorrectionRequest) => {
    setSelectedCorrection(req);
    setApproveNotes('');
    setVerifiedEvidenceRef(String(req.evidenceMetadata?.evidenceReference || ''));
    setEvidenceOutcome('VERIFIED');
    setIsApproveOpen(true);
  };

  const handleApproveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCorrection) return;

    try {
      setIsApproving(true);
      await attendanceConnector.approveCorrectionRequest(selectedCorrection.id, {
        managerNotes: approveNotes.trim() || undefined,
        evidenceReference: verifiedEvidenceRef.trim() || undefined,
        evidenceOutcome,
      });
      toast.success('Approved', 'Correction approved and attendance recalculated.');
      setIsApproveOpen(false);
      onRefreshTeam();
    } catch (err: unknown) {
      toast.danger('Action Failed', err instanceof Error ? err.message : 'Could not approve correction request.');
    } finally {
      setIsApproving(false);
    }
  };

  const handleOpenReject = (req: CorrectionRequest) => {
    setSelectedCorrection(req);
    setRejectionReason('');
    setIsRejectOpen(true);
  };

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCorrection) return;

    try {
      setIsRejecting(true);
      await attendanceConnector.rejectCorrectionRequest(selectedCorrection.id, {
        rejectionReason: rejectionReason.trim() || undefined,
      });
      toast.success('Rejected', 'Correction request rejected.');
      setIsRejectOpen(false);
      onRefreshTeam();
    } catch (err: unknown) {
      toast.danger('Action Failed', err instanceof Error ? err.message : 'Could not reject correction request.');
    } finally {
      setIsRejecting(false);
    }
  };

  return {
    isSubmitOpen,
    setIsSubmitOpen,
    attendanceDate,
    setAttendanceDate,
    correctionType,
    setCorrectionType,
    checkInTime,
    setCheckInTime,
    checkOutTime,
    setCheckOutTime,
    reason,
    setReason,
    evidenceRef,
    setEvidenceRef,
    isSubmitting,
    handleSubmitCorrection,

    isDetailOpen,
    setIsDetailOpen,
    selectedCorrection,
    loadingDetail,
    handleViewDetail,
    handleCancelRequest,

    isApproveOpen,
    setIsApproveOpen,
    approveNotes,
    setApproveNotes,
    verifiedEvidenceRef,
    setVerifiedEvidenceRef,
    evidenceOutcome,
    setEvidenceOutcome,
    handleOpenApprove,
    handleApproveSubmit,

    isRejectOpen,
    setIsRejectOpen,
    rejectionReason,
    setRejectionReason,
    handleOpenReject,
    handleRejectSubmit,
    isApproving,
    isRejecting,
  };
};
