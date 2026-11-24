import puppeteer from 'puppeteer-core';
import axios from 'axios';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://127.0.0.1:5000';
const FRONTEND_URL = 'http://127.0.0.1:5173';

async function main() {
  await axios.post(`${BASE_URL}/api/auth/send-otp`, { email: 'srihari8489@gmail.com' });
  const authRes = await axios.post(`${BASE_URL}/api/auth/verify-otp`, {
    email: 'srihari8489@gmail.com',
    otp: '123456',
  });
  const data = authRes.data?.data || authRes.data;

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox'],
  });

  const page = await browser.newPage();
  page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', (err) => console.log('PAGE ERROR:', err.toString()));

  await page.goto(`${FRONTEND_URL}/login`, { waitUntil: 'networkidle2' });
  await page.evaluate(
    ({ aToken, rToken, u }) => {
      localStorage.setItem('slash_crm_access_token', aToken);
      localStorage.setItem('slash_crm_refresh_token', rToken);
      localStorage.setItem('slash_crm_user', JSON.stringify(u));
    },
    { aToken: data.accessToken, rToken: data.refreshToken || 'dummy', u: data.user }
  );

  console.log('\n--- Navigating to /admin/tasks ---');
  await page.goto(`${FRONTEND_URL}/admin/tasks`, { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 2000));
  const htmlTasks = await page.evaluate(() => document.body.innerText);
  console.log('Tasks Page Text snippet:', htmlTasks.substring(0, 300));

  console.log('\n--- Navigating to /admin/leads ---');
  await page.goto(`${FRONTEND_URL}/admin/leads`, { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 2000));
  const htmlLeads = await page.evaluate(() => document.body.innerText);
  console.log('Leads Page Text snippet:', htmlLeads.substring(0, 300));

  await browser.close();
}

main().catch(console.error);
