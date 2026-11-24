import { ColumnDef } from '@/components/templates/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { AttendanceRecord, AttendanceStatus } from '@/api/types/attendance.types';
import { formatDate, formatMinutes } from '@/utils/formatters';
import { RotateCcw } from 'lucide-react';

interface UseTeamAttendanceColumnsOptions {
  onViewEffectiveShift: (record: AttendanceRecord) => void;
  onRecalculate: (record: AttendanceRecord) => void;
}

export function useTeamAttendanceColumns({
  onViewEffectiveShift,
  onRecalculate,
}: UseTeamAttendanceColumnsOptions): ColumnDef<AttendanceRecord>[] {
  const getStatusBadge = (status: AttendanceStatus) => {
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

  return [
    {
      header: 'Employee',
      accessorKey: 'user',
      cell: (row) => {
        const empName = row.employeeName || row.user?.name || 'Employee';
        const empEmail = row.employeeEmail || row.user?.email || '';
        const empCode = row.employeeCode || row.user?.code || '';
        const designation = row.user?.profile?.designation;
        return (
          <div className="flex flex-col">
            <span className="font-semibold text-neutral-900">{empName}</span>
            {empEmail && <span className="text-xs text-neutral-500">{empEmail}</span>}
            <div className="flex items-center gap-1.5 mt-0.5">
              {empCode && (
                <span className="text-[11px] font-mono text-neutral-500 bg-neutral-100 px-1 py-0.2 rounded">
                  {empCode}
                </span>
              )}
              {designation && (
                <span className="text-[11px] text-neutral-500 truncate max-w-[140px]">
                  {designation}
                </span>
              )}
            </div>
          </div>
        );
      },
    },
    {
      header: 'Date & Shift',
      accessorKey: 'attendanceDate',
      cell: (row) => {
        const shiftName = row.shift?.name || row.shiftDefinition?.name || 'View Shift';
        return (
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-neutral-800">{formatDate(row.attendanceDate || row.workDate || row.date)}</span>
            <button
              onClick={() => onViewEffectiveShift(row)}
              className="text-[11px] text-primary-600 hover:text-primary-800 text-left underline decoration-dotted mt-0.5 truncate max-w-[160px]"
            >
              {shiftName}
            </button>
          </div>
        );
      },
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => getStatusBadge(row.status),
    },
    {
      header: 'Net Working Time',
      accessorKey: 'netMinutes',
      cell: (row) => {
        const netMins = row.netMinutes ?? (row.netWorkingDurationSeconds != null ? Math.round(row.netWorkingDurationSeconds / 60) : 0);
        const grossMins = row.grossMinutes ?? (row.grossWorkingDurationSeconds != null ? Math.round(row.grossWorkingDurationSeconds / 60) : 0);
        return (
          <div className="flex flex-col text-xs">
            <span className="font-semibold text-neutral-800">{formatMinutes(netMins)}</span>
            <span className="text-neutral-500">Gross: {formatMinutes(grossMins)}</span>
          </div>
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
    {
      header: 'Actions',
      accessorKey: 'id',
      cell: (row) => (
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onRecalculate(row)}
            title="Recalculate record"
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Recalculate
          </Button>
        </div>
      ),
    },
  ];
}
