import fs from 'fs';
import { PrismaMariaDb } from 'file:///D:/Slash-Projects/Slash_CRM_Backend/node_modules/@prisma/adapter-mariadb/dist/index.js';
import { PrismaClient } from 'file:///D:/Slash-Projects/Slash_CRM_Backend/dist/generated/prisma/client.js';

async function purge() {
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

  console.log('Connecting to database...');

  // 1. Shift assignments
  const sa = await prisma.employeeShiftAssignment.deleteMany({
    where: { shiftDefinition: { code: { startsWith: 'TEST_SHIFT_' } } },
  });
  console.log('Deleted employeeShiftAssignments:', sa.count);

  // 2. Shift definitions
  const sd = await prisma.shiftDefinition.deleteMany({
    where: { code: { startsWith: 'TEST_SHIFT_' } },
  });
  console.log('Deleted shiftDefinitions:', sd.count);

  // 3. Overtime requests
  const ot = await prisma.attendanceOvertimeRequest.deleteMany({
    where: { reason: { contains: 'Automated test overtime' } },
  });
  console.log('Deleted overtime requests:', ot.count);

  // 4. WFH requests
  const wfh = await prisma.attendanceWfhRequest.deleteMany({
    where: { reason: { contains: 'Automated test WFH' } },
  });
  console.log('Deleted WFH requests:', wfh.count);

  // 5. Corrections & Evidence
  const ev = await prisma.attendanceEvidenceVerification.deleteMany({
    where: { correctionRequest: { reason: { contains: 'Automated test correction' } } },
  });
  console.log('Deleted evidence verifications:', ev.count);

  const cor = await prisma.attendanceCorrectionRequest.deleteMany({
    where: { reason: { contains: 'Automated test correction' } },
  });
  console.log('Deleted correction requests:', cor.count);

  // 6. Delete sessions on test dates
  const sDel = await prisma.attendanceSession.deleteMany({
    where: {
      attendanceRecord: {
        attendanceDate: {
          in: [new Date('2026-11-17'), new Date('2026-11-18'), new Date('2026-11-19'), new Date('2026-11-20')],
        },
      },
    },
  });
  console.log('Deleted attendanceSessions on test dates:', sDel.count);

  // 7. Anomalies & Reconciliation runs
  const anom = await prisma.attendanceAnomaly.deleteMany({
    where: { reconciliationRun: { targetDate: new Date('2026-11-16') } },
  });
  console.log('Deleted anomalies:', anom.count);

  const recon = await prisma.attendanceReconciliationRun.deleteMany({
    where: { targetDate: new Date('2026-11-16') },
  });
  console.log('Deleted reconciliation runs:', recon.count);

  // 8. Delete breaks for Super Admin today
  const admin = await prisma.user.findUnique({ where: { email: 'srihari8489@gmail.com' } });
  if (admin) {
    const todayRec = await prisma.attendanceRecord.findFirst({
      where: { userId: admin.id, attendanceDate: new Date('2026-11-19') },
    });
    if (todayRec) {
      const bks = await prisma.attendanceBreak.deleteMany({
        where: { attendanceRecordId: todayRec.id },
      });
      console.log('Deleted today breaks for admin:', bks.count);
    }
  }

  await prisma.$disconnect();
  console.log('Purge completed successfully!');
}

purge().catch(console.error);
