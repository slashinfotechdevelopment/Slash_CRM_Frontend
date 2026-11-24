import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { EmployeeActivityItem } from '@/api/types/admin.types';
import { formatDate } from '@/utils/formatters';

interface AdminActivityTableProps {
  search: string;
  onSearchChange: (val: string) => void;
  filteredItems: EmployeeActivityItem[];
  total: number;
  onViewSessions: (emp: EmployeeActivityItem) => void;
}

export const AdminActivityTable: React.FC<AdminActivityTableProps> = ({
  search,
  onSearchChange,
  filteredItems,
  total,
  onViewSessions,
}) => {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
      <div className="p-4 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-neutral-900">Personnel Activity & Status Roster</h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Audit live presence, session counts, accumulated duration, and latest authentication timestamps.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Filter staff by name or email..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-56 text-xs"
          />
          <span className="text-xs text-neutral-400 font-mono">
            {filteredItems.length} / {total}
          </span>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="p-12 text-center text-xs text-neutral-400 italic">
          No personnel activity records match your search criteria.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-neutral-50 text-neutral-500 border-b border-neutral-200">
              <tr>
                <th className="p-3">Employee</th>
                <th className="p-3">Department</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-center">Sessions</th>
                <th className="p-3">Active Duration</th>
                <th className="p-3">Last Active</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredItems.map((emp, idx) => {
                const name = emp.employeeName || emp.name || 'Staff Member';
                const code = emp.employeeCode || emp.userCode || '';
                const email = emp.email || '';
                const dept = emp.department || '-';
                const isOnline = emp.status === 'online' || emp.isOnline;
                const durSec = emp.totalActiveDurationSeconds || 0;
                const durHours = Math.floor(durSec / 3600);
                const durMins = Math.floor((durSec % 3600) / 60);
                const lastSeen = emp.lastLogin || emp.lastLoginAt;

                return (
                  <tr key={emp.employeeId || emp.id || `emp-${idx}`} className="hover:bg-neutral-50/50">
                    <td className="p-3 font-semibold text-neutral-900">
                      <div>
                        {name} {code && <span className="font-mono text-neutral-400 font-normal">({code})</span>}
                      </div>
                      <div className="text-[11px] text-neutral-400 font-normal">{email}</div>
                    </td>
                    <td className="p-3 text-neutral-600">{dept}</td>
                    <td className="p-3">
                      <Badge variant={isOnline ? 'success' : 'neutral'}>
                        {isOnline ? 'ONLINE' : 'OFFLINE'}
                      </Badge>
                    </td>
                    <td className="p-3 text-center font-bold text-neutral-800">
                      {emp.totalSessions ?? 0}
                    </td>
                    <td className="p-3 font-mono">
                      {durHours}h {durMins}m
                    </td>
                    <td className="p-3 text-neutral-500">
                      {lastSeen ? formatDate(lastSeen) : 'Never'}
                    </td>
                    <td className="p-3 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onViewSessions(emp)}
                        className="text-xs py-1 px-2.5 h-auto text-brand-primary hover:bg-neutral-50"
                      >
                        Session Logs
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
