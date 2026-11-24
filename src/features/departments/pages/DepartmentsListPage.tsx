import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ListPage } from '@/components/templates/ListPage';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/hooks/useToast';
import { useConfirm } from '@/hooks/useConfirm';
import { useAuth } from '@/hooks/useAuth';
import { useInfiniteList } from '@/hooks/useInfiniteList';
import { rolesConnector } from '@/connectors/roles.connector';
import {
  DepartmentItem,
  CreateDepartmentDto,
  UpdateDepartmentDto,
  RecordStatus,
} from '@/api/types/roles.types';
import { Plus } from 'lucide-react';
import { useDepartmentColumns } from '../components/useDepartmentColumns';
import { DepartmentModals } from '../components/DepartmentModals';

export const DepartmentsListPage: React.FC = () => {
  const toast = useToast();
  const confirm = useConfirm();
  const { hasPermission } = useAuth();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [parentDepartments, setParentDepartments] = useState<DepartmentItem[]>([]);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentItem | null>(null);

  // Forms state
  const [createForm, setCreateForm] = useState<CreateDepartmentDto>({
    code: '',
    name: '',
    description: '',
    parentId: '',
  });

  const [editForm, setEditForm] = useState<UpdateDepartmentDto>({
    name: '',
    description: '',
    parentId: '',
    status: 'ACTIVE',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Infinite list
  const { items, total, isLoading, isLoadingMore, hasMore, error, loadMore, refresh } =
    useInfiniteList<DepartmentItem, { search?: string; status?: RecordStatus }>({
      queryFn: (params) => rolesConnector.getDepartments(params),
      filters: {
        search: search.trim() || undefined,
        status: (statusFilter as RecordStatus) || undefined,
      },
    });

  // Fetch parent departments for select picker
  const loadParentOptions = useCallback(async () => {
    try {
      const res = await rolesConnector.getDepartments({ limit: 100, status: 'ACTIVE' });
      setParentDepartments(res.items);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    loadParentOptions();
  }, [loadParentOptions]);

  const parentOptions = useMemo(
    () => [
      { value: '', label: 'None (Root Level Department)' },
      ...parentDepartments.map((d) => ({ value: d.id, label: `${d.name} (${d.code})` })),
    ],
    [parentDepartments]
  );

  // Handle Create Submit
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!createForm.code || !createForm.name) {
      setFormError('Department code and name are strictly required.');
      return;
    }
    try {
      setIsSubmitting(true);
      await rolesConnector.createDepartment({
        code: createForm.code.trim().toUpperCase(),
        name: createForm.name.trim(),
        description: createForm.description?.trim() || undefined,
        parentId: createForm.parentId || undefined,
      });
      toast.success('Department created successfully!');
      setIsCreateModalOpen(false);
      setCreateForm({ code: '', name: '', description: '', parentId: '' });
      refresh();
      loadParentOptions();
    } catch (err: unknown) {
      setFormError((err as Error).message || 'Failed to create department.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Edit Submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDepartment) return;
    setFormError(null);
    try {
      setIsSubmitting(true);
      await rolesConnector.updateDepartment(selectedDepartment.id, {
        name: editForm.name?.trim(),
        description: editForm.description?.trim() || undefined,
        parentId: editForm.parentId || undefined,
        status: editForm.status,
      });
      toast.success('Department updated successfully!');
      setIsEditModalOpen(false);
      setSelectedDepartment(null);
      refresh();
      loadParentOptions();
    } catch (err: unknown) {
      setFormError((err as Error).message || 'Failed to update department.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle View Detail
  const handleViewDetail = async (dept: DepartmentItem) => {
    setSelectedDepartment(dept);
    setIsViewModalOpen(true);
    try {
      const detail = await rolesConnector.getDepartment(dept.id);
      if (detail && typeof detail === 'object') {
        const cleanDetail = (detail as unknown as { data?: DepartmentItem }).data || detail;
        setSelectedDepartment((prev) => ({ ...(prev || dept), ...cleanDetail }));
      }
    } catch {
      // Gracefully retain row data already in state
    }
  };

  // Handle Delete / Deactivate
  const handleDelete = useCallback(
    async (dept: DepartmentItem) => {
      const confirmed = await confirm({
        title: `Deactivate ${dept.name}?`,
        message:
          'Are you sure you want to deactivate this department? Active personnel assigned will need relocation.',
        confirmLabel: 'Deactivate',
        tone: 'danger',
      });
      if (!confirmed) return;
      try {
        await rolesConnector.deleteDepartment(dept.id);
        toast.success(`Department ${dept.name} has been deactivated.`);
        refresh();
        loadParentOptions();
      } catch (err: unknown) {
        toast.danger((err as Error).message || 'Failed to deactivate department.');
      }
    },
    [confirm, toast, refresh, loadParentOptions]
  );

  const columns = useDepartmentColumns({
    onView: handleViewDetail,
    onEdit: (dept) => {
      setSelectedDepartment(dept);
      setEditForm({
        name: dept.name,
        description: dept.description || '',
        parentId: dept.parentId || '',
        status: dept.status,
      });
      setIsEditModalOpen(true);
    },
    onDelete: handleDelete,
  });

  return (
    <>
      <ListPage<DepartmentItem>
        title="Departments & Teams"
        description="Organizational structure, parent-child reporting hierarchies, and departmental units."
        total={total}
        columns={columns}
        items={items}
        isLoading={isLoading}
        isLoadingMore={isLoadingMore}
        hasMore={hasMore}
        error={error}
        onRetry={refresh}
        onLoadMore={loadMore}
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search departments by name or code..."
        filters={[
          {
            key: 'status',
            label: 'Status',
            options: [
              { value: '', label: 'All Statuses' },
              { value: 'ACTIVE', label: 'Active Departments' },
              { value: 'INACTIVE', label: 'Inactive Departments' },
            ],
            value: statusFilter,
          },
        ]}
        onFilterChange={(_k, v) => setStatusFilter(String(v))}
        headerActions={
          hasPermission('departments.create') ? (
            <Button
              variant="primary"
              size="md"
              onClick={() => setIsCreateModalOpen(true)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Create Department
            </Button>
          ) : undefined
        }
        onRowClick={(dept) => handleViewDetail(dept)}
      />

      <DepartmentModals
        isCreateModalOpen={isCreateModalOpen}
        onCloseCreate={() => setIsCreateModalOpen(false)}
        createForm={createForm}
        setCreateForm={setCreateForm}
        onCreateSubmit={handleCreateSubmit}
        isEditModalOpen={isEditModalOpen}
        onCloseEdit={() => {
          setIsEditModalOpen(false);
          setSelectedDepartment(null);
        }}
        editForm={editForm}
        setEditForm={setEditForm}
        onEditSubmit={handleEditSubmit}
        isViewModalOpen={isViewModalOpen}
        onCloseView={() => {
          setIsViewModalOpen(false);
          setSelectedDepartment(null);
        }}
        selectedDepartment={selectedDepartment}
        parentOptions={parentOptions}
        isSubmitting={isSubmitting}
        formError={formError}
      />
    </>
  );
};
