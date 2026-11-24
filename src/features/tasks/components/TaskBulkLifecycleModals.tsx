import React from 'react';
import { FormModal } from '@/components/templates/FormModal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { TaskItem } from '@/api/types/task.types';
import { UserItem } from '@/api/types/users.types';

export interface TaskBulkLifecycleModalsProps {
  // Assign Modal
  isAssignModalOpen: boolean;
  onCloseAssign: () => void;
  activeTask: TaskItem | null;
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
  isSubmitting: boolean;
  modalError: string | null;
}

export const TaskBulkLifecycleModals: React.FC<TaskBulkLifecycleModalsProps> = ({
  isAssignModalOpen,
  onCloseAssign,
  activeTask,
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
  isSubmitting,
  modalError,
}) => {
  return (
    <>
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
