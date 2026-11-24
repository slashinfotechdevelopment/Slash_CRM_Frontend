export const LEAVE_ENDPOINTS = {
  // Types & Policies
  TYPES: '/api/leave/types',
  TYPE_BY_ID: (id: string) => `/api/leave/types/${id}`,
  TYPE_VERSIONS: (id: string) => `/api/leave/types/${id}/versions`,

  // Holidays & Calendar
  HOLIDAYS: '/api/leave/holidays',
  HOLIDAY_BY_ID: (id: string) => `/api/leave/holidays/${id}`,
  HOLIDAYS_ICS: '/api/leave/holidays/calendar.ics',
  SYNC_GOOGLE_HOLIDAYS: '/api/leave/holidays/sync-google-calendar',

  // Weekly-Off Policies
  WEEKLY_OFF_POLICIES: '/api/leave/weekly-off-policies',

  // Leave Requests & Applications
  REQUESTS: '/api/leave/requests',
  MY_REQUESTS: '/api/leave/requests/my',
  REQUEST_BY_ID: (id: string) => `/api/leave/requests/${id}`,
  REVIEW_REQUEST: (id: string) => `/api/leave/requests/${id}/review`,
  CANCEL_REQUEST: (id: string) => `/api/leave/requests/${id}/cancel`,
  REVIEW_CANCELLATION: (id: string) => `/api/leave/cancellations/${id}/review`,

  // Balances & Audit Ledger
  MY_BALANCES: '/api/leave/balances/my',
  BALANCES: '/api/leave/balances',
  ADJUST_BALANCE: '/api/leave/balances/adjust',
  TRANSACTIONS: '/api/leave/transactions',

  // Calendar & Reports
  CALENDAR: '/api/leave/calendar',
  REPORTS_SUMMARY: '/api/leave/reports/summary',
} as const;
