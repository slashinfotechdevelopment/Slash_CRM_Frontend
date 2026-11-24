import puppeteer from 'puppeteer-core';
import axios from 'axios';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:/Users/Slash/.gemini/antigravity/brain/8c11b803-e7f2-48eb-8a87-829a6d7506b7';
const BASE_URL = 'http://127.0.0.1:5000';
const FRONTEND_URL = 'http://127.0.0.1:5173';

async function main() {
  console.log('=== Capturing Phase 7 Leave Module Responsive Screenshots ===\n');

  // Authenticate as Super Admin
  await axios.post(`${BASE_URL}/api/auth/send-otp`, { email: 'srihari8489@gmail.com' });
  const authRes = await axios.post(`${BASE_URL}/api/auth/verify-otp`, {
    email: 'srihari8489@gmail.com',
    otp: '123456',
  });
  const { accessToken, user } = authRes.data?.data || authRes.data;

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  // Seed localStorage with authenticated session
  await page.goto(`${FRONTEND_URL}/login`, { waitUntil: 'networkidle2' });
  await page.evaluate(
    ({ token, u }) => {
      localStorage.setItem('accessToken', token);
      localStorage.setItem('user', JSON.stringify(u));
    },
    { token: accessToken, u: user }
  );

  const screens = [
    { name: 'proof_phase7_my_leave_1280px.png', path: '/leave/my', width: 1280, height: 900 },
    { name: 'proof_phase7_my_leave_768px.png', path: '/leave/my', width: 768, height: 1024 },
    { name: 'proof_phase7_my_leave_360px.png', path: '/leave/my', width: 360, height: 800 },
    { name: 'proof_phase7_leave_approvals_1280px.png', path: '/leave/approvals', width: 1280, height: 900 },
    { name: 'proof_phase7_leave_balances_1280px.png', path: '/leave/balances', width: 1280, height: 900 },
    { name: 'proof_phase7_leave_calendar_1280px.png', path: '/leave/calendar', width: 1280, height: 900 },
    { name: 'proof_phase7_holidays_1280px.png', path: '/leave/holidays', width: 1280, height: 900 },
    { name: 'proof_phase7_leave_setup_1280px.png', path: '/leave/setup', width: 1280, height: 900 },
    { name: 'proof_phase7_leave_reports_1280px.png', path: '/leave/reports', width: 1280, height: 900 },
  ];

  for (const s of screens) {
    console.log(`Capturing ${s.name} at ${s.width}x${s.height}...`);
    await page.setViewport({ width: s.width, height: s.height });
    await page.goto(`${FRONTEND_URL}${s.path}`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1200));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, s.name), fullPage: false });
  }

  await browser.close();
  console.log('\nAll Phase 7 proof screenshots captured successfully!');
}

main().catch(console.error);
