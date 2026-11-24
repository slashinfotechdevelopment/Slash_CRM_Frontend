import React, { useState } from 'react';
import { ListPage } from '@/components/templates/ListPage';
import { useInfiniteList } from '@/hooks/useInfiniteList';
import { useToast } from '@/hooks/useToast';
import { attendanceConnector } from '@/connectors/attendance.connector';
import {
  AnomalyRecord,
  AnomalyResolutionAction,
} from '@/api/types/attendance.types';
import { useAnomalyColumns } from '../components/useAnomalyColumns';
import { AnomalyModals } from '../components/AnomalyModals';

export const AnomaliesPage: React.FC = () => {
  const toast = useToast();

  const [resolvedFilter, setResolvedFilter] = useState<string>('false');
  const [anomalyTypeFilter, setAnomalyTypeFilter] = useState<string>('');

  const [selectedAnomaly, setSelectedAnomaly] = useState<AnomalyRecord | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const [isResolveOpen, setIsResolveOpen] = useState(false);
  const [targetRecordId, setTargetRecordId] = useState<string | null>(null);
  const [action, setAction] = useState<AnomalyResolutionAction>('RESOLVE');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [recalculate, setRecalculate] = useState(true);
  const [isResolving, setIsResolving] = useState(false);

  const {
    items: anomalies,
    total,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    loadMore,
    refresh: refetch,
  } = useInfiniteList<AnomalyRecord, { isResolved?: boolean; anomalyType?: string }>({
    queryFn: (params) => attendanceConnector.listAnomalies(params),
    filters: {
      isResolved: resolvedFilter === 'true' ? true : resolvedFilter === 'false' ? false : undefined,
      anomalyType: anomalyTypeFilter || undefined,
    },
    limit: 20,
  });

  const handleFilterChange = (key: string, val: string | number) => {
    if (key === 'isResolved') {
      setResolvedFilter(val.toString());
    } else if (key === 'anomalyType') {
      setAnomalyTypeFilter(val.toString());
    }
  };

  const handleViewDetail = async (anomaly: AnomalyRecord) => {
    try {
      setSelectedAnomaly(anomaly);
      setIsDetailOpen(true);
      setLoadingDetail(true);
      const recordId = anomaly.attendanceRecordId || anomaly.id;
      const details = await attendanceConnector.getAnomalyDetails(recordId);
      setSelectedAnomaly(details);
    } catch (err) {
      toast.danger('Error', err instanceof Error ? err.message : 'Failed to fetch anomaly details.');
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleOpenResolve = (anomaly: AnomalyRecord) => {
    setTargetRecordId(anomaly.attendanceRecordId || anomaly.id);
    setAction('RESOLVE');
    setResolutionNotes('');
    setRecalculate(true);
    setIsResolveOpen(true);
  };

  const handleResolveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetRecordId || !resolutionNotes.trim() || resolutionNotes.trim().length < 5) {
      toast.warning('Validation Error', 'Resolution notes (min 5 characters) are required.');
      return;
    }

    try {
      setIsResolving(true);
      await attendanceConnector.resolveAnomaly(targetRecordId, {
        action,
        notes: resolutionNotes.trim(),
        recalculate,
      });
      toast.success(
        action === 'RESOLVE' ? 'Resolved' : 'Dismissed',
        `Anomaly ${action.toLowerCase()}d successfully.`,
      );
      setIsResolveOpen(false);
      refetch();
    } catch (err) {
      toast.danger('Action Failed', err instanceof Error ? err.message : 'Could not resolve anomaly.');
    } finally {
      setIsResolving(false);
    }
  };

  const columns = useAnomalyColumns({
    onViewDetail: handleViewDetail,
    onOpenResolve: handleOpenResolve,
  });

  return (
    <>
      <ListPage<AnomalyRecord>
        title="Quarantined Attendance Anomalies"
        description="Inspect system-flagged irregularities, orphan sessions, and audit manual supervisor reconciliations"
        columns={columns}
        items={anomalies}
        total={total}
        isLoading={isLoading}
        isLoadingMore={isLoadingMore}
        hasMore={hasMore}
        error={error}
        onRetry={refetch}
        onLoadMore={loadMore}
        filters={[
          {
            key: 'isResolved',
            label: 'All Anomaly Statuses',
            options: [
              { value: '', label: 'All Statuses' },
              { value: 'false', label: 'Quarantined / Active' },
              { value: 'true', label: 'Resolved / Dismissed' },
            ],
          },
          {
            key: 'anomalyType',
            label: 'All Anomaly Types',
            options: [
              { value: '', label: 'All Anomaly Types' },
              { value: 'MISSING_CHECKOUT', label: 'Missing Check-Out' },
              { value: 'EXCESSIVE_BREAK', label: 'Excessive Break' },
              { value: 'UNASSIGNED_SHIFT', label: 'Unassigned Shift' },
              { value: 'INTERVAL_OVERLAP', label: 'Interval Overlap' },
              { value: 'CROSS_MIDNIGHT_MISMATCH', label: 'Cross-Midnight Mismatch' },
            ],
          },
        ]}
        onFilterChange={handleFilterChange}
        emptyTitle="No anomalies quarantined"
        emptyDescription="System reconciliation found no discrepancies or all have been resolved."
      />

      <AnomalyModals
        isDetailOpen={isDetailOpen}
        onCloseDetail={() => setIsDetailOpen(false)}
        selectedAnomaly={selectedAnomaly}
        loadingDetail={loadingDetail}
        isResolveOpen={isResolveOpen}
        onCloseResolve={() => setIsResolveOpen(false)}
        action={action}
        onActionChange={setAction}
        resolutionNotes={resolutionNotes}
        onResolutionNotesChange={setResolutionNotes}
        recalculate={recalculate}
        onRecalculateChange={setRecalculate}
        isResolving={isResolving}
        onResolveSubmit={handleResolveSubmit}
      />
    </>
  );
};
