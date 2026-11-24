export const TASK_ENDPOINTS = {
  // Tasks CRUD & lifecycle
  CREATE: '/api/tasks',
  LIST: '/api/tasks',
  DETAILS: (id: string) => `/api/tasks/${id}`,
  UPDATE: (id: string) => `/api/tasks/${id}`,
  ASSIGN: (id: string) => `/api/tasks/${id}/assign`,
  CANCEL: (id: string) => `/api/tasks/${id}/cancel`,
  DELETE: (id: string) => `/api/tasks/${id}`,
  REOPEN: (id: string) => `/api/tasks/${id}/reopen`,

  // Task tags
  TAGS: '/api/tasks/tags',
  CREATE_TAG: '/api/tasks/tags',
  DELETE_TAG: (tagId: string) => `/api/tasks/tags/${tagId}`,

  // Timers & Time tracking
  TIMER_PLAY: (id: string) => `/api/tasks/${id}/timer/play`,
  TIMER_PAUSE: (id: string) => `/api/tasks/${id}/timer/pause`,
  TIMER_RESUME: (id: string) => `/api/tasks/${id}/timer/resume`,
  TIMER_STOP: (id: string) => `/api/tasks/${id}/timer/stop`,
  TIMER_ACTIVE: '/api/tasks/timer/active',
  TIME_ENTRIES: (id: string) => `/api/tasks/${id}/time-entries`,

  // Personal tasks & time summaries
  MY_TASKS: '/api/tasks/my-tasks',
  MY_TIME_SUMMARY: '/api/tasks/my-time-summary',
  TASK_TIME_SUMMARY: (id: string) => `/api/tasks/${id}/time-summary`,

  // Workflow, reviews, comments & audit
  SUBMIT_REVIEW: (id: string) => `/api/tasks/${id}/submit`,
  APPROVE_REVIEW: (id: string) => `/api/tasks/${id}/approve`,
  REQUEST_CHANGES: (id: string) => `/api/tasks/${id}/request-changes`,
  REJECT_REVIEW: (id: string) => `/api/tasks/${id}/reject`,
  LIST_REVIEWS: (id: string) => `/api/tasks/${id}/reviews`,
  ADD_COMMENT: (id: string) => `/api/tasks/${id}/comments`,
  LIST_COMMENTS: (id: string) => `/api/tasks/${id}/comments`,
  UPDATE_COMMENT: (id: string, commentId: string) => `/api/tasks/${id}/comments/${commentId}`,
  DELETE_COMMENT: (id: string, commentId: string) => `/api/tasks/${id}/comments/${commentId}`,
  AUDIT_HISTORY: (id: string) => `/api/tasks/${id}/history`,

  // Dashboards
  DASHBOARD_MY: '/api/tasks/dashboard/my',
  DASHBOARD_TEAM: '/api/tasks/dashboard/team',
  DASHBOARD_ORG: '/api/tasks/dashboard/organization',

  // Reports
  REPORT_SUMMARY: '/api/tasks/reports/summary',
  REPORT_WORKING_HOURS: '/api/tasks/reports/working-hours',
  REPORT_PERFORMANCE: '/api/tasks/reports/employee-performance',
  REPORT_OVERDUE: '/api/tasks/reports/overdue',
  REPORT_REVIEWS: '/api/tasks/reports/reviews',

  // Attachments
  UPLOAD_ATTACHMENT: (id: string) => `/api/tasks/${id}/attachments`,
  LIST_ATTACHMENTS: (id: string) => `/api/tasks/${id}/attachments`,
  DOWNLOAD_ATTACHMENT: (id: string, attachmentId: string) => `/api/tasks/${id}/attachments/${attachmentId}/download`,
  PREVIEW_ATTACHMENT: (id: string, attachmentId: string) => `/api/tasks/${id}/attachments/${attachmentId}/preview`,
  RESCAN_ATTACHMENT: (id: string, attachmentId: string) => `/api/tasks/${id}/attachments/${attachmentId}/rescan`,
  DELETE_ATTACHMENT: (id: string, attachmentId: string) => `/api/tasks/${id}/attachments/${attachmentId}`,
};
