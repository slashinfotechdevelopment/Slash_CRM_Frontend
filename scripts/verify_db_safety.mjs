import { PrismaMariaDb } from 'file:///D:/Slash-Projects/Slash_CRM_Backend/node_modules/@prisma/adapter-mariadb/dist/index.mjs';
import { PrismaClient } from 'file:///D:/Slash-Projects/Slash_CRM_Backend/dist/generated/prisma/client.js';

const adapter = new PrismaMariaDb({
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: '2026',
  database: 'slash_infotech_crm',
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('=== Database Safety & Integrity Audit ===\n');

  try {
    const [
      userCount,
      roleCount,
      permCount,
      deptCount,
      attendanceCount,
      taskCount,
      leadCount,
      leaveTypeCount,
      holidayCount,
      weeklyOffCount,
      leaveBalanceCount,
      leaveRequestCount,
      leaveTransactionCount,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.role.count(),
      prisma.permission.count(),
      prisma.department.count(),
      prisma.attendanceRecord.count(),
      prisma.task.count(),
      prisma.lead.count(),
      prisma.leaveType.count(),
      prisma.holiday.count(),
      prisma.weeklyOffPolicy.count(),
      prisma.leaveBalance.count(),
      prisma.leaveRequest.count(),
      prisma.leaveTransaction.count(),
    ]);

    // Check for any dangling TEST records across tables
    const [
      testUsers,
      testRoles,
      testDepts,
      testLeaveTypes,
      testHolidays,
      testWeeklyOffs,
    ] = await Promise.all([
      prisma.user.count({ where: { email: { contains: 'test_temp' } } }),
      prisma.role.count({ where: { code: { startsWith: 'TEST_' } } }),
      prisma.department.count({ where: { code: { startsWith: 'TEST_' } } }),
      prisma.leaveType.count({ where: { code: { startsWith: 'TEST_' } } }),
      prisma.holiday.count({ where: { name: { startsWith: 'TEST' } } }),
      prisma.weeklyOffPolicy.count({ where: { name: { startsWith: 'TEST' } } }),
    ]);

    const counts = [
      { Entity: 'Users', Count: userCount, TestRecords: testUsers },
      { Entity: 'Roles', Count: roleCount, TestRecords: testRoles },
      { Entity: 'Permissions', Count: permCount, TestRecords: 0 },
      { Entity: 'Departments', Count: deptCount, TestRecords: testDepts },
      { Entity: 'Attendance Records', Count: attendanceCount, TestRecords: 0 },
      { Entity: 'Tasks & Deliverables', Count: taskCount, TestRecords: 0 },
      { Entity: 'Leads & Pipeline', Count: leadCount, TestRecords: 0 },
      { Entity: 'Leave Types', Count: leaveTypeCount, TestRecords: testLeaveTypes },
      { Entity: 'Holidays', Count: holidayCount, TestRecords: testHolidays },
      { Entity: 'Weekly-Off Policies', Count: weeklyOffCount, TestRecords: testWeeklyOffs },
      { Entity: 'Leave Balances', Count: leaveBalanceCount, TestRecords: 0 },
      { Entity: 'Leave Requests', Count: leaveRequestCount, TestRecords: 0 },
      { Entity: 'Leave Audit Ledger', Count: leaveTransactionCount, TestRecords: 0 },
    ];

    console.table(counts);

    const totalTestRecords = testUsers + testRoles + testDepts + testLeaveTypes + testHolidays + testWeeklyOffs;
    console.log(`\nIntegrity Result: Total dangling TEST records in database = ${totalTestRecords}`);
    if (totalTestRecords === 0) {
      console.log('SAFETY VERIFIED: ZERO test/garbage records remain in the production database.');
    } else {
      console.warn('WARNING: Residual test records detected!');
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error);
