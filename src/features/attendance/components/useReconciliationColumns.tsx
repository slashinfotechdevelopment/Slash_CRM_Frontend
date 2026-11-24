import { ColumnDef } from '@/components/templates/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ReconciliationRun, ReconciliationRunStatus } from '@/api/types/attendance.types';
import { formatDate } from '@/utils/formatters';
import { Eye } from 'lucide-react';

interface UseReconciliationColumnsOptions {
  onViewRun: (run: ReconciliationRun) => void;
}

export function useReconciliationColumns({
  onViewRun,
}: UseReconciliationColumnsOptions): ColumnDef<ReconciliationRun>[] {
  const getStatusBadge = (status: ReconciliationRunStatus) => {
    switch (status) {
      case 'COMPLETED':
        return <Badge variant="success">Completed</Badge>;
      case 'IN_PROGRESS':
        return <Badge variant="warning">In Progress</Badge>;
      case 'PARTIAL':
        return <Badge variant="warning">Partial</Badge>;
      case 'FAILED':
        return <Badge variant="danger">Failed</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return [
    {
      header: 'Target Date',
      accessorKey: 'targetDate',
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-neutral-900">{formatDate(row.targetDate)}</span>
          <span className="text-xs text-neutral-500">Run at {formatDate(row.createdAt)}</span>
        </div>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => getStatusBadge(row.status),
    },
    {
      header: 'Records Processed',
      accessorKey: 'totalRecordsProcessed',
      cell: (row) => (
        <span className="text-xs font-semibold text-neutral-800">
          {row.totalRecordsProcessed ?? '—'}
        </span>
      ),
    },
    {
      header: 'Reconciled',
      accessorKey: 'reconciledRecordsCount',
      cell: (row) => (
        <span className="text-xs font-semibold text-emerald-700">
          {row.reconciledRecordsCount ?? '—'}
        </span>
      ),
    },
    {
      header: 'Anomalies Quarantined',
      accessorKey: 'anomaliesCount',
      cell: (row) => (
        <span className="text-xs font-semibold text-rose-600">
          {row.anomaliesCount ?? '0'}
        </span>
      ),
    },
    {
      header: 'Duration',
      accessorKey: 'executionDurationMs',
      cell: (row) => (
        <span className="text-xs text-neutral-600 font-mono">
          {row.executionDurationMs != null ? `${row.executionDurationMs}ms` : '—'}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessorKey: 'id',
      cell: (row) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewRun(row)}
          leftIcon={<Eye className="w-3.5 h-3.5" />}
        >
          Details
        </Button>
      ),
    },
  ];
}
