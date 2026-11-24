import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { LeaveBalance } from '@/api/types/leave.types';

interface MyLeaveBalancesCardsProps {
  balances: LeaveBalance[];
  loading: boolean;
}

export const MyLeaveBalancesCards: React.FC<MyLeaveBalancesCardsProps> = ({
  balances,
  loading,
}) => {
  return (
    <div>
      <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-500 mb-3">
        Annual Quotas & Available Balances
      </h2>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-white rounded-xl border border-neutral-200 animate-pulse" />
          ))}
        </div>
      ) : balances.length === 0 ? (
        <div className="bg-white rounded-xl border border-neutral-200 p-6 text-center text-neutral-500 text-sm">
          No leave balances assigned for the current calendar period.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {balances.map((b) => (
            <div
              key={b.id || b.leaveTypeId}
              className="bg-white rounded-xl border border-neutral-200 p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-neutral-800 text-sm">{b.leaveTypeName}</span>
                <Badge variant={b.availableDays > 0 ? 'success' : 'neutral'}>
                  {b.availableDays} d available
                </Badge>
              </div>
              <div className="text-2xl font-extrabold text-neutral-900 tracking-tight">
                {b.availableDays} <span className="text-xs font-normal text-neutral-500">days left</span>
              </div>
              <div className="mt-3 pt-3 border-t border-neutral-100 grid grid-cols-3 gap-1 text-xs text-neutral-500">
                <div>
                  <div className="text-[10px] text-neutral-600 font-medium uppercase">Allocated</div>
                  <div className="font-semibold text-neutral-800">{b.allocatedDays} d</div>
                </div>
                <div>
                  <div className="text-[10px] text-neutral-600 font-medium uppercase">Used</div>
                  <div className="font-semibold text-neutral-800">{b.usedDays} d</div>
                </div>
                <div>
                  <div className="text-[10px] text-neutral-600 font-medium uppercase">Pending</div>
                  <div className="font-semibold text-amber-600">{b.pendingDays} d</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
