'use strict';
/* ============ helpers ============ */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);
const num = v => { const n = parseFloat(String(v ?? '').replace(/,/g, '')); return isFinite(n) ? n : 0; };
const sum = (a, f = x => x) => a.reduce((t, x) => t + f(x), 0);
const clamp = (x, a = 0, b = 100) => Math.max(a, Math.min(b, x));
const p2 = n => String(n).padStart(2, '0');

const TH_M = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
const TH_MF = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
const TH_D = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];

const toStr = d => d.getFullYear() + '-' + p2(d.getMonth() + 1) + '-' + p2(d.getDate());
const today = () => toStr(new Date());
const parseD = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const dayDiff = (a, b) => Math.round((parseD(b) - parseD(a)) / 86400000);
const curYm = () => today().slice(0, 7);
const shiftYm = (ym, n) => { const [y, m] = ym.split('-').map(Number); const d = new Date(y, m - 1 + n, 1); return d.getFullYear() + '-' + p2(d.getMonth() + 1); };
const monthsBetween = (a, b) => { const [y1, m1] = a.slice(0, 7).split('-').map(Number), [y2, m2] = b.slice(0, 7).split('-').map(Number); return (y2 - y1) * 12 + (m2 - m1); };
const daysIn = (y, m) => new Date(y, m, 0).getDate();
const ymLabel = ym => { const [y, m] = ym.split('-').map(Number); return TH_MF[m - 1] + ' ' + (y + 543); };
const ymShort = ym => { const [y, m] = ym.split('-').map(Number); return TH_M[m - 1] + ' ' + String(y + 543).slice(2); };
const fmtDate = s => { const d = parseD(s); return d.getDate() + ' ' + TH_M[d.getMonth()] + ' ' + (d.getFullYear() + 543); };
const fmtDay = s => { const d = parseD(s); return TH_D[d.getDay()] + 'ที่ ' + d.getDate() + ' ' + TH_MF[d.getMonth()]; };

const nf0 = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });
const nf2 = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const money = n => { const r = Math.round(n); return (r < 0 ? '-' : '') + '฿' + nf0.format(Math.abs(r)); };
const moneyx = n => { const a = Math.abs(n); return (n < -0.004 ? '-' : '') + '฿' + (Math.abs(a - Math.round(a)) < 0.005 ? nf0.format(Math.round(a)) : nf2.format(a)); };
const pct = (x, d = 0) => (x * 100).toFixed(d) + '%';

/* ============ categories ============ */
const CATS_EXP = [
  { id: 'food', name: 'อาหาร', grp: 'need', color: '#D9822B' },
  { id: 'transport', name: 'เดินทาง', grp: 'need', color: '#3B82A0' },
  { id: 'housing', name: 'ที่อยู่อาศัย', grp: 'need', color: '#5B6FB5' },
  { id: 'utilities', name: 'น้ำ ไฟ เน็ต มือถือ', grp: 'need', color: '#2F9C95' },
  { id: 'health', name: 'สุขภาพ', grp: 'need', color: '#C65D7B' },
  { id: 'insurance', name: 'ประกัน', grp: 'need', color: '#7F8FA6' },
  { id: 'family', name: 'ครอบครัว', grp: 'need', color: '#9C6BB3' },
  { id: 'education', name: 'การศึกษา', grp: 'need', color: '#4F9D69' },
  { id: 'debt', name: 'ผ่อนชำระหนี้', grp: 'need', color: '#A64B45' },
  { id: 'dining', name: 'กินนอกบ้าน/คาเฟ่', grp: 'want', color: '#E2A93B' },
  { id: 'shopping', name: 'ช้อปปิ้ง', grp: 'want', color: '#D4668A' },
  { id: 'fun', name: 'บันเทิง/ท่องเที่ยว', grp: 'want', color: '#8E6FD1' },
  { id: 'other', name: 'อื่นๆ', grp: 'want', color: '#8A949E' },
];
const CATS_INC = [
  { id: 'salary', name: 'เงินเดือน', color: '#157A55' },
  { id: 'side', name: 'งานเสริม/ฟรีแลนซ์', color: '#2F9C95' },
  { id: 'bonus', name: 'โบนัส/คอมมิชชั่น', color: '#4F9D69' },
  { id: 'biz', name: 'ธุรกิจ/ขายของ', color: '#5B6FB5' },
  { id: 'invest', name: 'ดอกเบี้ย/ปันผล', color: '#8E6FD1' },
  { id: 'gift', name: 'ได้รับ/ของขวัญ', color: '#D4668A' },
  { id: 'other', name: 'อื่นๆ', color: '#8A949E' },
];
const catOf = (type, id) => (type === 'income' ? CATS_INC : CATS_EXP).find(c => c.id === id) || { id: 'other', name: 'อื่นๆ', color: '#8A949E', grp: 'want' };
const DEBT_TYPES = ['บัตรเครดิต', 'สินเชื่อส่วนบุคคล', 'ผ่อนรถ', 'ผ่อนบ้าน/คอนโด', 'กู้เรียน (กยศ.)', 'ผ่อนสินค้า', 'ยืมเงินคนรู้จัก', 'อื่นๆ'];

/* ============ state ============ */
let KEY = 'sammut-ngern-v1';
const blank = () => ({
  v: 1, updatedAt: 0,
  settings: { name: '', baseIncome: 0, savePct: 10, ratio: [50, 30, 20], budgets: {}, projRate: 3 },
  tx: [], bills: [], pots: [], plans: [], debts: [], goals: [], wishes: [],
});
let state = blank();
function normalize(s) {
  const b = blank(); const o = { ...b, ...(s || {}) };
  o.settings = { ...b.settings, ...((s && s.settings) || {}) };
  if (!Array.isArray(o.settings.ratio) || o.settings.ratio.length !== 3) o.settings.ratio = [50, 30, 20];
  if (!o.settings.budgets || typeof o.settings.budgets !== 'object') o.settings.budgets = {};
  for (const k of ['tx', 'bills', 'pots', 'plans', 'debts', 'goals', 'wishes']) if (!Array.isArray(o[k])) o[k] = [];
  o.tx = o.tx.filter(t => t && typeof t.date === 'string' && isFinite(t.amount));
  o.bills.forEach(b => { b.paid = b.paid || {}; });
  o.pots.forEach(p => { p.log = p.log || []; });
  o.debts.forEach(d => { d.payments = d.payments || []; });
  o.goals.forEach(g => { g.log = g.log || []; });
  return o;
}
const ui = { page: 'home', ym: curYm(), txType: 'all', txCat: 'all', q: '', saveTab: 'pots', showBought: false, strategy: 'avalanche', extra: 0, projMonthly: null };

/* ============ persistence (private cloud store + local fallback) ============ */
const remote = { ok: false, col: null, sig: {} };
let dlCap = null, flushTimer = null, flushing = false, flushAgain = false;
const loadLocal = () => { try { const s = localStorage.getItem(KEY); return s ? JSON.parse(s) : null; } catch (e) { return null; } };
const saveLocal = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* storage unavailable */ } };
let lastSync = 'local';
function setSync(kind) {
  lastSync = kind;
  const el = $('#sync'); if (!el) return;
  const map = {
    cloud: ['cloud', 'เก็บไว้ในบัญชีของคุณแล้ว ใช้ได้ทุกเครื่อง'],
    busy: ['busy', 'กำลังบันทึก…'],
    local: ['', 'เก็บไว้ในเบราว์เซอร์เครื่องนี้เท่านั้น'],
    err: ['err', 'บันทึกขึ้นบัญชีไม่สำเร็จ ข้อมูลยังอยู่ในเครื่องนี้'],
  };
  const [cls, txt] = map[kind] || map.local;
  el.innerHTML = `<span class="sync-dot ${cls}"></span>${txt}`;
  const e2 = $('#sync2'); if (e2) e2.innerHTML = el.innerHTML;
}
const mainPayload = () => { const o = { ...state }; delete o.tx; delete o.updatedAt; return o; };
async function flush() {
  if (!remote.ok || !window.SammutAuth) return;
  if (flushing) { flushAgain = true; return; }
  flushing = true;
  try {
    const client = window.SammutAuth.client(), user = window.SammutAuth.user();
    if (!client || !user) throw new Error('ยังไม่ได้เข้าสู่ระบบ');
    const { error } = await client.from('finance_data').upsert({
      user_id: user.id, data: state, updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' });
    if (error) throw error;
    setSync('cloud');
  } catch (e) { console.error('Supabase save failed:', e); setSync('err'); toast('บันทึกออนไลน์ไม่สำเร็จ ข้อมูลฉบับในเครื่องยังคงอยู่'); }
  finally { flushing = false; if (flushAgain) { flushAgain = false; flush(); } }
}
function commit(rerender = true) {
  state.updatedAt = Date.now(); saveLocal();
  if (remote.ok) { setSync('busy'); clearTimeout(flushTimer); flushTimer = setTimeout(flush, 500); }
  if (rerender) render();
}
async function initRemote() {
  const client = window.SammutAuth && window.SammutAuth.client();
  const user = window.SammutAuth && window.SammutAuth.user();
  if (!client || !user) { setSync('local'); return; }
  const { data, error } = await client.from('finance_data').select('data,updated_at').eq('user_id', user.id).maybeSingle();
  if (error) throw error;
  remote.ok = true;
  if (data && data.data && typeof data.data === 'object') {
    state = normalize(data.data); saveLocal();
  } else {
    state = blank(); state.updatedAt = Date.now();
    const { error: insertError } = await client.from('finance_data').upsert({ user_id: user.id, data: state }, { onConflict: 'user_id' });
    if (insertError) throw insertError;
    saveLocal();
  }
  setSync('cloud');
}

/* ============ calculations ============ */
function monthStats(ym) {
  let income = 0, expense = 0, need = 0, want = 0, billsLinked = 0, debtLinked = 0;
  const byCat = {}, byInc = {};
  for (const t of state.tx) {
    if (!t.date.startsWith(ym)) continue;
    if (t.type === 'income') { income += t.amount; byInc[t.cat] = (byInc[t.cat] || 0) + t.amount; }
    else {
      expense += t.amount; byCat[t.cat] = (byCat[t.cat] || 0) + t.amount;
      if (catOf('expense', t.cat).grp === 'need') need += t.amount; else want += t.amount;
      if (t.billId) billsLinked += t.amount; if (t.debtId) debtLinked += t.amount;
    }
  }
  return { income, expense, need, want, net: income - expense, byCat, byInc, billsLinked, debtLinked, rate: income > 0 ? (income - expense) / income : null };
}
const hasTx = m => state.tx.some(t => t.date.startsWith(m));
function basisMonths() {
  const cur = curYm(); const prev = [1, 2, 3].map(i => shiftYm(cur, -i)).filter(hasTx);
  if (prev.length) return prev; return hasTx(cur) ? [cur] : [];
}
function avgBasis() {
  const bm = basisMonths(); if (!bm.length) return { n: 0, income: 0, expense: 0, need: 0, months: [] };
  const sts = bm.map(monthStats); const avg = f => sum(sts, f) / sts.length;
  return { n: bm.length, income: avg(s => s.income), expense: avg(s => s.expense), need: avg(s => s.need), months: bm, sts };
}
function expectedIncome() { return state.settings.baseIncome > 0 ? state.settings.baseIncome : avgBasis().income; }

/* bills */
function billDue(b, ym) {
  const [y, m] = ym.split('-').map(Number);
  if (b.startYm && ym < b.startYm) return null;
  const d = Math.min(Math.max(1, b.dueDay || 1), daysIn(y, m));
  if (b.freq === 'monthly') return ym + '-' + p2(d);
  if (b.freq === 'yearly') return b.dueMonth === m ? ym + '-' + p2(d) : null;
  if (b.freq === 'once') return b.dueDate && b.dueDate.slice(0, 7) === ym ? b.dueDate : null;
  return null;
}
function billsForMonth(ym) {
  return state.bills.map(b => {
    if (b.active === false && !b.paid[ym]) return null;
    const date = billDue(b, ym); if (!date) return null;
    return { bill: b, date, paid: !!b.paid[ym] };
  }).filter(Boolean).sort((a, b) => a.date.localeCompare(b.date));
}
function billStatus(it) {
  if (it.paid) return 'paid'; const t = today();
  if (it.date < t) return 'overdue'; if (dayDiff(t, it.date) <= 3) return 'soon'; return 'later';
}
function payBill(b, ym) {
  const due = billDue(b, ym); const date = ym === curYm() ? today() : due;
  const id = uid(); state.tx.push({ id, type: 'expense', amount: b.amount, cat: b.cat, date, note: b.name, billId: b.id }); b.paid[ym] = id;
}
function unpayBill(b, ym) { const id = b.paid[ym]; delete b.paid[ym]; state.tx = state.tx.filter(t => t.id !== id); }

/* pots / plans / goals */
const potBal = p => sum(p.log, l => l.amount);
const potsTotal = () => sum(state.pots, potBal);
const savedInMonth = ym => sum(state.pots, p => sum(p.log.filter(l => !l.opening && l.date.startsWith(ym)), l => l.amount));
function potAdd(p, amount, date, note, extra = {}) { const id = uid(); p.log.push({ id, date, amount, note: note || '', ...extra }); return id; }
function makePlan(o) {
  const n = o.kind === 'week52' ? 52 : o.count; const steps = [];
  for (let i = 0; i < n; i++) {
    let label, amt;
    if (o.kind === 'week52') { label = 'สัปดาห์ ' + (i + 1); amt = (i + 1) * o.amount; }
    else if (o.kind === 'weekly') { label = 'สัปดาห์ ' + (i + 1); amt = o.amount; }
    else if (o.kind === 'daily') { label = 'วันที่ ' + (i + 1); amt = o.amount; }
    else { label = ymShort(shiftYm(o.start.slice(0, 7), i)); amt = o.kind === 'percent' ? Math.round(o.income * o.pct / 100) : o.amount; }
    steps.push({ label, amount: amt, done: null, logId: null });
  }
  return { id: uid(), kind: o.kind, name: o.name, potId: o.potId || null, start: o.start, period: { week52: 'week', weekly: 'week', daily: 'day', monthly: 'month', percent: 'month' }[o.kind], steps };
}
function planExpected(pl) {
  const t = today(); if (t < pl.start) return 0; let e;
  if (pl.period === 'day') e = dayDiff(pl.start, t) + 1;
  else if (pl.period === 'week') e = Math.floor(dayDiff(pl.start, t) / 7) + 1;
  else e = monthsBetween(pl.start, t) + 1;
  return Math.min(e, pl.steps.length);
}
const planSaved = pl => sum(pl.steps.filter(s => s.done), s => s.amount);
const planTotal = pl => sum(pl.steps, s => s.amount);
function toggleStep(pl, i) {
  const s = pl.steps[i]; const pot = state.pots.find(p => p.id === pl.potId);
  if (s.done) { if (pot && s.logId) pot.log = pot.log.filter(l => l.id !== s.logId); s.done = null; s.logId = null; }
  else { s.done = today(); if (pot) s.logId = potAdd(pot, s.amount, s.done, pl.name + ' · ' + s.label, { planId: pl.id }); }
}
const goalPot = g => g.potId ? state.pots.find(p => p.id === g.potId) : null;
const goalSaved = g => { const p = goalPot(g); return p ? potBal(p) : sum(g.log, l => l.amount); };

/* debts */
const activeDebts = () => state.debts.filter(d => d.balance > 0.005);
function payDebt(d, amount, date, note) {
  const applied = Math.min(amount, d.balance); d.balance = Math.max(0, d.balance - applied); if (d.balance < 0.005) d.balance = 0;
  const txId = uid(); state.tx.push({ id: txId, type: 'expense', amount, cat: 'debt', date, note: 'ผ่อน ' + d.name + (note ? ' · ' + note : ''), debtId: d.id });
  d.payments.push({ id: uid(), date, amount, applied, txId });
}
function undoDebtPayment(d, pid) {
  const p = d.payments.find(x => x.id === pid); if (!p) return;
  d.balance += p.applied; d.payments = d.payments.filter(x => x !== p); state.tx = state.tx.filter(t => t.id !== p.txId);
}
function payoffInfo(balance, apr, pay) {
  if (balance <= 0) return { months: 0, interest: 0 };
  if (pay <= 0) return { months: Infinity, interest: Infinity };
  const r = apr / 1200;
  if (r === 0) { const n = Math.ceil(balance / pay); return { months: n, interest: 0 }; }
  if (pay <= balance * r) return { months: Infinity, interest: Infinity };
  const n = -Math.log(1 - r * balance / pay) / Math.log(1 + r);
  return { months: Math.ceil(n), interest: Math.max(0, n * pay - balance) };
}
function simulateDebts(debts, extra, strategy) {
  let ds = debts.filter(d => d.balance > 0.005).map(d => ({ id: d.id, name: d.name, balance: d.balance, rate: d.rate || 0, minPay: d.minPay || 0, cleared: null }));
  if (!ds.length) return { months: 0, interest: 0, order: [] };
  const budget = sum(ds, d => d.minPay) + extra;
  const startInterest = sum(ds, d => d.balance * d.rate / 1200);
  if (budget <= startInterest + 0.01 || budget <= 0) return { months: Infinity, interest: Infinity, order: [] };
  const sorter = strategy === 'avalanche' ? (a, b) => b.rate - a.rate || a.balance - b.balance : (a, b) => a.balance - b.balance;
  let months = 0, interest = 0;
  while (ds.some(d => d.balance > 0.005) && months < 600) {
    months++;
    for (const d of ds) if (d.balance > 0) { const i = d.balance * d.rate / 1200; d.balance += i; interest += i; }
    let pool = budget;
    for (const d of ds) if (d.balance > 0) { const p = Math.min(d.minPay, d.balance, pool); d.balance -= p; pool -= p; }
    for (const d of [...ds].filter(x => x.balance > 0.005).sort(sorter)) { if (pool <= 0) break; const p = Math.min(pool, d.balance); d.balance -= p; pool -= p; }
    for (const d of ds) if (d.balance <= 0.005 && d.cleared === null) { d.balance = 0; d.cleared = months; }
  }
  if (ds.some(d => d.balance > 0.005)) return { months: Infinity, interest: Infinity, order: [] };
  return { months, interest, order: [...ds].sort((a, b) => a.cleared - b.cleared).map(d => ({ name: d.name, at: d.cleared })) };
}

/* monthly plan (the allocation that drives the hero + budget page) */
function monthPlan(ym) {
  const st = monthStats(ym), cur = curYm(), expected = expectedIncome();
  const basis = ym < cur ? (st.income || expected) : Math.max(st.income, expected);
  const items = billsForMonth(ym);
  const billsTotal = sum(items, i => i.bill.amount), billsPaid = sum(items.filter(i => i.paid), i => i.bill.amount);
  const unpaidBills = billsTotal - billsPaid;
  let debtMin = 0, debtRemaining = 0;
  for (const d of state.debts) {
    const paid = sum(d.payments.filter(p => p.date.startsWith(ym)), p => p.amount);
    const planned = Math.min(d.minPay || 0, d.balance + sum(d.payments.filter(p => p.date.startsWith(ym)), p => p.applied));
    debtMin += planned; debtRemaining += Math.max(0, planned - paid);
  }
  const saveTarget = basis * (state.settings.savePct || 0) / 100;
  const savedSoFar = savedInMonth(ym);
  const saveRemaining = Math.max(0, saveTarget - savedSoFar);
  const flexSpent = st.expense - st.billsLinked - st.debtLinked;
  const flexBudget = basis - billsTotal - debtMin - saveTarget;
  const left = basis - st.expense - unpaidBills - debtRemaining - saveRemaining;
  return { st, basis, billsTotal, billsPaid, unpaidBills, debtMin, debtRemaining, debtPaid: st.debtLinked, saveTarget, savedSoFar, saveRemaining, flexSpent, flexBudget, left, spentTotal: st.expense };
}

/* assessment */
function assess() {
  const av = avgBasis(); if (!av.n) return null;
  if (av.income <= 0) return { noIncome: true, av };
  const inc = av.income, exp = av.expense, need = av.need, rate = (inc - exp) / inc;
  const total = potsTotal(); const em = state.pots.filter(p => p.kind === 'emergency');
  const emBal = em.length ? sum(em, potBal) : total, emAll = !em.length;
  const emMonths = exp > 0 ? emBal / exp : 12;
  const dm = sum(activeDebts(), d => d.minPay || 0), dti = dm / inc;
  const needRatio = need / inc;
  const billItems = billsForMonth(curYm()); const overdue = billItems.filter(i => billStatus(i) === 'overdue').length;
  const M = [];
  M.push({
    key: 'save', title: 'อัตราการออม', weight: 30, value: pct(rate), target: 'เป้าหมาย 20% ขึ้นไป', score: clamp(rate / 0.2 * 100),
    advice: rate >= 0.2 ? 'ออมได้ตามเกณฑ์ ถ้าจะให้เงินงอกเงยต่อ ให้ย้ายส่วนที่เหลือเข้ากระปุกเงินเก็บทุกเดือน'
      : rate >= 0 ? `ถ้าเพิ่มเงินออมอีกเดือนละ ${money(inc * 0.2 - (inc - exp))} จะถึง 20% ลองตั้งโอนเข้ากระปุกทันทีที่เงินเดือนเข้า แล้วใช้ส่วนที่เหลือ`
        : `รายจ่ายมากกว่ารายรับเฉลี่ยเดือนละ ${money(exp - inc)} เริ่มจากดูหมวดที่ใช้มากที่สุดในหน้าภาพรวม`,
  });
  M.push({
    key: 'emergency', title: 'เงินสำรองฉุกเฉิน', weight: 25, value: (emMonths >= 12 ? '12+' : emMonths.toFixed(1)) + ' เดือน', target: 'เป้าหมาย 6 เดือนของรายจ่าย', score: clamp(emMonths / 6 * 100),
    advice: (emAll && state.pots.length ? 'ยังไม่ได้ตั้งกระปุกเป็นเงินสำรองฉุกเฉิน จึงนับรวมเงินเก็บทั้งหมด ' : '') + (emMonths >= 6 ? 'พอสำหรับเหตุไม่คาดฝัน ถ้ารายได้หายไปยังอยู่ได้เกินครึ่งปี'
      : emMonths >= 3 ? `ผ่านขั้นต่ำ 3 เดือนแล้ว เก็บเพิ่มอีก ${money(exp * 6 - emBal)} จะครบ 6 เดือน`
        : exp > 0 ? `ตั้งเป้าให้ถึง 3 เดือนก่อน (${money(exp * 3)}) ยังขาดอีก ${money(exp * 3 - emBal)}` : 'เริ่มสร้างกระปุกเงินสำรองฉุกเฉินได้ที่หน้าเงินเก็บ'),
  });
  M.push({
    key: 'debt', title: 'ภาระผ่อนหนี้ต่อรายได้', weight: 20, value: dm > 0 ? pct(dti) : 'ไม่มี', target: 'ไม่ควรเกิน 35% ของรายได้', score: dm > 0 ? clamp((0.5 - dti) / 0.35 * 100) : 100,
    advice: dm === 0 ? 'ไม่มีภาระผ่อนหนี้ประจำ ถือว่าคล่องตัวมาก' : dti <= 0.15 ? 'ภาระหนี้อยู่ในระดับสบาย'
      : dti <= 0.35 ? 'ยังอยู่ในเกณฑ์ แต่ควรระวังไม่ก่อหนี้เพิ่ม และจ่ายหนี้ดอกเบี้ยสูงให้หมดก่อน'
        : `ภาระหนี้สูง ผ่อนรวม ${money(dm)} ต่อเดือน ลองดูแผนปิดหนี้ในหน้าหนี้สิน และเลี่ยงการเปิดหนี้ใหม่`,
  });
  M.push({
    key: 'needs', title: 'รายจ่ายจำเป็นต่อรายได้', weight: 15, value: pct(needRatio), target: 'ไม่ควรเกิน 50% ของรายได้', score: clamp((0.8 - needRatio) / 0.3 * 100),
    advice: needRatio <= 0.5 ? 'ค่าใช้จ่ายจำเป็นอยู่ในเกณฑ์ มีพื้นที่เหลือให้ออมและใช้จ่ายตามใจ'
      : `ค่าใช้จ่ายจำเป็นสูงกว่า 50% อยู่ ${money(need - inc * 0.5)} ต่อเดือน ลองทบทวนค่าที่อยู่ ค่าเดินทาง และค่าผ่อนที่ลดได้`,
  });
  if (billItems.length) M.push({
    key: 'bills', title: 'จ่ายบิลตรงเวลา', weight: 10, value: overdue ? `ค้าง ${overdue} รายการ` : 'ไม่มีค้าง', target: 'ไม่ควรมีบิลเลยกำหนด', score: clamp(100 - overdue * 35),
    advice: overdue ? 'จ่ายบิลที่เลยกำหนดก่อน เพื่อเลี่ยงค่าปรับและผลต่อเครดิต หรือใช้การตัดบัญชีอัตโนมัติ' : 'ไม่มีบิลเลยกำหนด รักษาไว้',
  });
  const wsum = sum(M, m => m.weight), score = Math.round(sum(M, m => m.score * m.weight) / wsum);
  M.forEach(m => { m.score = Math.round(m.score); m.status = m.score >= 75 ? 'good' : m.score >= 45 ? 'fair' : 'poor'; });
  const grade = score >= 80 ? ['แข็งแรงมาก', 'ok'] : score >= 65 ? ['ค่อนข้างดี', 'ok'] : score >= 50 ? ['พอใช้', 'warn'] : score >= 35 ? ['ควรปรับปรุง', 'warn'] : ['เสี่ยง', 'bad'];
  const todo = M.filter(m => m.score < 75).sort((a, b) => b.weight * (100 - b.score) - a.weight * (100 - a.score)).slice(0, 3);
  return { score, grade, M, todo, av, inc, exp, rate, total, emBal, emMonths };
}
function fv(p0, pmt, rateYr, years) {
  const i = rateYr / 1200, n = years * 12;
  if (i === 0) return p0 + pmt * n; const g = Math.pow(1 + i, n);
  return p0 * g + pmt * (g - 1) / i;
}
