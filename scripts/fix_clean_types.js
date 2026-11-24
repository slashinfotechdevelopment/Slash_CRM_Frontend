import fs from 'fs';

// 1. errorMapper.ts
let em = fs.readFileSync('src/api/client/errorMapper.ts', 'utf8');
em = em.replace('data.errors.forEach(() => {', 'data.errors.forEach((msg: unknown) => {');
fs.writeFileSync('src/api/client/errorMapper.ts', em, 'utf8');

// 2. httpClient.ts
let hc = fs.readFileSync('src/api/client/httpClient.ts', 'utf8');
hc = hc.replace('reject: () => void;', 'reject: (err: unknown) => void;');
fs.writeFileSync('src/api/client/httpClient.ts', hc, 'utf8');

// 3. auth.connector.ts
let ac = fs.readFileSync('src/connectors/auth.connector.ts', 'utf8');
if (!ac.includes("from '@/api/client/responseUnwrap'")) {
  ac = "import { extractData } from '@/api/client/responseUnwrap';\n" + ac;
  fs.writeFileSync('src/connectors/auth.connector.ts', ac, 'utf8');
}

// 4. roles.connector.ts
let rc = fs.readFileSync('src/connectors/roles.connector.ts', 'utf8');
rc = rc.replace("import { extractPaginated } from '@/api/client/responseUnwrap';", "import { extractData, extractPaginated } from '@/api/client/responseUnwrap';");
fs.writeFileSync('src/connectors/roles.connector.ts', rc, 'utf8');

// 5. admin.connector.ts
let adc = fs.readFileSync('src/connectors/admin.connector.ts', 'utf8');
adc = adc.replace('return Array.isArray(data) ? data : (data?.employees || data?.items || []);', 'return Array.isArray(data) ? (data as LeadsByEmployeeItem[]) : (((data as Record<string, unknown>)?.employees || (data as Record<string, unknown>)?.items || []) as LeadsByEmployeeItem[]);');
adc = adc.replace('return Array.isArray(data) ? data : (data?.trend || data?.items || []);', 'return Array.isArray(data) ? (data as LeadTrendPoint[]) : (((data as Record<string, unknown>)?.trend || (data as Record<string, unknown>)?.items || []) as LeadTrendPoint[]);');
adc = adc.replace('return Array.isArray(data) ? data : (data?.sources || data?.items || []);', 'return Array.isArray(data) ? (data as LeadSourceItem[]) : (((data as Record<string, unknown>)?.sources || (data as Record<string, unknown>)?.items || []) as LeadSourceItem[]);');
fs.writeFileSync('src/connectors/admin.connector.ts', adc, 'utf8');

// 6. attendance.connector.ts
let att = fs.readFileSync('src/connectors/attendance.connector.ts', 'utf8');
att = att.replace('const data = extractData<Record<string, unknown>>(res) || {};', 'const data = (extractData<TodayAttendanceResponse>(res) || {}) as TodayAttendanceResponse & Record<string, unknown>;');
att = att.replace('checkInAt: activeSession.rawCheckInAt || activeSession.checkInAt || activeSession.createdAt,', 'checkInAt: activeSession.rawCheckInAt || activeSession.checkInAt || (activeSession as unknown as { createdAt?: string }).createdAt || \'\',');
att = att.replace('activeSession,', 'activeSession: activeSession as AttendanceSession | null,');
fs.writeFileSync('src/connectors/attendance.connector.ts', att, 'utf8');

// 7. leads.connector.ts
let ldc = fs.readFileSync('src/connectors/leads.connector.ts', 'utf8');
ldc = ldc.replace("message: data?.message || (res.data as { message?: string })?.message || 'Lead deleted successfully.',", "message: String(data?.message || (res.data as { message?: string })?.message || 'Lead deleted successfully.'),");
ldc = ldc.replace('return Array.isArray(data) ? data : data?.timeline || data?.items || [];', 'return Array.isArray(data) ? (data as LeadActivityItem[]) : (((data as Record<string, unknown>)?.timeline || (data as Record<string, unknown>)?.items || []) as LeadActivityItem[]);');
ldc = ldc.replace('return Array.isArray(data) ? data : data?.followUps || data?.items || [];', 'return Array.isArray(data) ? (data as LeadFollowUpItem[]) : (((data as Record<string, unknown>)?.followUps || (data as Record<string, unknown>)?.items || []) as LeadFollowUpItem[]);');
ldc = ldc.replace('return Array.isArray(data) ? data : data?.stages || [];', 'return Array.isArray(data) ? (data as PipelineStageItem[]) : (((data as Record<string, unknown>)?.stages || []) as PipelineStageItem[]);');
ldc = ldc.replace('async getPipelineMetrics(): Promise<any[]> {', 'async getPipelineMetrics(): Promise<unknown[]> {');
ldc = ldc.replace('return Array.isArray(data) ? data : (data?.stages || []);', 'return Array.isArray(data) ? (data as unknown[]) : (((data as Record<string, unknown>)?.stages || []) as unknown[]);');
fs.writeFileSync('src/connectors/leads.connector.ts', ldc, 'utf8');

// 8. leave.connector.ts
let lvc = fs.readFileSync('src/connectors/leave.connector.ts', 'utf8');
lvc = lvc.replace('return Array.isArray(data) ? data : (data?.types || []);', 'return Array.isArray(data) ? (data as LeaveType[]) : (((data as Record<string, unknown>)?.types || []) as LeaveType[]);');
lvc = lvc.replace('return Array.isArray(data) ? data : (data?.holidays || []);', 'return Array.isArray(data) ? (data as Holiday[]) : (((data as Record<string, unknown>)?.holidays || []) as Holiday[]);');
lvc = lvc.replace('return Array.isArray(data) ? data : (data?.policies || []);', 'return Array.isArray(data) ? (data as WeeklyOffPolicy[]) : (((data as Record<string, unknown>)?.policies || []) as WeeklyOffPolicy[]);');
lvc = lvc.replace('return Array.isArray(data) ? data : (data?.balances || []);', 'return Array.isArray(data) ? (data as LeaveBalance[]) : (((data as Record<string, unknown>)?.balances || []) as LeaveBalance[]);');
lvc = lvc.replace('return Array.isArray(data) ? data : (data?.calendar || data?.items || []);', 'return Array.isArray(data) ? (data as LeaveCalendarItem[]) : (((data as Record<string, unknown>)?.calendar || (data as Record<string, unknown>)?.items || []) as LeaveCalendarItem[]);');
fs.writeFileSync('src/connectors/leave.connector.ts', lvc, 'utf8');

// 9. LeadDetailPage.tsx
let ldp = fs.readFileSync('src/features/leads/pages/LeadDetailPage.tsx', 'utf8');
ldp = ldp.replaceAll('onChange={(e) => setEditForm(() => ({ ...p,', 'onChange={(e) => setEditForm((p: any) => ({ ...p,');
fs.writeFileSync('src/features/leads/pages/LeadDetailPage.tsx', ldp, 'utf8');

// 10. LeadPipelinePage.tsx
let lpp = fs.readFileSync('src/features/leads/pages/LeadPipelinePage.tsx', 'utf8');
lpp = lpp.replace('pipelineMetrics.forEach(() => {', 'pipelineMetrics.forEach((m: any) => {');
fs.writeFileSync('src/features/leads/pages/LeadPipelinePage.tsx', lpp, 'utf8');

// 11. LeadsListPage.tsx
let llp = fs.readFileSync('src/features/leads/pages/LeadsListPage.tsx', 'utf8');
llp = llp.replace('const [importResult, setImportResult] = useState<string | null>(null);', 'const [importResult, setImportResult] = useState<{ importedCount?: number; validCount?: number; failedCount?: number; errors?: any[]; preview?: any[] } | null>(null);');
llp = llp.replace('const rows = rawRows.map(() => ({', 'const rows = rawRows.map((r: any) => ({');
fs.writeFileSync('src/features/leads/pages/LeadsListPage.tsx', llp, 'utf8');

// 12. LeaveCalendarPage.tsx
let lcp = fs.readFileSync('src/features/leave/pages/LeaveCalendarPage.tsx', 'utf8');
lcp = lcp.replace('departmentsConnector.getDepartments({ limit: 100 }).then(() => {', 'departmentsConnector.getDepartments({ limit: 100 }).then((res) => {');
fs.writeFileSync('src/features/leave/pages/LeaveCalendarPage.tsx', lcp, 'utf8');

// 13. LeaveReportsPage.tsx
let lrp = fs.readFileSync('src/features/leave/pages/LeaveReportsPage.tsx', 'utf8');
lrp = lrp.replace('departmentsConnector.getDepartments({ limit: 100 }).then(() => {', 'departmentsConnector.getDepartments({ limit: 100 }).then((res) => {');
fs.writeFileSync('src/features/leave/pages/LeaveReportsPage.tsx', lrp, 'utf8');

// 14. LeaveSetupPage.tsx
let lsp = fs.readFileSync('src/features/leave/pages/LeaveSetupPage.tsx', 'utf8');
lsp = lsp.replace('selectedType.policies?.find(() => !p.effectiveTo) ||', 'selectedType.policies?.find((p: any) => !p.effectiveTo) ||');
lsp = lsp.replace('{allPolicies.filter(Boolean).map(() => (', '{allPolicies.filter(Boolean).map((v: any) => (');
fs.writeFileSync('src/features/leave/pages/LeaveSetupPage.tsx', lsp, 'utf8');

// 15. CorrectionsPage.tsx
let cp = fs.readFileSync('src/features/attendance/pages/CorrectionsPage.tsx', 'utf8');
cp = cp.replace("setVerifiedEvidenceRef(req.evidenceMetadata?.evidenceReference || '');", "setVerifiedEvidenceRef(String(req.evidenceMetadata?.evidenceReference || ''));");
fs.writeFileSync('src/features/attendance/pages/CorrectionsPage.tsx', cp, 'utf8');

// 16. ReconciliationPage.tsx
let rep = fs.readFileSync('src/features/attendance/pages/ReconciliationPage.tsx', 'utf8');
rep = rep.replace("{typeof selectedRun.logs === 'string'\n                    ? selectedRun.logs\n                    : JSON.stringify(selectedRun.logs, null, 2)}", "{String(typeof selectedRun.logs === 'string' ? selectedRun.logs : JSON.stringify(selectedRun.logs, null, 2))}");
fs.writeFileSync('src/features/attendance/pages/ReconciliationPage.tsx', rep, 'utf8');

// 17. TaskDashboardsPage.tsx
let tdp = fs.readFileSync('src/features/tasks/pages/TaskDashboardsPage.tsx', 'utf8');
tdp = tdp.replace('message={error.message}', 'message={error}');
fs.writeFileSync('src/features/tasks/pages/TaskDashboardsPage.tsx', tdp, 'utf8');

// 18. TaskReportsPage.tsx
let trp = fs.readFileSync('src/features/tasks/pages/TaskReportsPage.tsx', 'utf8');
trp = trp.replace('message={error.message}', 'message={error}');
fs.writeFileSync('src/features/tasks/pages/TaskReportsPage.tsx', trp, 'utf8');

console.log('Clean type fixes applied.');
