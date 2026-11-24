export const LEAD_ENDPOINTS = {
  // Public
  PUBLIC_INQUIRE: '/api/leads/public/inquire',

  // Core Leads CRUD & Lifecycle
  LEADS: '/api/leads',
  LEAD_BY_ID: (id: string) => `/api/leads/${id}`,
  RESTORE_LEAD: (id: string) => `/api/leads/${id}/restore`,
  ASSIGN_LEAD: (id: string) => `/api/leads/${id}/assign`,
  QUALIFY_LEAD: (id: string) => `/api/leads/${id}/qualify`,
  UPDATE_STATUS: (id: string) => `/api/leads/${id}/status`,
  CONVERT_LEAD: (id: string) => `/api/leads/${id}/convert`,

  // Activities & Timeline
  ACTIVITIES: (id: string) => `/api/leads/${id}/activities`,
  TIMELINE: (id: string) => `/api/leads/${id}/timeline`,

  // Follow-ups
  FOLLOW_UPS: (id: string) => `/api/leads/${id}/follow-ups`,
  MY_FOLLOW_UPS: '/api/leads/follow-ups/my',
  FOLLOW_UP_BY_ID: (followUpId: string) => `/api/leads/follow-ups/${followUpId}`,

  // Pipeline & Metrics
  PIPELINE_STAGES: '/api/leads/pipeline/stages',
  METRICS_SUMMARY: '/api/leads/metrics/summary',
  METRICS_PIPELINE: '/api/leads/metrics/pipeline',

  // Import / Export
  IMPORT: '/api/leads/import',
  EXPORT: '/api/leads/export',
} as const;
