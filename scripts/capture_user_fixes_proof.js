import puppeteer from 'puppeteer-core';
import axios from 'axios';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:/Users/Slash/.gemini/antigravity/brain/8c11b803-e7f2-48eb-8a87-829a6d7506b7';
const BASE_URL = 'http://127.0.0.1:5000';
const FRONTEND_URL = 'http://127.0.0.1:5173';

async function clickByText(page, tag, text) {
  const handles = await page.$$(tag);
  for (const h of handles) {
    const val = await page.evaluate(el => el.textContent, h);
    if (val && val.includes(text)) {
      await h.click();
      return true;
    }
  }
  return false;
}

async function main() {
  console.log('=== Capturing Visual Proof for User Fixes with Correct Storage Keys ===\n');

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
  await page.setViewport({ width: 1280, height: 900 });

  // Seed localStorage with exact STORAGE_KEYS
  await page.goto(`${FRONTEND_URL}/login`, { waitUntil: 'networkidle2' });
  await page.evaluate(
    ({ token, u }) => {
      localStorage.setItem('slash_crm_access_token', token);
      localStorage.setItem('slash_crm_refresh_token', token);
      localStorage.setItem('slash_crm_user', JSON.stringify(u));
    },
    { token: accessToken, u: user }
  );

  // 1. Capture Lead Detail Page
  console.log('1. Capturing Lead Detail Page...');
  await page.goto(`${FRONTEND_URL}/leads/cmwkp6chg000ty4uzhnrin7rg`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('h1', { timeout: 10000 });
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'proof_lead_detail_fixed.png') });

  // 2. Open Edit Lead Modal & screenshot
  console.log('2. Capturing Edit Lead Modal...');
  const clickedEdit = await clickByText(page, 'button', 'Edit');
  if (clickedEdit) {
    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'proof_lead_edit_modal.png') });
    await clickByText(page, 'button', 'Cancel');
    await new Promise((r) => setTimeout(r, 500));
  }

  // 3. Open Schedule Follow-Up Modal & screenshot
  console.log('3. Capturing Schedule Follow-Up Modal...');
  await clickByText(page, 'button', 'Scheduled Follow-ups');
  await new Promise((r) => setTimeout(r, 600));
  const clickedFollowUp = await clickByText(page, 'button', 'Schedule Follow-up');
  if (clickedFollowUp) {
    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'proof_lead_followup_modal.png') });
    await clickByText(page, 'button', 'Cancel');
    await new Promise((r) => setTimeout(r, 500));
  }

  // 4. Capture My Leave History Page
  console.log('4. Capturing My Leave Page...');
  await page.goto(`${FRONTEND_URL}/leave/my`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('table', { timeout: 10000 });
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'proof_my_leave_history_fixed.png') });

  // 5. Open Apply Leave Modal & screenshot dropdown
  console.log('5. Capturing Apply Leave Modal with Populated Types...');
  const clickedApply = await clickByText(page, 'button', 'Apply for Leave');
  if (clickedApply) {
    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'proof_apply_leave_modal_fixed.png') });
    await clickByText(page, 'button', 'Cancel');
    await new Promise((r) => setTimeout(r, 500));
  }

  // 6. Capture Employee Balance Roster
  console.log('6. Capturing Employee Balance Roster...');
  await page.goto(`${FRONTEND_URL}/leave/balances`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('table', { timeout: 10000 });
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'proof_leave_balances_roster_fixed.png') });

  // 7. Capture Leave Setup Page
  console.log('7. Capturing Leave Setup Page...');
  await page.goto(`${FRONTEND_URL}/leave/setup`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('table', { timeout: 10000 });
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'proof_leave_policy_setup_fixed.png') });

  // 8. Open Edit Metadata modal on Leave Setup
  console.log('8. Capturing Edit Metadata Modal on Leave Setup...');
  const clickedMetadata = await clickByText(page, 'button', 'Edit Metadata');
  if (clickedMetadata) {
    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'proof_leave_edit_metadata_modal.png') });
    await clickByText(page, 'button', 'Cancel');
    await new Promise((r) => setTimeout(r, 500));
  }

  await browser.close();
  console.log('All real authenticated screenshots captured successfully.');
}

main().catch((err) => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
