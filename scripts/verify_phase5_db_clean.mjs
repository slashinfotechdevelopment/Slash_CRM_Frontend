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

  const totalTasks = await prisma.task.count();
  const testTasks = await prisma.task.count({ where: { title: { startsWith: 'TEST_' } } });
  const testTags = await prisma.taskTag.count({ where: { name: { startsWith: 'test_' } } });
  const totalTags = await prisma.taskTag.count();

  console.log(JSON.stringify({ totalTasks, testTasks, testTags, totalTags }, null, 2));
  await prisma.$disconnect();
  process.exit(0);
}

check().catch((e) => {
  console.error(e);
  process.exit(1);
});
