import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://127.0.0.1:5000';
const FRONTEND_URL = 'http://127.0.0.1:5173';

const ROUTES = [
  '/dashboard',
  '/roles',
  '/permissions',
  '/departments',
  '/users',
  '/attendance/my',
  '/attendance/team',
  '/attendance/shifts',
  '/attendance/wfh',
  '/attendance/overtime',
  '/attendance/corrections',
  '/attendance/anomalies',
  '/attendance/reconciliation',
  '/tasks',
  '/tasks/my',
  '/tasks/dashboards',
  '/tasks/reports',
  '/leads',
  '/leads/pipeline',
  '/leads/follow-ups',
  '/leave/my',
  '/leave/approvals',
  '/leave/balances',
  '/leave/calendar',
  '/leave/holidays',
  '/leave/setup',
  '/leave/reports',
  '/admin/activity',
  '/admin/tasks',
  '/admin/leads',
];

async function main() {
  console.log('=== Running A8: Network Request Hygiene & Duplicate Call Audit ===\n');

  // Authenticate as Super Admin
  await fetch(`${BASE_URL}/api/auth/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'srihari8489@gmail.com', purpose: 'LOGIN' })
  });
  const vRes = await fetch(`${BASE_URL}/api/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'srihari8489@gmail.com', otp: '123456', purpose: 'LOGIN' })
  });
  const { data } = await vRes.json();
  const token = data.accessToken;
  const refreshToken = data.refreshToken;
  const user = data.user;

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  await page.goto(`${FRONTEND_URL}/login`, { waitUntil: 'networkidle2' });
  await page.evaluate(
    ({ t, rt, u }) => {
      localStorage.setItem('slash_crm_access_token', t);
      localStorage.setItem('slash_crm_refresh_token', rt);
      localStorage.setItem('slash_crm_user', JSON.stringify(u));
    },
    { t: token, rt: refreshToken, u: user }
  );

  const results = [];
  let totalViolations = 0;

  for (const route of ROUTES) {
    console.log(`Auditing route: ${route}...`);
    const requests = [];
    const errors = [];

    const onRequest = (req) => {
      const url = req.url();
      if (url.includes('/api/')) {
        const cleanUrl = url.replace(/https?:\/\/[^/]+/, '');
        requests.push({ url: cleanUrl, method: req.method() });
      }
    };

    const onResponse = (res) => {
      const url = res.url();
      if (url.includes('/api/')) {
        const status = res.status();
        if (status >= 400) {
          errors.push({ url: url.replace(/https?:\/\/[^/]+/, ''), status });
        }
      }
    };

    page.on('request', onRequest);
    page.on('response', onResponse);

    await page.goto(`${FRONTEND_URL}${route}`, { waitUntil: 'networkidle2' });
    // Hold for 3 seconds to monitor ongoing polling or repeat loops
    await new Promise((r) => setTimeout(r, 3000));

    page.off('request', onRequest);
    page.off('response', onResponse);

    // Group calls by Method + Path (ignoring query timestamp/pagination if any)
    const counts = {};
    for (const req of requests) {
      if (req.method === 'OPTIONS') continue;
      const key = `${req.method} ${req.url.split('&_t=')[0]}`;
      counts[key] = (counts[key] || 0) + 1;
    }

    const duplicates = Object.entries(counts).filter(([_, count]) => count > 1);
    const hasViolations = duplicates.length > 0 || errors.length > 0;
    if (hasViolations) totalViolations++;

    results.push({
      route,
      totalApiCalls: requests.length,
      duplicates: duplicates.map(([k, c]) => `${k} (called ${c} times)`),
      errors: errors.map((e) => `${e.status} ${e.url}`),
      status: hasViolations ? 'WARNING/FAIL' : 'PASS',
    });
  }

  await browser.close();

  console.log('\n================================================================');
  console.log('                 REQUEST HYGIENE AUDIT REPORT                   ');
  console.log('================================================================');
  console.table(
    results.map((r) => ({
      Route: r.route,
      'Total Calls': r.totalApiCalls,
      Duplicates: r.duplicates.length > 0 ? r.duplicates.join(', ') : 'None',
      Errors: r.errors.length > 0 ? r.errors.join(', ') : 'None',
      Result: r.status,
    }))
  );

  console.log(`\nAudit Complete: ${results.length - totalViolations} / ${results.length} routes passed clean.`);
  if (totalViolations > 0) {
    console.warn(`\nIdentified ${totalViolations} route(s) needing duplicate call prevention.`);
  } else {
    console.log('\nAll routes have 100% clean request hygiene with ZERO duplicates and ZERO 4xx/5xx errors!');
  }
}

main().catch((err) => {
  console.error('Audit run error:', err);
  process.exit(1);
});
