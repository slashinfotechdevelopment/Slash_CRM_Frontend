import fs from 'fs';
import { PrismaMariaDb } from 'file:///D:/Slash-Projects/Slash_CRM_Backend/node_modules/@prisma/adapter-mariadb/dist/index.js';
import { PrismaClient } from 'file:///D:/Slash-Projects/Slash_CRM_Backend/dist/generated/prisma/client.js';

async function purge() {
  const envContent = fs.readFileSync('D:/Slash-Projects/Slash_CRM_Backend/.env', 'utf-8');
  const env = {};
  for (const line of envContent.split('\n')) {
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
    password: env.DB_PASSWORD || '',
    database: env.DB_NAME || 'slash_infotech_crm',
    allowPublicKeyRetrieval: true,
  });

  const prisma = new PrismaClient({ adapter });

  try {
    const res = await prisma.user.deleteMany({
      where: {
        email: { contains: 'test.temp.user' },
      },
    });
    console.log('Permanently purged test users count:', res.count);
  } catch (err) {
    console.error('Purge error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

purge();
