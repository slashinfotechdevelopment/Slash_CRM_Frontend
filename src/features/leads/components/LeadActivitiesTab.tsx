import React from 'react';
import { LeadActivityItem } from '@/api/types/lead.types';
import { formatDateTime } from '@/utils/formatters';

interface LeadActivitiesTabProps {
  timeline: LeadActivityItem[];
}

export const LeadActivitiesTab: React.FC<LeadActivitiesTabProps> = ({ timeline }) => {
  return (
    <div className="space-y-4">
      {timeline.length === 0 ? (
        <div className="py-10 text-center text-xs text-neutral-400">
          No activity logs recorded yet. Click "Log Activity" to add calls, meetings, or notes.
        </div>
      ) : (
        <div className="relative border-l border-neutral-200 ml-4 space-y-6">
          {timeline.map((act) => (
            <div key={act.id} className="relative pl-6">
              <div className="absolute -left-2 top-1 w-4 h-4 rounded-full bg-white border-2 border-primary-500 flex items-center justify-center" />
              <div className="bg-neutral-50 rounded-lg p-3.5 border border-neutral-200/80">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-neutral-900">{act.title}</span>
                  <span className="text-[11px] text-neutral-400">{formatDateTime(act.createdAt)}</span>
                </div>
                {act.description && <p className="text-xs text-neutral-600 mt-1">{act.description}</p>}
                <div className="flex items-center gap-3 mt-2 text-[11px] text-neutral-500">
                  <span className="font-medium text-neutral-700 bg-neutral-200/60 px-1.5 py-0.5 rounded">
                    {act.type}
                  </span>
                  {act.performedBy && <span>By {act.performedBy.name}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
