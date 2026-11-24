import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { TaskComment } from '@/api/types/task.types';
import { Send, Edit2, Trash2, Check, X } from 'lucide-react';
import { formatDate } from '@/utils/formatters';

interface TaskCommentsTabProps {
  comments: TaskComment[];
  newComment: string;
  isInternalComment: boolean;
  onNewCommentChange: (val: string) => void;
  onIsInternalChange: (val: boolean) => void;
  onAddComment: (e: React.FormEvent) => void;
  onUpdateComment: (commentId: string, content: string) => Promise<void>;
  onDeleteComment: (commentId: string) => Promise<void>;
}

export const TaskCommentsTab: React.FC<TaskCommentsTabProps> = ({
  comments,
  newComment,
  isInternalComment,
  onNewCommentChange,
  onIsInternalChange,
  onAddComment,
  onUpdateComment,
  onDeleteComment,
}) => {
  const { user, isSuperAdmin, hasPermission } = useAuth();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const startEdit = (c: TaskComment) => {
    setEditingId(c.id);
    setEditContent(c.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent('');
  };

  const handleSaveEdit = async (commentId: string) => {
    if (!editContent.trim()) return;
    setIsUpdating(true);
    try {
      await onUpdateComment(commentId, editContent.trim());
      setEditingId(null);
      setEditContent('');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
      <h3 className="text-sm font-bold text-slate-900">Collaboration Thread</h3>

      <form onSubmit={onAddComment} className="space-y-3">
        <textarea
          required
          rows={3}
          value={newComment}
          onChange={(e) => onNewCommentChange(e.target.value)}
          className="w-full text-sm rounded-lg border border-slate-300 p-3 focus:outline-hidden focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
          placeholder="Add feedback, notes, or updates..."
        />
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={isInternalComment}
              onChange={(e) => onIsInternalChange(e.target.checked)}
              className="rounded border-slate-300 text-brand-primary focus:ring-brand-primary"
            />
            <span>Internal Comment (Hide from client accounts)</span>
          </label>
          <Button type="submit" size="sm" variant="primary" className="flex items-center gap-1.5">
            <Send className="w-3.5 h-3.5" /> Post Comment
          </Button>
        </div>
      </form>

      <div className="space-y-4 pt-4 border-t border-slate-100">
        {comments.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-400 italic">
            No comments yet. Start the conversation!
          </div>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800">{c.author?.name || 'Author'}</span>
                  {c.isInternal && <Badge variant="warning">Internal</Badge>}
                  {c.isEdited && <span className="text-[10px] text-slate-400 italic">(edited)</span>}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-400">{formatDate(c.createdAt)}</span>
                  <div className="flex items-center gap-1">
                    {(user?.id === c.authorId || user?.id === c.author?.id || isSuperAdmin) && (
                      <button
                        type="button"
                        onClick={() => startEdit(c)}
                        className="p-1 text-slate-400 hover:text-brand-primary rounded transition-colors"
                        title="Edit own comment"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {(user?.id === c.authorId || user?.id === c.author?.id || isSuperAdmin || hasPermission('tasks.update')) && (
                      <button
                        type="button"
                        onClick={() => onDeleteComment(c.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                        title="Delete comment"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {editingId === c.id ? (
                <div className="space-y-2 pt-1">
                  <textarea
                    rows={2}
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full text-xs p-2 rounded border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-brand-primary"
                  />
                  <div className="flex items-center gap-2 justify-end">
                    <Button size="sm" variant="ghost" onClick={cancelEdit} disabled={isUpdating}>
                      <X className="w-3.5 h-3.5 mr-1" /> Cancel
                    </Button>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleSaveEdit(c.id)}
                      disabled={isUpdating || !editContent.trim()}
                    >
                      <Check className="w-3.5 h-3.5 mr-1" /> Save
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-slate-700 whitespace-pre-wrap">{c.content}</div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
