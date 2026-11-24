import React from 'react';
import { FormModal } from '@/components/templates/FormModal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import {
  LeadDetail,
  LeadStatus,
  LeadPriority,
  LeadQualificationStatus,
  LeadActivityType,
  PipelineStageItem,
} from '@/api/types/lead.types';
import { DepartmentItem } from '@/api/types/roles.types';
import { UserItem } from '@/api/types/users.types';

export interface LeadDetailModalsProps {
  lead: LeadDetail | null;
  isSubmitting: boolean;
  modalError: string | null;

  // Metadata
  pipelineStages: PipelineStageItem[];
  departments: DepartmentItem[];
  salesReps: UserItem[];

  // Edit
  isEditOpen: boolean;
  onCloseEdit: () => void;
  editForm: Partial<LeadDetail>;
  setEditForm: React.Dispatch<React.SetStateAction<Partial<LeadDetail>>>;
  onEditSubmit: (e: React.FormEvent) => void;

  // Qualify
  isQualifyOpen: boolean;
  onCloseQualify: () => void;
  qualifyForm: {
    qualificationStatus: LeadQualificationStatus;
    note: string;
    unqualifiedReason: string;
  };
  setQualifyForm: React.Dispatch<
    React.SetStateAction<{
      qualificationStatus: LeadQualificationStatus;
      note: string;
      unqualifiedReason: string;
    }>
  >;
  onQualifySubmit: (e: React.FormEvent) => void;

  // Assign
  isAssignOpen: boolean;
  onCloseAssign: () => void;
  assignForm: { assignedToId: string; departmentId: string; note: string };
  setAssignForm: React.Dispatch<
    React.SetStateAction<{ assignedToId: string; departmentId: string; note: string }>
  >;
  onAssignSubmit: (e: React.FormEvent) => void;

  // Status
  isStatusOpen: boolean;
  onCloseStatus: () => void;
  statusForm: {
    status: LeadStatus;
    pipelineStageId: string;
    lostReason: string;
    note: string;
  };
  setStatusForm: React.Dispatch<
    React.SetStateAction<{
      status: LeadStatus;
      pipelineStageId: string;
      lostReason: string;
      note: string;
    }>
  >;
  onStatusSubmit: (e: React.FormEvent) => void;

  // Convert
  isConvertOpen: boolean;
  onCloseConvert: () => void;
  convertForm: { note: string };
  setConvertForm: React.Dispatch<React.SetStateAction<{ note: string }>>;
  onConvertSubmit: (e: React.FormEvent) => void;

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

export const LeadDetailModals: React.FC<LeadDetailModalsProps> = ({
  lead,
  isSubmitting,
  modalError,
  pipelineStages,
  departments,
  salesReps,
  isEditOpen,
  onCloseEdit,
  editForm,
  setEditForm,
  onEditSubmit,
  isQualifyOpen,
  onCloseQualify,
  qualifyForm,
  setQualifyForm,
  onQualifySubmit,
  isAssignOpen,
  onCloseAssign,
  assignForm,
  setAssignForm,
  onAssignSubmit,
  isStatusOpen,
  onCloseStatus,
  statusForm,
  setStatusForm,
  onStatusSubmit,
  isConvertOpen,
  onCloseConvert,
  convertForm,
  setConvertForm,
  onConvertSubmit,
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
      {/* Edit Lead Modal */}
      <FormModal
        isOpen={isEditOpen}
        onClose={onCloseEdit}
        title="Edit Lead Information"
        subtitle={`Update attributes for ${lead?.leadCode || ''}.`}
        isSubmitting={isSubmitting}
        errorMessage={modalError}
        submitLabel="Save Changes"
        onSubmit={onEditSubmit}
        maxWidth="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={editForm.leadName || ''}
              onChange={(e) => setEditForm((p) => ({ ...p, leadName: e.target.value }))}
              required
            />
            <Input
              label="Phone Number"
              value={editForm.phone || ''}
              onChange={(e) => setEditForm((p) => ({ ...p, phone: e.target.value }))}
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Email"
              value={editForm.email || ''}
              onChange={(e) => setEditForm((p) => ({ ...p, email: e.target.value }))}
            />
            <Input
              label="Company Name"
              value={editForm.companyName || ''}
              onChange={(e) => setEditForm((p) => ({ ...p, companyName: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Estimated Value"
              type="number"
              value={editForm.estimatedValue?.toString() || '0'}
              onChange={(e) =>
                setEditForm((p) => ({ ...p, estimatedValue: Number(e.target.value) || 0 }))
              }
            />
            <Select
              label="Priority"
              options={[
                { value: 'LOW', label: 'Low' },
                { value: 'MEDIUM', label: 'Medium' },
                { value: 'HIGH', label: 'High' },
                { value: 'URGENT', label: 'Urgent' },
              ]}
              value={editForm.priority || 'MEDIUM'}
              onChange={(e) =>
                setEditForm((p) => ({ ...p, priority: e.target.value as LeadPriority }))
              }
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-neutral-700">
              Scope / Requirement Description
            </label>
            <textarea
              rows={3}
              value={editForm.requirementDescription || ''}
              onChange={(e) => setEditForm((p) => ({ ...p, requirementDescription: e.target.value }))}
              className="w-full text-sm p-3 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            />
          </div>
        </div>
      </FormModal>

      {/* Qualify Modal */}
      <FormModal
        isOpen={isQualifyOpen}
        onClose={onCloseQualify}
        title="Qualify Lead"
        subtitle="Mark whether prospect fits commercial qualification criteria."
        isSubmitting={isSubmitting}
        errorMessage={modalError}
        submitLabel="Save Qualification"
        onSubmit={onQualifySubmit}
      >
        <div className="space-y-4">
          <Select
            label="Qualification Outcome"
            options={[
              { value: 'QUALIFIED', label: 'Qualified (Meets ICP and Budget)' },
              { value: 'UNQUALIFIED', label: 'Unqualified (Does not meet ICP)' },
              { value: 'PENDING', label: 'Pending Review' },
            ]}
            value={qualifyForm.qualificationStatus}
            onChange={(e) =>
              setQualifyForm((p) => ({
                ...p,
                qualificationStatus: e.target.value as LeadQualificationStatus,
              }))
            }
            required
          />
          {qualifyForm.qualificationStatus === 'UNQUALIFIED' && (
            <Input
              label="Unqualified Reason"
              placeholder="e.g. Budget mismatch, out of service territory"
              value={qualifyForm.unqualifiedReason}
              onChange={(e) => setQualifyForm((p) => ({ ...p, unqualifiedReason: e.target.value }))}
              required
            />
          )}
          <Input
            label="Internal Notes"
            placeholder="Add qualification comments..."
            value={qualifyForm.note}
            onChange={(e) => setQualifyForm((p) => ({ ...p, note: e.target.value }))}
          />
        </div>
      </FormModal>

      {/* Assign Modal */}
      <FormModal
        isOpen={isAssignOpen}
        onClose={onCloseAssign}
        title="Assign Lead Ownership"
        subtitle="Delegate prospect follow-up to a sales consultant."
        isSubmitting={isSubmitting}
        errorMessage={modalError}
        submitLabel="Confirm Assignment"
        onSubmit={onAssignSubmit}
      >
        <div className="space-y-4">
          <Select
            label="Sales Specialist"
            options={[
              { value: '', label: 'Select Consultant' },
              ...salesReps.map((u) => ({ value: u.id, label: `${u.name} (${u.userCode || u.email})` })),
            ]}
            value={assignForm.assignedToId}
            onChange={(e) => setAssignForm((p) => ({ ...p, assignedToId: e.target.value }))}
            required
          />
          <Select
            label="Department"
            options={[
              { value: '', label: 'Keep Current Department' },
              ...departments.map((d) => ({ value: d.id, label: d.name })),
            ]}
            value={assignForm.departmentId}
            onChange={(e) => setAssignForm((p) => ({ ...p, departmentId: e.target.value }))}
          />
        </div>
      </FormModal>

      {/* Status Modal */}
      <FormModal
        isOpen={isStatusOpen}
        onClose={onCloseStatus}
        title="Change Lifecycle Status"
        subtitle="Progress lead along CRM funnel."
        isSubmitting={isSubmitting}
        errorMessage={modalError}
        submitLabel="Update Status"
        onSubmit={onStatusSubmit}
      >
        <div className="space-y-4">
          <Select
            label="Status"
            options={[
              { value: 'NEW', label: 'New' },
              { value: 'CONTACTED', label: 'Contacted' },
              { value: 'QUALIFIED', label: 'Qualified' },
              { value: 'PROPOSAL_SENT', label: 'Proposal Sent' },
              { value: 'NEGOTIATION', label: 'Negotiation' },
              { value: 'WON', label: 'Won' },
              { value: 'LOST', label: 'Lost' },
              { value: 'DISQUALIFIED', label: 'Disqualified' },
            ]}
            value={statusForm.status}
            onChange={(e) => setStatusForm((p) => ({ ...p, status: e.target.value as LeadStatus }))}
            required
          />
          <Select
            label="Pipeline Stage"
            options={[
              { value: '', label: 'Select Stage (Optional)' },
              ...pipelineStages.map((s) => ({ value: s.id, label: s.name })),
            ]}
            value={statusForm.pipelineStageId}
            onChange={(e) => setStatusForm((p) => ({ ...p, pipelineStageId: e.target.value }))}
          />
          {statusForm.status === 'LOST' && (
            <Input
              label="Lost Reason"
              placeholder="e.g. Chose competitor, project shelved"
              value={statusForm.lostReason}
              onChange={(e) => setStatusForm((p) => ({ ...p, lostReason: e.target.value }))}
              required
            />
          )}
        </div>
      </FormModal>

      {/* Convert Modal */}
      <FormModal
        isOpen={isConvertOpen}
        onClose={onCloseConvert}
        title="Convert Lead to Account"
        subtitle="Mark won prospect as ready for formal client account creation."
        isSubmitting={isSubmitting}
        errorMessage={modalError}
        submitLabel="Convert Lead"
        onSubmit={onConvertSubmit}
      >
        <div className="space-y-4">
          <Input
            label="Conversion Note (Optional)"
            placeholder="e.g. Contract executed, invoice dispatched"
            value={convertForm.note}
            onChange={(e) => setConvertForm({ note: e.target.value })}
          />
        </div>
      </FormModal>

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
