import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOTS_DIR = 'D:\\Slash-Projects\\Slash_CRM_Frontend\\docs\\screenshots';
const ARTIFACTS_DIR = 'C:\\Users\\Slash\\.gemini\\antigravity\\brain\\8c11b803-e7f2-48eb-8a87-829a6d7506b7';
const BASE_URL = 'http://localhost:5000';
const FRONTEND_URL = 'http://127.0.0.1:5173';

async function main() {
  console.log('=== Capturing Phase 3 Users Module Proof Screenshots ===\n');

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

  // Retrieve an existing employee user for detail view
  const usersRes = await fetch(`${BASE_URL}/api/users?limit=10`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const usersJson = await usersRes.json();
  const testUser = usersJson.data.items.find((u) => u.userType?.code === 'EMPLOYEE') || usersJson.data.items[1];
  console.log(`Target detail user: id=${testUser.id}, name=${testUser.name}, code=${testUser.userCode}`);

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

  // Set auth tokens in localStorage
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
  // 1. Users List at 1280px (Desktop)
  // -------------------------------------------------------------
  console.log('\nCapturing Users List at 1280px...');
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto(`${FRONTEND_URL}/users`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('h1');
  await new Promise((r) => setTimeout(r, 1500));
  await takeScreenshot('phase3_users_list_1280px.png');

  // -------------------------------------------------------------
  // 2. Users List at 768px (Tablet Cards)
  // -------------------------------------------------------------
  console.log('\nCapturing Users List at 768px...');
  await page.setViewport({ width: 768, height: 1024 });
  await page.reload({ waitUntil: 'networkidle2' });
  await page.waitForSelector('h1');
  await new Promise((r) => setTimeout(r, 1500));
  await takeScreenshot('phase3_users_list_768px.png');

  // -------------------------------------------------------------
  // 3. Users List at 360px (Mobile Cards)
  // -------------------------------------------------------------
  console.log('\nCapturing Users List at 360px...');
  await page.setViewport({ width: 360, height: 740 });
  await page.reload({ waitUntil: 'networkidle2' });
  await page.waitForSelector('h1');
  await new Promise((r) => setTimeout(r, 1500));
  await takeScreenshot('phase3_users_list_360px.png');

  // Reset to 1280px for modals and detail views
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto(`${FRONTEND_URL}/users`, { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1000));

  // -------------------------------------------------------------
  // 4. Create User Modal Open
  // -------------------------------------------------------------
  console.log('\nCapturing Create User Modal...');
  const createBtn = await page.waitForSelector('button ::-p-text(Create User)');
  await createBtn.click();
  await page.waitForSelector('h3 ::-p-text(Create New User Account)');
  await new Promise((r) => setTimeout(r, 800));
  await takeScreenshot('phase3_create_user_modal.png');

  // Close create modal
  const closeBtn = await page.waitForSelector('button ::-p-text(Cancel)');
  await closeBtn.click();
  await new Promise((r) => setTimeout(r, 500));

  // -------------------------------------------------------------
  // 5. User Detail Page at 1280px (Desktop)
  // -------------------------------------------------------------
  console.log('\nCapturing User Detail Page at 1280px...');
  await page.goto(`${FRONTEND_URL}/users/${testUser.id}`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('h1');
  await new Promise((r) => setTimeout(r, 1500));
  await takeScreenshot('phase3_user_detail_1280px.png');

  // -------------------------------------------------------------
  // 6. User Detail Page at 768px (Tablet)
  // -------------------------------------------------------------
  console.log('\nCapturing User Detail Page at 768px...');
  await page.setViewport({ width: 768, height: 1024 });
  await page.reload({ waitUntil: 'networkidle2' });
  await page.waitForSelector('h1');
  await new Promise((r) => setTimeout(r, 1500));
  await takeScreenshot('phase3_user_detail_768px.png');

  // -------------------------------------------------------------
  // 7. User Detail Page at 360px (Mobile)
  // -------------------------------------------------------------
  console.log('\nCapturing User Detail Page at 360px...');
  await page.setViewport({ width: 360, height: 740 });
  await page.reload({ waitUntil: 'networkidle2' });
  await page.waitForSelector('h1');
  await new Promise((r) => setTimeout(r, 1500));
  await takeScreenshot('phase3_user_detail_360px.png');

  // Reset to 1280px for remaining modals on Detail Page
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto(`${FRONTEND_URL}/users/${testUser.id}`, { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1000));

  // -------------------------------------------------------------
  // 8. Edit User Modal
  // -------------------------------------------------------------
  console.log('\nCapturing Edit User Modal...');
  const editBtn = await page.waitForSelector('button ::-p-text(Edit Profile)');
  await editBtn.click();
  await page.waitForSelector('h3 ::-p-text(Edit User Profile)');
  await new Promise((r) => setTimeout(r, 800));
  await takeScreenshot('phase3_edit_user_modal.png');

  const closeEditBtn = await page.waitForSelector('button ::-p-text(Cancel)');
  await closeEditBtn.click();
  await new Promise((r) => setTimeout(r, 500));

  // -------------------------------------------------------------
  // 9. Change Status Modal (with Reason)
  // -------------------------------------------------------------
  console.log('\nCapturing Change Status Modal...');
  const statusBtn = await page.waitForSelector('button ::-p-text(Change Status)');
  await statusBtn.click();
  await page.waitForSelector('h3 ::-p-text(Change Account Status)');
  // Type a sample justification reason into the textarea
  await page.type('textarea', 'Staff leave of absence requested for academic quarter');
  await new Promise((r) => setTimeout(r, 800));
  await takeScreenshot('phase3_change_status_modal.png');

  const closeStatusBtn = await page.waitForSelector('button ::-p-text(Cancel)');
  await closeStatusBtn.click();
  await new Promise((r) => setTimeout(r, 500));

  // -------------------------------------------------------------
  // 10. Replace Roles Modal
  // -------------------------------------------------------------
  console.log('\nCapturing Replace Roles Modal...');
  const replaceRolesBtn = await page.waitForSelector('button ::-p-text(Replace Roles)');
  await replaceRolesBtn.click();
  await page.waitForSelector('h3 ::-p-text(Replace Assigned Roles)');
  await new Promise((r) => setTimeout(r, 800));
  await takeScreenshot('phase3_replace_roles_modal.png');

  const closeRolesBtn = await page.waitForSelector('button ::-p-text(Cancel)');
  await closeRolesBtn.click();
  await new Promise((r) => setTimeout(r, 500));

  // -------------------------------------------------------------
  // 11. Manage Departments Modal
  // -------------------------------------------------------------
  console.log('\nCapturing Manage Departments Modal...');
  // Click Departments Tab
  const deptsTab = await page.waitForSelector('button ::-p-text(Departments)');
  await deptsTab.click();
  await new Promise((r) => setTimeout(r, 600));

  const configDeptsBtn = await page.waitForSelector('button ::-p-text(Configure Departments)');
  await configDeptsBtn.click();
  await page.waitForSelector('h3 ::-p-text(Configure User Departments)');
  await new Promise((r) => setTimeout(r, 800));
  await takeScreenshot('phase3_manage_departments_modal.png');

  const closeDeptsBtn = await page.waitForSelector('button ::-p-text(Cancel)');
  await closeDeptsBtn.click();
  await new Promise((r) => setTimeout(r, 500));

  // -------------------------------------------------------------
  // 12. Permission Overrides Modal
  // -------------------------------------------------------------
  console.log('\nCapturing Permission Overrides Modal...');
  // Click Roles & Permissions Tab
  const permsTab = await page.waitForSelector('button ::-p-text(Roles & Permissions)');
  await permsTab.click();
  await new Promise((r) => setTimeout(r, 600));

  const configPermsBtn = await page.waitForSelector('button ::-p-text(Configure Permission Overrides)');
  await configPermsBtn.click();
  await page.waitForSelector('h3 ::-p-text(Manage Permission Overrides)');
  await new Promise((r) => setTimeout(r, 800));
  await takeScreenshot('phase3_permission_override_modal.png');

  const closePermsBtn = await page.waitForSelector('button ::-p-text(Cancel)');
  await closePermsBtn.click();
  await new Promise((r) => setTimeout(r, 500));

  await browser.close();
  console.log('\n=== All Phase 3 Screenshots Captured and Synced to Artifacts Successfully! ===\n');
}

main();
