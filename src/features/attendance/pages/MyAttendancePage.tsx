import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ListPage } from '@/components/templates/ListPage';
import { useInfiniteList } from '@/hooks/useInfiniteList';
import { useToast } from '@/hooks/useToast';
import { attendanceConnector } from '@/connectors/attendance.connector';
import {
  AttendanceRecord,
  TodayAttendanceResponse,
  ShiftAssignment,
  AttendanceStatus,
} from '@/api/types/attendance.types';
import { useAttendanceHistoryColumns } from '../components/useAttendanceHistoryColumns';
import { TodayAttendanceHero } from '../components/TodayAttendanceHero';
import { AttendanceActionModals } from '../components/AttendanceActionModals';

export const MyAttendancePage: React.FC = () => {
  const toast = useToast();

  const [todayData, setTodayData] = useState<TodayAttendanceResponse | null>(null);
  const [myAssignments, setMyAssignments] = useState<ShiftAssignment[]>([]);

  // Modals
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isCheckOutOpen, setIsCheckOutOpen] = useState(false);
  const [isStartBreakOpen, setIsStartBreakOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [checkInLocation, setCheckInLocation] = useState('');
  const [checkInRemarks, setCheckInRemarks] = useState('');
  const [checkOutRemarks, setCheckOutRemarks] = useState('');
  const [selectedBreakType, setSelectedBreakType] = useState('LUNCH');
  const [breakRemarks, setBreakRemarks] = useState('');

  // Live timer for active session
  const [liveDuration, setLiveDuration] = useState<number>(0);

  // Filter state for history list
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [dateScope, setDateScope] = useState<'PAST_TODAY' | 'UPCOMING' | 'ALL'>('PAST_TODAY');

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const tomorrowStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }, []);

  const toastRef = React.useRef(toast);
  toastRef.current = toast;

  const fetchTodayStatus = useCallback(async () => {
    try {
      const [today, assignments] = await Promise.all([
        attendanceConnector.getTodayAttendance().catch(() => null),
        attendanceConnector.getMyShiftAssignments().catch(() => []),
      ]);
      setTodayData(today);
      setMyAssignments(assignments);
    } catch {
      toastRef.current.danger('Error', 'Failed to retrieve today\'s attendance status.');
    }
  }, []);

  useEffect(() => {
    fetchTodayStatus();
  }, [fetchTodayStatus]);

  useEffect(() => {
    const sessionRec = todayData?.activeSession as { checkInAt?: string; rawCheckInAt?: string; createdAt?: string } | undefined;
    const checkInTimestamp =
      sessionRec?.checkInAt ||
      sessionRec?.rawCheckInAt ||
      sessionRec?.createdAt;

    if (!todayData?.hasActiveSession || !checkInTimestamp) {
      setLiveDuration(0);
      return;
    }

    const calculateElapsed = () => {
      const start = new Date(checkInTimestamp).getTime();
      const now = Date.now();
      const elapsedSec = Math.max(0, Math.floor((now - start) / 1000));
      setLiveDuration(elapsedSec);
    };

    calculateElapsed();
    const interval = setInterval(calculateElapsed, 1000);
    return () => clearInterval(interval);
  }, [todayData?.hasActiveSession, todayData?.activeSession?.checkInAt]);

  const historyFilters = useMemo(() => {
    const filters: { status?: AttendanceStatus; startDate?: string; endDate?: string } = {
      status: (statusFilter || undefined) as AttendanceStatus,
    };
    if (dateScope === 'PAST_TODAY') {
      filters.endDate = todayStr;
    } else if (dateScope === 'UPCOMING') {
      filters.startDate = tomorrowStr;
    }
    return filters;
  }, [statusFilter, dateScope, todayStr, tomorrowStr]);

  const {
    items: historyRecords,
    total,
    isLoading: loadingHistory,
    isLoadingMore,
    hasMore,
    error: historyError,
    loadMore,
    refresh: refetchHistory,
  } = useInfiniteList<AttendanceRecord, { status?: AttendanceStatus; startDate?: string; endDate?: string }>({
    queryFn: (params) => attendanceConnector.getAttendanceHistory(params),
    filters: historyFilters,
    limit: 15,
  });

  const handleFilterChange = (key: string, val: string | number) => {
    if (key === 'status') {
      setStatusFilter(val.toString());
    } else if (key === 'dateScope') {
      setDateScope(val as 'PAST_TODAY' | 'UPCOMING' | 'ALL');
    }
  };

  const handleCheckInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await attendanceConnector.checkIn({
        location: checkInLocation || undefined,
        deviceInfo: navigator.userAgent.slice(0, 150),
        remarks: checkInRemarks || undefined,
      });
      toast.success('Checked In', 'Your attendance session has started successfully.');
      setIsCheckInOpen(false);
      setCheckInLocation('');
      setCheckInRemarks('');
      await fetchTodayStatus();
      refetchHistory();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unable to record check-in.';
      toast.danger('Check-in Failed', message);
      if (message.toLowerCase().includes('active')) {
        await fetchTodayStatus();
        setIsCheckInOpen(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckOutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await attendanceConnector.checkOut({
        remarks: checkOutRemarks || undefined,
      });
      toast.success('Checked Out', 'Your attendance session has been recorded.');
      setIsCheckOutOpen(false);
      setCheckOutRemarks('');
      await fetchTodayStatus();
      refetchHistory();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unable to complete check-out.';
      toast.danger('Check-out Failed', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartBreakSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await attendanceConnector.startBreak({
        breakTypeId: selectedBreakType,
        remarks: breakRemarks || undefined,
      });
      toast.success('Break Started', `Enjoy your ${selectedBreakType.toLowerCase()} break.`);
      setIsStartBreakOpen(false);
      setBreakRemarks('');
      await fetchTodayStatus();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to start break.';
      toast.danger('Action Failed', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEndBreak = async () => {
    try {
      setIsSubmitting(true);
      await attendanceConnector.endBreak();
      toast.success('Break Concluded', 'Welcome back to work.');
      await fetchTodayStatus();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to end break.';
      toast.danger('Action Failed', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = useAttendanceHistoryColumns();

  return (
    <div className="space-y-6">
      <TodayAttendanceHero
        todayData={todayData}
        myAssignments={myAssignments}
        liveDuration={liveDuration}
        isSubmitting={isSubmitting}
        onCheckInOpen={() => setIsCheckInOpen(true)}
        onCheckOutOpen={() => setIsCheckOutOpen(true)}
        onStartBreakOpen={() => setIsStartBreakOpen(true)}
        onEndBreak={handleEndBreak}
      />

      <ListPage<AttendanceRecord>
        title="My Attendance History"
        description="View past attendance records, calculated work hours, break allocations, and status"
        columns={columns}
        items={historyRecords}
        total={total}
        isLoading={loadingHistory}
        isLoadingMore={isLoadingMore}
        hasMore={hasMore}
        error={historyError}
        onRetry={refetchHistory}
        onLoadMore={loadMore}
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
          },
        ]}
        onFilterChange={handleFilterChange}
        emptyTitle="No attendance records found"
        emptyDescription="Your recorded check-in logs and shifts will appear here."
      />

      <AttendanceActionModals
        isCheckInOpen={isCheckInOpen}
        onCheckInClose={() => setIsCheckInOpen(false)}
        checkInLocation={checkInLocation}
        onCheckInLocationChange={setCheckInLocation}
        checkInRemarks={checkInRemarks}
        onCheckInRemarksChange={setCheckInRemarks}
        onCheckInSubmit={handleCheckInSubmit}
        isCheckOutOpen={isCheckOutOpen}
        onCheckOutClose={() => setIsCheckOutOpen(false)}
        checkOutRemarks={checkOutRemarks}
        onCheckOutRemarksChange={setCheckOutRemarks}
        onCheckOutSubmit={handleCheckOutSubmit}
        isStartBreakOpen={isStartBreakOpen}
        onStartBreakClose={() => setIsStartBreakOpen(false)}
        selectedBreakType={selectedBreakType}
        onSelectedBreakTypeChange={setSelectedBreakType}
        breakRemarks={breakRemarks}
        onBreakRemarksChange={setBreakRemarks}
        onStartBreakSubmit={handleStartBreakSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};
