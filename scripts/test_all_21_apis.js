const BASE_URL = 'http://localhost:5000';

async function main() {
  console.log('=== Starting Phase 2 Live Backend 21-API Verification ===\n');

  // 1. Authenticate as Super Admin
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

  let tempRoleId = null;
  let tempPermissionId = null;
  let tempDeptId = null;
  let samplePermId = null;

  try {
    // -------------------------------------------------------------
    // ROLES APIS (Sl 8-16, Sl 23)
    // -------------------------------------------------------------

    // Sl 9: GET /api/roles
    const r9 = await fetch(`${BASE_URL}/api/roles?limit=10`, { headers });
    const d9 = await r9.json();
    record(9, 'GET', '/api/roles', r9.status, r9.status === 200, 'Roles List (/roles)', `Found ${d9.data?.items?.length} roles`);

    // Sl 8: POST /api/roles
    const r8 = await fetch(`${BASE_URL}/api/roles`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        code: 'TEMP_VERIFY_ROLE',
        name: 'Temporary Verification Role',
        description: 'Created for automated API proof verification',
      }),
    });
    const d8 = await r8.json();
    tempRoleId = d8.data?.id;
    record(8, 'POST', '/api/roles', r8.status, r8.status === 201, 'Roles List Modal (/roles)', `Created role id=${tempRoleId}`);

    // Sl 10: GET /api/roles/:id
    const r10 = await fetch(`${BASE_URL}/api/roles/${tempRoleId}`, { headers });
    const d10 = await r10.json();
    record(10, 'GET', `/api/roles/${tempRoleId}`, r10.status, r10.status === 200, 'Role Detail (/roles/:id)', `Retrieved ${d10.data?.name}`);

    // Sl 11: PATCH /api/roles/:id
    const r11 = await fetch(`${BASE_URL}/api/roles/${tempRoleId}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({
        name: 'Updated Verification Role',
        description: 'Updated description for automated verification',
        status: 'ACTIVE',
      }),
    });
    const d11 = await r11.json();
    record(11, 'PATCH', `/api/roles/${tempRoleId}`, r11.status, r11.status === 200, 'Role Edit Modal (/roles)', `Updated name=${d11.data?.name}`);

    // Fetch an existing permission ID to assign
    const permQuery = await fetch(`${BASE_URL}/api/permissions?limit=5`, { headers });
    const permData = await permQuery.json();
    samplePermId = permData.data?.items?.[0]?.id;

    // Sl 15: POST /api/roles/:id/permissions
    const r15 = await fetch(`${BASE_URL}/api/roles/${tempRoleId}/permissions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        permissionId: samplePermId,
        dataScope: 'ALL',
      }),
    });
    const d15 = await r15.json();
    record(15, 'POST', `/api/roles/${tempRoleId}/permissions`, r15.status, r15.status === 200 || r15.status === 201, 'Role Detail Add Perm Modal (/roles/:id)', `Assigned perm=${samplePermId}`);

    // Sl 13: GET /api/roles/:id/permissions
    const r13 = await fetch(`${BASE_URL}/api/roles/${tempRoleId}/permissions`, { headers });
    const d13 = await r13.json();
    record(13, 'GET', `/api/roles/${tempRoleId}/permissions`, r13.status, r13.status === 200, 'Role Detail (/roles/:id)', `Perm count=${d13.data?.length}`);

    // Sl 16: DELETE /api/roles/:id/permissions/:permissionId
    const r16 = await fetch(`${BASE_URL}/api/roles/${tempRoleId}/permissions/${samplePermId}`, {
      method: 'DELETE',
      headers,
    });
    const d16 = await r16.json();
    record(16, 'DELETE', `/api/roles/${tempRoleId}/permissions/${samplePermId}`, r16.status, r16.status === 200, 'Role Detail Action (/roles/:id)', d16.message || 'Removed perm');

    // Sl 14: PUT /api/roles/:id/permissions
    const r14 = await fetch(`${BASE_URL}/api/roles/${tempRoleId}/permissions`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        permissions: [{ permissionId: samplePermId, dataScope: 'DEPARTMENT' }],
      }),
    });
    const d14 = await r14.json();
    record(14, 'PUT', `/api/roles/${tempRoleId}/permissions`, r14.status, r14.status === 200, 'Configure All Perms Modal (/roles/:id)', `Replaced perms count=${d14.data?.length}`);

    // Sl 12: DELETE /api/roles/:id
    const r12 = await fetch(`${BASE_URL}/api/roles/${tempRoleId}`, {
      method: 'DELETE',
      headers,
    });
    const d12 = await r12.json();
    record(12, 'DELETE', `/api/roles/${tempRoleId}`, r12.status, r12.status === 200, 'Roles List Delete Confirm (/roles)', d12.message || 'Soft deleted');

    // Sl 23: PATCH /api/roles/:id/restore
    const r23 = await fetch(`${BASE_URL}/api/roles/${tempRoleId}/restore`, {
      method: 'PATCH',
      headers,
    });
    const d23 = await r23.json();
    record(23, 'PATCH', `/api/roles/${tempRoleId}/restore`, r23.status, r23.status === 200, 'Roles List Restore Action (/roles)', d23.message || 'Restored role');

    // -------------------------------------------------------------
    // PERMISSIONS APIS (Sl 17-22)
    // -------------------------------------------------------------

    // Sl 18: GET /api/permissions
    const r18 = await fetch(`${BASE_URL}/api/permissions?limit=10`, { headers });
    const d18 = await r18.json();
    record(18, 'GET', '/api/permissions', r18.status, r18.status === 200, 'Permissions List (/permissions)', `Found ${d18.data?.items?.length} perms`);

    // Sl 19: GET /api/permissions/modules
    const r19 = await fetch(`${BASE_URL}/api/permissions/modules`, { headers });
    const d19 = await r19.json();
    record(19, 'GET', '/api/permissions/modules', r19.status, r19.status === 200, 'Permissions List & Role Detail Grouping', `Retrieved ${Object.keys(d19.data || {}).length} modules`);

    // Sl 17: POST /api/permissions
    const r17 = await fetch(`${BASE_URL}/api/permissions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        code: 'temp_verify.test_action',
        name: 'Temporary Verification Permission',
        module: 'temp_verify',
        action: 'test_action',
        description: 'Permission created for automated test audit',
      }),
    });
    const d17 = await r17.json();
    tempPermissionId = d17.data?.id;
    record(17, 'POST', '/api/permissions', r17.status, r17.status === 201, 'Permissions Create Modal (/permissions)', `Created perm id=${tempPermissionId}`);

    // Sl 20: GET /api/permissions/:id
    const r20 = await fetch(`${BASE_URL}/api/permissions/${tempPermissionId}`, { headers });
    const d20 = await r20.json();
    record(20, 'GET', `/api/permissions/${tempPermissionId}`, r20.status, r20.status === 200, 'Permission Detail Modal (/permissions)', `Retrieved ${d20.data?.name}`);

    // Sl 21: PATCH /api/permissions/:id
    const r21 = await fetch(`${BASE_URL}/api/permissions/${tempPermissionId}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({
        name: 'Updated Verification Permission Name',
        description: 'Updated permission description',
        status: 'ACTIVE',
      }),
    });
    const d21 = await r21.json();
    record(21, 'PATCH', `/api/permissions/${tempPermissionId}`, r21.status, r21.status === 200, 'Permission Edit Modal (/permissions)', `Updated name=${d21.data?.name}`);

    // Sl 22: DELETE /api/permissions/:id
    const r22 = await fetch(`${BASE_URL}/api/permissions/${tempPermissionId}`, {
      method: 'DELETE',
      headers,
    });
    const d22 = await r22.json();
    record(22, 'DELETE', `/api/permissions/${tempPermissionId}`, r22.status, r22.status === 200, 'Permissions Delete Confirm (/permissions)', d22.message || 'Deleted perm');
    tempPermissionId = null; // Cleaned up

    // -------------------------------------------------------------
    // DEPARTMENTS APIS (Sl 171-175)
    // -------------------------------------------------------------

    // Sl 171: GET /api/departments
    const r171 = await fetch(`${BASE_URL}/api/departments`, { headers });
    const d171 = await r171.json();
    const deptCount = d171.data?.data?.length || d171.data?.length || 0;
    record(171, 'GET', '/api/departments', r171.status, r171.status === 200, 'Departments List (/departments)', `Found ${deptCount} departments`);

    // Sl 172: POST /api/departments
    const r172 = await fetch(`${BASE_URL}/api/departments`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        code: 'TEMP_VERIFY_DEPT',
        name: 'Temporary Verification Dept',
        description: 'Created for automated API audit',
      }),
    });
    const d172 = await r172.json();
    tempDeptId = d172.data?.id;
    record(172, 'POST', '/api/departments', r172.status, r172.status === 201, 'Departments Create Modal (/departments)', `Created dept id=${tempDeptId}`);

    // Sl 173: GET /api/departments/:id
    const r173 = await fetch(`${BASE_URL}/api/departments/${tempDeptId}`, { headers });
    const d173 = await r173.json();
    record(173, 'GET', `/api/departments/${tempDeptId}`, r173.status, r173.status === 200, 'Department Detail View Modal (/departments)', `Retrieved ${d173.data?.name}`);

    // Sl 174: PATCH /api/departments/:id
    const r174 = await fetch(`${BASE_URL}/api/departments/${tempDeptId}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({
        name: 'Updated Verification Dept',
        description: 'Updated dept description',
        status: 'INACTIVE',
      }),
    });
    const d174 = await r174.json();
    record(174, 'PATCH', `/api/departments/${tempDeptId}`, r174.status, r174.status === 200, 'Department Edit Modal (/departments)', `Updated name=${d174.data?.name}, status=${d174.data?.status}`);

    // Sl 175: DELETE /api/departments/:id
    const r175 = await fetch(`${BASE_URL}/api/departments/${tempDeptId}`, {
      method: 'DELETE',
      headers,
    });
    const d175 = await r175.json();
    record(175, 'DELETE', `/api/departments/${tempDeptId}`, r175.status, r175.status === 200, 'Departments Deactivate Confirm (/departments)', d175.message || 'Deactivated dept');
    tempDeptId = null; // Cleaned up

  } catch (err) {
    console.error('Error during execution:', err);
  } finally {
    // Permanent cleanup of tempRoleId if still present
    if (tempRoleId) {
      try {
        console.log(`Cleaning up temp role ${tempRoleId}...`);
        await fetch(`${BASE_URL}/api/roles/${tempRoleId}`, { method: 'DELETE', headers });
      } catch (e) {}
    }
  }

  console.log('\n=== AUDIT RESULTS SUMMARY ===');
  console.log(`Total APIs Tested: ${results.length} / 21`);
  const allPassed = results.every((r) => r.pass === 'PASS');
  console.log(`All 21 APIs Passed: ${allPassed ? 'YES (100% SUCCESS)' : 'NO'}\n`);

  console.log(JSON.stringify(results, null, 2));
}

main();
