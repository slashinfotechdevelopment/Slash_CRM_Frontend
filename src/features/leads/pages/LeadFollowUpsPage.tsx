import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getErrorMessage } from '@/api/client/errorMapper';
import { ListPage } from '@/components/templates/ListPage';
import { ColumnDef } from '@/components/templates/DataTable';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/hooks/useToast';
import { leadsConnector } from '@/connectors/leads.connector';
import { LeadFollowUpItem, FollowUpStatus } from '@/api/types/lead.types';
import { formatDateTime } from '@/utils/formatters';
import { CheckCircle2, Calendar, ArrowRight, RefreshCw } from 'lucide-react';

export const LeadFollowUpsPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [followUps, setFollowUps] = useState<LeadFollowUpItem[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('PENDING');
  const [isLoading, setIsLoading] = useState(true);

  const fetchFollowUps = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await leadsConnector.getMyFollowUps((statusFilter as FollowUpStatus) || undefined);
      setFollowUps(res);
    } catch (err) {
      toast.danger('Error', getErrorMessage(err, 'Failed to load follow-ups.'));
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, toast]);

  useEffect(() => {
    fetchFollowUps();
  }, [fetchFollowUps]);

  const handleComplete = async (fu: LeadFollowUpItem) => {
    try {
      await leadsConnector.updateFollowUp(fu.id, {
        status: 'COMPLETED',
        note: fu.note ? `${fu.note} (Completed)` : 'Completed via follow-ups workspace',
      });
      toast.success('Completed', 'Follow-up marked as completed.');
      fetchFollowUps();
    } catch (err) {
      toast.danger('Error', getErrorMessage(err, 'Could not update status.'));
    }
  };

  const columns: ColumnDef<LeadFollowUpItem>[] = [
    {
      header: 'Follow-Up Action',
      accessorKey: 'note',
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-neutral-900">{row.note || 'Scheduled Follow-Up'}</span>
        </div>
      ),
    },
    {
      header: 'Associated Lead',
      accessorKey: 'lead',
      cell: (row) => (
        <div className="flex flex-col">
          {row.lead ? (
            <button
              type="button"
              onClick={() => navigate(`/leads/${row.leadId}`)}
              className="text-left font-semibold text-primary-600 hover:text-primary-800 text-xs hover:underline"
            >
              {row.lead.leadName} ({row.lead.leadCode})
            </button>
          ) : (
            <span className="text-xs text-neutral-400">Lead record</span>
          )}
        </div>
      ),
    },
    {
      header: 'Scheduled Due Date',
      accessorKey: 'scheduledAt',
      cell: (row) => (
        <div className="flex items-center gap-1.5 text-xs text-neutral-700">
          <Calendar className="w-3.5 h-3.5 text-neutral-400" />
          <span>{formatDateTime(row.scheduledAt)}</span>
        </div>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => {
        const isPast = new Date(row.scheduledAt).getTime() < Date.now();
        const isOverdue = row.status === 'PENDING' && isPast;
        return (
          <Badge variant={row.status === 'COMPLETED' ? 'success' : isOverdue ? 'danger' : 'warning'}>
            {isOverdue ? 'OVERDUE' : row.status}
          </Badge>
        );
      },
    },
    {
      header: 'Actions',
      accessorKey: 'id',
      cell: (row) => (
        <div className="flex items-center gap-2">
          {row.status !== 'COMPLETED' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleComplete(row)}
              leftIcon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
            >
              Complete
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/leads/${row.leadId}`)}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            View Lead
          </Button>
        </div>
      ),
    },
  ];

  return (
    <ListPage<LeadFollowUpItem>
      title="My Follow-Ups & Reminders"
      description="Manage upcoming prospect discovery calls, quote deliverables, and consultation commitments."
      items={followUps}
      columns={columns}
      total={followUps.length}
      isLoading={isLoading}
      onRetry={fetchFollowUps}
      filters={[
        {
          key: 'status',
          label: 'Status',
          options: [
            { value: '', label: 'All Statuses' },
            { value: 'PENDING', label: 'Pending' },
            { value: 'COMPLETED', label: 'Completed' },
            { value: 'CANCELLED', label: 'Cancelled' },
          ],
          value: statusFilter,
        },
      ]}
      onFilterChange={(_key, val) => setStatusFilter(val.toString())}
      headerActions={
        <Button variant="outline" size="sm" onClick={fetchFollowUps} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
          Refresh
        </Button>
      }
    />
  );
};
