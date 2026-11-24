import { PrismaMariaDb } from 'file:///D:/Slash-Projects/Slash_CRM_Backend/node_modules/@prisma/adapter-mariadb/dist/index.js';
import { PrismaClient } from 'file:///D:/Slash-Projects/Slash_CRM_Backend/dist/generated/prisma/client.js';

const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'slash_crm',
});
const prisma = new PrismaClient({ adapter });

async function check() {
  const ot = await prisma.attendanceOvertimeRequest.findMany({ select: { id: true, reason: true, status: true, attendanceDate: true } });
  const wfh = await prisma.attendanceWfhRequest.findMany({ select: { id: true, reason: true, status: true, startDate: true } });
  const cor = await prisma.attendanceCorrectionRequest.findMany({ select: { id: true, reason: true, status: true, attendanceDate: true } });
  console.log('OT count:', ot.length, JSON.stringify(ot, null, 2));
  console.log('WFH count:', wfh.length, JSON.stringify(wfh, null, 2));
  console.log('Correction count:', cor.length, JSON.stringify(cor, null, 2));
  await prisma.$disconnect();
}

check();
