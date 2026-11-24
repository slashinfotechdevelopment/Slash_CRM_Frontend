import React, { useState } from 'react';
import { ListPage } from '@/components/templates/ListPage';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { useInfiniteList } from '@/hooks/useInfiniteList';
import { attendanceConnector } from '@/connectors/attendance.connector';
import {
  CorrectionRequest,
  AttendanceCorrectionStatus,
} from '@/api/types/attendance.types';
import { Plus } from 'lucide-react';
import { useCorrectionColumns } from '../components/useCorrectionColumns';
import { CorrectionModals } from '../components/CorrectionModals';
import { useCorrectionsManagement } from '../hooks/useCorrectionsManagement';

export const CorrectionsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'my' | 'team'>('my');
  const [statusFilter, setStatusFilter] = useState<string>('');

  // My requests infinite list
  const {
    items: myRequests,
    total: totalMy,
    isLoading: loadingMy,
    isLoadingMore: loadingMoreMy,
    hasMore: hasMoreMy,
    error: errorMy,
    loadMore: loadMoreMy,
    refresh: refetchMy,
  } = useInfiniteList<CorrectionRequest, { status?: AttendanceCorrectionStatus }>({
    queryFn: (params) => attendanceConnector.getMyCorrectionRequests(params),
    filters: { status: (statusFilter || undefined) as AttendanceCorrectionStatus },
    limit: 20,
    enabled: activeTab === 'my',
  });

  // Team requests infinite list
  const {
    items: teamRequests,
    total: totalTeam,
    isLoading: loadingTeam,
    isLoadingMore: loadingMoreTeam,
    hasMore: hasMoreTeam,
    error: errorTeam,
    loadMore: loadMoreTeam,
    refresh: refetchTeam,
  } = useInfiniteList<CorrectionRequest, { status?: AttendanceCorrectionStatus }>({
    queryFn: (params) => attendanceConnector.listCorrectionRequests(params),
    filters: { status: (statusFilter || undefined) as AttendanceCorrectionStatus },
    limit: 20,
    enabled: activeTab === 'team',
  });

  const corrsMgmt = useCorrectionsManagement(refetchMy, refetchTeam);

  const { myColumns, teamColumns } = useCorrectionColumns({
    onViewDetail: corrsMgmt.handleViewDetail,
    onCancelRequest: corrsMgmt.handleCancelRequest,
    onOpenApprove: corrsMgmt.handleOpenApprove,
    onOpenReject: corrsMgmt.handleOpenReject,
  });

  const handleFilterChange = (key: string, val: string | number) => {
    if (key === 'status') {
      setStatusFilter(val.toString());
    }
  };

  const statusFilterConfig = [
    {
      key: 'status',
      label: 'All Correction Statuses',
      options: [
        { value: '', label: 'All Statuses' },
        { value: 'PENDING', label: 'Pending Review' },
        { value: 'APPROVED', label: 'Approved' },
        { value: 'REJECTED', label: 'Rejected' },
        { value: 'CANCELLED', label: 'Cancelled' },
      ],
      value: statusFilter,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
        <Tabs
          tabs={[
            { id: 'my', label: 'My Corrections' },
            { id: 'team', label: 'Team Corrections' },
          ]}
          activeTab={activeTab}
          onChange={(tab) => setActiveTab(tab as 'my' | 'team')}
        />
        <Button
          variant="primary"
          size="sm"
          onClick={() => corrsMgmt.setIsSubmitOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Submit Correction
        </Button>
      </div>

      {activeTab === 'my' ? (
        <ListPage<CorrectionRequest>
          title="My Attendance Corrections"
          description="Submit dispute adjustments for missed check-ins, incorrect timestamps, or hardware swipe issues"
          columns={myColumns}
          items={myRequests}
          total={totalMy}
          isLoading={loadingMy}
          isLoadingMore={loadingMoreMy}
          hasMore={hasMoreMy}
          error={errorMy}
          onRetry={refetchMy}
          onLoadMore={loadMoreMy}
          filters={statusFilterConfig}
          onFilterChange={handleFilterChange}
          emptyTitle="No correction requests found"
          emptyDescription="Your submitted dispute records will appear here."
        />
      ) : (
        <ListPage<CorrectionRequest>
          title="Team Attendance Corrections"
          description="Review, verify evidence, and approve attendance adjustments for your team"
          columns={teamColumns}
          items={teamRequests}
          total={totalTeam}
          isLoading={loadingTeam}
          isLoadingMore={loadingMoreTeam}
          hasMore={hasMoreTeam}
          error={errorTeam}
          onRetry={refetchTeam}
          onLoadMore={loadMoreTeam}
          filters={statusFilterConfig}
          onFilterChange={handleFilterChange}
          emptyTitle="No team correction requests"
          emptyDescription="Requests submitted by your team members will appear here."
        />
      )}

      <CorrectionModals
        isSubmitOpen={corrsMgmt.isSubmitOpen}
        onSubmitClose={() => corrsMgmt.setIsSubmitOpen(false)}
        attendanceDate={corrsMgmt.attendanceDate}
        onAttendanceDateChange={corrsMgmt.setAttendanceDate}
        correctionType={corrsMgmt.correctionType}
        onCorrectionTypeChange={corrsMgmt.setCorrectionType}
        checkInTime={corrsMgmt.checkInTime}
        onCheckInTimeChange={corrsMgmt.setCheckInTime}
        checkOutTime={corrsMgmt.checkOutTime}
        onCheckOutTimeChange={corrsMgmt.setCheckOutTime}
        reason={corrsMgmt.reason}
        onReasonChange={corrsMgmt.setReason}
        evidenceRef={corrsMgmt.evidenceRef}
        onEvidenceRefChange={corrsMgmt.setEvidenceRef}
        onSubmitCorrection={corrsMgmt.handleSubmitCorrection}
        isSubmitting={corrsMgmt.isSubmitting}
        isDetailOpen={corrsMgmt.isDetailOpen}
        onDetailClose={() => corrsMgmt.setIsDetailOpen(false)}
        selectedCorrection={corrsMgmt.selectedCorrection}
        loadingDetail={corrsMgmt.loadingDetail}
        isApproveOpen={corrsMgmt.isApproveOpen}
        onApproveClose={() => corrsMgmt.setIsApproveOpen(false)}
        approveNotes={corrsMgmt.approveNotes}
        onApproveNotesChange={corrsMgmt.setApproveNotes}
        verifiedEvidenceRef={corrsMgmt.verifiedEvidenceRef}
        onVerifiedEvidenceRefChange={corrsMgmt.setVerifiedEvidenceRef}
        evidenceOutcome={corrsMgmt.evidenceOutcome}
        onEvidenceOutcomeChange={corrsMgmt.setEvidenceOutcome}
        onApproveSubmit={corrsMgmt.handleApproveSubmit}
        isApproving={corrsMgmt.isApproving}
        isRejectOpen={corrsMgmt.isRejectOpen}
        onRejectClose={() => corrsMgmt.setIsRejectOpen(false)}
        rejectionReason={corrsMgmt.rejectionReason}
        onRejectionReasonChange={corrsMgmt.setRejectionReason}
        onRejectSubmit={corrsMgmt.handleRejectSubmit}
        isRejecting={corrsMgmt.isRejecting}
      />
    </div>
  );
};
