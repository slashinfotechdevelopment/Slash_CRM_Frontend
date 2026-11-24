import React from 'react';
import { FormModal } from '@/components/templates/FormModal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import {
  LeadItem,
  LeadStatus,
  LeadPriority,
  LeadSource,
  CreateLeadPayload,
  PipelineStageItem,
} from '@/api/types/lead.types';
import { DepartmentItem } from '@/api/types/roles.types';
import { UserItem } from '@/api/types/users.types';

export interface LeadListModalsProps {
  // Create Modal
  isCreateOpen: boolean;
  onCloseCreate: () => void;
  createForm: CreateLeadPayload;
  setCreateForm: React.Dispatch<React.SetStateAction<CreateLeadPayload>>;
  onCreateSubmit: (e: React.FormEvent) => void;

  // Import Modal
  isImportOpen: boolean;
  onCloseImport: () => void;
  importJsonText: string;
  setImportJsonText: (v: string) => void;
  importDryRun: boolean;
  setImportDryRun: (v: boolean) => void;
  importResult: {
    importedCount?: number;
    validCount?: number;
    failedCount?: number;
    errors?: unknown[];
    preview?: unknown[];
  } | null;
  onImportSubmit: (e: React.FormEvent) => void;

  // Quick Assign Modal
  isAssignOpen: boolean;
  onCloseAssign: () => void;
  selectedLead: LeadItem | null;
  targetAssigneeId: string;
  setTargetAssigneeId: (v: string) => void;
  onAssignSubmit: (e: React.FormEvent) => void;

  // Quick Status Modal
  isStatusOpen: boolean;
  onCloseStatus: () => void;
  targetStatus: LeadStatus;
  setTargetStatus: (v: LeadStatus) => void;
  targetStageId: string;
  setTargetStageId: (v: string) => void;
  onStatusSubmit: (e: React.FormEvent) => void;

  // Metadata
  departments: DepartmentItem[];
  salesReps: UserItem[];
  pipelineStages: PipelineStageItem[];
  isSubmitting: boolean;
  formError: string | null;
}

export const LeadListModals: React.FC<LeadListModalsProps> = ({
  isCreateOpen,
  onCloseCreate,
  createForm,
  setCreateForm,
  onCreateSubmit,
  isImportOpen,
  onCloseImport,
  importJsonText,
  setImportJsonText,
  importDryRun,
  setImportDryRun,
  importResult,
  onImportSubmit,
  isAssignOpen,
  onCloseAssign,
  selectedLead,
  targetAssigneeId,
  setTargetAssigneeId,
  onAssignSubmit,
  isStatusOpen,
  onCloseStatus,
  targetStatus,
  setTargetStatus,
  targetStageId,
  setTargetStageId,
  onStatusSubmit,
  departments,
  salesReps,
  pipelineStages,
  isSubmitting,
  formError,
}) => {
  return (
    <>
      {/* Create Lead Modal */}
      <FormModal
        isOpen={isCreateOpen}
        onClose={onCloseCreate}
        title="Register New Lead"
        subtitle="Add prospect contact information, commercial value, and ownership."
        isSubmitting={isSubmitting}
        errorMessage={formError}
        submitLabel="Create Lead"
        onSubmit={onCreateSubmit}
        maxWidth="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Lead Full Name"
              placeholder="e.g. Ramesh Kumar"
              value={createForm.leadName}
              onChange={(e) => setCreateForm((p) => ({ ...p, leadName: e.target.value }))}
              required
            />
            <Input
              label="Contact Phone"
              placeholder="+91 98765 43210"
              value={createForm.phone}
              onChange={(e) => setCreateForm((p) => ({ ...p, phone: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="ramesh@company.com"
              value={createForm.email}
              onChange={(e) => setCreateForm((p) => ({ ...p, email: e.target.value }))}
            />
            <Input
              label="Alternate Phone"
              placeholder="e.g. Landline or second mobile"
              value={createForm.alternatePhone}
              onChange={(e) => setCreateForm((p) => ({ ...p, alternatePhone: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Company / Business Name"
              placeholder="e.g. Apex Technologies"
              value={createForm.companyName}
              onChange={(e) => setCreateForm((p) => ({ ...p, companyName: e.target.value }))}
            />
            <Input
              label="Job Designation"
              placeholder="e.g. Managing Director"
              value={createForm.jobTitle}
              onChange={(e) => setCreateForm((p) => ({ ...p, jobTitle: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Inbound Source"
              options={[
                { value: 'WEBSITE', label: 'Website' },
                { value: 'MANUAL', label: 'Manual' },
                { value: 'REFERRAL', label: 'Referral' },
                { value: 'LINKEDIN', label: 'LinkedIn' },
                { value: 'GOOGLE_ADS', label: 'Google Ads' },
                { value: 'COLD_CALL', label: 'Cold Call' },
                { value: 'CAMPAIGN', label: 'Campaign' },
              ]}
              value={createForm.source || 'WEBSITE'}
              onChange={(e) => setCreateForm((p) => ({ ...p, source: e.target.value as LeadSource }))}
            />
            <Select
              label="Priority Level"
              options={[
                { value: 'LOW', label: 'Low' },
                { value: 'MEDIUM', label: 'Medium' },
                { value: 'HIGH', label: 'High' },
                { value: 'URGENT', label: 'Urgent' },
              ]}
              value={createForm.priority || 'MEDIUM'}
              onChange={(e) => setCreateForm((p) => ({ ...p, priority: e.target.value as LeadPriority }))}
            />
            <Input
              label="Estimated Value"
              type="number"
              placeholder="50000"
              value={createForm.estimatedValue?.toString()}
              onChange={(e) => setCreateForm((p) => ({ ...p, estimatedValue: Number(e.target.value) }))}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Responsible Department"
              options={[
                { value: '', label: 'Select Department (Optional)' },
                ...departments.map((d) => ({ value: d.id, label: d.name })),
              ]}
              value={createForm.departmentId || ''}
              onChange={(e) => setCreateForm((p) => ({ ...p, departmentId: e.target.value }))}
            />
            <Select
              label="Assigned Specialist"
              options={[
                { value: '', label: 'Leave Unassigned' },
                ...salesReps.map((u) => ({ value: u.id, label: `${u.name} (${u.userCode || u.email})` })),
              ]}
              value={createForm.assignedToId || ''}
              onChange={(e) => setCreateForm((p) => ({ ...p, assignedToId: e.target.value }))}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-neutral-700">Client Requirement Description</label>
            <textarea
              rows={3}
              value={createForm.requirementDescription}
              onChange={(e) => setCreateForm((p) => ({ ...p, requirementDescription: e.target.value }))}
              placeholder="Outline customer requirements, scope, or initial consultation notes..."
              className="w-full text-sm p-3 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input
              label="Feedback / Note 1"
              placeholder="Primary reaction"
              value={createForm.feedback1}
              onChange={(e) => setCreateForm((p) => ({ ...p, feedback1: e.target.value }))}
            />
            <Input
              label="Feedback / Note 2"
              placeholder="Commercial posture"
              value={createForm.feedback2}
              onChange={(e) => setCreateForm((p) => ({ ...p, feedback2: e.target.value }))}
            />
            <Input
              label="Feedback / Note 3"
              placeholder="Technical requirement"
              value={createForm.feedback3}
              onChange={(e) => setCreateForm((p) => ({ ...p, feedback3: e.target.value }))}
            />
          </div>
        </div>
      </FormModal>

      {/* Quick Assign Modal */}
      <FormModal
        isOpen={isAssignOpen}
        onClose={onCloseAssign}
        title={`Assign Lead: ${selectedLead?.leadName || ''}`}
        subtitle={`Select a sales consultant or specialist for lead ${selectedLead?.leadCode || ''}.`}
        isSubmitting={isSubmitting}
        submitLabel="Save Assignment"
        onSubmit={onAssignSubmit}
      >
        <div className="space-y-4">
          <Select
            label="Assignee Specialist"
            options={[
              { value: '', label: 'Select Consultant' },
              ...salesReps.map((u) => ({ value: u.id, label: `${u.name} (${u.userCode || u.email})` })),
            ]}
            value={targetAssigneeId}
            onChange={(e) => setTargetAssigneeId(e.target.value)}
            required
          />
        </div>
      </FormModal>

      {/* Quick Status Modal */}
      <FormModal
        isOpen={isStatusOpen}
        onClose={onCloseStatus}
        title={`Update Status: ${selectedLead?.leadName || ''}`}
        subtitle={`Advance or modify lifecycle stage for ${selectedLead?.leadCode || ''}.`}
        isSubmitting={isSubmitting}
        submitLabel="Update Status"
        onSubmit={onStatusSubmit}
      >
        <div className="space-y-4">
          <Select
            label="Lifecycle Status"
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
            value={targetStatus}
            onChange={(e) => setTargetStatus(e.target.value as LeadStatus)}
            required
          />
          <Select
            label="Pipeline Stage"
            options={[
              { value: '', label: 'Keep Current Stage' },
              ...pipelineStages.map((s) => ({ value: s.id, label: s.name })),
            ]}
            value={targetStageId}
            onChange={(e) => setTargetStageId(e.target.value)}
          />
        </div>
      </FormModal>

      {/* Import Modal */}
      <FormModal
        isOpen={isImportOpen}
        onClose={onCloseImport}
        title="Batch Import Leads"
        subtitle="Paste an array of lead objects or CSV records in JSON format."
        isSubmitting={isSubmitting}
        errorMessage={formError}
        submitLabel={importDryRun ? 'Validate & Preview' : 'Execute Import'}
        onSubmit={onImportSubmit}
        maxWidth="lg"
      >
        <div className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-neutral-700">JSON Leads Array</label>
            <textarea
              rows={8}
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder='[{"leadName": "John Doe", "phone": "+919876543210", "email": "john@example.com", "source": "WEBSITE"}]'
              className="w-full text-xs font-mono p-3 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              required
            />
          </div>

          <label className="flex items-center gap-2 text-xs font-medium text-neutral-700 cursor-pointer">
            <input
              type="checkbox"
              checked={importDryRun}
              onChange={(e) => setImportDryRun(e.target.checked)}
              className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
            />
            <span>Dry run (validate without committing records to database)</span>
          </label>

          {importResult && (
            <div className="p-3 bg-neutral-100 rounded-lg text-xs space-y-1">
              <div className="font-semibold text-neutral-800">Validation Results:</div>
              {importResult.validCount !== undefined && <div>Valid Records: {importResult.validCount}</div>}
              {importResult.importedCount !== undefined && <div>Imported: {importResult.importedCount}</div>}
              {Boolean(importResult.failedCount && importResult.failedCount > 0) && (
                <div className="text-red-600">Failed: {importResult.failedCount}</div>
              )}
            </div>
          )}
        </div>
      </FormModal>
    </>
  );
};
