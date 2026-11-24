import React from 'react';
import { EmployeePerformanceReportData } from '@/api/types/task.types';

export interface EmployeePerfRow {
  employee?: { id?: string; name?: string; userCode?: string; departments?: string[] };
  employeeName?: string;
  userCode?: string;
  employeeId?: string;
  departmentName?: string;
  assignedTaskCount?: number;
  assigned?: number;
  completedTaskCount?: number;
  completed?: number;
  pendingTaskCount?: number;
  pending?: number;
  overdueTaskCount?: number;
  overdue?: number;
  completionPercentage?: number;
  totalTrackedHours?: number;
  trackedHours?: number;
}

interface TaskReportPerformanceTabProps {
  perfReport: EmployeePerformanceReportData | null;
}

export const TaskReportPerformanceTab: React.FC<TaskReportPerformanceTabProps> = ({ perfReport }) => {
  const perfReportObj = perfReport as unknown as {
    data?: EmployeePerfRow[];
    employees?: EmployeePerfRow[];
  };
  const perfList: EmployeePerfRow[] = Array.isArray(perfReport)
    ? (perfReport as unknown as EmployeePerfRow[])
    : perfReportObj?.data ?? perfReportObj?.employees ?? [];

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
      {perfList.length === 0 ? (
        <div className="p-8 text-center text-xs text-slate-400 italic">
          No employee performance data available.
        </div>
      ) : (
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
            <tr>
              <th className="p-3">Employee</th>
              <th className="p-3">Department</th>
              <th className="p-3">Assigned</th>
              <th className="p-3">Completed</th>
              <th className="p-3">Pending</th>
              <th className="p-3">Overdue</th>
              <th className="p-3">Completion %</th>
              <th className="p-3">Tracked Hours</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {perfList.map((emp: EmployeePerfRow, idx: number) => {
              const empName = emp.employee?.name || emp.employeeName || 'Unknown';
              const empCode = emp.employee?.userCode || emp.userCode || '';
              const empId = emp.employee?.id || emp.employeeId || `perf-${idx}`;
              const deptName = emp.employee?.departments?.join(', ') || emp.departmentName || '-';
              const assigned = emp.assignedTaskCount ?? emp.assigned ?? 0;
              const completed = emp.completedTaskCount ?? emp.completed ?? 0;
              const pending = emp.pendingTaskCount ?? emp.pending ?? 0;
              const overdue = emp.overdueTaskCount ?? emp.overdue ?? 0;
              const completion = emp.completionPercentage ?? (assigned > 0 ? Math.round((completed / assigned) * 100) : 0);
              const tracked = emp.totalTrackedHours ?? emp.trackedHours ?? 0;

              return (
                <tr key={empId} className="hover:bg-slate-50/50">
                  <td className="p-3 font-semibold text-slate-800">
                    {empName} {empCode && <span className="font-mono text-slate-400 font-normal">({empCode})</span>}
                  </td>
                  <td className="p-3 text-slate-600">{deptName}</td>
                  <td className="p-3 font-semibold">{assigned}</td>
                  <td className="p-3 text-emerald-600 font-semibold">{completed}</td>
                  <td className="p-3 text-slate-500">{pending}</td>
                  <td className="p-3 text-rose-600 font-semibold">{overdue}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-brand-primary h-1.5 rounded-full" style={{ width: `${completion}%` }} />
                      </div>
                      <span className="font-semibold">{completion}%</span>
                    </div>
                  </td>
                  <td className="p-3 font-mono">{tracked} hrs</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};
