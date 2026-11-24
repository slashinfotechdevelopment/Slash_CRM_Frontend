import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { LeaveRequest, LeaveRequestStatus } from '@/api/types/leave.types';

interface MyLeaveHistoryTableProps {
  requests: LeaveRequest[];
  total: number;
  loading: boolean;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  onViewDetail: (req: LeaveRequest) => void;
  onOpenCancel: (req: LeaveRequest) => void;
}

export const MyLeaveHistoryTable: React.FC<MyLeaveHistoryTableProps> = ({
  requests,
  total,
  loading,
  statusFilter,
  onStatusFilterChange,
  onViewDetail,
  onOpenCancel,
}) => {
  const getStatusBadge = (status: LeaveRequestStatus) => {
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
      <div className="p-4 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-neutral-900 text-base">My Leave History</h2>
          <span className="text-xs text-neutral-500 bg-neutral-100 rounded-full px-2 py-0.5">
            {total} requests
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="text-xs w-44"
            options={[
              { label: 'All Statuses', value: 'ALL' },
              { label: 'Pending Approval', value: 'PENDING' },
              { label: 'Approved', value: 'APPROVED' },
              { label: 'Rejected', value: 'REJECTED' },
              { label: 'Cancellation Requested', value: 'CANCELLATION_PENDING' },
              { label: 'Cancelled', value: 'CANCELLED' },
            ]}
          />
        </div>
      </div>

      {loading ? (
        <div className="p-8 space-y-4">
          {[1, 2, 3].map((i) => (
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
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="font-medium text-neutral-700">No leave requests found</p>
          <p className="text-xs text-neutral-600 mt-1">
            {statusFilter === 'ALL'
              ? "You haven't submitted any leave applications yet."
              : `No leave applications with status "${statusFilter}".`}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 text-neutral-600 font-semibold border-b border-neutral-200">
              <tr>
                <th className="py-3 px-4">Leave Type</th>
                <th className="py-3 px-4">Date Range</th>
                <th className="py-3 px-4">Days</th>
                <th className="py-3 px-4">Reason</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Submitted</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {requests.map((req) => {
                const sDate = (req.startDate || '').split('T')[0];
                const eDate = (req.endDate || '').split('T')[0];
                const duration = Number(req.totalDays ?? req.daysRequested ?? 0);
                return (
                  <tr key={req.id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="py-3 px-4 font-medium text-neutral-900">
                      {req.leaveType?.name || 'Leave'}
                    </td>
                    <td className="py-3 px-4 text-neutral-700 font-mono text-xs">
                      {sDate}
                      {sDate !== eDate && eDate && ` → ${eDate}`}
                      {req.isHalfDay && (
                        <span className="ml-1.5 text-[10px] bg-blue-50 text-blue-700 font-sans px-1.5 py-0.5 rounded border border-blue-200">
                          {req.halfDayPeriod === 'FIRST_HALF' ? '1st Half' : '2nd Half'}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-semibold text-neutral-900">
                      {duration} d
                    </td>
                    <td className="py-3 px-4 text-neutral-600 max-w-xs truncate" title={req.reason}>
                      {req.reason}
                    </td>
                    <td className="py-3 px-4">{getStatusBadge(req.status)}</td>
                    <td className="py-3 px-4 text-xs text-neutral-500">
                      {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : '-'}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewDetail(req)}
                        className="text-xs"
                      >
                        Details
                      </Button>
                      {(req.status === 'PENDING' || req.status === 'APPROVED') && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => onOpenCancel(req)}
                          className="text-xs"
                        >
                          Cancel
                        </Button>
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
