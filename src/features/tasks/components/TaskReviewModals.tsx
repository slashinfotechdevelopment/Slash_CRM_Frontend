import React from 'react';
import { FormModal } from '@/components/templates/FormModal';
import { Star } from 'lucide-react';

export interface TaskReviewModalsProps {
  isSubmitting: boolean;
  modalError: string | null;

  isSubmitModalOpen: boolean;
  onCloseSubmit: () => void;
  submissionNotes: string;
  setSubmissionNotes: (v: string) => void;
  onSubmitReview: (e: React.FormEvent) => void;

  isApproveModalOpen: boolean;
  onCloseApprove: () => void;
  approvalRating: number;
  setApprovalRating: (v: number) => void;
  approvalFeedback: string;
  setApprovalFeedback: (v: string) => void;
  onApproveReview: (e: React.FormEvent) => void;

  isRequestChangesModalOpen: boolean;
  onCloseRequestChanges: () => void;
  changesFeedback: string;
  setChangesFeedback: (v: string) => void;
  onRequestChanges: (e: React.FormEvent) => void;

  isRejectModalOpen: boolean;
  onCloseReject: () => void;
  rejectFeedback: string;
  setRejectFeedback: (v: string) => void;
  onRejectReview: (e: React.FormEvent) => void;
}

export const TaskReviewModals: React.FC<TaskReviewModalsProps> = ({
  isSubmitting,
  modalError,
  isSubmitModalOpen,
  onCloseSubmit,
  submissionNotes,
  setSubmissionNotes,
  onSubmitReview,
  isApproveModalOpen,
  onCloseApprove,
  approvalRating,
  setApprovalRating,
  approvalFeedback,
  setApprovalFeedback,
  onApproveReview,
  isRequestChangesModalOpen,
  onCloseRequestChanges,
  changesFeedback,
  setChangesFeedback,
  onRequestChanges,
  isRejectModalOpen,
  onCloseReject,
  rejectFeedback,
  setRejectFeedback,
  onRejectReview,
}) => {
  return (
    <>
      {/* SUBMIT FOR REVIEW MODAL */}
      <FormModal
        isOpen={isSubmitModalOpen}
        onClose={onCloseSubmit}
        title="Submit Deliverables for Review"
        subtitle="Submit work for supervisor evaluation. Advances status to IN_REVIEW."
        onSubmit={onSubmitReview}
        isSubmitting={isSubmitting}
        submitLabel="Submit Review"
        errorMessage={modalError}
        maxWidth="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Submission Notes / Deliverable Summary
            </label>
            <textarea
              rows={4}
              value={submissionNotes}
              onChange={(e) => setSubmissionNotes(e.target.value)}
              className="w-full text-sm rounded-lg border border-slate-300 p-2.5"
              placeholder="Describe what was accomplished..."
            />
          </div>
        </div>
      </FormModal>

      {/* APPROVE REVIEW MODAL */}
      <FormModal
        isOpen={isApproveModalOpen}
        onClose={onCloseApprove}
        title="Approve Review & Complete Task"
        subtitle="Mark task completed and provide rating feedback."
        onSubmit={onApproveReview}
        isSubmitting={isSubmitting}
        submitLabel="Approve & Complete"
        errorMessage={modalError}
        maxWidth="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Performance Rating (1 - 5)
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setApprovalRating(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= approvalRating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Approval Feedback
            </label>
            <textarea
              rows={3}
              value={approvalFeedback}
              onChange={(e) => setApprovalFeedback(e.target.value)}
              className="w-full text-sm rounded-lg border border-slate-300 p-2.5"
              placeholder="Excellent work, verified against specifications."
            />
          </div>
        </div>
      </FormModal>

      {/* REQUEST CHANGES MODAL */}
      <FormModal
        isOpen={isRequestChangesModalOpen}
        onClose={onCloseRequestChanges}
        title="Request Changes on Deliverables"
        subtitle="Reopens the task with required revisions."
        onSubmit={onRequestChanges}
        isSubmitting={isSubmitting}
        submitLabel="Request Changes"
        submitVariant="accent"
        errorMessage={modalError}
        maxWidth="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Required Changes <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={changesFeedback}
              onChange={(e) => setChangesFeedback(e.target.value)}
              className="w-full text-sm rounded-lg border border-slate-300 p-2.5"
              placeholder="What needs to be updated before approval?"
            />
          </div>
        </div>
      </FormModal>

      {/* REJECT REVIEW MODAL */}
      <FormModal
        isOpen={isRejectModalOpen}
        onClose={onCloseReject}
        title="Reject Deliverables"
        subtitle="Rejects the review round and reopens task for rework."
        onSubmit={onRejectReview}
        isSubmitting={isSubmitting}
        submitLabel="Reject Deliverable"
        submitVariant="danger"
        errorMessage={modalError}
        maxWidth="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Rejection Reason <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={rejectFeedback}
              onChange={(e) => setRejectFeedback(e.target.value)}
              className="w-full text-sm rounded-lg border border-slate-300 p-2.5"
              placeholder="Explain why the deliverable failed verification..."
            />
          </div>
        </div>
      </FormModal>
    </>
  );
};
