import { useState } from 'react';
import { useConfirm } from '@/hooks/useConfirm';
import { useToast } from '@/hooks/useToast';
import { usersConnector } from '@/connectors/users.connector';
import { UserDetail } from '@/api/types/users.types';
import { getErrorMessage } from '@/api/client/errorMapper';

export function useUserRoleActions(
  id: string | undefined,
  user: UserDetail | null,
  fetchUserData: () => Promise<void>,
  setIsSubmitting: (v: boolean) => void,
  setFormError: (v: string | null) => void,
  confirm: ReturnType<typeof useConfirm>,
  toast: ReturnType<typeof useToast>
) {
  const [isAddRoleModalOpen, setIsAddRoleModalOpen] = useState(false);
  const [isReplaceRolesModalOpen, setIsReplaceRolesModalOpen] = useState(false);
  const [selectedRoleToAdd, setSelectedRoleToAdd] = useState('');
  const [selectedRolesToReplace, setSelectedRolesToReplace] = useState<string[]>([]);

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
      toast.danger(getErrorMessage(err, 'Failed to remove role.'));
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
      setFormError(getErrorMessage(err, 'Failed to add role.'));
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
      setFormError(getErrorMessage(err, 'Failed to replace roles.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const openReplaceRolesModal = () => {
    setSelectedRolesToReplace(user?.roles?.map((r) => r.id) || []);
    setFormError(null);
    setIsReplaceRolesModalOpen(true);
  };

  return {
    isAddRoleModalOpen,
    setIsAddRoleModalOpen,
    isReplaceRolesModalOpen,
    setIsReplaceRolesModalOpen,
    selectedRoleToAdd,
    setSelectedRoleToAdd,
    selectedRolesToReplace,
    setSelectedRolesToReplace,
    handleRemoveRole,
    handleAddRoleSubmit,
    handleReplaceRolesSubmit,
    openReplaceRolesModal,
  };
}
