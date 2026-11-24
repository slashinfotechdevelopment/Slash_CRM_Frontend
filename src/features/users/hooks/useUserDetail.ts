import { useState, useEffect, useCallback, useMemo } from 'react';
import { NavigateFunction } from 'react-router-dom';
import { useConfirm } from '@/hooks/useConfirm';
import { useToast } from '@/hooks/useToast';
import { usersConnector } from '@/connectors/users.connector';
import { rolesConnector } from '@/connectors/roles.connector';
import {
  UserDetail,
  UpdateUserPayload,
  UpdateUserStatusPayload,
  EffectivePermissionsResponse,
  UserPermissionOverrideItem,
} from '@/api/types/users.types';
import { RoleItem, DepartmentItem, PermissionItem } from '@/api/types/roles.types';
import { UserDetailModalsProps } from '../components/UserDetailModals';

export function useUserDetail(id: string | undefined, navigate: NavigateFunction) {
  const confirm = useConfirm();
  const toast = useToast();

  const [user, setUser] = useState<UserDetail | null>(null);
  const [effectivePermsData, setEffectivePermsData] = useState<EffectivePermissionsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [availableRoles, setAvailableRoles] = useState<RoleItem[]>([]);
  const [availableDepartments, setAvailableDepartments] = useState<DepartmentItem[]>([]);
  const [availablePermissions, setAvailablePermissions] = useState<PermissionItem[]>([]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isAddRoleModalOpen, setIsAddRoleModalOpen] = useState(false);
  const [isReplaceRolesModalOpen, setIsReplaceRolesModalOpen] = useState(false);
  const [isDepartmentsModalOpen, setIsDepartmentsModalOpen] = useState(false);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);

  const [editForm, setEditForm] = useState<UpdateUserPayload>({ name: '', phone: '', designation: '' });
  const [statusForm, setStatusForm] = useState<UpdateUserStatusPayload>({ status: 'ACTIVE', reason: '' });
  const [selectedRoleToAdd, setSelectedRoleToAdd] = useState<string>('');
  const [selectedRolesToReplace, setSelectedRolesToReplace] = useState<string[]>([]);
  const [deptAssignments, setDeptAssignments] = useState<{ id: string; isPrimary: boolean }[]>([]);
  const [permOverrides, setPermOverrides] = useState<UserPermissionOverrideItem[]>([]);
  const [newOverride, setNewOverride] = useState<UserPermissionOverrideItem>({
    permissionId: '',
    effect: 'ALLOW',
    dataScope: 'ALL',
    reason: '',
  });

  const [activeTab, setActiveTab] = useState<'permissions' | 'departments' | 'profile'>('permissions');
  const [permSearch, setPermSearch] = useState('');
  const [permModuleFilter, setPermModuleFilter] = useState('');
  const [overridePermSearch, setOverridePermSearch] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const modalFilteredPerms = useMemo(() => {
    if (!overridePermSearch.trim()) return availablePermissions;
    const q = overridePermSearch.toLowerCase();
    return availablePermissions.filter(
      (p) => p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q)
    );
  }, [availablePermissions, overridePermSearch]);

  const fetchUserData = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const userData = await usersConnector.getUser(id);
      setUser(userData);
      setEditForm({
        name: userData.name,
        phone: userData.phone || '',
        designation: userData.designation || '',
      });
      setStatusForm({ status: userData.status, reason: '' });

      const [permsRes, rolesRes, deptsRes, allPermsRes] = await Promise.allSettled([
        usersConnector.getEffectivePermissions(id),
        rolesConnector.getRoles({ limit: 100 }),
        rolesConnector.getDepartments({ limit: 100 }),
        rolesConnector.getPermissions({ limit: 300 }),
      ]);

      if (permsRes.status === 'fulfilled') setEffectivePermsData(permsRes.value);
      if (rolesRes.status === 'fulfilled') setAvailableRoles(rolesRes.value.items || []);
      if (deptsRes.status === 'fulfilled') setAvailableDepartments(deptsRes.value.items || []);
      if (allPermsRes.status === 'fulfilled') setAvailablePermissions(allPermsRes.value.items || []);
    } catch (err) {
      setError(err.message || 'Failed to load user details.');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setIsSubmitting(true);
    setFormError(null);
    try {
      await usersConnector.updateUser(id, editForm);
      toast.success('User profile updated successfully.');
      setIsEditModalOpen(false);
      fetchUserData();
    } catch (err) {
      setFormError(err.message || 'Failed to update user profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setIsSubmitting(true);
    setFormError(null);
    try {
      await usersConnector.updateUserStatus(id, statusForm);
      toast.success(`User status changed to ${statusForm.status}.`);
      setIsStatusModalOpen(false);
      fetchUserData();
    } catch (err) {
      setFormError(err.message || 'Failed to update status.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSoftDelete = async () => {
    if (!id || !user) return;
    const isSuperAdmin = user.roles?.some((r) => r.code === 'SUPER_ADMIN');
    if (isSuperAdmin) {
      toast.danger('SUPER_ADMIN accounts cannot be deactivated or deleted.');
      return;
    }
    const result = await confirm({
      title: 'Deactivate User Account?',
      message: `Deactivate ${user.name} (${user.userCode})? The user will immediately lose system access.`,
      confirmLabel: 'Deactivate Account',
      tone: 'danger',
    });
    if (!result.confirmed) return;
    try {
      await usersConnector.deleteUser(id);
      toast.success('User deactivated successfully.');
      fetchUserData();
    } catch (err) {
      toast.danger(err.message || 'Failed to deactivate user.');
    }
  };

  const handleRestoreUser = async () => {
    if (!id) return;
    try {
      await usersConnector.restoreUser(id);
      toast.success('User account restored successfully.');
      fetchUserData();
    } catch (err) {
      toast.danger(err.message || 'Failed to restore user.');
    }
  };

  const handlePermanentDelete = async () => {
    if (!id || !user) return;
    const result = await confirm({
      title: 'Permanently Erase User?',
      message: `CRITICAL ACTION: This permanently erases ${user.name}.`,
      confirmLabel: 'Permanently Erase',
      tone: 'danger',
    });
    if (!result.confirmed) return;
    try {
      await usersConnector.deleteUser(id);
      toast.success('User permanently deleted.');
      navigate('/users');
    } catch (err) {
      toast.danger(err.message || 'Failed to delete user permanently.');
    }
  };

  const handleRemoveRole = async (roleId: string, roleName: string) => {
    if (!id) return;
    const result = await confirm({
      title: `Remove Role: ${roleName}?`,
      message: `Are you sure you want to revoke the role "${roleName}" from this user?`,
      confirmLabel: 'Revoke Role',
      tone: 'danger',
    });
    if (!result.confirmed) return;
    try {
      await usersConnector.removeUserRole(id, roleId);
      toast.success(`Role ${roleName} removed.`);
      fetchUserData();
    } catch (err) {
      toast.danger(err.message || 'Failed to remove role.');
    }
  };

  const handleAddRoleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !selectedRoleToAdd) return;
    setIsSubmitting(true);
    setFormError(null);
    try {
      await usersConnector.addUserRoles(id, { roles: [selectedRoleToAdd] });
      toast.success('Role added successfully.');
      setIsAddRoleModalOpen(false);
      setSelectedRoleToAdd('');
      fetchUserData();
    } catch (err) {
      setFormError(err.message || 'Failed to add role.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReplaceRolesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setIsSubmitting(true);
    setFormError(null);
    try {
      await usersConnector.replaceUserRoles(id, { roles: selectedRolesToReplace });
      toast.success('User role assignments replaced successfully.');
      setIsReplaceRolesModalOpen(false);
      fetchUserData();
    } catch (err) {
      setFormError(err.message || 'Failed to replace roles.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openReplaceRolesModal = () => {
    setSelectedRolesToReplace(user?.roles?.map((r) => r.id) || []);
    setFormError(null);
    setIsReplaceRolesModalOpen(true);
  };

  const openDepartmentsModal = () => {
    setDeptAssignments(
      user?.departments?.map((d) => ({
        id: d.id,
        isPrimary: !!d.isPrimary,
      })) || []
    );
    setFormError(null);
    setIsDepartmentsModalOpen(true);
  };

  const handleDepartmentsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    if (deptAssignments.length > 0 && !deptAssignments.some((d) => d.isPrimary)) {
      setFormError('Exactly one assigned department must be designated as the Primary Department.');
      return;
    }
    setIsSubmitting(true);
    setFormError(null);
    try {
      const payload = {
        departments: deptAssignments.map((d) => {
          const match = availableDepartments.find((ad) => ad.id === d.id);
          return {
            code: match?.code || '',
            isPrimary: d.isPrimary,
          };
        }),
      };
      await usersConnector.replaceUserDepartments(id, payload);
      toast.success('Department assignments updated.');
      setIsDepartmentsModalOpen(false);
      fetchUserData();
    } catch (err) {
      setFormError(err.message || 'Failed to update departments.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openPermissionsModal = () => {
    const userOverrides = (effectivePermsData?.permissions || []).filter(
      (p) => p.source === 'USER_OVERRIDE'
    );
    setPermOverrides(
      userOverrides.map((o) => ({
        code: o.code,
        effect: o.effect,
        dataScope: o.dataScope || 'ALL',
        reason: o.reason || '',
      }))
    );
    setNewOverride({
      permissionId: '',
      effect: 'ALLOW',
      dataScope: 'ALL',
      reason: '',
    });
    setOverridePermSearch('');
    setFormError(null);
    setIsPermissionsModalOpen(true);
  };

  const handlePermissionsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setIsSubmitting(true);
    setFormError(null);
    try {
      const cleanPayload = permOverrides.map((o) => ({
        permissionId: o.permissionId,
        code: o.code,
        effect: o.effect,
        dataScope: o.dataScope,
        reason: o.reason || undefined,
      }));
      await usersConnector.replaceUserPermissions(id, { permissions: cleanPayload });
      toast.success('Permission overrides updated.');
      setIsPermissionsModalOpen(false);
      fetchUserData();
    } catch (err) {
      setFormError(err.message || 'Failed to save permission overrides.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddOverride = () => {
    if (!newOverride.permissionId && !newOverride.code) {
      toast.danger('Please select a permission to override.');
      return;
    }
    const codeOrId = newOverride.code || newOverride.permissionId;
    if (permOverrides.some((o) => o.code === codeOrId || o.permissionId === codeOrId)) {
      toast.danger('An override for this permission is already in the list.');
      return;
    }
    setPermOverrides((prev) => [...prev, { ...newOverride }]);
    setNewOverride({
      permissionId: '',
      effect: 'ALLOW',
      dataScope: 'ALL',
      reason: '',
    });
  };

  // Modules list & filtered permissions
  const modulesList = useMemo(() => {
    const set = new Set<string>();
    effectivePermsData?.permissions?.forEach((p) => {
      if (p.module) set.add(p.module);
    });
    return Array.from(set).sort();
  }, [effectivePermsData]);

  const filteredPermissions = useMemo(() => {
    if (!effectivePermsData?.permissions) return [];
    return effectivePermsData.permissions.filter((p) => {
      const matchesSearch =
        !permSearch.trim() ||
        p.name.toLowerCase().includes(permSearch.toLowerCase()) ||
        p.code.toLowerCase().includes(permSearch.toLowerCase());
      const matchesModule = !permModuleFilter || p.module === permModuleFilter;
      return matchesSearch && matchesModule;
    });
  }, [effectivePermsData, permSearch, permModuleFilter]);

  const modalsProps: UserDetailModalsProps = {
    user,
    formError,
    isSubmitting,
    isEditModalOpen,
    onCloseEdit: () => !isSubmitting && setIsEditModalOpen(false),
    editForm,
    setEditForm,
    onEditSubmit: handleEditSubmit,
    isStatusModalOpen,
    onCloseStatus: () => !isSubmitting && setIsStatusModalOpen(false),
    statusForm,
    setStatusForm,
    onStatusSubmit: handleStatusSubmit,
    isAddRoleModalOpen,
    onCloseAddRole: () => !isSubmitting && setIsAddRoleModalOpen(false),
    selectedRoleToAdd,
    setSelectedRoleToAdd,
    availableRoles,
    onAddRoleSubmit: handleAddRoleSubmit,
    isReplaceRolesModalOpen,
    onCloseReplaceRoles: () => !isSubmitting && setIsReplaceRolesModalOpen(false),
    selectedRolesToReplace,
    setSelectedRolesToReplace,
    onReplaceRolesSubmit: handleReplaceRolesSubmit,
    isDepartmentsModalOpen,
    onCloseDepartments: () => !isSubmitting && setIsDepartmentsModalOpen(false),
    deptAssignments,
    setDeptAssignments,
    availableDepartments,
    onDepartmentsSubmit: handleDepartmentsSubmit,
    isPermissionsModalOpen,
    onClosePermissions: () => !isSubmitting && setIsPermissionsModalOpen(false),
    permOverrides,
    setPermOverrides,
    newOverride,
    setNewOverride,
    availablePermissions,
    modalFilteredPerms,
    overridePermSearch,
    setOverridePermSearch,
    onPermissionsSubmit: handlePermissionsSubmit,
    onAddOverride: handleAddOverride,
  };

  return {
    user,
    effectivePermsData,
    isLoading,
    error,
    fetchUserData,
    activeTab,
    setActiveTab,
    permSearch,
    setPermSearch,
    permModuleFilter,
    setPermModuleFilter,
    modulesList,
    filteredPermissions,
    modalsProps,
    openReplaceRolesModal,
    openDepartmentsModal,
    openPermissionsModal,
    setIsEditModalOpen,
    setIsStatusModalOpen,
    setIsAddRoleModalOpen,
    handleSoftDelete,
    handleRestoreUser,
    handlePermanentDelete,
    handleRemoveRole,
  };
}
