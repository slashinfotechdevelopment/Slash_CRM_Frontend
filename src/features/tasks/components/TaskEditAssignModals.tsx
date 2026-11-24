import React from 'react';
import { FormModal } from '@/components/templates/FormModal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { TaskItem, TaskPriority, TaskStatus } from '@/api/types/task.types';
import { UserItem } from '@/api/types/users.types';

export interface TaskEditAssignModalsProps {
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
}

export const TaskEditAssignModals: React.FC<TaskEditAssignModalsProps> = ({
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
    </>
  );
};
