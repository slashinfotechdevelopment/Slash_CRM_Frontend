import React, { useState, useEffect, useCallback } from 'react';
import { leaveConnector } from '@/connectors/leave.connector';
import {
  LeaveType,
  CreateLeaveTypePayload,
  UpdateLeaveTypePayload,
  CreatePolicyVersionPayload,
} from '@/api/types/leave.types';
import { Button } from '@/components/ui/Button';
import { LeaveTypesList } from '../components/LeaveTypesList';
import { LeaveTypePolicyDetail } from '../components/LeaveTypePolicyDetail';
import { LeaveSetupModals } from '../components/LeaveSetupModals';

export const LeaveSetupPage: React.FC = () => {
  const [types, setTypes] = useState<LeaveType[]>([]);
  const [loading, setLoading] = useState(true);

  // Selected Type for Policy Versions Inspection
  const [selectedType, setSelectedType] = useState<LeaveType | null>(null);

  // Create Type Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState<CreateLeaveTypePayload>({
    code: '',
    name: '',
    description: '',
    category: 'PAID',
    isPaid: true,
    accrualFrequency: 'ANNUAL',
    annualAllocation: 12,
    carryForwardLimit: 0,
    allowHalfDay: true,
    requiresDocument: false,
    minNoticeDays: 0,
  });
  const [isSubmittingCreate, setIsSubmittingCreate] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Edit Type Modal
  const [editingType, setEditingType] = useState<LeaveType | null>(null);
  const [editForm, setEditForm] = useState<UpdateLeaveTypePayload>({
    name: '',
    description: '',
    category: 'PAID',
    isPaid: true,
    isActive: true,
  });
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // New Policy Version Modal
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);
  const [versionForm, setVersionForm] = useState<CreatePolicyVersionPayload>({
    accrualFrequency: 'ANNUAL',
    annualAllocation: 12,
    carryForwardLimit: 0,
    allowHalfDay: true,
    requiresDocument: false,
    minNoticeDays: 0,
    excludeWeeklyOffs: true,
    excludeHolidays: true,
    effectiveFrom: new Date().toISOString().split('T')[0],
  });
  const [isSubmittingVersion, setIsSubmittingVersion] = useState(false);
  const [versionError, setVersionError] = useState<string | null>(null);

  const handleSelectType = async (t: LeaveType) => {
    try {
      const detailed = await leaveConnector.getLeaveTypeById(t.id);
      setSelectedType(detailed);
    } catch (err) {
      console.error('Failed to load detailed leave type:', err);
      setSelectedType(t);
    }
  };

  const loadLeaveTypes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await leaveConnector.getLeaveTypes(true);
      setTypes(res);
      if (res.length > 0 && !selectedType) {
        handleSelectType(res[0]);
      }
    } catch (err) {
      console.error('Failed to load leave types:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedType]);

  useEffect(() => {
    loadLeaveTypes();
  }, [loadLeaveTypes]);

  const isTypeActive = (t: LeaveType | null | undefined): boolean => {
    if (!t) return false;
    return t.status === 'ACTIVE' || (t.status === undefined && t.isActive !== false);
  };

  const handleCreateSubmit = async () => {
    if (!createForm.code.trim()) {
      setCreateError('Leave type code is required (e.g. CASUAL, SICK).');
      return;
    }
    if (!createForm.name.trim()) {
      setCreateError('Leave type name is required.');
      return;
    }

    setCreateError(null);
    setIsSubmittingCreate(true);
    try {
      const created = await leaveConnector.createLeaveType({
        ...createForm,
        code: createForm.code.trim().toUpperCase(),
        name: createForm.name.trim(),
        description: createForm.description?.trim() || undefined,
        annualAllocation: Number(createForm.annualAllocation),
      });
      setIsCreateModalOpen(false);
      await loadLeaveTypes();
      handleSelectType(created);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to create leave type.';
      setCreateError(msg);
    } finally {
      setIsSubmittingCreate(false);
    }
  };

  const handleEditSubmit = async () => {
    if (!editingType) return;
    if (!editForm.name?.trim()) {
      setEditError('Leave type name is required.');
      return;
    }

    setEditError(null);
    setIsSubmittingEdit(true);
    try {
      await leaveConnector.updateLeaveType(editingType.id, {
        name: editForm.name.trim(),
        description: editForm.description?.trim() || undefined,
        category: editForm.category,
        isPaid: editForm.isPaid,
        status: editForm.status || (editForm.isActive ? 'ACTIVE' : 'INACTIVE'),
      });
      setEditingType(null);
      await loadLeaveTypes();
      if (selectedType?.id === editingType.id) {
        const refreshed = await leaveConnector.getLeaveTypeById(editingType.id);
        setSelectedType(refreshed);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to update leave type.';
      setEditError(msg);
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  const handleVersionSubmit = async () => {
    if (!selectedType) return;
    if (!versionForm.effectiveFrom) {
      setVersionError('Effective from date is required.');
      return;
    }

    setVersionError(null);
    setIsSubmittingVersion(true);
    try {
      await leaveConnector.createPolicyVersion(selectedType.id, {
        ...versionForm,
        annualAllocation: Number(versionForm.annualAllocation),
      });
      setIsVersionModalOpen(false);
      await handleSelectType(selectedType);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to create policy version.';
      setVersionError(msg);
    } finally {
      setIsSubmittingVersion(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Leave Policy Configuration</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Configure enterprise leave quotas, accrual cadences, carry-forward caps, and version-controlled policies.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            setCreateError(null);
            setIsCreateModalOpen(true);
          }}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Leave Type
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <LeaveTypesList
          types={types}
          loading={loading}
          selectedType={selectedType}
          onSelectType={handleSelectType}
          isTypeActive={isTypeActive}
        />

        <div className="lg:col-span-2">
          <LeaveTypePolicyDetail
            selectedType={selectedType}
            isTypeActive={isTypeActive}
            onOpenEdit={() => {
              if (selectedType) {
                setEditingType(selectedType);
                setEditForm({
                  name: selectedType.name,
                  description: selectedType.description || '',
                  category: selectedType.category,
                  isPaid: selectedType.isPaid,
                  status: isTypeActive(selectedType) ? 'ACTIVE' : 'INACTIVE',
                  isActive: isTypeActive(selectedType),
                });
                setEditError(null);
              }
            }}
            onOpenNewVersion={() => {
              setVersionError(null);
              setIsVersionModalOpen(true);
            }}
          />
        </div>
      </div>

      <LeaveSetupModals
        isCreateModalOpen={isCreateModalOpen}
        onCloseCreate={() => setIsCreateModalOpen(false)}
        createForm={createForm}
        setCreateForm={setCreateForm}
        isSubmittingCreate={isSubmittingCreate}
        createError={createError}
        onCreateSubmit={handleCreateSubmit}
        editingType={editingType}
        onCloseEdit={() => setEditingType(null)}
        editForm={editForm}
        setEditForm={setEditForm}
        isSubmittingEdit={isSubmittingEdit}
        editError={editError}
        onEditSubmit={handleEditSubmit}
        selectedType={selectedType}
        isVersionModalOpen={isVersionModalOpen}
        onCloseVersion={() => setIsVersionModalOpen(false)}
        versionForm={versionForm}
        setVersionForm={setVersionForm}
        isSubmittingVersion={isSubmittingVersion}
        versionError={versionError}
        onVersionSubmit={handleVersionSubmit}
      />
    </div>
  );
};
