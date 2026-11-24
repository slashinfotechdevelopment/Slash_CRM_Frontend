import React from 'react';
import { FormModal } from '@/components/templates/FormModal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import {
  LeadDetail,
  LeadPriority,
  LeadQualificationStatus,
} from '@/api/types/lead.types';

export interface LeadEditQualifyModalsProps {
  lead: LeadDetail | null;
  isSubmitting: boolean;
  modalError: string | null;

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
}

export const LeadEditQualifyModals: React.FC<LeadEditQualifyModalsProps> = ({
  lead,
  isSubmitting,
  modalError,
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
    </>
  );
};
