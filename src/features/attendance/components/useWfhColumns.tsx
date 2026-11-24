import { ColumnDef } from '@/components/templates/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { WfhRequest, WfhStatus } from '@/api/types/attendance.types';
import { formatDate } from '@/utils/formatters';
import { CheckCircle, XCircle, Ban } from 'lucide-react';

interface UseWfhColumnsOptions {
  onCancelRequest: (req: WfhRequest) => void;
  onApproveRequest: (req: WfhRequest) => void;
  onOpenReject: (req: WfhRequest) => void;
}

export function useWfhColumns({
  onCancelRequest,
  onApproveRequest,
  onOpenReject,
}: UseWfhColumnsOptions) {
  const getStatusBadge = (status: WfhStatus) => {
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

  const myColumns: ColumnDef<WfhRequest>[] = [
    {
      header: 'Dates',
      accessorKey: 'startDate',
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-neutral-900">
            {formatDate(row.startDate)} - {formatDate(row.endDate)}
          </span>
          <span className="text-xs text-neutral-500">
            Submitted on {formatDate(row.createdAt)}
          </span>
        </div>
      ),
    },
    {
      header: 'Reason',
      accessorKey: 'reason',
      cell: (row) => (
        <span className="text-xs text-neutral-700 line-clamp-2 max-w-sm">
          {row.reason}
        </span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => getStatusBadge(row.status),
    },
    {
      header: 'Reviewer Notes',
      accessorKey: 'reviewerNotes',
      cell: (row) => (
        <span className="text-xs text-neutral-600">
          {row.reviewerNotes || '—'}
        </span>
      ),
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

  const teamColumns: ColumnDef<WfhRequest>[] = [
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
      header: 'Dates',
      accessorKey: 'startDate',
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-neutral-800">
            {formatDate(row.startDate)} - {formatDate(row.endDate)}
          </span>
          <span className="text-xs text-neutral-500">Applied {formatDate(row.createdAt)}</span>
        </div>
      ),
    },
    {
      header: 'Reason',
      accessorKey: 'reason',
      cell: (row) => (
        <span className="text-xs text-neutral-700 line-clamp-2 max-w-xs">
          {row.reason}
        </span>
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
                onClick={() => onApproveRequest(row)}
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
