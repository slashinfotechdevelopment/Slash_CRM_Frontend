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
    const [userTotal, userActive, userInactive, userDeleted] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { status: 'ACTIVE', deletedAt: null } }),
      prisma.user.count({ where: { status: 'INACTIVE', deletedAt: null } }),
      prisma.user.count({ where: { deletedAt: { not: null } } }),
    ]);

    const [roleTotal, roleActive, roleInactive, roleDeleted] = await Promise.all([
      prisma.role.count(),
      prisma.role.count({ where: { status: 'ACTIVE', deletedAt: null } }),
      prisma.role.count({ where: { status: 'INACTIVE', deletedAt: null } }),
      prisma.role.count({ where: { deletedAt: { not: null } } }),
    ]);

    const [permTotal, permActive, permInactive] = await Promise.all([
      prisma.permission.count(),
      prisma.permission.count({ where: { status: 'ACTIVE' } }),
      prisma.permission.count({ where: { status: 'INACTIVE' } }),
    ]);

    const [deptTotal, deptActive, deptInactive] = await Promise.all([
      prisma.department.count(),
      prisma.department.count({ where: { status: 'ACTIVE' } }),
      prisma.department.count({ where: { status: 'INACTIVE' } }),
    ]);

    const tempUsers = await prisma.user.findMany({
      where: {
        OR: [
          { email: { contains: 'TEST' } },
          { email: { contains: 'TEMP' } },
          { userCode: { contains: 'TEST' } },
          { name: { contains: 'TEST' } },
          { email: { contains: 'test.temp.user' } },
        ],
      },
    });

    const tempRoles = await prisma.role.findMany({
      where: {
        OR: [
          { code: { contains: 'TEST' } },
          { code: { contains: 'TEMP' } },
        ],
      },
    });

    const tempDepts = await prisma.department.findMany({
      where: {
        OR: [
          { code: { contains: 'TEST' } },
          { code: { contains: 'TEMP' } },
          { name: { contains: 'TEST' } },
          { name: { contains: 'Global Supply Chain' } },
          { name: { contains: 'Growth' } },
        ],
      },
    });

    const tempPerms = await prisma.permission.findMany({
      where: {
        OR: [
          { code: { contains: 'TEST' } },
          { code: { contains: 'TEMP' } },
          { code: { contains: 'temp_' } },
          { code: { contains: 'test_' } },
        ],
      },
    });

    console.log(JSON.stringify({
      counts: {
        users: { total: userTotal, active: userActive, inactive: userInactive, deleted: userDeleted },
        roles: { total: roleTotal, active: roleActive, inactive: roleInactive, deleted: roleDeleted },
        permissions: { total: permTotal, active: permActive, inactive: permInactive },
        departments: { total: deptTotal, active: deptActive, inactive: deptInactive },
      },
      testRecordsFound: {
        users: tempUsers.map(u => ({ id: u.id, email: u.email, name: u.name, code: u.userCode })),
        roles: tempRoles.map(r => ({ id: r.id, code: r.code, name: r.name })),
        departments: tempDepts.map(d => ({ id: d.id, code: d.code, name: d.name, status: d.status })),
        permissions: tempPerms.map(p => ({ id: p.id, code: p.code })),
      }
    }, null, 2));

  } finally {
    await prisma.$disconnect();
  }
}

main();
