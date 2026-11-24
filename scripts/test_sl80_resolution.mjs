import { PrismaMariaDb } from 'file:///D:/Slash-Projects/Slash_CRM_Backend/node_modules/@prisma/adapter-mariadb/dist/index.mjs';
import { PrismaClient } from 'file:///D:/Slash-Projects/Slash_CRM_Backend/dist/generated/prisma/client.js';

const BASE_URL = 'http://127.0.0.1:5000';

async function main() {
  console.log('=== Verifying Sl 80: Resolve Anomaly (Live 200 Test) ===\n');

  const adapter = new PrismaMariaDb({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '2026',
    database: 'slash_infotech_crm'
  });
  const prisma = new PrismaClient({ adapter });

  // 1. Authenticate as Super Admin
  await fetch(`${BASE_URL}/api/auth/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'srihari8489@gmail.com', purpose: 'LOGIN' })
  });
  const vRes = await fetch(`${BASE_URL}/api/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'srihari8489@gmail.com', otp: '123456', purpose: 'LOGIN' })
  });
  const { data } = await vRes.json();
  const token = data.accessToken;

  // 2. Find a subordinate employee (not Super Admin, to satisfy Anti-Self-Resolution)
  const employee = await prisma.user.findFirst({
    where: { email: 'alaguraja3104@gmail.com' }
  });
  console.log(`Target Employee for Anomaly Test: ${employee.name} (${employee.id})`);

  // Get a template record from employee
  const template = await prisma.attendanceRecord.findFirst({ where: { userId: employee.id } });

  const testDate = new Date('2029-01-01T00:00:00.000Z');
  // Purge any lingering test record from prior attempt
  await prisma.attendanceRecord.deleteMany({
    where: { userId: employee.id, attendanceDate: testDate }
  }).catch(() => {});

  let testRecord = null;
  try {
    // 3. Create a TEST attendance record with an active integrity anomaly on a non-colliding date
    testRecord = await prisma.attendanceRecord.create({
      data: {
        userId: employee.id,
        shiftDefinitionId: template.shiftDefinitionId,
        attendanceDate: testDate,
        status: 'PENDING_RECONCILIATION',
        shiftStartTimeSnapshot: template.shiftStartTimeSnapshot,
        shiftEndTimeSnapshot: template.shiftEndTimeSnapshot,
        halfDayThresholdSecondsSnapshot: template.halfDayThresholdSecondsSnapshot,
        fullDayThresholdSecondsSnapshot: template.fullDayThresholdSecondsSnapshot,
        overtimeThresholdSecondsSnapshot: template.overtimeThresholdSecondsSnapshot,
        breakPolicySnapshot: template.breakPolicySnapshot,
        hasIntegrityAnomaly: true,
        anomalyType: 'OVERLAPPING_SESSIONS',
        anomalyDetails: 'TEST anomaly created for Sl 80 resolve verification'
      }
    });
    console.log(`Created TEST attendance record with anomaly: ${testRecord.id}`);

    // 4. Call Sl 79 (Get Anomaly Details)
    const getRes = await fetch(`${BASE_URL}/api/attendance/anomalies/${testRecord.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`Sl 79 (GET Anomaly Details) Status: ${getRes.status}`);

    // 5. Call Sl 80 (Resolve Anomaly)
    const resolveRes = await fetch(`${BASE_URL}/api/attendance/anomalies/${testRecord.id}/resolve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        action: 'RESOLVE',
        notes: 'Verified manual audit timesheet and reconciled successfully.',
        recalculate: false
      })
    });
    const resolveData = await resolveRes.json();
    console.log(`Sl 80 (POST Resolve Anomaly) Status: ${resolveRes.status}`);
    console.log('Response body:', JSON.stringify(resolveData, null, 2));

    if (resolveRes.status === 200) {
      console.log('\n>>> SUCCESS: Sl 80 (Resolve Anomaly) PASSED with HTTP 200 OK! <<<\n');
    } else {
      console.error('\n>>> FAILED: Sl 80 did not return 200 <<<');
    }
  } finally {
    // 6. Cleanup: strictly purge ONLY the test record
    if (testRecord) {
      console.log(`Cleaning up test record: ${testRecord.id}...`);
      await prisma.attendanceRecord.delete({ where: { id: testRecord.id } }).catch(() => {});
      console.log('Cleanup complete. Zero test records remain.');
    }
    await prisma.$disconnect();
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
