import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { LeaveBalance } from '@/api/types/leave.types';

interface EmployeeBalanceRosterTableProps {
  balances: LeaveBalance[];
  loading: boolean;
  searchEmployee: string;
  onSearchChange: (val: string) => void;
  selectedYear: number;
  onYearChange: (year: number) => void;
}

export const EmployeeBalanceRosterTable: React.FC<EmployeeBalanceRosterTableProps> = ({
  balances,
  loading,
  searchEmployee,
  onSearchChange,
  selectedYear,
  onYearChange,
}) => {
  const filteredBalances = balances.filter((b) => {
    if (!searchEmployee) return true;
    const q = searchEmployee.toLowerCase();
    const empName = (b.userName || b.user?.name || '').toLowerCase();
    const empEmail = (b.user?.email || '').toLowerCase();
    const empCode = (b.userCode || b.user?.code || '').toLowerCase();
    const lName = (b.leaveTypeName || b.leaveType?.name || '').toLowerCase();
    return empName.includes(q) || empEmail.includes(q) || empCode.includes(q) || lName.includes(q);
  });

  return (
    <div className="space-y-4">
      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Search employee or leave type..."
            value={searchEmployee}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="w-36">
          <Select
            value={String(selectedYear)}
            onChange={(e) => onYearChange(Number(e.target.value))}
            options={[
              { label: 'Year 2025', value: '2025' },
              { label: 'Year 2026', value: '2026' },
              { label: 'Year 2027', value: '2027' },
            ]}
          />
        </div>
      </div>

      {/* Balances Table */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-neutral-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : filteredBalances.length === 0 ? (
          <div className="p-12 text-center text-neutral-500">
            <p className="font-medium text-neutral-700">No balance records found</p>
            <p className="text-xs text-neutral-400 mt-1">
              Try adjusting search parameters or fiscal year.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-50 text-neutral-600 font-semibold border-b border-neutral-200">
                <tr>
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Leave Type</th>
                  <th className="py-3 px-4">Allocated</th>
                  <th className="py-3 px-4">Accrued</th>
                  <th className="py-3 px-4">Used</th>
                  <th className="py-3 px-4">Pending</th>
                  <th className="py-3 px-4">Adjusted</th>
                  <th className="py-3 px-4 font-bold text-neutral-900">Available</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredBalances.map((b) => {
                  const empName = b.userName || b.user?.name || 'Staff Member';
                  const empCode = b.userCode || b.user?.code;
                  const dept =
                    (b.departments && b.departments.length > 0
                      ? b.departments.join(', ')
                      : b.user?.department?.name) || 'General';
                  const leaveName = b.leaveTypeName || b.leaveType?.name || 'Leave';
                  const accruedOrCarried = b.carriedForward ?? b.accruedDays ?? 0;

                  return (
                    <tr key={b.id || `${b.userId}_${b.leaveTypeId}`} className="hover:bg-neutral-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-medium text-neutral-900">{empName}</div>
                        <div className="text-xs text-neutral-500">
                          {empCode ? `${empCode} • ` : ''}
                          {dept}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium text-neutral-800">
                        {leaveName}
                      </td>
                      <td className="py-3 px-4 text-neutral-700">{b.allocatedDays} d</td>
                      <td className="py-3 px-4 text-neutral-700">{accruedOrCarried} d</td>
                      <td className="py-3 px-4 text-neutral-700">{b.usedDays} d</td>
                      <td className="py-3 px-4 text-amber-600 font-semibold">{b.pendingDays} d</td>
                      <td className="py-3 px-4 text-neutral-600">
                        {b.adjustedDays > 0 ? `+${b.adjustedDays}` : b.adjustedDays} d
                      </td>
                      <td className="py-3 px-4 font-extrabold text-neutral-900">
                        <Badge variant={b.availableDays > 0 ? 'success' : 'neutral'}>
                          {b.availableDays} days
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
