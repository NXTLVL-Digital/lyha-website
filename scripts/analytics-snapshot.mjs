// Monthly GA4 snapshot for lynchburgyouthhockey.com.
// Pulls visitor totals, interest by program (page-path buckets), and event
// counts from the GA4 Data API, writes data/analytics-snapshots/YYYY-MM.json,
// and rebuilds docs/analytics/TRENDS.md across all saved months.
//
// Env: GA4_OAUTH_CLIENT_ID, GA4_OAUTH_CLIENT_SECRET, GA4_OAUTH_REFRESH_TOKEN,
//      GA4_PROPERTY_ID (numeric).
// Args: --month YYYY-MM (optional; defaults to the previous full month).
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SNAP_DIR = join(ROOT, 'data', 'analytics-snapshots');
const TRENDS = join(ROOT, 'docs', 'analytics', 'TRENDS.md');

const { GA4_OAUTH_CLIENT_ID, GA4_OAUTH_CLIENT_SECRET, GA4_OAUTH_REFRESH_TOKEN, GA4_PROPERTY_ID } = process.env;
if (!GA4_OAUTH_CLIENT_ID || !GA4_OAUTH_CLIENT_SECRET || !GA4_OAUTH_REFRESH_TOKEN || !GA4_PROPERTY_ID) {
  console.error('Missing GA4_* environment configuration; cannot run.');
  process.exit(1);
}

const monthArg = process.argv.includes('--month')
  ? process.argv[process.argv.indexOf('--month') + 1]
  : null;

function previousMonth() {
  const now = new Date();
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
}
const month = monthArg || previousMonth();
const [y, m] = month.split('-').map(Number);
const startDate = `${month}-01`;
const endDate = new Date(Date.UTC(y, m, 0)).toISOString().slice(0, 10);

// Interest buckets, beginner programs first per the board's emphasis.
const CATEGORIES = [
  ['/learn-to-play/', 'Learn to Play', 'beginner'],
  ['/mites/', 'Mites (8U)', 'beginner'],
  ['/squirts/', 'Squirts (10U)', 'beginner'],
  ['/peewee/', 'Peewee (12U)', 'travel'],
  ['/bantams/', 'Bantams (14U)', 'travel'],
  ['/u16/', 'U16', 'travel'],
  ['/updates/', 'Updates', 'org'],
  ['/board/', 'Board', 'org'],
  ['/about/', 'About', 'org'],
  ['/faq/', 'FAQ', 'org'],
  ['/contact/', 'Contact', 'org'],
  ['/ice-time/', 'Ice Time', 'org'],
  ['/bylaws/', 'Bylaws', 'org'],
  ['/shop/', 'Shop', 'org'],
];
function bucket(path) {
  if (path === '/' || path === '/index.html') return ['Home', 'org'];
  for (const [prefix, name, group] of CATEGORIES) if (path.startsWith(prefix)) return [name, group];
  return ['Other', 'org'];
}

async function accessToken() {
  const r = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: GA4_OAUTH_CLIENT_ID,
      client_secret: GA4_OAUTH_CLIENT_SECRET,
      refresh_token: GA4_OAUTH_REFRESH_TOKEN,
      grant_type: 'refresh_token',
    }),
  });
  if (!r.ok) throw new Error(`token refresh failed: ${r.status} ${await r.text()}`);
  return (await r.json()).access_token;
}

async function runReport(token, body) {
  const r = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${GA4_PROPERTY_ID}:runReport`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ dateRanges: [{ startDate, endDate }], ...body }),
    }
  );
  if (!r.ok) throw new Error(`runReport failed: ${r.status} ${await r.text()}`);
  return r.json();
}

const num = (row, i) => Number(row.metricValues[i].value || 0);

const token = await accessToken();

// 1. Site totals.
const totalsRes = await runReport(token, {
  metrics: [
    { name: 'activeUsers' },
    { name: 'newUsers' },
    { name: 'sessions' },
    { name: 'screenPageViews' },
    { name: 'engagementRate' },
  ],
});
const tRow = totalsRes.rows?.[0];
const totals = tRow
  ? {
      activeUsers: num(tRow, 0),
      newUsers: num(tRow, 1),
      sessions: num(tRow, 2),
      pageViews: num(tRow, 3),
      engagementRate: Math.round(num(tRow, 4) * 1000) / 10,
    }
  : { activeUsers: 0, newUsers: 0, sessions: 0, pageViews: 0, engagementRate: 0 };

// 2. Interest by page path.
const pagesRes = await runReport(token, {
  dimensions: [{ name: 'pagePath' }],
  metrics: [{ name: 'screenPageViews' }, { name: 'activeUsers' }],
  limit: 250,
});
const interestMap = new Map();
for (const row of pagesRes.rows || []) {
  const [name, group] = bucket(row.dimensionValues[0].value);
  const cur = interestMap.get(name) || { category: name, group, views: 0, users: 0 };
  cur.views += num(row, 0);
  cur.users += num(row, 1);
  interestMap.set(name, cur);
}
const order = [...CATEGORIES.map(([, n]) => n), 'Home', 'Other'];
const interest = [...interestMap.values()].sort(
  (a, b) => order.indexOf(a.category) - order.indexOf(b.category)
);
const programViews = interest
  .filter((i) => i.group === 'beginner' || i.group === 'travel')
  .reduce((s, i) => s + i.views, 0);
for (const i of interest) {
  i.programShare =
    (i.group === 'beginner' || i.group === 'travel') && programViews
      ? Math.round((i.views / programViews) * 1000) / 10
      : null;
}

// 3. Event counts.
const eventsRes = await runReport(token, {
  dimensions: [{ name: 'eventName' }],
  metrics: [{ name: 'eventCount' }],
  limit: 100,
});
const events = (eventsRes.rows || [])
  .map((r) => ({ name: r.dimensionValues[0].value, count: num(r, 0) }))
  .sort((a, b) => b.count - a.count);

// 4. program_interest by program parameter (works once the custom
// dimension "program" is registered; tolerated if absent).
let programEvents = null;
try {
  const res = await runReport(token, {
    dimensions: [{ name: 'customEvent:program' }],
    metrics: [{ name: 'eventCount' }],
    dimensionFilter: {
      filter: { fieldName: 'eventName', stringFilter: { value: 'program_interest' } },
    },
  });
  programEvents = (res.rows || [])
    .map((r) => ({ program: r.dimensionValues[0].value, count: num(r, 0) }))
    .filter((r) => r.program && r.program !== '(not set)');
} catch {
  programEvents = null;
}

const snapshot = { month, startDate, endDate, generatedBy: 'analytics-snapshot workflow', totals, interest, events, programEvents };
mkdirSync(SNAP_DIR, { recursive: true });
writeFileSync(join(SNAP_DIR, `${month}.json`), JSON.stringify(snapshot, null, 2) + '\n');

// Rebuild TRENDS.md across every saved month.
const months = readdirSync(SNAP_DIR)
  .filter((f) => /^\d{4}-\d{2}\.json$/.test(f))
  .sort()
  .map((f) => JSON.parse(readFileSync(join(SNAP_DIR, f), 'utf8')));

const PROGRAMS = ['Learn to Play', 'Mites (8U)', 'Squirts (10U)', 'Peewee (12U)', 'Bantams (14U)', 'U16'];
let md = `# Website Interest Trends\n\nRegenerated by the monthly analytics snapshot. Interest share = a program page's share of all program-page views that month. Beginner programs (Learn to Play, Mites 8U, Squirts 10U) lead each table per board emphasis.\n\n## Program interest share by month\n\n| Month | ${PROGRAMS.join(' | ')} |\n|---|${PROGRAMS.map(() => '---|').join('')}\n`;
for (const s of months) {
  const cells = PROGRAMS.map((p) => {
    const row = s.interest.find((i) => i.category === p);
    return row && row.programShare !== null ? `${row.programShare}%` : '-';
  });
  md += `| ${s.month} | ${cells.join(' | ')} |\n`;
}
md += `\n## Site totals by month\n\n| Month | Visitors | New | Sessions | Page views | Engagement |\n|---|---|---|---|---|---|\n`;
for (const s of months) {
  md += `| ${s.month} | ${s.totals.activeUsers} | ${s.totals.newUsers} | ${s.totals.sessions} | ${s.totals.pageViews} | ${s.totals.engagementRate}% |\n`;
}
md += `\n## Key actions by month\n\n| Month | Leads (form) | Register CTA clicks | Email clicks | Form engaged | PDF downloads |\n|---|---|---|---|---|---|\n`;
const ev = (s, n) => s.events.find((e) => e.name === n)?.count ?? 0;
for (const s of months) {
  md += `| ${s.month} | ${ev(s, 'generate_lead')} | ${ev(s, 'register_cta_click')} | ${ev(s, 'email_click')} | ${ev(s, 'contact_form_engaged')} | ${ev(s, 'file_download')} |\n`;
}
mkdirSync(dirname(TRENDS), { recursive: true });
writeFileSync(TRENDS, md);

console.log(`Snapshot written for ${month}: ${totals.activeUsers} visitors, ${interest.length} interest buckets, ${events.length} event types.`);
