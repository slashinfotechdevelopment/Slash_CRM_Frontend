import { httpClient } from '@/api/client/httpClient';
import { USERS_ENDPOINTS } from '@/api/endpoints/users.endpoints';
import {
  UserItem,
  UserDetail,
  CreateUserPayload,
  UpdateUserPayload,
  UpdateUserStatusPayload,
  AssignUserRolesPayload,
  AssignUserDepartmentsPayload,
  AssignUserPermissionsPayload,
  EffectivePermissionsResponse,
  UserQueryParams,
} from '@/api/types/users.types';
import { ApiResponse } from '@/api/types/api.types';
import { extractPaginated } from '@/api/client/responseUnwrap';


export const usersConnector = {
  // -------------------------------------------------------------
  // USERS MANAGEMENT APIS
  // -------------------------------------------------------------

  /** POST /api/users */
  async createUser(payload: CreateUserPayload): Promise<UserDetail> {
    const res = await httpClient.post<ApiResponse<UserDetail>>(USERS_ENDPOINTS.USERS, payload);
    return res.data.data;
  },

  /** GET /api/users */
  async getUsers(query?: UserQueryParams): Promise<{ items: UserItem[]; total: number; hasMore: boolean }> {
    const res = await httpClient.get<ApiResponse<{ items: UserItem[]; pagination: unknown }>>(
      USERS_ENDPOINTS.USERS,
      { params: query }
    );
    return extractPaginated<UserItem>(res.data, query?.limit || 20, query?.page || 1);
  },

  /** GET /api/users/:id */
  async getUser(id: string): Promise<UserDetail> {
    const res = await httpClient.get<ApiResponse<UserDetail>>(USERS_ENDPOINTS.USER_BY_ID(id));
    return res.data.data;
  },

  /** PATCH /api/users/:id */
  async updateUser(id: string, payload: UpdateUserPayload): Promise<UserDetail> {
    const res = await httpClient.patch<ApiResponse<UserDetail>>(USERS_ENDPOINTS.USER_BY_ID(id), payload);
    return res.data.data;
  },

  /** PATCH /api/users/:id/status */
  async updateUserStatus(id: string, payload: UpdateUserStatusPayload): Promise<UserDetail> {
    const res = await httpClient.patch<ApiResponse<UserDetail>>(USERS_ENDPOINTS.USER_STATUS(id), payload);
    return res.data.data;
  },

  /** DELETE /api/users/:id */
  async deleteUser(id: string): Promise<{ success: boolean; message: string }> {
    const res = await httpClient.delete<ApiResponse<{ message: string }>>(USERS_ENDPOINTS.USER_BY_ID(id));
    return { success: true, message: res.data.message || 'User deleted successfully' };
  },

  /** PATCH /api/users/:id/restore */
  async restoreUser(id: string): Promise<UserDetail> {
    const res = await httpClient.patch<ApiResponse<UserDetail>>(USERS_ENDPOINTS.RESTORE_USER(id), { identifier: id });
    return res.data.data;
  },

  /** PUT /api/users/:id/roles */
  async replaceUserRoles(id: string, payload: AssignUserRolesPayload): Promise<unknown> {
    const res = await httpClient.put<ApiResponse<unknown>>(USERS_ENDPOINTS.USER_ROLES(id), payload);
    return res.data.data;
  },

  /** POST /api/users/:id/roles */
  async addUserRoles(id: string, payload: AssignUserRolesPayload): Promise<unknown> {
    const res = await httpClient.put<ApiResponse<unknown>>(USERS_ENDPOINTS.USER_ROLES(id), payload);
    return res.data.data;
  },

  /** DELETE /api/users/:id/roles/:roleId */
  async removeUserRole(id: string, roleId: string): Promise<{ success: boolean; message: string }> {
    const res = await httpClient.delete<ApiResponse<{ message: string }>>(USERS_ENDPOINTS.USER_ROLE_ITEM(id, roleId));
    return { success: true, message: res.data.message || 'Role removed successfully' };
  },

  /** PUT /api/users/:id/departments */
  async replaceUserDepartments(id: string, payload: AssignUserDepartmentsPayload): Promise<unknown> {
    const res = await httpClient.put<ApiResponse<unknown>>(USERS_ENDPOINTS.USER_DEPARTMENTS(id), payload);
    return res.data.data;
  },

  /** PUT /api/users/:id/permissions */
  async replaceUserPermissions(id: string, payload: AssignUserPermissionsPayload): Promise<unknown> {
    const res = await httpClient.put<ApiResponse<unknown>>(USERS_ENDPOINTS.USER_PERMISSIONS(id), payload);
    return res.data.data;
  },

  /** GET /api/users/:id/permissions */
  async getEffectivePermissions(id: string): Promise<EffectivePermissionsResponse> {
    const res = await httpClient.get<ApiResponse<EffectivePermissionsResponse>>(USERS_ENDPOINTS.USER_PERMISSIONS(id));
    return res.data.data;
  },
};
