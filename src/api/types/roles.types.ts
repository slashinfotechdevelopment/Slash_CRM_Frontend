export type RecordStatus = 'ACTIVE' | 'INACTIVE';
export type DataScope = 'ALL' | 'DEPARTMENT' | 'TEAM' | 'OWN';

export interface PermissionAssignmentItemDto {
  permissionId: string;
  dataScope?: DataScope;
}

export interface CreateRoleDto {
  code: string;
  name: string;
  description?: string;
  permissions?: PermissionAssignmentItemDto[];
}

export interface UpdateRoleDto {
  name?: string;
  description?: string;
  status?: RecordStatus;
}

export interface AssignPermissionsDto {
  permissions: PermissionAssignmentItemDto[];
}

export interface RoleQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  status?: RecordStatus;
  includeDeleted?: boolean;
}

export interface RoleItem {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  isSystem: boolean;
  status: RecordStatus;
  userCount?: number;
  permissionCount?: number;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RolePermissionItem {
  id?: string;
  roleId?: string;
  permissionId: string;
  dataScope: DataScope;
  code?: string;
  name?: string;
  module?: string;
  action?: string;
  assignedAt?: string;
  permission?: {
    id: string;
    code: string;
    name: string;
    module: string;
    action: string;
    description?: string | null;
  };
}

export interface RoleDetail extends RoleItem {
  permissions: RolePermissionItem[];
}

export interface CreatePermissionDto {
  code: string;
  name: string;
  module: string;
  action: string;
  description?: string;
}

export interface UpdatePermissionDto {
  name?: string;
  description?: string;
  status?: RecordStatus;
}

export interface PermissionQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  module?: string;
  status?: RecordStatus;
}

export interface PermissionItem {
  id: string;
  code: string;
  name: string;
  module: string;
  action: string;
  description?: string | null;
  status: RecordStatus;
  isSystem?: boolean;
  createdAt: string;
}

export interface PermissionGroup {
  module: string;
  permissions: PermissionItem[];
}

export interface CreateDepartmentDto {
  code: string;
  name: string;
  description?: string;
  parentId?: string;
  status?: RecordStatus;
}

export interface UpdateDepartmentDto {
  name?: string;
  description?: string;
  parentId?: string | null;
  status?: RecordStatus;
}

export interface QueryDepartmentsDto {
  page?: number;
  limit?: number;
  search?: string;
  status?: RecordStatus;
  parentId?: string;
}

export interface DepartmentItem {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  parentId?: string | null;
  parent?: {
    id: string;
    code: string;
    name: string;
  } | null;
  subDepartments?: DepartmentItem[];
  employeeCount?: number;
  status: RecordStatus;
  createdAt: string;
}
