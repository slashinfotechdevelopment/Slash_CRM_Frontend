import React from 'react';
import { FormModal } from '@/components/templates/FormModal';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { TaskPauseReason } from '@/api/types/task.types';

export const PAUSE_REASONS: { label: string; value: TaskPauseReason }[] = [
  { label: 'Tea Break', value: 'TEA_BREAK' },
  { label: 'Lunch', value: 'LUNCH' },
  { label: 'Personal Work', value: 'PERSONAL_WORK' },
  { label: 'Meeting', value: 'MEETING' },
  { label: 'Waiting on Input / Blocker', value: 'WAITING' },
  { label: 'Technical Issue', value: 'TECHNICAL_ISSUE' },
  { label: 'Other (Specify reason)', value: 'OTHER' },
];

interface MyTasksTimerModalsProps {
  isPauseModalOpen: boolean;
  onClosePause: () => void;
  pauseReason: TaskPauseReason;
  setPauseReason: (r: TaskPauseReason) => void;
  customDescription: string;
  setCustomDescription: (d: string) => void;
  onPauseSubmit: (e: React.FormEvent) => void;

  isStopModalOpen: boolean;
  onCloseStop: () => void;
  stopComment: string;
  setStopComment: (c: string) => void;
  onStopSubmit: (e: React.FormEvent) => void;

  isSubmitting: boolean;
  modalError: string | null;
}

export const MyTasksTimerModals: React.FC<MyTasksTimerModalsProps> = ({
  isPauseModalOpen,
  onClosePause,
  pauseReason,
  setPauseReason,
  customDescription,
  setCustomDescription,
  onPauseSubmit,
  isStopModalOpen,
  onCloseStop,
  stopComment,
  setStopComment,
  onStopSubmit,
  isSubmitting,
  modalError,
}) => {
  return (
    <>
      {/* Pause Timer Modal */}
      <FormModal
        isOpen={isPauseModalOpen}
        onClose={onClosePause}
        title="Pause Task Timer"
        subtitle="Log the reason for pausing this deliverable timer."
        isSubmitting={isSubmitting}
        submitLabel="Confirm Pause"
        errorMessage={modalError}
        onSubmit={onPauseSubmit}
      >
        <div className="space-y-4">
          <Select
            label="Pause Reason"
            required
            value={pauseReason}
            onChange={(e) => setPauseReason(e.target.value as TaskPauseReason)}
            options={PAUSE_REASONS}
          />

          {pauseReason === 'OTHER' && (
            <Input
              label="Custom Reason Description"
              required
              placeholder="e.g. Unscheduled client sync call"
              value={customDescription}
              onChange={(e) => setCustomDescription(e.target.value)}
            />
          )}
        </div>
      </FormModal>

      {/* Stop Timer Modal */}
      <FormModal
        isOpen={isStopModalOpen}
        onClose={onCloseStop}
        title="Conclude Task Timer"
        subtitle="Complete work session and compute gross and net tracked hours."
        isSubmitting={isSubmitting}
        submitLabel="Stop Timer & Save Entry"
        errorMessage={modalError}
        onSubmit={onStopSubmit}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Work Session Note (Optional)
            </label>
            <textarea
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-primary"
              rows={3}
              placeholder="Brief summary of progress made during this session..."
              value={stopComment}
              onChange={(e) => setStopComment(e.target.value)}
            />
          </div>
        </div>
      </FormModal>
    </>
  );
};
