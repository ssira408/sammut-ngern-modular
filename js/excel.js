/* Excel export module for สมุดเงิน. Requires SheetJS (XLSX) CDN. */
(function () {
  'use strict';
  const arr = v => Array.isArray(v) ? v : [];
  const json = v => v == null ? '' : (typeof v === 'object' ? JSON.stringify(v) : v);
  const rows = (headers, items) => [headers, ...items];
  const sum = (items, fn) => items.reduce((a, x) => a + (Number(fn(x)) || 0), 0);
  function exportFinanceExcel() {
    if (!window.XLSX) { alert('ไม่สามารถโหลดระบบ Excel ได้ กรุณาเชื่อมต่ออินเทอร์เน็ตแล้วลองใหม่'); return; }
    if (typeof state === 'undefined') { alert('ยังโหลดข้อมูลสมุดเงินไม่สำเร็จ'); return; }
    const tx = arr(state.tx).slice().sort((a,b) => String(a.date||'').localeCompare(String(b.date||'')));
    const catName = (t) => {
      const list = t.type === 'income' ? arr(window.CATS_INC || (typeof CATS_INC !== 'undefined' ? CATS_INC : [])) : arr(window.CATS_EXP || (typeof CATS_EXP !== 'undefined' ? CATS_EXP : []));
      const found = list.find(c => c.id === t.cat); return found ? found.name : (t.cat || 'อื่นๆ');
    };
    const txRows = tx.map(t => [t.id||'',t.date||'',t.type==='income'?'รายรับ':'รายจ่าย',catName(t),Number(t.amount)||0,t.note||'',t.account||'',t.createdAt||'']);
    const bills = arr(state.bills);
    const billRows = bills.map(b => [b.id||'',b.name||'',Number(b.amount)||0,b.dueDay||b.day||'',b.category||'',b.active===false?'พักรายการ':'ใช้งาน',JSON.stringify(b.paid||{}),b.note||'']);
    const pots = arr(state.pots);
    const potRows = pots.map(p => [p.id||'',p.name||'',p.note||'',Number(p.target)||0,Number(potBalance(p))||Number(p.balance)||0,JSON.stringify(p.log||[])]);
    function potBalance(p){
      const logs=arr(p.log); if(logs.length) return logs.reduce((s,l)=>s+(Number(l.amount)||0)*(l.type==='withdraw'||l.type==='wd'||Number(l.amount)<0?-1:1),0);
      return Number(p.balance)||0;
    }
    const potLogRows=[]; pots.forEach(p=>arr(p.log).forEach(l=>potLogRows.push([p.name||'',l.date||'',l.type||'',Number(l.amount)||0,l.note||'',l.id||''])));
    const plans=arr(state.plans);
    const planRows=plans.map(p=>[p.id||'',p.name||'',p.kind||'',p.potId||'',p.start||'',p.end||'',p.note||'',JSON.stringify(p.steps||[])]);
    const debts=arr(state.debts);
    const debtRows=debts.map(d=>[d.id||'',d.name||'',d.type||'',Number(d.balance)||0,Number(d.original)||0,Number(d.rate)||0,Number(d.minPayment)||0,d.dueDay||'',d.note||'',JSON.stringify(d.payments||[])]);
    const debtPayRows=[]; debts.forEach(d=>arr(d.payments).forEach(p=>debtPayRows.push([d.name||'',p.date||'',Number(p.amount)||0,p.note||'',p.id||''])));
    const goals=arr(state.goals);
    const goalRows=goals.map(g=>[g.id||'',g.name||'',Number(g.target)||0,g.deadline||'',g.potId||'',g.note||'',JSON.stringify(g.log||[])]);
    const goalLogRows=[]; goals.forEach(g=>arr(g.log).forEach(l=>goalLogRows.push([g.name||'',l.date||'',Number(l.amount)||0,l.note||'',l.id||''])));
    const wishes=arr(state.wishes);
    const wishRows=wishes.map(w=>[w.id||'',w.name||'',Number(w.price)||0,w.note||'',w.bought?'ซื้อแล้ว':'ยังไม่ได้ซื้อ',w.createdAt||'']);
    const budgetRows=[]; const budgets=(state.settings&&state.settings.budgets)||{};
    Object.entries(budgets).forEach(([id,amount])=>{let c=arr(typeof CATS_EXP!=='undefined'?CATS_EXP:[]).find(x=>x.id===id); budgetRows.push([id,c?c.name:id,Number(amount)||0]);});
    const settingRows=Object.entries(state.settings||{}).map(([k,v])=>[k,json(v)]);
    const income=sum(tx.filter(t=>t.type==='income'),t=>t.amount), expense=sum(tx.filter(t=>t.type!=='income'),t=>t.amount);
    const summaryRows=[['รายการ','ค่า'],['วันที่ส่งออก',new Date().toLocaleString('th-TH')],['จำนวนรายการทั้งหมด',tx.length],['รายรับรวม',income],['รายจ่ายรวม',expense],['คงเหลือสุทธิ',income-expense],['จำนวนบิล',bills.length],['จำนวนกระปุกเงินเก็บ',pots.length],['จำนวนแผนออม',plans.length],['จำนวนหนี้',debts.length],['จำนวนเป้าหมาย',goals.length],['จำนวนของที่อยากได้',wishes.length]];
    const data=[
      ['ภาพรวม',summaryRows],
      ['รายรับรายจ่าย',rows(['รหัส','วันที่','ประเภท','หมวดหมู่','จำนวนเงิน (บาท)','บันทึก','บัญชี','วันที่สร้าง'],txRows)],
      ['รายการต้องจ่าย',rows(['รหัส','ชื่อรายการ','จำนวนเงิน (บาท)','วันครบกำหนด','หมวดหมู่','สถานะ','ประวัติการจ่าย (JSON)','หมายเหตุ'],billRows)],
      ['เงินเก็บ',rows(['รหัส','ชื่อกระปุก','หมายเหตุ','เป้าหมาย (บาท)','ยอดคงเหลือโดยประมาณ (บาท)','ประวัติ (JSON)'],potRows)],
      ['ประวัติเงินเก็บ',rows(['กระปุก','วันที่','ประเภท','จำนวนเงิน (บาท)','หมายเหตุ','รหัส'],potLogRows)],
      ['แผนออมเงิน',rows(['รหัส','ชื่อแผน','ประเภทแผน','รหัสกระปุก','วันเริ่ม','วันสิ้นสุด','หมายเหตุ','ขั้นตอน (JSON)'],planRows)],
      ['หนี้สิน',rows(['รหัส','ชื่อหนี้','ประเภท','ยอดคงเหลือ (บาท)','ยอดตั้งต้น (บาท)','ดอกเบี้ย (%)','ยอดจ่ายขั้นต่ำ (บาท)','วันครบกำหนด','หมายเหตุ','ประวัติชำระ (JSON)'],debtRows)],
      ['ประวัติชำระหนี้',rows(['หนี้','วันที่','จำนวนเงิน (บาท)','หมายเหตุ','รหัส'],debtPayRows)],
      ['เป้าหมาย',rows(['รหัส','ชื่อเป้าหมาย','ยอดเป้าหมาย (บาท)','กำหนดเสร็จ','รหัสกระปุก','หมายเหตุ','ประวัติ (JSON)'],goalRows)],
      ['ประวัติเป้าหมาย',rows(['เป้าหมาย','วันที่','จำนวนเงิน (บาท)','หมายเหตุ','รหัส'],goalLogRows)],
      ['ของที่อยากได้',rows(['รหัส','ชื่อสิ่งของ','ราคา (บาท)','หมายเหตุ','สถานะ','วันที่สร้าง'],wishRows)],
      ['งบประมาณ',rows(['รหัสหมวดหมู่','หมวดหมู่','งบประมาณ (บาท)'],budgetRows)],
      ['ตั้งค่า',rows(['รายการตั้งค่า','ค่า'],settingRows)]
    ];
    const wb=XLSX.utils.book_new();
    data.forEach(([name, matrix])=>{
      const safe=matrix.map(row=>row.map(v=>v==null?'':v));
      const ws=XLSX.utils.aoa_to_sheet(safe);
      ws['!freeze']={xSplit:0,ySplit:1};
      ws['!autofilter']={ref:ws['!ref']||'A1'};
      const maxCols=Math.max(1,...safe.map(r=>r.length));
      ws['!cols']=Array.from({length:maxCols},(_,i)=>({wch:Math.min(38,Math.max(14,...safe.map(r=>String(r[i]??'').length+2)))}));
      XLSX.utils.book_append_sheet(wb,ws,name.slice(0,31));
    });
    const d=new Date(); const stamp=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
    XLSX.writeFile(wb,'sammut-ngern-'+stamp+'.xlsx');
  }
  window.exportFinanceExcel=exportFinanceExcel;
})();
