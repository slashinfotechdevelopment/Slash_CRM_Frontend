import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOTS_DIR = 'D:\\Slash-Projects\\Slash_CRM_Frontend\\docs\\screenshots';
const ARTIFACTS_DIR = 'C:\\Users\\Slash\\.gemini\\antigravity\\brain\\8c11b803-e7f2-48eb-8a87-829a6d7506b7';
const BASE_URL = 'http://127.0.0.1:5000';
const FRONTEND_URL = 'http://127.0.0.1:5173';

async function main() {
  console.log('=== Capturing Phase 6 Leads & Pipeline Proof Screenshots ===\n');

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

  // Fetch first lead for detail page screenshot
  const leadsRes = await fetch(`${BASE_URL}/api/leads?limit=5`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const leadsData = await leadsRes.json();
  const firstLead = (leadsData.data?.items || leadsData.items)?.[0];
  const firstLeadId = firstLead?.id;
  console.log('Target lead for detail screenshot:', firstLead ? `${firstLead.leadCode} (${firstLead.id})` : 'None');

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

  // 1. Leads List Page - Desktop 1280px (Table View)
  console.log('\n1. Capturing Leads List (Desktop 1280px Table View)...');
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto(`${FRONTEND_URL}/leads`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('h1');
  await new Promise((r) => setTimeout(r, 1500));
  await takeScreenshot('proof_phase6_leads_list_1280px.png');

  // 2. Leads List Page - Kanban View (1280px)
  console.log('\n2. Capturing Leads List (Kanban View)...');
  const buttons = await page.$$('button');
  for (const btn of buttons) {
    const text = await page.evaluate((el) => el.innerText, btn);
    if (text && text.includes('Kanban')) {
      await btn.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 1500));
  await takeScreenshot('proof_phase6_leads_kanban_1280px.png');

  // Switch back to Table view
  const btnsBack = await page.$$('button');
  for (const btn of btnsBack) {
    const text = await page.evaluate((el) => el.innerText, btn);
    if (text && text.includes('Table')) {
      await btn.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 1000));

  // 3. Create Lead Modal
  console.log('\n3. Capturing Create Lead Modal...');
  const newLeadBtns = await page.$$('button');
  for (const btn of newLeadBtns) {
    const text = await page.evaluate((el) => el.innerText, btn);
    if (text && text.includes('New Lead')) {
      await btn.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 1000));
  await takeScreenshot('proof_phase6_leads_create_modal_1280px.png');

  // Close modal by clicking cancel or escape
  await page.keyboard.press('Escape');
  await new Promise((r) => setTimeout(r, 500));

  // 4. Lead Detail Page (1280px)
  if (firstLeadId) {
    console.log(`\n4. Capturing Lead Detail Page (/leads/${firstLeadId})...`);
    await page.goto(`${FRONTEND_URL}/leads/${firstLeadId}`, { waitUntil: 'networkidle2' });
    await page.waitForSelector('h1');
    await new Promise((r) => setTimeout(r, 1500));
    await takeScreenshot('proof_phase6_lead_detail_1280px.png');
  }

  // 5. Lead Pipeline Intelligence Page (1280px)
  console.log('\n5. Capturing Lead Pipeline Intelligence (/leads/pipeline)...');
  await page.goto(`${FRONTEND_URL}/leads/pipeline`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('h1');
  await new Promise((r) => setTimeout(r, 1500));
  await takeScreenshot('proof_phase6_lead_pipeline_1280px.png');

  // 6. Lead Follow-ups Page (1280px)
  console.log('\n6. Capturing My Follow-ups (/leads/follow-ups)...');
  await page.goto(`${FRONTEND_URL}/leads/follow-ups`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('h1');
  await new Promise((r) => setTimeout(r, 1500));
  await takeScreenshot('proof_phase6_lead_followups_1280px.png');

  // 7. Public Inquire Page (1280px)
  console.log('\n7. Capturing Public Inquiry Page (/inquire)...');
  await page.goto(`${FRONTEND_URL}/inquire`, { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1500));
  await takeScreenshot('proof_phase6_public_inquiry_1280px.png');

  // 8. Leads List - Tablet (768px)
  console.log('\n8. Capturing Leads List (Tablet 768px)...');
  await page.setViewport({ width: 768, height: 1024 });
  await page.goto(`${FRONTEND_URL}/leads`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('h1');
  await new Promise((r) => setTimeout(r, 1500));
  await takeScreenshot('proof_phase6_leads_list_768px.png');

  // 9. Leads List - Mobile (360px)
  console.log('\n9. Capturing Leads List (Mobile 360px)...');
  await page.setViewport({ width: 360, height: 740 });
  await page.goto(`${FRONTEND_URL}/leads`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('h1');
  await new Promise((r) => setTimeout(r, 1500));
  await takeScreenshot('proof_phase6_leads_list_360px.png');

  await browser.close();
  console.log('\n=== All Phase 6 Screenshots Captured Successfully! ===\n');
}

main().catch((err) => {
  console.error('Capture error:', err);
  process.exit(1);
});
