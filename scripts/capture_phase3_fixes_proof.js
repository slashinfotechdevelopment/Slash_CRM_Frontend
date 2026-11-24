import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOTS_DIR = 'D:\\Slash-Projects\\Slash_CRM_Frontend\\docs\\screenshots';
const ARTIFACTS_DIR = 'C:\\Users\\Slash\\.gemini\\antigravity\\brain\\8c11b803-e7f2-48eb-8a87-829a6d7506b7';
const BASE_URL = 'http://localhost:5000';
const FRONTEND_URL = 'http://127.0.0.1:5173';

async function main() {
  console.log('=== Capturing Phase 3 Fix Proof Screenshots ===\n');

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

  // Set session tokens in browser
  await page.goto(`${FRONTEND_URL}/login`, { waitUntil: 'networkidle2' });
  await page.evaluate(
    ({ t, rt, u }) => {
      localStorage.setItem('slash_crm_access_token', t);
      localStorage.setItem('slash_crm_refresh_token', rt);
      localStorage.setItem('slash_crm_user', JSON.stringify(u));
    },
    { t: token, rt: refreshToken, u: user }
  );

  // -------------------------------------------------------------
  // Fix 1: Users List at 1280px (No Cutoff, No Scroll)
  // -------------------------------------------------------------
  console.log('Capturing Users List at 1280px...');
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto(`${FRONTEND_URL}/users`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('h1');
  await new Promise((r) => setTimeout(r, 1200));
  await takeScreenshot('proof_fix1_users_list_1280px_no_scroll.png');

  // -------------------------------------------------------------
  // Fix 1b: Users List at 1440px
  // -------------------------------------------------------------
  console.log('Capturing Users List at 1440px...');
  await page.setViewport({ width: 1440, height: 900 });
  await page.reload({ waitUntil: 'networkidle2' });
  await page.waitForSelector('h1');
  await new Promise((r) => setTimeout(r, 1200));
  await takeScreenshot('proof_fix1_users_list_1440px.png');

  // -------------------------------------------------------------
  // Fix 2: AlaguRaja User Detail ("Job Designation" -> developer)
  // -------------------------------------------------------------
  console.log('Capturing AlaguRaja User Detail with developer designation...');
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto(`${FRONTEND_URL}/users/cmwdjeqll001t78uzuyvkjgpo`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('h1');
  await new Promise((r) => setTimeout(r, 1200));
  await takeScreenshot('proof_fix2_alagu_raja_designation_detail.png');

  // -------------------------------------------------------------
  // Fix 4: Permission Overrides Modal (Full-width row search)
  // -------------------------------------------------------------
  console.log('Capturing Permission Overrides Modal with full-width search...');
  const configPermsBtn = await page.waitForSelector('button ::-p-text(Configure Permission Overrides)');
  await configPermsBtn.click();
  await page.waitForSelector('h3 ::-p-text(Manage Permission Overrides)');
  // Type a search filter into the permission picker search
  const permSearchInput = await page.waitForSelector('input[placeholder*="Type to search 130+ permissions"]');
  await permSearchInput.type('attendance');
  await new Promise((r) => setTimeout(r, 800));
  await takeScreenshot('proof_fix4_permission_override_fullwidth_modal.png');

  // -------------------------------------------------------------
  // Fix 4b: Permission Overrides Modal at 360px Mobile
  // -------------------------------------------------------------
  console.log('Capturing Permission Overrides Modal at 360px...');
  await page.setViewport({ width: 360, height: 740 });
  await new Promise((r) => setTimeout(r, 600));
  await takeScreenshot('proof_fix4_permission_override_modal_360px.png');

  // Close permission modal
  const closePermBtn = await page.waitForSelector('button ::-p-text(Cancel)');
  await closePermBtn.click();
  await new Promise((r) => setTimeout(r, 500));

  // -------------------------------------------------------------
  // Fix 5: Error Dialog with Single Neutral Close Button
  // -------------------------------------------------------------
  console.log('Capturing Error Dialog with single neutral Close button...');
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto(`${FRONTEND_URL}/departments`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('h1');
  await new Promise((r) => setTimeout(r, 1000));

  // Find a department with members (Development) and click deactivate
  const devRowTrash = await page.waitForSelector('tbody tr:first-child button[title="Deactivate Department"]');
  await devRowTrash.click();
  await page.waitForSelector('h3 ::-p-text(Deactivate Department)');
  // Click Deactivate Department to trigger server rejection (has active members)
  const deactivateBtn = await page.waitForSelector('button ::-p-text(Deactivate Department)');
  await deactivateBtn.click();
  // Wait for the rejection error dialog
  await page.waitForSelector('h3 ::-p-text(Deactivation Rejected by Server)');
  await new Promise((r) => setTimeout(r, 800));
  await takeScreenshot('proof_fix5_error_dialog_single_close_button.png');

  await browser.close();
  console.log('\n=== All Phase 3 Fix Proof Screenshots Captured Successfully! ===\n');
}

main();
