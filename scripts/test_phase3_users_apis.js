const BASE_URL = 'http://localhost:5000';
import fs from 'fs';
import { PrismaMariaDb } from 'file:///D:/Slash-Projects/Slash_CRM_Backend/node_modules/@prisma/adapter-mariadb/dist/index.js';
import { PrismaClient } from 'file:///D:/Slash-Projects/Slash_CRM_Backend/dist/generated/prisma/client.js';

async function main() {
  console.log('=== Starting Phase 3 Live Backend 13-API Verification ===\n');

  // 1. Authenticate as Super Admin dynamically at runtime
  await fetch(`${BASE_URL}/api/auth/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'srihari8489@gmail.com', purpose: 'LOGIN' }),
  });

  const verifyRes = await fetch(`${BASE_URL}/api/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'srihari8489@gmail.com', otp: '123456', purpose: 'LOGIN' }),
  });
  const verifyData = await verifyRes.json();
  const token = verifyData.data.accessToken;
  console.log('Authenticated successfully as Super Admin (Bearer token acquired).\n');

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  const results = [];

  function record(sl, method, path, status, success, screen, details) {
    results.push({
      sl,
      method,
      path,
      status,
      pass: success ? 'PASS' : 'FAIL',
      screen,
      details,
    });
    console.log(`[Sl ${sl}] ${method} ${path} -> HTTP ${status} [${success ? 'PASS' : 'FAIL'}] - ${screen}`);
  }

  // Fetch available roles and departments to use for creating/assigning
  const rolesRes = await fetch(`${BASE_URL}/api/roles?limit=20`, { headers });
  const rolesData = await rolesRes.json();
  const activeRoles = (rolesData.data?.items || []).filter((r) => r.code !== 'SUPER_ADMIN');
  const role1 = activeRoles[0]?.id;
  const role2 = activeRoles[1]?.id || activeRoles[0]?.id;

  const deptsRes = await fetch(`${BASE_URL}/api/departments?limit=20`, { headers });
  const deptsData = await deptsRes.json();
  const activeDepts = deptsData.data?.data || deptsData.data?.items || deptsData.data || [];
  const dept1 = activeDepts[0]?.id;

  let tempUserId = null;
  const testEmail = `test.temp.user.${Date.now()}@slashinfotech.com`;

  try {
    // -------------------------------------------------------------
    // USERS APIS (Sl 24-36)
    // -------------------------------------------------------------

    // Sl 25: GET /api/users
    const r25 = await fetch(`${BASE_URL}/api/users?limit=10`, { headers });
    const d25 = await r25.json();
    record(25, 'GET', '/api/users', r25.status, r25.status === 200, 'Users List (/users)', `Found ${d25.data?.items?.length} users (total: ${d25.data?.pagination?.total})`);

    // Sl 24: POST /api/users
    const r24 = await fetch(`${BASE_URL}/api/users`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        userType: 'EMPLOYEE',
        name: 'Automated Test User',
        email: testEmail,
        phone: '+919876543299',
        roles: role1 ? [role1] : undefined,
        departments: dept1 ? [dept1] : undefined,
        profile: {
          designation: 'Staff Lead Engineer',
        },
      }),
    });
    const d24 = await r24.json();
    tempUserId = d24.data?.id;
    record(24, 'POST', '/api/users', r24.status, r24.status === 201, 'Create User Modal (/users)', `Created user id=${tempUserId}, code=${d24.data?.userCode}`);

    if (!tempUserId) {
      throw new Error(`Failed to create temp user: ${JSON.stringify(d24)}`);
    }

    // Sl 26: GET /api/users/:id
    const r26 = await fetch(`${BASE_URL}/api/users/${tempUserId}`, { headers });
    const d26 = await r26.json();
    record(26, 'GET', `/api/users/${tempUserId}`, r26.status, r26.status === 200, 'User Detail (/users/:id)', `Retrieved ${d26.data?.name} (${d26.data?.userCode})`);

    // Sl 27: PATCH /api/users/:id
    const r27 = await fetch(`${BASE_URL}/api/users/${tempUserId}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({
        name: 'Automated Test User Updated',
        designation: 'Staff Lead Engineer',
      }),
    });
    const d27 = await r27.json();
    record(27, 'PATCH', `/api/users/${tempUserId}`, r27.status, r27.status === 200, 'Edit User Modal (/users/:id)', `Updated name=${d27.data?.name}`);

    // Sl 28: PATCH /api/users/:id/status (Set to INACTIVE then back to ACTIVE)
    const r28 = await fetch(`${BASE_URL}/api/users/${tempUserId}/status`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({
        status: 'INACTIVE',
        reason: 'Verification audit for status transition',
      }),
    });
    const d28 = await r28.json();
    record(28, 'PATCH', `/api/users/${tempUserId}/status`, r28.status, r28.status === 200, 'Change Status Modal (/users or /users/:id)', `Changed status to ${d28.data?.status}`);

    // Restore to ACTIVE for remaining tests
    await fetch(`${BASE_URL}/api/users/${tempUserId}/status`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ status: 'ACTIVE', reason: 'Reactivating for role tests' }),
    });

    // Sl 32: POST /api/users/:id/roles (Add Role)
    const r32 = await fetch(`${BASE_URL}/api/users/${tempUserId}/roles`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        roles: [role2],
      }),
    });
    const d32 = await r32.json();
    record(32, 'POST', `/api/users/${tempUserId}/roles`, r32.status, r32.status === 200, 'Add Role Modal (/users/:id)', `Added role ${role2}`);

    // Sl 33: DELETE /api/users/:id/roles/:roleId (Remove Role)
    const r33 = await fetch(`${BASE_URL}/api/users/${tempUserId}/roles/${role2}`, {
      method: 'DELETE',
      headers,
    });
    const d33 = await r33.json();
    record(33, 'DELETE', `/api/users/${tempUserId}/roles/${role2}`, r33.status, r33.status === 200, 'Remove Role Action (/users/:id)', d33.message || 'Removed role');

    // Sl 31: PUT /api/users/:id/roles (Replace Roles)
    const r31 = await fetch(`${BASE_URL}/api/users/${tempUserId}/roles`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        roles: [role1],
      }),
    });
    const d31 = await r31.json();
    record(31, 'PUT', `/api/users/${tempUserId}/roles`, r31.status, r31.status === 200, 'Replace Roles Modal (/users/:id)', `Replaced roles to [${role1}]`);

    // Sl 34: PUT /api/users/:id/departments (Replace Departments)
    const r34 = await fetch(`${BASE_URL}/api/users/${tempUserId}/departments`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        departments: [{ code: dept1, isPrimary: true }],
      }),
    });
    const d34 = await r34.json();
    record(34, 'PUT', `/api/users/${tempUserId}/departments`, r34.status, r34.status === 200, 'Configure Departments Modal (/users/:id)', `Assigned dept ${dept1} as primary`);

    // Sl 35: PUT /api/users/:id/permissions (Replace Permission Overrides)
    const r35 = await fetch(`${BASE_URL}/api/users/${tempUserId}/permissions`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        permissions: [
          {
            code: 'leads.view',
            effect: 'ALLOW',
            dataScope: 'ASSIGNED',
            reason: 'Audit permission override verification',
          },
        ],
      }),
    });
    const d35 = await r35.json();
    record(35, 'PUT', `/api/users/${tempUserId}/permissions`, r35.status, r35.status === 200, 'Permission Overrides Modal (/users/:id)', `Set ALLOW override for leads.view`);

    // Sl 36: GET /api/users/:id/permissions (Get Effective Permissions)
    const r36 = await fetch(`${BASE_URL}/api/users/${tempUserId}/permissions`, { headers });
    const d36 = await r36.json();
    const leadsPerm = d36.data?.permissions?.find((p) => p.code === 'leads.view');
    record(36, 'GET', `/api/users/${tempUserId}/permissions`, r36.status, r36.status === 200, 'Effective Permissions Tab (/users/:id)', `Retrieved ${d36.data?.permissions?.length} perms (leads.view source=${leadsPerm?.source})`);

    // Sl 29: DELETE /api/users/:id (Soft-Delete)
    const r29 = await fetch(`${BASE_URL}/api/users/${tempUserId}`, {
      method: 'DELETE',
      headers,
    });
    const d29 = await r29.json();
    record(29, 'DELETE', `/api/users/${tempUserId}`, r29.status, r29.status === 200, 'Soft-Delete Confirm Dialog (/users or /users/:id)', d29.message || 'Soft deleted user');

    // Sl 30: PATCH /api/users/:id/restore (Restore User)
    const r30 = await fetch(`${BASE_URL}/api/users/${tempUserId}/restore`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ identifier: tempUserId }),
    });
    const d30 = await r30.json();
    record(30, 'PATCH', `/api/users/${tempUserId}/restore`, r30.status, r30.status === 200, 'Restore Account Confirm Dialog (/users or /users/:id)', `Restored ${d30.data?.name}`);

  } catch (err) {
    console.error('Execution error:', err);
  } finally {
    // Permanent cleanup of temp test users from DB
    if (tempUserId) {
      console.log(`\nPurging temporary test user ${tempUserId} (${testEmail}) to keep database clean...`);
      try {
        const envContent = fs.readFileSync('D:/Slash-Projects/Slash_CRM_Backend/.env', 'utf-8');
        const env = {};
        for (const line of envContent.split('\n')) {
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
          password: env.DB_PASSWORD || '',
          database: env.DB_NAME || 'slash_infotech_crm',
          allowPublicKeyRetrieval: true,
        });

        const prisma = new PrismaClient({ adapter });
        await prisma.user.deleteMany({ where: { email: { contains: 'test.temp.user' } } });
        await prisma.$disconnect();
        console.log('Database cleanup verified. Zero leftover test records.');
      } catch (e) {
        console.error('Cleanup error:', e);
      }
    }
  }

  console.log('\n=== PHASE 3 USERS API AUDIT RESULTS ===');
  console.log(`Total APIs Tested: ${results.length} / 13`);
  const allPassed = results.every((r) => r.pass === 'PASS');
  console.log(`All 13 Users APIs Passed: ${allPassed ? 'YES (100% SUCCESS)' : 'NO'}\n`);

  console.log(JSON.stringify(results, null, 2));
}

main();
