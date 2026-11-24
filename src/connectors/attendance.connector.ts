import { httpClient } from '@/api/client/httpClient';
import { ATTENDANCE_ENDPOINTS } from '@/api/endpoints/attendance.endpoints';
import {
  AttendanceRecord,
  TodayAttendanceResponse,
  ShiftDefinition,
  ShiftAssignment,
  WfhRequest,
  OvertimeRequest,
  CorrectionRequest,
  AnomalyRecord,
  ReconciliationRun,
  ReconciliationStatusResponse,
  CheckInPayload,
  CheckOutPayload,
  StartBreakPayload,
  EndBreakPayload,
  RecalculateAttendancePayload,
  CreateShiftDefinitionPayload,
  UpdateShiftDefinitionPayload,
  AssignShiftPayload,
  UpdateShiftAssignmentPayload,
  CreateWfhRequestPayload,
  RejectWfhRequestPayload,
  CreateOvertimeRequestPayload,
  ApproveOvertimeRequestPayload,
  RejectOvertimeRequestPayload,
  CreateCorrectionRequestPayload,
  ApproveCorrectionRequestPayload,
  RejectCorrectionRequestPayload,
  TriggerReconciliationPayload,
  ResolveAnomalyPayload,
  QueryAttendanceHistoryParams,
  QueryShiftsParams,
  QueryWfhRequestsParams,
  QueryOvertimeRequestsParams,
  QueryCorrectionRequestsParams,
  QueryReconciliationRunsParams,
  QueryAnomaliesParams,
  QueryReconciliationStatusParams,
} from '@/api/types/attendance.types';
import { extractData, extractPaginated } from '@/api/client/responseUnwrap';


export const attendanceConnector = {
  // -------------------------------------------------------------
  // Screen 1 & 2: Lifecycle & History
  // -------------------------------------------------------------

  // POST /api/attendance/check-in
  async checkIn(payload?: CheckInPayload): Promise<unknown> {
    const res = await httpClient.post<unknown>(ATTENDANCE_ENDPOINTS.CHECK_IN, payload || {});
    return extractData(res);
  },

  // POST /api/attendance/check-out
  async checkOut(payload?: CheckOutPayload): Promise<unknown> {
    const res = await httpClient.post<unknown>(ATTENDANCE_ENDPOINTS.CHECK_OUT, payload || {});
    return extractData(res);
  },

  // POST /api/attendance/breaks/start
  async startBreak(payload: StartBreakPayload): Promise<unknown> {
    const res = await httpClient.post<unknown>(ATTENDANCE_ENDPOINTS.START_BREAK, payload);
    return extractData(res);
  },

  // POST /api/attendance/breaks/end
  async endBreak(payload?: EndBreakPayload): Promise<unknown> {
    const res = await httpClient.post<unknown>(ATTENDANCE_ENDPOINTS.END_BREAK, payload || {});
    return extractData(res);
  },

  // GET /api/attendance/today
  async getTodayAttendance(): Promise<TodayAttendanceResponse> {
    const res = await httpClient.get<unknown>(ATTENDANCE_ENDPOINTS.TODAY);
    const data = (extractData<TodayAttendanceResponse>(res) || {}) as TodayAttendanceResponse & Record<string, unknown>;
    const hasActiveSession = Boolean(data.hasActiveSession || data.activeSession);
    const hasActiveBreak = Boolean(data.hasActiveBreak || data.activeBreak);

    let activeSession = data.activeSession;
    if (activeSession) {
      activeSession = {
        ...activeSession,
        checkInAt: activeSession.rawCheckInAt || activeSession.checkInAt || (activeSession as unknown as { createdAt?: string }).createdAt || '',
      };
    }

    return {
      ...data,
      hasActiveSession,
      hasActiveBreak,
      isCheckedIn: hasActiveSession,
      isOnBreak: hasActiveBreak,
      activeSession,
    };
  },

  // GET /api/attendance/history
  async getAttendanceHistory(params: QueryAttendanceHistoryParams = {}) {
    const res = await httpClient.get<unknown>(ATTENDANCE_ENDPOINTS.HISTORY, { params });
    return extractPaginated<AttendanceRecord>(res, params.limit || 20, params.page || 1);
  },

  // POST /api/attendance/records/:recordId/recalculate
  async recalculateRecord(recordId: string, payload: RecalculateAttendancePayload = {}): Promise<unknown> {
    const res = await httpClient.post<unknown>(ATTENDANCE_ENDPOINTS.RECALCULATE(recordId), payload);
    return extractData(res);
  },

  // -------------------------------------------------------------
  // Screen 3: Shifts Management
  // -------------------------------------------------------------

  // POST /api/attendance/shifts
  async createShiftDefinition(payload: CreateShiftDefinitionPayload): Promise<ShiftDefinition> {
    const res = await httpClient.post<ShiftDefinition>(ATTENDANCE_ENDPOINTS.SHIFTS, payload);
    return extractData(res);
  },

  // GET /api/attendance/shifts
  async listShiftDefinitions(params: QueryShiftsParams = {}) {
    const res = await httpClient.get<unknown>(ATTENDANCE_ENDPOINTS.SHIFTS, { params });
    return extractPaginated<ShiftDefinition>(res, params.limit || 20, params.page || 1);
  },

  // GET /api/attendance/shifts/my-assignments
  async getMyShiftAssignments(): Promise<ShiftAssignment[]> {
    const res = await httpClient.get<ShiftAssignment[]>(ATTENDANCE_ENDPOINTS.SHIFT_MY_ASSIGNMENTS);
    const data = extractData(res);
    return Array.isArray(data) ? data : [];
  },

  // GET /api/attendance/shifts/effective/:userId
  async getEffectiveShift(userId: string, date?: string): Promise<ShiftDefinition | null> {
    const res = await httpClient.get<unknown>(ATTENDANCE_ENDPOINTS.SHIFT_EFFECTIVE(userId), {
      params: date ? { date } : undefined,
    });
    return extractData(res);
  },

  // GET /api/attendance/shifts/assignments/:userId
  async getEmployeeShiftAssignments(userId: string): Promise<ShiftAssignment[]> {
    const res = await httpClient.get<ShiftAssignment[]>(ATTENDANCE_ENDPOINTS.SHIFT_EMPLOYEE_ASSIGNMENTS(userId));
    const data = extractData(res);
    return Array.isArray(data) ? data : [];
  },

  // POST /api/attendance/shifts/assign
  async assignShift(payload: AssignShiftPayload): Promise<ShiftAssignment> {
    const res = await httpClient.post<ShiftAssignment>(ATTENDANCE_ENDPOINTS.SHIFT_ASSIGN, payload);
    return extractData(res);
  },

  // PATCH /api/attendance/shifts/assignments/:assignmentId
  async updateShiftAssignment(assignmentId: string, payload: UpdateShiftAssignmentPayload): Promise<ShiftAssignment> {
    const res = await httpClient.patch<ShiftAssignment>(ATTENDANCE_ENDPOINTS.SHIFT_ASSIGNMENT_ITEM(assignmentId), payload);
    return extractData(res);
  },

  // DELETE /api/attendance/shifts/assignments/:assignmentId
  async deleteShiftAssignment(assignmentId: string): Promise<unknown> {
    const res = await httpClient.delete<unknown>(ATTENDANCE_ENDPOINTS.SHIFT_ASSIGNMENT_ITEM(assignmentId));
    return extractData(res);
  },

  // GET /api/attendance/shifts/:id
  async getShiftDefinitionById(id: string): Promise<ShiftDefinition> {
    const res = await httpClient.get<ShiftDefinition>(ATTENDANCE_ENDPOINTS.SHIFT_BY_ID(id));
    return extractData(res);
  },

  // PATCH /api/attendance/shifts/:id
  async updateShiftDefinition(id: string, payload: UpdateShiftDefinitionPayload): Promise<ShiftDefinition> {
    const res = await httpClient.patch<ShiftDefinition>(ATTENDANCE_ENDPOINTS.SHIFT_BY_ID(id), payload);
    return extractData(res);
  },

  // DELETE /api/attendance/shifts/:id
  async deleteShiftDefinition(id: string): Promise<unknown> {
    const res = await httpClient.delete<unknown>(ATTENDANCE_ENDPOINTS.SHIFT_BY_ID(id));
    return extractData(res);
  },

  // -------------------------------------------------------------
  // Screen 5: Overtime Requests
  // -------------------------------------------------------------

  // POST /api/attendance/overtime
  async createOvertimeRequest(payload: CreateOvertimeRequestPayload): Promise<OvertimeRequest> {
    const res = await httpClient.post<OvertimeRequest>(ATTENDANCE_ENDPOINTS.OVERTIME_SUBMIT, payload);
    return extractData(res);
  },

  // GET /api/attendance/overtime/my-requests
  async getMyOvertimeRequests(params: QueryOvertimeRequestsParams = {}) {
    const res = await httpClient.get<unknown>(ATTENDANCE_ENDPOINTS.OVERTIME_MY, { params });
    return extractPaginated<OvertimeRequest>(res, params.limit || 20, params.page || 1);
  },

  // GET /api/attendance/overtime
  async listOvertimeRequests(params: QueryOvertimeRequestsParams = {}) {
    const res = await httpClient.get<unknown>(ATTENDANCE_ENDPOINTS.OVERTIME_LIST, { params });
    return extractPaginated<OvertimeRequest>(res, params.limit || 20, params.page || 1);
  },

  // POST /api/attendance/overtime/:id/approve
  async approveOvertimeRequest(id: string, payload: ApproveOvertimeRequestPayload = {}): Promise<OvertimeRequest> {
    const res = await httpClient.post<OvertimeRequest>(ATTENDANCE_ENDPOINTS.OVERTIME_APPROVE(id), payload);
    return extractData(res);
  },

  // POST /api/attendance/overtime/:id/reject
  async rejectOvertimeRequest(id: string, payload: RejectOvertimeRequestPayload = {}): Promise<OvertimeRequest> {
    const res = await httpClient.post<OvertimeRequest>(ATTENDANCE_ENDPOINTS.OVERTIME_REJECT(id), payload);
    return extractData(res);
  },

  // POST /api/attendance/overtime/:id/cancel
  async cancelOvertimeRequest(id: string): Promise<unknown> {
    const res = await httpClient.post<unknown>(ATTENDANCE_ENDPOINTS.OVERTIME_CANCEL(id), {});
    return extractData(res);
  },

  // -------------------------------------------------------------
  // Screen 4: WFH Requests
  // -------------------------------------------------------------

  // POST /api/attendance/wfh
  async createWfhRequest(payload: CreateWfhRequestPayload): Promise<WfhRequest> {
    const res = await httpClient.post<WfhRequest>(ATTENDANCE_ENDPOINTS.WFH_SUBMIT, payload);
    return extractData(res);
  },

  // GET /api/attendance/wfh/my-requests
  async getMyWfhRequests(params: QueryWfhRequestsParams = {}) {
    const res = await httpClient.get<unknown>(ATTENDANCE_ENDPOINTS.WFH_MY, { params });
    return extractPaginated<WfhRequest>(res, params.limit || 20, params.page || 1);
  },

  // GET /api/attendance/wfh
  async listWfhRequests(params: QueryWfhRequestsParams = {}) {
    const res = await httpClient.get<unknown>(ATTENDANCE_ENDPOINTS.WFH_LIST, { params });
    return extractPaginated<WfhRequest>(res, params.limit || 20, params.page || 1);
  },

  // POST /api/attendance/wfh/:id/approve
  async approveWfhRequest(id: string): Promise<WfhRequest> {
    const res = await httpClient.post<WfhRequest>(ATTENDANCE_ENDPOINTS.WFH_APPROVE(id), {});
    return extractData(res);
  },

  // POST /api/attendance/wfh/:id/reject
  async rejectWfhRequest(id: string, payload: RejectWfhRequestPayload = {}): Promise<WfhRequest> {
    const res = await httpClient.post<WfhRequest>(ATTENDANCE_ENDPOINTS.WFH_REJECT(id), payload);
    return extractData(res);
  },

  // POST /api/attendance/wfh/:id/cancel
  async cancelWfhRequest(id: string): Promise<unknown> {
    const res = await httpClient.post<unknown>(ATTENDANCE_ENDPOINTS.WFH_CANCEL(id), {});
    return extractData(res);
  },

  // -------------------------------------------------------------
  // Screen 6: Attendance Corrections
  // -------------------------------------------------------------

  // POST /api/attendance/corrections
  async createCorrectionRequest(payload: CreateCorrectionRequestPayload): Promise<CorrectionRequest> {
    const res = await httpClient.post<CorrectionRequest>(ATTENDANCE_ENDPOINTS.CORRECTION_SUBMIT, payload);
    return extractData(res);
  },

  // GET /api/attendance/corrections/my-requests
  async getMyCorrectionRequests(params: QueryCorrectionRequestsParams = {}) {
    const res = await httpClient.get<unknown>(ATTENDANCE_ENDPOINTS.CORRECTION_MY, { params });
    return extractPaginated<CorrectionRequest>(res, params.limit || 20, params.page || 1);
  },

  // GET /api/attendance/corrections
  async listCorrectionRequests(params: QueryCorrectionRequestsParams = {}) {
    const res = await httpClient.get<unknown>(ATTENDANCE_ENDPOINTS.CORRECTION_LIST, { params });
    return extractPaginated<CorrectionRequest>(res, params.limit || 20, params.page || 1);
  },

  // GET /api/attendance/corrections/:id
  async getCorrectionRequestById(id: string): Promise<CorrectionRequest> {
    const res = await httpClient.get<CorrectionRequest>(ATTENDANCE_ENDPOINTS.CORRECTION_BY_ID(id));
    return extractData(res);
  },

  // POST /api/attendance/corrections/:id/cancel
  async cancelCorrectionRequest(id: string): Promise<unknown> {
    const res = await httpClient.post<unknown>(ATTENDANCE_ENDPOINTS.CORRECTION_CANCEL(id), {});
    return extractData(res);
  },

  // POST /api/attendance/corrections/:id/approve
  async approveCorrectionRequest(id: string, payload: ApproveCorrectionRequestPayload = {}): Promise<CorrectionRequest> {
    const res = await httpClient.post<CorrectionRequest>(ATTENDANCE_ENDPOINTS.CORRECTION_APPROVE(id), payload);
    return extractData(res);
  },

  // POST /api/attendance/corrections/:id/reject
  async rejectCorrectionRequest(id: string, payload: RejectCorrectionRequestPayload = {}): Promise<CorrectionRequest> {
    const res = await httpClient.post<CorrectionRequest>(ATTENDANCE_ENDPOINTS.CORRECTION_REJECT(id), payload);
    return extractData(res);
  },

  // -------------------------------------------------------------
  // Screen 8: EOD Reconciliation
  // -------------------------------------------------------------

  // POST /api/attendance/reconciliation/run
  async triggerReconciliation(payload: TriggerReconciliationPayload): Promise<unknown> {
    const res = await httpClient.post<unknown>(ATTENDANCE_ENDPOINTS.RECONCILIATION_RUN, payload);
    return extractData(res);
  },

  // GET /api/attendance/reconciliation/runs
  async listReconciliationRuns(params: QueryReconciliationRunsParams = {}) {
    const res = await httpClient.get<unknown>(ATTENDANCE_ENDPOINTS.RECONCILIATION_RUNS, { params });
    return extractPaginated<ReconciliationRun>(res, params.limit || 20, params.page || 1);
  },

  // GET /api/attendance/reconciliation/runs/:id
  async getReconciliationRunDetails(id: string): Promise<ReconciliationRun> {
    const res = await httpClient.get<ReconciliationRun>(ATTENDANCE_ENDPOINTS.RECONCILIATION_RUN_BY_ID(id));
    return extractData(res);
  },

  // GET /api/attendance/reconciliation/status
  async getReconciliationStatus(params: QueryReconciliationStatusParams): Promise<ReconciliationStatusResponse> {
    const res = await httpClient.get<ReconciliationStatusResponse>(ATTENDANCE_ENDPOINTS.RECONCILIATION_STATUS, {
      params,
    });
    return extractData(res);
  },

  // -------------------------------------------------------------
  // Screen 7: Quarantined Anomalies
  // -------------------------------------------------------------

  // GET /api/attendance/anomalies
  async listAnomalies(params: QueryAnomaliesParams = {}) {
    const res = await httpClient.get<unknown>(ATTENDANCE_ENDPOINTS.ANOMALIES_LIST, { params });
    return extractPaginated<AnomalyRecord>(res, params.limit || 20, params.page || 1);
  },

  // GET /api/attendance/anomalies/:recordId
  async getAnomalyDetails(recordId: string): Promise<AnomalyRecord> {
    const res = await httpClient.get<AnomalyRecord>(ATTENDANCE_ENDPOINTS.ANOMALY_BY_ID(recordId));
    return extractData(res);
  },

  // POST /api/attendance/anomalies/:recordId/resolve
  async resolveAnomaly(recordId: string, payload: ResolveAnomalyPayload): Promise<unknown> {
    const res = await httpClient.post<unknown>(ATTENDANCE_ENDPOINTS.ANOMALY_RESOLVE(recordId), payload);
    return extractData(res);
  },
};
