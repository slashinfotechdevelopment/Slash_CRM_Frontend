import { ColumnDef } from '@/components/templates/DataTable';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ShiftDefinition } from '@/api/types/attendance.types';
import { Clock, Edit2, Trash2 } from 'lucide-react';

interface UseShiftColumnsProps {
  onEdit: (shift: ShiftDefinition) => void;
  onDelete: (shift: ShiftDefinition) => void;
}

export const useShiftColumns = ({
  onEdit,
  onDelete,
}: UseShiftColumnsProps): ColumnDef<ShiftDefinition>[] => [
  {
    header: 'Shift Code & Name',
    accessorKey: 'code',
    cell: (row) => (
      <div className="flex flex-col">
        <span className="font-semibold text-neutral-900">{row.name}</span>
        <span className="text-xs font-mono text-neutral-500">{row.code}</span>
      </div>
    ),
  },
  {
    header: 'Timing',
    accessorKey: 'startTime',
    cell: (row) => (
      <div className="flex items-center gap-1.5 text-xs text-neutral-800 font-medium">
        <Clock className="w-3.5 h-3.5 text-neutral-400" />
        <span>
          {row.startTime} - {row.endTime}
        </span>
        {row.isOvernight && <Badge variant="warning">Overnight</Badge>}
      </div>
    ),
  },
  {
    header: 'Grace & Cutoffs',
    accessorKey: 'gracePeriodMinutes',
    cell: (row) => (
      <div className="text-xs text-neutral-600">
        <span>Grace: {row.gracePeriodMinutes}m</span>
        <span className="mx-1">•</span>
        <span>Half: {row.halfDayThresholdMinutes / 60}h</span>
        <span className="mx-1">•</span>
        <span>Full: {row.fullDayThresholdMinutes / 60}h</span>
      </div>
    ),
  },
  {
    header: 'Break Policy',
    accessorKey: 'breakPolicy',
    cell: (row) => (
      <span className="text-xs text-neutral-700">
        {row.breakPolicy?.paidAllowanceMinutes || 60} paid mins
      </span>
    ),
  },
  {
    header: 'Actions',
    accessorKey: 'id',
    cell: (row) => (
      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(row)}
          title="Edit Shift"
          leftIcon={<Edit2 className="w-3.5 h-3.5" />}
        >
          Edit
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={() => onDelete(row)}
          title="Delete Shift"
          leftIcon={<Trash2 className="w-3.5 h-3.5" />}
        >
          Delete
        </Button>
      </div>
    ),
  },
];
