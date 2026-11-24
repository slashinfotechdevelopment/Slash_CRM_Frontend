import { useState, useMemo } from 'react';
import { ListPage } from '@/components/templates/ListPage';
import { useInfiniteList } from '@/hooks/useInfiniteList';
import { useConfirm } from '@/hooks/useConfirm';
import { useToast } from '@/hooks/useToast';
import { attendanceConnector } from '@/connectors/attendance.connector';
import { AttendanceRecord, AttendanceStatus, ShiftDefinition } from '@/api/types/attendance.types';
import { formatDate } from '@/utils/formatters';
import { getErrorMessage } from '@/api/client/errorMapper';
import { useTeamAttendanceColumns } from '../components/useTeamAttendanceColumns';
import { EffectiveShiftModal } from '../components/EffectiveShiftModal';

export const TeamAttendancePage: React.FC = () => {
  const confirm = useConfirm();
  const toast = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateScope, setDateScope] = useState<'PAST_TODAY' | 'UPCOMING' | 'ALL'>('PAST_TODAY');

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const tomorrowStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }, []);

  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);
  const [effectiveShift, setEffectiveShift] = useState<ShiftDefinition | null>(null);
  const [isEffectiveShiftOpen, setIsEffectiveShiftOpen] = useState(false);
  const [loadingShift, setLoadingShift] = useState(false);

  const teamFilters = useMemo(() => {
    const filters: {
      search?: string;
      status?: AttendanceStatus;
      startDate?: string;
      endDate?: string;
    } = {
      search: searchTerm || undefined,
      status: (statusFilter || undefined) as AttendanceStatus,
    };
    if (dateScope === 'PAST_TODAY') {
      filters.endDate = todayStr;
    } else if (dateScope === 'UPCOMING') {
      filters.startDate = tomorrowStr;
    }
    return filters;
  }, [searchTerm, statusFilter, dateScope, todayStr, tomorrowStr]);

  const {
    items: records,
    total,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    loadMore,
    refresh: refetch,
  } = useInfiniteList<AttendanceRecord, { search?: string; status?: AttendanceStatus; startDate?: string; endDate?: string }>({
    queryFn: (params) => attendanceConnector.getAttendanceHistory(params),
    filters: teamFilters,
    limit: 20,
  });

  const handleFilterChange = (key: string, val: string | number) => {
    if (key === 'status') {
      setStatusFilter(val.toString());
    } else if (key === 'dateScope') {
      setDateScope(val as 'PAST_TODAY' | 'UPCOMING' | 'ALL');
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
      toast.danger('Recalculation Failed', err instanceof Error ? getErrorMessage(err) : 'Unable to recalculate record.');
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
      toast.danger('Error', err instanceof Error ? getErrorMessage(err) : 'Failed to resolve effective shift definition.');
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
            key: 'dateScope',
            label: 'Timeline View',
            options: [
              { value: 'PAST_TODAY', label: 'Past & Today (Default)' },
              { value: 'UPCOMING', label: 'Upcoming Leaves & Shifts' },
              { value: 'ALL', label: 'All Records (Full Ledger)' },
            ],
            value: dateScope,
            className: 'w-full sm:w-60',
          },
          {
            key: 'status',
            label: 'Attendance Status',
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
            value: statusFilter,
            className: 'w-full sm:w-56',
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
