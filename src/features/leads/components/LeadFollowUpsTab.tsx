import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LeadDetail } from '@/api/types/lead.types';
import { formatDateTime } from '@/utils/formatters';
import { CheckCircle2 } from 'lucide-react';

interface LeadFollowUpsTabProps {
  lead: LeadDetail | null;
  onCompleteFollowUp: (followUpId: string) => void;
}

export const LeadFollowUpsTab: React.FC<LeadFollowUpsTabProps> = ({
  lead,
  onCompleteFollowUp,
}) => {
  return (
    <div className="space-y-3">
      {!lead?.followUps || lead.followUps.length === 0 ? (
        <div className="py-10 text-center text-xs text-neutral-400">
          No pending follow-ups. Click "Schedule Follow-up" to set a client reminder.
        </div>
      ) : (
        lead.followUps.map((fu) => (
          <div
            key={fu.id}
            className="p-3.5 bg-neutral-50 rounded-lg border border-neutral-200 flex items-center justify-between"
          >
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-xs text-neutral-900">
                  {fu.note || 'Scheduled Follow-Up'}
                </span>
                <Badge variant={fu.status === 'COMPLETED' ? 'success' : 'warning'}>
                  {fu.status}
                </Badge>
              </div>
              <span className="text-[11px] text-neutral-400 mt-1">
                Due: {formatDateTime(fu.scheduledAt)} • Assigned to: {fu.assignedTo?.name || 'Unassigned'}
              </span>
            </div>

            {fu.status !== 'COMPLETED' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onCompleteFollowUp(fu.id)}
                leftIcon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
              >
                Complete
              </Button>
            )}
          </div>
        ))
      )}
    </div>
  );
};
