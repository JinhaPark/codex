import './style.css';
import data from './itinerary.json';
const root=document.querySelector('#app');
const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Tashkent',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
let day=Math.max(0,data.days.findIndex(d=>d.date===today));if(!data.days.some(d=>d.date===today))day=today>data.trip.end?9:0;
let tab='days';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const maps=s=>'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(s);
const date=s=>new Date(s+'T12:00:00Z').toLocaleDateString('en-US',{month:'short',day:'numeric',weekday:'short',timeZone:'UTC'});
const checks=()=>{try{return JSON.parse(localStorage.getItem('central-asia-checks')||'{}')}catch{return {}}};
const checklist=['Passport and travel documents','Travel insurance','Payment card and some cash','Phone charger and power bank','Comfortable walking shoes','Warm mountain layer','Swimwear for hot springs','Sun protection and water','Offline maps','Check flight and train times'];
function render(){
const d=data.days[day];
root.innerHTML=`<header><div class="eyebrow">THE SILK ROAD JOURNAL · OCT 12—21, 2026</div><h1>Central <em>Asia.</em></h1><p>Uzbekistan · Kyrgyzstan · Kazakhstan</p></header>
<nav aria-label="Sections"><button data-tab="days" class="${tab==='days'?'active':''}">Itinerary</button><button data-tab="guide" class="${tab==='guide'?'active':''}">Field guide</button><button data-tab="list" class="${tab==='list'?'active':''}">Checklist</button></nav>
<main>${tab==='days'?`<div class="days">${data.days.map((x,i)=>`<button data-day="${i}" class="${day===i?'selected':''}"><small>${esc(date(x.date))}</small><strong>${i+1}</strong></button>`).join('')}</div>
<section><div class="eyebrow">DAY ${day+1} · ${esc(d.country)}</div><h2>${esc(d.city)}</h2><p class="summary">${esc(d.summary)}</p><article><h3>Schedule</h3>${d.summary.split(/(?<=\\.) /).map(x=>`<p>• ${esc(x)}</p>`).join('')}</article><article><h3>Hotel</h3><p>${esc(d.hotel)}</p>${d.hotel!=='—'&&d.hotel!=='Overnight flight'?`<a target="_blank" rel="noopener" href="${maps(d.hotel)}">Find hotel on Google Maps ↗</a>`:''}</article><article><h3>Places & maps</h3>${d.places.map(p=>`<a class="place" href="${maps(p)}" target="_blank" rel="noopener">📍 ${esc(p)} ↗</a>`).join('')}</article><article class="note"><h3>History & geology</h3><p>${esc(d.guide)}</p></article></section><div class="pager"><button data-prev ${day===0?'disabled':''}>← Previous</button><button data-next ${day===9?'disabled':''}>Next →</button></div>`:tab==='guide'?`<h2>Travel field guide</h2><article><h3>Uzbekistan · Silk Road</h3><p>Bukhara and Samarkand were major trading and scholarly centers. Look for Timurid tilework, brick vaults, observatories and madrasas.</p></article><article><h3>Kyrgyzstan · Tian Shan</h3><p>Issyk-Kul is a deep lake in a tectonic basin. The surrounding mountain ranges are shaped by ongoing tectonic activity.</p></article><article><h3>Kazakhstan · Charyn</h3><p>Charyn Canyon's layered sedimentary rocks record depositional environments and subsequent erosion.</p></article>${data.essentials.map(e=>`<details><summary>${esc(e.title)}</summary><p>${esc(e.body)}</p></details>`).join('')}`:`<h2>Packing checklist</h2><p>Stored locally on this device.</p><article>${checklist.map((x,i)=>`<label class="check"><input type="checkbox" data-check="${i}" ${checks()[i]?'checked':''}><span>${esc(x)}</span></label>`).join('')}</article>`}</main><footer>Central Asia 2026 · ${navigator.onLine?'Online':'Offline'}<p>Tour schedule may change; verify transport and locations locally.</p></footer>`;
root.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{tab=b.dataset.tab;render()});
root.querySelectorAll('[data-day]').forEach(b=>b.onclick=()=>{day=Number(b.dataset.day);render()});
root.querySelector('[data-prev]')?.addEventListener('click',()=>{day--;render()});
root.querySelector('[data-next]')?.addEventListener('click',()=>{day++;render()});
root.querySelectorAll('[data-check]').forEach(b=>b.onchange=()=>{let x=checks();x[b.dataset.check]=b.checked;localStorage.setItem('central-asia-checks',JSON.stringify(x))});
}
render();addEventListener('online',render);addEventListener('offline',render);
if('serviceWorker' in navigator)addEventListener('load',()=>navigator.serviceWorker.register(import.meta.env.BASE_URL+'sw.js').catch(()=>{}));
