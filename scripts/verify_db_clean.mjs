import fs from 'fs';
import { PrismaMariaDb } from 'file:///D:/Slash-Projects/Slash_CRM_Backend/node_modules/@prisma/adapter-mariadb/dist/index.js';
import { PrismaClient } from 'file:///D:/Slash-Projects/Slash_CRM_Backend/dist/generated/prisma/client.js';

async function check() {
  const adapter = new PrismaMariaDb({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '2026',
    database: 'slash_infotech_crm',
    allowPublicKeyRetrieval: true,
  });
  const prisma = new PrismaClient({ adapter });

  const testShifts = await prisma.shiftDefinition.count({ where: { code: { startsWith: 'TEST_SHIFT_' } } });
  const testOt = await prisma.attendanceOvertimeRequest.count({ where: { reason: { contains: 'Automated test' } } });
  const testWfh = await prisma.attendanceWfhRequest.count({ where: { reason: { contains: 'Automated test' } } });
  const testCor = await prisma.attendanceCorrectionRequest.count({ where: { reason: { contains: 'Automated test' } } });

  console.log(`Test records in DB: shifts=${testShifts}, overtime=${testOt}, wfh=${testWfh}, corrections=${testCor}`);
  await prisma.$disconnect();
  process.exit(0);
}

check().catch((e) => {
  console.error(e);
  process.exit(1);
});
