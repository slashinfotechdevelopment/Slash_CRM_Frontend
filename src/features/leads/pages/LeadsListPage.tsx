import React, { useMemo } from 'react';
import { ListPage } from '@/components/templates/ListPage';
import { FilterSelectConfig } from '@/components/templates/FilterBar';
import { Button } from '@/components/ui/Button';
import { LeadItem } from '@/api/types/lead.types';
import {
  UserPlus,
  Download,
  Upload,
  Kanban,
  Table as TableIcon,
} from 'lucide-react';
import { LeadKanbanBoard } from '../components/LeadKanbanBoard';
import { LeadListModals } from '../components/LeadListModals';
import { useLeadsList } from '../hooks/useLeadsList';
import { useLeadColumns } from '../components/useLeadColumns';

export const LeadsListPage: React.FC = () => {
  const {
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    sourceFilter,
    setSourceFilter,
    stageFilter,
    setStageFilter,
    viewMode,
    setViewMode,
    pipelineStages,
    leads,
    total,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    refresh,
    loadMore,
    setIsCreateOpen,
    setIsImportOpen,
    handleExportCsv,
    handleDeleteLead,
    openAssign,
    openStatus,
    modalsProps,
  } = useLeadsList();

  const columns = useLeadColumns({
    onOpenAssign: openAssign,
    onOpenStatus: openStatus,
    onDeleteLead: handleDeleteLead,
  });

  const filterConfigs: FilterSelectConfig[] = useMemo(
    () => [
      {
        key: 'status',
        label: 'Status',
        value: statusFilter,
        options: [
          { label: 'All Statuses', value: '' },
          { label: 'New', value: 'NEW' },
          { label: 'Contacted', value: 'CONTACTED' },
          { label: 'Qualified', value: 'QUALIFIED' },
          { label: 'Proposal Sent', value: 'PROPOSAL_SENT' },
          { label: 'Negotiation', value: 'NEGOTIATION' },
          { label: 'Won', value: 'WON' },
          { label: 'Lost', value: 'LOST' },
          { label: 'Disqualified', value: 'DISQUALIFIED' },
        ],
      },
      {
        key: 'priority',
        label: 'Priority',
        value: priorityFilter,
        options: [
          { label: 'All Priorities', value: '' },
          { label: 'Urgent', value: 'URGENT' },
          { label: 'High', value: 'HIGH' },
          { label: 'Medium', value: 'MEDIUM' },
          { label: 'Low', value: 'LOW' },
        ],
      },
      {
        key: 'source',
        label: 'Source',
        value: sourceFilter,
        options: [
          { label: 'All Sources', value: '' },
          { label: 'Website', value: 'WEBSITE' },
          { label: 'Manual', value: 'MANUAL' },
          { label: 'Referral', value: 'REFERRAL' },
          { label: 'LinkedIn', value: 'LINKEDIN' },
          { label: 'Google Ads', value: 'GOOGLE_ADS' },
          { label: 'Cold Call', value: 'COLD_CALL' },
          { label: 'Campaign', value: 'CAMPAIGN' },
        ],
      },
      {
        key: 'stage',
        label: 'Stage',
        value: stageFilter,
        options: [
          { label: 'All Pipeline Stages', value: '' },
          ...pipelineStages.map((s) => ({ label: s.name, value: s.id })),
        ],
      },
    ],
    [statusFilter, priorityFilter, sourceFilter, stageFilter, pipelineStages],
  );

  const handleFilterChange = (key: string, val: string | number) => {
    const v = String(val);
    if (key === 'status') setStatusFilter(v);
    if (key === 'priority') setPriorityFilter(v);
    if (key === 'source') setSourceFilter(v);
    if (key === 'stage') setStageFilter(v);
  };

  return (
    <>
      <ListPage<LeadItem>
        title="Leads & Sales Pipeline"
        description="Capture prospects, advance lifecycle stages, and monitor commercial opportunity values."
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search leads by name, code, phone, or email..."
        filters={filterConfigs}
        onFilterChange={handleFilterChange}
        headerActions={
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-neutral-100 p-0.5 rounded-lg border border-neutral-200">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-all ${
                  viewMode === 'table' ? 'bg-white text-neutral-900 shadow-2xs' : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span>Table</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('kanban')}
                className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-all ${
                  viewMode === 'kanban' ? 'bg-white text-neutral-900 shadow-2xs' : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                <Kanban className="w-3.5 h-3.5" />
                <span>Kanban</span>
              </button>
            </div>
            <Button variant="outline" size="sm" onClick={() => setIsImportOpen(true)} leftIcon={<Upload className="w-3.5 h-3.5" />}>
              Import
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportCsv} leftIcon={<Download className="w-3.5 h-3.5" />}>
              Export
            </Button>
            <Button variant="primary" size="sm" onClick={() => setIsCreateOpen(true)} leftIcon={<UserPlus className="w-3.5 h-3.5" />}>
              New Lead
            </Button>
          </div>
        }
        columns={columns}
        items={leads}
        total={total}
        isLoading={isLoading}
        isLoadingMore={isLoadingMore}
        hasMore={hasMore}
        error={error}
        onRetry={refresh}
        onLoadMore={loadMore}
      >
        {viewMode === 'kanban' && (
          <LeadKanbanBoard pipelineStages={pipelineStages} leads={leads} />
        )}
      </ListPage>

      <LeadListModals {...modalsProps} />
    </>
  );
};
