import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { LeaveTransaction } from '@/api/types/leave.types';

interface AuditTransactionLedgerTableProps {
  transactions: LeaveTransaction[];
  loading: boolean;
}

export const AuditTransactionLedgerTable: React.FC<AuditTransactionLedgerTableProps> = ({
  transactions,
  loading,
}) => {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
      {loading ? (
        <div className="p-8 space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 bg-neutral-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <div className="p-12 text-center text-neutral-500">
          <p className="font-medium text-neutral-700">No transaction records in ledger</p>
          <p className="text-xs text-neutral-400 mt-1">
            Audit transactions will record here whenever leaves are applied, approved, or adjusted.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 text-neutral-600 font-semibold border-b border-neutral-200">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Event</th>
                <th className="py-3 px-4">Delta</th>
                <th className="py-3 px-4">Closing Available</th>
                <th className="py-3 px-4">Reason / Notes</th>
                <th className="py-3 px-4">Recorded By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-neutral-50/60 transition-colors">
                  <td className="py-3 px-4 text-xs text-neutral-500 font-mono">
                    {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : '-'}
                  </td>
                  <td className="py-3 px-4 font-medium text-neutral-900">
                    {tx.user?.name || tx.userId}
                  </td>
                  <td className="py-3 px-4 text-xs font-semibold text-neutral-700">
                    {tx.leaveType?.name || 'Leave'}
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      variant={
                        tx.transactionType === 'APPROVAL'
                          ? 'success'
                          : tx.transactionType === 'REJECTION'
                          ? 'danger'
                          : tx.transactionType === 'MANUAL_ADJUSTMENT'
                          ? 'accent'
                          : 'neutral'
                      }
                    >
                      {tx.transactionType}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-neutral-800">
                    {tx.deltaAdjusted !== 0
                      ? `Adj: ${tx.deltaAdjusted > 0 ? '+' : ''}${tx.deltaAdjusted}`
                      : tx.deltaUsed !== 0
                      ? `Used: ${tx.deltaUsed > 0 ? '+' : ''}${tx.deltaUsed}`
                      : tx.deltaPending !== 0
                      ? `Pending: ${tx.deltaPending > 0 ? '+' : ''}${tx.deltaPending}`
                      : `Alloc: ${tx.deltaAllocated}`}
                  </td>
                  <td className="py-3 px-4 font-bold text-neutral-900">
                    {tx.closingAvailable} d
                  </td>
                  <td className="py-3 px-4 text-xs text-neutral-600 max-w-xs truncate" title={tx.reason || ''}>
                    {tx.reason || '-'}
                  </td>
                  <td className="py-3 px-4 text-xs text-neutral-500">
                    {tx.performedBy?.name || 'System / Admin'}
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
