export type LeadSource =
  | 'WEBSITE'
  | 'MANUAL'
  | 'REFERRAL'
  | 'LINKEDIN'
  | 'GOOGLE_ADS'
  | 'COLD_CALL'
  | 'CAMPAIGN'
  | 'OTHER';

export type LeadPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type LeadStatus =
  | 'NEW'
  | 'CONTACTED'
  | 'QUALIFIED'
  | 'UNQUALIFIED'
  | 'CONVERTED'
  | 'LOST';

export type LeadQualificationStatus = 'PENDING' | 'QUALIFIED' | 'UNQUALIFIED';

export type FollowUpStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED';

export type LeadActivityType =
  | 'NOTE'
  | 'CALL'
  | 'MEETING'
  | 'EMAIL'
  | 'STATUS_CHANGE'
  | 'ASSIGNMENT'
  | 'QUALIFICATION';

export interface LeadUserBrief {
  id: string;
  userCode?: string;
  name: string;
  email: string;
}

export interface LeadDepartmentBrief {
  id: string;
  code: string;
  name: string;
}

export interface PipelineStageBrief {
  id: string;
  code: string;
  name: string;
  color?: string | null;
  displayOrder?: number;
}

export interface LeadItem {
  id: string;
  leadCode: string;
  leadDate: string;
  leadName: string;
  phone: string;
  normalizedPhone?: string;
  alternatePhone?: string | null;
  email?: string | null;
  companyName?: string | null;
  jobTitle?: string | null;
  website?: string | null;
  interestedCourse?: string | null;
  industry?: string | null;
  location?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  pincode?: string | null;
  requirementDescription?: string | null;
  estimatedValue?: number | null;
  currency?: string | null;
  expectedClosingDate?: string | null;
  feedback1?: string | null;
  feedback2?: string | null;
  feedback3?: string | null;
  source: LeadSource;
  sourceDetails?: string | null;
  campaignName?: string | null;
  createdById: string;
  departmentId?: string | null;
  assignedToId?: string | null;
  assignedById?: string | null;
  assignedAt?: string | null;
  priority: LeadPriority;
  status: LeadStatus;
  qualificationStatus: LeadQualificationStatus;
  pipelineStageId?: string | null;
  unqualifiedReason?: string | null;
  lostReason?: string | null;
  lastContactedAt?: string | null;
  lastActivityAt?: string | null;
  convertedAt?: string | null;
  convertedById?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;

  createdBy?: LeadUserBrief;
  assignedTo?: LeadUserBrief | null;
  department?: LeadDepartmentBrief | null;
  pipelineStage?: PipelineStageBrief | null;
}

export interface LeadDetail extends LeadItem {
  activities?: LeadActivityItem[];
  followUps?: LeadFollowUpItem[];
}

export interface LeadActivityItem {
  id: string;
  leadId: string;
  type: LeadActivityType;
  title: string;
  description?: string | null;
  metadata?: Record<string, unknown> | null;
  performedById: string;
  performedBy?: LeadUserBrief;
  createdAt: string;
}

export interface LeadFollowUpItem {
  id: string;
  leadId: string;
  scheduledAt: string;
  note?: string | null;
  status: FollowUpStatus;
  assignedToId?: string;
  assignedTo?: LeadUserBrief;
  createdAt: string;
  updatedAt: string;
  lead?: {
    id: string;
    leadCode: string;
    leadName: string;
    phone: string;
    companyName?: string | null;
  };
}

export interface PipelineStageItem {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  color?: string | null;
  displayOrder: number;
  isDefault?: boolean;
  isWonStage?: boolean;
  isLostStage?: boolean;
  leadCount?: number;
  totalEstimatedValue?: number;
}

export interface LeadMetricsSummary {
  totalLeads: number;
  totalActive?: number;
  newLeads: number;
  qualifiedLeads: number;
  wonLeads: number;
  lostLeads: number;
  conversionRate: number;
  totalPipelineValue: number;
  byStatus: Record<string, number>;
  statusCounts?: Record<string, number>;
  byPriority: Record<string, number>;
  bySource: Record<string, number>;
}

export interface PipelineMetrics {
  stages: Array<{
    stageId: string;
    stageName: string;
    stageCode: string;
    color?: string | null;
    count: number;
    value: number;
    percentage: number;
  }>;
  totalLeads: number;
  totalPipelineValue: number;
}

export interface CreateLeadPayload {
  leadDate?: string;
  leadName: string;
  phone: string;
  alternatePhone?: string;
  email?: string;
  companyName?: string;
  jobTitle?: string;
  website?: string;
  interestedCourse?: string;
  industry?: string;
  location?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  requirementDescription?: string;
  estimatedValue?: number;
  currency?: string;
  expectedClosingDate?: string;
  feedback1?: string;
  feedback2?: string;
  feedback3?: string;
  source?: LeadSource;
  sourceDetails?: string;
  campaignName?: string;
  departmentId?: string;
  assignedToId?: string;
  priority?: LeadPriority;
  status?: LeadStatus;
  qualificationStatus?: LeadQualificationStatus;
  pipelineStageId?: string;
}

export interface UpdateLeadPayload extends Partial<CreateLeadPayload> {
  lostReason?: string;
  unqualifiedReason?: string;
}

export interface QueryLeadsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: LeadStatus;
  priority?: LeadPriority;
  source?: LeadSource;
  qualificationStatus?: LeadQualificationStatus;
  pipelineStageId?: string;
  departmentId?: string;
  assignedToId?: string;
  unassignedOnly?: boolean;
  startDate?: string;
  endDate?: string;
  createdStartDate?: string;
  createdEndDate?: string;
  sortBy?: 'leadDate' | 'createdAt' | 'leadName' | 'estimatedValue' | 'priority';
  sortOrder?: 'asc' | 'desc';
}

export interface AssignLeadPayload {
  assignedToId?: string | null;
  departmentId?: string | null;
  unassign?: boolean;
  note?: string;
}

export interface QualifyLeadPayload {
  qualificationStatus: LeadQualificationStatus;
  note?: string;
  unqualifiedReason?: string;
}

export interface ChangeLeadStatusPayload {
  status: LeadStatus;
  pipelineStageId?: string;
  lostReason?: string;
  unqualifiedReason?: string;
  note?: string;
}

export interface ConvertLeadPayload {
  note?: string;
}

export interface CreateLeadActivityPayload {
  type: LeadActivityType;
  title: string;
  description?: string;
  metadata?: Record<string, unknown> | null;
}

export interface CreateLeadFollowUpPayload {
  scheduledAt: string;
  note?: string;
  assignedToId?: string;
}

export interface UpdateLeadFollowUpPayload {
  scheduledAt?: string;
  status?: FollowUpStatus;
  note?: string;
}

export interface ImportLeadRowPayload {
  date?: string;
  name: string;
  contact: string;
  course?: string;
  location?: string;
  feedback1?: string;
  feedback2?: string;
  feedback3?: string;
  email?: string;
  companyName?: string;
  sourceDetails?: string;
  campaignName?: string;
}

export interface ImportLeadsPayload {
  rows: ImportLeadRowPayload[];
  dryRun?: boolean;
}

export interface PublicInquiryPayload {
  name: string;
  phone: string;
  email?: string;
  course?: string;
  location?: string;
  message?: string;
  sourceDetails?: string;
  campaignName?: string;
}
