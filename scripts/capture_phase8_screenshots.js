import puppeteer from 'puppeteer-core';
import axios from 'axios';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:/Users/Slash/.gemini/antigravity/brain/8c11b803-e7f2-48eb-8a87-829a6d7506b7';
const BASE_URL = 'http://127.0.0.1:5000';
const FRONTEND_URL = 'http://127.0.0.1:5173';

async function main() {
  console.log('=== Capturing Phase 8 Admin Dashboards Responsive Screenshots ===\n');

  // Authenticate as Super Admin
  await axios.post(`${BASE_URL}/api/auth/send-otp`, { email: 'srihari8489@gmail.com' });
  const authRes = await axios.post(`${BASE_URL}/api/auth/verify-otp`, {
    email: 'srihari8489@gmail.com',
    otp: '123456',
  });
  const data = authRes.data?.data || authRes.data;
  const accessToken = data.accessToken;
  const refreshToken = data.refreshToken || 'dummy_refresh';
  const user = data.user;

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  // Seed localStorage with authenticated session using exact STORAGE_KEYS
  await page.goto(`${FRONTEND_URL}/login`, { waitUntil: 'networkidle2' });
  await page.evaluate(
    ({ aToken, rToken, u }) => {
      localStorage.setItem('slash_crm_access_token', aToken);
      localStorage.setItem('slash_crm_refresh_token', rToken);
      localStorage.setItem('slash_crm_user', JSON.stringify(u));
    },
    { aToken: accessToken, rToken: refreshToken, u: user }
  );

  const screens = [
    { name: 'proof_phase8_activity_1280px.png', path: '/admin/activity', width: 1280, height: 900 },
    { name: 'proof_phase8_activity_768px.png', path: '/admin/activity', width: 768, height: 1024 },
    { name: 'proof_phase8_activity_360px.png', path: '/admin/activity', width: 360, height: 800 },

    { name: 'proof_phase8_tasks_summary_1280px.png', path: '/admin/tasks', width: 1280, height: 900 },
    { name: 'proof_phase8_tasks_summary_768px.png', path: '/admin/tasks', width: 768, height: 1024 },
    { name: 'proof_phase8_tasks_summary_360px.png', path: '/admin/tasks', width: 360, height: 800 },

    { name: 'proof_phase8_leads_executive_1280px.png', path: '/admin/leads', width: 1280, height: 900 },
    { name: 'proof_phase8_leads_executive_768px.png', path: '/admin/leads', width: 768, height: 1024 },
    { name: 'proof_phase8_leads_executive_360px.png', path: '/admin/leads', width: 360, height: 800 },
  ];

  for (const s of screens) {
    console.log(`Capturing ${s.name} at ${s.width}x${s.height}...`);
    await page.setViewport({ width: s.width, height: s.height });
    await page.goto(`${FRONTEND_URL}${s.path}`, { waitUntil: 'networkidle2' });
    // Wait for content and data to load
    await new Promise((r) => setTimeout(r, 2000));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, s.name), fullPage: false });
  }

  await browser.close();
  console.log('\nAll Phase 8 proof screenshots captured successfully!');
}

main().catch((err) => {
  console.error('Fatal screenshot error:', err);
  process.exit(1);
});
