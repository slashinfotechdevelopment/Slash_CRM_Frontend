import React from 'react';
import { FormModal } from '@/components/templates/FormModal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import {
  TaskItem,
  TaskPriority,
  TaskStatus,
  TaskPauseReason,
} from '@/api/types/task.types';
import { UserItem } from '@/api/types/users.types';
import { Star } from 'lucide-react';

const PAUSE_REASONS: { label: string; value: TaskPauseReason }[] = [
  { label: 'Tea Break', value: 'TEA_BREAK' },
  { label: 'Lunch', value: 'LUNCH' },
  { label: 'Personal Work', value: 'PERSONAL_WORK' },
  { label: 'Meeting', value: 'MEETING' },
  { label: 'Waiting on Input / Blocker', value: 'WAITING' },
  { label: 'Technical Issue', value: 'TECHNICAL_ISSUE' },
  { label: 'Other', value: 'OTHER' },
];

export interface TaskDetailModalsProps {
  task: TaskItem | null;
  users: UserItem[];
  isSubmitting: boolean;
  modalError: string | null;

  // Edit
  isEditModalOpen: boolean;
  onCloseEdit: () => void;
  editData: {
    title: string;
    description: string;
    priority: TaskPriority;
    status: TaskStatus;
    progress: number;
  };
  setEditData: React.Dispatch<
    React.SetStateAction<{
      title: string;
      description: string;
      priority: TaskPriority;
      status: TaskStatus;
      progress: number;
    }>
  >;
  onEditSubmit: (e: React.FormEvent) => void;

  // Assign
  isAssignModalOpen: boolean;
  onCloseAssign: () => void;
  assigneeId: string;
  setAssigneeId: (v: string) => void;
  assignReason: string;
  setAssignReason: (v: string) => void;
  onAssignSubmit: (e: React.FormEvent) => void;

  // Review
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

  // Cancel & Reopen
  isCancelModalOpen: boolean;
  onCloseCancel: () => void;
  isReopenModalOpen: boolean;
  onCloseReopen: () => void;
  reasonText: string;
  setReasonText: (v: string) => void;
  onCancelSubmit: (e: React.FormEvent) => void;
  onReopenSubmit: (e: React.FormEvent) => void;

  // Timer: Pause & Stop
  isPauseModalOpen: boolean;
  onClosePause: () => void;
  pauseReason: TaskPauseReason;
  setPauseReason: (v: TaskPauseReason) => void;
  customPauseDesc: string;
  setCustomPauseDesc: (v: string) => void;
  onPauseSubmit: (e: React.FormEvent) => void;

  isStopModalOpen: boolean;
  onCloseStop: () => void;
  stopComment: string;
  setStopComment: (v: string) => void;
  onStopSubmit: (e: React.FormEvent) => void;

  // Attachment Preview
  isPreviewModalOpen: boolean;
  onClosePreview: () => void;
  previewBlobUrl: string | null;
  previewFileName: string;
  previewMimeType: string;
}

export const TaskDetailModals: React.FC<TaskDetailModalsProps> = ({
  task,
  users,
  isSubmitting,
  modalError,
  isEditModalOpen,
  onCloseEdit,
  editData,
  setEditData,
  onEditSubmit,
  isAssignModalOpen,
  onCloseAssign,
  assigneeId,
  setAssigneeId,
  assignReason,
  setAssignReason,
  onAssignSubmit,
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
  isCancelModalOpen,
  onCloseCancel,
  isReopenModalOpen,
  onCloseReopen,
  reasonText,
  setReasonText,
  onCancelSubmit,
  onReopenSubmit,
  isPauseModalOpen,
  onClosePause,
  pauseReason,
  setPauseReason,
  customPauseDesc,
  setCustomPauseDesc,
  onPauseSubmit,
  isStopModalOpen,
  onCloseStop,
  stopComment,
  setStopComment,
  onStopSubmit,
  isPreviewModalOpen,
  onClosePreview,
  previewBlobUrl,
  previewFileName,
  previewMimeType,
}) => {
  return (
    <>
      {/* EDIT MODAL */}
      <FormModal
        isOpen={isEditModalOpen}
        onClose={onCloseEdit}
        title={`Edit ${task?.taskCode || ''}`}
        onSubmit={onEditSubmit}
        isSubmitting={isSubmitting}
        submitLabel="Save Changes"
        errorMessage={modalError}
        maxWidth="lg"
      >
        <div className="space-y-4">
          <Input
            label="Title"
            required
            value={editData.title}
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
          />
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={editData.description}
              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              className="w-full text-sm rounded-lg border border-slate-300 p-2.5"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Select
              label="Priority"
              value={editData.priority}
              onChange={(e) => setEditData({ ...editData, priority: e.target.value as TaskPriority })}
              options={[
                { label: 'Low', value: 'LOW' },
                { label: 'Medium', value: 'MEDIUM' },
                { label: 'High', value: 'HIGH' },
                { label: 'Urgent', value: 'URGENT' },
              ]}
            />
            <Select
              label="Status"
              value={editData.status}
              onChange={(e) => setEditData({ ...editData, status: e.target.value as TaskStatus })}
              options={[
                { label: 'To Do', value: 'TODO' },
                { label: 'In Progress', value: 'IN_PROGRESS' },
                { label: 'On Hold', value: 'ON_HOLD' },
                { label: 'In Review', value: 'IN_REVIEW' },
                { label: 'Reopened', value: 'REOPENED' },
                { label: 'Completed', value: 'COMPLETED' },
                { label: 'Cancelled', value: 'CANCELLED' },
              ]}
            />
            <Input
              label="Progress (%)"
              type="number"
              min="0"
              max="100"
              value={String(editData.progress)}
              onChange={(e) => setEditData({ ...editData, progress: parseInt(e.target.value, 10) || 0 })}
            />
          </div>
        </div>
      </FormModal>

      {/* REASSIGN MODAL */}
      <FormModal
        isOpen={isAssignModalOpen}
        onClose={onCloseAssign}
        title={`Reassign Task ${task?.taskCode || ''}`}
        onSubmit={onAssignSubmit}
        isSubmitting={isSubmitting}
        submitLabel="Reassign"
        errorMessage={modalError}
        maxWidth="md"
      >
        <div className="space-y-4">
          <Select
            label="Target Assignee"
            value={assigneeId}
            onChange={(e) => setAssigneeId(e.target.value)}
            options={[
              { label: 'Unassigned', value: '' },
              ...users.map((u) => ({
                label: `${u.name} (${u.userCode || u.email})`,
                value: u.id,
              })),
            ]}
          />
          <Input
            label="Handover Notes / Reason"
            value={assignReason}
            onChange={(e) => setAssignReason(e.target.value)}
          />
        </div>
      </FormModal>

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

      {/* CANCEL MODAL */}
      <FormModal
        isOpen={isCancelModalOpen}
        onClose={onCloseCancel}
        title="Cancel Task"
        onSubmit={onCancelSubmit}
        isSubmitting={isSubmitting}
        submitLabel="Cancel Task"
        submitVariant="danger"
        errorMessage={modalError}
        maxWidth="md"
      >
        <div className="space-y-4">
          <Input
            label="Cancellation Reason"
            required
            value={reasonText}
            onChange={(e) => setReasonText(e.target.value)}
            placeholder="Audit reason..."
          />
        </div>
      </FormModal>

      {/* REOPEN MODAL */}
      <FormModal
        isOpen={isReopenModalOpen}
        onClose={onCloseReopen}
        title="Reopen Task"
        onSubmit={onReopenSubmit}
        isSubmitting={isSubmitting}
        submitLabel="Reopen Task"
        errorMessage={modalError}
        maxWidth="md"
      >
        <div className="space-y-4">
          <Input
            label="Reopening Reason"
            required
            value={reasonText}
            onChange={(e) => setReasonText(e.target.value)}
            placeholder="Why is this being reopened?"
          />
        </div>
      </FormModal>

      {/* PAUSE MODAL */}
      <FormModal
        isOpen={isPauseModalOpen}
        onClose={onClosePause}
        title="Pause Timer"
        onSubmit={onPauseSubmit}
        isSubmitting={isSubmitting}
        submitLabel="Pause"
        errorMessage={modalError}
        maxWidth="md"
      >
        <div className="space-y-4">
          <Select
            label="Pause Reason"
            value={pauseReason}
            onChange={(e) => setPauseReason(e.target.value as TaskPauseReason)}
            options={PAUSE_REASONS}
          />
          {pauseReason === 'OTHER' && (
            <Input
              label="Description"
              required
              value={customPauseDesc}
              onChange={(e) => setCustomPauseDesc(e.target.value)}
            />
          )}
        </div>
      </FormModal>

      {/* STOP MODAL */}
      <FormModal
        isOpen={isStopModalOpen}
        onClose={onCloseStop}
        title="Stop Session"
        onSubmit={onStopSubmit}
        isSubmitting={isSubmitting}
        submitLabel="Stop"
        submitVariant="danger"
        errorMessage={modalError}
        maxWidth="md"
      >
        <div className="space-y-4">
          <Input
            label="Final Session Notes (Optional)"
            value={stopComment}
            onChange={(e) => setStopComment(e.target.value)}
          />
        </div>
      </FormModal>

      {/* ATTACHMENT PREVIEW MODAL */}
      {isPreviewModalOpen && previewBlobUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-scaleIn">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <span className="font-semibold text-sm truncate max-w-lg">{previewFileName}</span>
              <Button size="sm" variant="ghost" onClick={onClosePreview}>
                Close
              </Button>
            </div>
            <div className="flex-1 p-4 overflow-auto flex items-center justify-center bg-slate-100">
              {previewMimeType.startsWith('image/') ? (
                <img
                  src={previewBlobUrl}
                  alt={previewFileName}
                  className="max-w-full max-h-[70vh] rounded-lg shadow-sm"
                />
              ) : (
                <iframe
                  src={previewBlobUrl}
                  title={previewFileName}
                  className="w-full h-[70vh] rounded-lg border border-slate-300"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
