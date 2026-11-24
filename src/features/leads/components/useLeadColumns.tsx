import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@/components/templates/DataTable';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LeadItem, LeadStatus, LeadPriority } from '@/api/types/lead.types';
import { formatDate, formatCurrency } from '@/utils/formatters';
import {
  Eye,
  UserCheck,
  RotateCcw,
  Trash2,
  PhoneCall,
  Mail,
} from 'lucide-react';

interface UseLeadColumnsOptions {
  onOpenAssign: (lead: LeadItem) => void;
  onOpenStatus: (lead: LeadItem) => void;
  onDeleteLead: (lead: LeadItem) => void;
}

export function useLeadColumns({
  onOpenAssign,
  onOpenStatus,
  onDeleteLead,
}: UseLeadColumnsOptions): ColumnDef<LeadItem>[] {
  const navigate = useNavigate();

  const getStatusBadge = (status?: LeadStatus) => {
    if (!status) return null;
    switch (status) {
      case 'NEW':
        return <Badge variant="neutral">New</Badge>;
      case 'CONTACTED':
        return <Badge variant="info">Contacted</Badge>;
      case 'QUALIFIED':
        return <Badge variant="success">Qualified</Badge>;
      case 'UNQUALIFIED':
        return <Badge variant="warning">Unqualified</Badge>;
      case 'CONVERTED':
        return <Badge variant="success">Converted (Won)</Badge>;
      case 'LOST':
        return <Badge variant="danger">Lost</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority?: LeadPriority) => {
    switch (priority) {
      case 'URGENT':
        return <Badge variant="danger">Urgent</Badge>;
      case 'HIGH':
        return <Badge variant="warning">High</Badge>;
      case 'MEDIUM':
        return <Badge variant="neutral">Medium</Badge>;
      case 'LOW':
      default:
        return <Badge variant="success">Low</Badge>;
    }
  };

  return [
    {
      header: 'Lead Name & ID',
      accessorKey: 'leadName',
      cell: (row) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-900 text-sm hover:text-primary-600 transition-colors">
              {row.leadName}
            </span>
            <span className="text-[11px] font-mono text-neutral-400 bg-neutral-100 px-1 py-0.2 rounded">
              {row.leadCode}
            </span>
          </div>
          {row.companyName && <span className="text-xs text-neutral-500 mt-0.5">{row.companyName}</span>}
        </div>
      ),
    },
    {
      header: 'Contact Info',
      accessorKey: 'phone',
      cell: (row) => (
        <div className="flex flex-col text-xs text-neutral-600 space-y-0.5">
          <div className="flex items-center gap-1.5">
            <PhoneCall className="w-3 h-3 text-neutral-400" />
            <span>{row.phone}</span>
          </div>
          {row.email && (
            <div className="flex items-center gap-1.5 text-neutral-500">
              <Mail className="w-3 h-3 text-neutral-400" />
              <span className="truncate max-w-[140px]">{row.email}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      header: 'Status & Funnel Stage',
      accessorKey: 'status',
      cell: (row) => (
        <div className="flex flex-col items-start gap-1">
          {getStatusBadge(row.status)}
          {row.pipelineStage && (
            <span className="text-[11px] text-primary-700 bg-primary-50 px-1.5 py-0.2 rounded border border-primary-200">
              {row.pipelineStage.name}
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'Priority',
      accessorKey: 'priority',
      cell: (row) => getPriorityBadge(row.priority),
    },
    {
      header: 'Assigned Specialist',
      accessorKey: 'assignedToId',
      cell: (row) => (
        <div className="flex flex-col text-xs">
          {row.assignedTo ? (
            <>
              <span className="font-semibold text-neutral-900">{row.assignedTo.name}</span>
              {row.department && <span className="text-[11px] text-neutral-500">{row.department.name}</span>}
            </>
          ) : (
            <span className="text-xs text-amber-600 font-medium">Unassigned</span>
          )}
        </div>
      ),
    },
    {
      header: 'Commercial Value',
      accessorKey: 'estimatedValue',
      cell: (row) => (
        <div className="flex flex-col text-xs">
          <span className="font-semibold text-neutral-800">
            {row.estimatedValue ? formatCurrency(row.estimatedValue, row.currency || 'INR') : '—'}
          </span>
          <span className="text-[11px] text-neutral-400">{formatDate(row.leadDate || row.createdAt)}</span>
        </div>
      ),
    },
    {
      header: 'Actions',
      accessorKey: 'id',
      cell: (row) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/leads/${row.id}`)}
            title="View Lead Timeline & Details"
          >
            <Eye className="w-3.5 h-3.5 text-neutral-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenAssign(row)}
            title="Assign Lead"
          >
            <UserCheck className="w-3.5 h-3.5 text-primary-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenStatus(row)}
            title="Change Status / Stage"
          >
            <RotateCcw className="w-3.5 h-3.5 text-neutral-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDeleteLead(row)}
            title="Delete Lead"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-600" />
          </Button>
        </div>
      ),
    },
  ];
}
