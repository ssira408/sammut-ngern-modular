/* ============ actions ============ */
const A = {
  'close-modal': closeModal,
  ym(d) { ui.ym = shiftYm(ui.ym, +d.d); render(); },
  'ym-now'() { ui.ym = curYm(); render(); },
  menu() { openModal({ title: 'เมนู', hideSubmit: true, body: `<div style="display:grid;gap:4px;margin-bottom:6px">${[...NAV, { id: 'settings', t: 'ตั้งค่าและข้อมูล', i: 'gear' }].map(n => `<button type="button" class="navbtn" data-go="${n.id}" ${ui.page === n.id ? 'aria-current="page"' : ''}>${ic(n.i)}<span>${n.t}</span></button>`).join('')}</div>` }); },
  tab(d) { ui.saveTab = d.t; render(); },
  reset() { confirmBox('ลบข้อมูลทั้งหมด?', 'รายการ บิล เงินเก็บ หนี้ และเป้าหมายทั้งหมดจะถูกลบ ย้อนกลับไม่ได้ แนะนำให้สำรองข้อมูลก่อน', 'ลบทั้งหมด', () => { state = blank(); ui.ym = curYm(); commit(); toast('ลบข้อมูลแล้ว'); }); },
  'export-xlsx'() { if (typeof window.exportFinanceExcel === 'function') window.exportFinanceExcel(); else toast('โหลดระบบ Excel ไม่สำเร็จ กรุณาตรวจสอบอินเทอร์เน็ต'); },
  'export-json'() { download('finance-backup-' + today() + '.json', JSON.stringify(state, null, 1)); },
  'export-csv'() { const rows = [['วันที่', 'ประเภท', 'หมวดหมู่', 'จำนวน', 'บันทึก'], ...[...state.tx].sort((a, b) => a.date.localeCompare(b.date)).map(t => [t.date, t.type === 'income' ? 'รายรับ' : 'รายจ่าย', catOf(t.type, t.cat).name, t.amount, t.note || ''])]; download('finance-transactions-' + today() + '.csv', '\ufeff' + rows.map(r => r.map(csvCell).join(',')).join('\r\n')); },
  /* transactions */
  'tx-add'(d) { txModal(null, d.type); },
  'tx-edit'(d) { const t = state.tx.find(x => x.id === d.id); if (t) txModal(t); },
  'tx-del'(d) { confirmBox('ลบรายการนี้?', 'รายการจะถูกลบถาวร', 'ลบ', () => { delTx(d.id); commit(); toast('ลบแล้ว'); }); },
  /* bills */
  'bill-add'() { billModal(null); },
  'bill-edit'(d) { billModal(state.bills.find(b => b.id === d.id)); },
  'bill-del'(d) { confirmBox('ลบรายการต้องจ่ายนี้?', 'รายจ่ายที่เคยบันทึกไว้จะยังอยู่ในประวัติ', 'ลบ', () => { state.bills = state.bills.filter(b => b.id !== d.id); commit(); }); },
  'bill-pause'(d) { const b = state.bills.find(x => x.id === d.id); b.active = b.active === false; commit(); },
  'bill-toggle'(d) { const b = state.bills.find(x => x.id === d.id); if (b.paid[ui.ym]) unpayBill(b, ui.ym); else payBill(b, ui.ym); commit(); },
  /* pots + plans */
  'pot-add'() { potModal(null); }, 'pot-preset'() { potModal(null, 'emergency'); },
  'pot-edit'(d) { potModal(state.pots.find(p => p.id === d.id)); },
  'pot-dep'(d) { potMoveModal(state.pots.find(p => p.id === d.id), 1); }, 'pot-wd'(d) { potMoveModal(state.pots.find(p => p.id === d.id), -1); },
  'pot-hist'(d) { potHist(d.id); },
  'pot-del'(d) { const p = state.pots.find(x => x.id === d.id); confirmBox('ลบกระปุก “' + esc(p.name) + '”?', `ยอดคงเหลือ ${moneyx(potBal(p))} จะหายไปจากสรุปเงินเก็บ ถ้าเป็นการย้ายเงินให้ถอนออกก่อน`, 'ลบกระปุก', () => { state.pots = state.pots.filter(x => x.id !== p.id); state.plans.forEach(pl => { if (pl.potId === p.id) pl.potId = null; }); state.goals.forEach(g => { if (g.potId === p.id) g.potId = null; }); commit(); }); },
  'log-del'(d) { const p = state.pots.find(x => x.id === d.pid), l = p && p.log.find(x => x.id === d.id); if (!l) return; p.log = p.log.filter(x => x !== l); state.plans.forEach(pl => pl.steps.forEach(s => { if (s.logId === l.id) { s.done = null; s.logId = null; } })); commit(); potHist(p.id); },
  'plan-add'(d) { planModal(d.kind || 'week52'); },
  'plan-del'(d) { confirmBox('ลบแผนออมเงินนี้?', 'เงินที่ฝากเข้ากระปุกไปแล้วจะยังอยู่ในกระปุก', 'ลบแผน', () => { state.plans = state.plans.filter(p => p.id !== d.id); commit(); }); },
  step(d) { const pl = state.plans.find(p => p.id === d.id); toggleStep(pl, +d.i); commit(); },
  /* debts */
  'debt-add'() { debtModal(null); }, 'debt-edit'(d) { debtModal(state.debts.find(x => x.id === d.id)); },
  'debt-pay'(d) { debtPayModal(state.debts.find(x => x.id === d.id)); }, 'debt-hist'(d) { debtHist(d.id); },
  'debt-del'(d) { const x = state.debts.find(y => y.id === d.id); confirmBox('ลบหนี้ “' + esc(x.name) + '”?', 'รายจ่ายที่เคยบันทึกจากการผ่อนจะยังอยู่ในประวัติ', 'ลบ', () => { state.debts = state.debts.filter(y => y.id !== x.id); commit(); }); },
  'pay-del'(d) { const x = state.debts.find(y => y.id === d.pid); undoDebtPayment(x, d.id); commit(); debtHist(x.id); },
  /* goals */
  'goal-add'() { goalModal(null); }, 'goal-edit'(d) { goalModal(state.goals.find(g => g.id === d.id)); },
  'goal-dep'(d) { goalDepModal(state.goals.find(g => g.id === d.id)); }, 'goal-hist'(d) { goalHist(d.id); },
  'goal-del'(d) { const g = state.goals.find(x => x.id === d.id); confirmBox('ลบเป้าหมาย “' + esc(g.name) + '”?', 'กระปุกที่ผูกไว้ (ถ้ามี) ยังอยู่ตามเดิม', 'ลบ', () => { state.goals = state.goals.filter(x => x.id !== g.id); commit(); }); },
  'glog-del'(d) { const g = state.goals.find(x => x.id === d.pid); g.log = g.log.filter(l => l.id !== d.id); commit(); goalHist(g.id); },
  /* wishes */
  'wish-add'() { wishModal(null); }, 'wish-edit'(d) { wishModal(state.wishes.find(w => w.id === d.id)); }, 'wish-buy'(d) { wishBuyModal(state.wishes.find(w => w.id === d.id)); },
  'wish-del'(d) { confirmBox('ลบรายการนี้?', 'จะลบออกจากรายการของที่อยากได้', 'ลบ', () => { state.wishes = state.wishes.filter(w => w.id !== d.id); commit(); }); },
  'wish-goal'(d) { const w = state.wishes.find(x => x.id === d.id); state.goals.push({ id: uid(), name: w.name, target: w.price, deadline: '', potId: null, note: w.note || '', log: [] }); state.wishes = state.wishes.filter(x => x.id !== w.id); ui.page = 'goals'; commit(); toast('ย้ายไปเป็นเป้าหมายแล้ว'); },
  'wish-show'() { ui.showBought = !ui.showBought; render(); },
  /* budget */
  'budget-auto'() { const av = avgBasis(); if (!av.n) { toast('ยังไม่มีข้อมูลย้อนหลังให้คำนวณ'); return; } const b = {}; CATS_EXP.forEach(c => { const a = sum(av.sts, s => s.byCat[c.id] || 0) / av.n; if (a > 0) b[c.id] = Math.ceil(a / 100) * 100; }); state.settings.budgets = b; commit(); toast('ตั้งงบจากค่าเฉลี่ย ' + av.n + ' เดือนแล้ว'); },
  'budget-clear'() { state.settings.budgets = {}; commit(); },
};
const C = {
  'tx-filter'(t) { ui.txType = t.value; render(); },
  'tx-cat'(t) { ui.txCat = t.value; render(); },
  'tx-q'(t) { ui.q = t.value; $('#txlist').innerHTML = txListHTML(); },
  'base-income'(t) { state.settings.baseIncome = Math.max(0, num(t.value)); commit(); },
  'save-pct'(t) { state.settings.savePct = clamp(num(t.value), 0, 100); commit(); },
  'ratio-preset'(t) { state.settings.ratio = t.value.split(',').map(Number); commit(); },
  'cat-limit'(t) {
    const id = t.dataset.cat, v = num(t.value); if (v > 0) state.settings.budgets[id] = v; else delete state.settings.budgets[id]; commit(false);
    const c = CATS_EXP.find(x => x.id === id), st = monthStats(ui.ym), row = $('#cb_' + id); if (row) row.outerHTML = catBudgetRow(c, st.byCat[id] || 0, state.settings.budgets[id] || 0);
    const sm = $('#cbsum'); if (sm) sm.innerHTML = cbSummary(st);
  },
  extra(t) { ui.extra = Math.max(0, num(t.value)); render(); },
  'proj-monthly'(t) { ui.projMonthly = Math.max(0, num(t.value)); render(); },
  'proj-rate'(t) { state.settings.projRate = clamp(num(t.value), 0, 30); commit(); },
  name(t) { state.settings.name = t.value.trim(); commit(false); toast('บันทึกชื่อแล้ว'); },
  'import-json'(t) {
    const file = t.files && t.files[0]; if (!file) return;
    const rd = new FileReader();
    rd.onload = () => {
      try { const o = JSON.parse(rd.result); if (!o || !Array.isArray(o.tx)) throw new Error('bad'); confirmBox('กู้คืนข้อมูลจากไฟล์?', `พบรายการ ${o.tx.length} รายการ ข้อมูลปัจจุบันจะถูกแทนที่`, 'กู้คืนข้อมูล', () => { state = normalize(o); commit(); toast('กู้คืนข้อมูลแล้ว'); }, false); }
      catch (e) { toast('ไฟล์ไม่ถูกต้อง ใช้ไฟล์สำรองที่ได้จากแอพนี้'); }
    };
    rd.readAsText(file); t.value = '';
  },
};

/* ============ render + events ============ */
let booted = false;
function render() {
  if (!booted) return;
  $('#view').innerHTML = (pages[ui.page] || pageHome)();
  $('#sidenav').innerHTML = NAV.map(n => `<button class="navbtn" data-go="${n.id}" ${ui.page === n.id ? 'aria-current="page"' : ''}>${ic(n.i)}<span>${n.t}</span></button>`).join('');
  $('#sidegear').setAttribute('aria-current', ui.page === 'settings' ? 'page' : 'false');
  const BN = [['home', 'ภาพรวม', 'home'], ['tx', 'รายการ', 'swap'], ['bills', 'ต้องจ่าย', 'calendar'], ['save', 'เงินเก็บ', 'coins']];
  $('#bottomnav').innerHTML = BN.map(([id, t, i]) => `<button data-go="${id}" ${ui.page === id ? 'aria-current="page"' : ''}>${ic(i, 22)}${t}</button>`).join('') + `<button data-act="menu" ${BN.some(b => b[0] === ui.page) ? '' : 'aria-current="page"'}>${ic('list', 22)}เมนู</button>`;
  document.title = (PAGE_TITLE[ui.page] || 'สมุดเงิน') + ' · สมุดเงิน';
  setSync(lastSync);
}
function go(p) { ui.page = p; closeModal(); render(); window.scrollTo(0, 0); }
document.addEventListener('click', e => {
  const g = e.target.closest('[data-go]'); if (g) { go(g.dataset.go); return; }
  const t = e.target.closest('[data-act]'); if (!t) return;
  const f = A[t.dataset.act]; if (f) { e.preventDefault(); f(t.dataset, t); }
});
document.addEventListener('change', e => { const t = e.target.closest('[data-change]'); if (t && C[t.dataset.change]) C[t.dataset.change](t, e); });
document.addEventListener('input', e => { const t = e.target.closest('[data-input]'); if (t && C[t.dataset.input]) C[t.dataset.input](t, e); });
$('#modal').addEventListener('mousedown', e => { if (e.target.id === 'modal') closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('#modal').hidden) closeModal(); });

window.startFinanceApp = async function() {
  // ใช้งานส่วนตัวโดยไม่ต้องมีบัญชี: เก็บข้อมูลไว้ในเบราว์เซอร์เครื่องนี้
  KEY = 'sammut-ngern-v1';
  let loc = loadLocal();
  if (!loc) {
    // พยายามย้ายข้อมูลในเครื่องจากเวอร์ชันก่อนที่แยก key ตาม Supabase user ID
    // เลือกชุดที่มี updatedAt ล่าสุด และไม่แตะข้อมูลใน Supabase
    try {
      const candidates = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith('sammut-ngern-v1-')) {
          const raw = localStorage.getItem(k);
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed && typeof parsed === 'object' && Array.isArray(parsed.tx)) candidates.push(parsed);
          }
        }
      }
      candidates.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
      if (candidates.length) { loc = candidates[0]; }
    } catch (e) { console.warn('Could not migrate previous local data', e); }
  }
  state = loc ? normalize(loc) : blank();
  saveLocal();
  setSync('local');
  booted = true; $('#splash').hidden = true; $('#app').hidden = false; render();
};
(async function boot() {
  try { await window.startFinanceApp(); }
  catch (e) { console.error('App initialization failed', e); $('#splash').hidden = true; }
})();
