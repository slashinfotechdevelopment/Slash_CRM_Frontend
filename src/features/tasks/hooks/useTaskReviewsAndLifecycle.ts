import { useState } from 'react';
import { NavigateFunction } from 'react-router-dom';
import { useToast } from '@/hooks/useToast';
import { useConfirm } from '@/hooks/useConfirm';
import { tasksConnector } from '@/connectors/tasks.connector';
import { TaskItem } from '@/api/types/task.types';
import { getErrorMessage } from '@/api/client/errorMapper';

export function useTaskReviewsAndLifecycle(
  task: TaskItem | null,
  fetchTaskData: () => Promise<void>,
  navigate: NavigateFunction,
  toast: ReturnType<typeof useToast>,
  confirm: ReturnType<typeof useConfirm>,
  setIsSubmitting: (v: boolean) => void,
  setModalError: (v: string | null) => void
) {
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRequestChangesModalOpen, setIsRequestChangesModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isReopenModalOpen, setIsReopenModalOpen] = useState(false);

  const [submissionNotes, setSubmissionNotes] = useState('');
  const [approvalRating, setApprovalRating] = useState(5);
  const [approvalFeedback, setApprovalFeedback] = useState('');
  const [changesFeedback, setChangesFeedback] = useState('');
  const [rejectFeedback, setRejectFeedback] = useState('');
  const [reasonText, setReasonText] = useState('');

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task) return;
    setIsSubmitting(true);
    setModalError(null);
    try {
      await tasksConnector.submitTask(task.id, submissionNotes.trim() ? { notes: submissionNotes.trim() } : {});
      toast.success('Submitted for review');
      setIsSubmitModalOpen(false);
      fetchTaskData();
    } catch (err) {
      setModalError(getErrorMessage(err, 'Failed to submit review.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApproveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task) return;
    setIsSubmitting(true);
    setModalError(null);
    try {
      await tasksConnector.approveTask(task.id, { rating: approvalRating, feedback: approvalFeedback.trim() });
      toast.success('Deliverables approved! Task marked complete.');
      setIsApproveModalOpen(false);
      fetchTaskData();
    } catch (err) {
      setModalError(getErrorMessage(err, 'Failed to approve review.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task || !changesFeedback.trim()) {
      setModalError('Changes feedback is required.');
      return;
    }
    setIsSubmitting(true);
    setModalError(null);
    try {
      await tasksConnector.requestChanges(task.id, { feedback: changesFeedback.trim() });
      toast.success('Changes requested');
      setIsRequestChangesModalOpen(false);
      fetchTaskData();
    } catch (err) {
      setModalError(getErrorMessage(err, 'Failed to request changes.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task || !rejectFeedback.trim()) {
      setModalError('Rejection reason is required.');
      return;
    }
    setIsSubmitting(true);
    setModalError(null);
    try {
      await tasksConnector.rejectTask(task.id, { feedback: rejectFeedback.trim(), reopenTask: true });
      toast.success('Review rejected');
      setIsRejectModalOpen(false);
      fetchTaskData();
    } catch (err) {
      setModalError(getErrorMessage(err, 'Failed to reject review.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task || !reasonText.trim()) {
      setModalError('Cancellation reason is required.');
      return;
    }
    setIsSubmitting(true);
    setModalError(null);
    try {
      await tasksConnector.cancelTask(task.id, reasonText.trim());
      toast.success('Task cancelled');
      setIsCancelModalOpen(false);
      fetchTaskData();
    } catch (err) {
      setModalError(getErrorMessage(err, 'Failed to cancel task.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReopenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task || !reasonText.trim()) {
      setModalError('Reopen justification is required.');
      return;
    }
    setIsSubmitting(true);
    setModalError(null);
    try {
      await tasksConnector.reopenTask(task.id, reasonText.trim());
      toast.success('Task reopened');
      setIsReopenModalOpen(false);
      fetchTaskData();
    } catch (err) {
      setModalError(getErrorMessage(err, 'Failed to reopen task.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!task) return;
    const res = await confirm({
      tone: 'danger',
      title: `Delete Task ${task.taskCode}?`,
      message: `Are you sure you want to delete "${task.title}"?`,
      confirmLabel: 'Delete Task',
      cancelLabel: 'Keep Task',
    });
    if (res.confirmed) {
      try {
        await tasksConnector.deleteTask(task.id);
        toast.success('Task deleted successfully');
        navigate('/tasks');
      } catch (err) {
        toast.danger(getErrorMessage(err, 'Failed to delete task'));
      }
    }
  };

  return {
    isSubmitModalOpen,
    setIsSubmitModalOpen,
    isApproveModalOpen,
    setIsApproveModalOpen,
    isRequestChangesModalOpen,
    setIsRequestChangesModalOpen,
    isRejectModalOpen,
    setIsRejectModalOpen,
    isCancelModalOpen,
    setIsCancelModalOpen,
    isReopenModalOpen,
    setIsReopenModalOpen,
    submissionNotes,
    setSubmissionNotes,
    approvalRating,
    setApprovalRating,
    approvalFeedback,
    setApprovalFeedback,
    changesFeedback,
    setChangesFeedback,
    rejectFeedback,
    setRejectFeedback,
    reasonText,
    setReasonText,
    handleSubmitReview,
    handleApproveReview,
    handleRequestChanges,
    handleRejectReview,
    handleCancelSubmit,
    handleReopenSubmit,
    handleDeleteTask,
  };
}
