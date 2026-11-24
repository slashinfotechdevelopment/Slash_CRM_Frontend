import { httpClient } from '@/api/client/httpClient';
import { ROLES_ENDPOINTS } from '@/api/endpoints/roles.endpoints';
import {
  RoleItem,
  RoleDetail,
  CreateRoleDto,
  UpdateRoleDto,
  AssignPermissionsDto,
  PermissionAssignmentItemDto,
  RoleQueryDto,
  RolePermissionItem,
  PermissionItem,
  PermissionGroup,
  CreatePermissionDto,
  UpdatePermissionDto,
  PermissionQueryDto,
  DepartmentItem,
  CreateDepartmentDto,
  UpdateDepartmentDto,
  QueryDepartmentsDto,
} from '@/api/types/roles.types';
import { ApiResponse } from '@/api/types/api.types';
import { extractData, extractPaginated } from '@/api/client/responseUnwrap';


export const rolesConnector = {
  // -------------------------------------------------------------
  // ROLES APIS
  // -------------------------------------------------------------

  /** GET /api/roles */
  async getRoles(query?: RoleQueryDto): Promise<{ items: RoleItem[]; total: number; hasMore: boolean }> {
    const res = await httpClient.get<ApiResponse<RoleItem[] | { items: RoleItem[]; total?: number; pagination?: unknown }>>(
      ROLES_ENDPOINTS.ROLES,
      { params: query }
    );
    const paginated = extractPaginated<RoleItem & { _count?: { permissions?: number; users?: number } }>(
      res.data,
      query?.limit || 20,
      query?.page || 1
    );
    const items: RoleItem[] = paginated.items.map((r) => ({
      ...r,
      permissionCount: r.permissionCount ?? r._count?.permissions ?? 0,
      userCount: r.userCount ?? r._count?.users ?? 0,
    }));
    return {
      ...paginated,
      items,
    };
  },

  /** GET /api/roles/:id */
  async getRole(id: string): Promise<RoleDetail> {
    const res = await httpClient.get<ApiResponse<RoleDetail>>(ROLES_ENDPOINTS.ROLE_BY_ID(id));
    return extractData(res);
  },

  /** POST /api/roles */
  async createRole(dto: CreateRoleDto): Promise<RoleItem> {
    const res = await httpClient.post<ApiResponse<RoleItem>>(ROLES_ENDPOINTS.ROLES, dto);
    return extractData(res);
  },

  /** PATCH /api/roles/:id */
  async updateRole(id: string, dto: UpdateRoleDto): Promise<RoleItem> {
    const res = await httpClient.patch<ApiResponse<RoleItem>>(ROLES_ENDPOINTS.ROLE_BY_ID(id), dto);
    return extractData(res);
  },

  /** DELETE /api/roles/:id */
  async deleteRole(id: string): Promise<{ success: boolean; message: string }> {
    const res = await httpClient.delete<ApiResponse<{ message: string }>>(ROLES_ENDPOINTS.ROLE_BY_ID(id));
    return {
      success: true,
      message: (res.data as { message?: string })?.message || 'Role deleted successfully.',
    };
  },

  /** PATCH /api/roles/:id/restore */
  async restoreRole(id: string): Promise<RoleItem> {
    const res = await httpClient.patch<ApiResponse<RoleItem>>(ROLES_ENDPOINTS.RESTORE_ROLE(id));
    return extractData(res);
  },

  /** GET /api/roles/:id/permissions */
  async getRolePermissions(id: string): Promise<RolePermissionItem[]> {
    const res = await httpClient.get<ApiResponse<RolePermissionItem[]>>(ROLES_ENDPOINTS.ROLE_PERMISSIONS(id));
    const data = extractData(res);
    return Array.isArray(data) ? data : [];
  },

  /** PUT /api/roles/:id/permissions */
  async replaceRolePermissions(id: string, dto: AssignPermissionsDto): Promise<RolePermissionItem[]> {
    const res = await httpClient.put<ApiResponse<RolePermissionItem[]>>(
      ROLES_ENDPOINTS.ROLE_PERMISSIONS(id),
      dto
    );
    const data = extractData(res);
    return Array.isArray(data) ? data : [];
  },

  /** POST /api/roles/:id/permissions */
  async addRolePermission(id: string, dto: PermissionAssignmentItemDto): Promise<RolePermissionItem> {
    const res = await httpClient.post<ApiResponse<RolePermissionItem>>(
      ROLES_ENDPOINTS.ROLE_PERMISSIONS(id),
      dto
    );
    return extractData(res);
  },

  /** DELETE /api/roles/:id/permissions/:permissionId */
  async removeRolePermission(id: string, permissionId: string): Promise<{ success: boolean; message: string }> {
    const res = await httpClient.delete<ApiResponse<{ message: string }>>(
      ROLES_ENDPOINTS.ROLE_PERMISSION_ITEM(id, permissionId)
    );
    return {
      success: true,
      message: (res.data as { message?: string })?.message || 'Permission removed from role successfully.',
    };
  },

  // -------------------------------------------------------------
  // PERMISSIONS APIS
  // -------------------------------------------------------------

  /** GET /api/permissions */
  async getPermissions(query?: PermissionQueryDto): Promise<{ items: PermissionItem[]; total: number; hasMore: boolean }> {
    const res = await httpClient.get<ApiResponse<PermissionItem[] | { items: PermissionItem[]; total?: number }>>(
      ROLES_ENDPOINTS.PERMISSIONS,
      { params: query }
    );
    return extractPaginated<PermissionItem>(res.data, query?.limit || 50, query?.page || 1);
  },

  /** GET /api/permissions/modules */
  async getPermissionsGroupedByModule(): Promise<PermissionGroup[]> {
    const res = await httpClient.get<ApiResponse<unknown>>(ROLES_ENDPOINTS.PERMISSIONS_MODULES);
    const data = extractData(res);
    if (Array.isArray(data)) return data;
    if (data && typeof data === 'object') {
      return Object.entries(data).map(([module, perms]) => ({
        module,
        permissions: Array.isArray(perms) ? (perms as PermissionItem[]) : [],
      }));
    }
    return [];
  },

  /** GET /api/permissions/:id */
  async getPermission(id: string): Promise<PermissionItem> {
    const res = await httpClient.get<ApiResponse<PermissionItem>>(ROLES_ENDPOINTS.PERMISSION_BY_ID(id));
    return extractData(res);
  },

  /** POST /api/permissions */
  async createPermission(dto: CreatePermissionDto): Promise<PermissionItem> {
    const res = await httpClient.post<ApiResponse<PermissionItem>>(ROLES_ENDPOINTS.PERMISSIONS, dto);
    return extractData(res);
  },

  /** PATCH /api/permissions/:id */
  async updatePermission(id: string, dto: UpdatePermissionDto): Promise<PermissionItem> {
    const res = await httpClient.patch<ApiResponse<PermissionItem>>(ROLES_ENDPOINTS.PERMISSION_BY_ID(id), dto);
    return extractData(res);
  },

  /** DELETE /api/permissions/:id */
  async deletePermission(id: string): Promise<{ success: boolean; message: string }> {
    const res = await httpClient.delete<ApiResponse<{ message: string }>>(ROLES_ENDPOINTS.PERMISSION_BY_ID(id));
    return {
      success: true,
      message: (res.data as { message?: string })?.message || 'Permission deleted successfully.',
    };
  },

  // -------------------------------------------------------------
  // DEPARTMENTS APIS
  // -------------------------------------------------------------

  /** GET /api/departments */
  async getDepartments(query?: QueryDepartmentsDto): Promise<{ items: DepartmentItem[]; total: number; hasMore: boolean }> {
    const res = await httpClient.get<ApiResponse<DepartmentItem[] | { items: DepartmentItem[]; total?: number; pagination?: unknown }>>(
      ROLES_ENDPOINTS.DEPARTMENTS,
      { params: query }
    );
    return extractPaginated<DepartmentItem>(res.data, query?.limit || 50, query?.page || 1);
  },

  /** GET /api/departments/:id */
  async getDepartment(id: string): Promise<DepartmentItem> {
    const res = await httpClient.get<ApiResponse<DepartmentItem>>(ROLES_ENDPOINTS.DEPARTMENT_BY_ID(id));
    return extractData(res);
  },

  /** POST /api/departments */
  async createDepartment(dto: CreateDepartmentDto): Promise<DepartmentItem> {
    const res = await httpClient.post<ApiResponse<DepartmentItem>>(ROLES_ENDPOINTS.DEPARTMENTS, dto);
    return extractData(res);
  },

  /** PATCH /api/departments/:id */
  async updateDepartment(id: string, dto: UpdateDepartmentDto): Promise<DepartmentItem> {
    const res = await httpClient.patch<ApiResponse<DepartmentItem>>(ROLES_ENDPOINTS.DEPARTMENT_BY_ID(id), dto);
    return extractData(res);
  },

  /** DELETE /api/departments/:id */
  async deleteDepartment(id: string): Promise<{ success: boolean; message: string }> {
    const res = await httpClient.delete<ApiResponse<{ message: string }>>(ROLES_ENDPOINTS.DEPARTMENT_BY_ID(id));
    return {
      success: true,
      message: (res.data as { message?: string })?.message || 'Department deleted successfully.',
    };
  },
};
