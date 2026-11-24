import React, { useState } from 'react';
import { ListPage } from '@/components/templates/ListPage';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { useInfiniteList } from '@/hooks/useInfiniteList';
import { useToast } from '@/hooks/useToast';
import { useConfirm } from '@/hooks/useConfirm';
import { attendanceConnector } from '@/connectors/attendance.connector';
import { OvertimeRequest, OvertimeApprovalStatus } from '@/api/types/attendance.types';
import { formatDate } from '@/utils/formatters';
import { Plus } from 'lucide-react';
import { useOvertimeColumns } from '../components/useOvertimeColumns';
import { OvertimeModals } from '../components/OvertimeModals';

export const OvertimeRequestsPage: React.FC = () => {
  const toast = useToast();
  const confirm = useConfirm();

  const [activeTab, setActiveTab] = useState<'my' | 'team'>('my');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [attendanceDate, setAttendanceDate] = useState('');
  const [startHour, setStartHour] = useState('18:00');
  const [endHour, setEndHour] = useState('20:00');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [selectedReq, setSelectedReq] = useState<OvertimeRequest | null>(null);
  const [approvedMinutes, setApprovedMinutes] = useState<number>(120);
  const [approveNotes, setApproveNotes] = useState('');
  const [isApproving, setIsApproving] = useState(false);

  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);

  const {
    items: myRequests,
    total: totalMy,
    isLoading: loadingMy,
    isLoadingMore: loadingMoreMy,
    hasMore: hasMoreMy,
    error: errorMy,
    loadMore: loadMoreMy,
    refresh: refetchMy,
  } = useInfiniteList<OvertimeRequest, { status?: OvertimeApprovalStatus }>({
    queryFn: (params) => attendanceConnector.getMyOvertimeRequests(params),
    filters: { status: (statusFilter || undefined) as OvertimeApprovalStatus },
    limit: 20,
    enabled: activeTab === 'my',
  });

  const {
    items: teamRequests,
    total: totalTeam,
    isLoading: loadingTeam,
    isLoadingMore: loadingMoreTeam,
    hasMore: hasMoreTeam,
    error: errorTeam,
    loadMore: loadMoreTeam,
    refresh: refetchTeam,
  } = useInfiniteList<OvertimeRequest, { status?: OvertimeApprovalStatus }>({
    queryFn: (params) => attendanceConnector.listOvertimeRequests(params),
    filters: { status: (statusFilter || undefined) as OvertimeApprovalStatus },
    limit: 20,
    enabled: activeTab === 'team',
  });

  const handleFilterChange = (key: string, val: string | number) => {
    if (key === 'status') {
      setStatusFilter(val.toString());
    }
  };

  const handleSubmitOvertime = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!attendanceDate || !startHour || !endHour || !reason.trim()) {
      toast.warning('Validation Error', 'Date, start time, end time, and reason are required.');
      return;
    }

    try {
      setIsSubmitting(true);
      const startTimeIso = new Date(`${attendanceDate}T${startHour}:00+05:30`).toISOString();
      const endTimeIso = new Date(`${attendanceDate}T${endHour}:00+05:30`).toISOString();

      await attendanceConnector.createOvertimeRequest({
        attendanceDate,
        startTime: startTimeIso,
        endTime: endTimeIso,
        reason: reason.trim(),
      });
      toast.success('Submitted', 'Overtime request submitted for manager review.');
      setIsSubmitModalOpen(false);
      setAttendanceDate('');
      setReason('');
      refetchMy();
    } catch (err) {
      toast.danger('Submission Failed', err instanceof Error ? err.message : 'Could not submit overtime request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelRequest = async (req: OvertimeRequest) => {
    const res = await confirm({
      title: 'Cancel Overtime Request',
      message: `Cancel overtime request for ${formatDate(req.attendanceDate)}?`,
      confirmLabel: 'Cancel Request',
      tone: 'warning',
    });

    if (!res.confirmed) return;

    try {
      await attendanceConnector.cancelOvertimeRequest(req.id);
      toast.success('Cancelled', 'Overtime request cancelled.');
      refetchMy();
    } catch (err) {
      toast.danger('Action Failed', err instanceof Error ? err.message : 'Unable to cancel request.');
    }
  };

  const handleOpenApprove = (req: OvertimeRequest) => {
    setSelectedReq(req);
    setApprovedMinutes(req.durationMinutes || 120);
    setApproveNotes('');
    setIsApproveModalOpen(true);
  };

  const handleApproveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReq) return;

    try {
      setIsApproving(true);
      await attendanceConnector.approveOvertimeRequest(selectedReq.id, {
        approvedDurationMinutes: Number(approvedMinutes),
        managerNotes: approveNotes.trim() || undefined,
      });
      toast.success('Approved', 'Overtime request authorized.');
      setIsApproveModalOpen(false);
      refetchTeam();
    } catch (err) {
      toast.danger('Action Failed', err instanceof Error ? err.message : 'Could not approve request.');
    } finally {
      setIsApproving(false);
    }
  };

  const handleOpenReject = (req: OvertimeRequest) => {
    setSelectedReq(req);
    setRejectionReason('');
    setIsRejectModalOpen(true);
  };

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReq) return;

    try {
      setIsRejecting(true);
      await attendanceConnector.rejectOvertimeRequest(selectedReq.id, {
        rejectionReason: rejectionReason.trim() || undefined,
      });
      toast.success('Rejected', 'Overtime request rejected.');
      setIsRejectModalOpen(false);
      refetchTeam();
    } catch (err) {
      toast.danger('Action Failed', err instanceof Error ? err.message : 'Could not reject request.');
    } finally {
      setIsRejecting(false);
    }
  };

  const { myColumns, teamColumns } = useOvertimeColumns({
    onCancelRequest: handleCancelRequest,
    onOpenApprove: handleOpenApprove,
    onOpenReject: handleOpenReject,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
        <Tabs
          tabs={[
            { id: 'my', label: 'My Requests' },
            { id: 'team', label: 'Team Approvals' },
          ]}
          activeTab={activeTab}
          onChange={(tab) => setActiveTab(tab as 'my' | 'team')}
        />
        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsSubmitModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Submit Overtime
        </Button>
      </div>

      {activeTab === 'my' ? (
        <ListPage<OvertimeRequest>
          title="My Overtime Requests"
          description="View submitted overtime authorization intervals and manager review status"
          columns={myColumns}
          items={myRequests}
          total={totalMy}
          isLoading={loadingMy}
          isLoadingMore={loadingMoreMy}
          hasMore={hasMoreMy}
          error={errorMy}
          onRetry={refetchMy}
          onLoadMore={loadMoreMy}
          filters={[
            {
              key: 'status',
              label: 'All Request Statuses',
              options: [
                { value: '', label: 'All Request Statuses' },
                { value: 'PENDING', label: 'Pending Review' },
                { value: 'APPROVED', label: 'Approved' },
                { value: 'REJECTED', label: 'Rejected' },
                { value: 'CANCELLED', label: 'Cancelled' },
              ],
            },
          ]}
          onFilterChange={handleFilterChange}
          emptyTitle="No overtime requests submitted"
          emptyDescription="Click 'Submit Overtime' to apply for extra working hour authorizations."
        />
      ) : (
        <ListPage<OvertimeRequest>
          title="Team Overtime Authorizations"
          description="Review, adjust authorized minutes, and approve extra working hours for supervised staff"
          columns={teamColumns}
          items={teamRequests}
          total={totalTeam}
          isLoading={loadingTeam}
          isLoadingMore={loadingMoreTeam}
          hasMore={hasMoreTeam}
          error={errorTeam}
          onRetry={refetchTeam}
          onLoadMore={loadMoreTeam}
          filters={[
            {
              key: 'status',
              label: 'All Request Statuses',
              options: [
                { value: '', label: 'All Request Statuses' },
                { value: 'PENDING', label: 'Pending Review' },
                { value: 'APPROVED', label: 'Approved' },
                { value: 'REJECTED', label: 'Rejected' },
                { value: 'CANCELLED', label: 'Cancelled' },
              ],
            },
          ]}
          onFilterChange={handleFilterChange}
          emptyTitle="No pending overtime approvals"
          emptyDescription="Submitted overtime requests requiring manager authorization will appear here."
        />
      )}

      <OvertimeModals
        isSubmitModalOpen={isSubmitModalOpen}
        onCloseSubmit={() => setIsSubmitModalOpen(false)}
        attendanceDate={attendanceDate}
        onAttendanceDateChange={setAttendanceDate}
        startHour={startHour}
        onStartHourChange={setStartHour}
        endHour={endHour}
        onEndHourChange={setEndHour}
        reason={reason}
        onReasonChange={setReason}
        isSubmitting={isSubmitting}
        onSubmitOvertime={handleSubmitOvertime}
        isApproveModalOpen={isApproveModalOpen}
        onCloseApprove={() => setIsApproveModalOpen(false)}
        selectedReq={selectedReq}
        approvedMinutes={approvedMinutes}
        onApprovedMinutesChange={setApprovedMinutes}
        approveNotes={approveNotes}
        onApproveNotesChange={setApproveNotes}
        isApproving={isApproving}
        onApproveSubmit={handleApproveSubmit}
        isRejectModalOpen={isRejectModalOpen}
        onCloseReject={() => setIsRejectModalOpen(false)}
        rejectionReason={rejectionReason}
        onRejectionReasonChange={setRejectionReason}
        isRejecting={isRejecting}
        onRejectSubmit={handleRejectSubmit}
      />
    </div>
  );
};
