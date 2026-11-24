import { Badge } from '@/components/ui/Badge';
import { ColumnDef } from '@/components/templates/DataTable';
import { AttendanceRecord, AttendanceStatus } from '@/api/types/attendance.types';
import { formatDate, formatTime, formatMinutes } from '@/utils/formatters';

export const getAttendanceStatusBadge = (status: AttendanceStatus) => {
  switch (status) {
    case 'PRESENT':
      return <Badge variant="success">Present</Badge>;
    case 'HALF_DAY':
      return <Badge variant="warning">Half Day</Badge>;
    case 'ABSENT':
      return <Badge variant="danger">Absent</Badge>;
    case 'ON_LEAVE':
      return <Badge variant="info">On Leave</Badge>;
    case 'WEEKLY_OFF':
      return <Badge variant="neutral">Weekly Off</Badge>;
    case 'HOLIDAY':
      return <Badge variant="neutral">Holiday</Badge>;
    case 'PENDING_RECONCILIATION':
      return <Badge variant="warning">Pending Reconciliation</Badge>;
    default:
      return <Badge variant="neutral">{status}</Badge>;
  }
};

export const useAttendanceHistoryColumns = (): ColumnDef<AttendanceRecord>[] => [
  {
    header: 'Attendance Date',
    accessorKey: 'attendanceDate',
    cell: (row) => {
      const shiftName = row.shift?.name || row.shiftDefinition?.name || 'General Shift';
      return (
        <div className="flex flex-col">
          <span className="font-semibold text-neutral-900">{formatDate(row.attendanceDate || row.workDate || row.date)}</span>
          <span className="text-xs text-neutral-500">{shiftName}</span>
        </div>
      );
    },
  },
  {
    header: 'Status',
    accessorKey: 'status',
    cell: (row) => getAttendanceStatusBadge(row.status),
  },
  {
    header: 'Sessions / Timing',
    accessorKey: 'sessions',
    cell: (row) => {
      const sessions = row.sessions || [];
      if (sessions.length === 0) return <span className="text-xs text-neutral-400">No sessions</span>;
      const first = sessions[0];
      const last = sessions[sessions.length - 1];
      return (
        <div className="flex flex-col text-xs">
          <span className="text-neutral-800 font-medium">
            In: {formatTime(first.checkInAt)}
          </span>
          <span className="text-neutral-500">
            Out: {last.checkOutAt ? formatTime(last.checkOutAt) : 'Active'}
          </span>
        </div>
      );
    },
  },
  {
    header: 'Net Working Time',
    accessorKey: 'netMinutes',
    cell: (row) => {
      const netMins = row.netMinutes ?? (row.netWorkingDurationSeconds != null ? Math.round(row.netWorkingDurationSeconds / 60) : 0);
      return (
        <span className="font-semibold text-neutral-800">
          {formatMinutes(netMins)}
        </span>
      );
    },
  },
  {
    header: 'Breaks',
    accessorKey: 'paidBreakMinutes',
    cell: (row) => {
      const paidBreak = row.paidBreakMinutes ?? (row.paidBreakDurationSeconds != null ? Math.round(row.paidBreakDurationSeconds / 60) : 0);
      const unpaidBreak = row.unpaidBreakMinutes ?? (row.unpaidBreakDurationSeconds != null ? Math.round(row.unpaidBreakDurationSeconds / 60) : 0);
      const totalBreak = paidBreak + unpaidBreak;
      return (
        <div className="text-xs text-neutral-600">
          <span>{formatMinutes(totalBreak)}</span>
          {unpaidBreak > 0 ? (
            <span className="text-amber-600 ml-1">({formatMinutes(unpaidBreak)} unpaid)</span>
          ) : null}
        </div>
      );
    },
  },
  {
    header: 'Overtime',
    accessorKey: 'overtimeMinutes',
    cell: (row) => {
      const overtimeMins = row.overtimeMinutes ?? (row.verifiedOvertimeSeconds != null ? Math.round(row.verifiedOvertimeSeconds / 60) : 0);
      return (
        <span className="text-xs font-medium text-neutral-700">
          {overtimeMins > 0 ? formatMinutes(overtimeMins) : '—'}
        </span>
      );
    },
  },
];
