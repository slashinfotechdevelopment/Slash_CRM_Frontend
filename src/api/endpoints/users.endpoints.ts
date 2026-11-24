export const USERS_ENDPOINTS = {
  // POST, GET
  USERS: '/api/users',

  // GET, PATCH, DELETE
  USER_BY_ID: (id: string) => `/api/users/${id}`,

  // PATCH
  USER_STATUS: (id: string) => `/api/users/${id}/status`,

  // PATCH
  RESTORE_USER: (id: string) => `/api/users/${id}/restore`,

  // PUT, POST
  USER_ROLES: (id: string) => `/api/users/${id}/roles`,

  // DELETE
  USER_ROLE_ITEM: (id: string, roleId: string) => `/api/users/${id}/roles/${roleId}`,

  // PUT
  USER_DEPARTMENTS: (id: string) => `/api/users/${id}/departments`,

  // PUT, GET
  USER_PERMISSIONS: (id: string) => `/api/users/${id}/permissions`,
} as const;
