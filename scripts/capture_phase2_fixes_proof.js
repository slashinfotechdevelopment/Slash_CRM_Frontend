import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOTS_DIR = 'D:\\Slash-Projects\\Slash_CRM_Frontend\\docs\\screenshots';
const ARTIFACTS_DIR = 'C:\\Users\\Slash\\.gemini\\antigravity\\brain\\8c11b803-e7f2-48eb-8a87-829a6d7506b7';
const BASE_URL = 'http://localhost:5000';
const FRONTEND_URL = 'http://127.0.0.1:5173';

async function main() {
  console.log('=== Capturing Phase 2 Fixes Proofs ===\n');

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

  // Retrieve CA role ID
  const rolesRes = await fetch(`${BASE_URL}/api/roles`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const rolesJson = await rolesRes.json();
  const caRole = rolesJson.data.items.find((r) => r.code === 'CA');
  console.log(`Found CA role: id=${caRole.id}, name=${caRole.name}, isSystem=${caRole.isSystem}`);

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
  // FIX 2: Tablet (768px) Card Views for Roles, Permissions, Departments
  // -------------------------------------------------------------
  console.log('\n--- Capturing Fix 2: 768px Tablet Views (< 1024px) ---');
  await page.setViewport({ width: 768, height: 1024 });

  // 1. Roles at 768px (Cards with status, users, actions visible)
  await page.goto(`${FRONTEND_URL}/roles`, { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1200));
  await takeScreenshot('proof_fix2_roles_768px_cards.png');
  await takeScreenshot('phase2_roles_list_768px.png');

  // 2. Permissions at 768px
  await page.goto(`${FRONTEND_URL}/permissions`, { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1200));
  await takeScreenshot('proof_fix2_permissions_768px_cards.png');

  // 3. Departments at 768px
  await page.goto(`${FRONTEND_URL}/departments`, { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1200));
  await takeScreenshot('proof_fix2_departments_768px_cards.png');

  // -------------------------------------------------------------
  // FIX 3: CA Role (Non-protected) Permissions Management (Sl 14, 15, 16)
  // -------------------------------------------------------------
  console.log('\n--- Capturing Fix 3: Non-Protected Role (CA) ---');
  await page.setViewport({ width: 1280, height: 850 });
  await page.goto(`${FRONTEND_URL}/roles/${caRole.id}`, { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1200));

  // (a) Open Add Permission Modal (Sl 15)
  console.log('Opening Add Permission Modal for CA...');
  const addPermBtn = await page.$('button');
  const allBtns = await page.$$('button');
  for (const b of allBtns) {
    const text = await (await b.getProperty('textContent')).jsonValue();
    if (text.includes('Add Permission')) {
      await b.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 600));
  await takeScreenshot('proof_fix3_ca_role_add_permission_modal.png');

  // Select a permission from dropdown and submit
  await page.evaluate(() => {
    const select = document.querySelector('form select');
    if (select && select.options.length > 1) {
      select.selectedIndex = 1;
      select.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
  await new Promise((r) => setTimeout(r, 400));
  const submitAddPerm = await page.$('form button[type="submit"]');
  if (submitAddPerm) await submitAddPerm.click();
  await new Promise((r) => setTimeout(r, 1800));

  // (b) Screenshot of permission added in table
  await takeScreenshot('proof_fix3_ca_role_permission_added.png');

  // (c) Open Bulk "Configure All" modal (Sl 14)
  console.log('Opening Bulk Configure All Modal for CA...');
  const btnsAfterAdd = await page.$$('button');
  for (const b of btnsAfterAdd) {
    const text = await (await b.getProperty('textContent')).jsonValue();
    if (text.includes('Configure All')) {
      await b.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 800));
  await takeScreenshot('proof_fix3_ca_role_bulk_modal.png');

  // Close bulk modal
  const closeBulkBtn = await page.$('button[aria-label="Close dialog"]');
  if (closeBulkBtn) await closeBulkBtn.click();
  await new Promise((r) => setTimeout(r, 600));

  // (d) Trigger Danger ConfirmDialog for removing permission (Sl 16)
  console.log('Triggering Remove Permission ConfirmDialog...');
  const trashBtns = await page.$$('button[title*="Remove"]');
  if (trashBtns.length > 0) {
    await trashBtns[0].click();
    await new Promise((r) => setTimeout(r, 600));
    await takeScreenshot('proof_fix3_ca_role_remove_confirm_modal.png');

    // Confirm removal to clean up
    const confirmBtns = await page.$$('div[role="dialog"] button');
    for (const b of confirmBtns) {
      const txt = await (await b.getProperty('textContent')).jsonValue();
      if (txt.includes('Revoke Permission') || txt.includes('Remove')) {
        await b.click();
        break;
      }
    }
    await new Promise((r) => setTimeout(r, 1800));
  }
  console.log('Cleaned up added permission from CA role.');

  // -------------------------------------------------------------
  // FIX 1: Clean Department Edit Replacement Proof
  // -------------------------------------------------------------
  console.log('\n--- Capturing Fix 1: Clean Department Edit Replacement ---');
  await page.goto(`${FRONTEND_URL}/departments`, { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1200));

  // Create temporary dept TEST_OPS
  const createDeptBtns = await page.$$('button');
  for (const b of createDeptBtns) {
    const text = await (await b.getProperty('textContent')).jsonValue();
    if (text.includes('Create Department')) {
      await b.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 600));
  await page.type('form input[placeholder="e.g. MARKETING"]', 'TEST_OPS');
  await page.type('form input[placeholder="e.g. Marketing & Communications"]', 'Operations & Logistics');
  const createSubmit = await page.$('form button[type="submit"]');
  if (createSubmit) await createSubmit.click();
  await new Promise((r) => setTimeout(r, 1800));

  // Now Edit: Open edit modal and clearly REPLACE the name
  const deptRows = await page.$$('tr');
  for (const row of deptRows) {
    const text = await (await row.getProperty('textContent')).jsonValue();
    if (text.includes('TEST_OPS')) {
      const editBtn = await row.$('button[title*="Edit"]');
      if (editBtn) {
        await editBtn.click();
        break;
      }
    }
  }
  await new Promise((r) => setTimeout(r, 800));

  // Clear and type new name "Global Supply Chain"
  await page.evaluate(() => {
    const input = document.querySelector('form input');
    if (input) {
      const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      nativeSetter.call(input, '');
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  });
  const nameInput = await page.$('form input');
  if (nameInput) {
    await nameInput.type('Global Supply Chain');
  }
  await new Promise((r) => setTimeout(r, 400));

  const saveDept = await page.$('form button[type="submit"]');
  if (saveDept) await saveDept.click();
  await new Promise((r) => setTimeout(r, 2000));
  await takeScreenshot('proof_fix1_dept_edit_clean_replacement.png');

  // -------------------------------------------------------------
  // FIX 5: Department Deactivation Warning & Server Rejection Error
  // -------------------------------------------------------------
  console.log('\n--- Capturing Fix 5: Deactivation Warning & Server Error ---');

  // 5a. Warning Note in Dialog (on empty department TEST_OPS)
  const rowsBeforeDeact = await page.$$('tr');
  for (const row of rowsBeforeDeact) {
    const text = await (await row.getProperty('textContent')).jsonValue();
    if (text.includes('TEST_OPS')) {
      const deactBtn = await row.$('button[title*="Deactivate"]');
      if (deactBtn) {
        await deactBtn.click();
        break;
      }
    }
  }
  await new Promise((r) => setTimeout(r, 800));
  await takeScreenshot('proof_fix5_dept_deactivate_warning_dialog.png');

  // Cancel dialog
  const cancelBtn = await page.$('div[role="dialog"] button');
  if (cancelBtn) await cancelBtn.click();
  await new Promise((r) => setTimeout(r, 600));

  // 5b. Try deactivating Development (which has 13 active employees) -> Expect Server Rejection Error
  console.log('Attempting to deactivate Development department (has 13 active employees)...');
  const allRows = await page.$$('tr');
  for (const row of allRows) {
    const text = await (await row.getProperty('textContent')).jsonValue();
    if (text.includes('DEVELOPMENT')) {
      const deactBtn = await row.$('button[title*="Deactivate"]');
      if (deactBtn) {
        await deactBtn.click();
        break;
      }
    }
  }
  await new Promise((r) => setTimeout(r, 800));

  // Click confirm in the first dialog
  const confirmDeactDev = await page.$$('div[role="dialog"] button');
  for (const b of confirmDeactDev) {
    const txt = await (await b.getProperty('textContent')).jsonValue();
    if (txt.includes('Deactivate Department')) {
      await b.click();
      break;
    }
  }
  // Wait for server rejection error dialog to appear
  await new Promise((r) => setTimeout(r, 1800));
  await takeScreenshot('proof_fix5_dept_deactivation_server_rejected_error.png');

  // Dismiss error dialog
  const dismissBtn = await page.$$('div[role="dialog"] button');
  for (const b of dismissBtn) {
    const txt = await (await b.getProperty('textContent')).jsonValue();
    if (txt.includes('Dismiss')) {
      await b.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 600));

  // Cleanup TEST_OPS from backend
  const checkDepts = await fetch(`${BASE_URL}/api/departments`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const checkJson = await checkDepts.json();
  const items = checkJson.data?.data || checkJson.data?.items || [];
  const testDept = items.find((d) => d.code === 'TEST_OPS');
  if (testDept) {
    await fetch(`${BASE_URL}/api/departments/${testDept.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  // Also desktop roles polish screenshot
  await page.goto(`${FRONTEND_URL}/roles`, { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1200));
  await takeScreenshot('proof_fix6_roles_desktop_polish_1280px.png');

  await browser.close();
  console.log('\n=== All Fixes Proofs Captured Successfully! ===');
}

main().catch((err) => {
  console.error('Error during fixes capture:', err);
  process.exit(1);
});
