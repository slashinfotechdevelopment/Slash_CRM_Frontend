import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ListPage } from '@/components/templates/ListPage';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/hooks/useToast';
import { useConfirm } from '@/hooks/useConfirm';
import { useAuth } from '@/hooks/useAuth';
import { useInfiniteList } from '@/hooks/useInfiniteList';
import { rolesConnector } from '@/connectors/roles.connector';
import {
  RoleItem,
  CreateRoleDto,
  UpdateRoleDto,
  RecordStatus,
} from '@/api/types/roles.types';
import { Plus } from 'lucide-react';
import { useRoleColumns } from '../components/useRoleColumns';
import { RoleModals } from '../components/RoleModals';

export const RolesListPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const confirm = useConfirm();
  const { hasPermission } = useAuth();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [onlyDeleted, setOnlyDeleted] = useState(false);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleItem | null>(null);

  // Forms state
  const [createForm, setCreateForm] = useState<CreateRoleDto>({
    code: '',
    name: '',
    description: '',
  });

  const [editForm, setEditForm] = useState<UpdateRoleDto>({
    name: '',
    description: '',
    status: 'ACTIVE',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Infinite list
  const { items, total, isLoading, isLoadingMore, hasMore, error, loadMore, refresh } =
    useInfiniteList<RoleItem, { search?: string; status?: RecordStatus; onlyDeleted?: boolean }>({
      queryFn: (params) => rolesConnector.getRoles(params),
      filters: {
        search: search.trim() || undefined,
        status: (statusFilter as RecordStatus) || undefined,
        onlyDeleted: onlyDeleted || undefined,
      },
    });

  // Handle Create Submit
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!createForm.code || !createForm.name) {
      setFormError('Role code and role name are required fields.');
      return;
    }
    try {
      setIsSubmitting(true);
      await rolesConnector.createRole({
        code: createForm.code.trim().toUpperCase(),
        name: createForm.name.trim(),
        description: createForm.description?.trim() || undefined,
      });
      toast.success('Role created successfully!');
      setIsCreateModalOpen(false);
      setCreateForm({ code: '', name: '', description: '' });
      refresh();
    } catch (err: unknown) {
      setFormError((err as Error).message || 'Failed to create role.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Edit Submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;
    setFormError(null);
    try {
      setIsSubmitting(true);
      await rolesConnector.updateRole(selectedRole.id, {
        name: editForm.name?.trim(),
        description: editForm.description?.trim() || undefined,
        status: editForm.status,
      });
      toast.success('Role updated successfully!');
      setIsEditModalOpen(false);
      setSelectedRole(null);
      refresh();
    } catch (err: unknown) {
      setFormError((err as Error).message || 'Failed to update role.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Soft-Delete
  const handleDeleteRole = useCallback(
    async (role: RoleItem) => {
      const confirmed = await confirm({
        title: `Deactivate ${role.name}?`,
        message:
          'Are you sure you want to soft-delete this role? Users assigned will lose associated permissions.',
        confirmLabel: 'Deactivate Role',
        tone: 'danger',
      });
      if (!confirmed) return;
      try {
        await rolesConnector.deleteRole(role.id);
        toast.success(`Role ${role.name} has been deactivated.`);
        refresh();
      } catch (err: unknown) {
        toast.danger((err as Error).message || 'Failed to deactivate role.');
      }
    },
    [confirm, toast, refresh]
  );

  // Handle Restore
  const handleRestoreRole = useCallback(
    async (role: RoleItem) => {
      const confirmed = await confirm({
        title: `Restore ${role.name}?`,
        message: 'Reactivate this role and restore functional capabilities for assigned members?',
        confirmLabel: 'Restore Role',
        tone: 'info',
      });
      if (!confirmed) return;
      try {
        await rolesConnector.restoreRole(role.id);
        toast.success(`Role ${role.name} has been restored.`);
        refresh();
      } catch (err: unknown) {
        toast.danger((err as Error).message || 'Failed to restore role.');
      }
    },
    [confirm, toast, refresh]
  );

  const columns = useRoleColumns({
    onEdit: (role) => {
      setSelectedRole(role);
      setEditForm({
        name: role.name,
        description: role.description || '',
        status: role.status,
      });
      setIsEditModalOpen(true);
    },
    onDelete: handleDeleteRole,
    onRestore: handleRestoreRole,
  });

  return (
    <>
      <ListPage<RoleItem>
        title="Roles & Authorization"
        description="System role definitions, capability matrices, and permission assignments."
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
        searchPlaceholder="Search roles by title, code or description..."
        filters={[
          {
            key: 'status',
            label: 'Status',
            options: [
              { value: '', label: 'All Statuses' },
              { value: 'ACTIVE', label: 'Active Roles' },
              { value: 'INACTIVE', label: 'Inactive Roles' },
            ],
            value: statusFilter,
          },
        ]}
        onFilterChange={(_k, v) => setStatusFilter(String(v))}
        filterActions={
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-600 bg-white px-3 py-2 border border-slate-200 rounded-lg shadow-2xs hover:bg-slate-50 transition-colors">
              <Input
                type="checkbox"
                className="w-4 h-4 text-brand-primary rounded border-slate-300"
                checked={onlyDeleted}
                onChange={(e) => setOnlyDeleted(e.target.checked)}
              />
              <span>Archived roles</span>
            </label>
          </div>
        }
        headerActions={
          hasPermission('roles.create') ? (
            <Button
              variant="primary"
              size="md"
              onClick={() => setIsCreateModalOpen(true)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Create Role
            </Button>
          ) : undefined
        }
        onRowClick={(role) => navigate(`/roles/${role.id}`)}
      />

      <RoleModals
        isCreateModalOpen={isCreateModalOpen}
        onCloseCreate={() => setIsCreateModalOpen(false)}
        createForm={createForm}
        setCreateForm={setCreateForm}
        onCreateSubmit={handleCreateSubmit}
        isEditModalOpen={isEditModalOpen}
        onCloseEdit={() => {
          setIsEditModalOpen(false);
          setSelectedRole(null);
        }}
        selectedRole={selectedRole}
        editForm={editForm}
        setEditForm={setEditForm}
        onEditSubmit={handleEditSubmit}
        isSubmitting={isSubmitting}
        formError={formError}
      />
    </>
  );
};
