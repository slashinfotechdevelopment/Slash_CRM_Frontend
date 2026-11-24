import React from 'react';
import { FormModal } from '@/components/templates/FormModal';
import { Badge } from '@/components/ui/Badge';
import { EmployeeTaskSummaryItem, EmployeeTaskItem } from '@/api/types/admin.types';
import { formatDate } from '@/utils/formatters';

interface EmployeeTaskInspectionModalProps {
  inspectEmployee: EmployeeTaskSummaryItem | null;
  onClose: () => void;
  employeeTasks: EmployeeTaskItem[];
  loadingTasks: boolean;
}

export const EmployeeTaskInspectionModal: React.FC<EmployeeTaskInspectionModalProps> = ({
  inspectEmployee,
  onClose,
  employeeTasks,
  loadingTasks,
}) => {
  return (
    <FormModal
      isOpen={Boolean(inspectEmployee)}
      onClose={onClose}
      title={`Task Deliverables: ${inspectEmployee?.employeeName || 'Staff'}`}
      subtitle={`${inspectEmployee?.department || 'Department'} • User Code: ${inspectEmployee?.employeeCode || inspectEmployee?.employee?.code || '-'}`}
      maxWidth="2xl"
      onSubmit={(e) => {
        e.preventDefault();
        onClose();
      }}
      submitLabel="Done"
      cancelLabel="Close"
    >
      <div className="space-y-4">
        {loadingTasks ? (
          <div className="p-8 text-center text-xs text-neutral-400 animate-pulse">
            Loading employee task portfolio...
          </div>
        ) : employeeTasks.length === 0 ? (
          <div className="p-8 text-center text-xs text-neutral-400 italic">
            No individual task records found for this employee in the selected window.
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto divide-y divide-neutral-100 border border-neutral-100 rounded-lg">
            {employeeTasks.map((t) => (
              <div key={t.id} className="p-3 text-xs flex items-center justify-between hover:bg-neutral-50/50">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold text-neutral-700 bg-neutral-100 px-1.5 py-0.5 rounded">
                      {t.taskCode || 'TASK'}
                    </span>
                    <span className="font-medium text-neutral-900">{t.title}</span>
                  </div>
                  <div className="text-[11px] text-neutral-400">
                    Due: {t.dueDate ? formatDate(t.dueDate) : '-'} • Progress: {t.progress || 0}%
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={t.priority === 'URGENT' ? 'danger' : t.priority === 'HIGH' ? 'warning' : 'neutral'}>
                    {t.priority}
                  </Badge>
                  <Badge
                    variant={
                      t.computedStatus === 'completed'
                        ? 'success'
                        : t.computedStatus === 'overdue'
                        ? 'danger'
                        : 'neutral'
                    }
                  >
                    {t.rawStatus || t.computedStatus}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </FormModal>
  );
};
