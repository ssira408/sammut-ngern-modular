/* ============ icons & components ============ */
const IC = {
  home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M10 21v-6h4v6"/>',
  swap: '<path d="M7 4 3 8l4 4"/><path d="M3 8h14"/><path d="m17 12 4 4-4 4"/><path d="M21 16H7"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  coins: '<ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6"/><path d="M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/>',
  card: '<rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="M2.5 10h19M6 15h4"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2"/>',
  heart: '<path d="M12 20.5s-8-4.6-8-10.4A4.6 4.6 0 0 1 12 7.4a4.6 4.6 0 0 1 8 2.7c0 5.8-8 10.4-8 10.4Z"/>',
  sliders: '<path d="M4 6h8M18 6h2M4 12h2M12 12h8M4 18h10M20 18h0"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="18" r="2"/>',
  pulse: '<path d="M3 12h4l3-8 4 16 3-8h4"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16v4Z"/><path d="m13.5 6.5 4 4"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  chevL: '<path d="m15 5-7 7 7 7"/>', chevR: '<path d="m9 5 7 7-7 7"/>',
  download: '<path d="M12 4v11M7 11l5 5 5-5M5 20h14"/>', upload: '<path d="M12 16V5M7 9l5-5 5 5M5 20h14"/>',
  list: '<path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/>',
  pause: '<path d="M8 5v14M16 5v14"/>', clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
};
const ic = (n, sz = 20) => `<svg class="ic" width="${sz}" height="${sz}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n] || ''}</svg>`;
const NAV = [
  { id: 'home', t: 'ภาพรวม', i: 'home' }, { id: 'tx', t: 'รายรับ-รายจ่าย', i: 'swap' }, { id: 'bills', t: 'รายการต้องจ่าย', i: 'calendar' },
  { id: 'save', t: 'เงินเก็บ & แบบออมเงิน', i: 'coins', short: 'เงินเก็บ' }, { id: 'debt', t: 'หนี้สิน', i: 'card' }, { id: 'goals', t: 'เป้าหมาย', i: 'target' },
  { id: 'wish', t: 'ของที่อยากได้', i: 'heart' }, { id: 'budget', t: 'บริหารเงิน', i: 'sliders' }, { id: 'assess', t: 'ประเมินการเงิน', i: 'pulse' },
];
const PAGE_TITLE = Object.fromEntries([...NAV.map(n => [n.id, n.t]), ['settings', 'ตั้งค่าและข้อมูล']]);

const pageHead = (title, sub, actions = '') => `<div class="pagehead"><div><h1>${title}</h1>${sub ? `<p>${sub}</p>` : ''}</div><div class="head-actions">${actions}</div></div>`;
const empty = (title, text, actions = '') => `<div class="empty"><h3>${title}</h3><p>${text}</p><div class="btnrow">${actions}</div></div>`;
const monthNav = () => `<div class="monthnav"><button class="icon-btn" data-act="ym" data-d="-1" aria-label="เดือนก่อนหน้า">${ic('chevL')}</button><strong>${ymLabel(ui.ym)}</strong><button class="icon-btn" data-act="ym" data-d="1" aria-label="เดือนถัดไป">${ic('chevR')}</button>${ui.ym !== curYm() ? '<button class="btn ghost sm" data-act="ym-now">เดือนนี้</button>' : ''}</div>`;
const bar = (v, max, cls = '', lg = '') => `<div class="bar ${cls} ${lg}" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(clamp(max > 0 ? v / max * 100 : 0))}"><i style="width:${clamp(max > 0 ? v / max * 100 : 0)}%"></i></div>`;
const chip = (t, c = '') => `<span class="chip ${c}">${t}</span>`;
const iconBtn = (act, icon, label, data = '') => `<button class="icon-btn sm" data-act="${act}" ${data} aria-label="${label}" title="${label}">${ic(icon, 17)}</button>`;

function allocBar(p) {
  const segs = [['จ่ายไปแล้ว', p.spentTotal, 'var(--muted)'], ['บิลที่ยังไม่จ่าย', p.unpaidBills, 'var(--warn)'], ['ผ่อนหนี้ที่เหลือ', p.debtRemaining, 'var(--expense)'], ['กันไว้ออม', p.saveRemaining, 'var(--save)'], ['ใช้ได้', Math.max(0, p.left), 'var(--income)']].filter(s => s[1] > 0.5);
  const tot = sum(segs, s => s[1]) || 1;
  const label = segs.map(s => s[0] + ' ' + money(s[1])).join(', ');
  return `<div class="alloc" role="img" aria-label="${esc(label)}">${segs.map(s => `<i style="flex:${s[1] / tot};background:${s[2]}"></i>`).join('')}</div>
  <ul class="legend">${segs.map(s => `<li><span class="sw" style="background:${s[2]}"></span>${s[0]} <b>${money(s[1])}</b></li>`).join('')}</ul>`;
}

function gauge(score, grade) {
  const L = Math.PI * 80, col = score >= 65 ? 'var(--income)' : score >= 45 ? 'var(--warn)' : 'var(--expense)';
  return `<div class="gauge"><svg viewBox="0 0 200 118" role="img" aria-label="คะแนนสุขภาพการเงิน ${score} จาก 100">
    <path d="M20 100A80 80 0 0 1 180 100" fill="none" stroke="var(--surface-2)" stroke-width="16" stroke-linecap="round"/>
    <path d="M20 100A80 80 0 0 1 180 100" fill="none" stroke="${col}" stroke-width="16" stroke-linecap="round" stroke-dasharray="${L * score / 100} ${L}"/>
    <text x="100" y="96" text-anchor="middle" style="font:500 44px var(--display);fill:var(--ink)">${score}</text></svg>
    ${chip(grade[0], grade[1])}</div>`;
}

function barChart() {
  const months = [...Array(6)].map((_, i) => shiftYm(ui.ym, i - 5)), data = months.map(monthStats);
  const max = Math.max(1, ...data.map(d => Math.max(d.income, d.expense)));
  if (data.every(d => !d.income && !d.expense)) return '<p class="muted">ยังไม่มีข้อมูล 6 เดือนล่าสุด</p>';
  const W = 560, H = 210, pb = 28, pt = 10, gw = W / 6, y = v => pt + (H - pt - pb) * (1 - v / max);
  let s = `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="รายรับและรายจ่ายย้อนหลัง 6 เดือน"><line x1="0" x2="${W}" y1="${H - pb}" y2="${H - pb}" stroke="var(--line)"/>`;
  data.forEach((d, i) => {
    const cx = gw * (i + .5), hi = (H - pb) - y(d.income), he = (H - pb) - y(d.expense);
    s += `<rect x="${cx - 24}" y="${y(d.income)}" width="22" height="${hi}" rx="3" style="fill:var(--income)"><title>${ymShort(months[i])} รายรับ ${money(d.income)}</title></rect>`;
    s += `<rect x="${cx + 2}" y="${y(d.expense)}" width="22" height="${he}" rx="3" style="fill:var(--expense)"><title>${ymShort(months[i])} รายจ่าย ${money(d.expense)}</title></rect>`;
    s += `<text x="${cx}" y="${H - 8}" text-anchor="middle" style="font:500 13px var(--font);fill:var(--muted)">${TH_M[+months[i].slice(5) - 1]}</text>`;
  });
  return s + '</svg>' + `<ul class="legend" style="margin-top:6px"><li><span class="sw" style="background:var(--income)"></span>รายรับ</li><li><span class="sw" style="background:var(--expense)"></span>รายจ่าย</li></ul>`;
}
function donut(byCat, total) {
  let ents = Object.entries(byCat).sort((a, b) => b[1] - a[1]);
  if (!ents.length) return '<p class="muted">ยังไม่มีรายจ่ายในเดือนนี้</p>';
  if (ents.length > 6) { const rest = sum(ents.slice(5), e => e[1]); ents = [...ents.slice(0, 5), ['__rest', rest]]; }
  const r = 54, C = 2 * Math.PI * r; let off = 0, arcs = '';
  ents.forEach(([k, v]) => {
    const c = k === '__rest' ? { color: '#8A949E', name: 'หมวดอื่นๆ รวม' } : catOf('expense', k); const len = v / total * C;
    arcs += `<circle cx="70" cy="70" r="${r}" fill="none" stroke="${c.color}" stroke-width="18" stroke-dasharray="${Math.max(0, len - (ents.length > 1 ? 1.5 : 0))} ${C}" stroke-dashoffset="${-off}" transform="rotate(-90 70 70)"><title>${c.name} ${money(v)}</title></circle>`; off += len;
  });
  const legend = ents.map(([k, v]) => { const c = k === '__rest' ? { color: '#8A949E', name: 'หมวดอื่นๆ รวม' } : catOf('expense', k); return `<li><span class="sw" style="background:${c.color}"></span><span style="flex:1">${c.name}</span><b>${money(v)}</b><span class="muted" style="width:42px;text-align:right">${pct(v / total)}</span></li>`; }).join('');
  return `<div style="display:grid;grid-template-columns:150px minmax(0,1fr);gap:16px;align-items:center"><svg viewBox="0 0 140 140" width="150" role="img" aria-label="สัดส่วนรายจ่ายตามหมวด"><circle cx="70" cy="70" r="${r}" fill="none" stroke="var(--surface-2)" stroke-width="18"/>${arcs}
  <text x="70" y="68" text-anchor="middle" style="font:500 15px var(--display);fill:var(--ink)">${money(total)}</text><text x="70" y="86" text-anchor="middle" style="font:400 11px var(--font);fill:var(--muted)">รายจ่ายรวม</text></svg>
  <ul class="legend" style="flex-direction:column;gap:6px;flex-wrap:nowrap">${legend}</ul></div>`;
}

/* ============ HOME ============ */
function heroHTML(pl, isNow) {
  if (pl.basis <= 0) return `<section class="card hero"><div class="hero-empty"><h2>วันนี้ใช้ได้อีกเท่าไหร่?</h2><p>บันทึกรายรับของเดือนนี้ หรือกำหนดรายได้ต่อเดือน แล้วแอพจะหักบิล ค่าผ่อนหนี้ และเงินออมให้ เหลือเป็นเงินที่ใช้ได้ต่อวัน</p><div class="btnrow"><button class="btn primary" data-act="tx-add" data-type="income">${ic('plus', 18)}บันทึกรายรับ</button><button class="btn" data-go="budget">กำหนดรายได้ต่อเดือน</button></div></div></section>`;
  let top;
  if (isNow) {
    const now = new Date(), dl = daysIn(now.getFullYear(), now.getMonth() + 1) - now.getDate() + 1;
    if (pl.left >= 0) top = `<div class="hero-label">วันนี้ใช้ได้อีก</div><div class="hero-num">${money(pl.left / dl)}<small>ต่อวัน</small></div><p class="hero-sub">เหลือ ${money(pl.left)} สำหรับอีก ${dl} วันของเดือนนี้ หลังกันบิล ค่าผ่อนหนี้ และเงินออมไว้แล้ว</p>`;
    else top = `<div class="hero-label">เดือนนี้เกินแผนอยู่</div><div class="hero-num exp">${money(pl.left)}</div><p class="hero-sub">เงินไม่พอสำหรับบิล ผ่อนหนี้ และเงินออมที่กันไว้ ลองลดรายจ่ายที่ไม่จำเป็น หรือปรับเปอร์เซ็นต์เงินออมในหน้าบริหารเงิน</p>`;
  } else top = `<div class="hero-label">สรุป${ymLabel(ui.ym)}</div><div class="hero-num ${pl.st.net < 0 ? 'exp' : ''}">${money(pl.st.net)}<small>รายรับ − รายจ่าย</small></div>`;
  return `<section class="card hero">${top}${isNow ? allocBar(pl) : ''}</section>`;
}
function pageHome() {
  const ym = ui.ym, isNow = ym === curYm(), pl = monthPlan(ym), st = pl.st;
  const greet = state.settings.name ? `สวัสดี ${esc(state.settings.name)}` : 'ภาพรวมการเงิน';
  const billsNow = billsForMonth(curYm()).filter(i => !i.paid).slice(0, 5);
  const goals = state.goals.map(g => ({ g, s: goalSaved(g) })).filter(x => x.s < x.g.target).sort((a, b) => b.s / b.g.target - a.s / a.g.target).slice(0, 3);
  const A = assess(), debtTotal = sum(state.debts, d => d.balance), potTotal = potsTotal();
  const recent = [...state.tx].sort((a, b) => b.date.localeCompare(a.date) || 0).slice(0, 6);
  return pageHead(greet, '', monthNav() + `<button class="btn primary" data-act="tx-add">${ic('plus', 18)}บันทึกรายการ</button>`) +
    `<div class="stack">${heroHTML(pl, isNow)}
    <section class="card kpis" aria-label="สรุปเดือน ${ymLabel(ym)}"><div><span>รายรับ</span><b class="inc">${money(st.income)}</b></div><div><span>รายจ่าย</span><b class="exp">${money(st.expense)}</b></div><div><span>คงเหลือ</span><b class="${st.net < 0 ? 'exp' : ''}">${money(st.net)}</b></div><div><span>อัตราการออม</span><b>${st.rate === null ? '—' : pct(st.rate)}</b></div></section>
    <div class="grid-wide"><section class="card"><h2>รายรับ-รายจ่าย 6 เดือน</h2>${barChart()}</section><section class="card"><h2>รายจ่ายแยกหมวด</h2>${donut(st.byCat, st.expense)}</section></div>
    <div class="grid2">
      <section class="card"><div class="card-h"><span>บิลที่ต้องจ่ายเดือนนี้</span><button class="linkbtn" data-go="bills">ดูทั้งหมด</button></div>${billsNow.length ? `<ul class="list">${billsNow.map(it => { const s = billStatus(it); return `<li class="row" style="grid-template-columns:minmax(0,1fr) auto auto"><div class="row-main"><b>${esc(it.bill.name)}</b><small>ครบกำหนด ${fmtDate(it.date)}</small></div>${s === 'overdue' ? chip('เลยกำหนด', 'bad') : s === 'soon' ? chip('ใกล้ครบ', 'warn') : ''}<span class="amt">${money(it.bill.amount)}</span></li>`; }).join('')}</ul>` : `<p class="muted">${state.bills.length ? 'จ่ายครบแล้วทุกรายการ' : 'ยังไม่ได้ตั้งรายการต้องจ่าย เช่น ค่าเช่า ค่าไฟ ค่าอินเทอร์เน็ต'}</p>`}</section>
      <section class="card"><div class="card-h"><span>ความคืบหน้าเป้าหมาย</span><button class="linkbtn" data-go="goals">ดูทั้งหมด</button></div>${goals.length ? goals.map(x => `<div style="margin-bottom:14px"><div style="display:flex;justify-content:space-between;gap:10px"><b style="font-weight:500">${esc(x.g.name)}</b><span class="muted num">${pct(x.s / x.g.target)}</span></div>${bar(x.s, x.g.target, 'green')}<small class="muted">${money(x.s)} จาก ${money(x.g.target)}</small></div>`).join('') : '<p class="muted">ยังไม่มีเป้าหมายที่กำลังเก็บ</p>'}</section>
    </div>
    <div class="grid2">
      <section class="card"><div class="card-h"><span>ฐานะการเงิน</span><button class="linkbtn" data-go="save">เงินเก็บ</button></div><ul class="ledger"><li><span class="l">เงินเก็บทั้งหมด</span><span class="dots"></span><span class="v inc">${money(potTotal)}</span></li><li><span class="l">หนี้สินคงเหลือ</span><span class="dots"></span><span class="v exp">${money(debtTotal)}</span></li><li class="total"><span class="l">มั่งคั่งสุทธิ</span><span class="dots"></span><span class="v ${potTotal - debtTotal < 0 ? 'exp' : ''}">${money(potTotal - debtTotal)}</span></li></ul></section>
      <section class="card"><div class="card-h"><span>สุขภาพการเงิน</span><button class="linkbtn" data-go="assess">ดูรายละเอียด</button></div>${A && !A.noIncome ? `<div style="display:grid;grid-template-columns:minmax(0,170px) 1fr;gap:14px;align-items:center">${gauge(A.score, A.grade)}<div class="muted">${A.todo.length ? 'ควรเริ่มจาก<b style="display:block;color:var(--ink)">' + esc(A.todo[0].title) + '</b>' : 'ทุกด้านอยู่ในเกณฑ์ดี'}</div></div>` : '<p class="muted">บันทึกรายรับและรายจ่ายสัก 1 เดือน เพื่อให้แอพประเมินให้</p>'}</section>
    </div>
    <section class="card"><div class="card-h"><span>รายการล่าสุด</span><button class="linkbtn" data-go="tx">ดูทั้งหมด</button></div>${recent.length ? `<ul class="list">${recent.map(txRow).join('')}</ul>` : '<p class="muted">ยังไม่มีรายการ</p>'}</section></div>`;
}

/* ============ TRANSACTIONS ============ */
function txRow(t, actions = false) {
  const c = catOf(t.type, t.cat), inc = t.type === 'income', linked = t.billId ? 'จากรายการต้องจ่าย' : t.debtId ? 'จากการผ่อนหนี้' : '';
  return `<li class="row"><span class="dot" style="background:${c.color}"></span><div class="row-main"><b>${esc(t.note || c.name)}</b><small>${c.name}${actions ? '' : ' · ' + fmtDate(t.date)}${linked ? ' · ' + linked : ''}</small></div><span class="amt ${inc ? 'inc' : 'exp'}">${inc ? '+' : '−'}${moneyx(t.amount)}</span>${actions ? `<div class="row-actions">${linked ? '' : iconBtn('tx-edit', 'edit', 'แก้ไข', `data-id="${t.id}"`)}${iconBtn('tx-del', 'trash', 'ลบ', `data-id="${t.id}"`)}</div>` : '<span></span>'}</li>`;
}
function txListHTML() {
  const q = ui.q.trim().toLowerCase();
  let list = state.tx.filter(t => t.date.startsWith(ui.ym) && (ui.txType === 'all' || t.type === ui.txType) && (ui.txCat === 'all' || t.cat === ui.txCat) && (!q || (t.note || '').toLowerCase().includes(q) || catOf(t.type, t.cat).name.toLowerCase().includes(q)));
  if (!list.length) return state.tx.some(t => t.date.startsWith(ui.ym)) ? '<p class="muted" style="padding:24px 0;text-align:center">ไม่พบรายการที่ตรงกับตัวกรอง</p>'
    : empty('ยังไม่มีรายการในเดือนนี้', 'จดรายรับและรายจ่ายทุกครั้งที่เกิดขึ้น เดือนละไม่กี่นาทีก็เห็นภาพการเงินชัดขึ้น', `<button class="btn primary" data-act="tx-add">${ic('plus', 18)}บันทึกรายการแรก</button>`);
  list.sort((a, b) => b.date.localeCompare(a.date));
  const groups = {}; list.forEach(t => (groups[t.date] ||= []).push(t));
  return Object.keys(groups).sort().reverse().map(d => { const g = groups[d], net = sum(g, t => t.type === 'income' ? t.amount : -t.amount); return `<div class="dayhead"><span>${fmtDay(d)}</span><span class="num ${net < 0 ? 'exp' : 'inc'}">${net >= 0 ? '+' : '−'}${money(Math.abs(net))}</span></div><ul class="list">${g.map(t => txRow(t, true)).join('')}</ul>`; }).join('');
}
function pageTx() {
  const st = monthStats(ui.ym);
  const cats = [...CATS_EXP.map(c => [c.id, c.name]), ...CATS_INC.filter(c => c.id !== 'other').map(c => [c.id, c.name + ' (รับ)'])];
  return pageHead('รายรับ-รายจ่าย', 'จดทุกรายการเพื่อให้ภาพรวมและการประเมินแม่นยำ', monthNav() + `<button class="btn primary" data-act="tx-add">${ic('plus', 18)}บันทึกรายการ</button>`) +
    `<section class="card kpis" style="margin-bottom:16px"><div><span>รายรับ</span><b class="inc">${money(st.income)}</b></div><div><span>รายจ่าย</span><b class="exp">${money(st.expense)}</b></div><div><span>คงเหลือ</span><b class="${st.net < 0 ? 'exp' : ''}">${money(st.net)}</b></div><div><span>อัตราการออม</span><b>${st.rate === null ? '—' : pct(st.rate)}</b></div></section>
    <section class="card"><div class="filters"><div class="seg" role="group" aria-label="กรองประเภท">${[['all', 'ทั้งหมด'], ['income', 'รายรับ'], ['expense', 'รายจ่าย']].map(([v, t]) => `<label><input type="radio" name="txf" value="${v}" data-change="tx-filter" ${ui.txType === v ? 'checked' : ''}><span>${t}</span></label>`).join('')}</div>
    <select data-change="tx-cat" aria-label="กรองหมวดหมู่"><option value="all">ทุกหมวดหมู่</option>${cats.map(([v, t]) => `<option value="${v}" ${ui.txCat === v ? 'selected' : ''}>${t}</option>`).join('')}</select>
    <input type="search" data-input="tx-q" placeholder="ค้นหา เช่น กาแฟ" value="${esc(ui.q)}" aria-label="ค้นหารายการ"></div><div id="txlist">${txListHTML()}</div></section>`;
}

/* ============ BILLS ============ */
const freqText = b => b.freq === 'monthly' ? `ทุกเดือน วันที่ ${b.dueDay}` : b.freq === 'yearly' ? `ทุกปี ${b.dueDay} ${TH_M[(b.dueMonth || 1) - 1]}` : `ครั้งเดียว ${b.dueDate ? fmtDate(b.dueDate) : ''}`;
function pageBills() {
  const items = billsForMonth(ui.ym), total = sum(items, i => i.bill.amount), paid = sum(items.filter(i => i.paid), i => i.bill.amount);
  const monthlyAvg = sum(state.bills.filter(b => b.active !== false), b => b.freq === 'monthly' ? b.amount : b.freq === 'yearly' ? b.amount / 12 : 0);
  const odd = state.bills.filter(b => b.active === false);
  return pageHead('รายการต้องจ่าย', 'บิลและค่าใช้จ่ายประจำ ติ๊กเมื่อจ่ายแล้ว ระบบจะบันทึกเป็นรายจ่ายให้อัตโนมัติ', monthNav() + `<button class="btn primary" data-act="bill-add">${ic('plus', 18)}เพิ่มรายการ</button>`) +
    `<div class="stack"><section class="card"><div style="display:flex;flex-wrap:wrap;justify-content:space-between;gap:10px;margin-bottom:10px"><div><span class="muted">จ่ายแล้ว</span><div class="big">${money(paid)} <span class="muted" style="font-size:16px">จาก ${money(total)}</span></div></div><div style="text-align:right"><span class="muted">ยังต้องจ่าย</span><div class="big ${total - paid > 0 ? 'wrn' : 'inc'}">${money(total - paid)}</div></div></div>${bar(paid, total, 'green', 'lg')}${monthlyAvg > 0 ? `<small class="muted" style="display:block;margin-top:10px">ภาระประจำเฉลี่ยเดือนละ ${money(monthlyAvg)} (รวมรายปีหารเฉลี่ยแล้ว)</small>` : ''}</section>
    <section class="card"><h2>รายการของ${ymLabel(ui.ym)}</h2>${items.length ? `<ul class="list">${items.map(it => { const s = billStatus(it), d = parseD(it.date); return `<li class="row" style="grid-template-columns:auto minmax(0,1fr) auto auto"><div class="daybadge ${s === 'paid' ? 'paid' : s === 'overdue' ? 'late' : ''}">${d.getDate()}<small>${TH_M[d.getMonth()]}</small></div><div class="row-main"><b>${esc(it.bill.name)}</b><small>${catOf('expense', it.bill.cat).name} · ${s === 'overdue' ? 'เลยกำหนดแล้ว' : s === 'soon' ? 'ใกล้ครบกำหนด' : s === 'paid' ? 'จ่ายแล้ว' : freqText(it.bill)}</small></div><span class="amt">${moneyx(it.bill.amount)}</span><button class="check ${it.paid ? 'on' : ''}" data-act="bill-toggle" data-id="${it.bill.id}" aria-pressed="${it.paid}">${ic('check', 16)}${it.paid ? 'จ่ายแล้ว' : 'จ่ายแล้ว?'}</button></li>`; }).join('')}</ul>` : empty('ไม่มีรายการต้องจ่ายในเดือนนี้', state.bills.length ? 'รายการที่ตั้งไว้ไม่ตรงกับเดือนนี้' : 'ตั้งค่าเช่า ค่าไฟ ค่าน้ำ ค่าอินเทอร์เน็ต ค่าสมาชิกต่างๆ ไว้ แล้วดูได้ว่าเดือนนี้เหลือต้องจ่ายอะไรบ้าง', `<button class="btn primary" data-act="bill-add">${ic('plus', 18)}เพิ่มรายการต้องจ่าย</button>`)}</section>
    ${state.bills.length ? `<section class="card"><h2>รายการที่ตั้งไว้ทั้งหมด</h2><ul class="list">${state.bills.map(b => `<li class="row" style="grid-template-columns:minmax(0,1fr) auto auto"><div class="row-main"><b>${esc(b.name)} ${b.active === false ? chip('พักไว้') : ''}</b><small>${freqText(b)} · ${catOf('expense', b.cat).name}</small></div><span class="amt">${moneyx(b.amount)}</span><div class="row-actions">${iconBtn('bill-pause', b.active === false ? 'check' : 'pause', b.active === false ? 'เปิดใช้งาน' : 'พักรายการ', `data-id="${b.id}"`)}${iconBtn('bill-edit', 'edit', 'แก้ไข', `data-id="${b.id}"`)}${iconBtn('bill-del', 'trash', 'ลบ', `data-id="${b.id}"`)}</div></li>`).join('')}</ul></section>` : ''}</div>`;
}

/* ============ SAVINGS ============ */
function pageSave() {
  const tabs = `<div class="tabs" role="tablist"><button class="tab" role="tab" data-act="tab" data-t="pots" aria-selected="${ui.saveTab === 'pots'}">กระปุกเงินเก็บ</button><button class="tab" role="tab" data-act="tab" data-t="plans" aria-selected="${ui.saveTab === 'plans'}">แบบออมเงิน</button></div>`;
  const act = ui.saveTab === 'pots' ? `<button class="btn primary" data-act="pot-add">${ic('plus', 18)}สร้างกระปุก</button>` : `<button class="btn primary" data-act="plan-add">${ic('plus', 18)}สร้างแบบออมเงิน</button>`;
  return pageHead('เงินเก็บ & แบบออมเงิน', 'แยกเงินเก็บเป็นกระปุกตามวัตถุประสงค์ และเลือกแบบออมที่เหมาะกับนิสัยของคุณ', tabs + act) + (ui.saveTab === 'pots' ? potsView() : plansView());
}
function potsView() {
  if (!state.pots.length) return empty('ยังไม่มีกระปุกเงินเก็บ', 'เริ่มจากกระปุกเงินสำรองฉุกเฉิน แล้วค่อยแยกกระปุกอื่นๆ ตามเป้าหมาย เช่น เที่ยว ซื้อของใหญ่ ดาวน์บ้าน', `<button class="btn primary" data-act="pot-preset">สร้างกระปุกเงินสำรองฉุกเฉิน</button><button class="btn" data-act="pot-add">สร้างกระปุกอื่น</button>`);
  const total = potsTotal(), av = avgBasis();
  return `<div class="stack"><section class="card" style="display:flex;flex-wrap:wrap;gap:14px 40px;align-items:center"><div><span class="muted">เงินเก็บทั้งหมด</span><div class="big sav">${money(total)}</div></div>${av.expense > 0 ? `<div><span class="muted">ใช้ชีวิตได้นาน (ตามรายจ่ายเฉลี่ย)</span><div class="big">${(total / av.expense).toFixed(1)} เดือน</div></div>` : ''}<div><span class="muted">ออมแล้วเดือนนี้</span><div class="big">${money(savedInMonth(curYm()))}</div></div></section>
  <div class="grid3">${state.pots.map(p => { const b = potBal(p); return `<section class="card pot"><div class="pot-top"><div><h3>${esc(p.name)}</h3>${p.kind === 'emergency' ? chip('เงินสำรองฉุกเฉิน', 'sv') : ''}</div>${iconBtn('pot-edit', 'edit', 'แก้ไข', `data-id="${p.id}"`)}</div><div class="big">${money(b)}</div>${p.target > 0 ? `${bar(b, p.target, 'purple')}<div class="meta"><span>เป้า ${money(p.target)}</span><span>${pct(clamp(b / p.target * 100, 0, 100) / 100)}${b >= p.target ? ' · ครบแล้ว' : ' · ขาดอีก ' + money(p.target - b)}</span></div>` : '<div class="meta"><span>ไม่ได้ตั้งยอดเป้าหมาย</span></div>'}<div class="card-actions"><button class="btn sm primary" data-act="pot-dep" data-id="${p.id}">ฝาก</button><button class="btn sm" data-act="pot-wd" data-id="${p.id}">ถอน</button><button class="btn sm ghost" data-act="pot-hist" data-id="${p.id}">${ic('list', 16)}ประวัติ</button><button class="btn sm ghost danger" data-act="pot-del" data-id="${p.id}">ลบ</button></div></section>`; }).join('')}</div></div>`;
}
const PLAN_KIND = { week52: 'ออม 52 สัปดาห์', weekly: 'ออมรายสัปดาห์', monthly: 'ออมรายเดือน', daily: 'ท้าทายรายวัน', percent: 'ออมเป็น % ของรายได้' };
function plansView() {
  const tpl = `<div class="tpl">${[['week52', 'ออม 52 สัปดาห์', 'สัปดาห์แรกออมน้อย แล้วเพิ่มทีละขั้นจนครบปี เหมาะกับคนอยากสร้างนิสัย'], ['monthly', 'ออมรายเดือนเท่าๆ กัน', 'ตั้งยอดคงที่ทุกเดือน ง่ายและสม่ำเสมอ'], ['weekly', 'ออมรายสัปดาห์', 'ยอดเท่ากันทุกสัปดาห์ เหมาะกับรายได้รายวัน/รายสัปดาห์'], ['daily', 'ท้าทายรายวัน (30–100 วัน)', 'ออมวันละนิดเป็นชาเลนจ์สั้นๆ'], ['percent', 'ออมเป็น % ของรายได้', 'กันเงินตามสัดส่วนรายได้ทุกเดือน เช่น 15%']].map(([k, t, d]) => `<button data-act="plan-add" data-kind="${k}"><b>${t}</b><span>${d}</span></button>`).join('')}</div>`;
  if (!state.plans.length) return `<section class="card"><h2>เลือกแบบออมเงินที่เหมาะกับคุณ</h2>${tpl}</section>`;
  return `<div class="stack">${state.plans.map(pl => {
    const sv = planSaved(pl), tot = planTotal(pl), exp = planExpected(pl), done = pl.steps.filter(s => s.done).length, behind = Math.max(0, exp - done), pot = state.pots.find(p => p.id === pl.potId);
    const nextIdx = pl.steps.findIndex(s => !s.done), short = ['week52', 'weekly', 'daily'].includes(pl.kind);
    return `<section class="card item"><div class="pot-top"><div><h3>${esc(pl.name)}</h3><div class="meta"><span>${PLAN_KIND[pl.kind]}</span><span>เริ่ม ${fmtDate(pl.start)}</span><span>${pot ? 'ฝากเข้า ' + esc(pot.name) : 'ไม่ผูกกระปุก'}</span></div></div><div style="text-align:right"><div class="big sav">${money(sv)}</div><small class="muted">จาก ${money(tot)}</small></div></div>${bar(sv, tot, 'purple')}
    <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center">${done >= pl.steps.length ? chip('ครบแผนแล้ว', 'ok') : behind > 0 ? chip(`ตามหลัง ${behind} งวด`, 'bad') : exp > 0 ? chip('ตามแผน', 'ok') : chip('ยังไม่เริ่ม', 'info')}<small class="muted">ทำแล้ว ${done}/${pl.steps.length} งวด · แตะที่ช่องเพื่อติ๊กว่าออมแล้ว</small></div>
    <div class="steps">${pl.steps.map((s, i) => `<button class="step ${s.done ? 'done' : i < exp ? 'late' : ''} ${i === nextIdx ? 'next' : ''}" data-act="step" data-id="${pl.id}" data-i="${i}" aria-pressed="${!!s.done}" aria-label="${esc(s.label)} ${money(s.amount)} ${s.done ? 'ออมแล้ว' : 'ยังไม่ได้ออม'}"><span>${short ? i + 1 : esc(s.label)}</span><b>${nf0.format(s.amount)}</b></button>`).join('')}</div>
    <div class="card-actions"><button class="btn sm ghost danger" data-act="plan-del" data-id="${pl.id}">${ic('trash', 16)}ลบแผนนี้</button></div></section>`; }).join('')}
  <section class="card"><h2>เพิ่มแบบออมเงินอื่น</h2>${tpl}</section></div>`;
}

/* ============ DEBTS ============ */
function pageDebt() {
  const act = state.debts.filter(d => d.balance > 0.005), total = sum(state.debts, d => d.balance), minTotal = sum(act, d => d.minPay || 0), inc = expectedIncome();
  const wRate = total > 0 ? sum(act, d => d.balance * (d.rate || 0)) / total : 0;
  let html = pageHead('หนี้สิน', 'ติดตามยอดคงเหลือ ดอกเบี้ย และวางแผนปิดหนี้ให้เร็วที่สุด', `<button class="btn primary" data-act="debt-add">${ic('plus', 18)}เพิ่มหนี้</button>`);
  if (!state.debts.length) return html + empty('ยังไม่มีหนี้สิน', 'ถ้ามีบัตรเครดิต ผ่อนรถ ผ่อนมือถือ หรือกู้เรียน ลองเพิ่มไว้ แอพจะคำนวณว่าปิดหนี้ได้เมื่อไหร่ และควรปิดตัวไหนก่อน', `<button class="btn primary" data-act="debt-add">${ic('plus', 18)}เพิ่มหนี้แรก</button>`);
  html += `<div class="stack"><section class="card kpis"><div><span>หนี้คงเหลือรวม</span><b class="exp">${money(total)}</b></div><div><span>ผ่อนขั้นต่ำต่อเดือน</span><b>${money(minTotal)}</b></div><div><span>ดอกเบี้ยเฉลี่ย</span><b>${wRate.toFixed(1)}%<small class="muted" style="font-size:14px"> ต่อปี</small></b></div><div><span>ภาระต่อรายได้</span><b class="${inc > 0 && minTotal / inc > .35 ? 'exp' : ''}">${inc > 0 ? pct(minTotal / inc) : '—'}</b></div></section>`;
  html += `<div class="grid3">${state.debts.map(d => {
    const paidPct = d.principal > 0 ? clamp((1 - d.balance / d.principal) * 100, 0, 100) : 0, po = payoffInfo(d.balance, d.rate || 0, d.minPay || 0), cleared = d.balance <= 0.005;
    let est = ''; if (!cleared) { if (!d.minPay) est = '<span class="wrn">ยังไม่ได้ระบุยอดผ่อนต่อเดือน</span>'; else if (po.months === Infinity) est = '<span class="exp">ยอดผ่อนไม่พอครอบคลุมดอกเบี้ย หนี้จะไม่ลดลง</span>'; else { const end = shiftYm(curYm(), po.months); est = `ปิดหนี้ในอีก <b>${po.months}</b> เดือน (ราว ${ymShort(end)})${po.interest > 1 ? ` · ดอกเบี้ยรวมประมาณ ${money(po.interest)}` : ''}`; } }
    return `<section class="card item"><div class="pot-top"><div><h3>${esc(d.name)}</h3><div class="meta"><span>${esc(d.type)}</span>${d.dueDay ? `<span>ครบกำหนดวันที่ ${d.dueDay}</span>` : ''}</div></div>${cleared ? chip('ปลอดหนี้แล้ว', 'ok') : iconBtn('debt-edit', 'edit', 'แก้ไข', `data-id="${d.id}"`)}</div><div class="big ${cleared ? 'inc' : 'exp'}">${money(d.balance)}</div>${bar(paidPct, 100, 'green')}<div class="meta"><span>จ่ายไปแล้ว ${paidPct.toFixed(0)}%</span><span>ดอกเบี้ย ${d.rate || 0}% ต่อปี</span><span>ผ่อนเดือนละ ${money(d.minPay || 0)}</span></div>${est ? `<div style="font-size:14.5px">${est}</div>` : ''}<div class="card-actions">${cleared ? '' : `<button class="btn sm primary" data-act="debt-pay" data-id="${d.id}">บันทึกการชำระ</button>`}<button class="btn sm ghost" data-act="debt-hist" data-id="${d.id}">${ic('list', 16)}ประวัติ</button>${cleared ? iconBtn('debt-edit', 'edit', 'แก้ไข', `data-id="${d.id}"`) : ''}<button class="btn sm ghost danger" data-act="debt-del" data-id="${d.id}">ลบ</button></div></section>`; }).join('')}</div>`;
  if (act.length) {
    const base = simulateDebts(act, 0, 'avalanche'), av = simulateDebts(act, ui.extra, 'avalanche'), sn = simulateDebts(act, ui.extra, 'snowball');
    const bestKey = av.interest <= sn.interest ? 'av' : 'sn';
    const cell = (r, t, d, key) => `<div class="${bestKey === key ? 'best' : ''}"><h4>${t} ${bestKey === key ? chip('ประหยัดกว่า', 'ok') : ''}</h4><div class="muted" style="font-size:13.5px;margin-bottom:6px">${d}</div>${r.months === Infinity ? '<b class="exp">ไม่สามารถปิดหนี้ได้ด้วยงบนี้</b>' : `ปิดหนี้หมดใน <b>${r.months}</b> เดือน<br>ดอกเบี้ยรวม <b>${money(r.interest)}</b>${base.months !== Infinity && base.interest > r.interest + 1 ? `<br><span class="inc">ประหยัดดอกเบี้ย ${money(base.interest - r.interest)}</span>` : ''}<ol class="order">${r.order.map(o => `<li>${esc(o.name)} <span>(เดือนที่ ${o.at})</span></li>`).join('')}</ol>`}</div>`;
    html += `<section class="card"><h2>วางแผนปิดหนี้</h2><p class="muted" style="margin-bottom:12px">ใส่เงินที่พอจ่ายเพิ่มต่อเดือนนอกเหนือจากยอดผ่อนขั้นต่ำ แล้วเทียบสองวิธีว่าแบบไหนปิดหนี้เร็วและเสียดอกเบี้ยน้อยกว่า</p><div class="fld" style="max-width:320px"><label for="extra">จ่ายเพิ่มต่อเดือน (บาท)</label><input id="extra" type="number" inputmode="decimal" min="0" step="any" value="${ui.extra || ''}" placeholder="0" data-change="extra"></div><div class="compare">${cell(av, 'ดอกเบี้ยสูงสุดก่อน', 'โปะหนี้ที่ดอกเบี้ยสูงสุดก่อน ประหยัดดอกเบี้ยมากที่สุด', 'av')}${cell(sn, 'ยอดน้อยสุดก่อน', 'ปิดก้อนเล็กให้หมดเร็ว ได้กำลังใจ แล้วต่อก้อนใหญ่', 'sn')}</div></section>`;
  }
  return html + '</div>';
}

/* ============ GOALS ============ */
function pageGoals() {
  const head = pageHead('เป้าหมาย', 'ตั้งเป้าหมายการเงิน แล้วดูว่าต้องเก็บเดือนละเท่าไหร่ถึงจะทัน', `<button class="btn primary" data-act="goal-add">${ic('plus', 18)}ตั้งเป้าหมาย</button>`);
  if (!state.goals.length) return head + empty('ยังไม่มีเป้าหมาย', 'เช่น เที่ยวต่างประเทศ ดาวน์รถ เงินก้อนแต่งงาน หรือเงินเกษียณ ตั้งยอดและวันที่อยากได้ แอพจะคำนวณยอดออมต่อเดือนให้', `<button class="btn primary" data-act="goal-add">${ic('plus', 18)}ตั้งเป้าหมายแรก</button>`);
  const av = avgBasis(), surplus = Math.max(0, av.income - av.expense);
  return head + `<div class="grid3">${state.goals.map(g => {
    const s = goalSaved(g), done = s >= g.target, rem = Math.max(0, g.target - s), pot = goalPot(g);
    let line = '', status = '';
    if (done) status = chip('สำเร็จแล้ว', 'ok');
    else if (g.deadline) { const ml = monthsBetween(today(), g.deadline) + (parseD(g.deadline).getDate() >= new Date().getDate() ? 0 : -1); if (g.deadline < today()) { status = chip('เลยกำหนด', 'bad'); line = `ยังขาด ${money(rem)}`; } else { const m = Math.max(1, ml), need = rem / m; line = `เหลือ ${m} เดือน ต้องออมเดือนละ <b>${money(need)}</b>`; status = surplus > 0 ? (need <= surplus ? chip('ทำได้ตามรายได้ปัจจุบัน', 'ok') : chip('เกินกว่าเงินเหลือเฉลี่ย', 'warn')) : ''; } }
    return `<section class="card item"><div class="pot-top"><div><h3>${esc(g.name)}</h3><div class="meta">${g.deadline ? `<span>กำหนด ${fmtDate(g.deadline)}</span>` : '<span>ไม่กำหนดวันที่</span>'}${pot ? `<span>ผูกกับ ${esc(pot.name)}</span>` : ''}</div></div>${iconBtn('goal-edit', 'edit', 'แก้ไข', `data-id="${g.id}"`)}</div>
    <div><span class="big">${money(s)}</span> <span class="muted">จาก ${money(g.target)}</span></div>${bar(s, g.target, done ? 'green' : '', 'lg')}<div class="meta"><span>${pct(clamp(s / g.target * 100) / 100)}</span>${!done ? `<span>ขาดอีก ${money(rem)}</span>` : ''}</div>${line ? `<div>${line}</div>` : ''}${status ? `<div>${status}</div>` : ''}${g.note ? `<small class="muted">${esc(g.note)}</small>` : ''}
    <div class="card-actions">${done ? '' : `<button class="btn sm primary" data-act="goal-dep" data-id="${g.id}">เพิ่มเงิน</button>`}${pot ? '' : `<button class="btn sm ghost" data-act="goal-hist" data-id="${g.id}">${ic('list', 16)}ประวัติ</button>`}<button class="btn sm ghost danger" data-act="goal-del" data-id="${g.id}">ลบ</button></div></section>`; }).join('')}</div>`;
}

/* ============ WISHLIST ============ */
const PRI = { 3: ['อยากมาก', 'bad'], 2: ['อยากพอควร', 'warn'], 1: ['อยากได้เฉยๆ', ''] };
function pageWish() {
  const head = pageHead('ของที่อยากได้', 'จดไว้ก่อน รอ 30 วันแล้วค่อยตัดสินใจ ช่วยลดการซื้อตามอารมณ์', `<button class="btn primary" data-act="wish-add">${ic('plus', 18)}เพิ่มของที่อยากได้</button>`);
  const want = state.wishes.filter(w => w.status !== 'bought').sort((a, b) => b.priority - a.priority || a.price - b.price), bought = state.wishes.filter(w => w.status === 'bought');
  if (!state.wishes.length) return head + empty('ยังไม่มีของที่อยากได้', 'เห็นของที่อยากได้ ให้มาจดไว้ที่นี่ก่อน แอพจะบอกว่าต้องเก็บกี่เดือน และเตือนให้รอครบ 30 วันก่อนตัดสินใจ', `<button class="btn primary" data-act="wish-add">${ic('plus', 18)}เพิ่มชิ้นแรก</button>`);
  const av = avgBasis(), surplus = Math.max(0, av.income - av.expense), totalPrice = sum(want, w => w.price);
  return head + `<div class="stack">${want.length ? `<section class="card kpis" style="grid-template-columns:repeat(3,minmax(0,1fr))"><div><span>จำนวนที่อยากได้</span><b>${want.length} ชิ้น</b></div><div><span>ราคารวม</span><b>${money(totalPrice)}</b></div><div><span>ใช้เวลาเก็บรวม</span><b>${surplus > 0 ? Math.ceil(totalPrice / surplus) + ' เดือน' : '—'}</b></div></section>` : ''}
  <div class="grid3">${want.map(w => {
    const days = dayDiff(w.added, today()), wait = Math.max(0, 30 - days), mo = surplus > 0 ? Math.ceil(w.price / surplus) : null;
    return `<section class="card item"><div class="pot-top"><div><h3>${esc(w.name)}</h3>${chip(PRI[w.priority][0], PRI[w.priority][1])}</div>${iconBtn('wish-edit', 'edit', 'แก้ไข', `data-id="${w.id}"`)}</div><div class="big">${money(w.price)}</div>
    <div>${bar(clamp(days, 0, 30), 30, wait ? 'amber' : 'green')}<small class="muted">${wait ? `รอมาแล้ว ${days} วัน เหลืออีก ${wait} วันถึงครบกฎ 30 วัน` : `ครบ 30 วันแล้ว ถ้ายังอยากได้อยู่ ถือว่าคิดมาดีแล้ว`}</small></div>
    <div class="meta">${mo ? `<span>เก็บจากเงินเหลือเฉลี่ย ≈ ${mo} เดือน</span>` : '<span>ยังคำนวณเวลาเก็บไม่ได้</span>'}</div>${w.note ? `<small class="muted">${esc(w.note)}</small>` : ''}
    <div class="card-actions"><button class="btn sm primary" data-act="wish-buy" data-id="${w.id}">ซื้อแล้ว</button><button class="btn sm" data-act="wish-goal" data-id="${w.id}">ตั้งเป็นเป้าหมาย</button><button class="btn sm ghost danger" data-act="wish-del" data-id="${w.id}">ลบ</button></div></section>`; }).join('')}</div>
  ${bought.length ? `<section class="card"><div class="card-h"><span>ซื้อแล้ว (${bought.length})</span><button class="linkbtn" data-act="wish-show">${ui.showBought ? 'ซ่อน' : 'แสดง'}</button></div>${ui.showBought ? `<ul class="list">${bought.map(w => `<li class="row" style="grid-template-columns:minmax(0,1fr) auto auto"><div class="row-main"><b>${esc(w.name)}</b><small>ซื้อเมื่อ ${w.boughtDate ? fmtDate(w.boughtDate) : ''}</small></div><span class="amt">${money(w.price)}</span>${iconBtn('wish-del', 'trash', 'ลบ', `data-id="${w.id}"`)}</li>`).join('')}</ul>` : ''}</section>` : ''}</div>`;
}

/* ============ BUDGET MANAGEMENT ============ */
const RATIO_PRESETS = { '50,30,20': 'สมดุล 50/30/20', '60,20,20': 'เน้นจำเป็น 60/20/20', '50,20,30': 'เน้นออม 50/20/30', '70,20,10': 'ภาระหนัก 70/20/10' };
function catBudgetRow(c, spent, limit) {
  const ratio = limit > 0 ? spent / limit : 0, cls = limit <= 0 ? '' : ratio > 1 ? 'red' : ratio >= .8 ? 'amber' : 'green';
  return `<div class="catrow" id="cb_${c.id}"><div class="nm"><span class="dot" style="background:${c.color}"></span>${c.name}</div><div class="inline-in sm"><input type="number" inputmode="decimal" min="0" step="any" value="${limit || ''}" placeholder="ไม่จำกัด" data-change="cat-limit" data-cat="${c.id}" aria-label="งบ ${c.name}"></div>${limit > 0 ? bar(spent, limit, cls) : '<span></span>'}<div class="st">${limit > 0 ? (ratio > 1 ? `<span class="exp">เกิน ${money(spent - limit)}</span>` : `เหลือ ${money(limit - spent)}`) : `ใช้ ${money(spent)}`}</div></div>`;
}
function cbSummary(st) {
  const b = state.settings.budgets, tb = sum(CATS_EXP, c => b[c.id] || 0), ts = sum(CATS_EXP.filter(c => b[c.id] > 0), c => st.byCat[c.id] || 0);
  return tb > 0 ? `<p style="margin-bottom:6px">รวมงบ <b>${money(tb)}</b> · ใช้ไป <b class="${ts > tb ? 'exp' : ''}">${money(ts)}</b> (เฉพาะหมวดที่ตั้งงบ)</p>` : '<p class="muted" style="margin-bottom:6px">ใส่งบสูงสุดที่ยอมใช้ในแต่ละหมวดต่อเดือน ระบบจะเตือนเมื่อใกล้ถึงและเมื่อเกิน</p>';
}
function pageBudget() {
  const ym = ui.ym, pl = monthPlan(ym), st = pl.st, s = state.settings, R = s.ratio, flexLeft = pl.flexBudget - pl.flexSpent;
  const now = new Date(), dl = ym === curYm() ? daysIn(now.getFullYear(), now.getMonth() + 1) - now.getDate() + 1 : 0;
  const rKey = R.join(',');
  const rows = [['จำเป็น', R[0], st.need, 'need'], ['อยากได้/ใช้ตามใจ', R[1], st.want, 'want']];
  const L = (l, v, cls = '', tot = '') => `<li class="${tot}"><span class="l">${l}</span><span class="dots"></span><span class="v ${cls}">${v}</span></li>`;
  return pageHead('บริหารเงิน', 'วางแผนว่ารายได้แต่ละเดือนจะไปอยู่ตรงไหน แล้วคุมให้อยู่ในงบ', monthNav()) +
    `<div class="stack"><section class="card"><h2>แผนเงินเดือนนี้ ไล่จากบนลงล่าง</h2><div class="grid2" style="margin-bottom:6px"><div class="fld"><label for="bi">รายได้ต่อเดือนที่ใช้วางแผน (บาท)</label><input id="bi" type="number" inputmode="decimal" min="0" step="any" value="${s.baseIncome || ''}" placeholder="${expectedIncome() ? 'เฉลี่ยจากข้อมูล ' + nf0.format(Math.round(expectedIncome())) : 'เช่น 30000'}" data-change="base-income"><small class="hint">เว้นว่างไว้ แอพจะใช้ค่าเฉลี่ยรายรับย้อนหลังให้</small></div><div class="fld"><label for="sp">กันเงินออมไว้ทุกเดือน (% ของรายได้)</label><input id="sp" type="number" inputmode="decimal" min="0" max="100" step="any" value="${s.savePct}" data-change="save-pct"><small class="hint">แนะนำ 10–20% เพื่อจ่ายตัวเองก่อนใช้จ่าย</small></div></div>
    ${pl.basis > 0 ? `<ul class="ledger">${L('รายได้ที่ใช้วางแผน', money(pl.basis), 'inc')}${L('หัก บิลและรายการต้องจ่าย', '−' + money(pl.billsTotal))}${L('หัก ผ่อนหนี้ขั้นต่ำ', '−' + money(pl.debtMin))}${L(`หัก เงินออม ${s.savePct}%`, '−' + money(pl.saveTarget), 'sav')}${L('งบใช้จ่ายอื่นๆ ทั้งเดือน', money(pl.flexBudget), pl.flexBudget < 0 ? 'exp' : '', 'total')}</ul>
    <div style="margin-top:14px">${pl.flexBudget > 0 ? bar(pl.flexSpent, pl.flexBudget, pl.flexSpent > pl.flexBudget ? 'red' : pl.flexSpent > pl.flexBudget * .8 ? 'amber' : 'green', 'lg') : ''}<p style="margin-top:8px">${pl.flexBudget <= 0 ? '<span class="exp">รายได้ไม่พอสำหรับบิล ผ่อนหนี้ และเงินออมที่กันไว้ ลองลดเปอร์เซ็นต์ออมชั่วคราว หรือเพิ่มรายได้ที่คาดไว้</span>' : `ใช้ไปแล้ว <b>${money(pl.flexSpent)}</b> จากงบ ${money(pl.flexBudget)} · ${flexLeft >= 0 ? `เหลือ <b class="inc">${money(flexLeft)}</b>${dl ? ` (วันละ ${money(flexLeft / dl)})` : ''}` : `<b class="exp">เกินงบ ${money(-flexLeft)}</b>`}`}</p></div>` : '<p class="muted">ใส่รายได้ต่อเดือนด้านบน หรือบันทึกรายรับ เพื่อให้แอพคำนวณแผนให้</p>'}</section>
    <section class="card"><h2>กฎแบ่งรายได้ จำเป็น / ตามใจ / ออม</h2><div class="fld" style="max-width:360px"><label for="rp">รูปแบบ</label><select id="rp" data-change="ratio-preset">${Object.entries(RATIO_PRESETS).map(([k, t]) => `<option value="${k}" ${rKey === k ? 'selected' : ''}>${t}</option>`).join('')}${RATIO_PRESETS[rKey] ? '' : `<option value="${rKey}" selected>กำหนดเอง ${R.join('/')}</option>`}</select></div>
    ${pl.basis > 0 ? `${rows.map(([n, p, act]) => { const tg = pl.basis * p / 100; return `<div style="margin-bottom:16px"><div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap"><b style="font-weight:600">${n} ${p}%</b><span class="num">ใช้ ${money(act)} จากงบ ${money(tg)}</span></div>${bar(act, tg, act > tg ? 'red' : act > tg * .85 ? 'amber' : 'green')}</div>`; }).join('')}<div><div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap"><b style="font-weight:600">ออม ${R[2]}%</b><span class="num">ออมแล้ว ${money(pl.savedSoFar)} จากเป้า ${money(pl.basis * R[2] / 100)}</span></div>${bar(pl.savedSoFar, pl.basis * R[2] / 100, 'purple')}</div>` : '<p class="muted">รอข้อมูลรายได้</p>'}
    <small class="hint" style="display:block;margin-top:12px">หมวดจำเป็น ได้แก่ อาหาร เดินทาง ที่อยู่ น้ำไฟ สุขภาพ ประกัน ครอบครัว การศึกษา และผ่อนหนี้ ส่วนกินนอกบ้าน ช้อปปิ้ง บันเทิง นับเป็นตามใจ</small></section>
    <section class="card"><div class="card-h"><span>งบรายหมวด</span><span class="btnrow"><button class="btn sm" data-act="budget-auto">ตั้งจากค่าเฉลี่ยย้อนหลัง</button><button class="btn sm ghost" data-act="budget-clear">ล้างงบ</button></span></div>
    <div id="cbsum">${cbSummary(st)}</div>
    ${CATS_EXP.map(c => catBudgetRow(c, st.byCat[c.id] || 0, s.budgets[c.id] || 0)).join('')}</section></div>`;
}

/* ============ ASSESSMENT ============ */
function pageAssess() {
  const head = pageHead('ประเมินการเงิน', 'ให้คะแนนสุขภาพการเงินจากข้อมูลที่คุณบันทึก พร้อมบอกว่าควรแก้อะไรก่อน');
  const A = assess();
  if (!A) return head + empty('ยังประเมินไม่ได้', 'ต้องมีรายรับและรายจ่ายอย่างน้อย 1 เดือน จึงจะคำนวณอัตราการออมและภาระหนี้ได้', `<button class="btn primary" data-act="tx-add">${ic('plus', 18)}บันทึกรายการ</button>`);
  if (A.noIncome) return head + empty('ยังไม่มีรายรับ', 'เพิ่มรายรับ (เช่น เงินเดือน) อย่างน้อย 1 รายการ เพื่อให้คำนวณสัดส่วนต่างๆ ได้', `<button class="btn primary" data-act="tx-add" data-type="income">บันทึกรายรับ</button>`);
  const monthly = ui.projMonthly ?? Math.max(0, Math.round(A.inc - A.exp)), rate = state.settings.projRate;
  return head + `<div class="stack"><div class="grid-wide"><section class="card" style="display:grid;gap:16px;align-content:start"><h2 style="margin:0">คะแนนสุขภาพการเงิน</h2>${gauge(A.score, A.grade)}<p class="muted" style="text-align:center">คำนวณจากค่าเฉลี่ย ${A.av.n} เดือน (${A.av.months.map(ymShort).join(', ')})<br>รายรับเฉลี่ย ${money(A.inc)} · รายจ่ายเฉลี่ย ${money(A.exp)}</p></section>
  <section class="card"><h2>สิ่งที่ควรทำก่อน</h2>${A.todo.length ? `<ol class="todo">${A.todo.map(m => `<li><b>${m.title}</b> (${m.value}) <div class="muted">${m.advice}</div></li>`).join('')}</ol>` : '<p>ทุกด้านอยู่ในเกณฑ์ดี รักษาวินัยไว้ และลองตั้งเป้าหมายใหม่ที่ใหญ่ขึ้น</p>'}</section></div>
  <section class="card"><h2>ผลรายด้าน</h2>${A.M.map(m => `<div class="metric"><h3>${m.title}</h3>${chip(m.score + '/100', m.status === 'good' ? 'ok' : m.status === 'fair' ? 'warn' : 'bad')}<div class="muted" style="grid-column:1/-1;font-size:14px">ตอนนี้ <b style="color:var(--ink)">${m.value}</b> · ${m.target}</div>${bar(m.score, 100, m.status === 'good' ? 'green' : m.status === 'fair' ? 'amber' : 'red')}<p>${m.advice}</p></div>`).join('')}</section>
  <section class="card"><h2>ถ้าออมต่อเนื่อง เงินจะเป็นเท่าไหร่</h2><div class="grid2" style="margin-bottom:8px"><div class="fld"><label for="pm">ออมต่อเดือน (บาท)</label><input id="pm" type="number" inputmode="decimal" min="0" step="any" value="${monthly}" data-change="proj-monthly"><small class="hint">ตั้งต้นจากรายรับเฉลี่ยหักรายจ่ายเฉลี่ย</small></div><div class="fld"><label for="pr">ผลตอบแทนต่อปี (%)</label><input id="pr" type="number" inputmode="decimal" min="0" step="any" value="${rate}" data-change="proj-rate"><small class="hint">เงินฝากทั่วไป 1–2% ตราสารหนี้/กองทุนผสม 3–5%</small></div></div>
  <table class="tbl"><thead><tr><th>ระยะเวลา</th><th>เงินต้นที่ออม</th><th>ผลตอบแทน</th><th>รวม</th></tr></thead><tbody>${[1, 5, 10, 20].map(y => { const tot = fv(A.total, monthly, rate, y), princ = A.total + monthly * y * 12; return `<tr><td>${y} ปี</td><td>${money(princ)}</td><td class="inc">${money(tot - princ)}</td><td><b>${money(tot)}</b></td></tr>`; }).join('')}</tbody></table><small class="hint" style="display:block;margin-top:10px">เป็นการประมาณการเบื้องต้น ไม่รวมเงินเฟ้อและภาษี ผลตอบแทนจริงขึ้นลงได้ ไม่ใช่คำแนะนำการลงทุน</small></section></div>`;
}

/* ============ SETTINGS ============ */
function pageSettings() {
  return pageHead('ตั้งค่าและข้อมูล', '') + `<div class="stack"><section class="card"><h2>ข้อมูลส่วนตัว</h2><div class="fld" style="max-width:360px"><label for="nm">ชื่อที่ให้แอพเรียก</label><input id="nm" type="text" value="${esc(state.settings.name)}" placeholder="เช่น ใบเตย" data-change="name"></div><p class="muted" id="sync2"></p></section>
  <section class="card"><h2>สำรองและย้ายข้อมูล</h2><p class="muted" style="margin-bottom:12px">ข้อมูลของคุณเก็บแยกเป็นส่วนตัว คนที่เปิดลิงก์เดียวกันจะไม่เห็นข้อมูลของคุณ แนะนำให้สำรองไฟล์ไว้เป็นระยะ</p><div class="btnrow"><button class="btn primary" data-act="export-xlsx">${ic('download', 18)}ส่งออก Excel (.xlsx)</button><button class="btn" data-act="export-json">${ic('download', 18)}สำรองข้อมูล (JSON)</button><button class="btn" data-act="export-csv">${ic('download', 18)}ส่งออกรายการ (CSV)</button><label class="btn" style="cursor:pointer">${ic('upload', 18)}กู้คืนจากไฟล์<input type="file" accept="application/json,.json" data-change="import-json" hidden></label></div></section>
  <section class="card"><h2>ล้างข้อมูล</h2><div class="btnrow"><button class="btn danger" data-act="reset">ลบข้อมูลทั้งหมด</button></div><small class="hint" style="display:block;margin-top:10px">ลบรายการการเงินทั้งหมดที่บันทึกไว้ในแอปนี้ การลบไม่สามารถย้อนกลับได้ แนะนำให้สำรองข้อมูลก่อน</small></section></div>`;
}

const pages = { home: pageHome, tx: pageTx, bills: pageBills, save: pageSave, debt: pageDebt, goals: pageGoals, wish: pageWish, budget: pageBudget, assess: pageAssess, settings: pageSettings };
