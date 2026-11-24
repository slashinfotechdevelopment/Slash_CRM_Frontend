import React, { useState, useMemo } from 'react';
import { ListPage } from '@/components/templates/ListPage';
import { useInfiniteList } from '@/hooks/useInfiniteList';
import { useToast } from '@/hooks/useToast';
import { useConfirm } from '@/hooks/useConfirm';
import { attendanceConnector } from '@/connectors/attendance.connector';
import {
  AttendanceRecord,
  ShiftDefinition,
  AttendanceStatus,
} from '@/api/types/attendance.types';
import { formatDate } from '@/utils/formatters';
import { useTeamAttendanceColumns } from '../components/useTeamAttendanceColumns';
import { EffectiveShiftModal } from '../components/EffectiveShiftModal';

export const TeamAttendancePage: React.FC = () => {
  const toast = useToast();
  const confirm = useConfirm();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);
  const [effectiveShift, setEffectiveShift] = useState<ShiftDefinition | null>(null);
  const [isEffectiveShiftOpen, setIsEffectiveShiftOpen] = useState(false);
  const [loadingShift, setLoadingShift] = useState(false);

  const teamFilters = useMemo(
    () => ({
      search: searchTerm || undefined,
      status: (statusFilter || undefined) as AttendanceStatus,
    }),
    [searchTerm, statusFilter]
  );

  const {
    items: records,
    total,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    loadMore,
    refresh: refetch,
  } = useInfiniteList<AttendanceRecord, { search?: string; status?: AttendanceStatus }>({
    queryFn: (params) => attendanceConnector.getAttendanceHistory(params),
    filters: teamFilters,
    limit: 20,
  });

  const handleFilterChange = (key: string, val: string | number) => {
    if (key === 'status') {
      setStatusFilter(val.toString());
    }
  };

  const handleRecalculate = async (record: AttendanceRecord) => {
    const res = await confirm({
      title: 'Recalculate Attendance Record',
      message: `Trigger deterministic recalculation for ${record.user?.name || 'employee'} on ${formatDate(record.attendanceDate)}? This recalculates work duration, break allowances, and overtime against immutable policy snapshots.`,
      confirmLabel: 'Recalculate',
      tone: 'info',
    });

    if (!res.confirmed) return;

    try {
      await attendanceConnector.recalculateRecord(record.id, {
        triggerSource: 'MANUAL_SUPERVISOR_ACTION',
      });
      toast.success('Recalculated', 'Attendance record recalculated successfully.');
      refetch();
    } catch (err) {
      toast.danger('Recalculation Failed', err instanceof Error ? err.message : 'Unable to recalculate record.');
    }
  };

  const handleViewEffectiveShift = async (record: AttendanceRecord) => {
    try {
      setSelectedRecord(record);
      setIsEffectiveShiftOpen(true);
      setLoadingShift(true);
      const shift = await attendanceConnector.getEffectiveShift(
        record.userId,
        record.attendanceDate,
      );
      setEffectiveShift(shift);
    } catch (err) {
      toast.danger('Error', err instanceof Error ? err.message : 'Failed to resolve effective shift definition.');
    } finally {
      setLoadingShift(false);
    }
  };

  const columns = useTeamAttendanceColumns({
    onViewEffectiveShift: handleViewEffectiveShift,
    onRecalculate: handleRecalculate,
  });

  return (
    <>
      <ListPage<AttendanceRecord>
        title="Team Attendance Oversight"
        description="Monitor organization attendance records, audit break compliance, and trigger policy recalculations"
        columns={columns}
        items={records}
        total={total}
        isLoading={isLoading}
        isLoadingMore={isLoadingMore}
        hasMore={hasMore}
        error={error}
        onRetry={refetch}
        onLoadMore={loadMore}
        search={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search by employee name or email..."
        filters={[
          {
            key: 'status',
            label: 'All Attendance Statuses',
            options: [
              { value: '', label: 'All Attendance Statuses' },
              { value: 'PRESENT', label: 'Present' },
              { value: 'HALF_DAY', label: 'Half Day' },
              { value: 'ABSENT', label: 'Absent' },
              { value: 'ON_LEAVE', label: 'On Leave' },
              { value: 'WEEKLY_OFF', label: 'Weekly Off' },
              { value: 'HOLIDAY', label: 'Holiday' },
              { value: 'PENDING_RECONCILIATION', label: 'Pending Reconciliation' },
            ],
          },
        ]}
        onFilterChange={handleFilterChange}
        emptyTitle="No team attendance records found"
        emptyDescription="Records matching your search criteria will appear here."
      />

      <EffectiveShiftModal
        isOpen={isEffectiveShiftOpen}
        onClose={() => setIsEffectiveShiftOpen(false)}
        selectedRecord={selectedRecord}
        effectiveShift={effectiveShift}
        loadingShift={loadingShift}
      />
    </>
  );
};
