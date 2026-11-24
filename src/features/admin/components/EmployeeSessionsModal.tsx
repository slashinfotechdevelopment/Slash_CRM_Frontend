import React from 'react';
import { FormModal } from '@/components/templates/FormModal';
import { Badge } from '@/components/ui/Badge';
import { EmployeeActivityItem, EmployeeSessionItem } from '@/api/types/admin.types';
import { formatDate } from '@/utils/formatters';

interface EmployeeSessionsModalProps {
  selectedEmployee: EmployeeActivityItem | null;
  onClose: () => void;
  sessions: EmployeeSessionItem[];
  loadingSessions: boolean;
}

export const EmployeeSessionsModal: React.FC<EmployeeSessionsModalProps> = ({
  selectedEmployee,
  onClose,
  sessions,
  loadingSessions,
}) => {
  return (
    <FormModal
      isOpen={Boolean(selectedEmployee)}
      onClose={onClose}
      title={`Session Audit Logs: ${selectedEmployee?.employeeName || selectedEmployee?.name || 'Staff'}`}
      subtitle={`${selectedEmployee?.department || 'Department'} • ${selectedEmployee?.email || '-'}`}
      maxWidth="2xl"
      onSubmit={(e) => {
        e.preventDefault();
        onClose();
      }}
      submitLabel="Done"
      cancelLabel="Close"
    >
      <div className="space-y-4">
        {loadingSessions ? (
          <div className="p-8 text-center text-xs text-neutral-400 animate-pulse">
            Loading session authentication records...
          </div>
        ) : sessions.length === 0 ? (
          <div className="p-8 text-center text-xs text-neutral-400 italic">
            No session logs found for this employee in the selected window.
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto divide-y divide-neutral-100 border border-neutral-100 rounded-lg">
            {sessions.map((s) => {
              const durSec = s.durationSeconds || 0;
              const durHours = Math.floor(durSec / 3600);
              const durMins = Math.floor((durSec % 3600) / 60);
              const isActive = s.status === 'active';

              return (
                <div key={s.sessionId} className="p-3 text-xs flex items-center justify-between hover:bg-neutral-50/50">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-neutral-800">
                        {formatDate(s.loginAt)}
                      </span>
                      <Badge variant={isActive ? 'success' : 'neutral'}>
                        {isActive ? 'Active Session' : 'Ended'}
                      </Badge>
                    </div>
                    <div className="text-[11px] text-neutral-400">
                      IP: {s.ipAddress || 'Internal'} • Agent: {s.userAgent || 'Web Browser'}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono font-bold text-neutral-900">
                      {durHours}h {durMins}m
                    </div>
                    <div className="text-[10px] text-neutral-400">Session Duration</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </FormModal>
  );
};
