import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { WeeklyOffPolicy } from '@/api/types/leave.types';

interface WeeklyOffPoliciesTableProps {
  weeklyOffs: WeeklyOffPolicy[];
  loading: boolean;
}

export const WeeklyOffPoliciesTable: React.FC<WeeklyOffPoliciesTableProps> = ({
  weeklyOffs,
  loading,
}) => {
  const getDayName = (d: number) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[d] || `Day ${d}`;
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
      {loading ? (
        <div className="p-8 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-neutral-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : weeklyOffs.length === 0 ? (
        <div className="p-12 text-center text-neutral-500">
          <p className="font-medium text-neutral-700">No weekly-off policies defined</p>
          <p className="text-xs text-neutral-400 mt-1">
            Configure standard weekend or alternate off schedules.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 text-neutral-600 font-semibold border-b border-neutral-200">
              <tr>
                <th className="py-3 px-4">Policy Name</th>
                <th className="py-3 px-4">Off Days</th>
                <th className="py-3 px-4">Pattern</th>
                <th className="py-3 px-4">Effective Window</th>
                <th className="py-3 px-4">Scope</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {weeklyOffs.map((pol) => (
                <tr key={pol.id} className="hover:bg-neutral-50/60 transition-colors">
                  <td className="py-3 px-4 font-semibold text-neutral-900">{pol.name}</td>
                  <td className="py-3 px-4 text-xs text-neutral-800">
                    {pol.daysOfWeek.map((d) => getDayName(d)).join(', ')}
                  </td>
                  <td className="py-3 px-4 text-xs font-mono text-neutral-600">{pol.pattern || 'ALL'}</td>
                  <td className="py-3 px-4 text-xs font-mono text-neutral-700">
                    {pol.effectiveFrom} {pol.effectiveTo ? `→ ${pol.effectiveTo}` : '→ Ongoing'}
                  </td>
                  <td className="py-3 px-4 text-xs text-neutral-600">{pol.scopeType}</td>
                  <td className="py-3 px-4">
                    <Badge variant={pol.status === 'ACTIVE' ? 'success' : 'neutral'}>
                      {pol.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
