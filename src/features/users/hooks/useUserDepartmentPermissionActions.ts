import { useState, useMemo } from 'react';
import { useToast } from '@/hooks/useToast';
import { usersConnector } from '@/connectors/users.connector';
import {
  UserDetail,
  EffectivePermissionsResponse,
  UserPermissionOverrideItem,
} from '@/api/types/users.types';
import { DepartmentItem, PermissionItem } from '@/api/types/roles.types';
import { getErrorMessage } from '@/api/client/errorMapper';

export function useUserDepartmentPermissionActions(
  id: string | undefined,
  user: UserDetail | null,
  effectivePermsData: EffectivePermissionsResponse | null,
  availableDepartments: DepartmentItem[],
  availablePermissions: PermissionItem[],
  fetchUserData: () => Promise<void>,
  setIsSubmitting: (v: boolean) => void,
  setFormError: (v: string | null) => void,
  toast: ReturnType<typeof useToast>
) {
  const [isDepartmentsModalOpen, setIsDepartmentsModalOpen] = useState(false);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [deptAssignments, setDeptAssignments] = useState<{ id: string; isPrimary: boolean }[]>([]);
  const [permOverrides, setPermOverrides] = useState<UserPermissionOverrideItem[]>([]);
  const [newOverride, setNewOverride] = useState<UserPermissionOverrideItem>({
    permissionId: '',
    effect: 'ALLOW',
    dataScope: 'ALL',
    reason: '',
  });
  const [overridePermSearch, setOverridePermSearch] = useState('');

  const modalFilteredPerms = useMemo(() => {
    if (!overridePermSearch.trim()) return availablePermissions;
    const q = overridePermSearch.toLowerCase();
    return availablePermissions.filter(
      (p) => p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q)
    );
  }, [availablePermissions, overridePermSearch]);

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
      setFormError(getErrorMessage(err, 'Failed to update departments.'));
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
      setFormError(getErrorMessage(err, 'Failed to save permission overrides.'));
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

  return {
    isDepartmentsModalOpen,
    setIsDepartmentsModalOpen,
    isPermissionsModalOpen,
    setIsPermissionsModalOpen,
    deptAssignments,
    setDeptAssignments,
    permOverrides,
    setPermOverrides,
    newOverride,
    setNewOverride,
    overridePermSearch,
    setOverridePermSearch,
    modalFilteredPerms,
    openDepartmentsModal,
    handleDepartmentsSubmit,
    openPermissionsModal,
    handlePermissionsSubmit,
    handleAddOverride,
  };
}
