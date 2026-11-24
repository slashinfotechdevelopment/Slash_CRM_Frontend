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
  TaskAuditHistory,
  TaskPriority,
  TaskStatus,
  UpdateTaskPayload,
  AssignTaskPayload,
} from '@/api/types/task.types';
import { UserItem } from '@/api/types/users.types';
import { getErrorMessage } from '@/api/client/errorMapper';
import { TaskDetailModalsProps } from '../components/TaskDetailModals';
import { useTaskCommentsAndAttachments } from './useTaskCommentsAndAttachments';
import { useTaskReviewsAndLifecycle } from './useTaskReviewsAndLifecycle';
import { useTaskTimerActions } from './useTaskTimerActions';

export function useTaskDetail(id: string | undefined, navigate: NavigateFunction) {
  const confirm = useConfirm();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState<'overview' | 'time' | 'comments' | 'attachments' | 'history'>('overview');
  const [task, setTask] = useState<TaskItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [timeEntries, setTimeEntries] = useState<TaskTimeEntry[]>([]);
  const [timeSummary, setTimeSummary] = useState<TaskTimeSummary | null>(null);
  const [auditHistory, setAuditHistory] = useState<TaskAuditHistory | null>(null);
  const [reviews, setReviews] = useState<TaskReview[]>([]);
  const [users, setUsers] = useState<UserItem[]>([]);

  // Modals & form state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
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

  const commentsAttach = useTaskCommentsAndAttachments(task, toast, confirm);

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
      if (commsRes.status === 'fulfilled') commentsAttach.setComments(commsRes.value.items || []);
      if (attachRes.status === 'fulfilled') commentsAttach.setAttachments(attachRes.value);
      if (auditRes.status === 'fulfilled') setAuditHistory(auditRes.value);
      if (reviewsRes.status === 'fulfilled') setReviews(reviewsRes.value || []);
      if (usersRes.status === 'fulfilled') setUsers(usersRes.value.items || []);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to load task details'));
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const reviewsLifecycle = useTaskReviewsAndLifecycle(
    task,
    fetchTaskData,
    navigate,
    toast,
    confirm,
    setIsSubmitting,
    setModalError
  );

  const timerActions = useTaskTimerActions(
    task,
    fetchTaskData,
    setIsSubmitting,
    setModalError,
    toast
  );

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
      setModalError(getErrorMessage(err, 'Failed to update task.'));
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
      setModalError(getErrorMessage(err, 'Failed to assign task.'));
    } finally {
      setIsSubmitting(false);
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
    isSubmitModalOpen: reviewsLifecycle.isSubmitModalOpen,
    onCloseSubmit: () => reviewsLifecycle.setIsSubmitModalOpen(false),
    submissionNotes: reviewsLifecycle.submissionNotes,
    setSubmissionNotes: reviewsLifecycle.setSubmissionNotes,
    onSubmitReview: reviewsLifecycle.handleSubmitReview,
    isApproveModalOpen: reviewsLifecycle.isApproveModalOpen,
    onCloseApprove: () => reviewsLifecycle.setIsApproveModalOpen(false),
    approvalRating: reviewsLifecycle.approvalRating,
    setApprovalRating: reviewsLifecycle.setApprovalRating,
    approvalFeedback: reviewsLifecycle.approvalFeedback,
    setApprovalFeedback: reviewsLifecycle.setApprovalFeedback,
    onApproveReview: reviewsLifecycle.handleApproveReview,
    isRequestChangesModalOpen: reviewsLifecycle.isRequestChangesModalOpen,
    onCloseRequestChanges: () => reviewsLifecycle.setIsRequestChangesModalOpen(false),
    changesFeedback: reviewsLifecycle.changesFeedback,
    setChangesFeedback: reviewsLifecycle.setChangesFeedback,
    onRequestChanges: reviewsLifecycle.handleRequestChanges,
    isRejectModalOpen: reviewsLifecycle.isRejectModalOpen,
    onCloseReject: () => reviewsLifecycle.setIsRejectModalOpen(false),
    rejectFeedback: reviewsLifecycle.rejectFeedback,
    setRejectFeedback: reviewsLifecycle.setRejectFeedback,
    onRejectReview: reviewsLifecycle.handleRejectReview,
    isCancelModalOpen: reviewsLifecycle.isCancelModalOpen,
    onCloseCancel: () => reviewsLifecycle.setIsCancelModalOpen(false),
    isReopenModalOpen: reviewsLifecycle.isReopenModalOpen,
    onCloseReopen: () => reviewsLifecycle.setIsReopenModalOpen(false),
    reasonText: reviewsLifecycle.reasonText,
    setReasonText: reviewsLifecycle.setReasonText,
    onCancelSubmit: reviewsLifecycle.handleCancelSubmit,
    onReopenSubmit: reviewsLifecycle.handleReopenSubmit,
    isPauseModalOpen: timerActions.isPauseModalOpen,
    onClosePause: () => timerActions.setIsPauseModalOpen(false),
    pauseReason: timerActions.pauseReason,
    setPauseReason: timerActions.setPauseReason,
    customPauseDesc: timerActions.customPauseDesc,
    setCustomPauseDesc: timerActions.setCustomPauseDesc,
    onPauseSubmit: timerActions.handlePauseSubmit,
    isStopModalOpen: timerActions.isStopModalOpen,
    onCloseStop: () => timerActions.setIsStopModalOpen(false),
    stopComment: timerActions.stopComment,
    setStopComment: timerActions.setStopComment,
    onStopSubmit: timerActions.handleStopSubmit,
    isPreviewModalOpen: commentsAttach.isPreviewModalOpen,
    onClosePreview: commentsAttach.handleClosePreview,
    previewBlobUrl: commentsAttach.previewBlobUrl,
    previewFileName: commentsAttach.previewFileName,
    previewMimeType: commentsAttach.previewMimeType,
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
    comments: commentsAttach.comments,
    attachments: commentsAttach.attachments,
    auditHistory,
    reviews,
    users,
    newComment: commentsAttach.newComment,
    setNewComment: commentsAttach.setNewComment,
    isInternalComment: commentsAttach.isInternalComment,
    setIsInternalComment: commentsAttach.setIsInternalComment,
    setIsSubmitModalOpen: reviewsLifecycle.setIsSubmitModalOpen,
    setIsApproveModalOpen: reviewsLifecycle.setIsApproveModalOpen,
    setIsRequestChangesModalOpen: reviewsLifecycle.setIsRequestChangesModalOpen,
    setIsRejectModalOpen: reviewsLifecycle.setIsRejectModalOpen,
    setIsCancelModalOpen: reviewsLifecycle.setIsCancelModalOpen,
    setIsReopenModalOpen: reviewsLifecycle.setIsReopenModalOpen,
    setIsPauseModalOpen: timerActions.setIsPauseModalOpen,
    setIsStopModalOpen: timerActions.setIsStopModalOpen,
    handleOpenEdit,
    handleOpenAssign,
    handleDeleteTask: reviewsLifecycle.handleDeleteTask,
    handleAddComment: commentsAttach.handleAddComment,
    handleUpdateComment: commentsAttach.handleUpdateComment,
    handleDeleteComment: commentsAttach.handleDeleteComment,
    handleFileUpload: commentsAttach.handleFileUpload,
    handleDownload: commentsAttach.handleDownload,
    handlePreview: commentsAttach.handlePreview,
    handleRescan: commentsAttach.handleRescan,
    handleDeleteAttachment: commentsAttach.handleDeleteAttachment,
    modalsProps,
  };
}
