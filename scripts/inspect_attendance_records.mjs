import { PrismaMariaDb } from 'file:///D:/Slash-Projects/Slash_CRM_Backend/node_modules/@prisma/adapter-mariadb/dist/index.mjs';
import { PrismaClient } from 'file:///D:/Slash-Projects/Slash_CRM_Backend/dist/generated/prisma/client.js';

async function main() {
  const adapter = new PrismaMariaDb({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '',
    database: 'slash_infotech_crm'
  });
  const prisma = new PrismaClient({ adapter });

  const total = await prisma.attendanceRecord.count();
  console.log('Total attendance records in DB:', total);

  const userRecords = await prisma.attendanceRecord.findMany({
    take: 10,
    orderBy: { attendanceDate: 'desc' },
    select: {
      id: true,
      attendanceDate: true,
      status: true,
      userId: true,
      systemNotes: true
    }
  });
  console.log('Sample recent records:', userRecords);

  const futureCount = await prisma.attendanceRecord.count({
    where: { attendanceDate: { gt: new Date('2026-11-19T23:59:59.999Z') } }
  });
  console.log('Records with future dates (> today):', futureCount);

  const userTotal = await prisma.attendanceRecord.count({
    where: { userId: 'cmw0kg0jy00015ouzplsxesaz' }
  });
  console.log('Total for user cmw0kg0jy00015ouzplsxesaz:', userTotal);

  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
