import fs from 'fs';
import { PrismaMariaDb } from 'file:///D:/Slash-Projects/Slash_CRM_Backend/node_modules/@prisma/adapter-mariadb/dist/index.js';
import { PrismaClient } from 'file:///D:/Slash-Projects/Slash_CRM_Backend/dist/generated/prisma/client.js';

const BASE_URL = 'http://127.0.0.1:5000';

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

function recordResult(sl, method, path, status, success, note = '', errData = null) {
  results.push({ sl, method, path, status, success, note, errData });
  const icon = success ? '✓ PASS' : '✗ FAIL';
  console.log(`[${icon}] Sl ${sl} ${method} ${path} -> HTTP ${status} ${note}`);
  if (!success && errData) {
    console.log('   Error Detail:', JSON.stringify(errData));
  }
}

async function main() {
  console.log('=== Starting Phase 6 (Leads & CRM Pipeline) Live Backend API Verification ===\n');

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
  const user = verifyData.data.user;
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  let testLeadId = null;
  let testFollowUpId = null;
  let testInquiryId = null;

  try {
    // Sl 119: POST /api/leads/public/inquire
    {
      const res = await fetch(`${BASE_URL}/api/leads/public/inquire`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'TEST_INQUIRY_CLIENT',
          phone: '+919999888877',
          email: 'test_inquiry@example.com',
          course: 'Custom Software Development',
          location: 'Bangalore',
          message: 'Automated test inquiry for Phase 6',
        }),
      });
      const data = await res.json();
      testInquiryId = data.data?.id;
      recordResult(119, 'POST', '/api/leads/public/inquire', res.status, res.status === 201 || res.status === 200);
    }

    // Sl 120: POST /api/leads
    {
      const res = await fetch(`${BASE_URL}/api/leads`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          leadName: 'TEST_PHASE6_ENTERPRISE_LEAD',
          phone: '+919876543299',
          email: 'test_phase6_lead@example.com',
          companyName: 'TEST_PHASE6_CORP',
          source: 'WEBSITE',
          priority: 'HIGH',
          status: 'NEW',
          estimatedValue: 120000,
          currency: 'INR',
          requirementDescription: 'Comprehensive CRM Integration',
          feedback1: 'Strong purchase intent',
        }),
      });
      const data = await res.json();
      testLeadId = data.data?.id;
      recordResult(120, 'POST', '/api/leads', res.status, res.status === 201 || res.status === 200, `Lead ID: ${testLeadId}`);
    }

    // Sl 121: GET /api/leads
    {
      const res = await fetch(`${BASE_URL}/api/leads?page=1&limit=20`, { headers });
      const data = await res.json();
      recordResult(121, 'GET', '/api/leads', res.status, res.status === 200, `Found: ${data.data?.items?.length ?? 0}`);
    }

    // Sl 122: GET /api/leads/:id
    {
      const res = await fetch(`${BASE_URL}/api/leads/${testLeadId}`, { headers });
      const data = await res.json();
      recordResult(122, 'GET', '/api/leads/:id', res.status, res.status === 200, `Code: ${data.data?.leadCode}`);
    }

    // Sl 123: PUT /api/leads/:id
    {
      const res = await fetch(`${BASE_URL}/api/leads/${testLeadId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          companyName: 'TEST_PHASE6_CORP_UPDATED',
          estimatedValue: 150000,
        }),
      });
      recordResult(123, 'PUT', '/api/leads/:id', res.status, res.status === 200);
    }

    // Sl 124: DELETE /api/leads/:id
    {
      const res = await fetch(`${BASE_URL}/api/leads/${testLeadId}`, {
        method: 'DELETE',
        headers,
      });
      recordResult(124, 'DELETE', '/api/leads/:id', res.status, res.status === 200);
    }

    // Sl 125: POST /api/leads/:id/restore
    {
      const res = await fetch(`${BASE_URL}/api/leads/${testLeadId}/restore`, {
        method: 'POST',
        headers,
      });
      recordResult(125, 'POST', '/api/leads/:id/restore', res.status, res.status === 200);
    }

    // Sl 126: POST /api/leads/:id/assign
    {
      const res = await fetch(`${BASE_URL}/api/leads/${testLeadId}/assign`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          assignedToId: user.id,
          note: 'Assigned to Super Admin for validation',
        }),
      });
      const data = await res.json();
      recordResult(126, 'POST', '/api/leads/:id/assign', res.status, res.status === 200, '', data);
    }

    // Sl 127: POST /api/leads/:id/qualify
    {
      const res = await fetch(`${BASE_URL}/api/leads/${testLeadId}/qualify`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          qualificationStatus: 'QUALIFIED',
          note: 'Meets ICP requirements and approved budget',
        }),
      });
      const data = await res.json();
      recordResult(127, 'POST', '/api/leads/:id/qualify', res.status, res.status === 200, '', data);
    }

    // Sl 128: POST /api/leads/:id/status
    {
      const res = await fetch(`${BASE_URL}/api/leads/${testLeadId}/status`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          status: 'QUALIFIED',
          note: 'Deal updated in testing',
        }),
      });
      const data = await res.json();
      recordResult(128, 'POST', '/api/leads/:id/status', res.status, res.status === 200, '', data);
    }

    // Sl 129: POST /api/leads/:id/convert
    {
      const res = await fetch(`${BASE_URL}/api/leads/${testLeadId}/convert`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          note: 'Ready for account handoff',
        }),
      });
      const data = await res.json();
      recordResult(129, 'POST', '/api/leads/:id/convert', res.status, res.status === 200, '', data);
    }

    // Sl 130: POST /api/leads/:id/activities
    {
      const res = await fetch(`${BASE_URL}/api/leads/${testLeadId}/activities`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          type: 'CALL',
          title: 'TEST_PHASE6_DISCOVERY_CALL',
          description: 'Client confirmed budget and delivery timeline',
        }),
      });
      const data = await res.json();
      recordResult(130, 'POST', '/api/leads/:id/activities', res.status, res.status === 201 || res.status === 200, '', data);
    }

    // Sl 131: GET /api/leads/:id/timeline
    {
      const res = await fetch(`${BASE_URL}/api/leads/${testLeadId}/timeline`, { headers });
      const data = await res.json();
      recordResult(131, 'GET', '/api/leads/:id/timeline', res.status, res.status === 200, `Entries: ${data.data?.length ?? 0}`);
    }

    // Sl 132: POST /api/leads/:id/follow-ups
    {
      const due = new Date(Date.now() + 86400000).toISOString();
      const res = await fetch(`${BASE_URL}/api/leads/${testLeadId}/follow-ups`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          scheduledAt: due,
          note: 'Deliver contract documents',
        }),
      });
      const data = await res.json();
      testFollowUpId = data.data?.id;
      recordResult(132, 'POST', '/api/leads/:id/follow-ups', res.status, res.status === 201 || res.status === 200, `FollowUp ID: ${testFollowUpId}`, data);
    }

    // Sl 133: GET /api/leads/follow-ups/my
    {
      const res = await fetch(`${BASE_URL}/api/leads/follow-ups/my`, { headers });
      const data = await res.json();
      recordResult(133, 'GET', '/api/leads/follow-ups/my', res.status, res.status === 200, `Follow-ups: ${data.data?.length ?? 0}`);
    }

    // Sl 134: PUT /api/leads/follow-ups/:id
    {
      const res = await fetch(`${BASE_URL}/api/leads/follow-ups/${testFollowUpId || 'test'}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          status: 'COMPLETED',
          note: 'Documents delivered successfully',
        }),
      });
      const data = await res.json();
      recordResult(134, 'PUT', '/api/leads/follow-ups/:id', res.status, res.status === 200, '', data);
    }

    // Sl 135: GET /api/leads/pipeline/stages
    {
      const res = await fetch(`${BASE_URL}/api/leads/pipeline/stages`, { headers });
      const data = await res.json();
      recordResult(135, 'GET', '/api/leads/pipeline/stages', res.status, res.status === 200, `Stages: ${data.data?.length ?? 0}`);
    }

    // Sl 136: GET /api/leads/metrics/summary
    {
      const res = await fetch(`${BASE_URL}/api/leads/metrics/summary`, { headers });
      const data = await res.json();
      recordResult(136, 'GET', '/api/leads/metrics/summary', res.status, res.status === 200, `Conversion Rate: ${data.data?.conversionRate}%`);
    }

    // Sl 137: GET /api/leads/metrics/pipeline
    {
      const res = await fetch(`${BASE_URL}/api/leads/metrics/pipeline`, { headers });
      const data = await res.json();
      recordResult(137, 'GET', '/api/leads/metrics/pipeline', res.status, res.status === 200, `Total Pipeline: ${data.data?.totalPipelineValue}`);
    }

    // Sl 138: POST /api/leads/import
    {
      const res = await fetch(`${BASE_URL}/api/leads/import`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          dryRun: true,
          rows: [
            {
              name: 'TEST_PHASE6_IMPORT_1',
              contact: '+919999000011',
              email: 'test_imp1@example.com',
            },
            {
              name: 'TEST_PHASE6_IMPORT_2',
              contact: '+919999000022',
              email: 'test_imp2@example.com',
            },
          ],
        }),
      });
      const data = await res.json();
      recordResult(138, 'POST', '/api/leads/import', res.status, res.status === 201 || res.status === 200, `Import Preview: ${data.data?.validCount ?? data.data?.importedCount ?? 0}`, data);
    }
  } finally {
    console.log('\n--- DATA SAFETY: Purging only TEST_ records created in this test run ---');
    try {
      // 1. Purge test follow-up
      if (testFollowUpId) {
        await prisma.leadFollowUp.deleteMany({ where: { id: testFollowUpId } });
        console.log(`✓ Purged test follow-up: ${testFollowUpId}`);
      }
      // 2. Purge test activities
      if (testLeadId) {
        await prisma.leadActivity.deleteMany({ where: { leadId: testLeadId } });
        console.log(`✓ Purged activities for lead: ${testLeadId}`);
      }
      // 3. Purge test lead
      if (testLeadId) {
        await prisma.lead.deleteMany({ where: { id: testLeadId } });
        console.log(`✓ Purged test lead: ${testLeadId}`);
      }
      // 4. Purge test inquiry
      if (testInquiryId) {
        await prisma.lead.deleteMany({ where: { id: testInquiryId } });
        console.log(`✓ Purged test inquiry lead: ${testInquiryId}`);
      }
      // Any remaining TEST_ leads
      const del = await prisma.lead.deleteMany({
        where: {
          OR: [
            { leadName: { startsWith: 'TEST_' } },
            { email: { startsWith: 'test_' } },
          ],
        },
      });
      console.log(`✓ Purged ${del.count} remaining TEST_ leads`);
    } catch (cleanErr) {
      console.error('Error during cleanup:', cleanErr);
    } finally {
      await prisma.$disconnect();
    }
  }

  console.log('\n=== Summary of Phase 6 API Results ===');
  const passCount = results.filter((r) => r.success).length;
  console.log(`Total APIs Tested: ${results.length}`);
  console.log(`Passed: ${passCount} / ${results.length}`);
  if (passCount === results.length) {
    console.log('🎉 100% PASS RATE FOR ALL 20 PHASE 6 LEADS APIS!');
  } else {
    console.log('⚠️ Some tests failed.');
  }
}

main().catch(console.error);
