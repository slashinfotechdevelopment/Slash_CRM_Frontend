import React from 'react';
import { FormModal } from '@/components/templates/FormModal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { LeadStatus, PipelineStageItem } from '@/api/types/lead.types';
import { DepartmentItem } from '@/api/types/roles.types';
import { UserItem } from '@/api/types/users.types';

export interface LeadLifecycleModalsProps {
  isSubmitting: boolean;
  modalError: string | null;

  // Metadata
  pipelineStages: PipelineStageItem[];
  departments: DepartmentItem[];
  salesReps: UserItem[];

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
}

export const LeadLifecycleModals: React.FC<LeadLifecycleModalsProps> = ({
  isSubmitting,
  modalError,
  pipelineStages,
  departments,
  salesReps,
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
}) => {
  return (
    <>
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
    </>
  );
};
