import { getErrorMessage } from '@/api/client/errorMapper';
import React, { useState, useEffect } from 'react';
import { ListPage } from '@/components/templates/ListPage';
import { Button } from '@/components/ui/Button';
import { useInfiniteList } from '@/hooks/useInfiniteList';
import { useToast } from '@/hooks/useToast';
import { attendanceConnector } from '@/connectors/attendance.connector';
import { usersConnector } from '@/connectors/users.connector';
import {
  ReconciliationRun,
  ReconciliationRunStatus,
  ReconciliationStatusResponse,
} from '@/api/types/attendance.types';
import { UserItem } from '@/api/types/users.types';
import { Play, Search } from 'lucide-react';
import { useReconciliationColumns } from '../components/useReconciliationColumns';
import { ReconciliationModals } from '../components/ReconciliationModals';

export const ReconciliationPage: React.FC = () => {
  const toast = useToast();

  const [statusFilter, setStatusFilter] = useState<string>('');

  const [isTriggerOpen, setIsTriggerOpen] = useState(false);
  const [targetDate, setTargetDate] = useState(
    new Date(Date.now() - 86400000).toISOString().slice(0, 10),
  );
  const [forceReconcile, setForceReconcile] = useState(false);
  const [forceReason, setForceReason] = useState('');
  const [triggerNotes, setTriggerNotes] = useState('');
  const [isTriggering, setIsTriggering] = useState(false);

  const [selectedRun, setSelectedRun] = useState<ReconciliationRun | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const [isStatusInspectorOpen, setIsStatusInspectorOpen] = useState(false);
  const [usersList, setUsersList] = useState<UserItem[]>([]);
  const [inspectorUserId, setInspectorUserId] = useState('');
  const [inspectorDate, setInspectorDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [inspectionResult, setInspectionResult] = useState<ReconciliationStatusResponse | null>(null);
  const [loadingInspection, setLoadingInspection] = useState(false);

  useEffect(() => {
    usersConnector.getUsers({ limit: 50 }).then((res) => {
      setUsersList(res.items);
      if (res.items.length > 0 && !inspectorUserId) {
        setInspectorUserId(res.items[0].id);
      }
    }).catch(() => {});
  }, [inspectorUserId]);

  const {
    items: runs,
    total,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    loadMore,
    refresh: refetch,
  } = useInfiniteList<ReconciliationRun, { status?: ReconciliationRunStatus }>({
    queryFn: (params) => attendanceConnector.listReconciliationRuns(params),
    filters: { status: (statusFilter || undefined) as ReconciliationRunStatus },
    limit: 20,
  });

  const handleFilterChange = (key: string, val: string | number) => {
    if (key === 'status') {
      setStatusFilter(val.toString());
    }
  };

  const handleTriggerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetDate) {
      toast.warning('Validation Error', 'Target date is required.');
      return;
    }

    if (forceReconcile && (!forceReason.trim() || forceReason.trim().length < 5)) {
      toast.warning('Validation Error', 'Force reason is required when overriding cutoff grace period.');
      return;
    }

    try {
      setIsTriggering(true);
      await attendanceConnector.triggerReconciliation({
        targetDate,
        forceReconcile,
        forceReason: forceReconcile ? forceReason.trim() : undefined,
        notes: triggerNotes.trim() || undefined,
      });
      toast.success('Triggered', 'Attendance reconciliation run initiated.');
      setIsTriggerOpen(false);
      refetch();
    } catch (err) {
      toast.danger('Trigger Failed', err instanceof Error ? getErrorMessage(err) : 'Unable to execute reconciliation.');
    } finally {
      setIsTriggering(false);
    }
  };

  const handleViewRun = async (run: ReconciliationRun) => {
    try {
      setSelectedRun(run);
      setIsDetailOpen(true);
      setLoadingDetail(true);
      const details = await attendanceConnector.getReconciliationRunDetails(run.id);
      setSelectedRun(details);
    } catch (err) {
      toast.danger('Error', err instanceof Error ? getErrorMessage(err) : 'Failed to fetch reconciliation run details.');
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleInspectStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inspectorUserId || !inspectorDate) return;

    try {
      setLoadingInspection(true);
      const res = await attendanceConnector.getReconciliationStatus({
        userId: inspectorUserId,
        date: inspectorDate,
      });
      setInspectionResult(res);
    } catch (err) {
      toast.danger('Query Failed', err instanceof Error ? getErrorMessage(err) : 'Could not fetch reconciliation status.');
    } finally {
      setLoadingInspection(false);
    }
  };

  const columns = useReconciliationColumns({
    onViewRun: handleViewRun,
  });

  return (
    <>
      <ListPage<ReconciliationRun>
        title="End-of-Day (EOD) Reconciliation"
        description="Audit daily attendance closures, view execution batches, and inspect employee reconciliation health"
        headerActions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsStatusInspectorOpen(true)}
              leftIcon={<Search className="w-4 h-4" />}
            >
              Status Inspector
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsTriggerOpen(true)}
              leftIcon={<Play className="w-4 h-4" />}
            >
              Run EOD Reconciliation
            </Button>
          </div>
        }
        columns={columns}
        items={runs}
        total={total}
        isLoading={isLoading}
        isLoadingMore={isLoadingMore}
        hasMore={hasMore}
        error={error}
        onRetry={refetch}
        onLoadMore={loadMore}
        filters={[
          {
            key: 'status',
            label: 'All Run Statuses',
            options: [
              { value: '', label: 'All Run Statuses' },
              { value: 'COMPLETED', label: 'Completed' },
              { value: 'IN_PROGRESS', label: 'In Progress' },
              { value: 'PARTIAL', label: 'Partial' },
              { value: 'FAILED', label: 'Failed' },
            ],
          },
        ]}
        onFilterChange={handleFilterChange}
        emptyTitle="No reconciliation runs recorded"
        emptyDescription="Execute an authorized EOD reconciliation run to calculate final daily attendance."
      />

      <ReconciliationModals
        isTriggerOpen={isTriggerOpen}
        onCloseTrigger={() => setIsTriggerOpen(false)}
        targetDate={targetDate}
        onTargetDateChange={setTargetDate}
        forceReconcile={forceReconcile}
        onForceReconcileChange={setForceReconcile}
        forceReason={forceReason}
        onForceReasonChange={setForceReason}
        triggerNotes={triggerNotes}
        onTriggerNotesChange={setTriggerNotes}
        isTriggering={isTriggering}
        onTriggerSubmit={handleTriggerSubmit}
        isDetailOpen={isDetailOpen}
        onCloseDetail={() => setIsDetailOpen(false)}
        selectedRun={selectedRun}
        loadingDetail={loadingDetail}
        isStatusInspectorOpen={isStatusInspectorOpen}
        onCloseStatusInspector={() => setIsStatusInspectorOpen(false)}
        usersList={usersList}
        inspectorUserId={inspectorUserId}
        onInspectorUserIdChange={setInspectorUserId}
        inspectorDate={inspectorDate}
        onInspectorDateChange={setInspectorDate}
        inspectionResult={inspectionResult}
        loadingInspection={loadingInspection}
        onInspectStatus={handleInspectStatus}
      />
    </>
  );
};
