import axios from 'axios';
import { PrismaMariaDb } from 'file:///D:/Slash-Projects/Slash_CRM_Backend/node_modules/@prisma/adapter-mariadb/dist/index.mjs';
import { PrismaClient } from 'file:///D:/Slash-Projects/Slash_CRM_Backend/dist/generated/prisma/client.js';

const BASE_URL = 'http://127.0.0.1:5000';
const adapter = new PrismaMariaDb({
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: '2026',
  database: 'slash_infotech_crm',
});
const prisma = new PrismaClient({ adapter });

async function loginUser(email) {
  await axios.post(`${BASE_URL}/api/auth/send-otp`, { email });
  const res = await axios.post(`${BASE_URL}/api/auth/verify-otp`, { email, otp: '123456' });
  const data = res.data?.data || res.data;
  return data.accessToken;
}

async function run() {
  console.log('=== Testing Phase 7: Leave & Holidays Management (26 APIs) ===\n');

  const adminToken = await loginUser('srihari8489@gmail.com');
  const employeeToken = await loginUser('alaguraja3104@gmail.com');

  const adminClient = axios.create({
    baseURL: BASE_URL,
    headers: { Authorization: `Bearer ${adminToken}` },
  });

  const empClient = axios.create({
    baseURL: BASE_URL,
    headers: { Authorization: `Bearer ${employeeToken}` },
  });

  const results = [];
  const testIds = {
    leaveTypeId: null,
    holidayId: null,
    weeklyOffId: null,
    leaveRequestId: null,
    cancellationId: null,
    employeeUserId: null,
  };

  try {
    const empUser = await prisma.user.findUnique({
      where: { email: 'alaguraja3104@gmail.com' },
    });
    testIds.employeeUserId = empUser.id;

    // Pre-test clean up of any dangling test records
    await prisma.leaveTransaction.deleteMany({ where: { leaveType: { code: 'TEST_VACATION' } } });
    await prisma.leaveBalance.deleteMany({ where: { leaveType: { code: 'TEST_VACATION' } } });
    await prisma.leavePolicyVersion.deleteMany({ where: { leaveType: { code: 'TEST_VACATION' } } });
    await prisma.leaveType.deleteMany({ where: { code: 'TEST_VACATION' } });
    await prisma.holiday.deleteMany({ where: { name: { startsWith: 'TEST' } } });
    await prisma.weeklyOffPolicy.deleteMany({ where: { name: { startsWith: 'TEST' } } });

    // -------------------------------------------------------------
    // Sl 148: POST /api/leave/types
    // -------------------------------------------------------------
    try {
      const res = await adminClient.post('/api/leave/types', {
        code: 'TEST_VACATION',
        name: 'TEST Vacation Leave',
        description: 'Temporary leave type for testing',
        category: 'PAID',
        annualAllocation: 15,
        accrualFrequency: 'ANNUAL',
        allowHalfDay: true,
      });
      const data = res.data?.data || res.data;
      testIds.leaveTypeId = data.leaveType?.id || data.id;
      results.push({ sl: 148, name: 'Create Leave Type', method: 'POST', path: '/api/leave/types', status: res.status, result: 'PASS' });
    } catch (err) {
      results.push({ sl: 148, name: 'Create Leave Type', method: 'POST', path: '/api/leave/types', status: err.response?.status || 500, result: 'FAIL', error: err.response?.data?.message || err.message });
    }

    // -------------------------------------------------------------
    // Sl 149: GET /api/leave/types
    // -------------------------------------------------------------
    try {
      const res = await adminClient.get('/api/leave/types', { params: { includeInactive: true } });
      results.push({ sl: 149, name: 'List Leave Types', method: 'GET', path: '/api/leave/types', status: res.status, result: 'PASS' });
    } catch (err) {
      results.push({ sl: 149, name: 'List Leave Types', method: 'GET', path: '/api/leave/types', status: err.response?.status || 500, result: 'FAIL' });
    }

    // -------------------------------------------------------------
    // Sl 150: GET /api/leave/types/:id
    // -------------------------------------------------------------
    try {
      const res = await adminClient.get(`/api/leave/types/${testIds.leaveTypeId}`);
      results.push({ sl: 150, name: 'Get Leave Type By ID', method: 'GET', path: `/api/leave/types/:id`, status: res.status, result: 'PASS' });
    } catch (err) {
      results.push({ sl: 150, name: 'Get Leave Type By ID', method: 'GET', path: `/api/leave/types/:id`, status: err.response?.status || 500, result: 'FAIL' });
    }

    // -------------------------------------------------------------
    // Sl 151: PATCH /api/leave/types/:id
    // -------------------------------------------------------------
    try {
      const res = await adminClient.patch(`/api/leave/types/${testIds.leaveTypeId}`, {
        name: 'TEST Vacation Leave Updated',
        description: 'Updated description',
      });
      results.push({ sl: 151, name: 'Update Leave Type', method: 'PATCH', path: `/api/leave/types/:id`, status: res.status, result: 'PASS' });
    } catch (err) {
      results.push({ sl: 151, name: 'Update Leave Type', method: 'PATCH', path: `/api/leave/types/:id`, status: err.response?.status || 500, result: 'FAIL' });
    }

    // -------------------------------------------------------------
    // Sl 152: POST /api/leave/types/:id/versions
    // -------------------------------------------------------------
    try {
      const res = await adminClient.post(`/api/leave/types/${testIds.leaveTypeId}/versions`, {
        effectiveFrom: '2026-06-01',
        annualAllocation: 18,
        accrualFrequency: 'ANNUAL',
        carryForwardLimit: 5,
        allowHalfDay: true,
      });
      results.push({ sl: 152, name: 'Create Policy Version', method: 'POST', path: `/api/leave/types/:id/versions`, status: res.status, result: 'PASS' });
    } catch (err) {
      results.push({ sl: 152, name: 'Create Policy Version', method: 'POST', path: `/api/leave/types/:id/versions`, status: err.response?.status || 500, result: 'FAIL', error: err.response?.data?.message || err.message });
    }

    // -------------------------------------------------------------
    // Sl 153: POST /api/leave/holidays
    // -------------------------------------------------------------
    try {
      const res = await adminClient.post('/api/leave/holidays', {
        name: 'TEST Holiday Festival',
        date: '2026-11-28',
        year: 2026,
        description: 'Test holiday record',
        isOptional: false,
        scopeType: 'GLOBAL',
      });
      const data = res.data?.data || res.data;
      testIds.holidayId = data.id;
      results.push({ sl: 153, name: 'Create Holiday', method: 'POST', path: '/api/leave/holidays', status: res.status, result: 'PASS' });
    } catch (err) {
      results.push({ sl: 153, name: 'Create Holiday', method: 'POST', path: '/api/leave/holidays', status: err.response?.status || 500, result: 'FAIL', error: err.response?.data?.message || err.message });
    }

    // -------------------------------------------------------------
    // Sl 154: GET /api/leave/holidays
    // -------------------------------------------------------------
    try {
      const res = await adminClient.get('/api/leave/holidays', { params: { year: 2026 } });
      results.push({ sl: 154, name: 'List Holidays', method: 'GET', path: '/api/leave/holidays', status: res.status, result: 'PASS' });
    } catch (err) {
      results.push({ sl: 154, name: 'List Holidays', method: 'GET', path: '/api/leave/holidays', status: err.response?.status || 500, result: 'FAIL' });
    }

    // -------------------------------------------------------------
    // Sl 155: PATCH /api/leave/holidays/:id
    // -------------------------------------------------------------
    try {
      const res = await adminClient.patch(`/api/leave/holidays/${testIds.holidayId}`, {
        name: 'TEST Holiday Festival Updated',
        description: 'Updated holiday notes',
      });
      results.push({ sl: 155, name: 'Update Holiday', method: 'PATCH', path: `/api/leave/holidays/:id`, status: res.status, result: 'PASS' });
    } catch (err) {
      results.push({ sl: 155, name: 'Update Holiday', method: 'PATCH', path: `/api/leave/holidays/:id`, status: err.response?.status || 500, result: 'FAIL' });
    }

    // -------------------------------------------------------------
    // Sl 176: GET /api/leave/holidays/calendar.ics
    // -------------------------------------------------------------
    try {
      const res = await adminClient.get('/api/leave/holidays/calendar.ics', { params: { year: 2026 } });
      results.push({ sl: 176, name: 'Get iCal Holiday Feed', method: 'GET', path: '/api/leave/holidays/calendar.ics', status: res.status, result: 'PASS' });
    } catch (err) {
      results.push({ sl: 176, name: 'Get iCal Holiday Feed', method: 'GET', path: '/api/leave/holidays/calendar.ics', status: err.response?.status || 500, result: 'FAIL' });
    }

    // -------------------------------------------------------------
    // Sl 177: POST /api/leave/holidays/sync-google-calendar
    // -------------------------------------------------------------
    try {
      const res = await adminClient.post('/api/leave/holidays/sync-google-calendar', {
        year: 2026,
        region: 'IN',
        overwriteExisting: true,
      });
      results.push({ sl: 177, name: 'Sync Google Calendar Holidays', method: 'POST', path: '/api/leave/holidays/sync-google-calendar', status: res.status, result: 'PASS' });
    } catch (err) {
      results.push({ sl: 177, name: 'Sync Google Calendar Holidays', method: 'POST', path: '/api/leave/holidays/sync-google-calendar', status: err.response?.status || 500, result: 'FAIL', error: err.response?.data?.message || err.message });
    }

    // -------------------------------------------------------------
    // Sl 178: DELETE /api/leave/holidays/:id
    // -------------------------------------------------------------
    try {
      const res = await adminClient.delete(`/api/leave/holidays/${testIds.holidayId}`);
      testIds.holidayId = null; // Marked deleted
      results.push({ sl: 178, name: 'Delete Holiday', method: 'DELETE', path: `/api/leave/holidays/:id`, status: res.status, result: 'PASS' });
    } catch (err) {
      results.push({ sl: 178, name: 'Delete Holiday', method: 'DELETE', path: `/api/leave/holidays/:id`, status: err.response?.status || 500, result: 'FAIL' });
    }

    // -------------------------------------------------------------
    // Sl 156: POST /api/leave/weekly-off-policies
    // -------------------------------------------------------------
    try {
      const res = await adminClient.post('/api/leave/weekly-off-policies', {
        name: 'TEST Weekly Off Policy',
        daysOfWeek: [0, 6],
        effectiveFrom: '2029-01-01',
        pattern: 'ALL',
        scopeType: 'GLOBAL',
      });
      const data = res.data?.data || res.data;
      testIds.weeklyOffId = data.id;
      results.push({ sl: 156, name: 'Create Weekly-Off Policy', method: 'POST', path: '/api/leave/weekly-off-policies', status: res.status, result: 'PASS' });
    } catch (err) {
      results.push({ sl: 156, name: 'Create Weekly-Off Policy', method: 'POST', path: '/api/leave/weekly-off-policies', status: err.response?.status || 500, result: 'FAIL', error: err.response?.data?.message || err.message });
    }

    // -------------------------------------------------------------
    // Sl 157: GET /api/leave/weekly-off-policies
    // -------------------------------------------------------------
    try {
      const res = await adminClient.get('/api/leave/weekly-off-policies');
      results.push({ sl: 157, name: 'List Weekly-Off Policies', method: 'GET', path: '/api/leave/weekly-off-policies', status: res.status, result: 'PASS' });
    } catch (err) {
      results.push({ sl: 157, name: 'List Weekly-Off Policies', method: 'GET', path: '/api/leave/weekly-off-policies', status: err.response?.status || 500, result: 'FAIL' });
    }

    // -------------------------------------------------------------
    // Sl 165: GET /api/leave/balances/my
    // -------------------------------------------------------------
    try {
      const res = await empClient.get('/api/leave/balances/my', { params: { year: 2026 } });
      results.push({ sl: 165, name: 'Get My Leave Balances', method: 'GET', path: '/api/leave/balances/my', status: res.status, result: 'PASS' });
    } catch (err) {
      results.push({ sl: 165, name: 'Get My Leave Balances', method: 'GET', path: '/api/leave/balances/my', status: err.response?.status || 500, result: 'FAIL' });
    }

    // -------------------------------------------------------------
    // Sl 166: GET /api/leave/balances
    // -------------------------------------------------------------
    try {
      const res = await adminClient.get('/api/leave/balances', { params: { year: 2026, limit: 10 } });
      results.push({ sl: 166, name: 'Get Employee Leave Balances', method: 'GET', path: '/api/leave/balances', status: res.status, result: 'PASS' });
    } catch (err) {
      results.push({ sl: 166, name: 'Get Employee Leave Balances', method: 'GET', path: '/api/leave/balances', status: err.response?.status || 500, result: 'FAIL' });
    }

    // -------------------------------------------------------------
    // Sl 167: POST /api/leave/balances/adjust
    // -------------------------------------------------------------
    try {
      const res = await adminClient.post('/api/leave/balances/adjust', {
        userId: testIds.employeeUserId,
        leaveTypeId: testIds.leaveTypeId,
        year: 2026,
        adjustedDays: 5,
        reason: 'TEST manual adjustment for testing lifecycle',
      });
      results.push({ sl: 167, name: 'Adjust Leave Balance', method: 'POST', path: '/api/leave/balances/adjust', status: res.status, result: 'PASS' });
    } catch (err) {
      results.push({ sl: 167, name: 'Adjust Leave Balance', method: 'POST', path: '/api/leave/balances/adjust', status: err.response?.status || 500, result: 'FAIL', error: err.response?.data?.message || err.message });
    }

    // -------------------------------------------------------------
    // Sl 168: GET /api/leave/transactions
    // -------------------------------------------------------------
    try {
      const res = await adminClient.get('/api/leave/transactions', { params: { limit: 10 } });
      results.push({ sl: 168, name: 'Get Leave Transactions Ledger', method: 'GET', path: '/api/leave/transactions', status: res.status, result: 'PASS' });
    } catch (err) {
      results.push({ sl: 168, name: 'Get Leave Transactions Ledger', method: 'GET', path: '/api/leave/transactions', status: err.response?.status || 500, result: 'FAIL' });
    }

    // -------------------------------------------------------------
    // Sl 158: POST /api/leave/requests (Employee applies)
    // -------------------------------------------------------------
    try {
      const res = await empClient.post('/api/leave/requests', {
        leaveTypeId: testIds.leaveTypeId,
        startDate: '2026-11-24',
        endDate: '2026-11-24',
        isHalfDay: false,
        reason: 'TEST personal emergency leave application',
      });
      const data = res.data?.data || res.data;
      testIds.leaveRequestId = data.id;
      results.push({ sl: 158, name: 'Apply For Leave', method: 'POST', path: '/api/leave/requests', status: res.status, result: 'PASS' });
    } catch (err) {
      results.push({ sl: 158, name: 'Apply For Leave', method: 'POST', path: '/api/leave/requests', status: err.response?.status || 500, result: 'FAIL', error: err.response?.data?.message || err.message });
    }

    // -------------------------------------------------------------
    // Sl 159: GET /api/leave/requests/my
    // -------------------------------------------------------------
    try {
      const res = await empClient.get('/api/leave/requests/my');
      results.push({ sl: 159, name: 'List My Leave Requests', method: 'GET', path: '/api/leave/requests/my', status: res.status, result: 'PASS' });
    } catch (err) {
      results.push({ sl: 159, name: 'List My Leave Requests', method: 'GET', path: '/api/leave/requests/my', status: err.response?.status || 500, result: 'FAIL' });
    }

    // -------------------------------------------------------------
    // Sl 160: GET /api/leave/requests
    // -------------------------------------------------------------
    try {
      const res = await adminClient.get('/api/leave/requests', { params: { status: 'PENDING' } });
      results.push({ sl: 160, name: 'List Leave Requests (Manager/HR)', method: 'GET', path: '/api/leave/requests', status: res.status, result: 'PASS' });
    } catch (err) {
      results.push({ sl: 160, name: 'List Leave Requests (Manager/HR)', method: 'GET', path: '/api/leave/requests', status: err.response?.status || 500, result: 'FAIL' });
    }

    // -------------------------------------------------------------
    // Sl 161: GET /api/leave/requests/:id
    // -------------------------------------------------------------
    try {
      const res = await adminClient.get(`/api/leave/requests/${testIds.leaveRequestId}`);
      results.push({ sl: 161, name: 'Get Leave Request Details', method: 'GET', path: `/api/leave/requests/:id`, status: res.status, result: 'PASS' });
    } catch (err) {
      results.push({ sl: 161, name: 'Get Leave Request Details', method: 'GET', path: `/api/leave/requests/:id`, status: err.response?.status || 500, result: 'FAIL' });
    }

    // -------------------------------------------------------------
    // Sl 162: POST /api/leave/requests/:id/review (Approve)
    // -------------------------------------------------------------
    try {
      const res = await adminClient.post(`/api/leave/requests/${testIds.leaveRequestId}/review`, {
        decision: 'APPROVED',
        comments: 'TEST Approved for testing lifecycle',
      });
      results.push({ sl: 162, name: 'Review Leave Request (Approve)', method: 'POST', path: `/api/leave/requests/:id/review`, status: res.status, result: 'PASS' });
    } catch (err) {
      results.push({ sl: 162, name: 'Review Leave Request (Approve)', method: 'POST', path: `/api/leave/requests/:id/review`, status: err.response?.status || 500, result: 'FAIL', error: err.response?.data?.message || err.message });
    }

    // -------------------------------------------------------------
    // Sl 163: POST /api/leave/requests/:id/cancel
    // -------------------------------------------------------------
    try {
      const res = await empClient.post(`/api/leave/requests/${testIds.leaveRequestId}/cancel`, {
        reason: 'TEST cancellation request since event was postponed',
      });
      const data = res.data?.data || res.data;
      testIds.cancellationId = data.cancellation?.id;
      results.push({ sl: 163, name: 'Request Leave Cancellation', method: 'POST', path: `/api/leave/requests/:id/cancel`, status: res.status, result: 'PASS' });
    } catch (err) {
      results.push({ sl: 163, name: 'Request Leave Cancellation', method: 'POST', path: `/api/leave/requests/:id/cancel`, status: err.response?.status || 500, result: 'FAIL', error: err.response?.data?.message || err.message });
    }

    // -------------------------------------------------------------
    // Sl 164: POST /api/leave/cancellations/:id/review
    // -------------------------------------------------------------
    try {
      const res = await adminClient.post(`/api/leave/cancellations/${testIds.cancellationId}/review`, {
        decision: 'APPROVED',
        reviewerNotes: 'TEST Cancellation confirmed and balance restored',
      });
      results.push({ sl: 164, name: 'Review Cancellation Request', method: 'POST', path: `/api/leave/cancellations/:id/review`, status: res.status, result: 'PASS' });
    } catch (err) {
      results.push({ sl: 164, name: 'Review Cancellation Request', method: 'POST', path: `/api/leave/cancellations/:id/review`, status: err.response?.status || 500, result: 'FAIL', error: err.response?.data?.message || err.message });
    }

    // -------------------------------------------------------------
    // Sl 169: GET /api/leave/calendar
    // -------------------------------------------------------------
    try {
      const res = await adminClient.get('/api/leave/calendar', {
        params: { startDate: '2026-11-01', endDate: '2026-11-30' },
      });
      results.push({ sl: 169, name: 'Get Leave Calendar', method: 'GET', path: '/api/leave/calendar', status: res.status, result: 'PASS' });
    } catch (err) {
      results.push({ sl: 169, name: 'Get Leave Calendar', method: 'GET', path: '/api/leave/calendar', status: err.response?.status || 500, result: 'FAIL' });
    }

    // -------------------------------------------------------------
    // Sl 170: GET /api/leave/reports/summary
    // -------------------------------------------------------------
    try {
      const res = await adminClient.get('/api/leave/reports/summary', { params: { year: 2026 } });
      results.push({ sl: 170, name: 'Get Leave Reports Summary', method: 'GET', path: '/api/leave/reports/summary', status: res.status, result: 'PASS' });
    } catch (err) {
      results.push({ sl: 170, name: 'Get Leave Reports Summary', method: 'GET', path: '/api/leave/reports/summary', status: err.response?.status || 500, result: 'FAIL' });
    }

    console.table(results);
    const passCount = results.filter((r) => r.result === 'PASS').length;
    console.log(`\nPhase 7 API Results: ${passCount} / ${results.length} PASSED`);

  } finally {
    console.log('\n--- Cleaning up TEST records ---');
    try {
      // 1. Delete test cancellation request
      if (testIds.cancellationId) {
        await prisma.leaveCancellationRequest.deleteMany({
          where: { id: testIds.cancellationId },
        });
        console.log(`Deleted TEST cancellation request: ${testIds.cancellationId}`);
      }

      // 2. Delete test leave request and related transactions
      if (testIds.leaveRequestId) {
        await prisma.leaveTransaction.deleteMany({
          where: { leaveRequestId: testIds.leaveRequestId },
        });
        await prisma.leaveCancellationRequest.deleteMany({
          where: { leaveRequestId: testIds.leaveRequestId },
        });
        await prisma.leaveRequest.deleteMany({
          where: { id: testIds.leaveRequestId },
        });
        console.log(`Deleted TEST leave request: ${testIds.leaveRequestId}`);
      }

      // 3. Delete test balances & remaining transactions on test leave type
      if (testIds.leaveTypeId) {
        await prisma.leaveTransaction.deleteMany({
          where: { leaveTypeId: testIds.leaveTypeId },
        });
        await prisma.leaveBalance.deleteMany({
          where: { leaveTypeId: testIds.leaveTypeId },
        });
        await prisma.leavePolicyVersion.deleteMany({
          where: { leaveTypeId: testIds.leaveTypeId },
        });
        await prisma.leaveType.deleteMany({
          where: { id: testIds.leaveTypeId },
        });
        console.log(`Deleted TEST leave type and versions: ${testIds.leaveTypeId}`);
      }

      // 4. Delete test holiday if still exists
      if (testIds.holidayId) {
        await prisma.holiday.deleteMany({
          where: { id: testIds.holidayId },
        });
        console.log(`Deleted TEST holiday: ${testIds.holidayId}`);
      }

      // 5. Delete test weekly off policy
      if (testIds.weeklyOffId) {
        await prisma.weeklyOffPolicy.deleteMany({
          where: { id: testIds.weeklyOffId },
        });
        console.log(`Deleted TEST weekly off policy: ${testIds.weeklyOffId}`);
      }
    } catch (cleanupErr) {
      console.error('Error during cleanup:', cleanupErr);
    }
    await prisma.$disconnect();
  }
}

run().catch(console.error);
