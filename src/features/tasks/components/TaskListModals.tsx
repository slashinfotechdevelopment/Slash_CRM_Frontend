import React from 'react';
import { FormModal } from '@/components/templates/FormModal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import {
  TaskItem,
  TaskPriority,
  TaskStatus,
  TaskTag,
} from '@/api/types/task.types';
import { UserItem } from '@/api/types/users.types';

export interface TaskListModalsProps {
  // Create Modal
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

  // Edit Modal
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

  // Assign Modal
  isAssignModalOpen: boolean;
  onCloseAssign: () => void;
  assigneeId: string;
  setAssigneeId: (v: string) => void;
  assignReason: string;
  setAssignReason: (v: string) => void;
  onAssignSubmit: (e: React.FormEvent) => void;

  // Cancel & Reopen Modals
  isCancelModalOpen: boolean;
  onCloseCancel: () => void;
  isReopenModalOpen: boolean;
  onCloseReopen: () => void;
  reasonText: string;
  setReasonText: (v: string) => void;
  onCancelSubmit: (e: React.FormEvent) => void;
  onReopenSubmit: (e: React.FormEvent) => void;

  // Shared metadata
  users: UserItem[];
  tags: TaskTag[];
  isSubmitting: boolean;
  modalError: string | null;
}

export const TaskListModals: React.FC<TaskListModalsProps> = ({
  isCreateModalOpen,
  onCloseCreate,
  formData,
  setFormData,
  onCreateSubmit,
  isEditModalOpen,
  onCloseEdit,
  activeTask,
  editFormData,
  setEditFormData,
  onEditSubmit,
  isAssignModalOpen,
  onCloseAssign,
  assigneeId,
  setAssigneeId,
  assignReason,
  setAssignReason,
  onAssignSubmit,
  isCancelModalOpen,
  onCloseCancel,
  isReopenModalOpen,
  onCloseReopen,
  reasonText,
  setReasonText,
  onCancelSubmit,
  onReopenSubmit,
  users,
  tags,
  isSubmitting,
  modalError,
}) => {
  return (
    <>
      {/* CREATE TASK MODAL */}
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

      {/* EDIT TASK MODAL */}
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

      {/* ASSIGN TASK MODAL */}
      <FormModal
        isOpen={isAssignModalOpen}
        onClose={onCloseAssign}
        title={`Reassign Task ${activeTask?.taskCode || ''}`}
        subtitle="Transfer task ownership and update department context."
        onSubmit={onAssignSubmit}
        isSubmitting={isSubmitting}
        submitLabel="Reassign Task"
        errorMessage={modalError}
        maxWidth="md"
      >
        <div className="space-y-4">
          <Select
            label="Assignee"
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
            label="Reason for Assignment / Handover"
            value={assignReason}
            onChange={(e) => setAssignReason(e.target.value)}
            placeholder="e.g. Workload rebalancing for Sprint 4"
          />
        </div>
      </FormModal>

      {/* CANCEL TASK MODAL */}
      <FormModal
        isOpen={isCancelModalOpen}
        onClose={onCloseCancel}
        title={`Cancel Task ${activeTask?.taskCode || ''}`}
        subtitle="Provide an audit explanation for cancelling this deliverable."
        onSubmit={onCancelSubmit}
        isSubmitting={isSubmitting}
        submitLabel="Cancel Task"
        submitVariant="danger"
        errorMessage={modalError}
        maxWidth="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Cancellation Reason <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={reasonText}
              onChange={(e) => setReasonText(e.target.value)}
              className="w-full text-sm rounded-lg border border-slate-300 p-2.5 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              placeholder="Why is this task being cancelled?"
            />
          </div>
        </div>
      </FormModal>

      {/* REOPEN TASK MODAL */}
      <FormModal
        isOpen={isReopenModalOpen}
        onClose={onCloseReopen}
        title={`Reopen Task ${activeTask?.taskCode || ''}`}
        subtitle="Supervisor authorization to reopen a closed or cancelled task."
        onSubmit={onReopenSubmit}
        isSubmitting={isSubmitting}
        submitLabel="Reopen Task"
        errorMessage={modalError}
        maxWidth="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Justification Reason <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={reasonText}
              onChange={(e) => setReasonText(e.target.value)}
              className="w-full text-sm rounded-lg border border-slate-300 p-2.5 focus:outline-hidden focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
              placeholder="Why does this task need rework or reopening?"
            />
          </div>
        </div>
      </FormModal>
    </>
  );
};
