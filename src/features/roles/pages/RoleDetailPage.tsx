import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DetailPage, DetailField } from '@/components/templates/DetailPage';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useConfirm } from '@/hooks/useConfirm';
import { useToast } from '@/hooks/useToast';
import { rolesConnector } from '@/connectors/roles.connector';
import {
  RoleDetail,
  RolePermissionItem,
  PermissionItem,
  PermissionGroup,
  DataScope,
} from '@/api/types/roles.types';
import { Plus, Layers } from 'lucide-react';
import { formatDate } from '@/utils/formatters';
import { RolePermissionsTable } from '../components/RolePermissionsTable';
import { AddPermissionModal, BulkPermissionsModal } from '../components/RoleDetailModals';

export const RoleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const confirm = useConfirm();
  const toast = useToast();

  const [role, setRole] = useState<RoleDetail | null>(null);
  const [permissions, setPermissions] = useState<RolePermissionItem[]>([]);
  const [allPermissions, setAllPermissions] = useState<PermissionItem[]>([]);
  const [groupedPermissions, setGroupedPermissions] = useState<PermissionGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isAddPermissionModalOpen, setIsAddPermissionModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const [selectedPermissionId, setSelectedPermissionId] = useState('');
  const [selectedDataScope, setSelectedDataScope] = useState<DataScope>('ALL');
  const [bulkSelectedIds, setBulkSelectedIds] = useState<Record<string, DataScope>>({});

  const loadData = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const [roleData, rolePerms, allPermsRes, groupedRes] = await Promise.all([
        rolesConnector.getRole(id),
        rolesConnector.getRolePermissions(id),
        rolesConnector.getPermissions({ limit: 100 }),
        rolesConnector.getPermissionsGroupedByModule(),
      ]);

      const flatPerms =
        groupedRes.length > 0
          ? groupedRes.flatMap((g) => g.permissions)
          : allPermsRes.items;

      setRole(roleData);
      setPermissions(rolePerms.length > 0 ? rolePerms : (roleData.permissions || []));
      setAllPermissions(flatPerms);
      setGroupedPermissions(groupedRes);

      const mapping: Record<string, DataScope> = {};
      rolePerms.forEach((rp) => {
        mapping[rp.permissionId] = rp.dataScope;
      });
      setBulkSelectedIds(mapping);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const isSuperAdmin = role?.isSystem || role?.code === 'SUPER_ADMIN' || role?.code === 'ADMIN';

  const handleAddPermissionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !selectedPermissionId) {
      setModalError('Please select a permission to add.');
      return;
    }
    setIsSubmitting(true);
    setModalError(null);
    try {
      await rolesConnector.addRolePermission(id, {
        permissionId: selectedPermissionId,
        dataScope: selectedDataScope,
      });
      toast.success('Permission assigned to role successfully.');
      setIsAddPermissionModalOpen(false);
      setSelectedPermissionId('');
      setSelectedDataScope('ALL');
      await loadData();
    } catch (err) {
      setModalError(err instanceof Error ? err.message : 'Failed to add permission to role.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemovePermission = async (permItem: RolePermissionItem) => {
    if (!id) return;
    if (isSuperAdmin) {
      toast.warning('Cannot remove permissions from a system protected Super Admin role.');
      return;
    }

    const permName = permItem.permission?.name || permItem.name || permItem.permissionId;
    const permCode = permItem.permission?.code || permItem.code || permName;

    const res = await confirm({
      tone: 'danger',
      title: `Remove "${permName}"?`,
      message: `Are you sure you want to revoke the "${permCode}" permission from role ${role?.name}?`,
      confirmLabel: 'Revoke Permission',
      consequence: 'Users with this role will immediately lose access to this capability.',
    });

    if (res.confirmed) {
      try {
        await rolesConnector.removeRolePermission(id, permItem.permissionId);
        toast.success(`Permission "${permCode}" removed.`);
        await loadData();
      } catch (err) {
        toast.danger(err instanceof Error ? err.message : 'Failed to remove permission.');
      }
    }
  };

  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    const list = Object.entries(bulkSelectedIds).map(([permissionId, dataScope]) => ({
      permissionId,
      dataScope,
    }));

    if (list.length === 0) {
      setModalError('At least one permission must be assigned to the role.');
      return;
    }

    setIsSubmitting(true);
    setModalError(null);
    try {
      await rolesConnector.replaceRolePermissions(id, { permissions: list });
      toast.success(`Updated role permissions (${list.length} active).`);
      setIsBulkModalOpen(false);
      await loadData();
    } catch (err) {
      setModalError(err instanceof Error ? err.message : 'Failed to replace role permissions.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const unassignedPermissions = useMemo(() => {
    const assignedIds = new Set(permissions.map((p) => p.permissionId));
    return allPermissions.filter((p) => !assignedIds.has(p.id));
  }, [allPermissions, permissions]);

  const overviewFields: DetailField[] = useMemo(() => {
    if (!role) return [];
    return [
      { label: 'Role Code', value: <span className="font-mono">{role.code}</span> },
      { label: 'Display Name', value: role.name },
      { label: 'Description', value: role.description || '-', span: 2 },
      {
        label: 'Protection Level',
        value: role.isSystem ? (
          <Badge variant="primary" size="sm">System Protected</Badge>
        ) : (
          <Badge variant="neutral" size="sm">Custom Role</Badge>
        ),
      },
      {
        label: 'Operational Status',
        value: (
          <Badge variant={role.status === 'ACTIVE' ? 'success' : 'neutral'} dot size="sm">
            {role.status}
          </Badge>
        ),
      },
      { label: 'Created At', value: formatDate(role.createdAt) },
      {
        label: 'Effective Permission Count',
        value: (
          <span className="font-semibold text-emerald-700">
            {permissions.length} capabilities assigned
          </span>
        ),
      },
    ];
  }, [role, permissions.length]);

  return (
    <>
      <DetailPage
        title={role?.name || 'Role Details'}
        subtitle={role ? `System Code: ${role.code}` : undefined}
        badge={role?.isSystem ? <Badge variant="primary">System Role</Badge> : <Badge variant="neutral">Custom</Badge>}
        onBack={() => navigate('/roles')}
        isLoading={isLoading}
        error={error}
        onRetry={loadData}
        fields={overviewFields}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="md"
              disabled={isSuperAdmin}
              onClick={() => {
                setModalError(null);
                setIsAddPermissionModalOpen(true);
              }}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add Permission
            </Button>
            <Button
              variant="primary"
              size="md"
              disabled={isSuperAdmin}
              onClick={() => {
                setModalError(null);
                setIsBulkModalOpen(true);
              }}
              leftIcon={<Layers className="w-4 h-4" />}
            >
              Configure All
            </Button>
          </div>
        }
      >
        <RolePermissionsTable
          permissions={permissions}
          isSuperAdmin={Boolean(isSuperAdmin)}
          onRemove={handleRemovePermission}
        />
      </DetailPage>

      <AddPermissionModal
        isOpen={isAddPermissionModalOpen}
        onClose={() => setIsAddPermissionModalOpen(false)}
        role={role}
        unassignedPermissions={unassignedPermissions}
        selectedPermissionId={selectedPermissionId}
        selectedDataScope={selectedDataScope}
        isSubmitting={isSubmitting}
        errorMessage={modalError}
        onPermissionChange={setSelectedPermissionId}
        onDataScopeChange={setSelectedDataScope}
        onSubmit={handleAddPermissionSubmit}
      />

      <BulkPermissionsModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        groupedPermissions={groupedPermissions}
        bulkSelectedIds={bulkSelectedIds}
        isSubmitting={isSubmitting}
        errorMessage={modalError}
        onToggleAllGroup={(group, allChecked) => {
          setBulkSelectedIds((prev) => {
            const next = { ...prev };
            if (allChecked) group.permissions.forEach((p) => delete next[p.id]);
            else group.permissions.forEach((p) => { if (!next[p.id]) next[p.id] = 'ALL'; });
            return next;
          });
        }}
        onTogglePermission={(permissionId, checked) => {
          setBulkSelectedIds((prev) => {
            const next = { ...prev };
            if (checked) next[permissionId] = 'ALL';
            else delete next[permissionId];
            return next;
          });
        }}
        onSubmit={handleBulkSubmit}
      />
    </>
  );
};
