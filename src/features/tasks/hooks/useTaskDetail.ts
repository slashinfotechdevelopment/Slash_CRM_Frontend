import { useState, useEffect, useCallback } from 'react';
import { NavigateFunction } from 'react-router-dom';
import { useConfirm } from '@/hooks/useConfirm';
import { useToast } from '@/hooks/useToast';
import { tasksConnector } from '@/connectors/tasks.connector';
import { usersConnector } from '@/connectors/users.connector';
import {
  TaskItem,
  TaskTimeEntry,
  TaskTimeSummary,
  TaskReview,
  TaskComment,
  TaskAttachment,
  TaskAuditHistory,
  TaskPriority,
  TaskStatus,
  TaskPauseReason,
  UpdateTaskPayload,
  AssignTaskPayload,
  CreateTaskCommentPayload,
} from '@/api/types/task.types';
import { UserItem } from '@/api/types/users.types';
import { TaskDetailModalsProps } from '../components/TaskDetailModals';

export function useTaskDetail(id: string | undefined, navigate: NavigateFunction) {
  const confirm = useConfirm();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState<'overview' | 'time' | 'comments' | 'attachments' | 'history'>('overview');
  const [task, setTask] = useState<TaskItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [timeEntries, setTimeEntries] = useState<TaskTimeEntry[]>([]);
  const [timeSummary, setTimeSummary] = useState<TaskTimeSummary | null>(null);
  const [comments, setComments] = useState<TaskComment[]>([]);
  const [attachments, setAttachments] = useState<TaskAttachment[]>([]);
  const [auditHistory, setAuditHistory] = useState<TaskAuditHistory | null>(null);
  const [reviews, setReviews] = useState<TaskReview[]>([]);
  const [users, setUsers] = useState<UserItem[]>([]);

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRequestChangesModalOpen, setIsRequestChangesModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isPauseModalOpen, setIsPauseModalOpen] = useState(false);
  const [isStopModalOpen, setIsStopModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isReopenModalOpen, setIsReopenModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  // Form states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const [editData, setEditData] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM' as TaskPriority,
    status: 'TODO' as TaskStatus,
    progress: 0,
  });
  const [assigneeId, setAssigneeId] = useState('');
  const [assignReason, setAssignReason] = useState('');
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [approvalRating, setApprovalRating] = useState(5);
  const [approvalFeedback, setApprovalFeedback] = useState('');
  const [changesFeedback, setChangesFeedback] = useState('');
  const [rejectFeedback, setRejectFeedback] = useState('');
  const [reasonText, setReasonText] = useState('');
  const [pauseReason, setPauseReason] = useState<TaskPauseReason>('TEA_BREAK');
  const [customPauseDesc, setCustomPauseDesc] = useState('');
  const [stopComment, setStopComment] = useState('');
  const [newComment, setNewComment] = useState('');
  const [isInternalComment, setIsInternalComment] = useState(false);
  const [previewBlobUrl, setPreviewBlobUrl] = useState<string | null>(null);
  const [previewFileName, setPreviewFileName] = useState('');
  const [previewMimeType, setPreviewMimeType] = useState('');

  const fetchTaskData = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await tasksConnector.getTaskById(id);
      setTask(data);
      const [entriesRes, summaryRes, commsRes, attachRes, auditRes, reviewsRes, usersRes] = await Promise.allSettled([
        tasksConnector.getTimeEntries(id),
        tasksConnector.getTaskTimeSummary(id),
        tasksConnector.listComments(id),
        tasksConnector.listAttachments(id),
        tasksConnector.getAuditHistory(id),
        tasksConnector.listReviews(id),
        usersConnector.getUsers({ page: 1, limit: 100 }),
      ]);
      if (entriesRes.status === 'fulfilled') setTimeEntries(entriesRes.value.items || []);
      if (summaryRes.status === 'fulfilled') setTimeSummary(summaryRes.value);
      if (commsRes.status === 'fulfilled') setComments(commsRes.value.items || []);
      if (attachRes.status === 'fulfilled') setAttachments(attachRes.value);
      if (auditRes.status === 'fulfilled') setAuditHistory(auditRes.value);
      if (reviewsRes.status === 'fulfilled') setReviews(reviewsRes.value || []);
      if (usersRes.status === 'fulfilled') setUsers(usersRes.value.items || []);
    } catch (err) {
      setError(err.message || 'Failed to load task details');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTaskData();
  }, [fetchTaskData]);

  const handleOpenEdit = () => {
    if (!task) return;
    setEditData({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      status: task.status,
      progress: task.progress || 0,
    });
    setModalError(null);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task) return;
    setIsSubmitting(true);
    setModalError(null);
    try {
      const payload: UpdateTaskPayload = {
        title: editData.title.trim(),
        description: editData.description.trim(),
        priority: editData.priority,
        status: editData.status,
        progress: editData.progress,
      };
      await tasksConnector.updateTask(task.id, payload);
      toast.success('Task updated successfully');
      setIsEditModalOpen(false);
      fetchTaskData();
    } catch (err) {
      setModalError(err.message || 'Failed to update task.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenAssign = () => {
    if (!task) return;
    setAssigneeId(task.assigneeId || '');
    setAssignReason('');
    setModalError(null);
    setIsAssignModalOpen(true);
  };

  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task) return;
    setIsSubmitting(true);
    setModalError(null);
    try {
      const payload: AssignTaskPayload = {
        assigneeId: assigneeId || null,
        reason: assignReason.trim() || undefined,
      };
      await tasksConnector.assignTask(task.id, payload);
      toast.success('Task assigned successfully');
      setIsAssignModalOpen(false);
      fetchTaskData();
    } catch (err) {
      setModalError(err.message || 'Failed to assign task.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
      setModalError(err.message || 'Failed to submit review.');
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
      setModalError(err.message || 'Failed to approve review.');
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
      setModalError(err.message || 'Failed to request changes.');
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
      setModalError(err.message || 'Failed to reject review.');
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
      setModalError(err.message || 'Failed to cancel task.');
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
      setModalError(err.message || 'Failed to reopen task.');
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
        toast.danger(err.message || 'Failed to delete task');
      }
    }
  };

  const handlePauseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task) return;
    setIsSubmitting(true);
    setModalError(null);
    try {
      await tasksConnector.pauseTimer(task.id, {
        reason: pauseReason,
        customDescription: pauseReason === 'OTHER' ? customPauseDesc : undefined,
      });
      toast.success('Timer paused');
      setIsPauseModalOpen(false);
      fetchTaskData();
    } catch (err) {
      setModalError(err.message || 'Failed to pause timer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStopSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task) return;
    setIsSubmitting(true);
    setModalError(null);
    try {
      await tasksConnector.stopTimer(task.id, { finalComment: stopComment || undefined });
      toast.success('Timer stopped');
      setIsStopModalOpen(false);
      fetchTaskData();
    } catch (err) {
      setModalError(err.message || 'Failed to stop timer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task || !newComment.trim()) return;
    try {
      const payload: CreateTaskCommentPayload = {
        content: newComment.trim(),
        isInternal: isInternalComment,
      };
      await tasksConnector.addComment(task.id, payload);
      setNewComment('');
      toast.success('Comment added');
      const res = await tasksConnector.listComments(task.id);
      setComments(res.items || []);
    } catch (err) {
      toast.danger(err.message || 'Failed to add comment');
    }
  };

  const handleUpdateComment = async (commentId: string, content: string) => {
    if (!task) return;
    try {
      await tasksConnector.updateComment(task.id, commentId, { content });
      toast.success('Comment updated');
      const res = await tasksConnector.listComments(task.id);
      setComments(res.items || []);
    } catch (err) {
      toast.danger(err.message || 'Failed to update comment');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!task) return;
    const res = await confirm({
      tone: 'danger',
      title: 'Delete Comment?',
      message: 'Are you sure you want to remove this comment?',
      confirmLabel: 'Delete Comment',
      cancelLabel: 'Keep Comment',
    });
    if (res.confirmed) {
      try {
        await tasksConnector.deleteComment(task.id, commentId);
        toast.success('Comment deleted');
        const updated = await tasksConnector.listComments(task.id);
        setComments(updated.items || []);
      } catch (err) {
        toast.danger(err.message || 'Failed to delete comment');
      }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!task || !file) return;
    try {
      await tasksConnector.uploadAttachment(task.id, file);
      toast.success(`Uploaded ${file.name}`);
      const updated = await tasksConnector.listAttachments(task.id);
      setAttachments(updated);
    } catch (err) {
      toast.danger(err.message || 'Failed to upload attachment');
    } finally {
      e.target.value = '';
    }
  };

  const handleDownload = async (att: TaskAttachment) => {
    if (!task) return;
    try {
      const blob = await tasksConnector.downloadAttachment(task.id, att.id);
      const url = window.URL.createObjectURL(blob);
      const link = document.body.appendChild(document.createElement('a'));
      link.href = url;
      link.download = att.originalName;
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.danger(err.message || 'Download failed');
    }
  };

  const handlePreview = async (att: TaskAttachment) => {
    if (!task) return;
    try {
      const blob = await tasksConnector.previewAttachment(task.id, att.id);
      const url = window.URL.createObjectURL(blob);
      setPreviewBlobUrl(url);
      setPreviewFileName(att.originalName);
      setPreviewMimeType(att.mimeType);
      setIsPreviewModalOpen(true);
    } catch (err) {
      toast.danger(err.message || 'Cannot preview this file format');
    }
  };

  const handleRescan = async (att: TaskAttachment) => {
    if (!task) return;
    try {
      await tasksConnector.rescanAttachment(task.id, att.id);
      toast.success('Malware rescan completed');
      const updated = await tasksConnector.listAttachments(task.id);
      setAttachments(updated);
    } catch (err) {
      toast.danger(err.message || 'Rescan failed');
    }
  };

  const handleDeleteAttachment = async (att: TaskAttachment) => {
    if (!task) return;
    const res = await confirm({
      tone: 'danger',
      title: 'Delete Attachment?',
      message: `Delete file "${att.originalName}"?`,
      confirmLabel: 'Delete File',
      cancelLabel: 'Keep File',
    });
    if (res.confirmed) {
      try {
        await tasksConnector.deleteAttachment(task.id, att.id);
        toast.success('Attachment deleted');
        const updated = await tasksConnector.listAttachments(task.id);
        setAttachments(updated);
      } catch (err) {
        toast.danger(err.message || 'Failed to delete attachment');
      }
    }
  };

  const modalsProps: TaskDetailModalsProps = {
    task,
    users,
    isSubmitting,
    modalError,
    isEditModalOpen,
    onCloseEdit: () => setIsEditModalOpen(false),
    editData,
    setEditData,
    onEditSubmit: handleEditSubmit,
    isAssignModalOpen,
    onCloseAssign: () => setIsAssignModalOpen(false),
    assigneeId,
    setAssigneeId,
    assignReason,
    setAssignReason,
    onAssignSubmit: handleAssignSubmit,
    isSubmitModalOpen,
    onCloseSubmit: () => setIsSubmitModalOpen(false),
    submissionNotes,
    setSubmissionNotes,
    onSubmitReview: handleSubmitReview,
    isApproveModalOpen,
    onCloseApprove: () => setIsApproveModalOpen(false),
    approvalRating,
    setApprovalRating,
    approvalFeedback,
    setApprovalFeedback,
    onApproveReview: handleApproveReview,
    isRequestChangesModalOpen,
    onCloseRequestChanges: () => setIsRequestChangesModalOpen(false),
    changesFeedback,
    setChangesFeedback,
    onRequestChanges: handleRequestChanges,
    isRejectModalOpen,
    onCloseReject: () => setIsRejectModalOpen(false),
    rejectFeedback,
    setRejectFeedback,
    onRejectReview: handleRejectReview,
    isCancelModalOpen,
    onCloseCancel: () => setIsCancelModalOpen(false),
    isReopenModalOpen,
    onCloseReopen: () => setIsReopenModalOpen(false),
    reasonText,
    setReasonText,
    onCancelSubmit: handleCancelSubmit,
    onReopenSubmit: handleReopenSubmit,
    isPauseModalOpen,
    onClosePause: () => setIsPauseModalOpen(false),
    pauseReason,
    setPauseReason,
    customPauseDesc,
    setCustomPauseDesc,
    onPauseSubmit: handlePauseSubmit,
    isStopModalOpen,
    onCloseStop: () => setIsStopModalOpen(false),
    stopComment,
    setStopComment,
    onStopSubmit: handleStopSubmit,
    isPreviewModalOpen,
    onClosePreview: () => setIsPreviewModalOpen(false),
    previewBlobUrl,
    previewFileName,
    previewMimeType,
  };

  return {
    task,
    isLoading,
    error,
    fetchTaskData,
    activeTab,
    setActiveTab,
    timeEntries,
    timeSummary,
    comments,
    attachments,
    auditHistory,
    reviews,
    users,
    newComment,
    setNewComment,
    isInternalComment,
    setIsInternalComment,
    setIsSubmitModalOpen,
    setIsApproveModalOpen,
    setIsRequestChangesModalOpen,
    setIsRejectModalOpen,
    setIsCancelModalOpen,
    setIsReopenModalOpen,
    setIsPauseModalOpen,
    setIsStopModalOpen,
    handleOpenEdit,
    handleOpenAssign,
    handleDeleteTask,
    handleAddComment,
    handleUpdateComment,
    handleDeleteComment,
    handleFileUpload,
    handleDownload,
    handlePreview,
    handleRescan,
    handleDeleteAttachment,
    modalsProps,
  };
}
