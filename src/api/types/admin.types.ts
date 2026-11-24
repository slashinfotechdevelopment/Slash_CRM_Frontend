export interface EmployeeActivityItem {
  employeeId: string;
  id?: string;
  employeeName: string;
  name?: string;
  employeeCode?: string | null;
  userCode?: string | null;
  email: string;
  department?: string | null;
  designation?: string | null;
  status: 'online' | 'offline' | string;
  isOnline?: boolean;
  lastLogin?: string | null;
  lastLogout?: string | null;
  lastLoginAt?: string | null;
  lastLogoutAt?: string | null;
  totalSessions: number;
  totalActiveDurationSeconds: number;
  totalActiveDurationFormatted: string;
}

export interface EmployeeSessionItem {
  sessionId: string;
  loginAt: string;
  logoutAt: string | null;
  lastUsedAt: string | null;
  expiresAt: string;
  status: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  deviceName?: string | null;
  durationSeconds: number;
  durationFormatted: string;
}

export interface EmployeeActivityResponse {
  items: EmployeeActivityItem[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  dateRange: {
    from: string;
    to: string;
  };
}

export interface EmployeeSessionsResponse {
  employee: {
    id: string;
    name: string;
    email: string;
    code?: string | null;
  };
  items: EmployeeSessionItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  dateRange: {
    from: string;
    to: string;
  };
}

export interface EmployeeTaskItem {
  id: string;
  taskCode?: string | null;
  title: string;
  priority: string;
  rawStatus: string;
  computedStatus: 'completed' | 'pending' | 'overdue' | 'cancelled' | string;
  progress: number;
  startDate: string | null;
  dueDate: string | null;
  completedDate: string | null;
  createdAt: string;
}

export interface EmployeeTasksResponse {
  employee: {
    id: string;
    name: string;
    email: string;
    code?: string | null;
  };
  items: EmployeeTaskItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  dateRange: {
    from: string;
    to: string;
  };
}

export interface EmployeeTaskSummaryItem {
  employeeId: string;
  employeeName: string;
  employeeCode?: string | null;
  email: string;
  department?: string | null;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  cancelledTasks: number;
  completionRatePercentage: number;
  // Legacy / fallback mappings
  employee?: {
    id: string;
    name: string;
    email: string;
    code?: string | null;
    department?: string | null;
  };
  total?: number;
  completed?: number;
  pending?: number;
  overdue?: number;
  cancelled?: number;
}

export interface TasksSummaryResponse {
  summary: EmployeeTaskSummaryItem[];
  totalEmployees?: number;
  dateRange: {
    from: string;
    to: string;
  };
}

export interface AdminLeadsSummaryResponse {
  newLeads: number;
  convertedLeads: number;
  lostLeads: number;
  conversionRatePercentage: number;
  countByStage: Array<{
    stageId: string;
    stageCode: string;
    stageName: string;
    color?: string | null;
    count: number;
  }>;
  countByStatus: Record<string, number>;
  dateRange: {
    from: string;
    to: string;
  };
}

export interface LeadsByEmployeeItem {
  employeeId: string;
  employeeName: string;
  employeeCode?: string | null;
  email?: string;
  department?: string | null;
  totalAssigned?: number;
  converted?: number;
  convertedCount?: number;
  conversionRatePercentage: number;
  employee?: {
    id: string;
    name: string;
    email: string;
    code?: string | null;
  };
}

export interface LeadTrendPoint {
  period?: string;
  date?: string;
  newLeads: number;
  convertedLeads: number;
}

export interface LeadSourceItem {
  source: string;
  count?: number;
  totalLeads?: number;
  convertedCount?: number;
  conversionRatePercentage: number;
}

// Params
export interface QueryDateRangeParams {
  from?: string;
  to?: string;
}

export interface QueryEmployeeActivityParams extends QueryDateRangeParams {
  employeeId?: string;
  page?: number;
  limit?: number;
}

export interface QueryEmployeeSessionsParams extends QueryDateRangeParams {
  page?: number;
  limit?: number;
}

export interface QueryEmployeeTasksParams extends QueryDateRangeParams {
  status?: string;
  page?: number;
  limit?: number;
}

export interface QueryLeadTrendParams extends QueryDateRangeParams {
  interval?: 'day' | 'week' | 'month';
}
