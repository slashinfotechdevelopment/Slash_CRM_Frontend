import React, { useMemo } from 'react';
import { ListPage } from '@/components/templates/ListPage';
import { FilterSelectConfig } from '@/components/templates/FilterBar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { UserItem } from '@/api/types/users.types';
import { Plus } from 'lucide-react';
import { useUsersList } from '../hooks/useUsersList';
import { useUserColumns } from '../components/useUserColumns';
import { UserListModals } from '../components/UserListModals';

export const UsersListPage: React.FC = () => {
  const {
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    userTypeFilter,
    setUserTypeFilter,
    onlyDeleted,
    setOnlyDeleted,
    items,
    total,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    loadMore,
    refresh,
    availableRoles,
    availableDepartments,
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
  } = useUsersList();

  const columns = useUserColumns({
    isCurrentSuperAdmin,
    currentUserId: currentUser?.id,
    onOpenEdit: openEditModal,
    onOpenStatus: openStatusModal,
    onDelete: handleDeleteUser,
    onRestore: handleRestoreUser,
  });

  const filterConfigs: FilterSelectConfig[] = useMemo(
    () => [
      {
        key: 'status',
        label: 'Status',
        value: statusFilter,
        options: [
          { value: '', label: 'All account statuses' },
          { value: 'ACTIVE', label: 'Active Only' },
          { value: 'INACTIVE', label: 'Inactive / Suspended' },
        ],
      },
      {
        key: 'userType',
        label: 'Account Type',
        value: userTypeFilter,
        options: [
          { value: '', label: 'All account types' },
          { value: 'EMPLOYEE', label: 'Employees' },
          { value: 'ADMIN', label: 'Admins' },
          { value: 'CLIENT', label: 'Clients' },
        ],
      },
    ],
    [statusFilter, userTypeFilter]
  );

  const handleFilterChange = (key: string, val: string | number) => {
    if (key === 'status') {
      setStatusFilter(String(val));
    } else if (key === 'userType') {
      setUserTypeFilter(String(val));
    }
  };

  return (
    <>
      <ListPage<UserItem>
        title="Personnel & User Accounts"
        description="Manage employees, system administrators, and client stakeholder accounts across all branches."
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by full name, work email, phone, or code..."
        filters={filterConfigs}
        onFilterChange={handleFilterChange}
        filterActions={
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-600 bg-white px-3 py-2 border border-slate-200 rounded-lg shadow-2xs hover:bg-slate-50 transition-colors">
            <Input
              type="checkbox"
              className="w-4 h-4 text-brand-primary rounded border-slate-300"
              checked={onlyDeleted}
              onChange={(e) => setOnlyDeleted(e.target.checked)}
            />
            <span>Archived accounts</span>
          </label>
        }
        headerActions={
          isCurrentSuperAdmin ? (
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setIsCreateModalOpen(true)}
            >
              Add User Account
            </Button>
          ) : undefined
        }
        columns={columns}
        items={items}
        total={total}
        isLoading={isLoading}
        isLoadingMore={isLoadingMore}
        hasMore={hasMore}
        onLoadMore={loadMore}
        error={error}
        onRetry={refresh}
      />

      <UserListModals
        isCreateModalOpen={isCreateModalOpen}
        onCloseCreate={() => setIsCreateModalOpen(false)}
        createForm={createForm}
        setCreateForm={setCreateForm}
        onCreateSubmit={handleCreateSubmit}
        isEditModalOpen={isEditModalOpen}
        onCloseEdit={() => setIsEditModalOpen(false)}
        selectedUser={selectedUser}
        editForm={editForm}
        setEditForm={setEditForm}
        onEditSubmit={handleEditSubmit}
        isStatusModalOpen={isStatusModalOpen}
        onCloseStatus={() => setIsStatusModalOpen(false)}
        statusForm={statusForm}
        setStatusForm={setStatusForm}
        onStatusSubmit={handleStatusSubmit}
        availableRoles={availableRoles}
        availableDepartments={availableDepartments}
        isSubmitting={isSubmitting}
        formError={formError}
      />
    </>
  );
};
