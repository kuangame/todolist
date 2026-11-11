/* 財務總覽示範的試算、畫面與排程監控回歸。執行：node tests/finance_overview.test.js */
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const FD = require('../js/finance_demo.js');
const UI = require('../js/finance_overview.js');
const preview = require('./build_finance_preview.js');

function exact(numerator, denominator) {
  if (numerator % denominator !== 0) throw new Error('不能整除 ' + numerator + ' / ' + denominator);
  return numerator / denominator;
}

const manual = {
  bank: 186400 + exact(250000 * 32, 100) + 500000 + exact(1000000 * 21, 100),
  investment: exact(2000 * 8550, 100) + exact(100 * 4200 * 32, 100) + exact(1200 * 2000, 100),
  policy: 128000 + 412500,
  property: 8500000,
  debt: 3200000 + 240000 + exact(100000 * 32, 100),
  liquid: 186400 + exact(250000 * 32, 100),
  monthlyDebt: 18600 + 4200 + exact(5000 * 32, 100),
  monthlyPremium: 3000 + 5000,
  death: 2000000 + 1500000,
  paid: 360000 + 480000,
  alternate: 390000,
  balloon: 0 + 80000 + exact(20000 * 32, 100),
};
manual.assets = manual.bank + manual.investment + manual.policy + manual.property;
manual.net = manual.assets - manual.debt;

assert.strictEqual(manual.bank, 976400);
assert.strictEqual(manual.investment, 329400);
assert.strictEqual(manual.policy, 540500);
assert.strictEqual(manual.property, 8500000);
assert.strictEqual(manual.assets, 10346300);
assert.strictEqual(manual.debt, 3472000);
assert.strictEqual(manual.net, 6874300);
assert.strictEqual(manual.liquid, 266400);
assert.strictEqual(manual.monthlyDebt, 24400);
assert.strictEqual(manual.monthlyPremium, 8000);
assert.strictEqual(manual.death, 3500000);
assert.strictEqual(manual.paid, 840000);
assert.strictEqual(manual.balloon, 86400);

const before = JSON.stringify(FD.DEMO);
const snapshot = FD.computeFinance(FD.DEMO);
assert.strictEqual(JSON.stringify(FD.DEMO), before);
assert.strictEqual(snapshot.totals.assetsTwd, manual.assets);
assert.strictEqual(snapshot.totals.debtPrincipalTwd, manual.debt);
assert.strictEqual(snapshot.totals.netWorthTwd, manual.net);
assert.strictEqual(snapshot.totals.liquidCashTwd, manual.liquid);
assert.strictEqual(snapshot.totals.monthlyDebtTwd, manual.monthlyDebt);
assert.strictEqual(snapshot.totals.monthlyPremiumTwd, manual.monthlyPremium);
assert.strictEqual(snapshot.totals.byCategory.bank, manual.bank);
assert.strictEqual(snapshot.totals.byCategory.investment, manual.investment);
assert.strictEqual(snapshot.totals.byCategory.policy, manual.policy);
assert.strictEqual(snapshot.totals.byCategory.property, manual.property);
assert.strictEqual(snapshot.excluded.deathBenefitTwd, manual.death);
assert.strictEqual(snapshot.excluded.premiumsPaidTwd, manual.paid);
assert.strictEqual(snapshot.excluded.policyAlternateTwd, manual.alternate);
assert.strictEqual(snapshot.excluded.balloonTwd, manual.balloon);
assert.strictEqual(snapshot.checksum, 'A10346300-D3472000-N6874300-L266400-R24400-P8000');
assert.deepStrictEqual(snapshot.allocation.map(row => row.pctLabel), ['9.4%', '3.2%', '5.2%', '82.2%']);
assert.deepStrictEqual(snapshot.debtMix.map(row => row.pctLabel), ['92.2%', '6.9%', '0.9%']);
assert.deepStrictEqual(snapshot.fxRows.map(row => row.display), ['1.00', '32.00', '0.210']);

assert.strictEqual(FD.toTwd({ currency: 'USD', minor: 250000, scale: 100 }, FD.DEMO.fx), 80000);
assert.strictEqual(FD.toTwd({ currency: 'JPY', minor: 1000000, scale: 1 }, FD.DEMO.fx), 210000);
assert.throws(() => FD.toTwd({ currency: 'USD', minor: 1, scale: 100 }, FD.DEMO.fx));
assert.throws(() => FD.toTwd({ currency: 'JPY', minor: 1, scale: 1 }, FD.DEMO.fx));

const trad = snapshot.lines.find(line => line.id === 'pol-trad');
const ilp = snapshot.lines.find(line => line.id === 'pol-ilp');
assert.strictEqual(trad.twd, 128000);
assert.strictEqual(trad.countedLabel, '解約金');
assert.strictEqual(ilp.twd, 412500);
assert.strictEqual(ilp.countedLabel, '保單帳戶價值');
assert.ok(ilp.meta.includes('解約金不計入'));
snapshot.lines.filter(line => line.depositKind === 'fixed').forEach(line => assert.strictEqual(line.liquid, false));
snapshot.lines.filter(line => line.depositKind === 'demand').forEach(line => assert.strictEqual(line.liquid, true));
assert.ok(snapshot.lines.filter(line => line.category !== 'bank').every(line => line.liquid === false));

const credit = snapshot.lines.find(line => line.id === 'loan-credit');
const usdLoan = snapshot.lines.find(line => line.id === 'loan-usd');
assert.strictEqual(credit.twd, 240000);
assert.strictEqual(credit.balloonTwd, 80000);
assert.ok(credit.meta.includes('已含在本金'));
assert.ok(!credit.meta.includes('320,000'));
assert.strictEqual(usdLoan.twd, 32000);
assert.strictEqual(usdLoan.balloonTwd, 6400);
assert.ok(!usdLoan.meta.includes('38,400'));
assert.strictEqual(snapshot.native.loan.find(row => row.currency === 'USD').minor, 100000);
assert.strictEqual(snapshot.native.loan.find(row => row.currency === 'TWD').minor, 3440000);
assert.strictEqual(snapshot.native.bank.map(row => row.currency).join(','), 'TWD,USD,JPY');

const view = FD.viewLines(snapshot.lines, 'all', 'report');
assert.strictEqual(view.assets.length, 10);
assert.strictEqual(view.liabilities.length, 3);
assert.deepStrictEqual(view.assets.map(line => line.order), view.assets.map(line => line.order).slice().sort((a, b) => a - b));
const byAmount = FD.viewLines(snapshot.lines, 'all', 'amount-desc').assets;
for (let i = 1; i < byAmount.length; i += 1) assert.ok(byAmount[i - 1].twd >= byAmount[i].twd);
const byName = FD.viewLines(snapshot.lines, 'bank', 'name');
assert.strictEqual(byName.assets.length, 4);
assert.strictEqual(byName.liabilities.length, 0);
for (let i = 1; i < byName.assets.length; i += 1) {
  assert.ok(byName.assets[i - 1].name.localeCompare(byName.assets[i].name, 'zh-Hant') <= 0);
}
assert.strictEqual(FD.viewLines(snapshot.lines, 'loan', 'date').liabilities.length, 3);
assert.throws(() => FD.viewLines(snapshot.lines, 'secret', 'report'));

const brokenPolicy = JSON.parse(JSON.stringify(FD.DEMO));
brokenPolicy.policies[1].counted = 'surrender';
assert.throws(() => FD.computeFinance(brokenPolicy));
const brokenBalloon = JSON.parse(JSON.stringify(FD.DEMO));
brokenBalloon.loans[1].balloon.minor = 999999;
assert.throws(() => FD.computeFinance(brokenBalloon));
const tampered = FD.computeFinance(FD.DEMO);
tampered.totals.assetsTwd += 1;
assert.throws(() => FD.audit(tampered));

const state = { filter: 'all', sort: 'report', mask: false, open: new Set(['loan-credit']) };
const html = UI.renderFinanceHtml(snapshot, state);
assert.ok(html.split('示範資料，非本人財務').length - 1 >= 2);
assert.ok(html.includes('不是私人財務紀錄'));
assert.ok(html.includes('請勿輸入、貼上或上傳真實財務資訊'));
assert.ok(html.includes('那一層目前不存在'));
assert.ok(html.includes('10,346,300'));
assert.ok(html.includes('3,472,000'));
assert.ok(html.includes('6,874,300'));
assert.ok(html.includes('266,400'));
assert.ok(html.includes('24,400'));
assert.ok(html.includes('8,000'));
assert.ok(html.includes('2,500.00 USD × 32.00 = 80,000 TWD'));
assert.ok(html.includes('1,000,000 JPY × 0.210 = 210,000 TWD'));
assert.ok(html.includes('50.00 USD × 32.00 = 1,600 TWD'));
assert.ok(html.includes('不會再加一次'));
assert.ok(html.includes('id="fin-detail-loan-credit"'));
assert.ok(!html.includes('13,846,300'));
assert.ok(!html.includes('11,186,300'));
assert.ok(!html.includes('10,736,300'));
assert.ok(!html.includes('3,558,400'));
assert.ok(!html.includes('6,787,900'));
assert.ok(!html.includes('38,400'));
assert.ok(!html.includes('930,500'));
assert.ok(!html.includes('320,000'));
assert.ok(!/<input\b/i.test(html));
assert.ok(!/password/i.test(html));
assert.ok(!/type=["']file["']/i.test(html));

const bankOnly = UI.renderFinanceHtml(snapshot, { filter: 'bank', sort: 'report', mask: false, open: new Set() });
assert.ok(bankOnly.includes('data-fin-section="asset"'));
assert.ok(!bankOnly.includes('data-fin-section="liability"'));
assert.ok(bankOnly.includes('data-fin-value="assets">10,346,300'));
assert.ok(bankOnly.includes('篩選與排序只影響明細'));

const masked = UI.renderFinanceHtml(snapshot, { filter: 'all', sort: 'amount-desc', mask: true, open: new Set(['pol-ilp']) });
assert.ok(masked.includes('••••'));
assert.ok(masked.includes('只改畫面'));
assert.ok(masked.includes('32.00'));
assert.ok(masked.includes('0.210'));
['10,346,300', '8,500,000', '3,200,000', '266,400', '24,400', '10346300', '3472000', '82.2%'].forEach(token => {
  assert.ok(!masked.includes(token), '隱藏後仍看到 ' + token);
});

const indexHtml = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
[
  '.mon-table th, .mon-table td { white-space: nowrap; }',
  '.mon-table th.mon-name, .mon-table td.mon-name { text-align: right; }',
  'const botCell = i === 0 ? `<td class="mon-bot" rowspan="${arr.length}">${monTxt(bot)}</td>` : \'\';',
  '<td class="mon-name">${monTxt(t.name)}</td>',
  '依 bot 第一次出現的順序分組',
  'id="tab-monitor"',
  'loadMonitor()',
  'id="tab-finance"',
  'id="tab-btn-finance"',
  "switchTab('finance'",
  'css/finance_overview.css',
  'js/finance_demo.js',
  'js/finance_overview.js',
].forEach(snippet => assert.ok(indexHtml.includes(snippet), 'index.html 缺少：' + snippet));

const financeSources = ['js/finance_demo.js', 'js/finance_overview.js', 'css/finance_overview.css']
  .map(file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8')).join('\n');
[/localStorage/, /sessionStorage/, /indexedDB/i, /fetch\s*\(/, /XMLHttpRequest/, /WebSocket/, /sendBeacon/, /gh_token/, /pnl\.json/, /calculator\.json/, /status\.json/, /operation_notes/]
  .forEach(pattern => assert.ok(!pattern.test(financeSources), '財務檔含有不允許的內容：' + pattern));

const standalone = fs.readFileSync(path.join(__dirname, '../preview/finance_overview_standalone.html'), 'utf8');
assert.strictEqual(standalone, preview.buildStandalone());
assert.ok(standalone.includes('示範資料，非本人財務'));
assert.ok(!standalone.includes('<script src='));
assert.ok(standalone.includes('function computeFinance'));

console.log('PASS finance_overview.test.js');
console.log(JSON.stringify({
  assetsTwd: snapshot.totals.assetsTwd,
  debtPrincipalTwd: snapshot.totals.debtPrincipalTwd,
  netWorthTwd: snapshot.totals.netWorthTwd,
  liquidCashTwd: snapshot.totals.liquidCashTwd,
  monthlyDebtTwd: snapshot.totals.monthlyDebtTwd,
  monthlyPremiumTwd: snapshot.totals.monthlyPremiumTwd,
  checksum: snapshot.checksum,
}));
