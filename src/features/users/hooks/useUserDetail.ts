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
} from '@/api/types/users.types';
import { RoleItem, DepartmentItem, PermissionItem } from '@/api/types/roles.types';
import { getErrorMessage } from '@/api/client/errorMapper';
import { UserDetailModalsProps } from '../components/UserDetailModals';
import { useUserRoleActions } from './useUserRoleActions';
import { useUserDepartmentPermissionActions } from './useUserDepartmentPermissionActions';

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

  const [editForm, setEditForm] = useState<UpdateUserPayload>({ name: '', phone: '', designation: '' });
  const [statusForm, setStatusForm] = useState<UpdateUserStatusPayload>({ status: 'ACTIVE', reason: '' });

  const [activeTab, setActiveTab] = useState<'permissions' | 'departments' | 'profile'>('permissions');
  const [permSearch, setPermSearch] = useState('');
  const [permModuleFilter, setPermModuleFilter] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

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
      setError(getErrorMessage(err, 'Failed to load user details.'));
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const roleActions = useUserRoleActions(
    id,
    user,
    fetchUserData,
    setIsSubmitting,
    setFormError,
    confirm,
    toast
  );

  const deptPermActions = useUserDepartmentPermissionActions(
    id,
    user,
    effectivePermsData,
    availableDepartments,
    availablePermissions,
    fetchUserData,
    setIsSubmitting,
    setFormError,
    toast
  );

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
      setFormError(getErrorMessage(err, 'Failed to update user profile.'));
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
      setFormError(getErrorMessage(err, 'Failed to update status.'));
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
      toast.danger(getErrorMessage(err, 'Failed to deactivate user.'));
    }
  };

  const handleRestoreUser = async () => {
    if (!id) return;
    try {
      await usersConnector.restoreUser(id);
      toast.success('User account restored successfully.');
      fetchUserData();
    } catch (err) {
      toast.danger(getErrorMessage(err, 'Failed to restore user.'));
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
      toast.danger(getErrorMessage(err, 'Failed to delete user permanently.'));
    }
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
    isAddRoleModalOpen: roleActions.isAddRoleModalOpen,
    onCloseAddRole: () => !isSubmitting && roleActions.setIsAddRoleModalOpen(false),
    selectedRoleToAdd: roleActions.selectedRoleToAdd,
    setSelectedRoleToAdd: roleActions.setSelectedRoleToAdd,
    availableRoles,
    onAddRoleSubmit: roleActions.handleAddRoleSubmit,
    isReplaceRolesModalOpen: roleActions.isReplaceRolesModalOpen,
    onCloseReplaceRoles: () => !isSubmitting && roleActions.setIsReplaceRolesModalOpen(false),
    selectedRolesToReplace: roleActions.selectedRolesToReplace,
    setSelectedRolesToReplace: roleActions.setSelectedRolesToReplace,
    onReplaceRolesSubmit: roleActions.handleReplaceRolesSubmit,
    isDepartmentsModalOpen: deptPermActions.isDepartmentsModalOpen,
    onCloseDepartments: () => !isSubmitting && deptPermActions.setIsDepartmentsModalOpen(false),
    deptAssignments: deptPermActions.deptAssignments,
    setDeptAssignments: deptPermActions.setDeptAssignments,
    availableDepartments,
    onDepartmentsSubmit: deptPermActions.handleDepartmentsSubmit,
    isPermissionsModalOpen: deptPermActions.isPermissionsModalOpen,
    onClosePermissions: () => !isSubmitting && deptPermActions.setIsPermissionsModalOpen(false),
    permOverrides: deptPermActions.permOverrides,
    setPermOverrides: deptPermActions.setPermOverrides,
    newOverride: deptPermActions.newOverride,
    setNewOverride: deptPermActions.setNewOverride,
    availablePermissions,
    modalFilteredPerms: deptPermActions.modalFilteredPerms,
    overridePermSearch: deptPermActions.overridePermSearch,
    setOverridePermSearch: deptPermActions.setOverridePermSearch,
    onPermissionsSubmit: deptPermActions.handlePermissionsSubmit,
    onAddOverride: deptPermActions.handleAddOverride,
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
    openReplaceRolesModal: roleActions.openReplaceRolesModal,
    openDepartmentsModal: deptPermActions.openDepartmentsModal,
    openPermissionsModal: deptPermActions.openPermissionsModal,
    setIsEditModalOpen,
    setIsStatusModalOpen,
    setIsAddRoleModalOpen: roleActions.setIsAddRoleModalOpen,
    handleSoftDelete,
    handleRestoreUser,
    handlePermanentDelete,
    handleRemoveRole: roleActions.handleRemoveRole,
  };
}
