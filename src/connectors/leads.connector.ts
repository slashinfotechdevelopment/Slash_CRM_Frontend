import { httpClient } from '@/api/client/httpClient';
import { LEAD_ENDPOINTS } from '@/api/endpoints/lead.endpoints';
import {
  LeadItem,
  LeadDetail,
  LeadActivityItem,
  LeadFollowUpItem,
  PipelineStageItem,
  LeadMetricsSummary,
  CreateLeadPayload,
  UpdateLeadPayload,
  QueryLeadsParams,
  AssignLeadPayload,
  QualifyLeadPayload,
  ChangeLeadStatusPayload,
  ConvertLeadPayload,
  CreateLeadActivityPayload,
  CreateLeadFollowUpPayload,
  UpdateLeadFollowUpPayload,
  ImportLeadsPayload,
  PublicInquiryPayload,
  FollowUpStatus,
} from '@/api/types/lead.types';

import { extractData, extractPaginated } from '@/api/client/responseUnwrap';


export const leadsConnector = {
  // -------------------------------------------------------------
  // PUBLIC WEBSITE INQUIRY
  // -------------------------------------------------------------
  async submitPublicInquiry(payload: PublicInquiryPayload): Promise<unknown> {
    const res = await httpClient.post(LEAD_ENDPOINTS.PUBLIC_INQUIRE, payload);
    return extractData(res);
  },

  // -------------------------------------------------------------
  // CORE LEADS CRUD & LIFECYCLE
  // -------------------------------------------------------------

  /** POST /api/leads */
  async createLead(payload: CreateLeadPayload): Promise<LeadDetail> {
    const res = await httpClient.post(LEAD_ENDPOINTS.LEADS, payload);
    return extractData<LeadDetail>(res);
  },

  /** GET /api/leads */
  async getLeads(params: QueryLeadsParams = {}): Promise<{ items: LeadItem[]; total: number; hasMore: boolean }> {
    const res = await httpClient.get(LEAD_ENDPOINTS.LEADS, { params });
    return extractPaginated<LeadItem>(res, params.limit || 20, params.page || 1);
  },

  /** GET /api/leads/:id */
  async getLead(id: string): Promise<LeadDetail> {
    const res = await httpClient.get(LEAD_ENDPOINTS.LEAD_BY_ID(id));
    return extractData<LeadDetail>(res);
  },

  /** PUT /api/leads/:id */
  async updateLead(id: string, payload: UpdateLeadPayload): Promise<LeadDetail> {
    const allowedKeys: (keyof UpdateLeadPayload)[] = [
      'leadDate',
      'leadName',
      'phone',
      'alternatePhone',
      'email',
      'companyName',
      'jobTitle',
      'website',
      'interestedCourse',
      'industry',
      'location',
      'address',
      'city',
      'state',
      'country',
      'pincode',
      'requirementDescription',
      'estimatedValue',
      'currency',
      'expectedClosingDate',
      'feedback1',
      'feedback2',
      'feedback3',
      'source',
      'sourceDetails',
      'campaignName',
      'departmentId',
      'assignedToId',
      'priority',
      'status',
      'qualificationStatus',
      'pipelineStageId',
      'unqualifiedReason',
      'lostReason',
    ];
    const sanitizedPayload: Record<string, unknown> = {};
    for (const key of allowedKeys) {
      if (key in payload && payload[key] !== undefined) {
        sanitizedPayload[key] = payload[key];
      }
    }
    const res = await httpClient.put(LEAD_ENDPOINTS.LEAD_BY_ID(id), sanitizedPayload);
    return extractData<LeadDetail>(res);
  },

  /** DELETE /api/leads/:id */
  async deleteLead(id: string): Promise<{ success: boolean; message: string }> {
    const res = await httpClient.delete(LEAD_ENDPOINTS.LEAD_BY_ID(id));
    const data = extractData<Record<string, unknown>>(res);
    return {
      success: true,
      message: String(data?.message || (res.data as { message?: string })?.message || 'Lead deleted successfully.'),
    };
  },

  /** POST /api/leads/:id/restore */
  async restoreLead(id: string): Promise<LeadDetail> {
    const res = await httpClient.post(LEAD_ENDPOINTS.RESTORE_LEAD(id));
    return extractData<LeadDetail>(res);
  },

  /** POST /api/leads/:id/assign */
  async assignLead(id: string, payload: AssignLeadPayload): Promise<LeadDetail> {
    const res = await httpClient.post(LEAD_ENDPOINTS.ASSIGN_LEAD(id), payload);
    return extractData<LeadDetail>(res);
  },

  /** POST /api/leads/:id/qualify */
  async qualifyLead(id: string, payload: QualifyLeadPayload): Promise<LeadDetail> {
    const res = await httpClient.post(LEAD_ENDPOINTS.QUALIFY_LEAD(id), payload);
    return extractData<LeadDetail>(res);
  },

  /** POST /api/leads/:id/status */
  async updateStatus(id: string, payload: ChangeLeadStatusPayload): Promise<LeadDetail> {
    const res = await httpClient.post(LEAD_ENDPOINTS.UPDATE_STATUS(id), payload);
    return extractData<LeadDetail>(res);
  },

  /** POST /api/leads/:id/convert */
  async convertLead(id: string, payload: ConvertLeadPayload = {}): Promise<LeadDetail> {
    const res = await httpClient.post(LEAD_ENDPOINTS.CONVERT_LEAD(id), payload);
    return extractData<LeadDetail>(res);
  },

  // -------------------------------------------------------------
  // ACTIVITIES & TIMELINE
  // -------------------------------------------------------------

  /** POST /api/leads/:id/activities */
  async createActivity(id: string, payload: CreateLeadActivityPayload): Promise<LeadActivityItem> {
    const res = await httpClient.post(LEAD_ENDPOINTS.ACTIVITIES(id), payload);
    return extractData<LeadActivityItem>(res);
  },

  /** GET /api/leads/:id/timeline */
  async getLeadTimeline(id: string): Promise<LeadActivityItem[]> {
    const res = await httpClient.get(LEAD_ENDPOINTS.TIMELINE(id));
    const data = extractData<Record<string, unknown>>(res);
    return Array.isArray(data) ? (data as LeadActivityItem[]) : (((data as Record<string, unknown>)?.timeline || (data as Record<string, unknown>)?.items || []) as LeadActivityItem[]);
  },

  // -------------------------------------------------------------
  // FOLLOW-UPS
  // -------------------------------------------------------------

  /** POST /api/leads/:id/follow-ups */
  async createFollowUp(id: string, payload: CreateLeadFollowUpPayload): Promise<LeadFollowUpItem> {
    const sanitized: Record<string, unknown> = {
      scheduledAt: payload.scheduledAt,
    };
    if (payload.assignedToId) sanitized.assignedToId = payload.assignedToId;
    if (payload.note && payload.note.trim()) sanitized.note = payload.note.trim();
    const res = await httpClient.post(LEAD_ENDPOINTS.FOLLOW_UPS(id), sanitized);
    return extractData<LeadFollowUpItem>(res);
  },

  /** GET /api/leads/follow-ups/my */
  async getMyFollowUps(status?: FollowUpStatus): Promise<LeadFollowUpItem[]> {
    const res = await httpClient.get(LEAD_ENDPOINTS.MY_FOLLOW_UPS, { params: { status } });
    const data = extractData<Record<string, unknown>>(res);
    return Array.isArray(data) ? (data as LeadFollowUpItem[]) : (((data as Record<string, unknown>)?.followUps || (data as Record<string, unknown>)?.items || []) as LeadFollowUpItem[]);
  },

  /** PUT /api/leads/follow-ups/:id */
  async updateFollowUp(followUpId: string, payload: UpdateLeadFollowUpPayload): Promise<LeadFollowUpItem> {
    const res = await httpClient.put(LEAD_ENDPOINTS.FOLLOW_UP_BY_ID(followUpId), payload);
    return extractData<LeadFollowUpItem>(res);
  },

  // -------------------------------------------------------------
  // PIPELINE & METRICS
  // -------------------------------------------------------------

  /** GET /api/leads/pipeline/stages */
  async getPipelineStages(): Promise<PipelineStageItem[]> {
    const res = await httpClient.get(LEAD_ENDPOINTS.PIPELINE_STAGES);
    const data = extractData<Record<string, unknown>>(res);
    return Array.isArray(data) ? (data as PipelineStageItem[]) : (((data as Record<string, unknown>)?.stages || []) as PipelineStageItem[]);
  },

  /** GET /api/leads/metrics/summary */
  async getMetricsSummary(): Promise<LeadMetricsSummary> {
    const res = await httpClient.get(LEAD_ENDPOINTS.METRICS_SUMMARY);
    return extractData<LeadMetricsSummary>(res);
  },

  /** GET /api/leads/metrics/pipeline */
  async getPipelineMetrics(): Promise<unknown[]> {
    const res = await httpClient.get(LEAD_ENDPOINTS.METRICS_PIPELINE);
    const data = extractData<Record<string, unknown>>(res);
    return Array.isArray(data) ? (data as unknown[]) : (((data as Record<string, unknown>)?.stages || []) as unknown[]);
  },

  // -------------------------------------------------------------
  // IMPORT / EXPORT
  // -------------------------------------------------------------

  /** POST /api/leads/import */
  async importLeads(payload: ImportLeadsPayload): Promise<{
    importedCount?: number;
    failedCount?: number;
    errors?: unknown[];
    preview?: unknown[];
  }> {
    const res = await httpClient.post(LEAD_ENDPOINTS.IMPORT, payload);
    return extractData(res);
  },

  /** Export CSV */
  async exportLeads(): Promise<Blob> {
    const res = await httpClient.get(LEAD_ENDPOINTS.EXPORT, { responseType: 'blob' });
    return res.data;
  },
};
