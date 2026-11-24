export type LeaveCategory = 'PAID' | 'UNPAID' | 'COMPENSATORY';

export type LeaveAccrualFrequency = 'ANNUAL' | 'MONTHLY' | 'QUARTERLY';

export type LeaveRequestStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'CANCELLATION_PENDING';

export type HalfDayPeriod = 'FIRST_HALF' | 'SECOND_HALF';

export type LeaveApprovalDecision = 'APPROVED' | 'REJECTED';

export type WorkCalendarScope = 'GLOBAL' | 'LOCATION' | 'DEPARTMENT';

export type LeaveTransactionType =
  | 'ACCRUAL'
  | 'APPLICATION'
  | 'APPROVAL'
  | 'REJECTION'
  | 'CANCELLATION'
  | 'MANUAL_ADJUSTMENT'
  | 'EXPIRY'
  | 'CARRY_FORWARD';

export interface PolicyVersion {
  id: string;
  leaveTypeId: string;
  version?: number;
  versionNumber?: number;
  effectiveFrom: string;
  effectiveTo?: string | null;
  accrualFrequency: LeaveAccrualFrequency;
  annualAllocation: number;
  monthlyAllocation?: number | null;
  maxDaysPerMonth?: number | null;
  carryForwardLimit: number;
  carryForwardExpiryMonths?: number | null;
  maxConsecutiveDays?: number | null;
  allowHalfDay: boolean;
  requiresDocument: boolean;
  minNoticeDays: number;
  excludeWeeklyOffs: boolean;
  excludeHolidays: boolean;
  applicableEmploymentType?: string | null;
  departmentId?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface LeaveType {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  category: LeaveCategory;
  isPaid: boolean;
  isActive?: boolean;
  status?: 'ACTIVE' | 'INACTIVE' | string;
  createdAt: string;
  updatedAt?: string;
  currentPolicy?: PolicyVersion | null;
  policyVersions?: PolicyVersion[];
  policies?: PolicyVersion[];
}

export interface Holiday {
  id: string;
  name: string;
  date: string;
  dateFormatted?: string;
  year: number;
  description?: string | null;
  isOptional: boolean;
  scopeType: WorkCalendarScope;
  departmentId?: string | null;
  location?: string | null;
  googleCalendarUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface WeeklyOffPolicy {
  id: string;
  name: string;
  description?: string | null;
  daysOfWeek: number[];
  pattern?: string;
  effectiveFrom: string;
  effectiveTo?: string | null;
  scopeType: WorkCalendarScope;
  departmentId?: string | null;
  location?: string | null;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt?: string;
}

export interface LeaveBalance {
  id?: string;
  userId: string;
  userName?: string;
  userCode?: string;
  departments?: string[];
  leaveTypeId: string;
  leaveTypeName?: string;
  leaveTypeCode?: string;
  year: number;
  allocatedDays: number;
  accruedDays?: number;
  carriedForward?: number;
  usedDays: number;
  pendingDays: number;
  carriedForwardDays?: number;
  adjustedDays: number;
  availableDays: number;
  leaveType?: LeaveType;
  user?: {
    id: string;
    name: string;
    email: string;
    code?: string;
    department?: { name: string };
  };
}

export interface LeaveRequest {
  id: string;
  requestNumber?: string;
  userId: string;
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  daysRequested?: number;
  totalDays?: number;
  isHalfDay: boolean;
  halfDayPeriod?: HalfDayPeriod | null;
  reason: string;
  attachmentMediaId?: string | null;
  status: LeaveRequestStatus;
  reviewerId?: string | null;
  reviewerNotes?: string | null;
  reviewedAt?: string | null;
  cancellationReason?: string | null;
  cancellationReviewerId?: string | null;
  cancellationReviewedAt?: string | null;
  cancellationReviewerNotes?: string | null;
  createdAt: string;
  updatedAt?: string;
  leaveType?: LeaveType;
  user?: {
    id: string;
    name: string;
    email: string;
    code?: string;
    profile?: { designation?: string };
    departments?: Array<{ department: { name: string } }>;
  };
  reviewer?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface LeaveTransaction {
  id: string;
  userId: string;
  leaveTypeId: string;
  leaveRequestId?: string | null;
  year: number;
  transactionType: LeaveTransactionType;
  deltaAllocated: number;
  deltaAccrued: number;
  deltaUsed: number;
  deltaPending: number;
  deltaCarriedForward: number;
  deltaAdjusted: number;
  closingAllocated: number;
  closingAccrued: number;
  closingUsed: number;
  closingPending: number;
  closingCarriedForward: number;
  closingAdjusted: number;
  closingAvailable: number;
  reason?: string | null;
  performedById?: string | null;
  createdAt: string;
  leaveType?: LeaveType;
  user?: {
    id: string;
    name: string;
    email: string;
    code?: string;
  };
  performedBy?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface LeaveCalendarItem {
  id: string;
  userId: string;
  userName: string;
  userCode?: string;
  departmentName?: string;
  leaveTypeName: string;
  leaveTypeCode: string;
  category: LeaveCategory;
  startDate: string;
  endDate: string;
  isHalfDay: boolean;
  halfDayPeriod?: HalfDayPeriod | null;
  status: LeaveRequestStatus;
}

export interface LeaveReportSummary {
  year: number;
  totalEmployees: number;
  totalDaysAllocated: number;
  totalDaysUsed: number;
  totalDaysPending: number;
  totalDaysAvailable: number;
  byLeaveType: Array<{
    leaveTypeId: string;
    leaveTypeName: string;
    leaveTypeCode: string;
    allocated: number;
    used: number;
    pending: number;
    available: number;
  }>;
  byDepartment?: Array<{
    departmentId: string;
    departmentName: string;
    totalEmployees: number;
    allocated: number;
    used: number;
    pending: number;
    available: number;
  }>;
}

// Request Payloads

export interface CreateLeaveTypePayload {
  code: string;
  name: string;
  description?: string;
  category?: LeaveCategory;
  isPaid?: boolean;
  accrualFrequency?: LeaveAccrualFrequency;
  annualAllocation?: number;
  monthlyAllocation?: number;
  maxDaysPerMonth?: number;
  carryForwardExpiryMonths?: number;
  maxConsecutiveDays?: number;
  allowHalfDay?: boolean;
  requiresDocument?: boolean;
  minNoticeDays?: number;
  carryForwardLimit?: number;
  excludeWeeklyOffs?: boolean;
  excludeHolidays?: boolean;
  applicableEmploymentType?: string;
  departmentId?: string;
}

export interface UpdateLeaveTypePayload {
  name?: string;
  description?: string;
  category?: LeaveCategory;
  isPaid?: boolean;
  isActive?: boolean;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface CreatePolicyVersionPayload {
  accrualFrequency: LeaveAccrualFrequency;
  annualAllocation: number;
  monthlyAllocation?: number;
  maxDaysPerMonth?: number;
  carryForwardLimit?: number;
  carryForwardExpiryMonths?: number;
  maxConsecutiveDays?: number;
  allowHalfDay?: boolean;
  requiresDocument?: boolean;
  minNoticeDays?: number;
  excludeWeeklyOffs?: boolean;
  excludeHolidays?: boolean;
  effectiveFrom: string;
  effectiveTo?: string;
  applicableEmploymentType?: string;
  departmentId?: string;
}

export interface CreateHolidayPayload {
  name: string;
  date: string;
  year?: number;
  description?: string;
  isOptional?: boolean;
  scopeType?: WorkCalendarScope;
  departmentId?: string;
  location?: string;
}

export interface UpdateHolidayPayload {
  name?: string;
  date?: string;
  description?: string;
  isOptional?: boolean;
  scopeType?: WorkCalendarScope;
  departmentId?: string;
  location?: string;
}

export interface SyncGoogleHolidaysPayload {
  year: number;
  countryCode?: string;
}

export interface CreateWeeklyOffPolicyPayload {
  name: string;
  description?: string;
  daysOfWeek: number[];
  pattern?: string;
  effectiveFrom: string;
  effectiveTo?: string;
  scopeType?: WorkCalendarScope;
  departmentId?: string;
  location?: string;
}

export interface ApplyLeaveRequestPayload {
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  isHalfDay?: boolean;
  halfDayPeriod?: HalfDayPeriod;
  reason: string;
  attachmentMediaId?: string;
  forUserId?: string;
}

export interface ReviewLeaveRequestPayload {
  decision: LeaveApprovalDecision;
  comments?: string;
}

export interface CreateCancellationPayload {
  reason: string;
}

export interface ReviewCancellationPayload {
  decision: LeaveApprovalDecision;
  comments?: string;
}

export interface AdjustLeaveBalancePayload {
  userId: string;
  leaveTypeId: string;
  year: number;
  adjustedDays: number;
  reason: string;
}

export interface QueryLeaveRequestsParams {
  userId?: string;
  status?: LeaveRequestStatus;
  leaveTypeId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface QueryLeaveBalancesParams {
  userId?: string;
  leaveTypeId?: string;
  year?: number;
  page?: number;
  limit?: number;
}

export interface QueryLeaveTransactionsParams {
  userId?: string;
  leaveTypeId?: string;
  leaveRequestId?: string;
  page?: number;
  limit?: number;
}

export interface QueryHolidaysParams {
  year?: number;
  scopeType?: WorkCalendarScope;
  departmentId?: string;
  location?: string;
}

export interface QueryWeeklyOffPoliciesParams {
  status?: 'ACTIVE' | 'INACTIVE';
  scopeType?: WorkCalendarScope;
}

export interface QueryLeaveCalendarParams {
  startDate?: string;
  endDate?: string;
  departmentId?: string;
}

export interface QueryLeaveReportParams {
  year?: number;
  departmentId?: string;
}
