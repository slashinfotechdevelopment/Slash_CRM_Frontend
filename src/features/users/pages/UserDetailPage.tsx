import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DetailPage, DetailField } from '@/components/templates/DetailPage';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Tabs } from '@/components/ui/Tabs';
import { useAuth } from '@/hooks/useAuth';
import {
  ShieldAlert,
  Building2,
  KeyRound,
  Edit2,
  Trash2,
  RotateCcw,
} from 'lucide-react';
import { formatDate } from '@/utils/formatters';
import { UserPermissionsTab } from '../components/UserPermissionsTab';
import { UserDepartmentsTab } from '../components/UserDepartmentsTab';
import { UserProfileTab } from '../components/UserProfileTab';
import { UserDetailModals } from '../components/UserDetailModals';
import { useUserDetail } from '../hooks/useUserDetail';

export const UserDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const {
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
  } = useUserDetail(id, navigate);

  const isSelf = currentUser?.id === user?.id;
  const isDeleted = !!user?.deletedAt;
  const isSuperAdmin = user?.roles?.some((r) => r.code === 'SUPER_ADMIN') ?? false;

  const fields: DetailField[] = user
    ? [
        { label: 'Employee ID / Code', value: user.userCode || '-' },
        { label: 'Full Legal Name', value: user.name },
        { label: 'Official Email', value: user.email },
        { label: 'Mobile Number', value: user.phone || '-' },
        { label: 'Job Designation', value: user.designation || '-' },
        {
          label: 'Account Category',
          value: (
            <span className="font-mono text-xs">
              {user.userType?.name || user.userType?.code || '-'}
            </span>
          ),
        },
        {
          label: 'Operational Status',
          value: (
            <Badge
              variant={
                isDeleted
                  ? 'danger'
                  : user.status === 'ACTIVE'
                  ? 'success'
                  : 'neutral'
              }
            >
              {isDeleted ? 'DEACTIVATED' : user.status}
            </Badge>
          ),
        },
        { label: 'Last Updated', value: formatDate(user.updatedAt) },
        { label: 'Created On', value: formatDate(user.createdAt) },
      ]
    : [];

  const tabDefs = [
    {
      id: 'permissions',
      label: 'Permissions & Roles',
      icon: <KeyRound className="w-4 h-4 mr-2" />,
    },
    {
      id: 'departments',
      label: `Departments (${user?.departments?.length || 0})`,
      icon: <Building2 className="w-4 h-4 mr-2" />,
    },
    {
      id: 'profile',
      label: 'Extended Profile',
      icon: <ShieldAlert className="w-4 h-4 mr-2" />,
    },
  ];

  return (
    <>
      <DetailPage
        title={user?.name || 'User Profile'}
        subtitle={`User Code: ${user?.userCode || ''} • Email: ${user?.email || ''}`}
        badge={
          user ? (
            <Badge
              variant={
                isDeleted
                  ? 'danger'
                  : user.status === 'ACTIVE'
                  ? 'success'
                  : 'neutral'
              }
            >
              {isDeleted ? 'DEACTIVATED' : user.status}
            </Badge>
          ) : undefined
        }
        onBack={() => navigate('/users')}
        isLoading={isLoading}
        error={error}
        onRetry={fetchUserData}
        fields={fields}
        actions={
          user && (
            <div className="flex flex-wrap items-center gap-2">
              {!isDeleted ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditModalOpen(true)}
                    className="flex items-center gap-1.5"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsStatusModalOpen(true)}
                    className="flex items-center gap-1.5"
                  >
                    <span>Change Status</span>
                  </Button>
                  {!isSuperAdmin && !isSelf && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={handleSoftDelete}
                      className="flex items-center gap-1.5"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Deactivate</span>
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleRestoreUser}
                    className="flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Restore Account</span>
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={handlePermanentDelete}
                    className="flex items-center gap-1.5"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Permanently Erase</span>
                  </Button>
                </>
              )}
            </div>
          )
        }
      >
        <div className="mt-6 space-y-6">
          <Tabs
            tabs={tabDefs}
            activeTab={activeTab}
            onChange={(tabId) => setActiveTab(tabId as 'permissions' | 'departments' | 'profile')}
          />
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            {activeTab === 'permissions' && (
              <UserPermissionsTab
                user={user}
                effectivePermsData={effectivePermsData}
                filteredPermissions={filteredPermissions}
                modulesList={modulesList}
                permSearch={permSearch}
                onPermSearchChange={setPermSearch}
                permModuleFilter={permModuleFilter}
                onPermModuleFilterChange={setPermModuleFilter}
                isSuperAdmin={isSuperAdmin}
                isDeleted={isDeleted}
                onOpenAddRole={() => setIsAddRoleModalOpen(true)}
                onOpenReplaceRoles={openReplaceRolesModal}
                onOpenPermissionsModal={openPermissionsModal}
                onRemoveRole={handleRemoveRole}
              />
            )}
            {activeTab === 'departments' && (
              <UserDepartmentsTab
                user={user}
                isDeleted={isDeleted}
                onOpenDepartmentsModal={openDepartmentsModal}
              />
            )}
            {activeTab === 'profile' && <UserProfileTab user={user} />}
          </div>
        </div>
      </DetailPage>

      <UserDetailModals {...modalsProps} />
    </>
  );
};
