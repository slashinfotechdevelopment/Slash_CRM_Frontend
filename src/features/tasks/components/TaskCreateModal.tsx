import React from 'react';
import { FormModal } from '@/components/templates/FormModal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { TaskPriority, TaskTag } from '@/api/types/task.types';
import { UserItem } from '@/api/types/users.types';

export interface TaskCreateModalProps {
  isCreateModalOpen: boolean;
  onCloseCreate: () => void;
  formData: {
    title: string;
    description: string;
    priority: TaskPriority;
    category: string;
    startDate: string;
    startTime: string;
    dueDate: string;
    endTime: string;
    estimatedHours: string;
    assigneeId: string;
    selectedTags: string[];
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      title: string;
      description: string;
      priority: TaskPriority;
      category: string;
      startDate: string;
      startTime: string;
      dueDate: string;
      endTime: string;
      estimatedHours: string;
      assigneeId: string;
      selectedTags: string[];
    }>
  >;
  onCreateSubmit: (e: React.FormEvent) => void;
  users: UserItem[];
  tags: TaskTag[];
  isSubmitting: boolean;
  modalError: string | null;
}

export const TaskCreateModal: React.FC<TaskCreateModalProps> = ({
  isCreateModalOpen,
  onCloseCreate,
  formData,
  setFormData,
  onCreateSubmit,
  users,
  tags,
  isSubmitting,
  modalError,
}) => {
  return (
    <FormModal
      isOpen={isCreateModalOpen}
      onClose={onCloseCreate}
      title="Create New Deliverable"
      subtitle="Specify task details, timeline, priority, and assignees."
      onSubmit={onCreateSubmit}
      isSubmitting={isSubmitting}
      submitLabel="Create Task"
      errorMessage={modalError}
      maxWidth="lg"
    >
      <div className="space-y-4">
        <Input
          label="Task Title"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g. Implement user permission overrides"
        />

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Description <span className="text-rose-500">*</span>
          </label>
          <textarea
            required
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full text-sm rounded-lg border border-slate-300 p-2.5 focus:outline-hidden focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
            placeholder="Detailed description of deliverables..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Select
            label="Priority"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value as TaskPriority })}
            options={[
              { label: 'Low', value: 'LOW' },
              { label: 'Medium', value: 'MEDIUM' },
              { label: 'High', value: 'HIGH' },
              { label: 'Urgent', value: 'URGENT' },
            ]}
          />
          <Input
            label="Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="e.g. DEVELOPMENT"
          />
          <Input
            label="Estimated Hours"
            type="number"
            step="0.5"
            value={formData.estimatedHours}
            onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value })}
            placeholder="e.g. 8"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Start Date"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          />
          <Input
            label="Start Time (Optional)"
            type="time"
            value={formData.startTime}
            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Due Date"
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          />
          <Input
            label="Due Time (Optional)"
            type="time"
            value={formData.endTime}
            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
          />
        </div>

        <Select
          label="Assignee (Optional)"
          value={formData.assigneeId}
          onChange={(e) => setFormData({ ...formData, assigneeId: e.target.value })}
          options={[
            { label: 'Self (or unassigned)', value: '' },
            ...users.map((u) => ({
              label: `${u.name} (${u.userCode || u.email})`,
              value: u.id,
            })),
          ]}
        />

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Tags
          </label>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-2 bg-slate-50 border border-slate-200 rounded-lg">
            {tags.map((t) => {
              const isSelected = formData.selectedTags.includes(t.name);
              return (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => {
                    if (isSelected) {
                      setFormData({
                        ...formData,
                        selectedTags: formData.selectedTags.filter((x) => x !== t.name),
                      });
                    } else {
                      setFormData({
                        ...formData,
                        selectedTags: [...formData.selectedTags, t.name],
                      });
                    }
                  }}
                  className={`text-xs px-2.5 py-1 rounded-full font-medium transition-all ${
                    isSelected
                      ? 'bg-brand-primary text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-400'
                  }`}
                >
                  {t.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </FormModal>
  );
};
