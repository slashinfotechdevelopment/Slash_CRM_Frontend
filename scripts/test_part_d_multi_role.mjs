import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:5000';

async function loginUser(email) {
  await axios.post(`${BASE_URL}/api/auth/send-otp`, { email });
  const res = await axios.post(`${BASE_URL}/api/auth/verify-otp`, { email, otp: '123456' });
  const data = res.data?.data || res.data;
  return data.accessToken;
}

async function run() {
  console.log('=== PART D: Multi-Role RBAC & Access Control Regression Audit ===\n');

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

  const tests = [
    // Super Admin Privileges
    { role: 'Super Admin', route: 'GET /api/admin/employees/activity', call: () => adminClient.get('/api/admin/employees/activity'), expectedStatus: 200 },
    { role: 'Super Admin', route: 'GET /api/admin/tasks/summary', call: () => adminClient.get('/api/admin/tasks/summary'), expectedStatus: 200 },
    { role: 'Super Admin', route: 'GET /api/admin/leads/summary', call: () => adminClient.get('/api/admin/leads/summary'), expectedStatus: 200 },
    { role: 'Super Admin', route: 'GET /api/roles', call: () => adminClient.get('/api/roles'), expectedStatus: 200 },
    { role: 'Super Admin', route: 'GET /api/departments', call: () => adminClient.get('/api/departments'), expectedStatus: 200 },
    { role: 'Super Admin', route: 'GET /api/users', call: () => adminClient.get('/api/users'), expectedStatus: 200 },

    // Employee RBAC Barriers (Must be blocked 403)
    { role: 'Employee', route: 'GET /api/admin/employees/activity (Blocked)', call: () => empClient.get('/api/admin/employees/activity'), expectedStatus: 403 },
    { role: 'Employee', route: 'GET /api/admin/tasks/summary (Blocked)', call: () => empClient.get('/api/admin/tasks/summary'), expectedStatus: 403 },
    { role: 'Employee', route: 'GET /api/admin/leads/summary (Blocked)', call: () => empClient.get('/api/admin/leads/summary'), expectedStatus: 403 },

    // Employee Self-Service (Must be allowed 200)
    { role: 'Employee', route: 'GET /api/auth/me', call: () => empClient.get('/api/auth/me'), expectedStatus: 200 },
    { role: 'Employee', route: 'GET /api/attendance/today', call: () => empClient.get('/api/attendance/today'), expectedStatus: 200 },
    { role: 'Employee', route: 'GET /api/attendance/history', call: () => empClient.get('/api/attendance/history'), expectedStatus: 200 },
    { role: 'Employee', route: 'GET /api/tasks/my-tasks', call: () => empClient.get('/api/tasks/my-tasks'), expectedStatus: 200 },
    { role: 'Employee', route: 'GET /api/leave/balances/my', call: () => empClient.get('/api/leave/balances/my'), expectedStatus: 200 },
    { role: 'Employee', route: 'GET /api/leave/holidays', call: () => empClient.get('/api/leave/holidays'), expectedStatus: 200 },
  ];

  const results = [];

  for (const t of tests) {
    try {
      const res = await t.call();
      const pass = res.status === t.expectedStatus;
      results.push({
        Role: t.role,
        Target: t.route,
        Expected: t.expectedStatus,
        Actual: res.status,
        Verdict: pass ? 'PASS' : 'FAIL',
      });
    } catch (err) {
      const actual = err.response?.status || 500;
      const pass = actual === t.expectedStatus;
      results.push({
        Role: t.role,
        Target: t.route,
        Expected: t.expectedStatus,
        Actual: actual,
        Verdict: pass ? 'PASS' : 'FAIL',
      });
    }
  }

  console.table(results);
  const allPassed = results.every((r) => r.Verdict === 'PASS');
  console.log(`\nOverall RBAC Verdict: ${allPassed ? 'ALL PASS (100% Secure)' : 'FAILURES DETECTED'}`);
}

run().catch(console.error);
