import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { LeadsByEmployeeItem, LeadSourceItem } from '@/api/types/admin.types';

interface AdminLeadsStaffAndSourcesProps {
  employeeRanking: LeadsByEmployeeItem[];
  sources: LeadSourceItem[];
}

export const AdminLeadsStaffAndSources: React.FC<AdminLeadsStaffAndSourcesProps> = ({
  employeeRanking,
  sources,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Staff Performance Ranking */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-neutral-200">
          <h3 className="font-bold text-neutral-900 text-sm">Staff Lead Conversion Leaderboard</h3>
        </div>
        {employeeRanking.length === 0 ? (
          <div className="p-8 text-center text-xs text-neutral-400">
            No employee conversion statistics recorded.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 text-neutral-600 font-semibold border-b border-neutral-200">
                <tr>
                  <th className="py-2.5 px-3">Sales Agent</th>
                  <th className="py-2.5 px-3">Assigned</th>
                  <th className="py-2.5 px-3">Converted</th>
                  <th className="py-2.5 px-3">Rate %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {employeeRanking.map((emp) => {
                  const empId = emp.employeeId || emp.employee?.id || '';
                  const empName = emp.employeeName || emp.employee?.name || 'Staff';
                  const assigned = emp.totalAssigned ?? 0;
                  const converted = emp.converted ?? emp.convertedCount ?? 0;
                  const rate = emp.conversionRatePercentage ?? 0;

                  return (
                    <tr key={empId} className="hover:bg-neutral-50/60">
                      <td className="py-2.5 px-3 font-semibold text-neutral-900">
                        {empName}
                      </td>
                      <td className="py-2.5 px-3 text-neutral-800">{assigned}</td>
                      <td className="py-2.5 px-3 font-bold text-emerald-600">{converted}</td>
                      <td className="py-2.5 px-3">
                        <Badge variant={rate > 0 ? 'success' : 'neutral'}>
                          {rate}%
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

      {/* Channels & Sources Breakdown */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-neutral-200">
          <h3 className="font-bold text-neutral-900 text-sm">Acquisition Channels & Conversion</h3>
        </div>
        {sources.length === 0 ? (
          <div className="p-8 text-center text-xs text-neutral-400">
            No source distribution records found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 text-neutral-600 font-semibold border-b border-neutral-200">
                <tr>
                  <th className="py-2.5 px-3">Inquiry Source</th>
                  <th className="py-2.5 px-3">Total Leads</th>
                  <th className="py-2.5 px-3">Converted</th>
                  <th className="py-2.5 px-3">Channel Rate %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {sources.map((s, idx) => {
                  const total = s.count ?? s.totalLeads ?? 0;
                  const conv = s.convertedCount ?? 0;
                  const rate = s.conversionRatePercentage ?? 0;

                  return (
                    <tr key={idx} className="hover:bg-neutral-50/60">
                      <td className="py-2.5 px-3 font-semibold text-neutral-900">
                        {s.source}
                      </td>
                      <td className="py-2.5 px-3 text-neutral-800">{total}</td>
                      <td className="py-2.5 px-3 font-bold text-emerald-600">{conv}</td>
                      <td className="py-2.5 px-3">
                        <Badge variant={rate > 0 ? 'success' : 'neutral'}>
                          {rate}%
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
