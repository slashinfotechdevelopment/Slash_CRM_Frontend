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

async function check() {
  const types = await prisma.leaveType.findMany({
    include: {
      policies: true
    }
  });
  console.log('LEAVE TYPES IN DB:');
  for (const t of types) {
    console.log(`- ${t.name} (code: ${t.code}, isActive: ${t.isActive}, policies: ${t.policies.length})`);
    if (t.policies.length > 0) {
      console.log('  Active policy:', t.policies[0].effectiveFrom, 'to', t.policies[0].effectiveTo);
    }
  }
  await prisma.$disconnect();
}
check();
