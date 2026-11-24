import { ColumnDef } from '@/components/templates/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { OvertimeRequest, OvertimeApprovalStatus } from '@/api/types/attendance.types';
import { formatDate, formatTime, formatMinutes } from '@/utils/formatters';
import { CheckCircle, XCircle, Ban } from 'lucide-react';

interface UseOvertimeColumnsOptions {
  onCancelRequest: (req: OvertimeRequest) => void;
  onOpenApprove: (req: OvertimeRequest) => void;
  onOpenReject: (req: OvertimeRequest) => void;
}

export function useOvertimeColumns({
  onCancelRequest,
  onOpenApprove,
  onOpenReject,
}: UseOvertimeColumnsOptions) {
  const getStatusBadge = (status: OvertimeApprovalStatus) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="warning">Pending Review</Badge>;
      case 'APPROVED':
        return <Badge variant="success">Approved</Badge>;
      case 'REJECTED':
        return <Badge variant="danger">Rejected</Badge>;
      case 'CANCELLED':
        return <Badge variant="neutral">Cancelled</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  const myColumns: ColumnDef<OvertimeRequest>[] = [
    {
      header: 'Date & Time Window',
      accessorKey: 'attendanceDate',
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-neutral-900">{formatDate(row.attendanceDate)}</span>
          <span className="text-xs text-neutral-500">
            {formatTime(row.startTime)} - {formatTime(row.endTime)}
          </span>
        </div>
      ),
    },
    {
      header: 'Duration',
      accessorKey: 'durationMinutes',
      cell: (row) => (
        <div className="flex flex-col text-xs">
          <span className="font-semibold text-neutral-800">
            {formatMinutes(row.durationMinutes || 0)}
          </span>
          {row.approvedDurationMinutes != null && row.approvedDurationMinutes !== row.durationMinutes && (
            <span className="text-primary-700">
              Approved: {formatMinutes(row.approvedDurationMinutes)}
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'Reason',
      accessorKey: 'reason',
      cell: (row) => (
        <span className="text-xs text-neutral-700 line-clamp-2 max-w-xs">{row.reason}</span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => getStatusBadge(row.status),
    },
    {
      header: 'Actions',
      accessorKey: 'id',
      cell: (row) => (
        <div>
          {row.status === 'PENDING' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCancelRequest(row)}
              leftIcon={<Ban className="w-3.5 h-3.5" />}
            >
              Cancel
            </Button>
          )}
        </div>
      ),
    },
  ];

  const teamColumns: ColumnDef<OvertimeRequest>[] = [
    {
      header: 'Employee',
      accessorKey: 'user',
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-neutral-900">{row.user?.name || 'Employee'}</span>
          <span className="text-xs text-neutral-500">{row.user?.email}</span>
        </div>
      ),
    },
    {
      header: 'Date & Requested Window',
      accessorKey: 'attendanceDate',
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-neutral-800">{formatDate(row.attendanceDate)}</span>
          <span className="text-xs text-neutral-500">
            {formatTime(row.startTime)} - {formatTime(row.endTime)}
          </span>
        </div>
      ),
    },
    {
      header: 'Requested Time',
      accessorKey: 'durationMinutes',
      cell: (row) => (
        <span className="text-xs font-semibold text-neutral-800">
          {formatMinutes(row.durationMinutes || 0)}
        </span>
      ),
    },
    {
      header: 'Reason',
      accessorKey: 'reason',
      cell: (row) => (
        <span className="text-xs text-neutral-700 line-clamp-2 max-w-xs">{row.reason}</span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => getStatusBadge(row.status),
    },
    {
      header: 'Actions',
      accessorKey: 'id',
      cell: (row) => (
        <div className="flex items-center gap-1.5">
          {row.status === 'PENDING' ? (
            <>
              <Button
                variant="primary"
                size="sm"
                onClick={() => onOpenApprove(row)}
                leftIcon={<CheckCircle className="w-3.5 h-3.5" />}
              >
                Approve
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => onOpenReject(row)}
                leftIcon={<XCircle className="w-3.5 h-3.5" />}
              >
                Reject
              </Button>
            </>
          ) : (
            <span className="text-xs text-neutral-400">Processed</span>
          )}
        </div>
      ),
    },
  ];

  return { myColumns, teamColumns };
}
