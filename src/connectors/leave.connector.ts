import { httpClient } from '@/api/client/httpClient';
import { LEAVE_ENDPOINTS } from '@/api/endpoints/leave.endpoints';
import {
  LeaveType,
  Holiday,
  WeeklyOffPolicy,
  LeaveRequest,
  LeaveBalance,
  LeaveTransaction,
  LeaveCalendarItem,
  LeaveReportSummary,
  CreateLeaveTypePayload,
  UpdateLeaveTypePayload,
  CreatePolicyVersionPayload,
  CreateHolidayPayload,
  UpdateHolidayPayload,
  SyncGoogleHolidaysPayload,
  CreateWeeklyOffPolicyPayload,
  ApplyLeaveRequestPayload,
  ReviewLeaveRequestPayload,
  CreateCancellationPayload,
  ReviewCancellationPayload,
  AdjustLeaveBalancePayload,
  QueryLeaveRequestsParams,
  QueryLeaveBalancesParams,
  QueryLeaveTransactionsParams,
  QueryHolidaysParams,
  QueryWeeklyOffPoliciesParams,
  QueryLeaveCalendarParams,
  QueryLeaveReportParams,
} from '@/api/types/leave.types';

import { extractData, extractPaginated } from '@/api/client/responseUnwrap';

export const leaveConnector = {
  // -------------------------------------------------------------
  // LEAVE TYPES & POLICIES
  // -------------------------------------------------------------

  /** POST /api/leave/types */
  async createLeaveType(payload: CreateLeaveTypePayload): Promise<LeaveType> {
    const res = await httpClient.post(LEAVE_ENDPOINTS.TYPES, payload);
    return extractData<LeaveType>(res);
  },

  /** GET /api/leave/types */
  async getLeaveTypes(includeInactive = false): Promise<LeaveType[]> {
    const res = await httpClient.get(LEAVE_ENDPOINTS.TYPES, { params: { includeInactive } });
    const data = extractData<Record<string, unknown>>(res);
    return Array.isArray(data) ? (data as LeaveType[]) : (((data as Record<string, unknown>)?.types || []) as LeaveType[]);
  },

  /** GET /api/leave/types/:id */
  async getLeaveTypeById(id: string): Promise<LeaveType> {
    const res = await httpClient.get(LEAVE_ENDPOINTS.TYPE_BY_ID(id));
    return extractData<LeaveType>(res);
  },

  /** PATCH /api/leave/types/:id */
  async updateLeaveType(id: string, payload: UpdateLeaveTypePayload): Promise<LeaveType> {
    const cleanPayload: Record<string, unknown> = { ...payload };
    if (cleanPayload.isActive !== undefined) {
      if (!cleanPayload.status) {
        cleanPayload.status = cleanPayload.isActive ? 'ACTIVE' : 'INACTIVE';
      }
      delete cleanPayload.isActive;
    }
    const res = await httpClient.patch(LEAVE_ENDPOINTS.TYPE_BY_ID(id), cleanPayload);
    return extractData<LeaveType>(res);
  },

  /** POST /api/leave/types/:id/versions */
  async createPolicyVersion(id: string, payload: CreatePolicyVersionPayload): Promise<unknown> {
    const res = await httpClient.post(LEAVE_ENDPOINTS.TYPE_VERSIONS(id), payload);
    return extractData(res);
  },

  // -------------------------------------------------------------
  // HOLIDAYS & WEEKLY-OFFS
  // -------------------------------------------------------------

  /** POST /api/leave/holidays */
  async createHoliday(payload: CreateHolidayPayload): Promise<Holiday> {
    const res = await httpClient.post(LEAVE_ENDPOINTS.HOLIDAYS, payload);
    return extractData<Holiday>(res);
  },

  /** GET /api/leave/holidays */
  async getHolidays(params?: QueryHolidaysParams): Promise<Holiday[]> {
    const res = await httpClient.get(LEAVE_ENDPOINTS.HOLIDAYS, { params });
    const data = extractData<Record<string, unknown>>(res);
    return Array.isArray(data) ? (data as Holiday[]) : (((data as Record<string, unknown>)?.holidays || []) as Holiday[]);
  },

  /** PATCH /api/leave/holidays/:id */
  async updateHoliday(id: string, payload: UpdateHolidayPayload): Promise<Holiday> {
    const res = await httpClient.patch(LEAVE_ENDPOINTS.HOLIDAY_BY_ID(id), payload);
    return extractData<Holiday>(res);
  },

  /** DELETE /api/leave/holidays/:id */
  async deleteHoliday(id: string): Promise<void> {
    await httpClient.delete(LEAVE_ENDPOINTS.HOLIDAY_BY_ID(id));
  },

  /** GET /api/leave/holidays/calendar.ics */
  getHolidaysIcsUrl(year = 2026): string {
    const base = import.meta.env.VITE_API_BASE_URL || 'http://192.168.0.16:5000';
    return `${base}${LEAVE_ENDPOINTS.HOLIDAYS_ICS}?year=${year}`;
  },

  /** POST /api/leave/holidays/sync-google-calendar */
  async syncGoogleHolidays(payload: SyncGoogleHolidaysPayload): Promise<{ message: string; count?: number }> {
    const res = await httpClient.post(LEAVE_ENDPOINTS.SYNC_GOOGLE_HOLIDAYS, payload);
    return extractData(res);
  },

  /** POST /api/leave/weekly-off-policies */
  async createWeeklyOffPolicy(payload: CreateWeeklyOffPolicyPayload): Promise<WeeklyOffPolicy> {
    const res = await httpClient.post(LEAVE_ENDPOINTS.WEEKLY_OFF_POLICIES, payload);
    return extractData<WeeklyOffPolicy>(res);
  },

  /** GET /api/leave/weekly-off-policies */
  async getWeeklyOffPolicies(params?: QueryWeeklyOffPoliciesParams): Promise<WeeklyOffPolicy[]> {
    const res = await httpClient.get(LEAVE_ENDPOINTS.WEEKLY_OFF_POLICIES, { params });
    const data = extractData<Record<string, unknown>>(res);
    return Array.isArray(data) ? (data as WeeklyOffPolicy[]) : (((data as Record<string, unknown>)?.policies || []) as WeeklyOffPolicy[]);
  },

  // -------------------------------------------------------------
  // LEAVE APPLICATIONS & WORKFLOW
  // -------------------------------------------------------------

  /** POST /api/leave/requests */
  async applyLeave(payload: ApplyLeaveRequestPayload): Promise<LeaveRequest> {
    const res = await httpClient.post(LEAVE_ENDPOINTS.REQUESTS, payload);
    return extractData<LeaveRequest>(res);
  },

  /** GET /api/leave/requests/my */
  async getMyLeaveRequests(params?: QueryLeaveRequestsParams): Promise<{ items: LeaveRequest[]; total: number; hasMore: boolean }> {
    const res = await httpClient.get(LEAVE_ENDPOINTS.MY_REQUESTS, { params });
    return extractPaginated<LeaveRequest>(res, params?.limit || 20, params?.page || 1);
  },

  /** GET /api/leave/requests (Manager/HR) */
  async getLeaveRequests(params?: QueryLeaveRequestsParams): Promise<{ items: LeaveRequest[]; total: number; hasMore: boolean }> {
    const res = await httpClient.get(LEAVE_ENDPOINTS.REQUESTS, { params });
    return extractPaginated<LeaveRequest>(res, params?.limit || 20, params?.page || 1);
  },

  /** GET /api/leave/requests/:id */
  async getLeaveRequestById(id: string): Promise<LeaveRequest> {
    const res = await httpClient.get(LEAVE_ENDPOINTS.REQUEST_BY_ID(id));
    return extractData<LeaveRequest>(res);
  },

  /** POST /api/leave/requests/:id/review */
  async reviewLeaveRequest(id: string, payload: ReviewLeaveRequestPayload): Promise<LeaveRequest> {
    const res = await httpClient.post(LEAVE_ENDPOINTS.REVIEW_REQUEST(id), payload);
    return extractData<LeaveRequest>(res);
  },

  /** POST /api/leave/requests/:id/cancel */
  async cancelLeaveRequest(id: string, payload: CreateCancellationPayload): Promise<{ message: string; request?: LeaveRequest }> {
    const res = await httpClient.post(LEAVE_ENDPOINTS.CANCEL_REQUEST(id), payload);
    return extractData(res);
  },

  /** POST /api/leave/cancellations/:id/review */
  async reviewCancellationRequest(id: string, payload: ReviewCancellationPayload): Promise<LeaveRequest> {
    const res = await httpClient.post(LEAVE_ENDPOINTS.REVIEW_CANCELLATION(id), payload);
    return extractData<LeaveRequest>(res);
  },

  // -------------------------------------------------------------
  // BALANCES & TRANSACTIONS
  // -------------------------------------------------------------

  /** GET /api/leave/balances/my */
  async getMyBalances(year?: number): Promise<LeaveBalance[]> {
    const res = await httpClient.get(LEAVE_ENDPOINTS.MY_BALANCES, { params: { year } });
    const data = extractData<Record<string, unknown>>(res);
    return Array.isArray(data) ? (data as LeaveBalance[]) : (((data as Record<string, unknown>)?.balances || []) as LeaveBalance[]);
  },

  /** GET /api/leave/balances */
  async getEmployeeBalances(params?: QueryLeaveBalancesParams): Promise<{ items: LeaveBalance[]; total: number; hasMore: boolean }> {
    const res = await httpClient.get(LEAVE_ENDPOINTS.BALANCES, { params });
    return extractPaginated<LeaveBalance>(res, params?.limit || 20, params?.page || 1);
  },

  /** POST /api/leave/balances/adjust */
  async adjustLeaveBalance(payload: AdjustLeaveBalancePayload): Promise<unknown> {
    const res = await httpClient.post(LEAVE_ENDPOINTS.ADJUST_BALANCE, payload);
    return extractData(res);
  },

  /** GET /api/leave/transactions */
  async getTransactions(params?: QueryLeaveTransactionsParams): Promise<{ items: LeaveTransaction[]; total: number; hasMore: boolean }> {
    const res = await httpClient.get(LEAVE_ENDPOINTS.TRANSACTIONS, { params });
    return extractPaginated<LeaveTransaction>(res, params?.limit || 50, params?.page || 1);
  },

  // -------------------------------------------------------------
  // CALENDAR & REPORTS
  // -------------------------------------------------------------

  /** GET /api/leave/calendar */
  async getLeaveCalendar(params?: QueryLeaveCalendarParams): Promise<LeaveCalendarItem[]> {
    const res = await httpClient.get(LEAVE_ENDPOINTS.CALENDAR, { params });
    const data = extractData<Record<string, unknown>>(res);
    return Array.isArray(data) ? (data as LeaveCalendarItem[]) : (((data as Record<string, unknown>)?.calendar || (data as Record<string, unknown>)?.items || []) as LeaveCalendarItem[]);
  },

  /** GET /api/leave/reports/summary */
  async getLeaveReportSummary(params?: QueryLeaveReportParams): Promise<LeaveReportSummary> {
    const res = await httpClient.get(LEAVE_ENDPOINTS.REPORTS_SUMMARY, { params });
    return extractData<LeaveReportSummary>(res);
  },
};
