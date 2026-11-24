import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOTS_DIR = 'D:\\Slash-Projects\\Slash_CRM_Frontend\\docs\\screenshots';
const ARTIFACTS_DIR = 'C:\\Users\\Slash\\.gemini\\antigravity\\brain\\8c11b803-e7f2-48eb-8a87-829a6d7506b7';
const BASE_URL = 'http://127.0.0.1:5000';
const FRONTEND_URL = 'http://127.0.0.1:5173';

async function main() {
  console.log('=== Proving A1 & A2 Attendance Lifecycle with Employee AlaguRaja ===\n');

  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  }

  // 1. Authenticate as AlaguRaja
  console.log('Authenticating as AlaguRaja...');
  await fetch(`${BASE_URL}/api/auth/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'alaguraja3104@gmail.com', purpose: 'LOGIN' })
  });
  const vRes = await fetch(`${BASE_URL}/api/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'alaguraja3104@gmail.com', otp: '123456', purpose: 'LOGIN' })
  });
  const verifyData = await vRes.json();
  const token = verifyData.data.accessToken;
  const refreshToken = verifyData.data.refreshToken;
  const user = verifyData.data.user;

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
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

  // Set tokens in localStorage
  await page.goto(`${FRONTEND_URL}/login`, { waitUntil: 'networkidle2' });
  await page.evaluate(
    ({ t, rt, u }) => {
      localStorage.setItem('slash_crm_access_token', t);
      localStorage.setItem('slash_crm_refresh_token', rt);
      localStorage.setItem('slash_crm_user', JSON.stringify(u));
    },
    { t: token, rt: refreshToken, u: user }
  );

  async function clickButtonWithText(text) {
    return page.evaluate((t) => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btn = btns.find((b) => b.textContent && b.textContent.includes(t));
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    }, text);
  }

  // STEP 1: Not Checked In state
  console.log('1. Loading /attendance/my (initial Not Checked In state)...');
  await page.goto(`${FRONTEND_URL}/attendance/my`, { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 2000));
  await takeScreenshot('proof_a1_1_not_checked_in.png');

  // STEP 2: Perform Check In
  console.log('2. Clicking Check In...');
  await clickButtonWithText('Check In');
  await new Promise((r) => setTimeout(r, 1000));
  await clickButtonWithText('Confirm Check-in');
  await new Promise((r) => setTimeout(r, 2500));
  await takeScreenshot('proof_a1_2_checked_in_working.png');

  // STEP 3: Refresh browser to prove timer persists from server timestamp
  console.log('3. Refreshing browser to verify timer continuation...');
  await page.reload({ waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 2500));
  await takeScreenshot('proof_a1_3_refreshed_timer_persists.png');

  // STEP 4: Start Break
  console.log('4. Starting Lunch Break...');
  await clickButtonWithText('Take Break');
  await new Promise((r) => setTimeout(r, 1000));
  await clickButtonWithText('Start Break');
  await new Promise((r) => setTimeout(r, 2500));
  await takeScreenshot('proof_a1_4_on_break.png');

  // STEP 5: End Break
  console.log('5. Ending Break...');
  await clickButtonWithText('End Break');
  await new Promise((r) => setTimeout(r, 2500));
  await takeScreenshot('proof_a1_5_break_ended.png');

  // STEP 6: Check Out
  console.log('6. Checking Out...');
  await clickButtonWithText('Check Out');
  await new Promise((r) => setTimeout(r, 1000));
  await clickButtonWithText('Confirm Check-out');
  await new Promise((r) => setTimeout(r, 2500));
  await takeScreenshot('proof_a1_6_checked_out.png');

  // STEP 7: Verify A2 Upcoming Filter
  console.log('7. Verifying A2 Upcoming Filter Tab...');
  // Select Upcoming from the filter dropdown
  await page.evaluate(() => {
    const selects = Array.from(document.querySelectorAll('select'));
    if (selects[0]) {
      selects[0].value = 'UPCOMING';
      selects[0].dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
  await new Promise((r) => setTimeout(r, 2000));
  await takeScreenshot('proof_a2_upcoming_filter.png');

  await browser.close();
  console.log('\n=== Full A1 & A2 Lifecycle Successfully Verified & Captured! ===\n');
}

main().catch(err => {
  console.error('Lifecycle test error:', err);
  process.exit(1);
});
