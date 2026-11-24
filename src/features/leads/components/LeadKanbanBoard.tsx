import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { LeadItem, PipelineStageItem, LeadPriority } from '@/api/types/lead.types';
import { formatCurrency } from '@/utils/formatters';

interface LeadKanbanBoardProps {
  pipelineStages: PipelineStageItem[];
  leads: LeadItem[];
}

export const LeadKanbanBoard: React.FC<LeadKanbanBoardProps> = ({
  pipelineStages,
  leads,
}) => {
  const navigate = useNavigate();

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

  return (
    <div className="mt-4 overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-[1000px]">
        {pipelineStages.map((stage) => {
          const stageLeads = leads.filter((l) => l.pipelineStageId === stage.id);
          const stageValue = stageLeads.reduce((acc, curr) => acc + (curr.estimatedValue || 0), 0);

          return (
            <div
              key={stage.id}
              className="flex-1 bg-neutral-100/70 rounded-xl p-3 border border-neutral-200/80 min-w-[280px]"
            >
              <div className="flex items-center justify-between pb-2 border-b border-neutral-200 mb-3">
                <div>
                  <h3 className="font-semibold text-xs text-neutral-800 uppercase tracking-wider">
                    {stage.name}
                  </h3>
                  <span className="text-[11px] text-neutral-400">
                    {formatCurrency(stageValue, 'INR')}
                  </span>
                </div>
                <span className="text-xs font-semibold bg-white px-2 py-0.5 rounded-full border border-neutral-200 text-neutral-600">
                  {stageLeads.length}
                </span>
              </div>

              <div className="space-y-2.5 max-h-[calc(100vh-320px)] overflow-y-auto pr-1">
                {stageLeads.length === 0 ? (
                  <div className="py-8 text-center text-xs text-neutral-400">No leads in this stage</div>
                ) : (
                  stageLeads.map((l) => (
                    <div
                      key={l.id}
                      onClick={() => navigate(`/leads/${l.id}`)}
                      className="bg-white p-3 rounded-lg border border-neutral-200 shadow-2xs hover:border-primary-400 hover:shadow-sm cursor-pointer transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-medium text-primary-600 bg-primary-50 px-1 py-0.5 rounded">
                          {l.leadCode}
                        </span>
                        {getPriorityBadge(l.priority)}
                      </div>
                      <h4 className="font-semibold text-sm text-neutral-900 mt-1">{l.leadName}</h4>
                      <p className="text-xs text-neutral-500 truncate">{l.companyName || l.phone}</p>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-100 text-xs">
                        <span className="font-semibold text-neutral-800">
                          {l.estimatedValue ? formatCurrency(l.estimatedValue, l.currency || 'INR') : '—'}
                        </span>
                        <span className="text-neutral-500">{l.assignedTo?.name || 'Unassigned'}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
