import React from 'react';
import { LeaveReportSummary } from '@/api/types/leave.types';

interface LeaveReportsBreakdownProps {
  summary: LeaveReportSummary;
}

export const LeaveReportsBreakdown: React.FC<LeaveReportsBreakdownProps> = ({ summary }) => {
  return (
    <>
      {/* Breakdown By Leave Type */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-neutral-200">
          <h2 className="font-bold text-neutral-900 text-sm">Consumption by Leave Category</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 text-neutral-600 font-semibold border-b border-neutral-200">
              <tr>
                <th className="py-3 px-4">Leave Type</th>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Allocated</th>
                <th className="py-3 px-4">Used</th>
                <th className="py-3 px-4">Pending</th>
                <th className="py-3 px-4">Available</th>
                <th className="py-3 px-4">Utilization</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {summary.byLeaveType?.map((lt) => {
                const uRate = lt.allocated > 0 ? Math.round((lt.used / lt.allocated) * 100) : 0;
                return (
                  <tr key={lt.leaveTypeId} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="py-3 px-4 font-bold text-neutral-900">{lt.leaveTypeName}</td>
                    <td className="py-3 px-4 font-mono text-xs text-neutral-600">{lt.leaveTypeCode}</td>
                    <td className="py-3 px-4 text-neutral-800">{lt.allocated} d</td>
                    <td className="py-3 px-4 text-neutral-800">{lt.used} d</td>
                    <td className="py-3 px-4 text-amber-600 font-semibold">{lt.pending} d</td>
                    <td className="py-3 px-4 font-bold text-neutral-900">{lt.available} d</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-neutral-100 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-primary-600 h-full rounded-full"
                            style={{ width: `${Math.min(100, uRate)}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-neutral-700">{uRate}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Department Breakdown if present */}
      {summary.byDepartment && summary.byDepartment.length > 0 && (
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-neutral-200">
            <h2 className="font-bold text-neutral-900 text-sm">Department Allocations & Usage</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-50 text-neutral-600 font-semibold border-b border-neutral-200">
                <tr>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Employees</th>
                  <th className="py-3 px-4">Total Allocated</th>
                  <th className="py-3 px-4">Total Consumed</th>
                  <th className="py-3 px-4">Pending</th>
                  <th className="py-3 px-4">Remaining Available</th>
                  <th className="py-3 px-4">Utilization</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {summary.byDepartment.map((dept) => {
                  const deptURate =
                    dept.allocated > 0
                      ? Math.round((dept.used / dept.allocated) * 100)
                      : 0;
                  return (
                    <tr key={dept.departmentId} className="hover:bg-neutral-50/60 transition-colors">
                      <td className="py-3 px-4 font-bold text-neutral-900">{dept.departmentName}</td>
                      <td className="py-3 px-4 text-neutral-600">{dept.totalEmployees} staff</td>
                      <td className="py-3 px-4 text-neutral-800">{dept.allocated} d</td>
                      <td className="py-3 px-4 text-neutral-800">{dept.used} d</td>
                      <td className="py-3 px-4 text-amber-600 font-semibold">{dept.pending} d</td>
                      <td className="py-3 px-4 font-bold text-neutral-900">{dept.available} d</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-neutral-100 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-emerald-600 h-full rounded-full"
                              style={{ width: `${Math.min(100, deptURate)}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-neutral-700">{deptURate}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};
