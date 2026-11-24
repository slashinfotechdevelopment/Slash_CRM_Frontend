import React from 'react';
import { FormModal } from '@/components/templates/FormModal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { TaskPauseReason } from '@/api/types/task.types';

const PAUSE_REASONS: { label: string; value: TaskPauseReason }[] = [
  { label: 'Tea Break', value: 'TEA_BREAK' },
  { label: 'Lunch', value: 'LUNCH' },
  { label: 'Personal Work', value: 'PERSONAL_WORK' },
  { label: 'Meeting', value: 'MEETING' },
  { label: 'Waiting on Input / Blocker', value: 'WAITING' },
  { label: 'Technical Issue', value: 'TECHNICAL_ISSUE' },
  { label: 'Other', value: 'OTHER' },
];

export interface TaskTimerModalsProps {
  isSubmitting: boolean;
  modalError: string | null;

  // Cancel & Reopen
  isCancelModalOpen: boolean;
  onCloseCancel: () => void;
  isReopenModalOpen: boolean;
  onCloseReopen: () => void;
  reasonText: string;
  setReasonText: (v: string) => void;
  onCancelSubmit: (e: React.FormEvent) => void;
  onReopenSubmit: (e: React.FormEvent) => void;

  // Timer: Pause & Stop
  isPauseModalOpen: boolean;
  onClosePause: () => void;
  pauseReason: TaskPauseReason;
  setPauseReason: (v: TaskPauseReason) => void;
  customPauseDesc: string;
  setCustomPauseDesc: (v: string) => void;
  onPauseSubmit: (e: React.FormEvent) => void;

  isStopModalOpen: boolean;
  onCloseStop: () => void;
  stopComment: string;
  setStopComment: (v: string) => void;
  onStopSubmit: (e: React.FormEvent) => void;

  // Attachment Preview
  isPreviewModalOpen: boolean;
  onClosePreview: () => void;
  previewBlobUrl: string | null;
  previewFileName: string;
  previewMimeType: string;
}

export const TaskTimerModals: React.FC<TaskTimerModalsProps> = ({
  isSubmitting,
  modalError,
  isCancelModalOpen,
  onCloseCancel,
  isReopenModalOpen,
  onCloseReopen,
  reasonText,
  setReasonText,
  onCancelSubmit,
  onReopenSubmit,
  isPauseModalOpen,
  onClosePause,
  pauseReason,
  setPauseReason,
  customPauseDesc,
  setCustomPauseDesc,
  onPauseSubmit,
  isStopModalOpen,
  onCloseStop,
  stopComment,
  setStopComment,
  onStopSubmit,
  isPreviewModalOpen,
  onClosePreview,
  previewBlobUrl,
  previewFileName,
  previewMimeType,
}) => {
  return (
    <>
      {/* CANCEL MODAL */}
      <FormModal
        isOpen={isCancelModalOpen}
        onClose={onCloseCancel}
        title="Cancel Task"
        onSubmit={onCancelSubmit}
        isSubmitting={isSubmitting}
        submitLabel="Cancel Task"
        submitVariant="danger"
        errorMessage={modalError}
        maxWidth="md"
      >
        <div className="space-y-4">
          <Input
            label="Cancellation Reason"
            required
            value={reasonText}
            onChange={(e) => setReasonText(e.target.value)}
            placeholder="Audit reason..."
          />
        </div>
      </FormModal>

      {/* REOPEN MODAL */}
      <FormModal
        isOpen={isReopenModalOpen}
        onClose={onCloseReopen}
        title="Reopen Task"
        onSubmit={onReopenSubmit}
        isSubmitting={isSubmitting}
        submitLabel="Reopen Task"
        errorMessage={modalError}
        maxWidth="md"
      >
        <div className="space-y-4">
          <Input
            label="Reopening Reason"
            required
            value={reasonText}
            onChange={(e) => setReasonText(e.target.value)}
            placeholder="Why is this being reopened?"
          />
        </div>
      </FormModal>

      {/* PAUSE MODAL */}
      <FormModal
        isOpen={isPauseModalOpen}
        onClose={onClosePause}
        title="Pause Timer"
        onSubmit={onPauseSubmit}
        isSubmitting={isSubmitting}
        submitLabel="Pause"
        errorMessage={modalError}
        maxWidth="md"
      >
        <div className="space-y-4">
          <Select
            label="Pause Reason"
            value={pauseReason}
            onChange={(e) => setPauseReason(e.target.value as TaskPauseReason)}
            options={PAUSE_REASONS}
          />
          {pauseReason === 'OTHER' && (
            <Input
              label="Description"
              required
              value={customPauseDesc}
              onChange={(e) => setCustomPauseDesc(e.target.value)}
            />
          )}
        </div>
      </FormModal>

      {/* STOP MODAL */}
      <FormModal
        isOpen={isStopModalOpen}
        onClose={onCloseStop}
        title="Stop Session"
        onSubmit={onStopSubmit}
        isSubmitting={isSubmitting}
        submitLabel="Stop"
        submitVariant="danger"
        errorMessage={modalError}
        maxWidth="md"
      >
        <div className="space-y-4">
          <Input
            label="Final Session Notes (Optional)"
            value={stopComment}
            onChange={(e) => setStopComment(e.target.value)}
          />
        </div>
      </FormModal>

      {/* ATTACHMENT PREVIEW MODAL */}
      {isPreviewModalOpen && previewBlobUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-scaleIn">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <span className="font-semibold text-sm truncate max-w-lg">{previewFileName}</span>
              <Button size="sm" variant="ghost" onClick={onClosePreview}>
                Close
              </Button>
            </div>
            <div className="flex-1 p-4 overflow-auto flex items-center justify-center bg-slate-100">
              {previewMimeType.startsWith('image/') ? (
                <img
                  src={previewBlobUrl}
                  alt={previewFileName}
                  className="max-w-full max-h-[70vh] rounded-lg shadow-sm"
                />
              ) : (
                <iframe
                  src={previewBlobUrl}
                  title={previewFileName}
                  className="w-full h-[70vh] rounded-lg border border-slate-300"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
