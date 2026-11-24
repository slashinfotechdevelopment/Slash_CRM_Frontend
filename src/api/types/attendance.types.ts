export type AttendanceStatus =
  | 'PRESENT'
  | 'HALF_DAY'
  | 'ABSENT'
  | 'ON_LEAVE'
  | 'WEEKLY_OFF'
  | 'HOLIDAY'
  | 'PENDING_RECONCILIATION';

export type AttendanceSessionStatus =
  | 'ACTIVE'
  | 'COMPLETED'
  | 'AUTO_CLOSED'
  | 'QUARANTINED'
  | 'REJECTED';

export type AttendanceCorrectionStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'CANCELLED';

export type OvertimeApprovalStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'CANCELLED';

export type WfhStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'CANCELLED';

export type ReconciliationRunStatus =
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'FAILED'
  | 'PARTIAL';

export type VerificationOutcome =
  | 'VERIFIED'
  | 'REJECTED'
  | 'INCONCLUSIVE';

export type AnomalyStatus =
  | 'ACTIVE'
  | 'RESOLVED'
  | 'DISMISSED';

export type CorrectionType =
  | 'MISSED_CHECK_IN'
  | 'MISSED_CHECK_OUT'
  | 'INCORRECT_CHECK_IN'
  | 'INCORRECT_CHECK_OUT'
  | 'INCORRECT_BREAK'
  | 'OTHER';

export type AnomalyResolutionAction = 'RESOLVE' | 'DISMISS';

export interface BreakTypeConfig {
  code?: string;
  breakTypeId?: string;
  name?: string;
  maxDurationMinutes: number;
  isPaid?: boolean;
  maxOccurrencesPerDay?: number;
}

export interface BreakPolicy {
  paidAllowanceMinutes: number;
  breakTypes: BreakTypeConfig[];
}

export interface ShiftDefinition {
  id: string;
  code: string;
  name: string;
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  isOvernight: boolean;
  gracePeriodMinutes: number;
  halfDayThresholdMinutes: number;
  fullDayThresholdMinutes: number;
  overtimeThresholdMinutes?: number;
  allowMultipleSessions?: boolean;
  autoCloseGraceMinutes?: number;
  breakPolicy?: BreakPolicy;
  breakPolicySnapshot?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}

export interface ShiftAssignment {
  id: string;
  userId: string;
  shiftDefinitionId: string;
  startDate: string;
  endDate?: string | null;
  createdAt?: string;
  shiftDefinition?: ShiftDefinition;
  user?: {
    id: string;
    name: string;
    email: string;
    code?: string;
    profile?: { designation?: string };
  };
}

export interface AttendanceBreak {
  id: string;
  attendanceSessionId?: string;
  breakTypeId: string;
  breakTypeSnapshot?: Record<string, unknown>;
  startedAt: string;
  endedAt?: string | null;
  durationSeconds?: number;
  paidSeconds?: number;
  unpaidSeconds?: number;
  remarks?: string;
}

export interface AttendanceSession {
  id: string;
  attendanceRecordId: string;
  sessionNumber?: number;
  status: AttendanceSessionStatus;
  checkInAt: string;
  rawCheckInAt?: string;
  checkInTimeFormatted?: string;
  checkOutAt?: string | null;
  grossMinutes?: number;
  netMinutes?: number;
  location?: string;
  deviceInfo?: string;
  remarks?: string;
  breaks?: AttendanceBreak[];
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  employeeId?: string;
  employeeName?: string;
  employeeCode?: string;
  employeeEmail?: string;
  designation?: string;
  department?: string;
  departmentId?: string;
  avatarUrl?: string | null;
  attendanceDate: string;
  date?: string;
  workDate?: string;
  dateDisplay?: string;
  shiftDefinitionId?: string | null;
  shiftSnapshot?: Record<string, unknown>;
  status: AttendanceStatus;
  grossMinutes?: number;
  netMinutes?: number;
  paidBreakMinutes?: number;
  unpaidBreakMinutes?: number;
  overtimeMinutes?: number;
  lateArrivalMinutes?: number;
  earlyDepartureMinutes?: number;
  grossWorkingDurationSeconds?: number;
  netWorkingDurationSeconds?: number;
  paidBreakDurationSeconds?: number;
  unpaidBreakDurationSeconds?: number;
  verifiedOvertimeSeconds?: number;
  hasIntegrityAnomaly?: boolean;
  sessions?: AttendanceSession[];
  breaks?: unknown[];
  user?: {
    id: string;
    name: string;
    email: string;
    code?: string;
    profile?: { designation?: string };
    departmentMemberships?: Array<{
      department: { id: string; name: string; code: string };
      isPrimary?: boolean;
    }>;
  };
  shiftDefinition?: ShiftDefinition;
  shift?: ShiftDefinition | { id: string; code: string; name: string; startTime?: string; endTime?: string; timeRangeDisplay?: string };
}

export interface TodayAttendanceResponse {
  date?: string;
  dateFormatted?: string;
  record: AttendanceRecord | null;
  activeSession: AttendanceSession | null;
  activeBreak: AttendanceBreak | null;
  effectiveShift: ShiftDefinition | null;
  isCheckedIn: boolean;
  isOnBreak: boolean;
  hasActiveSession?: boolean;
  hasActiveBreak?: boolean;
  totalGrossSecondsToday?: number;
  totalNetSecondsToday?: number;
}

export interface WfhRequest {
  id: string;
  userId: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: WfhStatus;
  reviewerId?: string | null;
  reviewerNotes?: string | null;
  reviewedAt?: string | null;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    code?: string;
  };
  reviewer?: {
    id: string;
    name: string;
  };
}

export interface OvertimeRequest {
  id: string;
  userId: string;
  attendanceDate: string;
  startTime: string;
  endTime: string;
  durationMinutes?: number;
  approvedDurationMinutes?: number;
  reason: string;
  status: OvertimeApprovalStatus;
  reviewerId?: string | null;
  managerNotes?: string | null;
  reviewedAt?: string | null;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    code?: string;
  };
  reviewer?: {
    id: string;
    name: string;
  };
}

export interface CorrectionRequest {
  id: string;
  userId: string;
  attendanceDate: string;
  attendanceSessionId?: string | null;
  attendanceBreakId?: string | null;
  correctionType: CorrectionType;
  requestedCheckInAt?: string | null;
  requestedCheckOutAt?: string | null;
  requestedBreakStartedAt?: string | null;
  requestedBreakEndedAt?: string | null;
  reason: string;
  status: AttendanceCorrectionStatus;
  reviewerId?: string | null;
  managerNotes?: string | null;
  reviewedAt?: string | null;
  evidenceMetadata?: Record<string, unknown>;
  evidenceVerifications?: unknown[];
  createdAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    code?: string;
  };
  reviewer?: {
    id: string;
    name: string;
  };
}

export interface AnomalyRecord {
  id: string;
  attendanceRecordId: string;
  userId?: string;
  anomalyType: string;
  description?: string;
  status: AnomalyStatus;
  isResolved?: boolean;
  resolvedBy?: string | null;
  resolutionNotes?: string | null;
  resolvedAt?: string | null;
  createdAt: string;
  attendanceRecord?: AttendanceRecord;
  user?: {
    id: string;
    name: string;
    email: string;
    code?: string;
  };
}

export interface ReconciliationRun {
  id: string;
  targetDate: string;
  status: ReconciliationRunStatus;
  totalRecordsProcessed?: number;
  reconciledRecordsCount?: number;
  anomaliesCount?: number;
  executionDurationMs?: number;
  triggerSource?: string;
  logs?: unknown;
  initiatedBy?: string | null;
  createdAt: string;
}

export interface ReconciliationStatusResponse {
  isReconciled: boolean;
  targetDate: string;
  userId: string;
  record?: AttendanceRecord | null;
  anomalies?: AnomalyRecord[];
}

// Request Payloads
export interface CheckInPayload {
  location?: string;
  deviceInfo?: string;
  remarks?: string;
}

export interface CheckOutPayload {
  location?: string;
  remarks?: string;
}

export interface StartBreakPayload {
  breakTypeId: string;
  remarks?: string;
}

export interface EndBreakPayload {
  remarks?: string;
}

export interface RecalculateAttendancePayload {
  triggerSource?: string;
}

export interface CreateShiftDefinitionPayload {
  code: string;
  name: string;
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  isOvernight?: boolean;
  gracePeriodMinutes?: number;
  halfDayThresholdMinutes?: number;
  fullDayThresholdMinutes?: number;
  overtimeThresholdMinutes?: number;
  allowMultipleSessions?: boolean;
  autoCloseGraceMinutes?: number;
  breakPolicy?: BreakPolicy;
  paidBreakAllowance?: number;
}

export type UpdateShiftDefinitionPayload = Partial<CreateShiftDefinitionPayload>;

export interface AssignShiftPayload {
  userId: string;
  shiftDefinitionId: string;
  startDate: string; // YYYY-MM-DD
  endDate?: string;  // YYYY-MM-DD
}

export interface UpdateShiftAssignmentPayload {
  shiftDefinitionId?: string;
  startDate?: string;
  endDate?: string;
}

export interface CreateWfhRequestPayload {
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  reason: string;
}

export interface RejectWfhRequestPayload {
  rejectionReason?: string;
  managerNotes?: string;
  notes?: string;
}

export interface CreateOvertimeRequestPayload {
  attendanceDate: string; // YYYY-MM-DD
  startTime: string;      // ISO 8601
  endTime: string;        // ISO 8601
  reason: string;
}

export interface ApproveOvertimeRequestPayload {
  approvedDurationMinutes?: number;
  approvedMinutes?: number;
  managerNotes?: string;
  notes?: string;
}

export interface RejectOvertimeRequestPayload {
  rejectionReason?: string;
  managerNotes?: string;
  notes?: string;
}

export interface CreateCorrectionRequestPayload {
  attendanceDate: string; // YYYY-MM-DD
  attendanceSessionId?: string;
  attendanceBreakId?: string;
  correctionType: CorrectionType;
  requestedCheckInAt?: string;       // ISO 8601 UTC
  requestedCheckOutAt?: string;      // ISO 8601 UTC
  requestedBreakStartedAt?: string;  // ISO 8601 UTC
  requestedBreakEndedAt?: string;    // ISO 8601 UTC
  reason: string;
  evidenceMetadata?: Record<string, unknown>;
}

export interface ApproveCorrectionRequestPayload {
  managerNotes?: string;
  evidenceReference?: string;
  evidenceOutcome?: VerificationOutcome;
  verificationNotes?: string;
}

export interface RejectCorrectionRequestPayload {
  rejectionReason?: string;
  managerNotes?: string;
  notes?: string;
  evidenceOutcome?: VerificationOutcome;
  verificationNotes?: string;
}

export interface TriggerReconciliationPayload {
  targetDate: string; // YYYY-MM-DD
  departmentId?: string;
  forceReconcile?: boolean;
  forceReason?: string;
  notes?: string;
}

export interface ResolveAnomalyPayload {
  action: AnomalyResolutionAction;
  notes: string;
  recalculate?: boolean;
}

// Query Parameters
export interface QueryAttendanceHistoryParams {
  userId?: string;
  startDate?: string;
  endDate?: string;
  status?: AttendanceStatus;
  search?: string;
  departmentId?: string;
  page?: number;
  limit?: number;
}

export interface QueryShiftsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface QueryWfhRequestsParams {
  userId?: string;
  status?: WfhStatus;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface QueryOvertimeRequestsParams {
  userId?: string;
  status?: OvertimeApprovalStatus;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface QueryCorrectionRequestsParams {
  userId?: string;
  attendanceRecordId?: string;
  status?: AttendanceCorrectionStatus;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface QueryReconciliationRunsParams {
  targetDate?: string;
  status?: ReconciliationRunStatus;
  page?: number;
  limit?: number;
}

export interface QueryAnomaliesParams {
  userId?: string;
  departmentId?: string;
  anomalyType?: string;
  isResolved?: boolean;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface QueryReconciliationStatusParams {
  userId: string;
  date: string;
}
