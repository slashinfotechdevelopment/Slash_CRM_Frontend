import { useState } from 'react';
import { useToast } from '@/hooks/useToast';
import { useConfirm } from '@/hooks/useConfirm';
import { tasksConnector } from '@/connectors/tasks.connector';
import {
  TaskItem,
  TaskComment,
  TaskAttachment,
  CreateTaskCommentPayload,
} from '@/api/types/task.types';
import { getErrorMessage } from '@/api/client/errorMapper';

export function useTaskCommentsAndAttachments(
  task: TaskItem | null,
  toast: ReturnType<typeof useToast>,
  confirm: ReturnType<typeof useConfirm>
) {
  const [comments, setComments] = useState<TaskComment[]>([]);
  const [attachments, setAttachments] = useState<TaskAttachment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isInternalComment, setIsInternalComment] = useState(false);
  const [previewBlobUrl, setPreviewBlobUrl] = useState<string | null>(null);
  const [previewFileName, setPreviewFileName] = useState('');
  const [previewMimeType, setPreviewMimeType] = useState('');
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

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
      toast.danger(getErrorMessage(err, 'Failed to add comment'));
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
      toast.danger(getErrorMessage(err, 'Failed to update comment'));
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
        toast.danger(getErrorMessage(err, 'Failed to delete comment'));
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
      toast.danger(getErrorMessage(err, 'Failed to upload attachment'));
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
      toast.danger(getErrorMessage(err, 'Download failed'));
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
      toast.danger(getErrorMessage(err, 'Cannot preview this file format'));
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
      toast.danger(getErrorMessage(err, 'Rescan failed'));
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
        toast.danger(getErrorMessage(err, 'Failed to delete attachment'));
      }
    }
  };

  const handleClosePreview = () => {
    if (previewBlobUrl) {
      window.URL.revokeObjectURL(previewBlobUrl);
      setPreviewBlobUrl(null);
    }
    setIsPreviewModalOpen(false);
  };

  return {
    comments,
    setComments,
    attachments,
    setAttachments,
    newComment,
    setNewComment,
    isInternalComment,
    setIsInternalComment,
    previewBlobUrl,
    previewFileName,
    previewMimeType,
    isPreviewModalOpen,
    setIsPreviewModalOpen,
    handleAddComment,
    handleUpdateComment,
    handleDeleteComment,
    handleFileUpload,
    handleDownload,
    handlePreview,
    handleRescan,
    handleDeleteAttachment,
    handleClosePreview,
  };
}
