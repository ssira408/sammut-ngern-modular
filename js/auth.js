(function(){
'use strict';
let client=null, session=null, signup=false;
const $=id=>document.getElementById(id);
function configured(){
 const u=window.SAMMUT_SUPABASE_URL||'', k=window.SAMMUT_SUPABASE_ANON_KEY||'';
 return window.supabase && window.supabase.createClient && /^https:\/\/.+\.supabase\.co$/.test(u) && k && !k.includes('YOUR_');
}
function showAuth(message=''){
 const gate=$('auth-gate'); gate.hidden=false; gate.style.display='grid';
 $('splash').hidden=true; $('app').hidden=true;
 $('auth-message').textContent=message;
 $('auth-submit').textContent=signup?'สมัครสมาชิก':'เข้าสู่ระบบ';
 $('auth-toggle').textContent=signup?'มีบัญชีแล้ว? เข้าสู่ระบบ':'สร้างบัญชีใหม่';
 $('auth-password').autocomplete=signup?'new-password':'current-password';
}
function init(){
 if(!configured()){showAuth('ต้องตั้งค่า Project URL และ anon/public key ในไฟล์ js/supabase-config.js ก่อนใช้งาน');return null;}
 client=window.supabase.createClient(window.SAMMUT_SUPABASE_URL,window.SAMMUT_SUPABASE_ANON_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
 return client;
}
$('auth-toggle').addEventListener('click',()=>{signup=!signup;showAuth('');});
$('auth-form').addEventListener('submit',async e=>{
 e.preventDefault(); const c=client||init(); if(!c)return;
 const email=$('auth-email').value.trim(),password=$('auth-password').value;
 $('auth-submit').disabled=true; $('auth-message').style.color='#52645a'; $('auth-message').textContent='กำลังดำเนินการ…';
 try{
  let result;
  if(signup) result=await c.auth.signUp({email,password});
  else result=await c.auth.signInWithPassword({email,password});
  if(result.error)throw result.error;
  if(signup&&!result.data.session){showAuth('สมัครแล้ว กรุณาตรวจสอบอีเมลเพื่อยืนยันบัญชี แล้วกลับมาเข้าสู่ระบบ');return;}
  session=result.data.session;
  if(session){$('auth-gate').hidden=true;$('auth-gate').style.display='none';window.startFinanceApp(session.user);}
 }catch(err){showAuth(err.message||'ดำเนินการไม่สำเร็จ');}
 finally{$('auth-submit').disabled=false;}
});
window.SammutAuth={
 async start(){
  const c=init(); if(!c)return null;
  try{const {data,error}=await c.auth.getSession();if(error)throw error;session=data.session;
   if(session){$('auth-gate').hidden=true;$('auth-gate').style.display='none';return session.user;}
   showAuth();return null;
  }catch(e){showAuth('เชื่อมต่อ Supabase ไม่สำเร็จ: '+e.message);return null;}
 },
 client(){return client;},
 user(){return session&&session.user;},
 async signOut(){if(client)await client.auth.signOut();session=null;location.reload();}
};
})();
