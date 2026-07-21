const $=s=>document.querySelector(s);const $$=s=>[...document.querySelectorAll(s)];
const store={get(k,f=null){try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}},set(k,v){localStorage.setItem(k,JSON.stringify(v))}};
let doctor=store.get('doctor');let orders=store.get('orders',[]);let editingOrder=null;let deferredPrompt;

function uid(){return 'IM-'+Date.now().toString(36).toUpperCase()+'-'+Math.random().toString(36).slice(2,6).toUpperCase()}
function escapeHtml(v=''){return String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function fmtDate(v=new Date()){return new Intl.DateTimeFormat('es-CL',{dateStyle:'long',timeStyle:'short'}).format(new Date(v))}

function addItem(value=''){
 const node=$('#itemTemplate').content.cloneNode(true);const row=node.querySelector('.item-row');row.querySelector('input').value=value;row.querySelector('.remove-item').onclick=()=>{if($$('.item-row').length>1)row.remove()};$('#itemsList').append(node)
}
function resetOrder(){editingOrder=null;$('#orderForm').reset();$('#itemsList').innerHTML='';addItem()}
function showWorkspace(){
 $('#onboarding').classList.add('hidden');$('#workspace').classList.remove('hidden');renderProfile();renderHistory();if(!$('#itemsList').children.length)addItem()
}
function showOnboarding(){
 $('#workspace').classList.add('hidden');$('#onboarding').classList.remove('hidden');if(doctor){$('#doctorName').value=doctor.name||'';$('#doctorSpecialty').value=doctor.specialty||'';$('#doctorRut').value=doctor.rut||'';$('#doctorRegistry').value=doctor.registry||'';$('#doctorCenter').value=doctor.center||'';$('#doctorEmail').value=doctor.email||'';$('#doctorPhone').value=doctor.phone||'';$('#doctorAddress').value=doctor.address||'';if(doctor.logo){$('#logoPreview').src=doctor.logo;$('#logoPreviewWrap').classList.remove('hidden')}}
}


function fileToDataUrl(file){
 return new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(file)})
}
$('#doctorLogo').addEventListener('change',async e=>{
 const file=e.target.files?.[0];if(!file)return;
 if(file.size>1_500_000){alert('El logo debe pesar menos de 1,5 MB.');e.target.value='';return}
 const data=await fileToDataUrl(file);$('#logoPreview').src=data;$('#logoPreviewWrap').classList.remove('hidden')
});
$('#doctorForm').addEventListener('submit',async e=>{
 e.preventDefault();
 const file=$('#doctorLogo').files?.[0];
 const logo=file?await fileToDataUrl(file):(doctor?.logo||'');
 const signatureImage=doctor?.signatureImage||'firma-jeronimo.png';
 doctor={
  name:$('#doctorName').value.trim(),
  specialty:$('#doctorSpecialty').value.trim(),
  rut:$('#doctorRut').value.trim(),
  registry:$('#doctorRegistry').value.trim(),
  center:$('#doctorCenter').value.trim(),
  email:$('#doctorEmail').value.trim(),
  phone:$('#doctorPhone').value.trim(),
  address:$('#doctorAddress').value.trim(),
  logo,
  signatureImage
 };
 store.set('doctor',doctor);showWorkspace()
});
$('#editProfileBtn').onclick=showOnboarding;

$$('.tab').forEach(btn=>btn.onclick=()=>{$$('.tab').forEach(x=>x.classList.remove('active'));btn.classList.add('active');$$('.view').forEach(v=>v.classList.add('hidden'));$('#'+btn.dataset.view).classList.remove('hidden');if(btn.dataset.view==='history')renderHistory()});
$('#addItemBtn').onclick=()=>addItem();
$('#parseBtn').onclick=()=>{const t=$('#smartInput').value.trim();if(!t)return;const parts=t.split(/\n|;|\.(?=\s|$)/).map(x=>x.trim()).filter(Boolean);const obsIdx=parts.findIndex(x=>/descartar|sospecha|control|evaluar|diagn[oó]st/i.test(x));const examParts=obsIdx>=0?parts.slice(0,obsIdx):parts;const obsParts=obsIdx>=0?parts.slice(obsIdx):[];const exams=examParts.flatMap(p=>p.split(/\s+(?:y|más|\+)\s+/i)).map(x=>x.trim()).filter(Boolean);$('#itemsList').innerHTML='';(exams.length?exams:[t]).forEach(addItem);if(obsParts.length)$('#clinicalNote').value=obsParts.join('. ')};

function collectOrder(){
 const items=$$('.order-item').map(i=>i.value.trim()).filter(Boolean);if(!items.length)throw new Error('Agrega al menos un examen o procedimiento.');
 return {id:editingOrder?.id||uid(),createdAt:editingOrder?.createdAt||new Date().toISOString(),updatedAt:new Date().toISOString(),patient:{name:$('#patientName').value.trim(),rut:$('#patientRut').value.trim(),age:$('#patientAge').value.trim(),dob:$('#patientDob').value,address:$('#patientAddress').value.trim()},items,clinicalNote:$('#clinicalNote').value.trim(),preparation:$('#preparation').value.trim(),doctor:{...doctor},status:'Emitida'}
}
function renderOrder(o){
 const patientDob=o.patient.dob?fmtDate(o.patient.dob+'T12:00:00'):'No informada';
 return `
 <article class="clinical-order">
  <header class="clinical-header">
   <div class="clinical-brand">
    ${o.doctor.logo?`<img class="clinical-logo" src="${o.doctor.logo}" alt="Logo institucional">`:`<div class="indicamed-mark"><span class="indicamed-symbol">+</span><div><strong>IndicaMed</strong><small>Indicaciones médicas</small></div></div>`}
   </div>
   <div class="clinical-document-meta">
    <div class="document-type">ORDEN MÉDICA</div>
    <div><span>Fecha de emisión</span><strong>${fmtDate(o.createdAt)}</strong></div>
    <div><span>N.º de orden</span><strong>${escapeHtml(o.id)}</strong></div>
   </div>
  </header>

  <div class="clinical-accent"></div>

  <section class="clinical-section patient-section">
   <h3>DATOS DEL PACIENTE</h3>
   <div class="patient-data-grid">
    <div class="data-field data-wide"><span>Nombre completo</span><strong>${escapeHtml(o.patient.name)}</strong></div>
    <div class="data-field"><span>RUT</span><strong>${escapeHtml(o.patient.rut||'No informado')}</strong></div>
    <div class="data-field"><span>Edad</span><strong>${escapeHtml(o.patient.age||'No informada')}</strong></div>
    <div class="data-field"><span>Fecha de nacimiento</span><strong>${escapeHtml(patientDob)}</strong></div>
    ${o.patient.address?`<div class="data-field data-full"><span>Dirección</span><strong>${escapeHtml(o.patient.address)}</strong></div>`:''}
   </div>
  </section>

  <section class="clinical-section requested-section">
   <h3>EXÁMENES O PROCEDIMIENTOS SOLICITADOS</h3>
   <div class="requested-list">
    ${o.items.map(x=>`<div class="requested-item"><span class="medical-checkbox"></span><span>${escapeHtml(x)}</span></div>`).join('')}
   </div>
  </section>

  ${o.clinicalNote?`<section class="clinical-note-box"><h3>OBSERVACIÓN CLÍNICA</h3><p>${escapeHtml(o.clinicalNote)}</p></section>`:''}

  ${o.preparation?`<section class="clinical-preparation-box"><h3>PREPARACIÓN E INDICACIONES</h3><p>${escapeHtml(o.preparation)}</p></section>`:''}

  <footer class="clinical-footer">
   <div class="doctor-auth">
    <div class="doctor-marks">
     <img class="digital-signature" src="${o.doctor.signatureImage||'firma-jeronimo.png'}" alt="Firma digitalizada del profesional">
    </div>
    <div class="signature-rule"></div>
    <div class="doctor-card-name">Dr. ${escapeHtml(o.doctor.name.replace(/^Dr\.\s*/i,''))}</div>
    <div class="doctor-card-specialty">${escapeHtml(o.doctor.specialty)}</div>
    <div class="doctor-card-meta">
     <div>RUT ${escapeHtml(o.doctor.rut)}</div>
     ${o.doctor.registry?`<div>Registro SIS Nº ${escapeHtml(o.doctor.registry)}</div>`:''}
     ${o.doctor.center?`<div>${escapeHtml(o.doctor.center)}</div>`:''}
     ${o.doctor.email?`<div>${escapeHtml(o.doctor.email)}</div>`:''}
     ${o.doctor.phone?`<div>${escapeHtml(o.doctor.phone)}</div>`:''}
     ${o.doctor.address?`<div>${escapeHtml(o.doctor.address)}</div>`:''}
    </div>
   </div>

   <div class="clinical-verification">
    <div class="verification-label">DOCUMENTO EMITIDO DIGITALMENTE</div>
    <div>Código: ${escapeHtml(o.id)}</div>
    <div>Estado: ${escapeHtml(o.status)}</div>
    <div class="powered-by">Generado por <strong>IndicaMed</strong></div>
   </div>
  </footer>
 </article>`}

$('#previewBtn').onclick=()=>{try{const o=collectOrder();$('#printArea').innerHTML=renderOrder(o);$('#previewDialog').showModal()}catch(err){alert(err.message)}};
$('#closePreview').onclick=()=>$('#previewDialog').close();$('#printBtn').onclick=()=>window.print();
$('#orderForm').addEventListener('submit',e=>{e.preventDefault();try{const o=collectOrder();const idx=orders.findIndex(x=>x.id===o.id);if(idx>=0)orders[idx]=o;else orders.unshift(o);store.set('orders',orders);$('#printArea').innerHTML=renderOrder(o);$('#previewDialog').showModal();resetOrder();renderHistory()}catch(err){alert(err.message)}});

function renderHistory(){const root=$('#historyList');if(!orders.length){root.innerHTML='<p class="muted">Aún no hay órdenes emitidas.</p>';return}root.innerHTML=orders.map(o=>`<article class="history-card"><h3>${escapeHtml(o.patient.name)}</h3><div class="history-meta">${fmtDate(o.createdAt)} · ${escapeHtml(o.id)}</div><div>${o.items.slice(0,2).map(escapeHtml).join(' · ')}${o.items.length>2?'…':''}</div><div class="history-actions"><button class="secondary" data-view-order="${o.id}">Ver</button><button class="ghost" data-copy-order="${o.id}">Duplicar</button><button class="ghost" data-edit-order="${o.id}">Editar</button></div></article>`).join('');
 $$('[data-view-order]').forEach(b=>b.onclick=()=>{const o=orders.find(x=>x.id===b.dataset.viewOrder);$('#printArea').innerHTML=renderOrder(o);$('#previewDialog').showModal()});
 $$('[data-copy-order]').forEach(b=>b.onclick=()=>loadOrder(orders.find(x=>x.id===b.dataset.copyOrder),true));
 $$('[data-edit-order]').forEach(b=>b.onclick=()=>loadOrder(orders.find(x=>x.id===b.dataset.editOrder),false));
}
function loadOrder(o,duplicate){editingOrder=duplicate?null:o;$('#patientName').value=o.patient.name;$('#patientRut').value=o.patient.rut;$('#patientAge').value=o.patient.age;$('#patientDob').value=o.patient.dob;$('#patientAddress').value=o.patient.address;$('#itemsList').innerHTML='';o.items.forEach(addItem);$('#clinicalNote').value=o.clinicalNote;$('#preparation').value=o.preparation;$('.tab[data-view="newOrder"]').click();window.scrollTo({top:0,behavior:'smooth'})}
$('#clearHistory').onclick=()=>{if(confirm('¿Borrar todo el historial guardado en este dispositivo?')){orders=[];store.set('orders',orders);renderHistory()}};
function renderProfile(){const d=doctor;$('#profileSummary').innerHTML=`${d.logo?`<img src="${d.logo}" alt="Logo" style="max-height:80px;max-width:220px;object-fit:contain;margin-bottom:12px">`:''}<p><strong>${escapeHtml(d.name)}</strong><br>${escapeHtml(d.specialty)}</p><p>RUT: ${escapeHtml(d.rut)}${d.registry?`<br>Registro SIS: ${escapeHtml(d.registry)}`:''}${d.center?`<br>${escapeHtml(d.center)}`:''}${d.email?`<br>${escapeHtml(d.email)}`:''}${d.phone?`<br>${escapeHtml(d.phone)}`:''}${d.address?`<br>${escapeHtml(d.address)}`:''}</p>`}

window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;$('#installBtn').classList.remove('hidden')});$('#installBtn').onclick=async()=>{if(deferredPrompt){deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;$('#installBtn').classList.add('hidden')}};
if('serviceWorker' in navigator)navigator.serviceWorker.register('./sw.js');
doctor?showWorkspace():showOnboarding();
