import fs from 'fs';
import { PrismaMariaDb } from 'file:///D:/Slash-Projects/Slash_CRM_Backend/node_modules/@prisma/adapter-mariadb/dist/index.js';
import { PrismaClient } from 'file:///D:/Slash-Projects/Slash_CRM_Backend/dist/generated/prisma/client.js';

async function main() {
  const envContent = fs.readFileSync('D:/Slash-Projects/Slash_CRM_Backend/.env', 'utf-8');
  const env = {};
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const idx = trimmed.indexOf('=');
      env[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
    }
  }

  const adapter = new PrismaMariaDb({
    host: env.DB_HOST || '127.0.0.1',
    port: Number(env.DB_PORT || 3306),
    user: env.DB_USER || 'root',
    password: env.DB_PASSWORD || '',
    database: env.DB_NAME || 'slash_infotech_crm',
    allowPublicKeyRetrieval: true,
  });

  const prisma = new PrismaClient({ adapter });

  try {
    const delDept = await prisma.department.deleteMany({
      where: {
        code: 'TEST_OPS',
      },
    });
    console.log('Deleted TEST_OPS department:', delDept);

    const remainingDepts = await prisma.department.findMany();
    console.log('Remaining departments in database:', remainingDepts.map(d => `${d.code} (${d.name})`));
  } finally {
    await prisma.$disconnect();
  }
}

main();
