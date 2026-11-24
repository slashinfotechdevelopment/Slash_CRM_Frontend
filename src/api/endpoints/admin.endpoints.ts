export const ADMIN_ENDPOINTS = {
  // Activity & Sessions
  EMPLOYEE_ACTIVITY: '/api/admin/employees/activity',
  EMPLOYEE_SESSIONS: (id: string) => `/api/admin/employees/${id}/sessions`,

  // Tasks Oversight
  EMPLOYEE_TASKS: (id: string) => `/api/admin/employees/${id}/tasks`,
  TASKS_SUMMARY: '/api/admin/tasks/summary',

  // Lead Intelligence
  LEADS_SUMMARY: '/api/admin/leads/summary',
  LEADS_BY_EMPLOYEE: '/api/admin/leads/by-employee',
  LEADS_TREND: '/api/admin/leads/trend',
  LEADS_BY_SOURCE: '/api/admin/leads/by-source',
} as const;
