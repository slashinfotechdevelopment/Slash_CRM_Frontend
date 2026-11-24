import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { LeaveType } from '@/api/types/leave.types';

interface LeaveTypesListProps {
  types: LeaveType[];
  loading: boolean;
  selectedType: LeaveType | null;
  onSelectType: (t: LeaveType) => void;
  isTypeActive: (t: LeaveType | null | undefined) => boolean;
}

export const LeaveTypesList: React.FC<LeaveTypesListProps> = ({
  types,
  loading,
  selectedType,
  onSelectType,
  isTypeActive,
}) => {
  return (
    <div className="lg:col-span-1 space-y-3">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
        Defined Leave Types ({types.length})
      </h2>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-white rounded-xl border border-neutral-200 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {types.map((t) => {
            const isSelected = selectedType?.id === t.id;
            return (
              <div
                key={t.id}
                onClick={() => onSelectType(t)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white border-primary-500 shadow-sm ring-1 ring-primary-500'
                    : 'bg-white border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-neutral-900 text-sm">{t.name}</span>
                  <div className="flex items-center gap-1.5">
                    <Badge variant={t.isPaid ? 'success' : 'neutral'}>
                      {t.isPaid ? 'Paid' : 'Unpaid'}
                    </Badge>
                    <Badge variant={isTypeActive(t) ? 'success' : 'danger'}>
                      {isTypeActive(t) ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-neutral-500">
                  <span className="font-mono text-[11px] bg-neutral-100 px-1.5 py-0.5 rounded">
                    {t.code}
                  </span>
                  <span>
                    {(t.currentPolicy?.annualAllocation ?? t.policies?.[0]?.annualAllocation) ?? 0} days/yr
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
