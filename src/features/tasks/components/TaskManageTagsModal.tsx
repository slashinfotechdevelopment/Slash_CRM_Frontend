import React from 'react';
import { FormModal } from '@/components/templates/FormModal';
import { Input } from '@/components/ui/Input';
import { TaskTag } from '@/api/types/task.types';
import { useConfirm } from '@/hooks/useConfirm';
import { useToast } from '@/hooks/useToast';
import { tasksConnector } from '@/connectors/tasks.connector';
import { Trash2 } from 'lucide-react';

interface TaskManageTagsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tags: TaskTag[];
  onTagsUpdated: () => void;
  isSubmitting: boolean;
  setIsSubmitting: (v: boolean) => void;
  newTagName: string;
  setNewTagName: (v: string) => void;
  newTagColor: string;
  setNewTagColor: (v: string) => void;
}

export const TaskManageTagsModal: React.FC<TaskManageTagsModalProps> = ({
  isOpen,
  onClose,
  tags,
  onTagsUpdated,
  isSubmitting,
  setIsSubmitting,
  newTagName,
  setNewTagName,
  newTagColor,
  setNewTagColor,
}) => {
  const confirm = useConfirm();
  const toast = useToast();

  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;
    setIsSubmitting(true);
    try {
      await tasksConnector.createTag({
        name: newTagName.trim(),
        color: newTagColor,
      });
      toast.success('Tag created');
      setNewTagName('');
      onTagsUpdated();
    } catch (err) {
      toast.danger(err.message || 'Failed to create tag');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTag = async (tag: TaskTag) => {
    const res = await confirm({
      tone: 'danger',
      title: `Delete Tag "${tag.name}"?`,
      message: 'Are you sure you want to delete this taxonomy tag? It will be removed from all associated tasks.',
      confirmLabel: 'Delete Tag',
      cancelLabel: 'Keep Tag',
    });
    if (res.confirmed) {
      try {
        await tasksConnector.deleteTag(tag.id);
        toast.success(`Tag "${tag.name}" deleted successfully.`);
        onTagsUpdated();
      } catch (err) {
        toast.danger(err.message || 'Failed to delete tag.');
      }
    }
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Manage Taxonomy Tags"
      subtitle="Create and organize tags to label and categorize tasks."
      onSubmit={handleCreateTag}
      isSubmitting={isSubmitting}
      submitLabel="Add Tag"
      maxWidth="md"
    >
      <div className="space-y-4">
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <Input
              label="New Tag Name"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder="e.g. backend, frontend, qa"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Color
            </label>
            <input
              type="color"
              value={newTagColor}
              onChange={(e) => setNewTagColor(e.target.value)}
              className="w-10 h-10 p-1 rounded-lg border border-slate-300 cursor-pointer"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-slate-200">
          <span className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Existing Tags ({tags.length})
          </span>
          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2 bg-slate-50 border border-slate-200 rounded-lg">
            {tags.length === 0 ? (
              <span className="text-xs text-slate-400 italic">No tags created yet.</span>
            ) : (
              tags.map((tag) => (
                <div
                  key={tag.id}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-slate-200 bg-white shadow-2xs group"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: tag.color || 'var(--color-info)' }}
                  />
                  <span className="truncate max-w-[120px]">{tag.name}</span>
                  <button
                    type="button"
                    onClick={() => handleDeleteTag(tag)}
                    className="text-slate-400 hover:text-rose-600 transition-colors ml-1 p-0.5 rounded hover:bg-rose-50"
                    title={`Delete tag ${tag.name}`}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </FormModal>
  );
};
