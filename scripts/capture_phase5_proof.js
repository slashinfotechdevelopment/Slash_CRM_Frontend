import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOTS_DIR = 'D:\\Slash-Projects\\Slash_CRM_Frontend\\docs\\screenshots';
const ARTIFACTS_DIR = 'C:\\Users\\Slash\\.gemini\\antigravity\\brain\\8c11b803-e7f2-48eb-8a87-829a6d7506b7';
const BASE_URL = 'http://127.0.0.1:5000';
const FRONTEND_URL = 'http://127.0.0.1:5173';

async function main() {
  console.log('=== Capturing Phase 5 Tasks & Kanban Management Proof Screenshots ===\n');

  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  }

  // 1. Authenticate as Super Admin dynamically
  console.log('Authenticating as Super Admin...');
  await fetch(`${BASE_URL}/api/auth/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'srihari8489@gmail.com', purpose: 'LOGIN' }),
  });

  const verifyRes = await fetch(`${BASE_URL}/api/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'srihari8489@gmail.com', otp: '123456', purpose: 'LOGIN' }),
  });
  const verifyData = await verifyRes.json();
  const token = verifyData.data.accessToken;
  const refreshToken = verifyData.data.refreshToken;
  const user = verifyData.data.user;

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();

  async function takeScreenshot(filename) {
    const p1 = path.join(SCREENSHOTS_DIR, filename);
    const p2 = path.join(ARTIFACTS_DIR, filename);
    await page.screenshot({ path: p1, fullPage: false });
    fs.copyFileSync(p1, p2);
    console.log(`✓ Saved screenshot: ${filename}`);
  }

  // Set auth tokens in localStorage
  await page.goto(`${FRONTEND_URL}/login`, { waitUntil: 'networkidle2' });
  await page.evaluate(
    ({ t, rt, u }) => {
      localStorage.setItem('slash_crm_access_token', t);
      localStorage.setItem('slash_crm_refresh_token', rt);
      localStorage.setItem('slash_crm_user', JSON.stringify(u));
    },
    { t: token, rt: refreshToken, u: user }
  );

  // =========================================================================
  // 1. Tasks List Page - Desktop 1280px (Table View)
  // =========================================================================
  console.log('\n1. Capturing Tasks List (Desktop 1280px Table View)...');
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto(`${FRONTEND_URL}/tasks`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('h1');
  await new Promise((r) => setTimeout(r, 1500));
  await takeScreenshot('proof_phase5_tasks_list_1280px.png');

  // =========================================================================
  // 2. Tasks List Page - Kanban View (1280px)
  // =========================================================================
  console.log('\n2. Capturing Tasks List (Kanban View)...');
  // Click the Kanban view switch button
  const buttons = await page.$$('button');
  for (const btn of buttons) {
    const text = await page.evaluate((el) => el.innerText, btn);
    if (text && text.includes('Kanban')) {
      await btn.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 1500));
  await takeScreenshot('proof_phase5_tasks_kanban_1280px.png');

  // Switch back to Table view
  const btnsBack = await page.$$('button');
  for (const btn of btnsBack) {
    const text = await page.evaluate((el) => el.innerText, btn);
    if (text && text.includes('Table')) {
      await btn.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 1000));

  // =========================================================================
  // 3. Create Task Modal Open
  // =========================================================================
  console.log('\n3. Capturing Create Task Modal...');
  const createBtns = await page.$$('button');
  for (const btn of createBtns) {
    const text = await page.evaluate((el) => el.innerText, btn);
    if (text && text.includes('Create Task')) {
      await btn.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 800));
  await takeScreenshot('proof_phase5_create_task_modal.png');

  // Close modal with Cancel or Escape
  await page.keyboard.press('Escape');
  await new Promise((r) => setTimeout(r, 500));

  // =========================================================================
  // 4. Tasks List Page - Tablet 768px
  // =========================================================================
  console.log('\n4. Capturing Tasks List (Tablet 768px)...');
  await page.setViewport({ width: 768, height: 1024 });
  await page.reload({ waitUntil: 'networkidle2' });
  await page.waitForSelector('h1');
  await new Promise((r) => setTimeout(r, 1200));
  await takeScreenshot('proof_phase5_tasks_list_768px.png');

  // =========================================================================
  // 5. Tasks List Page - Mobile 360px
  // =========================================================================
  console.log('\n5. Capturing Tasks List (Mobile 360px Cards)...');
  await page.setViewport({ width: 360, height: 740 });
  await page.reload({ waitUntil: 'networkidle2' });
  await page.waitForSelector('h1');
  await new Promise((r) => setTimeout(r, 1200));
  await takeScreenshot('proof_phase5_tasks_list_360px.png');

  // Reset viewport to 1280px
  await page.setViewport({ width: 1280, height: 800 });

  // =========================================================================
  // 6. My Tasks Page (1280px)
  // =========================================================================
  console.log('\n6. Capturing My Tasks Page (1280px)...');
  await page.goto(`${FRONTEND_URL}/tasks/my`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('h1');
  await new Promise((r) => setTimeout(r, 1500));
  await takeScreenshot('proof_phase5_my_tasks_active_timer_1280px.png');

  // =========================================================================
  // 7. Task Detail Page - Overview & Timers (1280px)
  // =========================================================================
  console.log('\n7. Capturing Task Detail Overview (1280px)...');
  await page.goto(`${FRONTEND_URL}/tasks/cmwlobn2y0006q0uz9ifnkh5m`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('h1');
  await new Promise((r) => setTimeout(r, 1500));
  await takeScreenshot('proof_phase5_task_detail_1280px.png');

  // =========================================================================
  // 8. Task Detail Page - Attachments Tab
  // =========================================================================
  console.log('\n8. Capturing Task Detail Attachments Tab...');
  const tabBtns = await page.$$('button');
  for (const btn of tabBtns) {
    const text = await page.evaluate((el) => el.innerText, btn);
    if (text && text.includes('Attachments')) {
      await btn.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 1000));
  await takeScreenshot('proof_phase5_task_detail_attachments.png');

  // =========================================================================
  // 9. Task Dashboards Page (1280px)
  // =========================================================================
  console.log('\n9. Capturing Task Dashboards Page (1280px)...');
  await page.goto(`${FRONTEND_URL}/tasks/dashboards`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('h1');
  await new Promise((r) => setTimeout(r, 1500));
  await takeScreenshot('proof_phase5_task_dashboards_1280px.png');

  // =========================================================================
  // 10. Task Reports Page (1280px)
  // =========================================================================
  console.log('\n10. Capturing Task Reports Page (1280px)...');
  await page.goto(`${FRONTEND_URL}/tasks/reports`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('h1');
  await new Promise((r) => setTimeout(r, 1500));
  await takeScreenshot('proof_phase5_task_reports_1280px.png');

  await browser.close();
  console.log('\n=== All Phase 5 Proof Screenshots Captured Successfully! ===');
}

main().catch((err) => {
  console.error('Error capturing proof:', err);
  process.exit(1);
});
