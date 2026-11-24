export const ATTENDANCE_ENDPOINTS = {
  // Lifecycle
  CHECK_IN: '/api/attendance/check-in',
  CHECK_OUT: '/api/attendance/check-out',
  START_BREAK: '/api/attendance/breaks/start',
  END_BREAK: '/api/attendance/breaks/end',
  TODAY: '/api/attendance/today',
  HISTORY: '/api/attendance/history',
  RECALCULATE: (recordId: string) => `/api/attendance/records/${recordId}/recalculate`,

  // Shifts
  SHIFTS: '/api/attendance/shifts',
  SHIFT_MY_ASSIGNMENTS: '/api/attendance/shifts/my-assignments',
  SHIFT_EFFECTIVE: (userId: string) => `/api/attendance/shifts/effective/${userId}`,
  SHIFT_EMPLOYEE_ASSIGNMENTS: (userId: string) => `/api/attendance/shifts/assignments/${userId}`,
  SHIFT_ASSIGN: '/api/attendance/shifts/assign',
  SHIFT_ASSIGNMENT_ITEM: (assignmentId: string) => `/api/attendance/shifts/assignments/${assignmentId}`,
  SHIFT_BY_ID: (id: string) => `/api/attendance/shifts/${id}`,

  // Overtime
  OVERTIME_SUBMIT: '/api/attendance/overtime',
  OVERTIME_MY: '/api/attendance/overtime/my-requests',
  OVERTIME_LIST: '/api/attendance/overtime',
  OVERTIME_APPROVE: (id: string) => `/api/attendance/overtime/${id}/approve`,
  OVERTIME_REJECT: (id: string) => `/api/attendance/overtime/${id}/reject`,
  OVERTIME_CANCEL: (id: string) => `/api/attendance/overtime/${id}/cancel`,

  // WFH
  WFH_SUBMIT: '/api/attendance/wfh',
  WFH_MY: '/api/attendance/wfh/my-requests',
  WFH_LIST: '/api/attendance/wfh',
  WFH_APPROVE: (id: string) => `/api/attendance/wfh/${id}/approve`,
  WFH_REJECT: (id: string) => `/api/attendance/wfh/${id}/reject`,
  WFH_CANCEL: (id: string) => `/api/attendance/wfh/${id}/cancel`,

  // Corrections
  CORRECTION_SUBMIT: '/api/attendance/corrections',
  CORRECTION_MY: '/api/attendance/corrections/my-requests',
  CORRECTION_LIST: '/api/attendance/corrections',
  CORRECTION_BY_ID: (id: string) => `/api/attendance/corrections/${id}`,
  CORRECTION_CANCEL: (id: string) => `/api/attendance/corrections/${id}/cancel`,
  CORRECTION_APPROVE: (id: string) => `/api/attendance/corrections/${id}/approve`,
  CORRECTION_REJECT: (id: string) => `/api/attendance/corrections/${id}/reject`,

  // Reconciliation
  RECONCILIATION_RUN: '/api/attendance/reconciliation/run',
  RECONCILIATION_RUNS: '/api/attendance/reconciliation/runs',
  RECONCILIATION_RUN_BY_ID: (id: string) => `/api/attendance/reconciliation/runs/${id}`,
  RECONCILIATION_STATUS: '/api/attendance/reconciliation/status',

  // Anomalies
  ANOMALIES_LIST: '/api/attendance/anomalies',
  ANOMALY_BY_ID: (recordId: string) => `/api/attendance/anomalies/${recordId}`,
  ANOMALY_RESOLVE: (recordId: string) => `/api/attendance/anomalies/${recordId}/resolve`,
} as const;
