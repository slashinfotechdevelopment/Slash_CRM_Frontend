import React from 'react';
import { Button } from '@/components/ui/Button';
import { EmployeeTaskSummaryItem } from '@/api/types/admin.types';

interface AdminEmployeeTasksTableProps {
  summaryList: EmployeeTaskSummaryItem[];
  onInspect: (item: EmployeeTaskSummaryItem) => void;
}

export const AdminEmployeeTasksTable: React.FC<AdminEmployeeTasksTableProps> = ({
  summaryList,
  onInspect,
}) => {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
      <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-neutral-900">Personnel Deliverable Performance Matrix</h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Cross-department velocity, individual task volumes, and completion ratios.
          </p>
        </div>
        <span className="text-xs text-neutral-500 font-mono">
          {summaryList.length} staff records
        </span>
      </div>

      {summaryList.length === 0 ? (
        <div className="p-12 text-center text-xs text-neutral-400 italic">
          No task metrics found for the selected reporting period.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-neutral-50 text-neutral-500 border-b border-neutral-200">
              <tr>
                <th className="p-3">Employee</th>
                <th className="p-3">Department</th>
                <th className="p-3 text-center">Assigned</th>
                <th className="p-3 text-center">Completed</th>
                <th className="p-3 text-center">Pending</th>
                <th className="p-3 text-center">Overdue</th>
                <th className="p-3">Throughput %</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {summaryList.map((emp, idx) => {
                const name = emp.employeeName || 'Employee';
                const code = emp.employeeCode || emp.employee?.code || '';
                const dept = emp.department || '-';
                const assigned = emp.totalTasks ?? 0;
                const completed = emp.completedTasks ?? 0;
                const pending = emp.pendingTasks ?? 0;
                const overdue = emp.overdueTasks ?? 0;
                const rate = emp.completionRatePercentage ?? (assigned > 0 ? Math.round((completed / assigned) * 100) : 0);

                return (
                  <tr key={emp.employeeId || `emp-${idx}`} className="hover:bg-neutral-50/50">
                    <td className="p-3 font-semibold text-neutral-900">
                      {name} {code && <span className="font-mono text-neutral-400 font-normal">({code})</span>}
                    </td>
                    <td className="p-3 text-neutral-600">{dept}</td>
                    <td className="p-3 text-center font-bold text-neutral-800">{assigned}</td>
                    <td className="p-3 text-center font-bold text-emerald-600">{completed}</td>
                    <td className="p-3 text-center text-neutral-500">{pending}</td>
                    <td className="p-3 text-center font-bold text-rose-600">{overdue}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-neutral-100 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-brand-primary h-1.5 rounded-full" style={{ width: `${rate}%` }} />
                        </div>
                        <span className="font-semibold text-neutral-800">{rate}%</span>
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onInspect(emp)}
                        className="text-xs py-1 px-2.5 h-auto text-brand-primary hover:bg-neutral-50"
                      >
                        Inspect Tasks
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
