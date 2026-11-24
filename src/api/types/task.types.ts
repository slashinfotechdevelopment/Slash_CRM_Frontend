export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type TaskStatus =
  | 'BACKLOG'
  | 'TODO'
  | 'IN_PROGRESS'
  | 'ON_HOLD'
  | 'IN_REVIEW'
  | 'REOPENED'
  | 'COMPLETED'
  | 'CANCELLED';

export type TaskTimerStatus = 'RUNNING' | 'PAUSED' | 'STOPPED';

export type TaskPauseReason =
  | 'TEA_BREAK'
  | 'LUNCH'
  | 'PERSONAL_WORK'
  | 'MEETING'
  | 'WAITING'
  | 'TECHNICAL_ISSUE'
  | 'OTHER'
  | 'TASK_SWITCH'
  | 'LOGOUT'
  | 'TASK_STATUS_CHANGE';

export type TaskReviewOutcome =
  | 'PENDING'
  | 'APPROVED'
  | 'CHANGES_REQUESTED'
  | 'REJECTED';

export type DeviceType = 'WEB' | 'MOBILE' | 'DESKTOP' | 'SYSTEM';

export type TaskAttachmentScanStatus = 'PENDING' | 'CLEAN' | 'INFECTED' | 'ERROR';

export interface TaskTag {
  id: string;
  name: string;
  color?: string | null;
  _count?: {
    tasks?: number;
  };
  createdAt?: string;
}

export interface TaskUserRef {
  id: string;
  userCode: string;
  name: string;
  email: string;
}

export interface TaskDeptRef {
  id: string;
  code: string;
  name: string;
}

export interface TaskItem {
  id: string;
  taskCode: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  category?: string | null;
  progress: number;
  startDate?: string | null;
  startTime?: string | null;
  dueDate?: string | null;
  endTime?: string | null;
  estimatedHours?: number | null;
  assigneeId?: string | null;
  createdById: string;
  departmentId?: string | null;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  createdByUser?: TaskUserRef | null;
  assignee?: TaskUserRef | null;
  assignedByUser?: TaskUserRef | null;
  department?: TaskDeptRef | null;
  tagMappings?: Array<{
    id: string;
    tag: TaskTag;
  }>;
  tags?: TaskTag[];
}

export interface TaskAssignmentHistoryItem {
  id: string;
  taskId: string;
  previousAssigneeId?: string | null;
  newAssigneeId?: string | null;
  assignedById: string;
  reason?: string | null;
  assignedAt: string;
  previousAssignee?: { id: string; userCode: string; name: string } | null;
  newAssignee?: { id: string; userCode: string; name: string } | null;
  assignedBy?: { id: string; userCode: string; name: string } | null;
}

export interface TaskStatusHistoryItem {
  id: string;
  taskId: string;
  previousStatus?: string | null;
  newStatus: TaskStatus;
  changedById: string;
  comment?: string | null;
  createdAt: string;
  changedBy?: { id: string; userCode: string; name: string } | null;
}

export interface TaskActivityLogItem {
  id: string;
  taskId: string;
  action: string;
  performedBy: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  actor?: { id: string; userCode: string; name: string } | null;
}

export interface TaskTimePause {
  id: string;
  taskId: string;
  userId: string;
  pausedAt: string;
  resumedAt?: string | null;
  pauseDurationSeconds: number;
  reason: TaskPauseReason;
  customDescription?: string | null;
}

export interface TaskTimeEntry {
  id: string;
  taskId: string;
  userId: string;
  startedAt: string;
  endedAt?: string | null;
  durationSeconds: number;
  workDate?: string;
  status: TaskTimerStatus;
  deviceType?: DeviceType;
  user?: { id: string; userCode: string; name: string } | null;
  task?: { id: string; taskCode: string; title: string } | null;
  pauses?: TaskTimePause[];
}

export interface ActiveTimerResponse {
  hasActiveTimer: boolean;
  isRunning: boolean;
  isPaused: boolean;
  entry?: TaskTimeEntry | null;
  task?: {
    id: string;
    taskCode: string;
    title: string;
    status: TaskStatus;
    priority: TaskPriority;
    department?: { id: string; name: string } | null;
  } | null;
  activePause?: {
    id: string;
    taskId: string;
    pausedAt: string;
    reason: TaskPauseReason;
    customDescription?: string | null;
    pauseElapsedSeconds: number;
  } | null;
}

export interface TaskTimeSummary {
  userId?: string;
  totalWorkingSeconds: number;
  totalWorkingMinutes?: number;
  totalWorkingHours: number;
  totalPauseSeconds?: number;
  totalPauseHours?: number;
  totalPausedSeconds?: number;
  totalPausedMinutes?: number;
  dailyBreakdown: Array<{
    date: string;
    workingSeconds: number;
    workingHours: number;
    pauseSeconds?: number;
    pauseHours?: number;
    pausedSeconds?: number;
    pausedMinutes?: number;
  }>;
  taskBreakdown?: unknown[];
  taskDistribution?: Array<{
    taskId: string;
    taskCode: string;
    title: string;
    workingSeconds: number;
    workingHours: number;
  }>;
  activeTimer?: ActiveTimerResponse | null;
}

export interface TaskReview {
  id: string;
  taskId: string;
  roundNumber: number;
  outcome: TaskReviewOutcome;
  feedback?: string | null;
  rating?: number | null;
  submittedAt: string;
  reviewedAt?: string | null;
  submitter?: { id: string; userCode: string; name: string } | null;
  reviewer?: { id: string; userCode: string; name: string } | null;
  task?: { id: string; taskCode: string; title: string; status: TaskStatus } | null;
}

export interface TaskComment {
  id: string;
  taskId: string;
  authorId: string;
  content: string;
  parentId?: string | null;
  isInternal: boolean;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
  author?: { id: string; userCode: string; name: string } | null;
  replies?: TaskComment[];
}

export interface TaskAttachment {
  id: string;
  taskId: string;
  uploaderId: string;
  originalName: string;
  mimeType: string;
  fileSizeBytes: number;
  fileUrl?: string | null;
  scanStatus: TaskAttachmentScanStatus;
  isInternal: boolean;
  collection?: string | null;
  sha256?: string | null;
  createdAt: string;
  uploader?: { id: string; userCode: string; name: string } | null;
}

export interface TaskAuditHistory {
  assignmentHistory: TaskAssignmentHistoryItem[];
  statusHistory: TaskStatusHistoryItem[];
  activityLogs: TaskActivityLogItem[];
}

// ===========================================================================
// DASHBOARDS & REPORTS
// ===========================================================================

export interface EmployeeDashboardData {
  totalTasks: number;
  assignedTasks: number;
  ownUnassignedDrafts: number;
  statusCounts: Record<string, number>;
  deadlines: {
    overdueTasks: number;
    dueTodayTasks: number;
    upcomingTasks: number;
  };
  timerTelemetry: {
    activeTimer: ActiveTimerResponse;
    todayWorkingSeconds: number;
    todayWorkingHours: number;
    todayPausedSeconds: number;
    todayPausedHours: number;
  };
  recentActivity: Array<{
    id: string;
    taskId: string;
    taskCode: string;
    taskTitle: string;
    action: string;
    performedBy?: { id: string; name: string; userCode: string } | null;
    metadata?: Record<string, unknown>;
    createdAt: string;
  }>;
  recentReviews: Array<{
    id: string;
    taskId: string;
    taskCode: string;
    taskTitle: string;
    outcome: string;
    submittedAt: string;
    submitter?: { id: string; name: string; userCode: string } | null;
    reviewer?: { id: string; name: string; userCode: string } | null;
  }>;
}

export interface TeamDashboardData {
  totalTasks: number;
  statusCounts: Record<string, number>;
  priorityCounts: Record<string, number>;
  deadlines: {
    overdueTasks: number;
    dueTodayTasks: number;
    upcomingTasks: number;
  };
  activeTimerRoster: Array<{
    userId: string;
    userCode: string;
    userName: string;
    taskId: string;
    taskCode: string;
    taskTitle: string;
    status: 'RUNNING' | 'PAUSED';
    elapsedSeconds: number;
  }>;
}

export interface OrgDashboardData {
  totalTasks: number;
  completionPercentage?: number;
  statusCounts: Record<string, number>;
  priorityCounts?: Record<string, number>;
  departmentDistribution: Array<{
    departmentId: string;
    departmentCode?: string;
    departmentName: string;
    totalTasks?: number;
    taskCount?: number;
    completedTasks?: number;
    completedCount?: number;
    completionPercentage?: number;
  }>;
  overdueCount?: number;
  slaMetrics?: {
    overdueTasks: number;
    dueTodayTasks: number;
    awaitingReviewCount: number;
  };
  trends?: {
    completionsLast30Days: number;
  };
  timeTelemetry?: {
    totalWorkingSeconds: number;
    totalWorkingHours: number;
    totalPausedSeconds: number;
    totalPausedHours: number;
    liveTimersCount: number;
  };
  completionTrend?: Array<{
    date: string;
    completedCount: number;
  }>;
}

export interface TaskSummaryReportData {
  totalTasks: number;
  completedTasks: number;
  pendingTasks?: number;
  overdueTasks?: number;
  completionPercentage: number;
  statusCounts?: Record<string, number>;
  priorityCounts?: Record<string, number>;
  byStatus?: Record<string, number>;
  byPriority?: Record<string, number>;
}

export interface WorkingHoursItem {
  employee: {
    id: string;
    userCode: string;
    name: string;
    email: string;
  };
  workDate: string;
  totalWorkingSeconds: number;
  totalWorkingHours: number;
  totalPausedSeconds: number;
  totalPausedHours: number;
  sessionCount: number;
  firstStartedAt?: string;
  lastStoppedAt?: string;
  tasks?: Array<{
    taskId: string;
    taskCode: string;
    title: string;
    durationSeconds: number;
    durationHours: number;
  }>;
}

export type WorkingHoursReportData =
  | WorkingHoursItem[]
  | {
      summary?: {
        totalWorkingHours: number;
        totalPausedHours: number;
        uniqueEmployeesCount: number;
      };
      employees?: Array<{
        employeeId: string;
        employeeName: string;
        userCode: string;
        totalWorkingHours: number;
        totalPausedHours: number;
        days?: Array<{
          date: string;
          workingHours: number;
          pausedHours: number;
        }>;
      }>;
      data?: WorkingHoursItem[];
    };

export interface EmployeePerformanceItem {
  employee: {
    id: string;
    userCode: string;
    name: string;
    email: string;
    departments?: string[];
  };
  assignedTaskCount: number;
  completedTaskCount: number;
  pendingTaskCount: number;
  overdueTaskCount: number;
  tasksAwaitingReview?: number;
  completionPercentage: number;
  totalTrackedHours: number;
}

export type EmployeePerformanceReportData =
  | EmployeePerformanceItem[]
  | {
      employees?: Array<{
        employeeId: string;
        employeeName: string;
        userCode: string;
        departmentName?: string;
        assigned: number;
        completed: number;
        pending: number;
        overdue: number;
        completionPercentage: number;
        trackedHours: number;
      }>;
      data?: EmployeePerformanceItem[];
      pagination?: { page: number; limit: number; total: number; totalPages: number };
    };

export interface OverdueTaskItem {
  id: string;
  taskCode: string;
  title: string;
  priority: TaskPriority;
  currentStatus?: TaskStatus;
  status?: TaskStatus;
  dueDate: string;
  daysOverdue: number;
  assignee?: {
    id: string;
    userCode: string;
    name: string;
  };
  assigneeName?: string;
  userCode?: string;
  departmentName?: string;
}

export type OverdueTasksReportData =
  | OverdueTaskItem[]
  | {
      tasks?: OverdueTaskItem[];
      data?: OverdueTaskItem[];
      total?: number;
    };

export interface ReviewSummaryReportData {
  totalReviews?: number;
  awaitingReviewCount?: number;
  approvedCount?: number;
  changesRequestedCount?: number;
  rejectedCount?: number;
  reviewerPendingCounts?: Array<{
    reviewerId: string;
    reviewerName: string;
    count: number;
  }>;
  reviewTurnaroundHours?: number;
  summary?: {
    totalReviews: number;
    approvedCount: number;
    changesRequestedCount: number;
    rejectedCount: number;
    pendingCount: number;
    averageTurnaroundHours: number;
  };
  pendingByReviewer?: Array<{
    reviewerId: string;
    reviewerName: string;
    userCode: string;
    pendingCount: number;
  }>;
}

// ===========================================================================
// PAYLOADS & QUERY PARAMS
// ===========================================================================

export interface CreateTaskPayload {
  title: string;
  description: string;
  priority?: TaskPriority;
  category?: string;
  startDate?: string;
  startTime?: string;
  dueDate?: string;
  endTime?: string;
  estimatedHours?: number;
  assigneeId?: string;
  assigneeIds?: string[];
  tags?: string[];
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  progress?: number;
  category?: string;
  startDate?: string;
  startTime?: string;
  dueDate?: string;
  endTime?: string;
  estimatedHours?: number;
  tags?: string[];
  statusComment?: string;
}

export interface AssignTaskPayload {
  assigneeId?: string | null;
  reason?: string;
}

export interface CreateTaskTagPayload {
  name: string;
  color?: string;
}

export interface PlayTaskTimerPayload {
  deviceType?: DeviceType;
  ipAddress?: string;
  userAgent?: string;
}

export interface PauseTaskTimerPayload {
  reason: TaskPauseReason;
  customDescription?: string;
}

export interface ResumeTaskTimerPayload {
  deviceType?: DeviceType;
  ipAddress?: string;
  userAgent?: string;
}

export interface StopTaskTimerPayload {
  finalComment?: string;
}

export interface SubmitTaskPayload {
  notes?: string;
  attachmentIds?: string[];
}

export interface ApproveTaskReviewPayload {
  feedback?: string;
  rating?: number;
}

export interface RequestChangesPayload {
  feedback: string;
}

export interface RejectTaskReviewPayload {
  feedback: string;
  reopenTask?: boolean;
}

export interface CreateTaskCommentPayload {
  content: string;
  parentId?: string;
  isInternal?: boolean;
}

export interface UpdateTaskCommentPayload {
  content: string;
}

export interface CreateTaskAttachmentPayload {
  originalName?: string;
  mimeType?: string;
  fileSizeBytes?: number;
  fileUrl?: string;
  collection?: string;
  isInternal?: boolean;
}

export interface QueryTasksParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  category?: string;
  assigneeId?: string;
  createdById?: string;
  departmentId?: string;
  startDateFrom?: string;
  startDateTo?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
  isOverdue?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface QueryMyTasksParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  category?: string;
  isOverdue?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface QueryTaskDashboardParams {
  startDate?: string;
  endDate?: string;
  departmentId?: string;
}

export interface QueryTaskReportsParams {
  startDate?: string;
  endDate?: string;
  departmentId?: string;
  assigneeId?: string;
  createdById?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
