import React from 'react';
import { FormModal } from '@/components/templates/FormModal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { LeadActivityType } from '@/api/types/lead.types';

export interface LeadActivityModalsProps {
  isSubmitting: boolean;
  modalError: string | null;

  // Activity
  isActivityOpen: boolean;
  onCloseActivity: () => void;
  activityForm: { type: LeadActivityType; title: string; description: string };
  setActivityForm: React.Dispatch<
    React.SetStateAction<{ type: LeadActivityType; title: string; description: string }>
  >;
  onActivitySubmit: (e: React.FormEvent) => void;

  // Follow-up
  isFollowUpOpen: boolean;
  onCloseFollowUp: () => void;
  followUpForm: { scheduledAt: string; note: string };
  setFollowUpForm: React.Dispatch<
    React.SetStateAction<{ scheduledAt: string; note: string }>
  >;
  onFollowUpSubmit: (e: React.FormEvent) => void;
}

export const LeadActivityModals: React.FC<LeadActivityModalsProps> = ({
  isSubmitting,
  modalError,
  isActivityOpen,
  onCloseActivity,
  activityForm,
  setActivityForm,
  onActivitySubmit,
  isFollowUpOpen,
  onCloseFollowUp,
  followUpForm,
  setFollowUpForm,
  onFollowUpSubmit,
}) => {
  return (
    <>
      {/* Log Activity Modal */}
      <FormModal
        isOpen={isActivityOpen}
        onClose={onCloseActivity}
        title="Log Client Activity"
        subtitle="Record notes, calls, or meeting outcomes."
        isSubmitting={isSubmitting}
        errorMessage={modalError}
        submitLabel="Save Activity"
        onSubmit={onActivitySubmit}
      >
        <div className="space-y-4">
          <Select
            label="Activity Type"
            options={[
              { value: 'CALL', label: 'Phone Call' },
              { value: 'MEETING', label: 'Client Meeting' },
              { value: 'EMAIL', label: 'Email Communication' },
              { value: 'NOTE', label: 'Internal Note' },
            ]}
            value={activityForm.type}
            onChange={(e) =>
              setActivityForm((p) => ({ ...p, type: e.target.value as LeadActivityType }))
            }
            required
          />
          <Input
            label="Activity Subject"
            placeholder="e.g. Discovery call regarding CRM integration"
            value={activityForm.title}
            onChange={(e) => setActivityForm((p) => ({ ...p, title: e.target.value }))}
            required
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-neutral-700">Detailed Notes</label>
            <textarea
              rows={3}
              value={activityForm.description}
              onChange={(e) => setActivityForm((p) => ({ ...p, description: e.target.value }))}
              placeholder="Key talking points, client queries, next action items..."
              className="w-full text-sm p-3 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            />
          </div>
        </div>
      </FormModal>

      {/* Schedule Follow-up Modal */}
      <FormModal
        isOpen={isFollowUpOpen}
        onClose={onCloseFollowUp}
        title="Schedule Follow-Up"
        subtitle="Set an action deadline and reminder for this lead."
        isSubmitting={isSubmitting}
        errorMessage={modalError}
        submitLabel="Schedule Reminder"
        onSubmit={onFollowUpSubmit}
      >
        <div className="space-y-4">
          <Input
            label="Scheduled Date & Time"
            type="datetime-local"
            value={followUpForm.scheduledAt}
            onChange={(e) => setFollowUpForm((p) => ({ ...p, scheduledAt: e.target.value }))}
            required
          />
          <Input
            label="Reminder Notes / Deliverable"
            placeholder="e.g. Send formal project proposal and statement of work"
            value={followUpForm.note}
            onChange={(e) => setFollowUpForm((p) => ({ ...p, note: e.target.value }))}
          />
        </div>
      </FormModal>
    </>
  );
};
