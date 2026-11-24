import React from 'react';
import { OverdueTasksReportData, ReviewSummaryReportData } from '@/api/types/task.types';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/utils/formatters';

export interface OverdueTaskRow {
  id: string;
  taskCode: string;
  title: string;
  assignee?: { name?: string; userCode?: string };
  assigneeName?: string;
  userCode?: string;
  currentStatus?: string;
  status?: string;
  dueDate: string;
  daysOverdue?: number;
  priority: string;
}

export interface ReviewerRow {
  reviewerId?: string;
  reviewerName?: string;
  name?: string;
  userCode?: string;
  count?: number;
  pendingCount?: number;
}

interface OverdueTabProps {
  overdueReport: OverdueTasksReportData | null;
}

export const TaskReportOverdueTab: React.FC<OverdueTabProps> = ({ overdueReport }) => {
  const overdueReportObj = overdueReport as unknown as {
    data?: OverdueTaskRow[];
    tasks?: OverdueTaskRow[];
  };
  const overdueList: OverdueTaskRow[] = Array.isArray(overdueReport)
    ? (overdueReport as unknown as OverdueTaskRow[])
    : overdueReportObj?.data ?? overdueReportObj?.tasks ?? [];

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
      <div className="p-4 border-b border-slate-200 flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900">Active Overdue Deliverables</h3>
        <span className="text-xs text-rose-600 font-semibold bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-full">
          {overdueList.length} Overdue Tasks
        </span>
      </div>

      {overdueList.length === 0 ? (
        <div className="p-8 text-center text-xs text-slate-400 italic">
          No overdue tasks! All deliverables are within schedule.
        </div>
      ) : (
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
            <tr>
              <th className="p-3">Task Deliverable</th>
              <th className="p-3">Assignee</th>
              <th className="p-3">Due Date</th>
              <th className="p-3">Breach Duration</th>
              <th className="p-3">Priority</th>
              <th className="p-3">Workflow Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {overdueList.map((t: OverdueTaskRow) => {
              const assignee = t.assignee?.name || t.assigneeName || 'Unassigned';
              const assigneeCode = t.assignee?.userCode || t.userCode || '';
              const status = t.currentStatus || t.status || 'OVERDUE';
              return (
                <tr key={t.id} className="hover:bg-slate-50/50">
                  <td className="p-3">
                    <span className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded font-semibold text-slate-600 mr-2">{t.taskCode}</span>
                    <span className="font-medium text-slate-900">{t.title}</span>
                  </td>
                  <td className="p-3 text-slate-700">
                    {assignee} {assigneeCode && <span className="font-mono text-xs text-slate-400">({assigneeCode})</span>}
                  </td>
                  <td className="p-3 text-rose-600 font-semibold">{formatDate(t.dueDate)}</td>
                  <td className="p-3">
                    <Badge variant="danger">{t.daysOverdue} days late</Badge>
                  </td>
                  <td className="p-3"><Badge variant={t.priority === 'URGENT' ? 'danger' : 'warning'}>{t.priority}</Badge></td>
                  <td className="p-3"><Badge variant="neutral">{status}</Badge></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

interface ReviewsTabProps {
  reviewsReport: ReviewSummaryReportData | null;
}

export const TaskReportReviewsTab: React.FC<ReviewsTabProps> = ({ reviewsReport }) => {
  if (!reviewsReport) return null;

  const totalRev = reviewsReport.totalReviews ?? reviewsReport.summary?.totalReviews ?? 0;
  const approved = reviewsReport.approvedCount ?? reviewsReport.summary?.approvedCount ?? 0;
  const changes = reviewsReport.changesRequestedCount ?? reviewsReport.summary?.changesRequestedCount ?? 0;
  const turnaround = reviewsReport.reviewTurnaroundHours ?? reviewsReport.summary?.averageTurnaroundHours ?? 0;
  const reviewersList: ReviewerRow[] = reviewsReport.reviewerPendingCounts ?? reviewsReport.pendingByReviewer ?? [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Total Reviews</div>
          <div className="text-3xl font-bold text-slate-900 mt-1">{totalRev}</div>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Approved</div>
          <div className="text-3xl font-bold text-emerald-600 mt-1">{approved}</div>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Changes Requested</div>
          <div className="text-3xl font-bold text-amber-600 mt-1">{changes}</div>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Avg Turnaround</div>
          <div className="text-3xl font-bold text-brand-primary mt-1">{turnaround} hrs</div>
        </div>
      </div>

      {/* Pending Reviews Roster */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200">
          <h3 className="text-sm font-bold text-slate-900">Pending Reviews by Manager</h3>
        </div>
        {reviewersList.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 italic">
            No pending reviews across managers.
          </div>
        ) : (
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="p-3">Reviewer</th>
                <th className="p-3">Pending Reviews Count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reviewersList.map((rev: ReviewerRow, idx: number) => {
                const rName = rev.reviewerName || rev.name || 'Manager';
                const rCode = rev.userCode || '';
                const rCount = rev.count ?? rev.pendingCount ?? 0;
                return (
                  <tr key={rev.reviewerId || `rev-${idx}`} className="hover:bg-slate-50/50">
                    <td className="p-3 font-semibold text-slate-800">
                      {rName} {rCode && <span className="font-mono text-slate-400 font-normal">({rCode})</span>}
                    </td>
                    <td className="p-3 font-bold text-amber-600">{rCount} pending</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
