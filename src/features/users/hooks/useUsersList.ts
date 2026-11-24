import { getErrorMessage } from '@/api/client/errorMapper';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useToast } from '@/hooks/useToast';
import { useConfirm } from '@/hooks/useConfirm';
import { useAuth } from '@/hooks/useAuth';
import { useInfiniteList } from '@/hooks/useInfiniteList';
import { usersConnector } from '@/connectors/users.connector';
import { rolesConnector } from '@/connectors/roles.connector';
import {
  UserItem,
  UserStatus,
  CreateUserPayload,
  UpdateUserPayload,
  UpdateUserStatusPayload,
} from '@/api/types/users.types';
import { RoleItem, DepartmentItem } from '@/api/types/roles.types';

export function useUsersList() {
  const toast = useToast();
  const confirm = useConfirm();
  const { user: currentUser } = useAuth();

  // Search & Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [userTypeFilter, setUserTypeFilter] = useState<string>('');
  const [onlyDeleted, setOnlyDeleted] = useState(false);

  // Available roles & departments for modal options
  const [availableRoles, setAvailableRoles] = useState<RoleItem[]>([]);
  const [availableDepartments, setAvailableDepartments] = useState<DepartmentItem[]>([]);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);

  // Forms state
  const [createForm, setCreateForm] = useState<CreateUserPayload>({
    userType: 'EMPLOYEE',
    name: '',
    email: '',
    phone: '',
    roles: [],
    departments: [],
  });

  const [editForm, setEditForm] = useState<UpdateUserPayload>({
    name: '',
    phone: '',
    designation: '',
  });

  const [statusForm, setStatusForm] = useState<UpdateUserStatusPayload>({
    status: 'ACTIVE',
    reason: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Load available roles and departments on mount
  useEffect(() => {
    let isMounted = true;
    const fetchOptions = async () => {
      try {
        const [rolesRes, deptsRes] = await Promise.all([
          rolesConnector.getRoles({ limit: 100, status: 'ACTIVE' }),
          rolesConnector.getDepartments({ limit: 100, status: 'ACTIVE' }),
        ]);
        if (isMounted) {
          setAvailableRoles(rolesRes.items || []);
          setAvailableDepartments(deptsRes.items || []);
        }
      } catch (err) {
        console.error('Failed to load role/dept options', err);
      }
    };
    fetchOptions();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter params for infinite list
  const filters = useMemo(
    () => ({
      search: search.trim() || undefined,
      status: (statusFilter as UserStatus) || undefined,
      userType: userTypeFilter || undefined,
      onlyDeleted,
    }),
    [search, statusFilter, userTypeFilter, onlyDeleted]
  );

  // GET /api/users
  const { items, total, isLoading, isLoadingMore, hasMore, error, loadMore, refresh } = useInfiniteList<
    UserItem,
    typeof filters
  >({
    queryFn: (params) => usersConnector.getUsers(params),
    filters,
  });

  // Handle Create User
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const name = createForm.name.trim();
    const email = createForm.email.trim();
    const phone = createForm.phone?.trim();

    if (!name || name.length < 2) {
      setFormError('Full name must be at least 2 characters long.');
      return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormError('Please enter a valid corporate or personal email address.');
      return;
    }
    if (phone && !/^\+91[6-9]\d{9}$/.test(phone)) {
      setFormError('Phone number must start with +91 followed by 10 digits (e.g. +919876543210).');
      return;
    }

    try {
      setIsSubmitting(true);
      const customProfile = (createForm as unknown as Record<string, unknown>).designation
        ? { designation: String((createForm as unknown as Record<string, unknown>).designation).trim() }
        : createForm.profile;

      const payload: CreateUserPayload = {
        userType: createForm.userType,
        name,
        email,
        phone: phone || undefined,
        roles: createForm.roles && createForm.roles.length > 0 ? createForm.roles : undefined,
        departments: createForm.departments && createForm.departments.length > 0 ? createForm.departments : undefined,
        profile:
          createForm.userType === 'EMPLOYEE'
            ? customProfile || { designation: 'Employee' }
            : undefined,
      };

      await usersConnector.createUser(payload);

      toast.success('User account created successfully! Verification email dispatched.');
      setIsCreateModalOpen(false);
      setCreateForm({
        userType: 'EMPLOYEE',
        name: '',
        email: '',
        phone: '',
        roles: [],
        departments: [],
      });
      refresh();
    } catch (err: unknown) {
      setFormError(getErrorMessage(err, 'Failed to create user account.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Edit User Modal
  const openEditModal = (user: UserItem) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name,
      phone: user.phone || '',
      designation: user.designation || '',
    });
    setFormError(null);
    setIsEditModalOpen(true);
  };

  // Handle Edit User
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setFormError(null);

    const name = editForm.name?.trim();
    const phone = editForm.phone?.trim();

    if (!name || name.length < 2) {
      setFormError('Full name must be at least 2 characters long.');
      return;
    }
    if (phone && !/^\+91[6-9]\d{9}$/.test(phone)) {
      setFormError('Phone number must start with +91 followed by 10 digits.');
      return;
    }

    try {
      setIsSubmitting(true);
      await usersConnector.updateUser(selectedUser.id, {
        name,
        phone: phone || undefined,
        designation: editForm.designation?.trim() || undefined,
      });

      toast.success('User details updated successfully.');
      setIsEditModalOpen(false);
      refresh();
    } catch (err: unknown) {
      setFormError(getErrorMessage(err, 'Failed to update user profile.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Status Modal
  const openStatusModal = (user: UserItem) => {
    setSelectedUser(user);
    setStatusForm({
      status: user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE',
      reason: '',
    });
    setFormError(null);
    setIsStatusModalOpen(true);
  };

  // Handle Status Change
  const handleStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setFormError(null);

    if (
      statusForm.status === 'INACTIVE' &&
      (!statusForm.reason || statusForm.reason.trim().length < 5)
    ) {
      setFormError('A justification of at least 5 characters is required to deactivate an account.');
      return;
    }

    try {
      setIsSubmitting(true);
      await usersConnector.updateUserStatus(selectedUser.id, {
        status: statusForm.status,
        reason: statusForm.reason?.trim() || undefined,
      });

      toast.success(`Account status transitioned to ${statusForm.status}.`);
      setIsStatusModalOpen(false);
      refresh();
    } catch (err: unknown) {
      setFormError(getErrorMessage(err, 'Failed to transition user account status.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Deactivate / Delete User
  const handleDeleteUser = useCallback(
    async (user: UserItem) => {
      const confirmed = await confirm({
        tone: 'danger',
        title: 'Deactivate User Account?',
        message: `Are you sure you want to soft-delete the account for ${user.name} (${user.userCode})? They will lose access immediately.`,
        confirmLabel: 'Deactivate Account',
      });

      if (!confirmed) return;

      try {
        await usersConnector.deleteUser(user.id);
        toast.success(`User ${user.name} has been deactivated.`);
        refresh();
      } catch (err: unknown) {
        toast.danger(getErrorMessage(err, 'Failed to deactivate user.'));
      }
    },
    [confirm, toast, refresh]
  );

  // Handle Restore User
  const handleRestoreUser = useCallback(
    async (user: UserItem) => {
      const confirmed = await confirm({
        tone: 'info',
        title: 'Restore User Account?',
        message: `Restore access for ${user.name} (${user.userCode})?`,
        confirmLabel: 'Restore Account',
      });

      if (!confirmed) return;

      try {
        await usersConnector.restoreUser(user.id);
        toast.success(`User ${user.name} restored successfully.`);
        refresh();
      } catch (err: unknown) {
        toast.danger(getErrorMessage(err, 'Failed to restore user.'));
      }
    },
    [confirm, toast, refresh]
  );

  const isCurrentSuperAdmin = Boolean(
    currentUser?.roles?.some(
      (r) => r.code === 'SUPER_ADMIN'
    ) || currentUser?.role === 'SUPER_ADMIN'
  );

  return {
    // Search & Filters
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    userTypeFilter,
    setUserTypeFilter,
    onlyDeleted,
    setOnlyDeleted,

    // Infinite list
    items,
    total,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    loadMore,
    refresh,

    // Metadata
    availableRoles,
    availableDepartments,

    // Modals & Forms
    isCreateModalOpen,
    setIsCreateModalOpen,
    createForm,
    setCreateForm,
    handleCreateSubmit,

    isEditModalOpen,
    setIsEditModalOpen,
    selectedUser,
    editForm,
    setEditForm,
    openEditModal,
    handleEditSubmit,

    isStatusModalOpen,
    setIsStatusModalOpen,
    statusForm,
    setStatusForm,
    openStatusModal,
    handleStatusSubmit,

    handleDeleteUser,
    handleRestoreUser,

    isSubmitting,
    formError,
    currentUser,
    isCurrentSuperAdmin,
  };
}
