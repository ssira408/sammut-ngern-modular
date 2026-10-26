/* ============ modal system ============ */
function closeModal() { const el = $('#modal'); el.hidden = true; el.innerHTML = ''; }
function openModal({ title, body, submit = 'บันทึก', onSubmit, onOpen, hideSubmit = false, danger = false }) {
  const el = $('#modal');
  el.innerHTML = `<div class="sheet" role="dialog" aria-modal="true" aria-labelledby="mt"><header><h2 id="mt">${title}</h2><button type="button" class="icon-btn" data-act="close-modal" aria-label="ปิด">${ic('x')}</button></header><form id="mform" novalidate>${body}<p class="err" id="merr" role="alert"></p><footer><button type="button" class="btn" data-act="close-modal">${hideSubmit ? 'ปิด' : 'ยกเลิก'}</button>${hideSubmit ? '' : `<button type="submit" class="btn ${danger ? 'danger' : 'primary'}">${submit}</button>`}</footer></form></div>`;
  el.hidden = false;
  const f = $('#mform');
  f.addEventListener('submit', e => { e.preventDefault(); const r = onSubmit ? onSubmit(Object.fromEntries(new FormData(f)), f) : undefined; if (r !== false) closeModal(); });
  if (onOpen) onOpen(f);
  const first = f.querySelector('input:not([type=radio]):not([type=hidden]):not([hidden]),select,textarea');
  (first || f.querySelector('button')).focus();
}
const err = (f, msg) => { $('#merr').textContent = msg; return false; };
const confirmBox = (title, text, ok, fn, danger = true) => openModal({ title, body: `<p style="margin-bottom:14px">${text}</p>`, submit: ok, danger, onSubmit() { fn(); } });
let toastT;
function toast(m) { const t = $('#toast'); t.textContent = m; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => { t.hidden = true; }, 2400); }

const fld = (label, name, o = {}) => { const { type = 'text', value = '', ph = '', hint = '', show = '', attrs = '' } = o; return `<div class="fld" ${show ? `data-show="${show}"` : ''}><label for="f_${name}">${label}</label><input id="f_${name}" name="${name}" type="${type}" value="${esc(value)}" placeholder="${esc(ph)}" ${type === 'number' ? 'inputmode="decimal" step="any" min="0"' : ''} ${attrs}>${hint ? `<small class="hint">${hint}</small>` : ''}</div>`; };
const sel = (label, name, opts, value, o = {}) => `<div class="fld" ${o.show ? `data-show="${o.show}"` : ''}><label for="f_${name}">${label}</label><select id="f_${name}" name="${name}">${opts.map(([v, t]) => `<option value="${esc(v)}" ${String(v) === String(value) ? 'selected' : ''}>${esc(t)}</option>`).join('')}</select></div>`;
function bindShow(f, selName) {
  const s = f.elements[selName]; const apply = () => $$('[data-show]', f).forEach(el => { el.hidden = !el.dataset.show.split(' ').includes(s.value); });
  s.addEventListener('change', apply); apply();
}

/* ============ download / import ============ */
async function download(filename, data) {
  if (dlCap) {
    try { await dlCap.save({ filename, data }); toast('บันทึกไฟล์แล้ว'); return; }
    catch (e) { if (e && e.code === 'declined') return; }
  }
  try {
    const blob = new Blob([data], { type: filename.endsWith('.json') ? 'application/json;charset=utf-8' : 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a');
    a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000); toast('ดาวน์โหลดไฟล์แล้ว');
  } catch (e) { toast('ดาวน์โหลดไม่สำเร็จ'); }
}
const csvCell = v => '"' + String(v ?? '').replace(/"/g, '""') + '"';

/* ============ modals: transactions ============ */
function txModal(t, preset) {
  const edit = !!t, type = t ? t.type : (preset || 'expense');
  const defDate = ui.page === 'tx' && ui.ym !== curYm() ? ui.ym + '-01' : today();
  openModal({
    title: edit ? 'แก้ไขรายการ' : 'บันทึกรายการ',
    body: `<div class="fld"><div class="seg" role="radiogroup" aria-label="ประเภท"><label class="e"><input type="radio" name="type" value="expense" ${type === 'expense' ? 'checked' : ''}><span>รายจ่าย</span></label><label class="i"><input type="radio" name="type" value="income" ${type === 'income' ? 'checked' : ''}><span>รายรับ</span></label></div></div>`
      + fld('จำนวนเงิน (บาท)', 'amount', { type: 'number', value: t ? t.amount : '', ph: '0' })
      + `<div class="fld"><label for="f_cat">หมวดหมู่</label><select id="f_cat" name="cat"></select></div>`
      + fld('วันที่', 'date', { type: 'date', value: t ? t.date : defDate })
      + fld('บันทึกช่วยจำ', 'note', { value: t ? t.note : '', ph: 'เช่น ข้าวมันไก่ ค่าแท็กซี่' }),
    onOpen(f) {
      const fill = () => { const ty = f.elements.type.value; f.elements.cat.innerHTML = (ty === 'income' ? CATS_INC : CATS_EXP).map(c => `<option value="${c.id}">${c.name}</option>`).join(''); if (t && t.type === ty) f.elements.cat.value = t.cat; };
      f.querySelectorAll('[name=type]').forEach(r => r.addEventListener('change', fill)); fill();
    },
    onSubmit(v, f) {
      const amount = num(v.amount); if (!(amount > 0)) return err(f, 'ใส่จำนวนเงินที่มากกว่า 0'); if (!v.date) return err(f, 'เลือกวันที่');
      if (edit) Object.assign(t, { type: v.type, amount, cat: v.cat, date: v.date, note: v.note.trim() });
      else state.tx.push({ id: uid(), type: v.type, amount, cat: v.cat, date: v.date, note: v.note.trim() });
      if (ui.page === 'tx') ui.ym = v.date.slice(0, 7);
      commit(); toast('บันทึกแล้ว');
    },
  });
}
function delTx(id) {
  const t = state.tx.find(x => x.id === id); if (!t) return;
  state.tx = state.tx.filter(x => x.id !== id);
  state.bills.forEach(b => { for (const k in b.paid) if (b.paid[k] === id) delete b.paid[k]; });
  if (t.debtId) { const d = state.debts.find(x => x.id === t.debtId); const p = d && d.payments.find(x => x.txId === id); if (p) { d.balance += p.applied; d.payments = d.payments.filter(x => x !== p); } }
}

/* ============ modals: bills ============ */
function billModal(b) {
  const edit = !!b, now = new Date();
  openModal({
    title: edit ? 'แก้ไขรายการต้องจ่าย' : 'เพิ่มรายการต้องจ่าย',
    body: fld('ชื่อรายการ', 'name', { value: b ? b.name : '', ph: 'เช่น ค่าเช่า ค่าไฟ Netflix' }) + fld('จำนวนเงิน (บาท)', 'amount', { type: 'number', value: b ? b.amount : '' })
      + sel('ความถี่', 'freq', [['monthly', 'ทุกเดือน'], ['yearly', 'ทุกปี'], ['once', 'ครั้งเดียว']], b ? b.freq : 'monthly')
      + fld('ครบกำหนดวันที่ (1–31)', 'dueDay', { type: 'number', value: b ? b.dueDay : now.getDate(), show: 'monthly yearly', attrs: 'min="1" max="31" step="1"' })
      + sel('เดือนที่ครบกำหนด', 'dueMonth', TH_MF.map((m, i) => [i + 1, m]), b ? b.dueMonth : now.getMonth() + 1, { show: 'yearly' })
      + fld('วันที่ครบกำหนด', 'dueDate', { type: 'date', value: b ? b.dueDate : today(), show: 'once' })
      + sel('หมวดหมู่รายจ่าย', 'cat', CATS_EXP.map(c => [c.id, c.name]), b ? b.cat : 'utilities'),
    onOpen(f) { bindShow(f, 'freq'); },
    onSubmit(v, f) {
      const amount = num(v.amount); if (!v.name.trim()) return err(f, 'ใส่ชื่อรายการ'); if (!(amount > 0)) return err(f, 'ใส่จำนวนเงินที่มากกว่า 0');
      const o = { name: v.name.trim(), amount, freq: v.freq, cat: v.cat, dueDay: 1, dueMonth: null, dueDate: null };
      if (v.freq !== 'once') { const d = Math.round(num(v.dueDay)); if (d < 1 || d > 31) return err(f, 'วันที่ครบกำหนดต้องอยู่ระหว่าง 1–31'); o.dueDay = d; if (v.freq === 'yearly') o.dueMonth = +v.dueMonth; }
      else { if (!v.dueDate) return err(f, 'เลือกวันที่ครบกำหนด'); o.dueDate = v.dueDate; }
      if (edit) Object.assign(b, o); else state.bills.push({ id: uid(), active: true, paid: {}, startYm: o.freq === 'once' ? o.dueDate.slice(0, 7) : curYm(), ...o });
      commit(); toast('บันทึกแล้ว');
    },
  });
}

/* ============ modals: savings ============ */
function potModal(p, preset) {
  const edit = !!p, av = avgBasis(), emTarget = av.expense > 0 ? Math.round(av.expense * 6 / 1000) * 1000 : '';
  const d = p || (preset === 'emergency' ? { name: 'เงินสำรองฉุกเฉิน', kind: 'emergency', target: emTarget } : { name: '', kind: 'general', target: '' });
  openModal({
    title: edit ? 'แก้ไขกระปุก' : 'สร้างกระปุกเงินเก็บ',
    body: fld('ชื่อกระปุก', 'name', { value: d.name, ph: 'เช่น เงินสำรองฉุกเฉิน เที่ยวญี่ปุ่น' })
      + sel('ประเภท', 'kind', [['general', 'เงินเก็บทั่วไป'], ['emergency', 'เงินสำรองฉุกเฉิน']], d.kind)
      + fld('ยอดเป้าหมาย (ไม่ใส่ก็ได้)', 'target', { type: 'number', value: d.target || '', hint: preset === 'emergency' && emTarget ? 'แนะนำ 6 เท่าของรายจ่ายเฉลี่ยต่อเดือน' : '' })
      + (edit ? '' : fld('มีเงินอยู่แล้วเท่าไหร่ (ยอดยกมา)', 'opening', { type: 'number', value: '' })),
    onSubmit(v, f) {
      if (!v.name.trim()) return err(f, 'ใส่ชื่อกระปุก');
      if (edit) Object.assign(p, { name: v.name.trim(), kind: v.kind, target: num(v.target) });
      else { const np = { id: uid(), name: v.name.trim(), kind: v.kind, target: num(v.target), log: [] }; if (num(v.opening) > 0) potAdd(np, num(v.opening), today(), 'ยอดยกมา', { opening: true }); state.pots.push(np); }
      commit(); toast('บันทึกแล้ว');
    },
  });
}
function potMoveModal(p, dir) {
  const bal = potBal(p);
  openModal({
    title: (dir > 0 ? 'ฝากเข้า ' : 'ถอนจาก ') + esc(p.name), submit: dir > 0 ? 'ฝากเงิน' : 'ถอนเงิน',
    body: `<p class="muted" style="margin-bottom:12px">ยอดคงเหลือ ${moneyx(bal)}</p>` + fld('จำนวนเงิน (บาท)', 'amount', { type: 'number' }) + fld('วันที่', 'date', { type: 'date', value: today() }) + fld('บันทึกช่วยจำ', 'note', { ph: dir > 0 ? 'เช่น โบนัสประจำปี' : 'เช่น ใช้ซ่อมรถ' }),
    onSubmit(v, f) {
      const a = num(v.amount); if (!(a > 0)) return err(f, 'ใส่จำนวนเงินที่มากกว่า 0'); if (!v.date) return err(f, 'เลือกวันที่');
      if (dir < 0 && a > bal + 0.005) return err(f, 'ถอนได้ไม่เกินยอดคงเหลือ ' + moneyx(bal));
      potAdd(p, dir * a, v.date, v.note.trim()); commit(); toast(dir > 0 ? 'ฝากแล้ว' : 'ถอนแล้ว');
    },
  });
}
function potHist(id) {
  const p = state.pots.find(x => x.id === id); if (!p) return;
  const logs = [...p.log].sort((a, b) => b.date.localeCompare(a.date));
  openModal({ title: 'ประวัติ ' + esc(p.name), hideSubmit: true, body: logs.length ? `<ul class="list">${logs.map(l => `<li class="row"><div class="row-main"><b>${esc(l.note || (l.amount > 0 ? 'ฝากเงิน' : 'ถอนเงิน'))}</b><small>${fmtDate(l.date)}</small></div><span class="amt ${l.amount > 0 ? 'inc' : 'exp'}">${l.amount > 0 ? '+' : '−'}${moneyx(Math.abs(l.amount))}</span>${iconBtn('log-del', 'trash', 'ลบรายการนี้', `data-id="${l.id}" data-pid="${p.id}"`)}</li>`).join('')}</ul>` : '<p class="muted">ยังไม่มีประวัติ</p>' });
}
function planModal(kind = 'week52') {
  const income = Math.round(expectedIncome()) || '';
  openModal({
    title: 'สร้างแบบออมเงิน', submit: 'สร้างแผน',
    body: sel('แบบออม', 'kind', Object.entries(PLAN_KIND), kind) + fld('ชื่อแผน', 'name', { ph: 'เว้นว่างไว้จะใช้ชื่อแบบออม' })
      + fld('ออมเพิ่มสัปดาห์ละ (บาท)', 'stepAmt', { type: 'number', value: 10, show: 'week52', hint: 'สัปดาห์ที่ n ออม n เท่าของค่านี้ เช่น 10 บาท ครบ 52 สัปดาห์ได้ 13,780 บาท' })
      + fld('ออมครั้งละ (บาท)', 'amt', { type: 'number', value: 1000, show: 'monthly weekly daily' })
      + fld('จำนวนงวด', 'count', { type: 'number', value: 12, show: 'monthly weekly daily percent', attrs: 'min="1" max="365" step="1"', hint: 'นับเป็นเดือน สัปดาห์ หรือวัน ตามแบบที่เลือก' })
      + fld('ออมกี่ % ของรายได้', 'pct', { type: 'number', value: 15, show: 'percent' }) + fld('รายได้ต่อเดือนที่ใช้คำนวณ (บาท)', 'income', { type: 'number', value: income, show: 'percent' })
      + fld('วันที่เริ่ม', 'start', { type: 'date', value: today() })
      + sel('ฝากเข้ากระปุก', 'pot', [['', 'ไม่ผูกกระปุก (ติ๊กเฉยๆ)'], ...state.pots.map(p => [p.id, p.name])], state.pots[0] ? state.pots[0].id : ''),
    onOpen(f) { bindShow(f, 'kind'); },
    onSubmit(v, f) {
      const o = { kind: v.kind, name: v.name.trim() || PLAN_KIND[v.kind], potId: v.pot, start: v.start || today() };
      if (v.kind === 'week52') { o.amount = num(v.stepAmt); if (!(o.amount > 0)) return err(f, 'ใส่ยอดที่ออมเพิ่มต่อสัปดาห์'); }
      else {
        o.count = Math.round(num(v.count)); if (o.count < 1 || o.count > 365) return err(f, 'จำนวนงวดต้องอยู่ระหว่าง 1–365');
        if (v.kind === 'percent') { o.pct = num(v.pct); o.income = num(v.income); if (!(o.pct > 0 && o.pct <= 100)) return err(f, 'เปอร์เซ็นต์ต้องอยู่ระหว่าง 1–100'); if (!(o.income > 0)) return err(f, 'ใส่รายได้ต่อเดือนที่ใช้คำนวณ'); }
        else { o.amount = num(v.amt); if (!(o.amount > 0)) return err(f, 'ใส่จำนวนเงินที่ออมแต่ละครั้ง'); }
      }
      state.plans.push(makePlan(o)); ui.saveTab = 'plans'; commit(); toast('สร้างแผนแล้ว');
    },
  });
}

/* ============ modals: debts ============ */
function debtModal(d) {
  const edit = !!d;
  openModal({
    title: edit ? 'แก้ไขหนี้' : 'เพิ่มหนี้',
    body: fld('ชื่อหนี้', 'name', { value: d ? d.name : '', ph: 'เช่น บัตรเครดิต KTC ผ่อนรถ' }) + sel('ประเภท', 'type', DEBT_TYPES.map(t => [t, t]), d ? d.type : DEBT_TYPES[0])
      + fld('ยอดหนี้เดิมทั้งหมด (บาท)', 'principal', { type: 'number', value: d ? d.principal : '' }) + fld('ยอดคงเหลือตอนนี้ (บาท)', 'balance', { type: 'number', value: d ? d.balance : '', hint: edit ? '' : 'ถ้าเว้นว่างจะใช้เท่ากับยอดหนี้เดิม' })
      + fld('ดอกเบี้ยต่อปี (%)', 'rate', { type: 'number', value: d ? d.rate : '', ph: '0 ถ้าไม่มีดอกเบี้ย' }) + fld('ผ่อนขั้นต่ำต่อเดือน (บาท)', 'minPay', { type: 'number', value: d ? d.minPay : '' })
      + fld('ครบกำหนดวันที่ (ไม่ใส่ก็ได้)', 'dueDay', { type: 'number', value: d ? d.dueDay || '' : '', attrs: 'min="1" max="31" step="1"' }),
    onSubmit(v, f) {
      if (!v.name.trim()) return err(f, 'ใส่ชื่อหนี้'); let principal = num(v.principal), bal = v.balance === '' ? principal : num(v.balance);
      if (!(principal > 0) && !(bal > 0)) return err(f, 'ใส่ยอดหนี้'); if (!(principal > 0)) principal = bal; if (bal > principal) principal = bal;
      const o = { name: v.name.trim(), type: v.type, principal, balance: bal, rate: num(v.rate), minPay: num(v.minPay), dueDay: Math.round(num(v.dueDay)) || 0 };
      if (edit) Object.assign(d, o); else state.debts.push({ id: uid(), payments: [], ...o });
      commit(); toast('บันทึกแล้ว');
    },
  });
}
function debtPayModal(d) {
  openModal({
    title: 'บันทึกการชำระ ' + esc(d.name), submit: 'บันทึกการชำระ',
    body: `<p class="muted" style="margin-bottom:12px">ยอดคงเหลือ ${moneyx(d.balance)} · ระบบจะบันทึกเป็นรายจ่ายหมวด “ผ่อนชำระหนี้” ให้ด้วย</p>` + fld('จำนวนที่จ่าย (บาท)', 'amount', { type: 'number', value: Math.min(d.minPay || d.balance, d.balance) || '' }) + fld('วันที่จ่าย', 'date', { type: 'date', value: today() }) + fld('บันทึกช่วยจำ', 'note', {}),
    onSubmit(v, f) { const a = num(v.amount); if (!(a > 0)) return err(f, 'ใส่จำนวนเงินที่มากกว่า 0'); if (!v.date) return err(f, 'เลือกวันที่'); payDebt(d, a, v.date, v.note.trim()); commit(); toast(d.balance <= 0.005 ? 'ปิดหนี้ก้อนนี้ได้แล้ว' : 'บันทึกการชำระแล้ว'); },
  });
}
function debtHist(id) {
  const d = state.debts.find(x => x.id === id); if (!d) return; const ps = [...d.payments].sort((a, b) => b.date.localeCompare(a.date));
  openModal({ title: 'ประวัติการชำระ ' + esc(d.name), hideSubmit: true, body: ps.length ? `<ul class="list">${ps.map(p => `<li class="row"><div class="row-main"><b>จ่าย ${moneyx(p.amount)}</b><small>${fmtDate(p.date)}</small></div><span class="amt">ลดหนี้ ${moneyx(p.applied)}</span>${iconBtn('pay-del', 'trash', 'ยกเลิกการชำระนี้', `data-id="${p.id}" data-pid="${d.id}"`)}</li>`).join('')}</ul>` : '<p class="muted">ยังไม่มีประวัติการชำระ</p>' });
}

/* ============ modals: goals / wishes ============ */
function goalModal(g) {
  const edit = !!g;
  openModal({
    title: edit ? 'แก้ไขเป้าหมาย' : 'ตั้งเป้าหมาย',
    body: fld('ชื่อเป้าหมาย', 'name', { value: g ? g.name : '', ph: 'เช่น เที่ยวญี่ปุ่น ดาวน์รถ' }) + fld('ยอดที่ต้องการ (บาท)', 'target', { type: 'number', value: g ? g.target : '' })
      + fld('อยากได้ภายในวันที่ (ไม่ใส่ก็ได้)', 'deadline', { type: 'date', value: g ? g.deadline : '' })
      + sel('เก็บเงินที่ไหน', 'potId', [['', 'เก็บแยกในเป้าหมายนี้'], ...state.pots.map(p => ['' + p.id, 'ดึงยอดจากกระปุก: ' + p.name])], g ? g.potId || '' : '')
      + (edit ? '' : fld('มีเงินสำหรับเป้าหมายนี้แล้วเท่าไหร่', 'initial', { type: 'number', hint: 'ใช้เมื่อเลือกเก็บแยกในเป้าหมายเท่านั้น' })) + fld('โน้ต', 'note', { value: g ? g.note : '' }),
    onSubmit(v, f) {
      const target = num(v.target); if (!v.name.trim()) return err(f, 'ใส่ชื่อเป้าหมาย'); if (!(target > 0)) return err(f, 'ใส่ยอดที่ต้องการมากกว่า 0');
      const o = { name: v.name.trim(), target, deadline: v.deadline || '', potId: v.potId || null, note: v.note.trim() };
      if (edit) Object.assign(g, o); else { const ng = { id: uid(), log: [], ...o }; if (!ng.potId && num(v.initial) > 0) ng.log.push({ id: uid(), date: today(), amount: num(v.initial), note: 'ยอดเริ่มต้น' }); state.goals.push(ng); }
      commit(); toast('บันทึกแล้ว');
    },
  });
}
function goalDepModal(g) {
  const pot = goalPot(g);
  openModal({
    title: 'เพิ่มเงินให้ ' + esc(g.name), submit: 'เพิ่มเงิน',
    body: `<p class="muted" style="margin-bottom:12px">${pot ? 'เป้าหมายนี้ดึงยอดจากกระปุก “' + esc(pot.name) + '” เงินที่เพิ่มจะฝากเข้ากระปุกนั้น' : 'ยังขาดอีก ' + moneyx(Math.max(0, g.target - goalSaved(g)))}</p>` + fld('จำนวนเงิน (บาท)', 'amount', { type: 'number' }) + fld('วันที่', 'date', { type: 'date', value: today() }) + fld('บันทึกช่วยจำ', 'note', {}),
    onSubmit(v, f) { const a = num(v.amount); if (!(a > 0)) return err(f, 'ใส่จำนวนเงินที่มากกว่า 0'); if (!v.date) return err(f, 'เลือกวันที่'); if (pot) potAdd(pot, a, v.date, 'เป้าหมาย: ' + g.name + (v.note ? ' · ' + v.note.trim() : '')); else g.log.push({ id: uid(), date: v.date, amount: a, note: v.note.trim() }); commit(); toast('เพิ่มเงินแล้ว'); },
  });
}
function goalHist(id) {
  const g = state.goals.find(x => x.id === id); if (!g) return; const logs = [...g.log].sort((a, b) => b.date.localeCompare(a.date));
  openModal({ title: 'ประวัติ ' + esc(g.name), hideSubmit: true, body: logs.length ? `<ul class="list">${logs.map(l => `<li class="row"><div class="row-main"><b>${esc(l.note || 'เพิ่มเงิน')}</b><small>${fmtDate(l.date)}</small></div><span class="amt inc">+${moneyx(l.amount)}</span>${iconBtn('glog-del', 'trash', 'ลบ', `data-id="${l.id}" data-pid="${g.id}"`)}</li>`).join('')}</ul>` : '<p class="muted">ยังไม่มีประวัติ</p>' });
}
function wishModal(w) {
  const edit = !!w;
  openModal({
    title: edit ? 'แก้ไขของที่อยากได้' : 'เพิ่มของที่อยากได้',
    body: fld('ชื่อสิ่งของ', 'name', { value: w ? w.name : '', ph: 'เช่น หูฟังไร้สาย' }) + fld('ราคา (บาท)', 'price', { type: 'number', value: w ? w.price : '' })
      + sel('ความอยากได้', 'priority', [[3, 'อยากมาก'], [2, 'อยากพอควร'], [1, 'อยากได้เฉยๆ']], w ? w.priority : 2) + fld('โน้ต/ลิงก์ร้าน', 'note', { value: w ? w.note : '' }),
    onSubmit(v, f) {
      const price = num(v.price); if (!v.name.trim()) return err(f, 'ใส่ชื่อสิ่งของ'); if (!(price > 0)) return err(f, 'ใส่ราคามากกว่า 0');
      const o = { name: v.name.trim(), price, priority: +v.priority, note: v.note.trim() };
      if (edit) Object.assign(w, o); else state.wishes.push({ id: uid(), added: today(), status: 'want', ...o });
      commit(); toast('บันทึกแล้ว');
    },
  });
}
function wishBuyModal(w) {
  const days = dayDiff(w.added, today());
  openModal({
    title: 'ซื้อ ' + esc(w.name) + ' แล้ว', submit: 'บันทึกว่าซื้อแล้ว',
    body: `<p class="muted" style="margin-bottom:12px">${days < 30 ? `จดไว้มา ${days} วัน ยังไม่ครบ 30 วัน ` : ''}ระบบจะบันทึกเป็นรายจ่ายหมวดช้อปปิ้งให้</p>` + fld('ราคาที่จ่ายจริง (บาท)', 'amount', { type: 'number', value: w.price }) + fld('วันที่ซื้อ', 'date', { type: 'date', value: today() }),
    onSubmit(v, f) { const a = num(v.amount); if (!(a > 0)) return err(f, 'ใส่ราคาที่จ่ายจริง'); if (!v.date) return err(f, 'เลือกวันที่'); state.tx.push({ id: uid(), type: 'expense', amount: a, cat: 'shopping', date: v.date, note: w.name }); w.status = 'bought'; w.boughtDate = v.date; w.price = a; commit(); toast('บันทึกแล้ว'); },
  });
}
