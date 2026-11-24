import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOTS_DIR = 'D:\\Slash-Projects\\Slash_CRM_Frontend\\docs\\screenshots';
const ARTIFACTS_DIR = 'C:\\Users\\Slash\\.gemini\\antigravity\\brain\\8c11b803-e7f2-48eb-8a87-829a6d7506b7';
const BASE_URL = 'http://127.0.0.1:5000';
const FRONTEND_URL = 'http://127.0.0.1:5173';

async function main() {
  console.log('=== Capturing Phase 4 Attendance & Shifts Proof Screenshots ===\n');

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
  // 1. My Attendance Viewports (1280px, 768px, 360px)
  // =========================================================================
  console.log('\nCapturing My Attendance at 1280px...');
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto(`${FRONTEND_URL}/attendance/my`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('h1');
  await new Promise((r) => setTimeout(r, 1200));
  await takeScreenshot('proof_phase4_my_attendance_1280px.png');

  console.log('Capturing My Attendance at 768px...');
  await page.setViewport({ width: 768, height: 1024 });
  await page.reload({ waitUntil: 'networkidle2' });
  await page.waitForSelector('h1');
  await new Promise((r) => setTimeout(r, 1200));
  await takeScreenshot('proof_phase4_my_attendance_768px.png');

  console.log('Capturing My Attendance at 360px...');
  await page.setViewport({ width: 360, height: 740 });
  await page.reload({ waitUntil: 'networkidle2' });
  await page.waitForSelector('h1');
  await new Promise((r) => setTimeout(r, 1200));
  await takeScreenshot('proof_phase4_my_attendance_360px.png');

  // Reset to 1280px
  await page.setViewport({ width: 1280, height: 800 });

  // =========================================================================
  // 2. Team Attendance (1280px)
  // =========================================================================
  console.log('\nCapturing Team Attendance at 1280px...');
  await page.goto(`${FRONTEND_URL}/attendance/team`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('h1');
  await new Promise((r) => setTimeout(r, 1200));
  await takeScreenshot('proof_phase4_team_attendance_1280px.png');

  // =========================================================================
  // 3. Shifts Management & Create Shift Modal
  // =========================================================================
  console.log('\nCapturing Shifts Management at 1280px...');
  await page.goto(`${FRONTEND_URL}/attendance/shifts`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('h1');
  await new Promise((r) => setTimeout(r, 1200));
  await takeScreenshot('proof_phase4_shifts_page_1280px.png');

  console.log('Capturing Create Shift Modal...');
  const createShiftBtn = await page.waitForSelector('button ::-p-text(Add Shift Definition)');
  if (createShiftBtn) {
    await createShiftBtn.click();
    await new Promise((r) => setTimeout(r, 800));
    await takeScreenshot('proof_phase4_create_shift_modal.png');
    const closeBtn = await page.$('button ::-p-text(Cancel)');
    if (closeBtn) await closeBtn.click();
    await new Promise((r) => setTimeout(r, 400));
  }

  // =========================================================================
  // 4. WFH Requests & Apply Modal
  // =========================================================================
  console.log('\nCapturing WFH Requests at 1280px...');
  await page.goto(`${FRONTEND_URL}/attendance/wfh`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('h1');
  await new Promise((r) => setTimeout(r, 1200));
  await takeScreenshot('proof_phase4_wfh_page_1280px.png');

  console.log('Capturing Apply WFH Modal...');
  const applyWfhBtn = await page.waitForSelector('button ::-p-text(Apply for WFH)');
  if (applyWfhBtn) {
    await applyWfhBtn.click();
    await new Promise((r) => setTimeout(r, 800));
    await takeScreenshot('proof_phase4_apply_wfh_modal.png');
    const closeBtn = await page.$('button ::-p-text(Cancel)');
    if (closeBtn) await closeBtn.click();
    await new Promise((r) => setTimeout(r, 400));
  }

  // =========================================================================
  // 5. Overtime Requests & Submit Modal
  // =========================================================================
  console.log('\nCapturing Overtime Requests at 1280px...');
  await page.goto(`${FRONTEND_URL}/attendance/overtime`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('h1');
  await new Promise((r) => setTimeout(r, 1200));
  await takeScreenshot('proof_phase4_overtime_page_1280px.png');

  console.log('Capturing Submit Overtime Modal...');
  const submitOtBtn = await page.waitForSelector('button ::-p-text(Submit Overtime)');
  if (submitOtBtn) {
    await submitOtBtn.click();
    await new Promise((r) => setTimeout(r, 800));
    await takeScreenshot('proof_phase4_submit_overtime_modal.png');
    const closeBtn = await page.$('button ::-p-text(Cancel)');
    if (closeBtn) await closeBtn.click();
    await new Promise((r) => setTimeout(r, 400));
  }

  // =========================================================================
  // 6. Corrections & Submit Modal
  // =========================================================================
  console.log('\nCapturing Corrections Page at 1280px...');
  await page.goto(`${FRONTEND_URL}/attendance/corrections`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('h1');
  await new Promise((r) => setTimeout(r, 1200));
  await takeScreenshot('proof_phase4_corrections_page_1280px.png');

  console.log('Capturing Submit Correction Modal...');
  const submitCorBtn = await page.waitForSelector('button ::-p-text(Submit Correction)');
  if (submitCorBtn) {
    await submitCorBtn.click();
    await new Promise((r) => setTimeout(r, 800));
    await takeScreenshot('proof_phase4_submit_correction_modal.png');
    const closeBtn = await page.$('button ::-p-text(Cancel)');
    if (closeBtn) await closeBtn.click();
    await new Promise((r) => setTimeout(r, 400));
  }

  // =========================================================================
  // 7. Anomalies Page (1280px)
  // =========================================================================
  console.log('\nCapturing Quarantined Anomalies at 1280px...');
  await page.goto(`${FRONTEND_URL}/attendance/anomalies`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('h1');
  await new Promise((r) => setTimeout(r, 1200));
  await takeScreenshot('proof_phase4_anomalies_page_1280px.png');

  // =========================================================================
  // 8. Reconciliation Page (1280px)
  // =========================================================================
  console.log('\nCapturing Reconciliation Page at 1280px...');
  await page.goto(`${FRONTEND_URL}/attendance/reconciliation`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('h1');
  await new Promise((r) => setTimeout(r, 1200));
  await takeScreenshot('proof_phase4_reconciliation_page_1280px.png');

  await browser.close();
  console.log('\n=== All Phase 4 Proof Screenshots Successfully Captured ===');
  process.exit(0);
}

main().catch((err) => {
  console.error('Screenshot error:', err);
  process.exit(1);
});
