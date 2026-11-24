export interface UserPaginationMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
}

export type UserStatus = 'ACTIVE' | 'INACTIVE';
export type UserTypeCode = 'SUPER_ADMIN' | 'ADMIN' | 'EMPLOYEE' | 'CLIENT';
export type CreatableUserType = 'ADMIN' | 'EMPLOYEE' | 'CLIENT';
export type DataScopeType = 'OWN' | 'ASSIGNED' | 'DEPARTMENT' | 'ALL';
export type PermissionEffectType = 'ALLOW' | 'DENY';

export interface UserRoleRef {
  id: string;
  code: string;
  name: string;
  description?: string;
  isSystem?: boolean;
}

export interface UserDepartmentRef {
  id: string;
  code: string;
  name: string;
  description?: string;
  isPrimary: boolean;
}

export interface UserProfileMedia {
  id: string;
  fileUrl: string;
  originalName: string;
  mimeType: string;
}

export interface UserItem {
  id: string;
  userCode: string;
  name: string;
  email: string;
  phone: string | null;
  designation: string | null;
  userType: {
    id?: string;
    code: string;
    name: string;
  };
  status: UserStatus;
  emailVerified: boolean;
  deletedAt: string | null;
  profileMedia: UserProfileMedia | null;
  roles: UserRoleRef[];
  departments: UserDepartmentRef[];
  createdAt: string;
}

export interface UserDetail extends UserItem {
  profile: Record<string, unknown> | null;
  effectivePermissions?: string[];
  updatedAt: string;
}

export interface CreateUserPayload {
  userType: CreatableUserType;
  name: string;
  email: string;
  phone?: string;
  designation?: string;
  roles?: string[];
  departments?: string[];
  profile?: Record<string, unknown>;
}

export interface UpdateUserPayload {
  name?: string;
  phone?: string;
  designation?: string;
  profileMediaId?: string;
  profile?: Record<string, unknown>;
}

export interface UpdateUserStatusPayload {
  status: UserStatus;
  reason?: string;
}

export interface AssignUserRolesPayload {
  roles: string[];
}

export interface UserDepartmentItemDto {
  code: string;
  isPrimary?: boolean;
}

export interface AssignUserDepartmentsPayload {
  departments: UserDepartmentItemDto[];
}

export interface UserPermissionOverrideItem {
  permissionId?: string;
  code?: string;
  effect: PermissionEffectType;
  dataScope?: DataScopeType;
  reason?: string;
}

export interface AssignUserPermissionsPayload {
  permissions: UserPermissionOverrideItem[];
}

export interface EffectivePermissionItem {
  code: string;
  name: string;
  module: string;
  action: string;
  effect: PermissionEffectType;
  dataScope: DataScopeType | null;
  source: 'SYSTEM' | 'ROLE' | 'USER_OVERRIDE';
  reason?: string | null;
}

export interface EffectivePermissionsResponse {
  userId: string;
  userCode: string;
  roles: string[];
  permissions: EffectivePermissionItem[];
}

export interface UserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  userType?: string;
  role?: string;
  department?: string;
  status?: UserStatus;
  emailVerified?: boolean;
  onlyDeleted?: boolean;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface UsersListResponse {
  items: UserItem[];
  pagination: UserPaginationMeta;
}
