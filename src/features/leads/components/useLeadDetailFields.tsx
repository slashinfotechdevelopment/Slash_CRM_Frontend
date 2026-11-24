import { DetailField } from '@/components/templates/DetailPage';
import { Badge } from '@/components/ui/Badge';
import { LeadDetail } from '@/api/types/lead.types';
import { formatDate, formatCurrency } from '@/utils/formatters';
import { PhoneCall, Mail } from 'lucide-react';

export function useLeadDetailFields(lead: LeadDetail | null): DetailField[] {
  if (!lead) return [];

  return [
    {
      label: 'Contact Phone',
      value: (
        <div className="flex items-center gap-1.5 font-semibold text-neutral-900">
          <PhoneCall className="w-3.5 h-3.5 text-primary-600" />
          <span>{lead.phone}</span>
        </div>
      ),
    },
    {
      label: 'Email Address',
      value: lead.email ? (
        <div className="flex items-center gap-1.5 text-neutral-800">
          <Mail className="w-3.5 h-3.5 text-neutral-500" />
          <span>{lead.email}</span>
        </div>
      ) : (
        '—'
      ),
    },
    {
      label: 'Company / Organization',
      value: lead.companyName || 'Individual Prospect',
    },
    {
      label: 'Designation / Title',
      value: lead.jobTitle || '—',
    },
    {
      label: 'Pipeline Stage',
      value: lead.pipelineStage ? (
        <span className="font-semibold text-primary-700 bg-primary-50 px-2 py-0.5 rounded border border-primary-200">
          {lead.pipelineStage.name}
        </span>
      ) : (
        'Not assigned to pipeline stage'
      ),
    },
    {
      label: 'Qualification Status',
      value: (
        <Badge
          variant={
            lead.qualificationStatus === 'QUALIFIED'
              ? 'success'
              : lead.qualificationStatus === 'PENDING'
              ? 'warning'
              : 'neutral'
          }
        >
          {lead.qualificationStatus}
        </Badge>
      ),
    },
    {
      label: 'Commercial Value',
      value: (
        <span className="font-bold text-neutral-900">
          {lead.estimatedValue ? formatCurrency(lead.estimatedValue, lead.currency || 'INR') : '—'}
        </span>
      ),
    },
    {
      label: 'Expected Closing Date',
      value: lead.expectedClosingDate ? formatDate(lead.expectedClosingDate) : '—',
    },
    {
      label: 'Inbound Source',
      value: (
        <span className="capitalize font-medium text-neutral-700">
          {lead.source?.toLowerCase().replace('_', ' ')}
        </span>
      ),
    },
    {
      label: 'Assigned Specialist',
      value: lead.assignedTo ? (
        <div className="flex flex-col">
          <span className="font-semibold text-neutral-900">{lead.assignedTo.name}</span>
          {lead.department && <span className="text-xs text-neutral-500">{lead.department.name}</span>}
        </div>
      ) : (
        <span className="text-amber-600 font-medium">Unassigned</span>
      ),
    },
    {
      label: 'Client Requirements / Scope',
      value: lead.requirementDescription || 'No detailed scope notes provided.',
      span: 2,
    },
    {
      label: 'Consultation Feedback 1',
      value: lead.feedback1 || '—',
    },
    {
      label: 'Consultation Feedback 2',
      value: lead.feedback2 || '—',
    },
    {
      label: 'Consultation Feedback 3',
      value: lead.feedback3 || '—',
    },
  ];
}
