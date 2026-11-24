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
  const users = await prisma.userDepartment.count({ where: { departmentId: 'cmwncmemx001pnouzfnbco80k' } });
  console.log('Assigned users to TESTING dept:', users);
  if (users === 0) {
    await prisma.department.delete({ where: { id: 'cmwncmemx001pnouzfnbco80k' } });
    console.log('Cleaned up residual test department TESTING');
  }
  await prisma.$disconnect();
}
check();
