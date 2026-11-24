import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOTS_DIR = 'D:\\Slash-Projects\\Slash_CRM_Frontend\\docs\\screenshots';
const ARTIFACTS_DIR = 'C:\\Users\\Slash\\.gemini\\antigravity\\brain\\8c11b803-e7f2-48eb-8a87-829a6d7506b7';
const BASE_URL = 'http://localhost:5000';
const FRONTEND_URL = 'http://127.0.0.1:5173';

async function main() {
  console.log('=== Capturing Phase 2 Remediation Proofs ===\n');

  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  }

  // 1. Authenticate against live backend
  console.log('1. Authenticating as Super Admin...');
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
  console.log('Authenticated as:', user.name, user.email, user.userType);

  // Fetch Super Admin role id
  const rolesRes = await fetch(`${BASE_URL}/api/roles`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const rolesJson = await rolesRes.json();
  const superAdminRole = rolesJson.data.items.find((r) => r.code === 'SUPER_ADMIN') || rolesJson.data.items[0];
  console.log('Super Admin Role ID:', superAdminRole.id);

  console.log('\n2. Launching Chrome...');
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

  // Set session tokens in browser localStorage
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
  // PROOF 1: Roles List Screen (1280px, 768px, 360px)
  // -------------------------------------------------------------
  console.log('\n3. Navigating to Roles List screen (/roles)...');
  await page.goto(`${FRONTEND_URL}/roles`, { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1500));

  // Desktop (1280px)
  await page.setViewport({ width: 1280, height: 850 });
  await takeScreenshot('phase2_roles_list_1280px.png');

  // Tablet (768px) - Content side-by-side, docked sidebar
  await page.setViewport({ width: 768, height: 1024 });
  await new Promise((r) => setTimeout(r, 500));
  await takeScreenshot('phase2_roles_list_768px.png');

  // Mobile (360px) - Aligned 2-column cards, code under name
  await page.setViewport({ width: 360, height: 800 });
  await new Promise((r) => setTimeout(r, 500));
  await takeScreenshot('phase2_roles_list_360px.png');

  // -------------------------------------------------------------
  // PROOF 2: Role Detail & Assigned Permissions Screen (/roles/:id)
  // -------------------------------------------------------------
  console.log('\n4. Navigating to Role Details screen (/roles/:id)...');
  await page.setViewport({ width: 1280, height: 950 });
  await page.goto(`${FRONTEND_URL}/roles/${superAdminRole.id}`, { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 2000));
  await takeScreenshot('phase2_role_permissions_detail_1280px.png');

  // Open "Configure All Permissions" modal (Sl 14)
  const buttons = await page.$$('button');
  for (const b of buttons) {
    const text = await (await b.getProperty('textContent')).jsonValue();
    if (text.includes('Configure All')) {
      await b.click();
      await new Promise((r) => setTimeout(r, 800));
      await takeScreenshot('phase2_role_bulk_permissions_modal.png');
      // Close modal
      const closeBtn = await page.$('button[aria-label="Close dialog"]');
      if (closeBtn) await closeBtn.click();
      await new Promise((r) => setTimeout(r, 500));
      break;
    }
  }

  // -------------------------------------------------------------
  // PROOF 3: Departments Screen & Full Interactive Lifecycle
  // -------------------------------------------------------------
  console.log('\n5. Navigating to Departments screen (/departments)...');
  await page.setViewport({ width: 1280, height: 850 });
  await page.goto(`${FRONTEND_URL}/departments`, { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1500));
  await takeScreenshot('phase2_departments_list_1280px.png');

  // Step 3a: Create Department via UI
  console.log('Executing Department Lifecycle Step 1: Create in UI...');
  const allDeptBtns = await page.$$('button');
  for (const b of allDeptBtns) {
    const text = await (await b.getProperty('textContent')).jsonValue();
    if (text.includes('Create Department')) {
      await b.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 600));

  // Fill in create form with real placeholders
  await page.type('input[placeholder="e.g. MARKETING"]', 'GROWTH_OPS');
  await page.type('input[placeholder="e.g. Marketing & Communications"]', 'Growth Operations');
  await page.type('textarea[placeholder="Operational scope of this department..."]', 'Customer growth and acquisition team');

  // Submit form
  const submitBtns = await page.$$('button[type="submit"]');
  if (submitBtns.length > 0) {
    await submitBtns[submitBtns.length - 1].click();
  }
  await new Promise((r) => setTimeout(r, 2000));
  await takeScreenshot('proof_dept_step1_created.png');

  // Step 3b: Edit Department via UI
  console.log('Executing Department Lifecycle Step 2: Edit in UI...');
  await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('tr'));
    const growthRow = rows.find((r) => r.textContent?.includes('GROWTH_OPS'));
    if (growthRow) {
      const editBtn = growthRow.querySelector('button[title*="Edit"]');
      if (editBtn) editBtn.click();
    }
  });
  await new Promise((r) => setTimeout(r, 800));

  // Change name to "Growth & Global Marketing"
  await page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll('input'));
    const nameInput = inputs.find((i) => i.value === 'Growth Operations' || i.value?.includes('Growth'));
    if (nameInput) {
      nameInput.value = 'Growth & Global Marketing';
      nameInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
  });

  const editSubmitBtns = await page.$$('button[type="submit"]');
  if (editSubmitBtns.length > 0) {
    await editSubmitBtns[editSubmitBtns.length - 1].click();
  }
  await new Promise((r) => setTimeout(r, 2000));
  await takeScreenshot('proof_dept_step2_edited.png');

  // Step 3c: Deactivate Department via UI
  console.log('Executing Department Lifecycle Step 3: Deactivate in UI...');
  await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('tr'));
    const growthRow = rows.find((r) => r.textContent?.includes('GROWTH_OPS'));
    if (growthRow) {
      const deleteBtn = growthRow.querySelector('button[title*="Deactivate"]');
      if (deleteBtn) deleteBtn.click();
    }
  });
  await new Promise((r) => setTimeout(r, 800));

  // Inside danger ConfirmDialog, click the confirm button
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const deactBtn = btns.find((b) => b.textContent?.trim() === 'Deactivate Department');
    if (deactBtn) deactBtn.click();
  });
  await new Promise((r) => setTimeout(r, 2000));
  await takeScreenshot('proof_dept_step3_deactivated.png');

  // Step 4: Permissions Inventory Screen
  console.log('\n6. Navigating to Permissions inventory screen (/permissions)...');
  await page.goto(`${FRONTEND_URL}/permissions`, { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1500));
  await takeScreenshot('phase2_permissions_list_1280px.png');

  // Database cleanup of test department GROWTH_OPS
  console.log('\nCleaning up GROWTH_OPS from database...');
  try {
    const checkDepts = await fetch(`${BASE_URL}/api/departments`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const checkJson = await checkDepts.json();
    const items = checkJson.data?.data || checkJson.data?.items || [];
    const testDept = items.find((d) => d.code === 'GROWTH_OPS');
    if (testDept) {
      await fetch(`${BASE_URL}/api/departments/${testDept.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
    }
  } catch (e) {
    console.error('Error during cleanup:', e);
  }

  // -------------------------------------------------------------
  // PROOF 4: Permissions Inventory Screen
  // -------------------------------------------------------------
  console.log('\n6. Navigating to Permissions inventory screen (/permissions)...');
  await page.goto(`${FRONTEND_URL}/permissions`, { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1500));
  await takeScreenshot('phase2_permissions_list_1280px.png');

  await browser.close();
  console.log('\nAll proofs and remediation screenshots captured successfully!');
}

main().catch((err) => {
  console.error('Error during proof capture:', err);
  process.exit(1);
});
