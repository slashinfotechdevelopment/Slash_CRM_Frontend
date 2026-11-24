import { useState, useEffect, useCallback } from 'react';
import { NavigateFunction } from 'react-router-dom';
import { useConfirm } from '@/hooks/useConfirm';
import { useToast } from '@/hooks/useToast';
import { leadsConnector } from '@/connectors/leads.connector';
import { rolesConnector } from '@/connectors/roles.connector';
import { usersConnector } from '@/connectors/users.connector';
import {
  LeadDetail,
  LeadStatus,
  UpdateLeadPayload,
  LeadQualificationStatus,
  LeadActivityItem,
  LeadActivityType,
  PipelineStageItem,
} from '@/api/types/lead.types';
import { DepartmentItem } from '@/api/types/roles.types';
import { UserItem } from '@/api/types/users.types';
import { LeadDetailModalsProps } from '../components/LeadDetailModals';

export function useLeadDetail(id: string | undefined, navigate: NavigateFunction) {
  const confirm = useConfirm();
  const toast = useToast();

  const [lead, setLead] = useState<LeadDetail | null>(null);
  const [timeline, setTimeline] = useState<LeadActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Metadata
  const [pipelineStages, setPipelineStages] = useState<PipelineStageItem[]>([]);
  const [departments, setDepartments] = useState<DepartmentItem[]>([]);
  const [salesReps, setSalesReps] = useState<UserItem[]>([]);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'timeline' | 'followups'>('timeline');

  // Modals
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [isQualifyOpen, setIsQualifyOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isConvertOpen, setIsConvertOpen] = useState(false);
  const [isActivityOpen, setIsActivityOpen] = useState(false);
  const [isFollowUpOpen, setIsFollowUpOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Form states
  const [editForm, setEditForm] = useState<Partial<LeadDetail>>({});
  const [assignForm, setAssignForm] = useState({ assignedToId: '', departmentId: '', note: '' });
  const [qualifyForm, setQualifyForm] = useState({
    qualificationStatus: 'QUALIFIED' as LeadQualificationStatus,
    note: '',
    unqualifiedReason: '',
  });
  const [statusForm, setStatusForm] = useState({
    status: 'CONTACTED' as LeadStatus,
    pipelineStageId: '',
    lostReason: '',
    note: '',
  });
  const [convertForm, setConvertForm] = useState({ note: '' });
  const [activityForm, setActivityForm] = useState({
    type: 'CALL' as LeadActivityType,
    title: '',
    description: '',
  });
  const [followUpForm, setFollowUpForm] = useState({
    scheduledAt: '',
    note: '',
  });

  const fetchLeadData = useCallback(async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      setError(null);
      const [leadData, timelineData] = await Promise.all([
        leadsConnector.getLead(id),
        leadsConnector.getLeadTimeline(id),
      ]);
      setLead(leadData);
      setTimeline(timelineData);

      const [stagesRes, deptsRes, repsRes] = await Promise.allSettled([
        leadsConnector.getPipelineStages(),
        rolesConnector.getDepartments({ limit: 100 }),
        usersConnector.getUsers({ page: 1, limit: 100 }),
      ]);
      if (stagesRes.status === 'fulfilled') setPipelineStages(stagesRes.value);
      if (deptsRes.status === 'fulfilled') setDepartments(deptsRes.value.items || []);
      if (repsRes.status === 'fulfilled') setSalesReps(repsRes.value.items || []);
    } catch (err) {
      setError(err?.message || 'Failed to load lead details');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchLeadData();
  }, [fetchLeadData]);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lead) return;
    try {
      setIsSubmitting(true);
      setModalError(null);
      const payload: UpdateLeadPayload = {
        leadName: editForm.leadName,
        phone: editForm.phone,
        email: editForm.email || undefined,
        companyName: editForm.companyName || undefined,
        estimatedValue: editForm.estimatedValue !== undefined ? Number(editForm.estimatedValue) : undefined,
        priority: editForm.priority,
        requirementDescription: editForm.requirementDescription || undefined,
      };
      await leadsConnector.updateLead(lead.id, payload);
      toast.success('Lead Updated', 'Changes saved successfully.');
      setIsEditOpen(false);
      fetchLeadData();
    } catch (err) {
      setModalError(err?.message || 'Failed to update lead');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lead || !assignForm.assignedToId) return;
    try {
      setIsSubmitting(true);
      setModalError(null);
      await leadsConnector.assignLead(lead.id, {
        assignedToId: assignForm.assignedToId,
        departmentId: assignForm.departmentId || undefined,
        note: assignForm.note || undefined,
      });
      toast.success('Lead Assigned', 'New specialist assigned.');
      setIsAssignOpen(false);
      fetchLeadData();
    } catch (err) {
      setModalError(err?.message || 'Failed to assign lead');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQualifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lead) return;
    try {
      setIsSubmitting(true);
      setModalError(null);
      await leadsConnector.qualifyLead(lead.id, qualifyForm);
      toast.success('Qualification Recorded', `Lead marked as ${qualifyForm.qualificationStatus}.`);
      setIsQualifyOpen(false);
      fetchLeadData();
    } catch (err) {
      setModalError(err?.message || 'Failed to qualify lead');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lead) return;
    try {
      setIsSubmitting(true);
      setModalError(null);
      await leadsConnector.updateStatus(lead.id, {
        status: statusForm.status,
        pipelineStageId: statusForm.pipelineStageId || undefined,
        lostReason: statusForm.status === 'LOST' ? statusForm.lostReason : undefined,
        note: statusForm.note || undefined,
      });
      toast.success('Status Updated', `Lead moved to ${statusForm.status}.`);
      setIsStatusOpen(false);
      fetchLeadData();
    } catch (err) {
      setModalError(err?.message || 'Failed to update status');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConvertSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lead) return;
    try {
      setIsSubmitting(true);
      setModalError(null);
      await leadsConnector.convertLead(lead.id, convertForm);
      toast.success('Lead Converted', 'Prospect successfully converted to an active account.');
      setIsConvertOpen(false);
      fetchLeadData();
    } catch (err) {
      setModalError(err?.message || 'Failed to convert lead');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleActivitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lead || !activityForm.title) return;
    try {
      setIsSubmitting(true);
      setModalError(null);
      await leadsConnector.createActivity(lead.id, activityForm);
      toast.success('Activity Logged', 'Timeline updated.');
      setIsActivityOpen(false);
      setActivityForm({ type: 'CALL', title: '', description: '' });
      fetchLeadData();
    } catch (err) {
      setModalError(err?.message || 'Failed to log activity');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFollowUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lead || !followUpForm.scheduledAt) return;
    try {
      setIsSubmitting(true);
      setModalError(null);
      const isoDate = new Date(followUpForm.scheduledAt).toISOString();
      await leadsConnector.createFollowUp(lead.id, {
        scheduledAt: isoDate,
        note: followUpForm.note || undefined,
      });
      toast.success('Follow-up Scheduled', 'Reminder registered.');
      setIsFollowUpOpen(false);
      setFollowUpForm({ scheduledAt: '', note: '' });
      fetchLeadData();
    } catch (err) {
      setModalError(err?.message || 'Failed to schedule follow-up');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteFollowUp = async (followUpId: string) => {
    try {
      await leadsConnector.updateFollowUp(followUpId, { status: 'COMPLETED' });
      toast.success('Follow-up Completed', 'Item archived.');
      fetchLeadData();
    } catch (err) {
      toast.danger('Action Failed', err?.message || 'Could not complete follow-up.');
    }
  };

  const handleDeleteLead = async () => {
    if (!lead) return;
    const res = await confirm({
      title: `Delete Lead: ${lead.leadName}?`,
      message: `Are you sure you want to delete lead ${lead.leadCode}? This can be restored if necessary.`,
      tone: 'danger',
      confirmLabel: 'Delete Lead',
      cancelLabel: 'Cancel',
    });
    if (res.confirmed) {
      try {
        await leadsConnector.deleteLead(lead.id);
        toast.success('Lead Deleted', `Lead ${lead.leadCode} soft-deleted.`);
        navigate('/leads');
      } catch (err) {
        toast.danger('Delete Failed', err?.message || 'Unable to delete lead.');
      }
    }
  };

  const handleRestoreLead = async () => {
    if (!lead) return;
    try {
      await leadsConnector.restoreLead(lead.id);
      toast.success('Lead Restored', `Lead ${lead.leadCode} is now active.`);
      fetchLeadData();
    } catch (err) {
      toast.danger('Restore Failed', err?.message || 'Unable to restore lead.');
    }
  };

  const modalsProps: LeadDetailModalsProps = {
    lead,
    isSubmitting,
    modalError,
    pipelineStages,
    departments,
    salesReps,
    isEditOpen,
    onCloseEdit: () => setIsEditOpen(false),
    editForm,
    setEditForm,
    onEditSubmit: handleEditSubmit,
    isQualifyOpen,
    onCloseQualify: () => setIsQualifyOpen(false),
    qualifyForm,
    setQualifyForm,
    onQualifySubmit: handleQualifySubmit,
    isAssignOpen,
    onCloseAssign: () => setIsAssignOpen(false),
    assignForm,
    setAssignForm,
    onAssignSubmit: handleAssignSubmit,
    isStatusOpen,
    onCloseStatus: () => setIsStatusOpen(false),
    statusForm,
    setStatusForm,
    onStatusSubmit: handleStatusSubmit,
    isConvertOpen,
    onCloseConvert: () => setIsConvertOpen(false),
    convertForm,
    setConvertForm,
    onConvertSubmit: handleConvertSubmit,
    isActivityOpen,
    onCloseActivity: () => setIsActivityOpen(false),
    activityForm,
    setActivityForm,
    onActivitySubmit: handleActivitySubmit,
    isFollowUpOpen,
    onCloseFollowUp: () => setIsFollowUpOpen(false),
    followUpForm,
    setFollowUpForm,
    onFollowUpSubmit: handleFollowUpSubmit,
  };

  return {
    lead,
    timeline,
    isLoading,
    error,
    activeTab,
    setActiveTab,
    fetchLeadData,
    setIsEditOpen,
    setIsAssignOpen,
    setIsQualifyOpen,
    setIsStatusOpen,
    setIsConvertOpen,
    setIsActivityOpen,
    setIsFollowUpOpen,
    setEditForm,
    setAssignForm,
    setQualifyForm,
    setStatusForm,
    setConvertForm,
    handleCompleteFollowUp,
    handleDeleteLead,
    handleRestoreLead,
    modalsProps,
  };
}
