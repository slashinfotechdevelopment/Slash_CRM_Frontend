import React from 'react';
import { UserEditStatusModals, UserEditStatusModalsProps } from './UserEditStatusModals';
import { UserRoleModals, UserRoleModalsProps } from './UserRoleModals';
import { UserDepartmentModals, UserDepartmentModalsProps } from './UserDepartmentModals';
import { UserPermissionModals, UserPermissionModalsProps } from './UserPermissionModals';

export type UserDetailModalsProps = UserEditStatusModalsProps &
  UserRoleModalsProps &
  UserDepartmentModalsProps &
  UserPermissionModalsProps;

export const UserDetailModals: React.FC<UserDetailModalsProps> = (props) => {
  return (
    <>
      <UserEditStatusModals {...props} />
      <UserRoleModals {...props} />
      <UserDepartmentModals {...props} />
      <UserPermissionModals {...props} />
    </>
  );
};
