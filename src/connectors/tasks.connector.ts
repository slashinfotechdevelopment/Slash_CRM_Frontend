import { httpClient } from '@/api/client/httpClient';
import { TASK_ENDPOINTS } from '@/api/endpoints/task.endpoints';
import {
  TaskItem,
  TaskTag,
  TaskTimeEntry,
  TaskTimeSummary,
  ActiveTimerResponse,
  TaskReview,
  TaskComment,
  TaskAttachment,
  TaskAuditHistory,
  EmployeeDashboardData,
  TeamDashboardData,
  OrgDashboardData,
  TaskSummaryReportData,
  WorkingHoursReportData,
  EmployeePerformanceReportData,
  OverdueTasksReportData,
  ReviewSummaryReportData,
  CreateTaskPayload,
  UpdateTaskPayload,
  AssignTaskPayload,
  CreateTaskTagPayload,
  PlayTaskTimerPayload,
  PauseTaskTimerPayload,
  ResumeTaskTimerPayload,
  StopTaskTimerPayload,
  SubmitTaskPayload,
  ApproveTaskReviewPayload,
  RequestChangesPayload,
  RejectTaskReviewPayload,
  CreateTaskCommentPayload,
  UpdateTaskCommentPayload,
  CreateTaskAttachmentPayload,
  QueryTasksParams,
  QueryMyTasksParams,
  QueryTaskDashboardParams,
  QueryTaskReportsParams,
} from '@/api/types/task.types';
import { ApiResponse } from '@/api/types/api.types';
import { extractData, extractPaginated } from '@/api/client/responseUnwrap';


export const tasksConnector = {
  // ===========================================================================
  // Task CRUD & Lifecycle
  // ===========================================================================
  async createTask(payload: CreateTaskPayload): Promise<TaskItem> {
    const res = await httpClient.post<ApiResponse<TaskItem>>(TASK_ENDPOINTS.CREATE, payload);
    return extractData(res);
  },

  async getTasks(params?: QueryTasksParams): Promise<{ items: TaskItem[]; total: number; hasMore: boolean }> {
    const res = await httpClient.get<ApiResponse<TaskItem[]>>(TASK_ENDPOINTS.LIST, { params });
    return extractPaginated<TaskItem>(res.data, params?.limit ?? 20, params?.page ?? 1);
  },

  async getTaskById(id: string): Promise<TaskItem> {
    const res = await httpClient.get<ApiResponse<TaskItem>>(TASK_ENDPOINTS.DETAILS(id));
    return extractData(res);
  },

  async updateTask(id: string, payload: UpdateTaskPayload): Promise<TaskItem> {
    const res = await httpClient.patch<ApiResponse<TaskItem>>(TASK_ENDPOINTS.UPDATE(id), payload);
    return extractData(res);
  },

  async assignTask(id: string, payload: AssignTaskPayload): Promise<TaskItem> {
    const res = await httpClient.patch<ApiResponse<TaskItem>>(TASK_ENDPOINTS.ASSIGN(id), payload);
    return extractData(res);
  },

  async cancelTask(id: string, reason: string): Promise<TaskItem> {
    const res = await httpClient.post<ApiResponse<TaskItem>>(TASK_ENDPOINTS.CANCEL(id), { reason });
    return extractData(res);
  },

  async deleteTask(id: string): Promise<{ success: boolean; message?: string }> {
    const res = await httpClient.delete<ApiResponse<{ success: boolean; message?: string }>>(TASK_ENDPOINTS.DELETE(id));
    return extractData(res);
  },

  async reopenTask(id: string, reason: string): Promise<TaskItem> {
    const res = await httpClient.post<ApiResponse<TaskItem>>(TASK_ENDPOINTS.REOPEN(id), { reason });
    return extractData(res);
  },

  // ===========================================================================
  // Task Tags
  // ===========================================================================
  async listTags(): Promise<TaskTag[]> {
    const res = await httpClient.get<ApiResponse<TaskTag[]> | TaskTag[]>(TASK_ENDPOINTS.TAGS);
    const data = extractData<TaskTag[]>(res);
    return Array.isArray(data) ? data : [];
  },

  async createTag(payload: CreateTaskTagPayload): Promise<TaskTag> {
    const res = await httpClient.post<ApiResponse<TaskTag>>(TASK_ENDPOINTS.CREATE_TAG, payload);
    return extractData(res);
  },

  async deleteTag(tagId: string): Promise<{ success: boolean; message?: string }> {
    const res = await httpClient.delete<ApiResponse<unknown>>(TASK_ENDPOINTS.DELETE_TAG(tagId));
    return extractData(res);
  },

  // ===========================================================================
  // Task Timers
  // ===========================================================================
  async playTimer(id: string, payload?: PlayTaskTimerPayload): Promise<unknown> {
    const res = await httpClient.post<ApiResponse<unknown>>(TASK_ENDPOINTS.TIMER_PLAY(id), payload ?? {});
    return extractData(res);
  },

  async pauseTimer(id: string, payload: PauseTaskTimerPayload): Promise<unknown> {
    const res = await httpClient.post<ApiResponse<unknown>>(TASK_ENDPOINTS.TIMER_PAUSE(id), payload);
    return extractData(res);
  },

  async resumeTimer(id: string, payload?: ResumeTaskTimerPayload): Promise<unknown> {
    const res = await httpClient.post<ApiResponse<unknown>>(TASK_ENDPOINTS.TIMER_RESUME(id), payload ?? {});
    return extractData(res);
  },

  async stopTimer(id: string, payload?: StopTaskTimerPayload): Promise<unknown> {
    const res = await httpClient.post<ApiResponse<unknown>>(TASK_ENDPOINTS.TIMER_STOP(id), payload ?? {});
    return extractData(res);
  },

  async getActiveTimer(): Promise<ActiveTimerResponse> {
    const res = await httpClient.get<ApiResponse<ActiveTimerResponse> | ActiveTimerResponse>(TASK_ENDPOINTS.TIMER_ACTIVE);
    return extractData<ActiveTimerResponse>(res);
  },

  async getTimeEntries(id: string, params?: { page?: number; limit?: number }): Promise<{ items: TaskTimeEntry[]; total: number; hasMore: boolean }> {
    const res = await httpClient.get<ApiResponse<TaskTimeEntry[]>>(TASK_ENDPOINTS.TIME_ENTRIES(id), { params });
    return extractPaginated<TaskTimeEntry>(res.data, params?.limit ?? 20, params?.page ?? 1);
  },

  // ===========================================================================
  // Personal Tasks & Time Summaries
  // ===========================================================================
  async getMyTasks(params?: QueryMyTasksParams): Promise<{ items: TaskItem[]; total: number; hasMore: boolean }> {
    const res = await httpClient.get<ApiResponse<TaskItem[]>>(TASK_ENDPOINTS.MY_TASKS, { params });
    return extractPaginated<TaskItem>(res.data, params?.limit ?? 20, params?.page ?? 1);
  },

  async getMyTimeSummary(params?: { startDate?: string; endDate?: string }): Promise<TaskTimeSummary> {
    const res = await httpClient.get<ApiResponse<TaskTimeSummary>>(TASK_ENDPOINTS.MY_TIME_SUMMARY, { params });
    return extractData(res);
  },

  async getTaskTimeSummary(id: string, params?: { startDate?: string; endDate?: string }): Promise<TaskTimeSummary> {
    const res = await httpClient.get<ApiResponse<TaskTimeSummary>>(TASK_ENDPOINTS.TASK_TIME_SUMMARY(id), { params });
    return extractData(res);
  },

  // ===========================================================================
  // Task Workflow & Reviews
  // ===========================================================================
  async submitTask(id: string, payload?: SubmitTaskPayload): Promise<TaskItem> {
    const res = await httpClient.post<ApiResponse<TaskItem>>(TASK_ENDPOINTS.SUBMIT_REVIEW(id), payload ?? {});
    return extractData(res);
  },

  async approveTask(id: string, payload?: ApproveTaskReviewPayload): Promise<TaskItem> {
    const res = await httpClient.post<ApiResponse<TaskItem>>(TASK_ENDPOINTS.APPROVE_REVIEW(id), payload ?? {});
    return extractData(res);
  },

  async requestChanges(id: string, payload: RequestChangesPayload): Promise<TaskItem> {
    const res = await httpClient.post<ApiResponse<TaskItem>>(TASK_ENDPOINTS.REQUEST_CHANGES(id), payload);
    return extractData(res);
  },

  async rejectTask(id: string, payload: RejectTaskReviewPayload): Promise<TaskItem> {
    const res = await httpClient.post<ApiResponse<TaskItem>>(TASK_ENDPOINTS.REJECT_REVIEW(id), payload);
    return extractData(res);
  },

  async listReviews(id: string): Promise<TaskReview[]> {
    const res = await httpClient.get<ApiResponse<TaskReview[]> | TaskReview[]>(TASK_ENDPOINTS.LIST_REVIEWS(id));
    const data = extractData<TaskReview[]>(res);
    return Array.isArray(data) ? data : [];
  },

  // ===========================================================================
  // Comments
  // ===========================================================================
  async addComment(id: string, payload: CreateTaskCommentPayload): Promise<TaskComment> {
    const res = await httpClient.post<ApiResponse<TaskComment>>(TASK_ENDPOINTS.ADD_COMMENT(id), payload);
    return extractData(res);
  },

  async listComments(id: string, params?: { page?: number; limit?: number }): Promise<{ items: TaskComment[]; total: number; hasMore: boolean }> {
    const res = await httpClient.get<ApiResponse<TaskComment[]>>(TASK_ENDPOINTS.LIST_COMMENTS(id), { params });
    return extractPaginated<TaskComment>(res.data, params?.limit ?? 50, params?.page ?? 1);
  },

  async updateComment(id: string, commentId: string, payload: UpdateTaskCommentPayload): Promise<TaskComment> {
    const res = await httpClient.patch<ApiResponse<TaskComment>>(TASK_ENDPOINTS.UPDATE_COMMENT(id, commentId), payload);
    return extractData(res);
  },

  async deleteComment(id: string, commentId: string): Promise<{ success: boolean; message?: string }> {
    const res = await httpClient.delete<ApiResponse<unknown>>(TASK_ENDPOINTS.DELETE_COMMENT(id, commentId));
    return extractData(res);
  },

  // ===========================================================================
  // Audit History
  // ===========================================================================
  async getAuditHistory(id: string): Promise<TaskAuditHistory> {
    const res = await httpClient.get<ApiResponse<TaskAuditHistory>>(TASK_ENDPOINTS.AUDIT_HISTORY(id));
    return extractData(res);
  },

  // ===========================================================================
  // Dashboards
  // ===========================================================================
  async getEmployeeDashboard(params?: QueryTaskDashboardParams): Promise<EmployeeDashboardData> {
    const res = await httpClient.get<ApiResponse<EmployeeDashboardData>>(TASK_ENDPOINTS.DASHBOARD_MY, { params });
    return extractData<EmployeeDashboardData>(res);
  },

  async getTeamDashboard(params?: QueryTaskDashboardParams): Promise<TeamDashboardData> {
    const res = await httpClient.get<ApiResponse<TeamDashboardData>>(TASK_ENDPOINTS.DASHBOARD_TEAM, { params });
    return extractData<TeamDashboardData>(res);
  },

  async getOrgDashboard(params?: QueryTaskDashboardParams): Promise<OrgDashboardData> {
    const res = await httpClient.get<ApiResponse<OrgDashboardData>>(TASK_ENDPOINTS.DASHBOARD_ORG, { params });
    return extractData<OrgDashboardData>(res);
  },

  // ===========================================================================
  // Reports
  // ===========================================================================
  async getSummaryReport(params?: QueryTaskReportsParams): Promise<TaskSummaryReportData> {
    const res = await httpClient.get<ApiResponse<TaskSummaryReportData>>(TASK_ENDPOINTS.REPORT_SUMMARY, { params });
    return extractData<TaskSummaryReportData>(res);
  },

  async getWorkingHoursReport(params?: QueryTaskReportsParams): Promise<WorkingHoursReportData> {
    const res = await httpClient.get<ApiResponse<WorkingHoursReportData>>(TASK_ENDPOINTS.REPORT_WORKING_HOURS, { params });
    return extractData<WorkingHoursReportData>(res);
  },

  async getPerformanceReport(params?: QueryTaskReportsParams): Promise<EmployeePerformanceReportData> {
    const res = await httpClient.get<ApiResponse<EmployeePerformanceReportData>>(TASK_ENDPOINTS.REPORT_PERFORMANCE, { params });
    return extractData<EmployeePerformanceReportData>(res);
  },

  async getOverdueReport(params?: QueryTaskReportsParams): Promise<OverdueTasksReportData> {
    const res = await httpClient.get<ApiResponse<OverdueTasksReportData>>(TASK_ENDPOINTS.REPORT_OVERDUE, { params });
    return extractData<OverdueTasksReportData>(res);
  },

  async getReviewsReport(params?: QueryTaskReportsParams): Promise<ReviewSummaryReportData> {
    const res = await httpClient.get<ApiResponse<ReviewSummaryReportData>>(TASK_ENDPOINTS.REPORT_REVIEWS, { params });
    return extractData<ReviewSummaryReportData>(res);
  },

  // ===========================================================================
  // Attachments
  // ===========================================================================
  async uploadAttachment(
    id: string,
    fileOrPayload: File | FormData | CreateTaskAttachmentPayload,
  ): Promise<TaskAttachment> {
    let headers: Record<string, string> | undefined;
    let data: FormData | CreateTaskAttachmentPayload;

    if (fileOrPayload instanceof FormData) {
      data = fileOrPayload;
      headers = { 'Content-Type': 'multipart/form-data' };
    } else if (fileOrPayload instanceof File) {
      const formData = new FormData();
      formData.append('file', fileOrPayload);
      data = formData;
      headers = { 'Content-Type': 'multipart/form-data' };
    } else {
      data = fileOrPayload;
    }

    const res = await httpClient.post<ApiResponse<TaskAttachment>>(
      TASK_ENDPOINTS.UPLOAD_ATTACHMENT(id),
      data,
      { headers },
    );
    return extractData(res);
  },

  async listAttachments(id: string): Promise<TaskAttachment[]> {
    const res = await httpClient.get<ApiResponse<TaskAttachment[]> | TaskAttachment[]>(TASK_ENDPOINTS.LIST_ATTACHMENTS(id));
    const data = extractData<TaskAttachment[]>(res);
    return Array.isArray(data) ? data : [];
  },

  async downloadAttachment(id: string, attachmentId: string): Promise<Blob> {
    const res = await httpClient.get(TASK_ENDPOINTS.DOWNLOAD_ATTACHMENT(id, attachmentId), {
      responseType: 'blob',
    });
    return res.data;
  },

  async previewAttachment(id: string, attachmentId: string): Promise<Blob> {
    const res = await httpClient.get(TASK_ENDPOINTS.PREVIEW_ATTACHMENT(id, attachmentId), {
      responseType: 'blob',
    });
    return res.data;
  },

  async rescanAttachment(id: string, attachmentId: string): Promise<unknown> {
    const res = await httpClient.post<ApiResponse<unknown>>(TASK_ENDPOINTS.RESCAN_ATTACHMENT(id, attachmentId), {});
    return extractData(res);
  },

  async deleteAttachment(id: string, attachmentId: string): Promise<{ success: boolean; message?: string }> {
    const res = await httpClient.delete<ApiResponse<unknown>>(TASK_ENDPOINTS.DELETE_ATTACHMENT(id, attachmentId));
    return extractData(res);
  },
};
