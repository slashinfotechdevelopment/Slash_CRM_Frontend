import { httpClient } from '@/api/client/httpClient';
import { ADMIN_ENDPOINTS } from '@/api/endpoints/admin.endpoints';
import {
  EmployeeActivityResponse,
  EmployeeSessionsResponse,
  EmployeeTasksResponse,
  TasksSummaryResponse,
  AdminLeadsSummaryResponse,
  LeadsByEmployeeItem,
  LeadTrendPoint,
  LeadSourceItem,
  QueryEmployeeActivityParams,
  QueryEmployeeSessionsParams,
  QueryEmployeeTasksParams,
  QueryDateRangeParams,
  QueryLeadTrendParams,
} from '@/api/types/admin.types';

import { extractData } from '@/api/client/responseUnwrap';


export const adminConnector = {
  // -------------------------------------------------------------
  // EMPLOYEE ACTIVITY & SESSIONS
  // -------------------------------------------------------------

  /** GET /api/admin/employees/activity */
  async getEmployeeActivity(params?: QueryEmployeeActivityParams): Promise<EmployeeActivityResponse> {
    const res = await httpClient.get(ADMIN_ENDPOINTS.EMPLOYEE_ACTIVITY, { params });
    return extractData<EmployeeActivityResponse>(res);
  },

  /** GET /api/admin/employees/:id/sessions */
  async getEmployeeSessions(id: string, params?: QueryEmployeeSessionsParams): Promise<EmployeeSessionsResponse> {
    const res = await httpClient.get(ADMIN_ENDPOINTS.EMPLOYEE_SESSIONS(id), { params });
    return extractData<EmployeeSessionsResponse>(res);
  },

  // -------------------------------------------------------------
  // TASKS OVERSIGHT
  // -------------------------------------------------------------

  /** GET /api/admin/employees/:id/tasks */
  async getEmployeeTasks(id: string, params?: QueryEmployeeTasksParams): Promise<EmployeeTasksResponse> {
    const res = await httpClient.get(ADMIN_ENDPOINTS.EMPLOYEE_TASKS(id), { params });
    return extractData<EmployeeTasksResponse>(res);
  },

  /** GET /api/admin/tasks/summary */
  async getTasksSummary(params?: QueryDateRangeParams): Promise<TasksSummaryResponse> {
    const res = await httpClient.get(ADMIN_ENDPOINTS.TASKS_SUMMARY, { params });
    return extractData<TasksSummaryResponse>(res);
  },

  // -------------------------------------------------------------
  // LEADS INTELLIGENCE
  // -------------------------------------------------------------

  /** GET /api/admin/leads/summary */
  async getLeadsSummary(params?: QueryDateRangeParams): Promise<AdminLeadsSummaryResponse> {
    const res = await httpClient.get(ADMIN_ENDPOINTS.LEADS_SUMMARY, { params });
    return extractData<AdminLeadsSummaryResponse>(res);
  },

  /** GET /api/admin/leads/by-employee */
  async getLeadsByEmployee(params?: QueryDateRangeParams): Promise<LeadsByEmployeeItem[]> {
    const res = await httpClient.get(ADMIN_ENDPOINTS.LEADS_BY_EMPLOYEE, { params });
    const data = extractData<Record<string, unknown>>(res);
    return Array.isArray(data) ? (data as LeadsByEmployeeItem[]) : (((data as Record<string, unknown>)?.employees || (data as Record<string, unknown>)?.items || []) as LeadsByEmployeeItem[]);
  },

  /** GET /api/admin/leads/trend */
  async getLeadsTrend(params?: QueryLeadTrendParams): Promise<LeadTrendPoint[]> {
    const res = await httpClient.get(ADMIN_ENDPOINTS.LEADS_TREND, { params });
    const data = extractData<Record<string, unknown>>(res);
    return Array.isArray(data) ? (data as LeadTrendPoint[]) : (((data as Record<string, unknown>)?.trend || (data as Record<string, unknown>)?.items || []) as LeadTrendPoint[]);
  },

  /** GET /api/admin/leads/by-source */
  async getLeadsBySource(params?: QueryDateRangeParams): Promise<LeadSourceItem[]> {
    const res = await httpClient.get(ADMIN_ENDPOINTS.LEADS_BY_SOURCE, { params });
    const data = extractData<Record<string, unknown>>(res);
    return Array.isArray(data) ? (data as LeadSourceItem[]) : (((data as Record<string, unknown>)?.sources || (data as Record<string, unknown>)?.items || []) as LeadSourceItem[]);
  },
};
