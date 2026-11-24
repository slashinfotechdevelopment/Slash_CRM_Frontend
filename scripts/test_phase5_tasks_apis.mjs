import fs from 'fs';
import path from 'path';
import { PrismaMariaDb } from 'file:///D:/Slash-Projects/Slash_CRM_Backend/node_modules/@prisma/adapter-mariadb/dist/index.js';
import { PrismaClient } from 'file:///D:/Slash-Projects/Slash_CRM_Backend/dist/generated/prisma/client.js';

const BASE_URL = 'http://127.0.0.1:5000';
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchWithRetry(url, options = {}) {
  let res = await fetch(url, options);
  if (res.status === 429) {
    const waitSec = Number(res.headers.get('retry-after') || 15);
    console.log(`Rate limit pause: waiting ${waitSec}s for ${url}...`);
    await sleep((waitSec + 1) * 1000);
    res = await fetch(url, options);
  }
  return res;
}

async function main() {
  console.log('=== Starting Phase 5 Tasks & Kanban Management 38-API Live Verification ===\n');

  // 1. Read Backend .env for Database credentials
  const envLines = fs.readFileSync('D:/Slash-Projects/Slash_CRM_Backend/.env', 'utf-8').split('\n');
  const env = {};
  for (const line of envLines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const idx = trimmed.indexOf('=');
      const k = trimmed.slice(0, idx).trim();
      let v = trimmed.slice(idx + 1).trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1);
      }
      env[k] = v;
    }
  }

  const adapter = new PrismaMariaDb({
    host: env.DB_HOST || '127.0.0.1',
    port: Number(env.DB_PORT || 3306),
    user: env.DB_USER || 'root',
    password: env.DB_PASSWORD || '2026',
    database: env.DB_NAME || 'slash_infotech_crm',
    allowPublicKeyRetrieval: true,
  });
  const prisma = new PrismaClient({ adapter });

  const results = [];
  const recordResult = (sl, method, endpoint, status, pass, screen, notes = '') => {
    results.push({ sl, method, endpoint, status, pass: pass ? 'PASS' : 'FAIL', screen, notes });
    console.log(`[Sl ${sl.toString().padStart(3, ' ')}] ${method.padEnd(6, ' ')} ${endpoint.padEnd(50, ' ')} -> HTTP ${status} [${pass ? 'PASS' : 'FAIL'}] ${notes ? '(' + notes + ')' : ''}`);
  };

  const createdTaskIds = [];
  const createdTagIds = [];
  const createdMediaIds = [];

  // Cleanup function (ONLY TEST_ prefixed items)
  async function performCleanup() {
    console.log('\nCleaning up automated test records...');
    try {
      // Find all TEST_ tasks
      const testTasks = await prisma.task.findMany({
        where: { title: { startsWith: 'TEST_' } },
        select: { id: true },
      });
      const tIds = testTasks.map((t) => t.id);

      if (tIds.length > 0) {
        // Find media attachments for these tasks
        const attachments = await prisma.mediaAttachment.findMany({
          where: { entityType: 'TASK', entityId: { in: tIds } },
          select: { id: true, mediaId: true },
        });
        const mIds = attachments.map((a) => a.mediaId);

        await prisma.taskTimePause.deleteMany({ where: { taskId: { in: tIds } } });
        await prisma.taskTimeEntry.deleteMany({ where: { taskId: { in: tIds } } });
        await prisma.taskComment.deleteMany({ where: { taskId: { in: tIds } } });
        await prisma.taskReview.deleteMany({ where: { taskId: { in: tIds } } });
        await prisma.taskActivityLog.deleteMany({ where: { taskId: { in: tIds } } });
        await prisma.taskStatusHistory.deleteMany({ where: { taskId: { in: tIds } } });
        await prisma.taskAssignmentHistory.deleteMany({ where: { taskId: { in: tIds } } });
        await prisma.taskTagMapping.deleteMany({ where: { taskId: { in: tIds } } });
        await prisma.mediaAttachment.deleteMany({ where: { entityType: 'TASK', entityId: { in: tIds } } });

        if (mIds.length > 0) {
          await prisma.media.deleteMany({ where: { id: { in: mIds } } });
        }

        await prisma.task.deleteMany({ where: { id: { in: tIds } } });
      }

      await prisma.taskTag.deleteMany({ where: { name: { startsWith: 'test_' } } });
      console.log('Cleanup completed successfully.');
    } catch (err) {
      console.error('Cleanup warning:', err.message);
    }
  }

  try {
    await performCleanup();

    // 2. Authenticate Super Admin and Employee
    console.log('\nAuthenticating Super Admin and Employee...');
    await fetchWithRetry(`${BASE_URL}/api/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'srihari8489@gmail.com' }),
    });
    const adminLoginRes = await fetchWithRetry(`${BASE_URL}/api/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'srihari8489@gmail.com', otp: '123456' }),
    });
    const adminLoginData = await adminLoginRes.json();
    const adminToken = adminLoginData.data.accessToken;
    const adminUserId = adminLoginData.data.user.id;

    await fetchWithRetry(`${BASE_URL}/api/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'alaguraja3104@gmail.com' }),
    });
    const empLoginRes = await fetchWithRetry(`${BASE_URL}/api/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'alaguraja3104@gmail.com', otp: '123456' }),
    });
    const empLoginData = await empLoginRes.json();
    const empToken = empLoginData.data.accessToken;
    const empUserId = empLoginData.data.user.id;

    const adminHeaders = {
      Authorization: `Bearer ${adminToken}`,
      'Content-Type': 'application/json',
    };
    const empHeaders = {
      Authorization: `Bearer ${empToken}`,
      'Content-Type': 'application/json',
    };

    console.log('Admin & Employee authenticated successfully.\n');

    // =========================================================================
    // SL 90: CREATE TASK TAG (POST /api/tasks/tags)
    // =========================================================================
    const createTagRes = await fetchWithRetry(`${BASE_URL}/api/tasks/tags`, {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({
        name: 'test_qa_' + Date.now().toString().slice(-4),
        color: '#10B981',
      }),
    });
    const createTagData = await createTagRes.json();
    const createdTag = createTagData.data || createTagData;
    if (createdTag?.id) createdTagIds.push(createdTag.id);
    recordResult(
      90,
      'POST',
      '/api/tasks/tags',
      createTagRes.status,
      createTagRes.status === 201,
      'TasksListPage (Manage Tags Modal)',
      `Tag: ${createdTag?.name}`,
    );

    // =========================================================================
    // SL 89: LIST TASK TAGS (GET /api/tasks/tags)
    // =========================================================================
    const listTagsRes = await fetchWithRetry(`${BASE_URL}/api/tasks/tags`, {
      method: 'GET',
      headers: adminHeaders,
    });
    recordResult(
      89,
      'GET',
      '/api/tasks/tags',
      listTagsRes.status,
      listTagsRes.status === 200,
      'TasksListPage (Filter & Tags Modal)',
    );

    // =========================================================================
    // SL 81: CREATE TASK (POST /api/tasks)
    // =========================================================================
    const createTaskPayload = {
      title: `TEST_CRM_TASK_${Date.now()}`,
      description: 'Automated test task created during Phase 5 verification.',
      priority: 'HIGH',
      category: 'TESTING',
      startDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      estimatedHours: 12.5,
      assigneeId: empUserId, // Assign to employee AlaguRaja
      tags: createdTag?.name ? [createdTag.name] : ['test'],
    };
    const createTaskRes = await fetchWithRetry(`${BASE_URL}/api/tasks`, {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify(createTaskPayload),
    });
    const createTaskData = await createTaskRes.json();
    const testTask = createTaskData.data || createTaskData;
    const taskId = testTask.id;
    if (taskId) createdTaskIds.push(taskId);
    recordResult(
      81,
      'POST',
      '/api/tasks',
      createTaskRes.status,
      createTaskRes.status === 201 && !!taskId,
      'TasksListPage (Create Task Modal)',
      `TaskCode: ${testTask.taskCode}`,
    );

    // =========================================================================
    // SL 82: LIST TASKS (GET /api/tasks)
    // =========================================================================
    const listTasksRes = await fetchWithRetry(`${BASE_URL}/api/tasks?limit=20`, {
      method: 'GET',
      headers: adminHeaders,
    });
    recordResult(
      82,
      'GET',
      '/api/tasks',
      listTasksRes.status,
      listTasksRes.status === 200,
      'TasksListPage (DataTable & Kanban)',
    );

    // =========================================================================
    // SL 83: GET TASK DETAILS (GET /api/tasks/:id)
    // =========================================================================
    const getTaskRes = await fetchWithRetry(`${BASE_URL}/api/tasks/${taskId}`, {
      method: 'GET',
      headers: adminHeaders,
    });
    recordResult(
      83,
      'GET',
      '/api/tasks/:id',
      getTaskRes.status,
      getTaskRes.status === 200,
      'TaskDetailPage',
    );

    // =========================================================================
    // SL 84: UPDATE TASK (PATCH /api/tasks/:id)
    // =========================================================================
    const updateTaskRes = await fetchWithRetry(`${BASE_URL}/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: adminHeaders,
      body: JSON.stringify({
        title: `${testTask.title}_UPDATED`,
        progress: 25,
        priority: 'URGENT',
        statusComment: 'Sprint progress updated via automated test',
      }),
    });
    recordResult(
      84,
      'PATCH',
      '/api/tasks/:id',
      updateTaskRes.status,
      updateTaskRes.status === 200,
      'TasksListPage & TaskDetailPage (Edit Modal)',
    );

    // =========================================================================
    // SL 85: ASSIGN TASK (PATCH /api/tasks/:id/assign)
    // =========================================================================
    const assignTaskRes = await fetchWithRetry(`${BASE_URL}/api/tasks/${taskId}/assign`, {
      method: 'PATCH',
      headers: adminHeaders,
      body: JSON.stringify({
        assigneeId: empUserId,
        reason: 'Assigned to AlaguRaja for frontend implementation',
      }),
    });
    recordResult(
      85,
      'PATCH',
      '/api/tasks/:id/assign',
      assignTaskRes.status,
      assignTaskRes.status === 200,
      'TasksListPage & TaskDetailPage (Assign Modal)',
    );

    // =========================================================================
    // SL 97: LIST MY PERSONAL TASKS (GET /api/tasks/my-tasks) - as Employee
    // =========================================================================
    const myTasksRes = await fetchWithRetry(`${BASE_URL}/api/tasks/my-tasks`, {
      method: 'GET',
      headers: empHeaders,
    });
    recordResult(
      97,
      'GET',
      '/api/tasks/my-tasks',
      myTasksRes.status,
      myTasksRes.status === 200,
      'MyTasksPage',
    );

    // =========================================================================
    // SL 91: START TASK TIMER (POST /api/tasks/:id/timer/play) - as Assignee
    // =========================================================================
    const playTimerRes = await fetchWithRetry(`${BASE_URL}/api/tasks/${taskId}/timer/play`, {
      method: 'POST',
      headers: empHeaders,
      body: JSON.stringify({ deviceType: 'WEB' }),
    });
    recordResult(
      91,
      'POST',
      '/api/tasks/:id/timer/play',
      playTimerRes.status,
      playTimerRes.status === 200,
      'MyTasksPage & TaskDetailPage (Timer Controls)',
    );

    // =========================================================================
    // SL 95: GET LIVE ACTIVE TIMER STATUS (GET /api/tasks/timer/active) - as Assignee
    // =========================================================================
    const activeTimerRes = await fetchWithRetry(`${BASE_URL}/api/tasks/timer/active`, {
      method: 'GET',
      headers: empHeaders,
    });
    const activeTimerData = await activeTimerRes.json();
    const hasRunningTimer = (activeTimerData.data?.isRunning || activeTimerData.isRunning) === true;
    recordResult(
      95,
      'GET',
      '/api/tasks/timer/active',
      activeTimerRes.status,
      activeTimerRes.status === 200 && hasRunningTimer,
      'MyTasksPage (Active Timer Pill)',
    );

    await sleep(1500); // Wait 1.5s so timer duration accumulates

    // =========================================================================
    // SL 92: PAUSE TASK TIMER (POST /api/tasks/:id/timer/pause) - as Assignee
    // =========================================================================
    const pauseTimerRes = await fetchWithRetry(`${BASE_URL}/api/tasks/${taskId}/timer/pause`, {
      method: 'POST',
      headers: empHeaders,
      body: JSON.stringify({ reason: 'TEA_BREAK' }),
    });
    recordResult(
      92,
      'POST',
      '/api/tasks/:id/timer/pause',
      pauseTimerRes.status,
      pauseTimerRes.status === 200,
      'MyTasksPage & TaskDetailPage (Pause Modal)',
    );

    // =========================================================================
    // SL 93: RESUME TASK TIMER (POST /api/tasks/:id/timer/resume) - as Assignee
    // =========================================================================
    const resumeTimerRes = await fetchWithRetry(`${BASE_URL}/api/tasks/${taskId}/timer/resume`, {
      method: 'POST',
      headers: empHeaders,
      body: JSON.stringify({ deviceType: 'WEB' }),
    });
    recordResult(
      93,
      'POST',
      '/api/tasks/:id/timer/resume',
      resumeTimerRes.status,
      resumeTimerRes.status === 200,
      'MyTasksPage & TaskDetailPage (Resume Control)',
    );

    // =========================================================================
    // SL 94: STOP TASK TIMER (POST /api/tasks/:id/timer/stop) - as Assignee
    // =========================================================================
    const stopTimerRes = await fetchWithRetry(`${BASE_URL}/api/tasks/${taskId}/timer/stop`, {
      method: 'POST',
      headers: empHeaders,
      body: JSON.stringify({ finalComment: 'Completed test work interval' }),
    });
    recordResult(
      94,
      'POST',
      '/api/tasks/:id/timer/stop',
      stopTimerRes.status,
      stopTimerRes.status === 200,
      'MyTasksPage & TaskDetailPage (Stop Session Modal)',
    );

    // =========================================================================
    // SL 96: LIST TASK TIME ENTRIES (GET /api/tasks/:id/time-entries)
    // =========================================================================
    const timeEntriesRes = await fetchWithRetry(`${BASE_URL}/api/tasks/${taskId}/time-entries`, {
      method: 'GET',
      headers: adminHeaders,
    });
    recordResult(
      96,
      'GET',
      '/api/tasks/:id/time-entries',
      timeEntriesRes.status,
      timeEntriesRes.status === 200,
      'TaskDetailPage (Time Tracking Tab)',
    );

    // =========================================================================
    // SL 98: GET PERSONAL WORKING TIME SUMMARY (GET /api/tasks/my-time-summary)
    // =========================================================================
    const myTimeSummaryRes = await fetchWithRetry(`${BASE_URL}/api/tasks/my-time-summary`, {
      method: 'GET',
      headers: empHeaders,
    });
    recordResult(
      98,
      'GET',
      '/api/tasks/my-time-summary',
      myTimeSummaryRes.status,
      myTimeSummaryRes.status === 200,
      'MyTasksPage (Time Summary Card)',
    );

    // =========================================================================
    // SL 99: GET TASK TIME SUMMARY (GET /api/tasks/:id/time-summary)
    // =========================================================================
    const taskTimeSummaryRes = await fetchWithRetry(`${BASE_URL}/api/tasks/${taskId}/time-summary`, {
      method: 'GET',
      headers: adminHeaders,
    });
    recordResult(
      99,
      'GET',
      '/api/tasks/:id/time-summary',
      taskTimeSummaryRes.status,
      taskTimeSummaryRes.status === 200,
      'TaskDetailPage (Time Summary Breakdown)',
    );

    // =========================================================================
    // SL 102: ADD TASK COMMENT (POST /api/tasks/:id/comments)
    // =========================================================================
    const addCommentRes = await fetchWithRetry(`${BASE_URL}/api/tasks/${taskId}/comments`, {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({
        content: 'Automated test comment with technical discussion notes.',
        isInternal: false,
      }),
    });
    recordResult(
      102,
      'POST',
      '/api/tasks/:id/comments',
      addCommentRes.status,
      addCommentRes.status === 201,
      'TaskDetailPage (Comments Thread)',
    );

    // =========================================================================
    // SL 103: LIST TASK COMMENTS (GET /api/tasks/:id/comments)
    // =========================================================================
    const listCommentsRes = await fetchWithRetry(`${BASE_URL}/api/tasks/${taskId}/comments`, {
      method: 'GET',
      headers: adminHeaders,
    });
    recordResult(
      103,
      'GET',
      '/api/tasks/:id/comments',
      listCommentsRes.status,
      listCommentsRes.status === 200,
      'TaskDetailPage (Comments List)',
    );

    // =========================================================================
    // SL 100: SUBMIT TASK FOR REVIEW (POST /api/tasks/:id/submit) - as Assignee
    // =========================================================================
    const submitReviewRes = await fetchWithRetry(`${BASE_URL}/api/tasks/${taskId}/submit`, {
      method: 'POST',
      headers: empHeaders,
      body: JSON.stringify({
        notes: 'Deliverable complete and ready for supervisor review.',
      }),
    });
    recordResult(
      100,
      'POST',
      '/api/tasks/:id/submit',
      submitReviewRes.status,
      submitReviewRes.status === 200,
      'TaskDetailPage (Submit for Review Modal)',
    );

    // =========================================================================
    // SL 101: APPROVE TASK REVIEW (POST /api/tasks/:id/approve) - as Super Admin
    // =========================================================================
    const approveReviewRes = await fetchWithRetry(`${BASE_URL}/api/tasks/${taskId}/approve`, {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({
        feedback: 'Excellent work verified against functional requirements.',
        rating: 5,
      }),
    });
    recordResult(
      101,
      'POST',
      '/api/tasks/:id/approve',
      approveReviewRes.status,
      approveReviewRes.status === 200,
      'TaskDetailPage (Approve Review Modal)',
    );

    // =========================================================================
    // SL 88: REOPEN TASK (POST /api/tasks/:id/reopen)
    // =========================================================================
    const reopenTaskRes = await fetchWithRetry(`${BASE_URL}/api/tasks/${taskId}/reopen`, {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({ reason: 'Reopened for post-release regression enhancements' }),
    });
    recordResult(
      88,
      'POST',
      '/api/tasks/:id/reopen',
      reopenTaskRes.status,
      reopenTaskRes.status === 200,
      'TasksListPage & TaskDetailPage (Reopen Modal)',
    );

    // =========================================================================
    // SL 86: CANCEL TASK (POST /api/tasks/:id/cancel)
    // =========================================================================
    const cancelTaskRes = await fetchWithRetry(`${BASE_URL}/api/tasks/${taskId}/cancel`, {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({ reason: 'Cancelled deliverable per sprint refinement' }),
    });
    recordResult(
      86,
      'POST',
      '/api/tasks/:id/cancel',
      cancelTaskRes.status,
      cancelTaskRes.status === 200,
      'TasksListPage & TaskDetailPage (Cancel Modal)',
    );

    // =========================================================================
    // SL 104: GET TASK AUDIT HISTORY (GET /api/tasks/:id/history)
    // =========================================================================
    const auditHistoryRes = await fetchWithRetry(`${BASE_URL}/api/tasks/${taskId}/history`, {
      method: 'GET',
      headers: adminHeaders,
    });
    recordResult(
      104,
      'GET',
      '/api/tasks/:id/history',
      auditHistoryRes.status,
      auditHistoryRes.status === 200,
      'TaskDetailPage (Audit History Tab)',
    );

    // =========================================================================
    // SL 105: EMPLOYEE PERSONAL DASHBOARD (GET /api/tasks/dashboard/my)
    // =========================================================================
    const myDashboardRes = await fetchWithRetry(`${BASE_URL}/api/tasks/dashboard/my`, {
      method: 'GET',
      headers: empHeaders,
    });
    recordResult(
      105,
      'GET',
      '/api/tasks/dashboard/my',
      myDashboardRes.status,
      myDashboardRes.status === 200,
      'TaskDashboardsPage (Personal Workspace Tab)',
    );

    // =========================================================================
    // SL 106: MANAGER TEAM DASHBOARD (GET /api/tasks/dashboard/team)
    // =========================================================================
    const teamDashboardRes = await fetchWithRetry(`${BASE_URL}/api/tasks/dashboard/team`, {
      method: 'GET',
      headers: adminHeaders,
    });
    recordResult(
      106,
      'GET',
      '/api/tasks/dashboard/team',
      teamDashboardRes.status,
      teamDashboardRes.status === 200,
      'TaskDashboardsPage (Team Management Tab)',
    );

    // =========================================================================
    // SL 107: ORGANIZATION TASK DASHBOARD (GET /api/tasks/dashboard/organization)
    // =========================================================================
    const orgDashboardRes = await fetchWithRetry(`${BASE_URL}/api/tasks/dashboard/organization`, {
      method: 'GET',
      headers: adminHeaders,
    });
    recordResult(
      107,
      'GET',
      '/api/tasks/dashboard/organization',
      orgDashboardRes.status,
      orgDashboardRes.status === 200,
      'TaskDashboardsPage (Organization Overview Tab)',
    );

    // =========================================================================
    // SL 108: TASK SUMMARY REPORT (GET /api/tasks/reports/summary)
    // =========================================================================
    const summaryReportRes = await fetchWithRetry(`${BASE_URL}/api/tasks/reports/summary`, {
      method: 'GET',
      headers: adminHeaders,
    });
    recordResult(
      108,
      'GET',
      '/api/tasks/reports/summary',
      summaryReportRes.status,
      summaryReportRes.status === 200,
      'TaskReportsPage (Volume & Summary Tab)',
    );

    // =========================================================================
    // SL 109: EMPLOYEE WORKING HOURS REPORT (GET /api/tasks/reports/working-hours)
    // =========================================================================
    const workingHoursReportRes = await fetchWithRetry(`${BASE_URL}/api/tasks/reports/working-hours`, {
      method: 'GET',
      headers: adminHeaders,
    });
    recordResult(
      109,
      'GET',
      '/api/tasks/reports/working-hours',
      workingHoursReportRes.status,
      workingHoursReportRes.status === 200,
      'TaskReportsPage (Working Hours & Pauses Tab)',
    );

    // =========================================================================
    // SL 110: EMPLOYEE TASK PERFORMANCE REPORT (GET /api/tasks/reports/employee-performance)
    // =========================================================================
    const performanceReportRes = await fetchWithRetry(`${BASE_URL}/api/tasks/reports/employee-performance`, {
      method: 'GET',
      headers: adminHeaders,
    });
    recordResult(
      110,
      'GET',
      '/api/tasks/reports/employee-performance',
      performanceReportRes.status,
      performanceReportRes.status === 200,
      'TaskReportsPage (Employee Performance Tab)',
    );

    // =========================================================================
    // SL 111: OVERDUE TASKS REPORT (GET /api/tasks/reports/overdue)
    // =========================================================================
    const overdueReportRes = await fetchWithRetry(`${BASE_URL}/api/tasks/reports/overdue`, {
      method: 'GET',
      headers: adminHeaders,
    });
    recordResult(
      111,
      'GET',
      '/api/tasks/reports/overdue',
      overdueReportRes.status,
      overdueReportRes.status === 200,
      'TaskReportsPage (Overdue SLA Audit Tab)',
    );

    // =========================================================================
    // SL 112: REVIEW SUMMARY REPORT (GET /api/tasks/reports/reviews)
    // =========================================================================
    const reviewsReportRes = await fetchWithRetry(`${BASE_URL}/api/tasks/reports/reviews`, {
      method: 'GET',
      headers: adminHeaders,
    });
    recordResult(
      112,
      'GET',
      '/api/tasks/reports/reviews',
      reviewsReportRes.status,
      reviewsReportRes.status === 200,
      'TaskReportsPage (Review Turnaround Tab)',
    );

    // =========================================================================
    // SL 113: UPLOAD TASK ATTACHMENT (POST /api/tasks/:id/attachments)
    // =========================================================================
    // Build a valid multipart/form-data upload with a safe text file
    const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
    const fileContent = 'Slash CRM Task Deliverable Automated Test Specification.\nApproved for production deployment.\n';
    const postBody = Buffer.concat([
      Buffer.from(`--${boundary}\r\n`),
      Buffer.from('Content-Disposition: form-data; name="file"; filename="test_deliverable.txt"\r\n'),
      Buffer.from('Content-Type: text/plain\r\n\r\n'),
      Buffer.from(fileContent),
      Buffer.from(`\r\n--${boundary}--\r\n`),
    ]);

    const uploadAttachmentRes = await fetchWithRetry(`${BASE_URL}/api/tasks/${taskId}/attachments`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${adminToken}`,
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
      },
      body: postBody,
    });
    const uploadData = await uploadAttachmentRes.json();
    const uploadedAtt = uploadData.data || uploadData;
    const attachmentId = uploadedAtt.id;
    if (uploadedAtt.mediaId) createdMediaIds.push(uploadedAtt.mediaId);

    recordResult(
      113,
      'POST',
      '/api/tasks/:id/attachments',
      uploadAttachmentRes.status,
      uploadAttachmentRes.status === 201 && !!attachmentId,
      'TaskDetailPage (Attachments Tab)',
      `AttachmentId: ${attachmentId}`,
    );

    // =========================================================================
    // SL 114: LIST TASK ATTACHMENTS (GET /api/tasks/:id/attachments)
    // =========================================================================
    const listAttachmentsRes = await fetchWithRetry(`${BASE_URL}/api/tasks/${taskId}/attachments`, {
      method: 'GET',
      headers: adminHeaders,
    });
    recordResult(
      114,
      'GET',
      '/api/tasks/:id/attachments',
      listAttachmentsRes.status,
      listAttachmentsRes.status === 200,
      'TaskDetailPage (Attachments Table)',
    );

    // =========================================================================
    // SL 117: RESCAN ATTACHMENT (POST /api/tasks/:id/attachments/:attachmentId/rescan)
    // =========================================================================
    const rescanAttachmentRes = await fetchWithRetry(
      `${BASE_URL}/api/tasks/${taskId}/attachments/${attachmentId}/rescan`,
      {
        method: 'POST',
        headers: adminHeaders,
      },
    );
    recordResult(
      117,
      'POST',
      '/api/tasks/:id/attachments/:attachmentId/rescan',
      rescanAttachmentRes.status,
      rescanAttachmentRes.status === 200,
      'TaskDetailPage (Rescan Control)',
    );

    // Set scanStatus to CLEAN so download and preview binary endpoints can stream
    if (uploadedAtt.mediaId) {
      await prisma.media.update({
        where: { id: uploadedAtt.mediaId },
        data: { scanStatus: 'CLEAN' },
      });
    }

    // =========================================================================
    // SL 115: DOWNLOAD ATTACHMENT (GET /api/tasks/:id/attachments/:attachmentId/download)
    // =========================================================================
    const downloadRes = await fetchWithRetry(
      `${BASE_URL}/api/tasks/${taskId}/attachments/${attachmentId}/download`,
      {
        method: 'GET',
        headers: adminHeaders,
      },
    );
    const downloadedBlob = await downloadRes.arrayBuffer();
    recordResult(
      115,
      'GET',
      '/api/tasks/:id/attachments/:attachmentId/download',
      downloadRes.status,
      downloadRes.status === 200 && downloadedBlob.byteLength > 0,
      'TaskDetailPage (Download Button)',
      `Bytes: ${downloadedBlob.byteLength}`,
    );

    // =========================================================================
    // SL 116: PREVIEW ATTACHMENT (GET /api/tasks/:id/attachments/:attachmentId/preview)
    // =========================================================================
    // Note: text/plain returns 400 for inline preview (since preview requires pdf or image),
    // or if we upload a small PDF/PNG it returns 200. Let's upload a 100-byte valid PDF to verify 200 preview!
    const pdfBoundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
    const pdfContent = '%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n>>\nendobj\ntrailer\n<<\n/Root 1 0 R\n>>\n%%EOF\n';
    const pdfBody = Buffer.concat([
      Buffer.from(`--${pdfBoundary}\r\n`),
      Buffer.from('Content-Disposition: form-data; name="file"; filename="test_deliverable.pdf"\r\n'),
      Buffer.from('Content-Type: application/pdf\r\n\r\n'),
      Buffer.from(pdfContent),
      Buffer.from(`\r\n--${pdfBoundary}--\r\n`),
    ]);

    const pdfUploadRes = await fetchWithRetry(`${BASE_URL}/api/tasks/${taskId}/attachments`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${adminToken}`,
        'Content-Type': `multipart/form-data; boundary=${pdfBoundary}`,
      },
      body: pdfBody,
    });
    const pdfUploadData = await pdfUploadRes.json();
    const pdfAtt = pdfUploadData.data || pdfUploadData;
    if (pdfAtt.mediaId) {
      await prisma.media.update({
        where: { id: pdfAtt.mediaId },
        data: { scanStatus: 'CLEAN' },
      });
    }

    const previewRes = await fetchWithRetry(
      `${BASE_URL}/api/tasks/${taskId}/attachments/${pdfAtt.id}/preview`,
      {
        method: 'GET',
        headers: adminHeaders,
      },
    );
    const previewBlob = await previewRes.arrayBuffer();
    recordResult(
      116,
      'GET',
      '/api/tasks/:id/attachments/:attachmentId/preview',
      previewRes.status,
      previewRes.status === 200 && previewBlob.byteLength > 0,
      'TaskDetailPage (Preview Modal)',
      `Preview bytes: ${previewBlob.byteLength}`,
    );

    // Clean up temporary pdf attachment
    await fetchWithRetry(
      `${BASE_URL}/api/tasks/${taskId}/attachments/${pdfAtt.id}`,
      {
        method: 'DELETE',
        headers: adminHeaders,
      },
    );

    // =========================================================================
    // SL 118: DELETE ATTACHMENT (DELETE /api/tasks/:id/attachments/:attachmentId)
    // =========================================================================
    const deleteAttRes = await fetchWithRetry(
      `${BASE_URL}/api/tasks/${taskId}/attachments/${attachmentId}`,
      {
        method: 'DELETE',
        headers: adminHeaders,
      },
    );
    recordResult(
      118,
      'DELETE',
      '/api/tasks/:id/attachments/:attachmentId',
      deleteAttRes.status,
      deleteAttRes.status === 200,
      'TaskDetailPage (Delete Attachment)',
    );

    // =========================================================================
    // SL 87: SOFT DELETE TASK (DELETE /api/tasks/:id)
    // =========================================================================
    const deleteTaskRes = await fetchWithRetry(`${BASE_URL}/api/tasks/${taskId}`, {
      method: 'DELETE',
      headers: adminHeaders,
    });
    recordResult(
      87,
      'DELETE',
      '/api/tasks/:id',
      deleteTaskRes.status,
      deleteTaskRes.status === 200,
      'TasksListPage & TaskDetailPage (Delete Confirm)',
    );

    console.log('\n=== Verification Summary ===');
    const passed = results.filter((r) => r.pass === 'PASS').length;
    const total = results.length;
    console.log(`Passed: ${passed}/${total} endpoints (${Math.round((passed / total) * 100)}%)`);

    if (passed === 38 && total === 38) {
      console.log('\n🌟 ALL 38 PHASE 5 TASKS & KANBAN MANAGEMENT APIS VERIFIED 100% OPERATIONAL!');
    } else {
      console.error(`\n⚠️ Failure detected: only ${passed}/${total} passed.`);
      process.exitCode = 1;
    }
  } catch (err) {
    console.error('Fatal test execution error:', err);
    process.exitCode = 1;
  } finally {
    await performCleanup();
    await prisma.$disconnect();
  }
}

main();
