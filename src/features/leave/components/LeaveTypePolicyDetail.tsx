import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LeaveType } from '@/api/types/leave.types';

interface LeaveTypePolicyDetailProps {
  selectedType: LeaveType | null;
  isTypeActive: (t: LeaveType | null | undefined) => boolean;
  onOpenEdit: () => void;
  onOpenNewVersion: () => void;
}

export const LeaveTypePolicyDetail: React.FC<LeaveTypePolicyDetailProps> = ({
  selectedType,
  isTypeActive,
  onOpenEdit,
  onOpenNewVersion,
}) => {
  if (!selectedType) {
    return (
      <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center text-neutral-500">
        Select a leave type from the left to inspect policy versions.
      </div>
    );
  }

  const activePolicy =
    selectedType.currentPolicy ||
    selectedType.policies?.find((p) => !p.effectiveTo) ||
    selectedType.policies?.[0];
  const allPolicies =
    selectedType.policies ||
    selectedType.policyVersions ||
    (activePolicy ? [activePolicy] : []);

  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 space-y-6">
      {/* Type Metadata Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-neutral-900">{selectedType.name}</h2>
            <span className="font-mono text-xs bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded font-semibold">
              {selectedType.code}
            </span>
            <Badge variant={isTypeActive(selectedType) ? 'success' : 'danger'}>
              {isTypeActive(selectedType) ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            {selectedType.description || 'No description configured for this leave category.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenEdit}
            className="text-xs"
          >
            Edit Metadata
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenNewVersion}
            className="text-xs"
          >
            New Policy Version
          </Button>
        </div>
      </div>

      {/* Active Policy Rules Preview */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-3">
          Current Policy Terms (Version {activePolicy?.version ?? activePolicy?.versionNumber ?? 1})
        </h3>
        {activePolicy ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-neutral-50 p-4 rounded-xl border border-neutral-200 text-xs">
            <div>
              <span className="text-neutral-500 block">Annual Allocation</span>
              <span className="font-bold text-neutral-900 text-sm">
                {Number(activePolicy.annualAllocation)} days
              </span>
            </div>
            <div>
              <span className="text-neutral-500 block">Accrual Frequency</span>
              <span className="font-semibold text-neutral-800">
                {activePolicy.accrualFrequency}
              </span>
            </div>
            <div>
              <span className="text-neutral-500 block">Carry-Forward Limit</span>
              <span className="font-semibold text-neutral-800">
                {Number(activePolicy.carryForwardLimit)} days max
              </span>
            </div>
            <div>
              <span className="text-neutral-500 block">Half-Day Allowed</span>
              <span className="font-semibold text-neutral-800">
                {activePolicy.allowHalfDay ? 'Yes' : 'No'}
              </span>
            </div>
            <div>
              <span className="text-neutral-500 block">Notice Period</span>
              <span className="font-semibold text-neutral-800">
                {activePolicy.minNoticeDays} days
              </span>
            </div>
            <div>
              <span className="text-neutral-500 block">Exclude Holidays</span>
              <span className="font-semibold text-neutral-800">
                {activePolicy.excludeHolidays ? 'Yes' : 'No'}
              </span>
            </div>
            <div>
              <span className="text-neutral-500 block">Exclude Weekly-Offs</span>
              <span className="font-semibold text-neutral-800">
                {activePolicy.excludeWeeklyOffs ? 'Yes' : 'No'}
              </span>
            </div>
            <div>
              <span className="text-neutral-500 block">Effective From</span>
              <span className="font-mono text-neutral-800 font-semibold">
                {(activePolicy.effectiveFrom || '').split('T')[0]}
              </span>
            </div>
          </div>
        ) : (
          <p className="text-xs text-neutral-500">No active policy version found.</p>
        )}
      </div>

      {/* Version History Table */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-3">
          Policy Version Revision Ledger
        </h3>
        <div className="overflow-x-auto border border-neutral-200 rounded-lg">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 text-neutral-600 font-semibold border-b border-neutral-200">
              <tr>
                <th className="py-2.5 px-3">Ver #</th>
                <th className="py-2.5 px-3">Annual Days</th>
                <th className="py-2.5 px-3">Accrual</th>
                <th className="py-2.5 px-3">Carry Forward</th>
                <th className="py-2.5 px-3">Effective Window</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {allPolicies.filter(Boolean).map((v) => (
                <tr key={v.id} className="hover:bg-neutral-50/60">
                  <td className="py-2.5 px-3 font-bold text-neutral-900">v{v.version ?? v.versionNumber ?? 1}</td>
                  <td className="py-2.5 px-3 font-semibold text-neutral-800">{Number(v.annualAllocation)} d</td>
                  <td className="py-2.5 px-3 text-neutral-600">{v.accrualFrequency}</td>
                  <td className="py-2.5 px-3 text-neutral-600">{Number(v.carryForwardLimit)} d</td>
                  <td className="py-2.5 px-3 font-mono text-neutral-700">
                    {(v.effectiveFrom || '').split('T')[0]} {v.effectiveTo ? `→ ${(v.effectiveTo || '').split('T')[0]}` : '→ Present'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
