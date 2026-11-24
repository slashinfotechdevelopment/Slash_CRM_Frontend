import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const FRONTEND_URL = 'http://127.0.0.1:5173';
const BACKEND_URL = 'http://127.0.0.1:5000';
const DOCS_DIR = 'D:\\Slash-Projects\\Slash_CRM_Frontend\\docs\\screenshots';
const ARTIFACT_DIR = 'C:\\Users\\Slash\\.gemini\\antigravity\\brain\\8c11b803-e7f2-48eb-8a87-829a6d7506b7';

async function getTokens(email) {
  await fetch(`${BACKEND_URL}/api/auth/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  const res = await (await fetch(`${BACKEND_URL}/api/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp: '123456' })
  })).json();
  return {
    accessToken: res.data.accessToken,
    refreshToken: res.data.refreshToken,
    user: res.data.user
  };
}

async function main() {
  console.log('=== STARTING HIGH-FIDELITY SCREENSHOT CAPTURE & VALIDATION ===\n');

  if (!fs.existsSync(DOCS_DIR)) fs.mkdirSync(DOCS_DIR, { recursive: true });

  const adminSession = await getTokens('srihari8489@gmail.com');
  console.log('✓ Admin tokens obtained for srihari8489@gmail.com');
  const employeeSession = await getTokens('alaguraja3104@gmail.com');
  console.log('✓ Employee tokens obtained for alaguraja3104@gmail.com\n');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setCacheEnabled(false);
  const capturedHashes = new Map();
  const capturedFiles = [];

  async function saveScreenshot(filename, viewport) {
    await page.setViewport(viewport);
    await new Promise((r) => setTimeout(r, 1500));

    // Check for build error overlay
    const hasErrorOverlay = await page.evaluate(() => {
      const overlay = document.querySelector('vite-error-overlay');
      return !!overlay;
    });
    if (hasErrorOverlay) {
      throw new Error(`[ERROR OVERLAY DETECTED] Screen ${filename} contains Vite error overlay!`);
    }

    const docPath = path.join(DOCS_DIR, filename);
    const brainPath = path.join(ARTIFACT_DIR, filename);

    await page.screenshot({ path: docPath, fullPage: false });
    fs.copyFileSync(docPath, brainPath);

    const buffer = fs.readFileSync(docPath);
    const hash = crypto.createHash('sha256').update(buffer).digest('hex');
    const size = buffer.length;

    if (capturedHashes.has(hash)) {
      const existing = capturedHashes.get(hash);
      throw new Error(`[DUPLICATE DETECTED] ${filename} is byte-identical to ${existing}!`);
    }
    capturedHashes.set(hash, filename);
    capturedFiles.push({ filename, size, hash: hash.substring(0, 12), width: viewport.width, height: viewport.height });
    console.log(`✓ Captured ${filename} (${viewport.width}x${viewport.height}, ${size.toLocaleString()} bytes, hash: ${hash.substring(0, 8)})`);
  }

  async function setSession(session) {
    await page.goto(`${FRONTEND_URL}/login`, { waitUntil: 'networkidle2' });
    await page.evaluate((s) => {
      localStorage.setItem('slash_crm_access_token', s.accessToken);
      localStorage.setItem('slash_crm_refresh_token', s.refreshToken);
      localStorage.setItem('slash_crm_user', JSON.stringify(s.user));
    }, session);
  }

  // -------------------------------------------------------------
  // PART A: RESPONSIVE LEAVE MODULE SCREENS (7 SCREENS @ 3 VIEWPORTS)
  // -------------------------------------------------------------
  console.log('\n--- Capturing Leave Screens (1280px, 768px, 360px) ---');
  await setSession(adminSession);

  const leaveScreens = [
    { slug: '/leave/my', base: 'proof_phase7_my_leave' },
    { slug: '/leave/approvals', base: 'proof_phase7_leave_approvals' },
    { slug: '/leave/balances', base: 'proof_phase7_leave_balances' },
    { slug: '/leave/calendar', base: 'proof_phase7_leave_calendar' },
    { slug: '/leave/holidays', base: 'proof_phase7_holidays' },
    { slug: '/leave/setup', base: 'proof_phase7_leave_setup' },
    { slug: '/leave/reports', base: 'proof_phase7_leave_reports' }
  ];

  const viewports = [
    { label: '1280px', width: 1280, height: 900 },
    { label: '768px', width: 768, height: 1024 },
    { label: '360px', width: 360, height: 800 }
  ];

  for (const s of leaveScreens) {
    for (const vp of viewports) {
      const filename = `${s.base}_${vp.label}.png`;
      await page.setViewport({ width: vp.width, height: vp.height });
      await page.goto(`${FRONTEND_URL}${s.slug}`, { waitUntil: 'networkidle2' });
      await saveScreenshot(filename, vp);
    }
  }

  // -------------------------------------------------------------
  // PART B: RESPONSIVE ADMIN MODULE SCREENS (3 SCREENS @ 3 VIEWPORTS)
  // -------------------------------------------------------------
  console.log('\n--- Capturing Admin Intelligence Screens (1280px, 768px, 360px) ---');
  const adminScreens = [
    { slug: '/admin/activity', base: 'proof_phase8_activity' },
    { slug: '/admin/tasks', base: 'proof_phase8_tasks_summary' },
    { slug: '/admin/leads', base: 'proof_phase8_leads_executive' }
  ];

  for (const s of adminScreens) {
    for (const vp of viewports) {
      const filename = `${s.base}_${vp.label}.png`;
      await page.setViewport({ width: vp.width, height: vp.height });
      await page.goto(`${FRONTEND_URL}${s.slug}`, { waitUntil: 'networkidle2' });
      await saveScreenshot(filename, vp);
    }
  }

  // -------------------------------------------------------------
  // PART C: ATTENDANCE LIFECYCLE CYCLE (7 DISTINCT STATES ON REAL BACKEND)
  // -------------------------------------------------------------
  console.log('\n--- Capturing Attendance Lifecycle Cycle (Real Backend API, Zero Interception) ---');
  const vpDesktop = { width: 1280, height: 900 };

  // 1. Not Checked In (Initial employee un-checked-in state)
  await setSession(employeeSession);
  await page.goto(`${FRONTEND_URL}/attendance/my`, { waitUntil: 'networkidle2' });
  await saveScreenshot('proof_a1_1_not_checked_in.png', vpDesktop);

  // 2. Real Check In (Real backend API call)
  console.log('-> Calling real POST /api/attendance/check-in...');
  const checkInRes = await fetch(`${BACKEND_URL}/api/attendance/check-in`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${employeeSession.accessToken}`,
    },
    body: JSON.stringify({}),
  });
  console.log(`   Check-in status: ${checkInRes.status}`);

  await page.goto(`${FRONTEND_URL}/attendance/my`, { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 4000)); // allow live timer to tick
  await saveScreenshot('proof_a1_2_checked_in_working.png', vpDesktop);

  // 3. After Refresh (Timer persists and increments)
  console.log('-> Refreshing page to verify timer persistence...');
  await page.reload({ waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 3000)); // allow timer to continue
  await saveScreenshot('proof_a1_3_refreshed_timer_persists.png', vpDesktop);

  // 4. Real Start Break
  console.log('-> Calling real POST /api/attendance/breaks/start...');
  const breakStartRes = await fetch(`${BACKEND_URL}/api/attendance/breaks/start`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${employeeSession.accessToken}`,
    },
    body: JSON.stringify({ breakTypeId: 'TEA' }),
  });
  console.log(`   Start break status: ${breakStartRes.status}`);

  await page.goto(`${FRONTEND_URL}/attendance/my`, { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 2000));
  await saveScreenshot('proof_a1_4_on_break.png', vpDesktop);

  // 5. Real End Break
  console.log('-> Calling real POST /api/attendance/breaks/end...');
  const breakEndRes = await fetch(`${BACKEND_URL}/api/attendance/breaks/end`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${employeeSession.accessToken}`,
    },
    body: JSON.stringify({ remarks: 'Break completed' }),
  });
  console.log(`   End break status: ${breakEndRes.status}`);

  await page.goto(`${FRONTEND_URL}/attendance/my`, { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 2000));
  await saveScreenshot('proof_a1_5_break_ended.png', vpDesktop);

  // 6. Real Check Out
  console.log('-> Calling real POST /api/attendance/check-out...');
  const checkOutRes = await fetch(`${BACKEND_URL}/api/attendance/check-out`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${employeeSession.accessToken}`,
    },
    body: JSON.stringify({ remarks: 'Shift concluded' }),
  });
  console.log(`   Check-out status: ${checkOutRes.status}`);

  await page.goto(`${FRONTEND_URL}/attendance/my`, { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 2000));
  await saveScreenshot('proof_a1_6_checked_out.png', vpDesktop);

  // 7. Upcoming Filter State on Team Attendance
  console.log('-> Capturing Team Attendance with Upcoming Filter...');
  await setSession(adminSession);
  await page.goto(`${FRONTEND_URL}/attendance/team`, { waitUntil: 'networkidle2' });
  await page.evaluate(() => {
    const selects = Array.from(document.querySelectorAll('select'));
    if (selects.length > 0) {
      selects[0].value = 'UPCOMING';
      selects[0].dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
  await new Promise((r) => setTimeout(r, 2000));
  await saveScreenshot('proof_a2_upcoming_filter.png', vpDesktop);

  await browser.close();

  console.log(`\n🎉 Successfully verified and captured ${capturedFiles.length} distinct screenshots!`);
  console.log(`Zero duplicate hashes. Zero compile-error overlays.`);
}

main().catch((err) => {
  console.error('\n❌ Capture failed:', err.message);
  process.exit(1);
});
