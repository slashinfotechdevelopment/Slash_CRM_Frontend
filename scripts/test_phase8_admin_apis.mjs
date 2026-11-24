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
  console.log('=== Testing Phase 8: Executive Dashboards & Reports (8 APIs) ===\n');

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

  try {
    const empUser = await prisma.user.findUnique({
      where: { email: 'alaguraja3104@gmail.com' },
    });
    const employeeId = empUser.id;

    // 1. Sl 140: GET /api/admin/employees/activity
    try {
      const res = await adminClient.get('/api/admin/employees/activity', {
        params: { limit: 20 },
      });
      results.push({
        sl: 140,
        method: 'GET',
        path: '/api/admin/employees/activity',
        status: res.status,
        pass: res.status === 200,
        dataSummary: `items: ${res.data?.data?.items?.length ?? 0}`,
      });
    } catch (err) {
      results.push({
        sl: 140,
        method: 'GET',
        path: '/api/admin/employees/activity',
        status: err.response?.status || 500,
        pass: false,
        error: err.response?.data?.message || err.message,
      });
    }

    // 2. Sl 141: GET /api/admin/employees/:id/sessions
    try {
      const res = await adminClient.get(`/api/admin/employees/${employeeId}/sessions`, {
        params: { limit: 10 },
      });
      results.push({
        sl: 141,
        method: 'GET',
        path: `/api/admin/employees/:id/sessions`,
        status: res.status,
        pass: res.status === 200,
        dataSummary: `sessions: ${res.data?.data?.items?.length ?? 0}`,
      });
    } catch (err) {
      results.push({
        sl: 141,
        method: 'GET',
        path: `/api/admin/employees/:id/sessions`,
        status: err.response?.status || 500,
        pass: false,
        error: err.response?.data?.message || err.message,
      });
    }

    // 3. Sl 142: GET /api/admin/employees/:id/tasks
    try {
      const res = await adminClient.get(`/api/admin/employees/${employeeId}/tasks`, {
        params: { limit: 10 },
      });
      results.push({
        sl: 142,
        method: 'GET',
        path: `/api/admin/employees/:id/tasks`,
        status: res.status,
        pass: res.status === 200,
        dataSummary: `tasks: ${res.data?.data?.items?.length ?? 0}`,
      });
    } catch (err) {
      results.push({
        sl: 142,
        method: 'GET',
        path: `/api/admin/employees/:id/tasks`,
        status: err.response?.status || 500,
        pass: false,
        error: err.response?.data?.message || err.message,
      });
    }

    // 4. Sl 143: GET /api/admin/tasks/summary
    try {
      const res = await adminClient.get('/api/admin/tasks/summary');
      results.push({
        sl: 143,
        method: 'GET',
        path: '/api/admin/tasks/summary',
        status: res.status,
        pass: res.status === 200,
        dataSummary: `summary count: ${res.data?.data?.summary?.length ?? 0}`,
      });
    } catch (err) {
      results.push({
        sl: 143,
        method: 'GET',
        path: '/api/admin/tasks/summary',
        status: err.response?.status || 500,
        pass: false,
        error: err.response?.data?.message || err.message,
      });
    }

    // 5. Sl 144: GET /api/admin/leads/summary
    try {
      const res = await adminClient.get('/api/admin/leads/summary');
      results.push({
        sl: 144,
        method: 'GET',
        path: '/api/admin/leads/summary',
        status: res.status,
        pass: res.status === 200,
        dataSummary: `totalLeads: ${res.data?.data?.totalLeads ?? 0}, newLeads: ${res.data?.data?.newLeads ?? 0}`,
      });
    } catch (err) {
      results.push({
        sl: 144,
        method: 'GET',
        path: '/api/admin/leads/summary',
        status: err.response?.status || 500,
        pass: false,
        error: err.response?.data?.message || err.message,
      });
    }

    // 6. Sl 145: GET /api/admin/leads/by-employee
    try {
      const res = await adminClient.get('/api/admin/leads/by-employee');
      results.push({
        sl: 145,
        method: 'GET',
        path: '/api/admin/leads/by-employee',
        status: res.status,
        pass: res.status === 200,
        dataSummary: `employees: ${Array.isArray(res.data?.data) ? res.data?.data?.length : 0}`,
      });
    } catch (err) {
      results.push({
        sl: 145,
        method: 'GET',
        path: '/api/admin/leads/by-employee',
        status: err.response?.status || 500,
        pass: false,
        error: err.response?.data?.message || err.message,
      });
    }

    // 7. Sl 146: GET /api/admin/leads/trend
    try {
      const res = await adminClient.get('/api/admin/leads/trend', {
        params: { interval: 'day' },
      });
      results.push({
        sl: 146,
        method: 'GET',
        path: '/api/admin/leads/trend',
        status: res.status,
        pass: res.status === 200,
        dataSummary: `points: ${Array.isArray(res.data?.data) ? res.data?.data?.length : 0}`,
      });
    } catch (err) {
      results.push({
        sl: 146,
        method: 'GET',
        path: '/api/admin/leads/trend',
        status: err.response?.status || 500,
        pass: false,
        error: err.response?.data?.message || err.message,
      });
    }

    // 8. Sl 147: GET /api/admin/leads/by-source
    try {
      const res = await adminClient.get('/api/admin/leads/by-source');
      results.push({
        sl: 147,
        method: 'GET',
        path: '/api/admin/leads/by-source',
        status: res.status,
        pass: res.status === 200,
        dataSummary: `sources: ${Array.isArray(res.data?.data) ? res.data?.data?.length : 0}`,
      });
    } catch (err) {
      results.push({
        sl: 147,
        method: 'GET',
        path: '/api/admin/leads/by-source',
        status: err.response?.status || 500,
        pass: false,
        error: err.response?.data?.message || err.message,
      });
    }

    // Security Check: Verify SuperAdminGuard blocks non-admin employee
    try {
      await empClient.get('/api/admin/employees/activity');
      console.log('WARNING: Employee unexpectedly accessed admin endpoint!');
    } catch (err) {
      console.log(`Security Boundary Verified: Employee access returned HTTP ${err.response?.status} (${err.response?.data?.message || 'Forbidden'})`);
    }

    console.table(
      results.map((r) => ({
        Sl: r.sl,
        Method: r.method,
        Path: r.path,
        Status: r.status,
        Pass: r.pass ? 'PASS' : 'FAIL',
        Details: r.dataSummary || r.error || '',
      }))
    );

    const passedCount = results.filter((r) => r.pass).length;
    console.log(`\nResults: ${passedCount} / ${results.length} Phase 8 APIs PASSED.`);
  } finally {
    await prisma.$disconnect();
  }
}

run().catch((err) => {
  console.error('Fatal error running Phase 8 test:', err);
  process.exit(1);
});
