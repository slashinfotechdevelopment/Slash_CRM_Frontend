import React from 'react';
import { FormModal } from '@/components/templates/FormModal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { TaskItem, TaskPriority, TaskStatus } from '@/api/types/task.types';

export interface TaskEditModalProps {
  isEditModalOpen: boolean;
  onCloseEdit: () => void;
  activeTask: TaskItem | null;
  editFormData: {
    title: string;
    description: string;
    priority: TaskPriority;
    status: TaskStatus;
    progress: number;
    dueDate: string;
    estimatedHours: string;
    statusComment: string;
  };
  setEditFormData: React.Dispatch<
    React.SetStateAction<{
      title: string;
      description: string;
      priority: TaskPriority;
      status: TaskStatus;
      progress: number;
      dueDate: string;
      estimatedHours: string;
      statusComment: string;
    }>
  >;
  onEditSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  modalError: string | null;
}

export const TaskEditModal: React.FC<TaskEditModalProps> = ({
  isEditModalOpen,
  onCloseEdit,
  activeTask,
  editFormData,
  setEditFormData,
  onEditSubmit,
  isSubmitting,
  modalError,
}) => {
  return (
    <FormModal
      isOpen={isEditModalOpen}
      onClose={onCloseEdit}
      title={`Edit Task ${activeTask?.taskCode || ''}`}
      subtitle="Update fields, status, and progress percentage."
      onSubmit={onEditSubmit}
      isSubmitting={isSubmitting}
      submitLabel="Update Task"
      errorMessage={modalError}
      maxWidth="lg"
    >
      <div className="space-y-4">
        <Input
          label="Task Title"
          required
          value={editFormData.title}
          onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
        />

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Description
          </label>
          <textarea
            rows={3}
            value={editFormData.description}
            onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
            className="w-full text-sm rounded-lg border border-slate-300 p-2.5 focus:outline-hidden focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Select
            label="Priority"
            value={editFormData.priority}
            onChange={(e) => setEditFormData({ ...editFormData, priority: e.target.value as TaskPriority })}
            options={[
              { label: 'Low', value: 'LOW' },
              { label: 'Medium', value: 'MEDIUM' },
              { label: 'High', value: 'HIGH' },
              { label: 'Urgent', value: 'URGENT' },
            ]}
          />
          <Select
            label="Status"
            value={editFormData.status}
            onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value as TaskStatus })}
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
            value={String(editFormData.progress)}
            onChange={(e) => setEditFormData({ ...editFormData, progress: parseInt(e.target.value, 10) || 0 })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Due Date"
            type="date"
            value={editFormData.dueDate}
            onChange={(e) => setEditFormData({ ...editFormData, dueDate: e.target.value })}
          />
          <Input
            label="Estimated Hours"
            type="number"
            step="0.5"
            value={editFormData.estimatedHours}
            onChange={(e) => setEditFormData({ ...editFormData, estimatedHours: e.target.value })}
          />
        </div>

        <Input
          label="Status Update Comment (Optional)"
          value={editFormData.statusComment}
          onChange={(e) => setEditFormData({ ...editFormData, statusComment: e.target.value })}
          placeholder="Reason for change..."
        />
      </div>
    </FormModal>
  );
};
