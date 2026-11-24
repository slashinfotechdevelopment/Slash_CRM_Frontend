import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOTS_DIR = 'D:\\Slash-Projects\\Slash_CRM_Frontend\\docs\\screenshots';
const ARTIFACTS_DIR = 'C:\\Users\\Slash\\.gemini\\antigravity\\brain\\8c11b803-e7f2-48eb-8a87-829a6d7506b7';
const BASE_URL = 'http://localhost:5000';
const FRONTEND_URL = 'http://127.0.0.1:5173';

async function main() {
  console.log('=== Capturing Department Lifecycle Proofs ===\n');

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
  await page.setViewport({ width: 1280, height: 850 });

  async function takeScreenshot(filename) {
    const p1 = path.join(SCREENSHOTS_DIR, filename);
    const p2 = path.join(ARTIFACTS_DIR, filename);
    await page.screenshot({ path: p1, fullPage: false });
    fs.copyFileSync(p1, p2);
    console.log(`✓ Saved screenshot: ${filename}`);
  }

  // Set tokens in browser
  await page.goto(`${FRONTEND_URL}/login`, { waitUntil: 'networkidle2' });
  await page.evaluate(
    ({ t, rt, u }) => {
      localStorage.setItem('slash_crm_access_token', t);
      localStorage.setItem('slash_crm_refresh_token', rt);
      localStorage.setItem('slash_crm_user', JSON.stringify(u));
    },
    { t: token, rt: refreshToken, u: user }
  );

  // 1. Initial State: GET /api/departments (6 authentic departments)
  console.log('1. Loading initial Departments list screen...');
  await page.goto(`${FRONTEND_URL}/departments`, { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1500));
  await takeScreenshot('phase2_departments_list_1280px.png');

  // 2. Step 1: Create department via UI
  console.log('\n2. Step 1: Opening Create Department modal in UI...');
  const allDeptBtns = await page.$$('button');
  for (const b of allDeptBtns) {
    const text = await (await b.getProperty('textContent')).jsonValue();
    if (text.includes('Create Department')) {
      await b.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 800));

  await page.type('form input[placeholder="e.g. MARKETING"]', 'GROWTH_OPS');
  await page.type('form input[placeholder="e.g. Marketing & Communications"]', 'Growth Operations');
  await page.type('form textarea[placeholder="Operational scope of this department..."]', 'Customer growth and acquisition team');

  console.log('Submitting Create Department form...');
  const submitBtn = await page.$('form button[type="submit"]');
  if (submitBtn) {
    await submitBtn.click();
  }
  await new Promise((r) => setTimeout(r, 2000));
  await takeScreenshot('proof_dept_step1_created.png');

  // 3. Step 2: Edit department via UI
  console.log('\n3. Step 2: Opening Edit Department modal in UI...');
  const rows = await page.$$('tr');
  for (const row of rows) {
    const text = await (await row.getProperty('textContent')).jsonValue();
    if (text.includes('GROWTH_OPS')) {
      const editBtn = await row.$('button[title*="Edit"]');
      if (editBtn) {
        await editBtn.click();
        break;
      }
    }
  }
  await new Promise((r) => setTimeout(r, 1000));

  // Change name input inside form
  const editNameInput = await page.$('form input');
  if (editNameInput) {
    await editNameInput.click({ clickCount: 3 });
    await page.keyboard.press('Backspace');
    await editNameInput.type('Growth & Global Marketing');
  }
  await new Promise((r) => setTimeout(r, 500));

  console.log('Submitting Edit Department form...');
  const saveBtn = await page.$('form button[type="submit"]');
  if (saveBtn) {
    await saveBtn.click();
  }
  await new Promise((r) => setTimeout(r, 2000));
  await takeScreenshot('proof_dept_step2_edited.png');

  // 4. Step 3: Deactivate department via UI ConfirmDialog
  console.log('\n4. Step 3: Triggering Deactivate Department ConfirmDialog in UI...');
  const rowsAfterEdit = await page.$$('tr');
  for (const row of rowsAfterEdit) {
    const text = await (await row.getProperty('textContent')).jsonValue();
    if (text.includes('GROWTH_OPS')) {
      const deactBtn = await row.$('button[title*="Delete"]');
      if (deactBtn) {
        await deactBtn.click();
        break;
      }
    }
  }
  await new Promise((r) => setTimeout(r, 1000));

  // Screenshot of the active danger ConfirmDialog modal
  await takeScreenshot('proof_dept_step3_deactivate_confirm_modal.png');

  console.log('Clicking "Deactivate Department" in ConfirmDialog modal...');
  const dialogBtns = await page.$$('div[role="dialog"] button');
  for (const b of dialogBtns) {
    const txt = await (await b.getProperty('textContent')).jsonValue();
    if (txt.includes('Deactivate Department')) {
      await b.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 2500));
  await takeScreenshot('proof_dept_step3_deactivated.png');

  await browser.close();

  // Purge from database if anything remains
  console.log('\n5. Final database cleanup check...');
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

  console.log('=== Department Lifecycle Proofs Completed Successfully ===\n');
}

main().catch((err) => {
  console.error('Error in lifecycle capture:', err);
  process.exit(1);
});
