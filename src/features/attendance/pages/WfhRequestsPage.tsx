import { getErrorMessage } from '@/api/client/errorMapper';
import React, { useState } from 'react';
import { ListPage } from '@/components/templates/ListPage';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { useInfiniteList } from '@/hooks/useInfiniteList';
import { useToast } from '@/hooks/useToast';
import { useConfirm } from '@/hooks/useConfirm';
import { attendanceConnector } from '@/connectors/attendance.connector';
import { WfhRequest, WfhStatus } from '@/api/types/attendance.types';
import { formatDate } from '@/utils/formatters';
import { Plus } from 'lucide-react';
import { useWfhColumns } from '../components/useWfhColumns';
import { WfhModals } from '../components/WfhModals';

export const WfhRequestsPage: React.FC = () => {
  const toast = useToast();
  const confirm = useConfirm();

  const [activeTab, setActiveTab] = useState<'my' | 'team'>('my');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
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
  } = useInfiniteList<WfhRequest, { status?: WfhStatus }>({
    queryFn: (params) => attendanceConnector.getMyWfhRequests(params),
    filters: { status: (statusFilter || undefined) as WfhStatus },
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
  } = useInfiniteList<WfhRequest, { status?: WfhStatus }>({
    queryFn: (params) => attendanceConnector.listWfhRequests(params),
    filters: { status: (statusFilter || undefined) as WfhStatus },
    limit: 20,
    enabled: activeTab === 'team',
  });

  const handleFilterChange = (key: string, val: string | number) => {
    if (key === 'status') {
      setStatusFilter(val.toString());
    }
  };

  const handleSubmitWfh = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !reason.trim()) {
      toast.warning('Validation Error', 'Start date, end date, and reason are required.');
      return;
    }

    try {
      setIsSubmitting(true);
      await attendanceConnector.createWfhRequest({
        startDate,
        endDate,
        reason: reason.trim(),
      });
      toast.success('Submitted', 'Your work-from-home request has been submitted.');
      setIsSubmitModalOpen(false);
      setStartDate('');
      setEndDate('');
      setReason('');
      refetchMy();
    } catch (err) {
      toast.danger('Submission Failed', err instanceof Error ? getErrorMessage(err) : 'Could not submit WFH request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelRequest = async (req: WfhRequest) => {
    const res = await confirm({
      title: 'Cancel WFH Request',
      message: `Cancel pending WFH request for ${formatDate(req.startDate)} to ${formatDate(req.endDate)}?`,
      confirmLabel: 'Cancel Request',
      tone: 'warning',
    });

    if (!res.confirmed) return;

    try {
      await attendanceConnector.cancelWfhRequest(req.id);
      toast.success('Cancelled', 'WFH request cancelled successfully.');
      refetchMy();
    } catch (err) {
      toast.danger('Action Failed', err instanceof Error ? getErrorMessage(err) : 'Unable to cancel request.');
    }
  };

  const handleApproveRequest = async (req: WfhRequest) => {
    const res = await confirm({
      title: 'Approve WFH Request',
      message: `Approve work-from-home request for ${req.user?.name || 'employee'} from ${formatDate(req.startDate)} to ${formatDate(req.endDate)}?`,
      confirmLabel: 'Approve Request',
      tone: 'info',
    });

    if (!res.confirmed) return;

    try {
      await attendanceConnector.approveWfhRequest(req.id);
      toast.success('Approved', 'WFH request approved successfully.');
      refetchTeam();
    } catch (err) {
      toast.danger('Action Failed', err instanceof Error ? getErrorMessage(err) : 'Could not approve request.');
    }
  };

  const handleOpenReject = (req: WfhRequest) => {
    setSelectedRequestId(req.id);
    setRejectionReason('');
    setIsRejectModalOpen(true);
  };

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequestId) return;

    try {
      setIsRejecting(true);
      await attendanceConnector.rejectWfhRequest(selectedRequestId, {
        rejectionReason: rejectionReason.trim() || undefined,
      });
      toast.success('Rejected', 'WFH request has been rejected.');
      setIsRejectModalOpen(false);
      refetchTeam();
    } catch (err) {
      toast.danger('Action Failed', err instanceof Error ? getErrorMessage(err) : 'Could not reject request.');
    } finally {
      setIsRejecting(false);
    }
  };

  const { myColumns, teamColumns } = useWfhColumns({
    onCancelRequest: handleCancelRequest,
    onApproveRequest: handleApproveRequest,
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
          Apply for WFH
        </Button>
      </div>

      {activeTab === 'my' ? (
        <ListPage<WfhRequest>
          title="My Work From Home Requests"
          description="Apply for remote work authorizations and view approval status"
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
          emptyTitle="No WFH requests submitted"
          emptyDescription="Click 'Apply for WFH' to submit a new remote work authorization request."
        />
      ) : (
        <ListPage<WfhRequest>
          title="Team WFH Authorizations"
          description="Review and process work-from-home requests for supervised team members"
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
          emptyTitle="No pending WFH approvals"
          emptyDescription="Remote work requests requiring your review will appear here."
        />
      )}

      <WfhModals
        isSubmitModalOpen={isSubmitModalOpen}
        onCloseSubmit={() => setIsSubmitModalOpen(false)}
        startDate={startDate}
        onStartDateChange={setStartDate}
        endDate={endDate}
        onEndDateChange={setEndDate}
        reason={reason}
        onReasonChange={setReason}
        isSubmitting={isSubmitting}
        onSubmitWfh={handleSubmitWfh}
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
