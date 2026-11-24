import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOTS_DIR = 'D:\\Slash-Projects\\Slash_CRM_Frontend\\docs\\screenshots';
const ARTIFACTS_DIR = 'C:\\Users\\Slash\\.gemini\\antigravity\\brain\\8c11b803-e7f2-48eb-8a87-829a6d7506b7';

async function main() {
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  }

  console.log('Launching Chrome via puppeteer-core...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();

  // Helper to save screenshot both in docs/screenshots and brain artifacts dir
  async function takeScreenshot(filename) {
    const p1 = path.join(SCREENSHOTS_DIR, filename);
    const p2 = path.join(ARTIFACTS_DIR, filename);
    await page.screenshot({ path: p1, fullPage: false });
    fs.copyFileSync(p1, p2);
    console.log(`Saved screenshot: ${filename}`);
  }

  // 1. Authenticate against real backend
  console.log('Obtaining authentication tokens from live backend...');
  const sendRes = await fetch('http://localhost:5000/api/auth/send-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'srihari8489@gmail.com', purpose: 'LOGIN' }),
  });
  const sendData = await sendRes.json();
  console.log('send-otp response:', sendData.message);

  const verifyRes = await fetch('http://localhost:5000/api/auth/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'srihari8489@gmail.com', otp: '123456', purpose: 'LOGIN' }),
  });
  const verifyData = await verifyRes.json();
  const token = verifyData.data.accessToken;
  const refreshToken = verifyData.data.refreshToken;
  const user = verifyData.data.user;

  console.log('Real backend authenticated as:', user.name, user.email, user.userType);

  // Navigate to frontend app and inject localStorage session
  await page.goto('http://127.0.0.1:5173/login', { waitUntil: 'networkidle2' });
  await page.evaluate(
    ({ t, rt, u }) => {
      localStorage.setItem('slash_crm_access_token', t);
      localStorage.setItem('slash_crm_refresh_token', rt);
      localStorage.setItem('slash_crm_user', JSON.stringify(u));
    },
    { t: token, rt: refreshToken, u: user }
  );

  // --------------------------------------------------------------------------
  // (a) Dashboard with Real Auth at 360px, 768px, 1280px
  // --------------------------------------------------------------------------
  console.log('Loading Dashboard with real authenticated session...');
  await page.goto('http://127.0.0.1:5173/dashboard', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1000));

  // Desktop (1280px)
  await page.setViewport({ width: 1280, height: 800 });
  await takeScreenshot('proof_dashboard_real_auth_1280px.png');

  // Tablet (768px)
  await page.setViewport({ width: 768, height: 1024 });
  await takeScreenshot('proof_dashboard_real_auth_768px.png');

  // Mobile (360px)
  await page.setViewport({ width: 360, height: 800 });
  await takeScreenshot('proof_dashboard_real_auth_360px.png');

  // --------------------------------------------------------------------------
  // (b, c, d, e) Shared Template Showcase (Skeleton, Empty, Error, ConfirmDialog)
  // --------------------------------------------------------------------------
  console.log('Navigating to UI Templates Showcase...');
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto('http://127.0.0.1:5173/dev/showcase', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 600));

  // (e) All 4 ConfirmDialog colours side-by-side
  await takeScreenshot('proof_confirm_dialogs_4_tones_1280px.png');

  // Interactive Danger Dialog Modal with Reason
  const buttons = await page.$$('button');
  for (const b of buttons) {
    const text = await (await b.getProperty('textContent')).jsonValue();
    if (text.includes('Open Danger Dialog')) {
      await b.click();
      await new Promise((r) => setTimeout(r, 400));
      await takeScreenshot('proof_confirm_dialog_danger_modal.png');
      // Close modal
      const cancelBtn = await page.$('button[aria-label="Close dialog"]');
      if (cancelBtn) await cancelBtn.click();
      await new Promise((r) => setTimeout(r, 300));
      break;
    }
  }

  // Interactive Warning Dialog Modal
  for (const b of buttons) {
    const text = await (await b.getProperty('textContent')).jsonValue();
    if (text.includes('Open Warning Dialog')) {
      await b.click();
      await new Promise((r) => setTimeout(r, 400));
      await takeScreenshot('proof_confirm_dialog_warning_modal.png');
      const cancelBtn = await page.$('button[aria-label="Close dialog"]');
      if (cancelBtn) await cancelBtn.click();
      await new Promise((r) => setTimeout(r, 300));
      break;
    }
  }

  // (b) Skeleton Loading State
  await page.evaluate(() => {
    const tabBtns = Array.from(document.querySelectorAll('button'));
    const skelBtn = tabBtns.find((b) => b.textContent?.trim() === 'skeletons');
    if (skelBtn) skelBtn.click();
  });
  await new Promise((r) => setTimeout(r, 400));
  await takeScreenshot('proof_skeleton_loading_state.png');

  // (c) EmptyState
  await page.evaluate(() => {
    const tabBtns = Array.from(document.querySelectorAll('button'));
    const empBtn = tabBtns.find((b) => b.textContent?.trim() === 'empty');
    if (empBtn) empBtn.click();
  });
  await new Promise((r) => setTimeout(r, 400));
  await takeScreenshot('proof_empty_state.png');

  // (d) ErrorState with "Try again"
  await page.evaluate(() => {
    const tabBtns = Array.from(document.querySelectorAll('button'));
    const errBtn = tabBtns.find((b) => b.textContent?.trim() === 'error');
    if (errBtn) errBtn.click();
  });
  await new Promise((r) => setTimeout(r, 400));
  await takeScreenshot('proof_error_state_with_retry.png');

  // --------------------------------------------------------------------------
  // Phase 2: Roles List Screen at 360px, 768px, 1280px
  // --------------------------------------------------------------------------
  console.log('Loading Roles list screen against real backend data...');
  await page.goto('http://127.0.0.1:5173/roles', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1200));

  await page.setViewport({ width: 1280, height: 850 });
  await takeScreenshot('phase2_roles_list_1280px.png');

  await page.setViewport({ width: 768, height: 1024 });
  await takeScreenshot('phase2_roles_list_768px.png');

  await page.setViewport({ width: 360, height: 800 });
  await takeScreenshot('phase2_roles_list_360px.png');

  // --------------------------------------------------------------------------
  // Phase 2: Role Permission Detail Screen
  // --------------------------------------------------------------------------
  console.log('Loading Super Admin Role Details & Permissions screen...');
  await page.setViewport({ width: 1280, height: 950 });
  // Find the Super Admin role ID from backend
  const rolesFetch = await fetch('http://localhost:5000/api/roles', {
    headers: { Authorization: `Bearer ${token}` },
  });
  const rolesJson = await rolesFetch.json();
  const superAdminRole = rolesJson.data.items.find((r) => r.code === 'SUPER_ADMIN') || rolesJson.data.items[0];

  await page.goto(`http://127.0.0.1:5173/roles/${superAdminRole.id}`, { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1200));
  await takeScreenshot('phase2_role_permissions_detail_1280px.png');

  // Open "Configure All Permissions" modal (Sl 14)
  const allBtns = await page.$$('button');
  for (const b of allBtns) {
    const txt = await (await b.getProperty('textContent')).jsonValue();
    if (txt.includes('Configure All')) {
      await b.click();
      await new Promise((r) => setTimeout(r, 600));
      await takeScreenshot('phase2_role_bulk_permissions_modal.png');
      break;
    }
  }

  // --------------------------------------------------------------------------
  // Phase 2: Departments List Screen (Sl 171)
  // --------------------------------------------------------------------------
  console.log('Loading Departments screen...');
  await page.goto('http://127.0.0.1:5173/departments', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1200));
  await takeScreenshot('phase2_departments_list_1280px.png');

  // --------------------------------------------------------------------------
  // Phase 2: Permissions List Screen (Sl 18)
  // --------------------------------------------------------------------------
  console.log('Loading Permissions inventory screen...');
  await page.goto('http://127.0.0.1:5173/permissions', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1200));
  await takeScreenshot('phase2_permissions_list_1280px.png');

  console.log('All proofs and Phase 2 screenshots captured successfully!');
  await browser.close();
}

main().catch((err) => {
  console.error('Error during proof capture:', err);
  process.exit(1);
});
