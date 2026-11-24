export const ROLES_ENDPOINTS = {
  // Roles
  ROLES: '/api/roles',
  ROLE_BY_ID: (id: string) => `/api/roles/${id}`,
  RESTORE_ROLE: (id: string) => `/api/roles/${id}/restore`,
  ROLE_PERMISSIONS: (id: string) => `/api/roles/${id}/permissions`,
  ROLE_PERMISSION_ITEM: (id: string, permissionId: string) => `/api/roles/${id}/permissions/${permissionId}`,

  // Permissions
  PERMISSIONS: '/api/permissions',
  PERMISSIONS_MODULES: '/api/permissions/modules',
  PERMISSION_BY_ID: (id: string) => `/api/permissions/${id}`,

  // Departments
  DEPARTMENTS: '/api/departments',
  DEPARTMENT_BY_ID: (id: string) => `/api/departments/${id}`,
} as const;
