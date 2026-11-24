import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LeaveRequest } from '@/api/types/leave.types';

interface LeaveApprovalsTableProps {
  requests: LeaveRequest[];
  loading: boolean;
  currentUserId?: string;
  onOpenReview: (req: LeaveRequest, decision: 'APPROVED' | 'REJECTED') => void;
}

export const LeaveApprovalsTable: React.FC<LeaveApprovalsTableProps> = ({
  requests,
  loading,
  currentUserId,
  onOpenReview,
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <Badge variant="success">Approved</Badge>;
      case 'PENDING':
        return <Badge variant="warning">Pending Approval</Badge>;
      case 'REJECTED':
        return <Badge variant="danger">Rejected</Badge>;
      case 'CANCELLED':
        return <Badge variant="neutral">Cancelled</Badge>;
      case 'CANCELLATION_PENDING':
        return <Badge variant="info">Cancellation Requested</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
      {loading ? (
        <div className="p-8 space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 bg-neutral-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : requests.length === 0 ? (
        <div className="p-12 text-center text-neutral-500">
          <svg
            className="w-12 h-12 mx-auto text-neutral-300 mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="font-medium text-neutral-700">No requests in this queue</p>
          <p className="text-xs text-neutral-400 mt-1">All leave applications have been reviewed.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 text-neutral-600 font-semibold border-b border-neutral-200">
              <tr>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Leave Type</th>
                <th className="py-3 px-4">Date Window</th>
                <th className="py-3 px-4">Days</th>
                <th className="py-3 px-4">Reason</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {requests.map((req) => {
                const isSelf = req.userId === currentUserId;
                const canReview =
                  (req.status === 'PENDING' || req.status === 'CANCELLATION_PENDING') && !isSelf;

                return (
                  <tr key={req.id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-medium text-neutral-900">{req.user?.name || 'Employee'}</div>
                      <div className="text-xs text-neutral-500">
                        {req.user?.email}
                        {isSelf && (
                          <span className="ml-1.5 text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-semibold">
                            You
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-neutral-800">
                      {req.leaveType?.name || 'Leave'}
                    </td>
                    <td className="py-3 px-4 text-xs font-mono text-neutral-700">
                      {(req.startDate || '').split('T')[0]}
                      {(req.startDate || '').split('T')[0] !== (req.endDate || '').split('T')[0] &&
                        Boolean(req.endDate) &&
                        ` → ${(req.endDate || '').split('T')[0]}`}
                      {req.isHalfDay && (
                        <span className="ml-1.5 text-[10px] bg-blue-50 text-blue-700 font-sans px-1.5 py-0.5 rounded border border-blue-200">
                          {req.halfDayPeriod === 'FIRST_HALF' ? '1st Half' : '2nd Half'}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-bold text-neutral-900">
                      {(() => {
                        const count = Number(req.totalDays ?? (req as unknown as { daysRequested?: number }).daysRequested ?? 1);
                        return `${count} ${count === 1 ? 'day' : 'days'}`;
                      })()}
                    </td>
                    <td className="py-3 px-4 text-xs text-neutral-600 max-w-xs truncate" title={req.reason}>
                      {req.status === 'CANCELLATION_PENDING' && req.cancellationReason ? (
                        <span className="text-amber-700 font-medium">
                          Cancellation: {req.cancellationReason}
                        </span>
                      ) : (
                        req.reason
                      )}
                    </td>
                    <td className="py-3 px-4">{getStatusBadge(req.status)}</td>
                    <td className="py-3 px-4 text-right space-x-2">
                      {canReview ? (
                        <>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => onOpenReview(req, 'APPROVED')}
                            className="text-xs"
                          >
                            Approve
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => onOpenReview(req, 'REJECTED')}
                            className="text-xs"
                          >
                            Reject
                          </Button>
                        </>
                      ) : isSelf && (req.status === 'PENDING' || req.status === 'CANCELLATION_PENDING') ? (
                        <span
                          className="text-xs text-neutral-400 italic bg-neutral-100 px-2 py-1 rounded"
                          title="Anti-Self-Approval rule: You cannot approve your own request"
                        >
                          Self-action disabled
                        </span>
                      ) : (
                        <span className="text-xs text-neutral-400">Completed</span>
                      )}
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
