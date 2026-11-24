import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACTS_DIR = 'C:\\Users\\Slash\\.gemini\\antigravity\\brain\\8c11b803-e7f2-48eb-8a87-829a6d7506b7';
const BASE_URL = 'http://127.0.0.1:5000';
const FRONTEND_URL = 'http://127.0.0.1:5173';

async function main() {
  console.log('=== Verifying UI Fixes in Attendance and Tasks Modules ===\n');

  // Authenticate as Super Admin
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
  await page.setViewport({ width: 1280, height: 800 });

  async function takeScreenshot(filename) {
    const p = path.join(ARTIFACTS_DIR, filename);
    await page.screenshot({ path: p, fullPage: false });
    console.log(`✓ Saved screenshot: ${filename}`);
  }

  // Set tokens in localStorage
  await page.goto(`${FRONTEND_URL}/login`, { waitUntil: 'networkidle2' });
  await page.evaluate(
    ({ t, rt, u }) => {
      localStorage.setItem('slash_crm_access_token', t);
      localStorage.setItem('slash_crm_refresh_token', rt);
      localStorage.setItem('slash_crm_user', JSON.stringify(u));
    },
    { t: token, rt: refreshToken, u: user }
  );

  // 1. Shifts Page
  console.log('1. Checking Shifts Page...');
  await page.goto(`${FRONTEND_URL}/attendance/shifts`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('h1');
  await new Promise((r) => setTimeout(r, 1500));
  await takeScreenshot('proof_fix_shifts_page_with_data.png');

  // 1b. My Attendance Page
  console.log('1b. Checking My Attendance Page...');
  await page.goto(`${FRONTEND_URL}/attendance/my`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('h1');
  await new Promise((r) => setTimeout(r, 1500));
  await takeScreenshot('proof_fix_my_attendance_with_data.png');

  // 2. Team Attendance Page
  console.log('2. Checking Team Attendance Page...');
  await page.goto(`${FRONTEND_URL}/attendance/team`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('h1');
  await new Promise((r) => setTimeout(r, 1500));
  await takeScreenshot('proof_fix_team_attendance_with_data.png');

  // 3. Organization Dashboard Tab
  console.log('3. Checking Organization Dashboard Tab...');
  await page.goto(`${FRONTEND_URL}/tasks/dashboards`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('h1');
  // Click Organization Overview tab
  const tabs = await page.$$('button');
  for (const t of tabs) {
    const text = await page.evaluate((el) => el.innerText, t);
    if (text && text.includes('Organization Overview')) {
      await t.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 1500));
  await takeScreenshot('proof_fix_org_dashboard_with_data.png');

  // 4. Task Reports - Working Hours Tab
  console.log('4. Checking Task Reports - Working Hours Tab...');
  await page.goto(`${FRONTEND_URL}/tasks/reports`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('h1');
  const repTabs = await page.$$('button');
  for (const t of repTabs) {
    const text = await page.evaluate((el) => el.innerText, t);
    if (text && text.includes('Working Hours & Pauses')) {
      await t.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 1500));
  await takeScreenshot('proof_fix_reports_working_hours_with_data.png');

  // 5. Task Reports - Employee Performance Tab
  console.log('5. Checking Task Reports - Employee Performance Tab...');
  const repTabs2 = await page.$$('button');
  for (const t of repTabs2) {
    const text = await page.evaluate((el) => el.innerText, t);
    if (text && text.includes('Employee Performance')) {
      await t.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 1500));
  await takeScreenshot('proof_fix_reports_employee_performance_with_data.png');

  await browser.close();
  console.log('\n=== All verification screenshots captured successfully! ===');
}

main().catch((err) => {
  console.error('Error during verification:', err);
  process.exit(1);
});
