/* 用系統 Chrome 檢查財務總覽與排程監控。
   PUPPETEER_ROOT 指到已安裝 puppeteer-core 的目錄。例：
   PUPPETEER_ROOT=/tmp/fincheck node tests/browser_finance_check.mjs http://127.0.0.1:8765 */
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';

const require = createRequire(process.env.PUPPETEER_ROOT
  ? path.join(process.env.PUPPETEER_ROOT, 'package.json')
  : import.meta.url);
const puppeteer = require('puppeteer-core');

const base = process.argv[2] || 'http://127.0.0.1:8765';
const outDir = process.argv[3] || '/tmp/fin-shots';
fs.mkdirSync(outDir, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH || '/usr/local/bin/google-chrome',
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});
const page = await browser.newPage();
const errors = [];
page.on('pageerror', err => errors.push(String(err)));

async function shot(name) {
  await page.screenshot({ path: path.join(outDir, name), fullPage: false });
}

await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await page.goto(base + '/index.html', { waitUntil: 'networkidle0', timeout: 30000 });
await page.click('#tab-btn-finance');
await page.waitForSelector('[data-fin-value="assets"]');
const top = await page.$eval('[data-fin-value="assets"]', el => el.textContent);
if (!top.includes('10,346,300')) throw new Error('總資產不對：' + top);
const checks = await page.evaluate(() => ({
  debt: document.querySelector('[data-fin-value="debt"]').textContent,
  net: document.querySelector('[data-fin-value="net"]').textContent,
  liquid: document.querySelector('[data-fin-value="liquid"]').textContent,
  pay: document.querySelector('[data-fin-value="monthly-debt"]').textContent,
  premium: document.querySelector('[data-fin-value="monthly-premium"]').textContent,
  banner: document.querySelector('.fin-kicker').textContent,
  inputs: document.querySelectorAll('#tab-finance input').length,
}));
if (checks.debt.replace(/\s/g, '') !== '3,472,000TWD') throw new Error(JSON.stringify(checks));
if (!checks.net.includes('6,874,300')) throw new Error(checks.net);
if (!checks.liquid.includes('266,400')) throw new Error(checks.liquid);
if (!checks.pay.includes('24,400')) throw new Error(checks.pay);
if (!checks.premium.includes('8,000')) throw new Error(checks.premium);
if (checks.banner !== '示範資料，非本人財務') throw new Error(checks.banner);
if (checks.inputs !== 0) throw new Error('財務頁出現輸入欄');
await shot('desktop_finance_top.png');

await page.click('[data-fin-toggle="loan-credit"]');
await page.waitForSelector('#fin-detail-loan-credit');
const detail = await page.$eval('#fin-detail-loan-credit', el => el.innerText);
if (!detail.includes('不會再加一次')) throw new Error(detail);
await page.evaluate(() => document.getElementById('fin-detail-loan-credit').scrollIntoView({ block: 'center' }));
await shot('desktop_loan_detail.png');

await page.click('[data-fin-filter="loan"]');
const afterFilter = await page.evaluate(() => ({
  asset: !!document.querySelector('[data-fin-section="asset"]'),
  liability: !!document.querySelector('[data-fin-section="liability"]'),
  assets: document.querySelector('[data-fin-value="assets"]').textContent,
}));
if (afterFilter.asset || !afterFilter.liability) throw new Error(JSON.stringify(afterFilter));
if (!afterFilter.assets.includes('10,346,300')) throw new Error('篩選改到了總資產');

await page.click('[data-fin-filter="all"]');
await page.select('[data-fin-sort]', 'amount-desc');
const firstName = await page.$eval('[data-fin-section="asset"] .fin-name', el => el.textContent);
if (!firstName.includes('虛構住宅')) throw new Error('金額排序後第一筆不是住宅：' + firstName);

await page.click('[data-fin-mask]');
const masked = await page.$eval('[data-fin-value="assets"]', el => el.textContent);
if (masked.includes('10,346,300') || !masked.includes('••••')) throw new Error('隱藏失敗：' + masked);
await page.evaluate(() => window.scrollTo(0, 0));
await shot('desktop_amounts_hidden.png');
await page.click('[data-fin-mask]');

await page.click('#tab-btn-finance');
await page.evaluate(() => {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    if (btn.textContent.includes('排程監控')) btn.click();
  });
});
await page.waitForSelector('#mon-tbody td.mon-bot');
const monitor = await page.evaluate(() => {
  const bot = document.querySelector('#mon-tbody td.mon-bot');
  const name = document.querySelector('#mon-tbody td.mon-name');
  const td = document.querySelector('#mon-tbody td');
  const bots = [...document.querySelectorAll('#mon-tbody td.mon-bot')].map(cell => ({
    text: cell.innerText.trim(),
    rowspan: cell.rowSpan,
  }));
  return {
    rowspan: bot.rowSpan,
    textAlign: getComputedStyle(name).textAlign,
    whiteSpace: getComputedStyle(td).whiteSpace,
    nameWhiteSpace: getComputedStyle(name).whiteSpace,
    bots,
  };
});
if (monitor.rowspan < 2) throw new Error('Bot 沒有合併列：' + JSON.stringify(monitor));
if (monitor.textAlign !== 'right') throw new Error('任務欄沒有靠右：' + monitor.textAlign);
if (monitor.whiteSpace !== 'nowrap' || monitor.nameWhiteSpace !== 'nowrap') throw new Error('儲存格換行：' + JSON.stringify(monitor));
await shot('desktop_monitor.png');

await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
await page.click('#tab-btn-finance');
await page.waitForSelector('[data-fin-value="net"]');
await page.evaluate(() => window.scrollTo(0, 0));
await shot('mobile_finance_top.png');
await page.click('[data-fin-toggle="loan-usd"]');
await page.waitForSelector('#fin-detail-loan-usd');
await page.evaluate(() => document.getElementById('fin-detail-loan-usd').scrollIntoView({ block: 'center' }));
await shot('mobile_loan_detail.png');
const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
if (overflow) throw new Error('手機寬度出現整頁橫向捲動');

for (const href of ['/finance_overview.html', '/preview/finance_overview_standalone.html']) {
  await page.goto(base + href, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForSelector('[data-fin-value="net"]');
  const net = await page.$eval('[data-fin-value="net"]', el => el.textContent);
  if (!net.includes('6,874,300')) throw new Error(href + ' 淨值不對：' + net);
  const label = await page.$eval('.fin-kicker', el => el.textContent);
  if (label !== '示範資料，非本人財務') throw new Error(href + ' 標籤不對');
}

if (errors.length) throw new Error(errors.join('\n'));
console.log('PASS browser_finance_check');
console.log(JSON.stringify(monitor));
await browser.close();
