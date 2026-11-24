import { ColumnDef } from '@/components/templates/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { AnomalyRecord, AnomalyStatus } from '@/api/types/attendance.types';
import { formatDate } from '@/utils/formatters';
import { Eye, CheckCircle, ShieldAlert } from 'lucide-react';

interface UseAnomalyColumnsOptions {
  onViewDetail: (anomaly: AnomalyRecord) => void;
  onOpenResolve: (anomaly: AnomalyRecord) => void;
}

export function useAnomalyColumns({
  onViewDetail,
  onOpenResolve,
}: UseAnomalyColumnsOptions): ColumnDef<AnomalyRecord>[] {
  const getStatusBadge = (status: AnomalyStatus, isResolved?: boolean) => {
    if (isResolved || status === 'RESOLVED') {
      return <Badge variant="success">Resolved</Badge>;
    }
    if (status === 'DISMISSED') {
      return <Badge variant="neutral">Dismissed</Badge>;
    }
    return <Badge variant="danger">Quarantined</Badge>;
  };

  return [
    {
      header: 'Employee',
      accessorKey: 'user',
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-neutral-900">
            {row.user?.name || row.attendanceRecord?.user?.name || 'Employee'}
          </span>
          <span className="text-xs text-neutral-500">
            {row.user?.email || row.attendanceRecord?.user?.email}
          </span>
        </div>
      ),
    },
    {
      header: 'Attendance Date',
      accessorKey: 'createdAt',
      cell: (row) => (
        <span className="text-xs font-semibold text-neutral-800">
          {formatDate(row.attendanceRecord?.attendanceDate || row.createdAt)}
        </span>
      ),
    },
    {
      header: 'Anomaly Type',
      accessorKey: 'anomalyType',
      cell: (row) => (
        <div className="flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />
          <span className="font-semibold text-neutral-800 text-xs">{row.anomalyType}</span>
        </div>
      ),
    },
    {
      header: 'Description',
      accessorKey: 'description',
      cell: (row) => (
        <span className="text-xs text-neutral-700 line-clamp-2 max-w-sm">
          {row.description || 'System quarantined anomaly flagged during EOD reconciliation.'}
        </span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => getStatusBadge(row.status, row.isResolved),
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
            leftIcon={<Eye className="w-3.5 h-3.5" />}
          >
            Details
          </Button>
          {!row.isResolved && row.status === 'ACTIVE' && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onOpenResolve(row)}
              leftIcon={<CheckCircle className="w-3.5 h-3.5" />}
            >
              Resolve
            </Button>
          )}
        </div>
      ),
    },
  ];
}
