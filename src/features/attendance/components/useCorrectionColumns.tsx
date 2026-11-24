import { ColumnDef } from '@/components/templates/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  CorrectionRequest,
  AttendanceCorrectionStatus,
  CorrectionType,
} from '@/api/types/attendance.types';
import { formatDate, formatTime } from '@/utils/formatters';
import { CheckCircle, XCircle, Eye, Ban } from 'lucide-react';

export const getCorrectionStatusBadge = (status: AttendanceCorrectionStatus) => {
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

export const formatCorrectionType = (type: CorrectionType) => {
  switch (type) {
    case 'MISSED_CHECK_IN':
      return 'Missed Check In';
    case 'MISSED_CHECK_OUT':
      return 'Missed Check Out';
    case 'INCORRECT_CHECK_IN':
      return 'Incorrect Check In';
    case 'INCORRECT_CHECK_OUT':
      return 'Incorrect Check Out';
    case 'INCORRECT_BREAK':
      return 'Incorrect Break';
    case 'OTHER':
      return 'Other Correction';
    default:
      return type;
  }
};

interface UseCorrectionColumnsProps {
  onViewDetail: (req: CorrectionRequest) => void;
  onCancelRequest?: (req: CorrectionRequest) => void;
  onOpenApprove?: (req: CorrectionRequest) => void;
  onOpenReject?: (req: CorrectionRequest) => void;
}

export const useCorrectionColumns = ({
  onViewDetail,
  onCancelRequest,
  onOpenApprove,
  onOpenReject,
}: UseCorrectionColumnsProps) => {
  const myColumns: ColumnDef<CorrectionRequest>[] = [
    {
      header: 'Date & Discrepancy Type',
      accessorKey: 'attendanceDate',
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-neutral-900">{formatDate(row.attendanceDate)}</span>
          <span className="text-xs font-medium text-primary-700">
            {formatCorrectionType(row.correctionType)}
          </span>
        </div>
      ),
    },
    {
      header: 'Requested Timestamps',
      accessorKey: 'requestedCheckInAt',
      cell: (row) => (
        <div className="flex flex-col text-xs text-neutral-700">
          {row.requestedCheckInAt && <span>In: {formatTime(row.requestedCheckInAt)}</span>}
          {row.requestedCheckOutAt && <span>Out: {formatTime(row.requestedCheckOutAt)}</span>}
          {!row.requestedCheckInAt && !row.requestedCheckOutAt && <span>—</span>}
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
      cell: (row) => getCorrectionStatusBadge(row.status),
    },
    {
      header: 'Actions',
      accessorKey: 'id',
      cell: (row) => (
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetail(row)}
            title="View Details"
            leftIcon={<Eye className="w-3.5 h-3.5" />}
          >
            Details
          </Button>
          {row.status === 'PENDING' && onCancelRequest && (
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

  const teamColumns: ColumnDef<CorrectionRequest>[] = [
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
      header: 'Date & Type',
      accessorKey: 'attendanceDate',
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-neutral-800">{formatDate(row.attendanceDate)}</span>
          <span className="text-xs font-medium text-primary-700">
            {formatCorrectionType(row.correctionType)}
          </span>
        </div>
      ),
    },
    {
      header: 'Requested Timing',
      accessorKey: 'requestedCheckInAt',
      cell: (row) => (
        <div className="flex flex-col text-xs text-neutral-700">
          {row.requestedCheckInAt && <span>In: {formatTime(row.requestedCheckInAt)}</span>}
          {row.requestedCheckOutAt && <span>Out: {formatTime(row.requestedCheckOutAt)}</span>}
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
      cell: (row) => getCorrectionStatusBadge(row.status),
    },
    {
      header: 'Actions',
      accessorKey: 'id',
      cell: (row) => (
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetail(row)}
            title="View Details"
            leftIcon={<Eye className="w-3.5 h-3.5" />}
          >
            Details
          </Button>
          {row.status === 'PENDING' && onOpenApprove && onOpenReject ? (
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
};
