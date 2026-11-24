import { PrismaMariaDb } from 'file:///D:/Slash-Projects/Slash_CRM_Backend/node_modules/@prisma/adapter-mariadb/dist/index.js';
import { PrismaClient } from 'file:///D:/Slash-Projects/Slash_CRM_Backend/dist/generated/prisma/client.js';

async function main() {
  const adapter = new PrismaMariaDb({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '2026',
    database: 'slash_infotech_crm',
    allowPublicKeyRetrieval: true,
  });
  const prisma = new PrismaClient({ adapter });

  console.log('--- DATABASE RECORD COUNTS ---');
  const shiftsCount = await prisma.shiftDefinition.count();
  const shifts = await prisma.shiftDefinition.findMany({ take: 5 });
  const shiftAssignments = await prisma.employeeShiftAssignment.count();
  const attendanceRecords = await prisma.attendanceRecord.count();
  const timeEntries = await prisma.taskTimeEntry.count();
  const tasks = await prisma.task.count();
  const overtimeRequests = await prisma.attendanceOvertimeRequest.count();
  const wfhRequests = await prisma.attendanceWfhRequest.count();
  const corrections = await prisma.attendanceCorrectionRequest.count();

  console.log({
    shiftsCount,
    shifts: shifts.map(s => ({ id: s.id, name: s.name, code: s.code })),
    shiftAssignments,
    attendanceRecords,
    timeEntries,
    tasks,
    overtimeRequests,
    wfhRequests,
    corrections,
  });

  // Now let's call the APIs as Super Admin and see what they return!
  console.log('\n--- API RESPONSES ---');
  await fetch('http://127.0.0.1:5000/api/auth/send-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'srihari8489@gmail.com', purpose: 'LOGIN' })
  });
  const loginRes = await fetch('http://127.0.0.1:5000/api/auth/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'srihari8489@gmail.com', otp: '123456', purpose: 'LOGIN' })
  });
  const loginData = await loginRes.json();
  const token = loginData.data.accessToken;
  const headers = { Authorization: 'Bearer ' + token };

  // 1. Shifts
  const shiftsApiRes = await fetch('http://127.0.0.1:5000/api/attendance/shifts', { headers });
  console.log('/api/attendance/shifts status:', shiftsApiRes.status);
  const shiftsApiData = await shiftsApiRes.json();
  console.log('/api/attendance/shifts data:', JSON.stringify(shiftsApiData).slice(0, 300));

  // 2. Team attendance
  const teamAttRes = await fetch('http://127.0.0.1:5000/api/attendance/history?page=1&limit=20', { headers });
  console.log('/api/attendance/history status:', teamAttRes.status);
  const teamAttData = await teamAttRes.json();
  console.log('/api/attendance/history data:', JSON.stringify(teamAttData).slice(0, 300));

  // 3. Organization dashboard
  const orgDashRes = await fetch('http://127.0.0.1:5000/api/tasks/dashboard/organization', { headers });
  console.log('/api/tasks/dashboard/organization status:', orgDashRes.status);
  const orgDashData = await orgDashRes.json();
  console.log('/api/tasks/dashboard/organization data:', JSON.stringify(orgDashData, null, 2));

  // 4. Reports - working-hours
  const repWorkRes = await fetch('http://127.0.0.1:5000/api/tasks/reports/working-hours', { headers });
  console.log('/api/tasks/reports/working-hours status:', repWorkRes.status);
  const repWorkData = await repWorkRes.json();
  console.log('/api/tasks/reports/working-hours data:', JSON.stringify(repWorkData, null, 2));

  // 5. Reports - employee-performance
  const repPerfRes = await fetch('http://127.0.0.1:5000/api/tasks/reports/employee-performance', { headers });
  console.log('/api/tasks/reports/employee-performance status:', repPerfRes.status);
  const repPerfData = await repPerfRes.json();
  console.log('/api/tasks/reports/employee-performance data:', JSON.stringify(repPerfData, null, 2));

  await prisma.$disconnect();
}

main().catch(console.error);
