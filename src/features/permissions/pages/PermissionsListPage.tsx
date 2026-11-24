import React, { useState, useMemo, useCallback } from 'react';
import { ListPage } from '@/components/templates/ListPage';
import { Button } from '@/components/ui/Button';
import { useInfiniteList } from '@/hooks/useInfiniteList';
import { useConfirm } from '@/hooks/useConfirm';
import { useToast } from '@/hooks/useToast';
import { rolesConnector } from '@/connectors/roles.connector';
import { PermissionItem, CreatePermissionDto, UpdatePermissionDto, RecordStatus } from '@/api/types/roles.types';
import { Plus } from 'lucide-react';
import { usePermissionColumns } from '../components/usePermissionColumns';
import { PermissionModals } from '../components/PermissionModals';

export const PermissionsListPage: React.FC = () => {
  const confirm = useConfirm();
  const toast = useToast();

  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<PermissionItem | null>(null);

  const [createForm, setCreateForm] = useState<CreatePermissionDto>({
    module: '',
    action: '',
    code: '',
    name: '',
    description: '',
  });
  const [editForm, setEditForm] = useState<UpdatePermissionDto>({
    name: '',
    description: '',
    status: 'ACTIVE',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const filters = useMemo(
    () => ({
      search: search.trim() || undefined,
      module: moduleFilter.trim() || undefined,
      status: (statusFilter as RecordStatus) || undefined,
    }),
    [search, moduleFilter, statusFilter]
  );

  const { items, total, isLoading, isLoadingMore, hasMore, error, loadMore, refresh } = useInfiniteList<
    PermissionItem,
    typeof filters
  >({
    queryFn: (params) => rolesConnector.getPermissions(params),
    filters,
  });

  const handleModuleChange = (val: string) => {
    const cleanMod = val.toLowerCase().replace(/[^a-z0-9_]/g, '');
    setCreateForm((p) => {
      const code = p.action ? `${cleanMod}.${p.action}` : cleanMod;
      return { ...p, module: cleanMod, code };
    });
  };

  const handleActionChange = (val: string) => {
    const cleanAct = val.toLowerCase().replace(/[^a-z0-9_]/g, '');
    setCreateForm((p) => {
      const code = p.module ? `${p.module}.${cleanAct}` : cleanAct;
      return { ...p, action: cleanAct, code };
    });
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const code = createForm.code.trim().toLowerCase();
    const name = createForm.name.trim();
    const module = createForm.module.trim().toLowerCase();
    const action = createForm.action.trim().toLowerCase();

    if (!code || !/^[a-z0-9_]+(\.[a-z0-9_]+)+$/.test(code)) {
      setFormError('Permission code must be in module.action format (e.g. leads.export).');
      return;
    }
    if (!name || name.length < 2) {
      setFormError('Permission name must be at least 2 characters long.');
      return;
    }

    setIsSubmitting(true);
    try {
      await rolesConnector.createPermission({
        module,
        action,
        code,
        name,
        description: createForm.description?.trim() || undefined,
      });
      toast.success(`Permission "${name}" created successfully.`);
      setIsCreateModalOpen(false);
      setCreateForm({ module: '', action: '', code: '', name: '', description: '' });
      refresh();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to create permission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPermission) return;
    setFormError(null);

    const name = editForm.name?.trim();
    if (!name || name.length < 2) {
      setFormError('Permission name must be at least 2 characters long.');
      return;
    }

    setIsSubmitting(true);
    try {
      await rolesConnector.updatePermission(selectedPermission.id, {
        name,
        description: editForm.description?.trim() || undefined,
        status: editForm.status,
      });
      toast.success(`Permission "${name}" updated.`);
      setIsEditModalOpen(false);
      setSelectedPermission(null);
      refresh();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to update permission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = useCallback(
    async (perm: PermissionItem) => {
      const res = await confirm({
        tone: 'danger',
        title: `Delete Permission "${perm.name}"?`,
        message: `This will remove the capability "${perm.code}" from the CRM system. It will fail if assigned to active system roles.`,
        confirmLabel: 'Delete Permission',
        consequence: 'This action is permanent and cannot be undone.',
      });

      if (res.confirmed) {
        try {
          await rolesConnector.deletePermission(perm.id);
          toast.success(`Permission "${perm.name}" deleted.`);
          refresh();
        } catch (err) {
          toast.danger(err instanceof Error ? err.message : 'Failed to delete permission.');
        }
      }
    },
    [confirm, toast, refresh]
  );

  const handleViewDetail = async (perm: PermissionItem) => {
    try {
      const detail = await rolesConnector.getPermission(perm.id);
      setSelectedPermission(detail);
      setIsViewModalOpen(true);
    } catch (err) {
      toast.danger(err instanceof Error ? err.message : 'Failed to load permission details.');
    }
  };

  const columns = usePermissionColumns({
    onView: (perm) => handleViewDetail(perm),
    onEdit: (perm) => {
      setSelectedPermission(perm);
      setEditForm({
        name: perm.name,
        description: perm.description || '',
        status: perm.status,
      });
      setIsEditModalOpen(true);
    },
    onDelete: handleDelete,
  });

  return (
    <>
      <ListPage<PermissionItem>
        title="System Permissions"
        description="Comprehensive inventory of fine-grained application capabilities and authorization keys."
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
        searchPlaceholder="Search permissions by name, code, or module..."
        filters={[
          {
            key: 'module',
            placeholder: 'All Modules',
            options: [
              { value: '', label: 'All Modules' },
              { value: 'users', label: 'Users' },
              { value: 'roles', label: 'Roles' },
              { value: 'permissions', label: 'Permissions' },
              { value: 'departments', label: 'Departments' },
              { value: 'attendance', label: 'Attendance' },
              { value: 'tasks', label: 'Tasks' },
              { value: 'leads', label: 'Leads' },
              { value: 'leave', label: 'Leave' },
              { value: 'reports', label: 'Reports' },
            ],
            value: moduleFilter,
          },
          {
            key: 'status',
            placeholder: 'All Statuses',
            options: [
              { value: '', label: 'All Statuses' },
              { value: 'ACTIVE', label: 'Active' },
              { value: 'INACTIVE', label: 'Inactive' },
            ],
            value: statusFilter,
          },
        ]}
        onFilterChange={(key, v) => {
          if (key === 'module') setModuleFilter(String(v));
          if (key === 'status') setStatusFilter(String(v));
        }}
        headerActions={
          <Button
            variant="primary"
            size="md"
            onClick={() => setIsCreateModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Create Permission
          </Button>
        }
        onRowClick={(perm) => handleViewDetail(perm)}
      />

      <PermissionModals
        isCreateModalOpen={isCreateModalOpen}
        onCloseCreate={() => setIsCreateModalOpen(false)}
        createForm={createForm}
        onCreateModuleChange={handleModuleChange}
        onCreateActionChange={handleActionChange}
        onCreateFieldChange={(f, v) => setCreateForm((p) => ({ ...p, [f]: v }))}
        onCreateSubmit={handleCreateSubmit}
        isEditModalOpen={isEditModalOpen}
        onCloseEdit={() => {
          setIsEditModalOpen(false);
          setSelectedPermission(null);
        }}
        selectedPermission={selectedPermission}
        editForm={editForm}
        onEditFieldChange={(f, v) => setEditForm((p) => ({ ...p, [f]: v }))}
        onEditSubmit={handleEditSubmit}
        isViewModalOpen={isViewModalOpen}
        onCloseView={() => {
          setIsViewModalOpen(false);
          setSelectedPermission(null);
        }}
        isSubmitting={isSubmitting}
        formError={formError}
      />
    </>
  );
};
