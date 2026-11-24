import puppeteer from 'puppeteer-core';
import axios from 'axios';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:/Users/Slash/.gemini/antigravity/brain/8c11b803-e7f2-48eb-8a87-829a6d7506b7';
const BASE_URL = 'http://127.0.0.1:5000';
const FRONTEND_URL = 'http://127.0.0.1:5173';

async function main() {
  console.log('=== Capturing Visual Proof for Sidebar and Department Modal Fixes ===\n');

  // Authenticate as Super Admin
  await axios.post(`${BASE_URL}/api/auth/send-otp`, { email: 'srihari8489@gmail.com' });
  const authRes = await axios.post(`${BASE_URL}/api/auth/verify-otp`, {
    email: 'srihari8489@gmail.com',
    otp: '123456',
  });
  const { accessToken, user } = authRes.data?.data || authRes.data;
  console.log('✓ Obtained Super Admin token for:', user?.email);

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  // Seed session
  await page.goto(`${FRONTEND_URL}/login`, { waitUntil: 'networkidle2' });
  await page.evaluate(
    ({ token, u }) => {
      localStorage.setItem('slash_crm_access_token', token);
      localStorage.setItem('slash_crm_refresh_token', token);
      localStorage.setItem('slash_crm_user', JSON.stringify(u));
    },
    { token: accessToken, u: user }
  );

  // 1. Navigate to /departments
  console.log('Navigating to /departments...');
  await page.goto(`${FRONTEND_URL}/departments`, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));

  const sidebarProofPath = path.join(ARTIFACT_DIR, 'proof_sidebar_departments_fixed.png');
  await page.screenshot({ path: sidebarProofPath, fullPage: false });
  console.log('✓ Captured sidebar proof to:', sidebarProofPath);

  // 2. Click the view details button (eye icon) on Development row
  console.log('Opening Department Overview modal for Development...');
  const viewButtons = await page.$$('button[title="View Details"]');
  if (viewButtons.length > 0) {
    await viewButtons[0].click();
  } else {
    // fallback click on table row
    const row = await page.$('tbody tr');
    if (row) await row.click();
  }

  await new Promise(r => setTimeout(r, 1500));

  const modalProofPath = path.join(ARTIFACT_DIR, 'proof_department_overview_modal_fixed.png');
  await page.screenshot({ path: modalProofPath, fullPage: false });
  console.log('✓ Captured Department Overview modal proof to:', modalProofPath);

  await browser.close();
  console.log('=== Capture Complete! ===');
}

main().catch(err => {
  console.error('Capture failed:', err);
  process.exit(1);
});
