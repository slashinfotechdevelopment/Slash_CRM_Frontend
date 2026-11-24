import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { TaskReview, TaskAuditHistory } from '@/api/types/task.types';
import { Star } from 'lucide-react';
import { formatDate } from '@/utils/formatters';

interface TaskHistoryTabProps {
  reviews: TaskReview[];
  auditHistory: TaskAuditHistory | null;
}

export const TaskHistoryTab: React.FC<TaskHistoryTabProps> = ({ reviews, auditHistory }) => {
  return (
    <div className="space-y-6">
      {reviews.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Review Cycles & Approvals</h3>
          <div className="space-y-3">
            {reviews.map((r) => (
              <div key={r.id} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">Round {r.roundNumber}</span>
                    <Badge
                      variant={
                        r.outcome === 'APPROVED' ? 'success' : r.outcome === 'REJECTED' ? 'danger' : 'warning'
                      }
                    >
                      {r.outcome}
                    </Badge>
                  </div>
                  <span className="text-slate-400">{formatDate(r.submittedAt)}</span>
                </div>
                {r.feedback && <div className="text-xs text-slate-700 italic">"{r.feedback}"</div>}
                {r.rating && (
                  <div className="flex items-center gap-1 text-amber-500 text-xs">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {auditHistory && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Activity Log & Status Transitions</h3>
          <div className="space-y-2">
            {auditHistory.activityLogs?.map((log) => (
              <div
                key={log.id}
                className="text-xs flex items-center justify-between p-2 rounded hover:bg-slate-50 border-b border-slate-100"
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-800">{log.action}</span>
                  <span className="text-slate-500">by {log.actor?.name || 'System'}</span>
                </div>
                <span className="text-slate-400">{formatDate(log.createdAt)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
