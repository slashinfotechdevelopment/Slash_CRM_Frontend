import { useState, useMemo, useEffect, useCallback } from 'react';
import { useInfiniteList } from '@/hooks/useInfiniteList';
import { useConfirm } from '@/hooks/useConfirm';
import { useToast } from '@/hooks/useToast';
import { leadsConnector } from '@/connectors/leads.connector';
import { rolesConnector } from '@/connectors/roles.connector';
import { usersConnector } from '@/connectors/users.connector';
import {
  LeadItem,
  LeadStatus,
  CreateLeadPayload,
  ImportLeadRowPayload,
  PipelineStageItem,
} from '@/api/types/lead.types';
import { DepartmentItem } from '@/api/types/roles.types';
import { UserItem } from '@/api/types/users.types';
import { isValidPhone, isValidEmail } from '@/utils/validators';
import { LeadListModalsProps } from '../components/LeadListModals';

export function useLeadsList() {
  const confirm = useConfirm();
  const toast = useToast();

  // Filters state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');
  const [sourceFilter, setSourceFilter] = useState<string>('');
  const [stageFilter, setStageFilter] = useState<string>('');
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');

  // Metadata caches
  const [pipelineStages, setPipelineStages] = useState<PipelineStageItem[]>([]);
  const [departments, setDepartments] = useState<DepartmentItem[]>([]);
  const [salesReps, setSalesReps] = useState<UserItem[]>([]);

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Quick Action Modals
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(null);
  const [targetAssigneeId, setTargetAssigneeId] = useState('');
  const [targetStatus, setTargetStatus] = useState<LeadStatus>('NEW');
  const [targetStageId, setTargetStageId] = useState('');

  // Import modal state
  const [importJsonText, setImportJsonText] = useState('');
  const [importDryRun, setImportDryRun] = useState(true);
  const [importResult, setImportResult] = useState<{
    importedCount?: number;
    validCount?: number;
    failedCount?: number;
    errors?: unknown[];
    preview?: unknown[];
  } | null>(null);

  // Create Form State
  const [createForm, setCreateForm] = useState<CreateLeadPayload>({
    leadName: '',
    phone: '',
    alternatePhone: '',
    email: '',
    companyName: '',
    jobTitle: '',
    city: '',
    state: '',
    source: 'WEBSITE',
    priority: 'MEDIUM',
    status: 'NEW',
    qualificationStatus: 'UNQUALIFIED',
    estimatedValue: 0,
    currency: 'INR',
    requirementDescription: '',
    feedback1: '',
    departmentId: '',
    assignedToId: '',
    pipelineStageId: '',
  });

  // Fetch metadata
  useEffect(() => {
    async function loadMeta() {
      try {
        const [stages, depts, usersRes] = await Promise.all([
          leadsConnector.getPipelineStages(),
          rolesConnector.getDepartments({ limit: 100 }),
          usersConnector.getUsers({ page: 1, limit: 100 }),
        ]);
        setPipelineStages(stages);
        setDepartments(depts.items || []);
        setSalesReps(usersRes.items || []);
      } catch {
        // Fallback gracefully on metadata error
      }
    }
    loadMeta();
  }, []);

  const queryParams = useMemo(() => {
    const params: Record<string, string | number> = {};
    if (search.trim()) params.search = search.trim();
    if (statusFilter) params.status = statusFilter;
    if (priorityFilter) params.priority = priorityFilter;
    if (sourceFilter) params.source = sourceFilter;
    if (stageFilter) params.pipelineStageId = stageFilter;
    return params;
  }, [search, statusFilter, priorityFilter, sourceFilter, stageFilter]);

  const {
    items: leads,
    total,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    refresh,
    loadMore,
  } = useInfiniteList<LeadItem, typeof queryParams>({
    queryFn: useCallback(
      async (params) => {
        const res = await leadsConnector.getLeads(params);
        return {
          items: res.items,
          total: res.total,
          hasMore: res.hasMore,
        };
      },
      [],
    ),
    filters: queryParams,
    limit: 20,
  });

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!createForm.leadName.trim()) {
      setFormError('Lead full name is required.');
      return;
    }
    if (!createForm.phone.trim() || !isValidPhone(createForm.phone)) {
      setFormError('Valid phone number is required (min 7 digits).');
      return;
    }
    if (createForm.email && !isValidEmail(createForm.email)) {
      setFormError('Valid email format is required.');
      return;
    }

    try {
      setIsSubmitting(true);
      await leadsConnector.createLead({
        ...createForm,
        leadName: createForm.leadName.trim(),
        phone: createForm.phone.trim(),
        email: createForm.email?.trim() || undefined,
        companyName: createForm.companyName?.trim() || undefined,
        departmentId: createForm.departmentId || undefined,
        assignedToId: createForm.assignedToId || undefined,
        pipelineStageId: createForm.pipelineStageId || undefined,
        estimatedValue: Number(createForm.estimatedValue) || 0,
      });

      toast.success('Lead Created', `Lead for ${createForm.leadName} registered successfully.`);
      setIsCreateOpen(false);
      setCreateForm({
        leadName: '',
        phone: '',
        alternatePhone: '',
        email: '',
        companyName: '',
        jobTitle: '',
        city: '',
        state: '',
        source: 'WEBSITE',
        priority: 'MEDIUM',
        status: 'NEW',
        qualificationStatus: 'UNQUALIFIED',
        estimatedValue: 0,
        currency: 'INR',
        requirementDescription: '',
        feedback1: '',
        departmentId: '',
        assignedToId: '',
        pipelineStageId: '',
      });
      refresh();
    } catch (err) {
      setFormError(err?.message || 'Failed to create lead.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLead = async (lead: LeadItem) => {
    const res = await confirm({
      title: `Delete Lead: ${lead.leadName}?`,
      message: `Are you sure you want to soft-delete lead ${lead.leadCode} (${lead.leadName})? You can restore it later if needed.`,
      tone: 'danger',
      confirmLabel: 'Delete Lead',
      cancelLabel: 'Cancel',
    });
    if (res.confirmed) {
      try {
        await leadsConnector.deleteLead(lead.id);
        toast.success('Lead Deleted', `Lead ${lead.leadCode} removed from active roster.`);
        refresh();
      } catch (err) {
        toast.danger('Delete Failed', err?.message || 'Unable to delete lead.');
      }
    }
  };

  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !targetAssigneeId) return;
    try {
      setIsSubmitting(true);
      await leadsConnector.assignLead(selectedLead.id, {
        assignedToId: targetAssigneeId,
      });
      toast.success('Assigned', 'Lead assigned to selected team specialist.');
      setIsAssignOpen(false);
      setSelectedLead(null);
      refresh();
    } catch (err) {
      toast.danger('Assignment Failed', err?.message || 'Could not assign lead.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead) return;
    try {
      setIsSubmitting(true);
      await leadsConnector.updateStatus(selectedLead.id, {
        status: targetStatus,
        pipelineStageId: targetStageId || undefined,
      });
      toast.success('Status Updated', `Lead moved to ${targetStatus}.`);
      setIsStatusOpen(false);
      setSelectedLead(null);
      refresh();
    } catch (err) {
      toast.danger('Update Failed', err?.message || 'Could not update status.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportCsv = async () => {
    try {
      const blob = await leadsConnector.exportLeads();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leads_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success('Export Ready', 'Leads CSV downloaded.');
    } catch (err) {
      toast.danger('Export Failed', err?.message || 'Failed to export leads.');
    }
  };

  const handleImportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setImportResult(null);

    let parsed: ImportLeadRowPayload[];
    try {
      parsed = JSON.parse(importJsonText);
      if (!Array.isArray(parsed)) {
        throw new Error('Payload must be a JSON array of lead objects.');
      }
    } catch (err) {
      setFormError('Invalid JSON format. Please supply a valid array of objects.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await leadsConnector.importLeads({
        rows: parsed,
        dryRun: importDryRun,
      });
      setImportResult(res);
      if (!importDryRun) {
        toast.success('Import Finished', `Imported ${res.importedCount || 0} leads.`);
        setIsImportOpen(false);
        refresh();
      } else {
        toast.info('Dry Run Completed', `Validated ${res.importedCount || 0} leads.`);
      }
    } catch (err) {
      setFormError(err?.message || 'Lead import failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openAssign = (lead: LeadItem) => {
    setSelectedLead(lead);
    setTargetAssigneeId(lead.assignedToId || '');
    setIsAssignOpen(true);
  };

  const openStatus = (lead: LeadItem) => {
    setSelectedLead(lead);
    setTargetStatus(lead.status);
    setTargetStageId(lead.pipelineStageId || '');
    setIsStatusOpen(true);
  };

  const modalsProps: LeadListModalsProps = {
    isCreateOpen,
    onCloseCreate: () => setIsCreateOpen(false),
    createForm,
    setCreateForm,
    onCreateSubmit: handleCreateSubmit,
    isImportOpen,
    onCloseImport: () => setIsImportOpen(false),
    importJsonText,
    setImportJsonText,
    importDryRun,
    setImportDryRun,
    importResult,
    onImportSubmit: handleImportSubmit,
    isAssignOpen,
    onCloseAssign: () => setIsAssignOpen(false),
    selectedLead,
    targetAssigneeId,
    setTargetAssigneeId,
    onAssignSubmit: handleAssignSubmit,
    isStatusOpen,
    onCloseStatus: () => setIsStatusOpen(false),
    targetStatus,
    setTargetStatus,
    targetStageId,
    setTargetStageId,
    onStatusSubmit: handleStatusSubmit,
    departments,
    salesReps,
    pipelineStages,
    isSubmitting,
    formError,
  };

  return {
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    sourceFilter,
    setSourceFilter,
    stageFilter,
    setStageFilter,
    viewMode,
    setViewMode,
    pipelineStages,
    leads,
    total,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    refresh,
    loadMore,
    setIsCreateOpen,
    setIsImportOpen,
    handleExportCsv,
    handleDeleteLead,
    openAssign,
    openStatus,
    modalsProps,
  };
}
