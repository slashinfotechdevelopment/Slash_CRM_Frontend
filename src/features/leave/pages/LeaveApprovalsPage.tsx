import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { leaveConnector } from '@/connectors/leave.connector';
import { LeaveRequest, LeaveApprovalDecision, LeaveRequestStatus } from '@/api/types/leave.types';
import { LeaveApprovalsTable } from '../components/LeaveApprovalsTable';
import { ReviewLeaveModal } from '../components/ReviewLeaveModal';

export const LeaveApprovalsPage: React.FC = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'PENDING' | 'CANCELLATION' | 'HISTORY'>('PENDING');
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [reviewDecision, setReviewDecision] = useState<LeaveApprovalDecision>('APPROVED');
  const [reviewComments, setReviewComments] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  const loadRequests = useCallback(async () => {
    setLoading(true);
    try {
      let statusParam: LeaveRequestStatus | undefined = undefined;
      if (activeTab === 'PENDING') statusParam = 'PENDING';
      if (activeTab === 'CANCELLATION') statusParam = 'CANCELLATION_PENDING';

      const res = await leaveConnector.getLeaveRequests({
        status: statusParam,
        limit: 50,
      });
      setRequests(res.items);
      setTotal(res.total);
    } catch (err) {
      console.error('Failed to load leave approval requests:', err);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const handleOpenReview = (req: LeaveRequest, decision: LeaveApprovalDecision) => {
    setSelectedRequest(req);
    setReviewDecision(decision);
    setReviewComments('');
    setReviewError(null);
  };

  const handleSubmitReview = async () => {
    if (!selectedRequest) return;

    if (selectedRequest.userId === user?.id) {
      setReviewError('Self-Approval Prohibited: You cannot approve or review your own leave application.');
      return;
    }

    setReviewError(null);
    setIsSubmittingReview(true);
    try {
      if (selectedRequest.status === 'CANCELLATION_PENDING') {
        await leaveConnector.reviewCancellationRequest(selectedRequest.id, {
          decision: reviewDecision,
          comments: reviewComments.trim() || undefined,
        });
      } else {
        await leaveConnector.reviewLeaveRequest(selectedRequest.id, {
          decision: reviewDecision,
          comments: reviewComments.trim() || undefined,
        });
      }
      setSelectedRequest(null);
      await loadRequests();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to submit review decision.';
      setReviewError(msg);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Leave Approvals & Workflow</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Review employee absence applications, manage leave cancellations, and audit leave governance.
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-neutral-200 flex gap-4 text-sm">
        <button
          onClick={() => setActiveTab('PENDING')}
          className={`pb-3 font-medium transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'PENDING'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <span>Pending Leave Requests</span>
          {activeTab === 'PENDING' && (
            <span className="bg-primary-50 text-primary-700 text-xs px-2 py-0.5 rounded-full font-semibold">
              {total}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('CANCELLATION')}
          className={`pb-3 font-medium transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'CANCELLATION'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <span>Cancellation Requests</span>
          {activeTab === 'CANCELLATION' && (
            <span className="bg-amber-50 text-amber-700 text-xs px-2 py-0.5 rounded-full font-semibold">
              {total}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('HISTORY')}
          className={`pb-3 font-medium transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'HISTORY'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <span>All Leave History</span>
        </button>
      </div>

      <LeaveApprovalsTable
        requests={requests}
        loading={loading}
        currentUserId={user?.id}
        onOpenReview={handleOpenReview}
      />

      <ReviewLeaveModal
        selectedRequest={selectedRequest}
        onClose={() => setSelectedRequest(null)}
        reviewDecision={reviewDecision}
        onDecisionChange={setReviewDecision}
        reviewComments={reviewComments}
        onCommentsChange={setReviewComments}
        isSubmitting={isSubmittingReview}
        errorMessage={reviewError}
        onSubmit={handleSubmitReview}
      />
    </div>
  );
};
