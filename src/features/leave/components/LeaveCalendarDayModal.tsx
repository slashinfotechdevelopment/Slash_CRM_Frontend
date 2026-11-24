import React from 'react';
import { LeaveCalendarItem } from '@/api/types/leave.types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface LeaveCalendarDayModalProps {
  selectedDayEvents: { dateStr: string; items: LeaveCalendarItem[] } | null;
  onClose: () => void;
}

export const LeaveCalendarDayModal: React.FC<LeaveCalendarDayModalProps> = ({
  selectedDayEvents,
  onClose,
}) => {
  if (!selectedDayEvents) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-neutral-200 p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
          <div>
            <h3 className="font-bold text-neutral-900 text-base">
              Leaves on {selectedDayEvents.dateStr}
            </h3>
            <p className="text-xs text-neutral-500">
              {selectedDayEvents.items.length} employee(s) absent / on leave
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700"
          >
            ✕
          </Button>
        </div>

        <div className="space-y-2 max-h-80 overflow-y-auto">
          {selectedDayEvents.items.map((ev, idx) => (
            <div
              key={idx}
              className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 space-y-1 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-neutral-900">{ev.userName}</span>
                <Badge variant="primary">{ev.leaveTypeName}</Badge>
              </div>
              <div className="text-neutral-500 flex items-center justify-between">
                <span>
                  {ev.departmentName ? `${ev.departmentName} Department` : 'All Organization'}
                </span>
                <span className="font-mono text-[11px]">
                  {ev.startDate} → {ev.endDate}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 text-right">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
