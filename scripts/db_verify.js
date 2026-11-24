// db_verify.js
const BASE_URL = 'http://localhost:5000';

async function verify() {
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

  // Check roles
  const rolesRes = await fetch(`${BASE_URL}/api/roles?includeDeleted=true&limit=100`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const roles = await rolesRes.json();
  const tempRoles = (roles.data?.items || []).filter((r) => r.code?.includes('TEMP_'));
  console.log('Temporary roles remaining in DB:', tempRoles.length);

  // Check departments
  const deptsRes = await fetch(`${BASE_URL}/api/departments?limit=100`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const depts = await deptsRes.json();
  const deptItems = depts.data?.data || depts.data?.items || depts.data || [];
  const tempDepts = deptItems.filter((d) => d.code?.includes('TEMP_'));
  console.log('Temporary depts remaining in DB:', tempDepts.length);

  // Check permissions
  const permsRes = await fetch(`${BASE_URL}/api/permissions?limit=100`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const perms = await permsRes.json();
  const tempPerms = (perms.data?.items || []).filter((p) => p.code?.includes('temp_'));
  console.log('Temporary permissions remaining in DB:', tempPerms.length);
}

verify();
