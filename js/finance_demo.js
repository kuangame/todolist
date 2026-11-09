/* 財務總覽示範資料與整數試算。
   公開頁面只使用這份虛構數字。不讀取其他檔案，不寫入瀏覽器儲存，不對外送出。
   私人財務資料層尚未實作。 */
(function (root) {
  'use strict';

  const DEMO = {
    id: 'finance-demo-2026-11-01',
    label: '示範資料，非本人財務',
    asOf: '2026-11-01',
    fxAsOf: '2026-11-01',
    fx: {
      TWD: { num: 1, den: 1, digits: 2, name: '新臺幣' },
      USD: { num: 32, den: 1, digits: 2, name: '美元' },
      JPY: { num: 21, den: 100, digits: 3, name: '日圓' },
    },
    banks: [
      {
        id: 'bank-twd-demand',
        institution: '虛構北區示範銀行',
        product: '臺幣活期存款',
        kind: 'demand',
        amount: { currency: 'TWD', minor: 186400, scale: 1 },
        asOf: '2026-11-01',
      },
      {
        id: 'bank-usd-demand',
        institution: '虛構北區示範銀行',
        product: '美元活期存款',
        kind: 'demand',
        amount: { currency: 'USD', minor: 250000, scale: 100 },
        asOf: '2026-11-01',
      },
      {
        id: 'bank-twd-fixed',
        institution: '虛構南區示範銀行',
        product: '臺幣定期存款',
        kind: 'fixed',
        amount: { currency: 'TWD', minor: 500000, scale: 1 },
        annualRateBp: 160,
        maturity: '2027-05-01',
        asOf: '2026-11-01',
      },
      {
        id: 'bank-jpy-fixed',
        institution: '虛構南區示範銀行',
        product: '日圓定期存款',
        kind: 'fixed',
        amount: { currency: 'JPY', minor: 1000000, scale: 1 },
        annualRateBp: 40,
        maturity: '2027-02-01',
        asOf: '2026-11-01',
      },
    ],
    investments: [
      {
        id: 'inv-demo1',
        name: '虛構普通股甲',
        symbol: 'DEMO1',
        instrument: '股票',
        quantity: { minor: 2000, scale: 1, unit: '股' },
        price: { currency: 'TWD', minor: 8550, scale: 100 },
        market: { currency: 'TWD', minor: 171000, scale: 1 },
        asOf: '2026-11-01',
      },
      {
        id: 'inv-demo2',
        name: '虛構普通股乙',
        symbol: 'DEMO2',
        instrument: '股票',
        quantity: { minor: 100, scale: 1, unit: '股' },
        price: { currency: 'USD', minor: 4200, scale: 100 },
        market: { currency: 'USD', minor: 420000, scale: 100 },
        asOf: '2026-11-01',
      },
      {
        id: 'inv-demof',
        name: '虛構全球平衡基金',
        symbol: 'DEMOF',
        instrument: '基金',
        quantity: { minor: 1200, scale: 1, unit: '單位' },
        price: { currency: 'TWD', minor: 2000, scale: 100 },
        market: { currency: 'TWD', minor: 24000, scale: 1 },
        asOf: '2026-11-01',
      },
    ],
    policies: [
      {
        id: 'pol-trad',
        insurer: '虛構人壽',
        name: '虛構傳統終身壽險甲',
        policyNo: 'DEMO-POL-001',
        type: 'traditional',
        counted: 'surrender',
        surrender: { currency: 'TWD', minor: 128000, scale: 1 },
        account: null,
        deathBenefit: { currency: 'TWD', minor: 2000000, scale: 1 },
        premiumsPaid: { currency: 'TWD', minor: 360000, scale: 1 },
        monthlyPremium: { currency: 'TWD', minor: 3000, scale: 1 },
        asOf: '2026-10-31',
      },
      {
        id: 'pol-ilp',
        insurer: '虛構人壽',
        name: '虛構投資型保單乙',
        policyNo: 'DEMO-POL-002',
        type: 'investment',
        counted: 'account',
        surrender: { currency: 'TWD', minor: 390000, scale: 1 },
        account: { currency: 'TWD', minor: 412500, scale: 1 },
        deathBenefit: { currency: 'TWD', minor: 1500000, scale: 1 },
        premiumsPaid: { currency: 'TWD', minor: 480000, scale: 1 },
        monthlyPremium: { currency: 'TWD', minor: 5000, scale: 1 },
        asOf: '2026-10-31',
      },
    ],
    properties: [
      {
        id: 'prop-home',
        name: '虛構住宅',
        place: '虛構縣市示範路 1 號',
        valuation: { currency: 'TWD', minor: 8500000, scale: 1 },
        asOf: '2026-09-30',
        linkedLoanId: 'loan-mortgage',
      },
    ],
    loans: [
      {
        id: 'loan-mortgage',
        name: '虛構房貸',
        lender: '虛構南區示範銀行',
        principal: { currency: 'TWD', minor: 3200000, scale: 1 },
        annualRateBp: 215,
        monthly: { currency: 'TWD', minor: 18600, scale: 1 },
        maturity: '2046-11-01',
        balloon: { currency: 'TWD', minor: 0, scale: 1 },
        asOf: '2026-11-01',
        linkedPropertyId: 'prop-home',
      },
      {
        id: 'loan-credit',
        name: '虛構信用貸款',
        lender: '虛構北區示範銀行',
        principal: { currency: 'TWD', minor: 240000, scale: 1 },
        annualRateBp: 380,
        monthly: { currency: 'TWD', minor: 4200, scale: 1 },
        maturity: '2029-06-01',
        balloon: { currency: 'TWD', minor: 80000, scale: 1 },
        asOf: '2026-11-01',
      },
      {
        id: 'loan-usd',
        name: '虛構外幣貸款',
        lender: '虛構海外示範銀行',
        principal: { currency: 'USD', minor: 100000, scale: 100 },
        annualRateBp: 500,
        monthly: { currency: 'USD', minor: 5000, scale: 100 },
        maturity: '2028-01-15',
        balloon: { currency: 'USD', minor: 20000, scale: 100 },
        asOf: '2026-11-01',
      },
    ],
  };

  const FILTERS = [
    { id: 'all', label: '全部' },
    { id: 'bank', label: '銀行存款' },
    { id: 'investment', label: '投資' },
    { id: 'policy', label: '保單' },
    { id: 'property', label: '不動產' },
    { id: 'loan', label: '貸款' },
  ];

  const SORTS = [
    { id: 'report', label: '報表順序' },
    { id: 'amount-desc', label: '金額高到低' },
    { id: 'amount-asc', label: '金額低到高' },
    { id: 'name', label: '名稱' },
    { id: 'date', label: '資料日期新到舊' },
  ];

  const CATEGORY_LABEL = {
    bank: '銀行存款',
    investment: '投資',
    policy: '保單',
    property: '不動產',
    loan: '貸款',
  };

  function assertInt(n, label) {
    if (!Number.isSafeInteger(n)) throw new Error(label + ' 不是安全整數');
  }

  function formatTwd(n) {
    assertInt(n, '新臺幣');
    const sign = n < 0 ? '-' : '';
    return sign + new Intl.NumberFormat('zh-TW').format(Math.abs(n));
  }

  function formatMinor(minor, scale) {
    assertInt(minor, '金額');
    assertInt(scale, '小數比例');
    if (scale < 1) throw new Error('小數比例無效');
    const digits = String(scale).length - 1;
    if (10 ** digits !== scale) throw new Error('小數比例必須是 10 的次方');
    const sign = minor < 0 ? '-' : '';
    const abs = Math.abs(minor);
    const whole = Math.floor(abs / scale);
    const frac = abs % scale;
    const wholeStr = new Intl.NumberFormat('zh-TW').format(whole);
    if (scale === 1) return sign + wholeStr;
    return sign + wholeStr + '.' + String(frac).padStart(digits, '0');
  }

  function formatMoney(money) {
    return formatMinor(money.minor, money.scale) + ' ' + money.currency;
  }

  function formatFx(entry) {
    const scale = 10 ** entry.digits;
    const scaled = entry.num * scale;
    if (scaled % entry.den !== 0) throw new Error('示範匯率無法以指定小數表示');
    const v = scaled / entry.den;
    const whole = Math.floor(v / scale);
    const frac = String(v % scale).padStart(entry.digits, '0');
    return whole + '.' + frac;
  }

  function formatRate(bp) {
    if (!Number.isInteger(bp) || bp < 0) throw new Error('年利率無效');
    return Math.floor(bp / 100) + '.' + String(bp % 100).padStart(2, '0') + '%';
  }

  function toTwd(money, fx) {
    const rate = fx[money.currency];
    if (!rate) throw new Error('未知幣別 ' + money.currency);
    if (money.currency !== 'TWD' && money.scale !== 1 && money.scale !== 100 && money.scale !== 1000) {
      throw new Error('不支援的小數比例');
    }
    const num = money.minor * rate.num;
    const den = money.scale * rate.den;
    if (den === 0 || num % den !== 0) {
      throw new Error('換算新臺幣無法整除：' + money.currency);
    }
    const twd = num / den;
    assertInt(twd, '換算結果');
    return twd;
  }

  function assertQtyPrice(qty, price, market) {
    if (price.currency !== market.currency) throw new Error('價格與市值幣別不同');
    const left = qty.minor * price.minor * market.scale;
    const right = market.minor * qty.scale * price.scale;
    if (left !== right) throw new Error('數量乘以價格不等於市值');
  }

  function sameMoneyShape(a, b, label) {
    if (!a || !b) throw new Error(label + ' 缺少金額');
    if (a.currency !== b.currency || a.scale !== b.scale) {
      throw new Error(label + ' 的幣別或小數不一致');
    }
  }

  function pushNative(bucket, money) {
    const found = bucket.find(row => row.currency === money.currency);
    if (!found) {
      bucket.push({ currency: money.currency, minor: money.minor, scale: money.scale });
      return;
    }
    if (found.scale !== money.scale) throw new Error(money.currency + ' 的小數比例不一致，不能把原幣相加');
    found.minor += money.minor;
    assertInt(found.minor, money.currency);
  }

  function pctWidth(part, total) {
    if (total === 0) return '0.0000%';
    const v = Math.round(part * 1000000 / total);
    return Math.floor(v / 10000) + '.' + String(v % 10000).padStart(4, '0') + '%';
  }

  function pctLabel(part, total) {
    if (total === 0) return '0.0%';
    const v = Math.round(part * 1000 / total);
    return Math.floor(v / 10) + '.' + String(v % 10) + '%';
  }

  function sumTwd(lines) {
    return lines.reduce((acc, line) => acc + line.twd, 0);
  }

  function detail(k, v, kind) {
    return { k: k, v: v, kind: kind || 'in' };
  }

  function fxLine(money, twd, fx) {
    const rate = formatFx(fx[money.currency]);
    const native = formatMinor(money.minor, money.scale);
    if (money.currency === 'TWD') return native + ' TWD × ' + rate;
    return native + ' ' + money.currency + ' × ' + rate + ' = ' + formatTwd(twd) + ' TWD';
  }

  function computeFinance(demo) {
    const fx = demo.fx;
    const lines = [];
    const native = { bank: [], investment: [], policy: [], property: [], loan: [] };
    const excluded = {
      deathBenefitTwd: 0,
      premiumsPaidTwd: 0,
      policyAlternateTwd: 0,
      balloonTwd: 0,
      items: [],
    };
    let order = 0;

    demo.banks.forEach(row => {
      const twd = toTwd(row.amount, fx);
      const liquid = row.kind === 'demand';
      if (row.kind !== 'demand' && row.kind !== 'fixed') throw new Error('未知存款種類');
      pushNative(native.bank, row.amount);
      const kindLabel = row.kind === 'demand' ? '活期存款' : '定期存款';
      const bits = [kindLabel, '原幣 ' + formatMoney(row.amount), '資料日期 ' + row.asOf];
      if (row.annualRateBp != null) bits.splice(1, 0, '年利率 ' + formatRate(row.annualRateBp));
      if (row.maturity) bits.splice(row.annualRateBp != null ? 2 : 1, 0, '到期 ' + row.maturity);
      bits.push(liquid ? '計入流動現金' : '不算流動現金');
      if (row.amount.currency !== 'TWD') bits.push(fxLine(row.amount, twd, fx));
      const details = [
        detail('分類', '銀行存款'),
        detail('機構', row.institution),
        detail('種類', kindLabel),
        detail('幣別', fx[row.amount.currency].name + '（' + row.amount.currency + '）'),
        detail('原幣金額', formatMoney(row.amount)),
        detail('示範匯率', '1 ' + row.amount.currency + ' = ' + formatFx(fx[row.amount.currency]) + ' TWD'),
        detail('換算新臺幣', fxLine(row.amount, twd, fx)),
        detail('資料日期', row.asOf),
        detail('流動可用現金', liquid ? '是。活期存款計入。' : '否。定期存款仍計入總資產，但不算隨時可用的現金。'),
      ];
      if (row.annualRateBp != null) details.push(detail('年利率', formatRate(row.annualRateBp)));
      if (row.maturity) details.push(detail('到期日', row.maturity));
      details.push(detail('說明', '這筆只先換成新臺幣。不同幣別的原幣數字沒有直接相加。', 'note'));
      lines.push({
        id: row.id,
        order: order++,
        side: 'asset',
        category: 'bank',
        depositKind: row.kind,
        liquid: liquid,
        name: row.institution + '・' + row.product,
        meta: bits.join(' · '),
        twd: twd,
        asOf: row.asOf,
        fxText: fxLine(row.amount, twd, fx),
        details: details,
      });
    });

    demo.investments.forEach(row => {
      assertQtyPrice(row.quantity, row.price, row.market);
      const twd = toTwd(row.market, fx);
      pushNative(native.investment, row.market);
      const qtyText = formatMinor(row.quantity.minor, row.quantity.scale) + ' ' + row.quantity.unit;
      const priceText = formatMoney(row.price);
      lines.push({
        id: row.id,
        order: order++,
        side: 'asset',
        category: 'investment',
        liquid: false,
        name: row.name + '（' + row.symbol + '）',
        meta: row.instrument + ' · ' + qtyText + ' × ' + priceText + ' · 資料日期 ' + row.asOf
          + (row.market.currency === 'TWD' ? '' : ' · ' + fxLine(row.market, twd, fx)),
        twd: twd,
        asOf: row.asOf,
        fxText: fxLine(row.market, twd, fx),
        details: [
          detail('分類', '投資'),
          detail('種類', row.instrument),
          detail('代號', row.symbol + '（虛構代號）'),
          detail('數量', qtyText),
          detail('價格', priceText),
          detail('市值檢算', qtyText + ' × ' + priceText + ' = ' + formatMoney(row.market)),
          detail('示範匯率', '1 ' + row.market.currency + ' = ' + formatFx(fx[row.market.currency]) + ' TWD'),
          detail('換算新臺幣', fxLine(row.market, twd, fx)),
          detail('資料日期', row.asOf),
          detail('說明', '資產用目前市值。這份示範沒有成本，也不把市值算進流動現金。', 'note'),
        ],
      });
    });

    demo.policies.forEach(row => {
      let countedMoney;
      let countedLabel;
      let alternate;
      let alternateLabel;
      if (row.type === 'traditional') {
        if (row.counted !== 'surrender' || !row.surrender) throw new Error('傳統保單只計解約金');
        countedMoney = row.surrender;
        countedLabel = '解約金';
        alternate = row.account;
        alternateLabel = '保單帳戶價值';
      } else if (row.type === 'investment') {
        if (row.counted !== 'account' || !row.account) throw new Error('投資型保單只計帳戶價值');
        countedMoney = row.account;
        countedLabel = '保單帳戶價值';
        alternate = row.surrender;
        alternateLabel = '解約金';
      } else {
        throw new Error('未知保單類型');
      }
      const twd = toTwd(countedMoney, fx);
      const monthlyTwd = toTwd(row.monthlyPremium, fx);
      const deathTwd = toTwd(row.deathBenefit, fx);
      const paidTwd = toTwd(row.premiumsPaid, fx);
      pushNative(native.policy, countedMoney);
      excluded.deathBenefitTwd += deathTwd;
      excluded.premiumsPaidTwd += paidTwd;
      excluded.items.push({ label: row.name + '・身故保額', twd: deathTwd, reason: '身故保額不是目前持有的資產。' });
      excluded.items.push({ label: row.name + '・累計已繳保費', twd: paidTwd, reason: '已繳保費不是目前資產。' });
      const details = [
        detail('分類', '保單'),
        detail('保險公司', row.insurer),
        detail('保單號碼', row.policyNo + '（虛構）'),
        detail('類型', row.type === 'traditional' ? '傳統保單' : '投資型保單'),
        detail('計入資產', countedLabel + ' ' + formatMoney(countedMoney)),
        detail('不計入・身故保額', formatMoney(row.deathBenefit), 'out'),
        detail('不計入・累計已繳保費', formatMoney(row.premiumsPaid), 'out'),
      ];
      if (alternate) {
        const alternateTwd = toTwd(alternate, fx);
        excluded.policyAlternateTwd += alternateTwd;
        excluded.items.push({
          label: row.name + '・' + alternateLabel,
          twd: alternateTwd,
          reason: '同一張保單只留一種現值，另一種不重複計入。',
        });
        details.push(detail('不計入・' + alternateLabel, formatMoney(alternate) + '。已採用' + countedLabel + '，兩種現值不重複計算。', 'out'));
      }
      details.push(detail('每月保費', formatMoney(row.monthlyPremium) + '。列入每月保險保費，不列入債務本金。'));
      details.push(detail('資料日期', row.asOf));
      lines.push({
        id: row.id,
        order: order++,
        side: 'asset',
        category: 'policy',
        liquid: false,
        name: row.name,
        meta: (row.type === 'traditional' ? '傳統保單' : '投資型保單')
          + ' · 計入' + countedLabel
          + ' · 資料日期 ' + row.asOf
          + (row.type === 'investment' ? ' · 身故保額與解約金不計入' : ' · 身故保額不計入'),
        twd: twd,
        asOf: row.asOf,
        fxText: fxLine(countedMoney, twd, fx),
        countedLabel: countedLabel,
        monthlyTwd: monthlyTwd,
        monthlyFx: fxLine(row.monthlyPremium, monthlyTwd, fx),
        details: details,
      });
    });

    demo.properties.forEach(row => {
      const twd = toTwd(row.valuation, fx);
      pushNative(native.property, row.valuation);
      lines.push({
        id: row.id,
        order: order++,
        side: 'asset',
        category: 'property',
        liquid: false,
        name: row.name,
        meta: '估價 · ' + row.place + ' · 估價日 ' + row.asOf + ' · 房貸本金另列負債',
        twd: twd,
        asOf: row.asOf,
        fxText: fxLine(row.valuation, twd, fx),
        details: [
          detail('分類', '不動產'),
          detail('名稱', row.name),
          detail('地點', row.place + '（虛構地址）'),
          detail('估價', formatMoney(row.valuation)),
          detail('估價日', row.asOf),
          detail('換算新臺幣', fxLine(row.valuation, twd, fx)),
          detail('說明', '資產用估價毛額。對應房貸的剩餘本金另列在負債，不從這筆估價扣除。', 'note'),
        ],
      });
    });

    demo.loans.forEach(row => {
      sameMoneyShape(row.principal, row.balloon, row.name);
      if (row.balloon.minor < 0 || row.principal.minor < 0) throw new Error('本金不可為負');
      if (row.balloon.minor > row.principal.minor) throw new Error('到期尾款大於剩餘本金');
      const twd = toTwd(row.principal, fx);
      const balloonTwd = toTwd(row.balloon, fx);
      const monthlyTwd = toTwd(row.monthly, fx);
      if (balloonTwd > twd) throw new Error('尾款換算後大於本金');
      pushNative(native.loan, row.principal);
      excluded.balloonTwd += balloonTwd;
      if (row.balloon.minor > 0) {
        excluded.items.push({
          label: row.name + '・到期尾款',
          twd: balloonTwd,
          reason: '尾款已包含在剩餘本金，不另外加進債務。',
        });
      }
      const balloonText = row.balloon.minor === 0
        ? '到期尾款無'
        : '到期尾款 ' + formatMoney(row.balloon) + '（已含在本金）';
      const principalFx = row.principal.currency === 'TWD' ? '' : ' · 本金 ' + fxLine(row.principal, twd, fx);
      lines.push({
        id: row.id,
        order: order++,
        side: 'liability',
        category: 'loan',
        liquid: false,
        name: row.name,
        meta: '年利率 ' + formatRate(row.annualRateBp) + ' · 每月還款 ' + formatMoney(row.monthly) + ' · 到期 ' + row.maturity + ' · ' + balloonText + principalFx,
        twd: twd,
        asOf: row.asOf,
        fxText: fxLine(row.principal, twd, fx),
        balloonTwd: balloonTwd,
        monthlyTwd: monthlyTwd,
        monthlyFx: fxLine(row.monthly, monthlyTwd, fx),
        details: [
          detail('分類', '貸款'),
          detail('名稱', row.name),
          detail('機構', row.lender),
          detail('剩餘本金', formatMoney(row.principal) + '，換算 ' + formatTwd(twd) + ' TWD。負債只計這一個數字。'),
          detail('年利率', formatRate(row.annualRateBp)),
          detail('每月還款', formatMoney(row.monthly) + '，換算 ' + formatTwd(monthlyTwd) + ' TWD。這是還款，不加入本金。'),
          detail('到期日', row.maturity),
          detail('到期尾款', row.balloon.minor === 0 ? '無' : formatMoney(row.balloon) + '，換算 ' + formatTwd(balloonTwd) + ' TWD。'),
          detail('尾款處理', row.balloon.minor === 0 ? '沒有尾款。負債只計剩餘本金。' : '這筆尾款已經包含在剩餘本金裡，債務合計不會再加一次。', 'note'),
          detail('資料日期', row.asOf),
          row.linkedPropertyId
            ? detail('對應資產', '虛構住宅的估價另列在資產，沒有先扣掉這筆房貸。', 'note')
            : detail('說明', '這是無擔保的示範貸款，本金與尾款的算法同上。', 'note'),
        ],
      });
    });

    const assets = lines.filter(line => line.side === 'asset');
    const loans = lines.filter(line => line.category === 'loan');
    const byCategory = {};
    Object.keys(CATEGORY_LABEL).forEach(key => {
      byCategory[key] = sumTwd(lines.filter(line => line.category === key));
    });
    const totals = {
      assetsTwd: sumTwd(assets),
      debtPrincipalTwd: byCategory.loan,
      netWorthTwd: 0,
      liquidCashTwd: sumTwd(lines.filter(line => line.liquid)),
      monthlyDebtTwd: loans.reduce((acc, line) => acc + line.monthlyTwd, 0),
      monthlyPremiumTwd: lines.filter(line => line.category === 'policy').reduce((acc, line) => acc + line.monthlyTwd, 0),
      byCategory: byCategory,
    };
    totals.netWorthTwd = totals.assetsTwd - totals.debtPrincipalTwd;
    Object.keys(totals).forEach(key => {
      if (key !== 'byCategory') assertInt(totals[key], key);
    });
    Object.keys(excluded).forEach(key => {
      if (key !== 'items') assertInt(excluded[key], key);
    });

    const assetOrder = ['bank', 'investment', 'policy', 'property'];
    const allocation = assetOrder.map(key => ({
      category: key,
      label: CATEGORY_LABEL[key],
      twd: byCategory[key],
      pctLabel: pctLabel(byCategory[key], totals.assetsTwd),
      width: pctWidth(byCategory[key], totals.assetsTwd),
    }));
    const debtMix = loans.map(line => ({
      id: line.id,
      label: line.name,
      twd: line.twd,
      pctLabel: pctLabel(line.twd, totals.debtPrincipalTwd),
      width: pctWidth(line.twd, totals.debtPrincipalTwd),
    }));

    function itemRow(label, twd, sub) {
      return { label: label, twd: twd, sub: sub || '', kind: 'item' };
    }
    function totalRow(label, twd) {
      return { label: label, twd: twd, sub: '', kind: 'total' };
    }

    const explain = [
      {
        id: 'assets',
        title: '總資產',
        note: '四類都先換成新臺幣，再相加。',
        rows: assetOrder.map(key => itemRow(CATEGORY_LABEL[key], byCategory[key])).concat([
          totalRow('總資產', totals.assetsTwd),
        ]),
      },
      {
        id: 'net',
        title: '未償本金與淨值',
        note: '淨值＝總資產 − 未償債務本金。到期尾款不加進本金。',
        rows: loans.map(line => itemRow(line.name + '剩餘本金', line.twd, line.fxText)).concat([
          totalRow('未償債務本金', totals.debtPrincipalTwd),
          totalRow('淨值', totals.netWorthTwd),
        ]),
      },
      {
        id: 'liquid',
        title: '流動可用現金',
        note: '只有活期存款。定存、投資、保單、不動產都不算。',
        rows: lines.filter(line => line.liquid).map(line => itemRow(line.name, line.twd, line.fxText)).concat([
          totalRow('流動可用現金', totals.liquidCashTwd),
        ]),
      },
      {
        id: 'debt-pay',
        title: '每月債務還款',
        note: '各筆月付換成新臺幣後相加。不與保費合併。',
        rows: loans.map(line => itemRow(line.name, line.monthlyTwd, line.monthlyFx)).concat([
          totalRow('每月債務還款', totals.monthlyDebtTwd),
        ]),
      },
      {
        id: 'premium',
        title: '每月保險保費',
        note: '與債務還款分開，也不從淨值扣除。',
        rows: lines.filter(line => line.category === 'policy').map(line => itemRow(line.name, line.monthlyTwd, line.monthlyFx)).concat([
          totalRow('每月保險保費', totals.monthlyPremiumTwd),
        ]),
      },
    ];

    const fxRows = Object.keys(fx).map(code => ({
      currency: code,
      name: fx[code].name,
      display: formatFx(fx[code]),
      asOf: demo.fxAsOf,
    }));

    const snapshot = {
      id: demo.id,
      label: demo.label,
      asOf: demo.asOf,
      fxAsOf: demo.fxAsOf,
      checksum: 'A' + totals.assetsTwd + '-D' + totals.debtPrincipalTwd + '-N' + totals.netWorthTwd + '-L' + totals.liquidCashTwd + '-R' + totals.monthlyDebtTwd + '-P' + totals.monthlyPremiumTwd,
      lines: lines,
      totals: totals,
      excluded: excluded,
      native: native,
      allocation: allocation,
      debtMix: debtMix,
      explain: explain,
      fxRows: fxRows,
    };
    audit(snapshot);
    return snapshot;
  }

  function audit(snapshot) {
    const lines = snapshot.lines;
    const totals = snapshot.totals;
    if (sumTwd(lines.filter(line => line.side === 'asset')) !== totals.assetsTwd) throw new Error('總資產與明細不符');
    if (sumTwd(lines.filter(line => line.side === 'liability')) !== totals.debtPrincipalTwd) throw new Error('債務本金與明細不符');
    if (totals.assetsTwd - totals.debtPrincipalTwd !== totals.netWorthTwd) throw new Error('淨值不等於資產減本金');
    if (sumTwd(lines.filter(line => line.liquid)) !== totals.liquidCashTwd) throw new Error('流動現金與明細不符');
    if (lines.some(line => line.liquid && line.category !== 'bank')) throw new Error('非存款被計入流動現金');
    if (lines.some(line => line.depositKind === 'fixed' && line.liquid)) throw new Error('定存被計入流動現金');
    const loans = lines.filter(line => line.category === 'loan');
    if (loans.reduce((acc, line) => acc + line.monthlyTwd, 0) !== totals.monthlyDebtTwd) throw new Error('每月還款不符');
    if (lines.filter(line => line.category === 'policy').reduce((acc, line) => acc + line.monthlyTwd, 0) !== totals.monthlyPremiumTwd) {
      throw new Error('每月保費不符');
    }
    const balloon = loans.reduce((acc, line) => acc + line.balloonTwd, 0);
    if (balloon !== snapshot.excluded.balloonTwd) throw new Error('尾款合計不符');
    loans.forEach(line => {
      if (line.balloonTwd > line.twd) throw new Error('尾款大於該筆本金');
    });
    if (balloon !== 0 && totals.debtPrincipalTwd !== sumTwd(loans)) throw new Error('債務本金必須只加總剩餘本金');
    Object.keys(totals.byCategory).forEach(key => {
      if (sumTwd(lines.filter(line => line.category === key)) !== totals.byCategory[key]) throw new Error(key + ' 小計不符');
    });
    const alloc = snapshot.allocation.reduce((acc, row) => acc + row.twd, 0);
    if (alloc !== totals.assetsTwd) throw new Error('配置合計不符');
    const tenths = label => {
      const matched = /^(\d+)\.(\d)%$/.exec(label);
      if (!matched) throw new Error('比例格式錯誤');
      return Number(matched[1]) * 10 + Number(matched[2]);
    };
    const rounded = snapshot.allocation.reduce((acc, row) => acc + tenths(row.pctLabel), 0);
    if (rounded !== 1000) throw new Error('資產比例四捨五入後不是 100.0%');
    const debtRounded = snapshot.debtMix.reduce((acc, row) => acc + tenths(row.pctLabel), 0);
    if (debtRounded !== 1000) throw new Error('負債比例四捨五入後不是 100.0%');
    return snapshot;
  }

  function filterLines(lines, filter) {
    if (!FILTERS.some(item => item.id === filter)) throw new Error('未知篩選');
    if (filter === 'all') return lines.slice();
    return lines.filter(line => line.category === filter);
  }

  function sortLines(lines, sort) {
    if (!SORTS.some(item => item.id === sort)) throw new Error('未知排序');
    const out = lines.slice();
    const cmp = {
      report: (a, b) => a.order - b.order,
      'amount-desc': (a, b) => b.twd - a.twd || a.order - b.order,
      'amount-asc': (a, b) => a.twd - b.twd || a.order - b.order,
      name: (a, b) => a.name.localeCompare(b.name, 'zh-Hant') || a.order - b.order,
      date: (a, b) => b.asOf.localeCompare(a.asOf) || a.order - b.order,
    }[sort];
    out.sort(cmp);
    return out;
  }

  function viewLines(lines, filter, sort) {
    const filtered = filterLines(lines, filter);
    return {
      assets: sortLines(filtered.filter(line => line.side === 'asset'), sort),
      liabilities: sortLines(filtered.filter(line => line.side === 'liability'), sort),
    };
  }

  const api = {
    DEMO: DEMO,
    FILTERS: FILTERS,
    SORTS: SORTS,
    CATEGORY_LABEL: CATEGORY_LABEL,
    formatTwd: formatTwd,
    formatMinor: formatMinor,
    formatMoney: formatMoney,
    formatFx: formatFx,
    formatRate: formatRate,
    toTwd: toTwd,
    computeFinance: computeFinance,
    audit: audit,
    filterLines: filterLines,
    sortLines: sortLines,
    viewLines: viewLines,
    sumTwd: sumTwd,
    pctWidth: pctWidth,
  };

  root.FinanceDemo = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
