/* 財務總覽畫面。只渲染 js/finance_demo.js 的虛構試算，沒有輸入、上傳或外送。 */
(function (root) {
  'use strict';

  const FD = (typeof module !== 'undefined' && module.exports)
    ? require('./finance_demo.js')
    : root.FinanceDemo;

  function esc(value) {
    return String(value).replace(/[&<>"']/g, ch => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    }[ch]));
  }

  function safeWidth(width) {
    if (!/^\d+\.\d{4}%$/.test(width)) throw new Error('寬度格式錯誤');
    return width;
  }

  function money(state, n) {
    return state.mask ? '••••' : esc(FD.formatTwd(n));
  }

  function shown(state, text) {
    return state.mask ? '••••' : esc(text);
  }

  function renderBanner() {
    return '<p class="fin-sticky fin-kicker" role="note">示範資料，非本人財務</p>'
      + '<div class="fin-banner">'
      + '<p>這是公開網頁上的示範畫面，不是私人財務紀錄。數字全部虛構。請勿輸入、貼上或上傳真實財務資訊。</p>'
      + '</div>';
  }

  function renderMeta(snapshot, state) {
    return '<div class="fin-meta">'
      + '<span>基準日 <b>' + esc(snapshot.asOf) + '</b></span>'
      + '<span>匯率日 <b>' + esc(snapshot.fxAsOf) + '</b></span>'
      + '<span>核對碼 <b data-fin-checksum>' + (state.mask ? '已隱藏' : esc(snapshot.checksum)) + '</b></span>'
      + '</div>';
  }

  function kpi(key, label, value, sub, extraClass) {
    return '<article class="fin-kpi ' + (extraClass || '') + '" data-fin-kpi="' + key + '">'
      + '<p class="fin-kpi-label">' + esc(label) + '</p>'
      + '<p class="fin-kpi-value" data-fin-value="' + key + '">' + value + '</p>'
      + '<p class="fin-kpi-sub">' + esc(sub) + '</p>'
      + '</article>';
  }

  function renderKpis(snapshot, state) {
    const t = snapshot.totals;
    return '<section class="fin-kpis" aria-label="合計">'
      + kpi('assets', '總資產', money(state, t.assetsTwd) + '<span> TWD</span>', '存款、投資市值、保單現值、不動產估價')
      + kpi('debt', '未償債務本金', money(state, t.debtPrincipalTwd) + '<span> TWD</span>', '只加剩餘本金，尾款不另計', 'fin-kpi-debt')
      + kpi('net', '淨值', money(state, t.netWorthTwd) + '<span> TWD</span>', '總資產減未償本金', 'fin-kpi-net')
      + kpi('liquid', '流動可用現金', money(state, t.liquidCashTwd) + '<span> TWD</span>', '只有活期存款')
      + '</section>';
  }

  function renderMonthly(snapshot, state) {
    const t = snapshot.totals;
    const max = Math.max(t.monthlyDebtTwd, t.monthlyPremiumTwd, 1);
    const bar = (n) => state.mask ? '' : '<span class="fin-track"><span style="width:' + safeWidth(FD.pctWidth(n, max)) + '"></span></span>';
    return '<section class="fin-flows" aria-label="每月支出">'
      + '<div><div class="fin-flow-head"><span>每月債務還款</span><b data-fin-value="monthly-debt">' + money(state, t.monthlyDebtTwd) + ' TWD</b></div>' + bar(t.monthlyDebtTwd) + '</div>'
      + '<div><div class="fin-flow-head"><span>每月保險保費</span><b data-fin-value="monthly-premium">' + money(state, t.monthlyPremiumTwd) + ' TWD</b></div>' + bar(t.monthlyPremiumTwd) + '</div>'
      + '<p class="fin-hint">這兩項分開列出，沒有加在一起，也不從淨值扣除。</p>'
      + '</section>';
  }

  function renderBars(title, rows, state, hint) {
    if (state.mask) {
      return '<section class="fin-card"><h2>' + esc(title) + '</h2><p class="fin-hint">金額隱藏時不畫比例，避免用長短看出數字。這不是安全機制。</p></section>';
    }
    const segs = rows.map(row => '<span class="fin-seg fin-seg-' + esc(row.category || 'debt') + '" style="width:' + safeWidth(row.width) + '" title="' + esc(row.label) + '"></span>').join('');
    const legend = rows.map(row => '<li><i class="fin-dot fin-seg-' + esc(row.category || 'debt') + '"></i><span>' + esc(row.label) + '</span><b>' + esc(FD.formatTwd(row.twd)) + '</b><em>' + esc(row.pctLabel) + '</em></li>').join('');
    return '<section class="fin-card"><h2>' + esc(title) + '</h2><div class="fin-bar" role="img" aria-label="' + esc(title) + '">' + segs + '</div><ul class="fin-legend">' + legend + '</ul><p class="fin-hint">' + esc(hint) + '</p></section>';
  }

  function renderToolbar(state) {
    const chips = FD.FILTERS.map(item => '<button type="button" class="fin-chip" data-fin-filter="' + item.id + '" aria-pressed="' + (state.filter === item.id ? 'true' : 'false') + '">' + esc(item.label) + '</button>').join('');
    const options = FD.SORTS.map(item => '<option value="' + item.id + '"' + (state.sort === item.id ? ' selected' : '') + '>' + esc(item.label) + '</option>').join('');
    return '<div class="fin-tools">'
      + '<div class="fin-chips" role="group" aria-label="篩選明細">' + chips + '</div>'
      + '<label class="fin-sort-label">排序<select data-fin-sort aria-label="排序明細">' + options + '</select></label>'
      + '<button type="button" class="fin-mask-btn" data-fin-mask aria-pressed="' + (state.mask ? 'true' : 'false') + '">' + (state.mask ? '顯示金額' : '隱藏金額') + '</button>'
      + '<p class="fin-hint">篩選與排序只影響明細，上方合計維持全貌。隱藏金額只改畫面，原始碼仍是同一份虛構數字，也不是存取控制。</p>'
      + '</div>';
  }

  function renderLine(line, state) {
    const open = state.open.has(line.id);
    const details = open ? '<div class="fin-detail" id="fin-detail-' + esc(line.id) + '"><dl>'
      + line.details.map(row => '<div class="' + (row.kind === 'note' ? 'fin-note' : '') + '"><dt>' + esc(row.k) + '</dt><dd class="fin-' + esc(row.kind) + '">' + (row.kind === 'out' ? '<span class="fin-badge">不計入</span>' : '') + shown(state, row.v) + '</dd></div>').join('')
      + '</dl></div>' : '';
    return '<article class="fin-item" data-cat="' + esc(line.category) + '">'
      + '<button type="button" class="fin-row" data-fin-toggle="' + esc(line.id) + '" aria-expanded="' + (open ? 'true' : 'false') + '">'
      + '<span class="fin-cat">' + esc(FD.CATEGORY_LABEL[line.category]) + '</span>'
      + '<span class="fin-name">' + esc(line.name) + '</span>'
      + '<span class="fin-line-amt">' + money(state, line.twd) + ' TWD</span>'
      + '<span class="fin-line-meta">' + shown(state, line.meta) + '</span>'
      + '<span class="fin-more">' + (open ? '收合' : '明細') + '</span>'
      + '</button>' + details + '</article>';
  }

  function renderSection(side, title, lines, state) {
    const filterSide = state.filter === 'all' ? 'both' : (state.filter === 'loan' ? 'liability' : 'asset');
    if (!lines.length && filterSide !== 'both' && filterSide !== side) return '';
    const body = lines.length
      ? lines.map(line => renderLine(line, state)).join('')
        + '<p class="fin-subtotal">目前列出的新臺幣小計 <b>' + money(state, FD.sumTwd(lines)) + '</b></p>'
      : '<p class="fin-empty">這個分類沒有示範項目。</p>';
    return '<section class="fin-card" data-fin-section="' + side + '"><h2>' + esc(title) + ' <span class="fin-count">' + lines.length + '</span></h2>' + body + '</section>';
  }

  function renderFx(snapshot) {
    const rows = snapshot.fxRows.map(row => '<tr><td data-label="幣別">' + esc(row.currency) + '</td><td data-label="名稱">' + esc(row.name) + '</td><td class="fin-num" data-label="1 單位換新臺幣">' + esc(row.display) + '</td><td data-label="基準日">' + esc(row.asOf) + '</td></tr>').join('');
    return '<section class="fin-card"><h2>示範匯率</h2><div class="fin-scroll"><table class="fin-table"><thead><tr><th>幣別</th><th>名稱</th><th>1 單位換新臺幣</th><th>基準日</th></tr></thead><tbody>' + rows + '</tbody></table></div><p class="fin-hint">匯率是寫死的示範值，基準日 ' + esc(snapshot.fxAsOf) + '，不是市場報價。只有換算後的新臺幣會進入合計。</p></section>';
  }

  function renderNative(snapshot, state) {
    const groups = [
      ['bank', '銀行存款'],
      ['investment', '投資'],
      ['policy', '保單計入值'],
      ['property', '不動產'],
      ['loan', '貸款本金'],
    ];
    const body = groups.map(([key, label]) => {
      const rows = snapshot.native[key].map(row => '<li><span>' + esc(FD.DEMO.fx[row.currency].name) + '</span><b>' + shown(state, FD.formatMinor(row.minor, row.scale) + ' ' + row.currency) + '</b></li>').join('');
      return '<div><h3>' + esc(label) + '</h3><ul>' + rows + '</ul></div>';
    }).join('');
    return '<section class="fin-card"><h2>原幣餘額</h2><div class="fin-native">' + body + '</div><p class="fin-hint">同一組裡的不同幣別分開列，沒有把美元、日圓和新臺幣的原幣數字加在一起。</p></section>';
  }

  function renderExcluded(snapshot, state) {
    const rows = snapshot.excluded.items.map(item => '<tr><td data-label="項目">' + esc(item.label) + '</td><td class="fin-num" data-label="新臺幣">' + money(state, item.twd) + '</td><td data-label="原因">' + esc(item.reason) + '</td></tr>').join('');
    return '<section class="fin-card"><h2>不計入合計的數字</h2><div class="fin-scroll"><table class="fin-table"><thead><tr><th>項目</th><th>新臺幣</th><th>原因</th></tr></thead><tbody>' + rows + '</tbody></table></div><p class="fin-hint">傳統保單用解約金；投資型保單用帳戶價值。身故保額、累計已繳保費，以及另一種現值，都不算資產。到期尾款已在剩餘本金裡。</p></section>';
  }

  function renderMath(snapshot, state) {
    const groups = snapshot.explain.map(group => {
      const rows = group.rows.map(row => '<div class="fin-math-row' + (row.kind === 'total' ? ' is-total' : '') + '"><span>' + esc(row.label) + (row.sub && !state.mask ? '<small>' + esc(row.sub) + '</small>' : '') + '</span><b>' + money(state, row.twd) + '</b></div>').join('');
      return '<div class="fin-math"><h3>' + esc(group.title) + '</h3><p class="fin-hint">' + esc(group.note) + '</p>' + rows + '</div>';
    }).join('');
    return '<section class="fin-card" data-fin-section="math"><h2>合計怎麼來的</h2>' + groups + '</section>';
  }

  function renderRules() {
    return '<section class="fin-card"><h2>計算口徑</h2><ol class="fin-rules">'
      + '<li>總資產＝銀行存款＋投資目前市值＋保單現值＋不動產估價。先換算成新臺幣再相加。</li>'
      + '<li>保單只計一種現值：傳統保單用解約金，投資型保單用帳戶價值。</li>'
      + '<li>未償債務本金＝各筆剩餘本金換算後相加。到期尾款不另加。</li>'
      + '<li>淨值＝總資產 − 未償債務本金。</li>'
      + '<li>流動可用現金＝活期存款。定存仍算資產，但不算流動現金。</li>'
      + '<li>每月債務還款與每月保險保費分開，不混成一個支出合計。</li>'
      + '</ol></section>';
  }

  function renderFuture() {
    return '<section class="fin-card fin-future"><h2>私人資料層</h2>'
      + '<p>未來若要改成本人的財務紀錄，必須另外做一層受保護的私人資料，和這個公開頁面分開，並有存取控制。那一層目前不存在。</p>'
      + '<p>這一版沒有登入、沒有資料輸入或上傳、沒有把數字存在這台裝置上，也不會把數字傳出這台裝置。</p>'
      + '<p class="fin-kicker">示範資料，非本人財務</p>'
      + '</section>';
  }

  function renderFinanceHtml(snapshot, state) {
    const viewState = {
      filter: state && state.filter ? state.filter : 'all',
      sort: state && state.sort ? state.sort : 'report',
      mask: !!(state && state.mask),
      open: state && state.open ? state.open : new Set(),
    };
    const view = FD.viewLines(snapshot.lines, viewState.filter, viewState.sort);
    const debtRows = snapshot.debtMix.map(row => ({
      category: row.id,
      label: row.label,
      twd: row.twd,
      pctLabel: row.pctLabel,
      width: row.width,
    }));
    return '<div class="fin-root' + (viewState.mask ? ' is-masked' : '') + '">'
      + renderBanner()
      + renderMeta(snapshot, viewState)
      + renderKpis(snapshot, viewState)
      + renderMonthly(snapshot, viewState)
      + renderBars('資產配置', snapshot.allocation, viewState, '比例以新臺幣總資產為分母。色條用精確比例，旁邊的百分比四捨五入到一位小數。')
      + renderBars('債務本金構成', debtRows, viewState, '各筆剩餘本金占未償本金的比例。尾款沒有再畫一條。')
      + renderToolbar(viewState)
      + renderSection('asset', '資產明細', view.assets, viewState)
      + renderSection('liability', '負債明細', view.liabilities, viewState)
      + renderFx(snapshot)
      + renderNative(snapshot, viewState)
      + renderExcluded(snapshot, viewState)
      + renderMath(snapshot, viewState)
      + renderRules()
      + renderFuture()
      + '</div>';
  }

  function mount(root) {
    if (typeof document === 'undefined') return null;
    const el = root || document.getElementById('tab-finance');
    if (!el || !FD) return null;
    let snapshot;
    try {
      snapshot = FD.computeFinance(FD.DEMO);
    } catch (err) {
      el.innerHTML = '<p class="fin-fallback">示範試算沒有通過內部核對，已停止顯示，避免放出對不上的合計。這仍然不是本人財務。</p>';
      return el;
    }
    const state = { filter: 'all', sort: 'report', mask: false, open: new Set() };
    const draw = () => { el.innerHTML = renderFinanceHtml(snapshot, state); };
    el.addEventListener('click', event => {
      const filterBtn = event.target.closest('[data-fin-filter]');
      if (filterBtn) {
        state.filter = filterBtn.getAttribute('data-fin-filter');
        draw();
        return;
      }
      const toggle = event.target.closest('[data-fin-toggle]');
      if (toggle) {
        const id = toggle.getAttribute('data-fin-toggle');
        if (state.open.has(id)) state.open.delete(id);
        else state.open.add(id);
        draw();
        return;
      }
      if (event.target.closest('[data-fin-mask]')) {
        state.mask = !state.mask;
        draw();
      }
    });
    el.addEventListener('change', event => {
      const sort = event.target.closest('[data-fin-sort]');
      if (!sort) return;
      state.sort = sort.value;
      draw();
    });
    draw();
    return el;
  }

  const api = { renderFinanceHtml: renderFinanceHtml, mount: mount };
  root.FinanceOverview = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof document !== 'undefined') mount();
})(typeof globalThis !== 'undefined' ? globalThis : this);
