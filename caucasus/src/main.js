import data from '../itinerary.json';
import shekiPhotos from '../../shared/images/caucasus-photo-batch-20260501.json';
import kakhetiPhotos from '../../shared/images/caucasus-photo-batch-20260502.json';
const pendingPhotos = [...shekiPhotos, ...kakhetiPhotos];
import {chapters} from './guide.js';
import uploadedAssets from '../../shared/images/caucasus-uploaded-webp-intake.json';
import {escapeHtml as esc, mapSearchUrl as maps, formatTravelDate as date} from '../../shared/travel-utils.js';
import '../../shared/style.css';
import './style.css';
const root=document.querySelector('#app');
let day=0, tab='days';
const storageKey='caucasus-2026-checks-v1';
const shoppingItems=['아제르바이잔 마나트(AZN)','조지아 라리(GEL)','아르메니아 드람(AMD)','튀르키예 리라(TRY)'];
const checklist=['여권·여행 서류','여행자 보험','카드·현지 통화·유로','충전기와 보조배터리','편한 운동화','산악 지역용 외투','선글라스와 자외선 차단제','오프라인 지도','항공편·여권 유효기간 확인'];
const reads=()=>{try{return JSON.parse(localStorage.getItem(storageKey)||'{}')}catch{return {}}};
const safeUrl=s=>esc(maps(s));
function renderPhotoFiles(files) {
 return (files||[]).map(file=> {
   const item=uploadedAssets.assets.find(x=>x.canonicalPath.endsWith('/'+file));
   if(!item)return '';
   return `<figure class="caucasus-illustration"><img loading="lazy" decoding="async" src="${import.meta.env.BASE_URL}illustrations/${encodeURIComponent(file)}" alt="${esc(file.replace(/^caucasus-(?:\\d{8}|undated)-/,'').replace(/-(?:watercolor|pencil|photo)-\\d+\\.webp$/,'').replace(/-/g,' '))}"></figure>`;
 }).join('');
}
function renderPhotoNote(id) {
 const art=pendingPhotos.find(item=>item.id===id);
 return art? `<p class="photo-caption">${esc(art.caption)}</p>` : '';
}
function render(){
 const d=data.days[day], tours=data.optionalTours.filter(t=>(d.optionalTourIds||[]).includes(t.id));
 root.innerHTML=`<header class="site-banner" style="background:linear-gradient(145deg,#1b3c48,#5d7e77)"><div class="banner-copy"><div class="eyebrow">코카서스 여행기 · 2026.4.29—5.11</div><h1>코카서스 <em>3국 13일</em></h1><p>아제르바이잔 · 조지아 · 아르메니아</p><p style="margin-top:12px"><a href="../" style="color:#fff">← 여행 선택</a></p></div></header>
 <nav aria-label="여행 메뉴">${[['days','일정'],['guide','여행 해설'],['shopping','쇼핑'],['list','준비']].map(([k,n])=>`<button data-tab="${k}" class="${tab===k?'active':''}">${n}</button>`).join('')}</nav>
 <main>${tab==='days'?`
 <div class="days" aria-label="날짜 선택">${data.days.map((x,i)=>`<button type="button" data-day="${i}" class="${day===i?'selected':''}" title="${esc(date(x.date))} ${esc(x.city)}" aria-label="${i+1}일차 ${esc(date(x.date))}" ${day===i?'aria-current="date"':''}><small>${x.date.slice(5).replace('-','/')}</small><strong>${i+1}</strong></button>`).join('')}</div>
 <section><div class="eyebrow">${day+1}일차 · ${esc(d.country)}</div><h2>${esc(d.city)}</h2><p class="summary">${esc(d.summary)}</p>
 <article><h3>오늘의 일정</h3><p>${esc(d.summary)}</p></article>
 ${d.hotel&&d.hotel!=='—'?`<article><h3>숙소</h3><p>${d.hotel==='기내 숙박'?esc(d.hotel):`<a href="${safeUrl(d.hotel+', '+d.city)}" target="_blank" rel="noopener noreferrer">${esc(d.hotel)}</a>`}</p></article>`:''}
 <article><h3>방문지</h3>${d.places.map(p=>`<div class="location-card"><h4>${esc(p.name)}</h4><p>${esc(p.description)}</p>${(p.photoIds||[]).map(renderPhotoNote).join('')}${renderPhotoFiles(p.photoFiles)}</div>`).join('')}</article>
 ${d.photoObservations?.length?`<article><h3>현장 기록</h3>${d.photoObservations.map(p=>`<div class="location-card"><h4>${esc(p.title)}</h4><p>${esc(p.description)}</p>${renderPhotoNote(p.imageId)}${renderPhotoFiles(p.photoFiles)}</div>`).join('')}</article>`:''}
 ${tours.length?`<article><h3>참여한 선택관광</h3><ul class="tour-list">${tours.map(t=>`<li><strong>${esc(t.title)}</strong> · €${t.priceEUR}<p>${esc(t.summary)}</p></li>`).join('')}</ul></article>`:''}
 <article class="note"><h3>여행 기록</h3><p class="new-photos">해당 날짜의 사진과 현장 기록은 자료를 받는 대로 방문지에 연결합니다.</p></article></section>
 <div class="pager"><button data-prev ${day===0?'disabled':''}>← 이전 날</button><button data-next ${day===data.days.length-1?'disabled':''}>다음 날 →</button></div>`
 :tab==='guide'?`<h2>여행 해설</h2><p>기존 탄탄탄 여행 가이드의 구성과 편집 원칙을 이어받습니다.</p>${chapters.map(c=>`<article><h3>${esc(c.title)}</h3>${c.body.map(p=>`<p>${esc(p)}</p>`).join('')}</article>`).join('')}`
 :tab==='shopping'?`<h2>쇼핑</h2><article><h3>방문국 통화</h3><p>${shoppingItems.map(esc).join(' · ')}</p><p>쇼핑 영수증과 실제 환전 내역은 추가 자료에 맞춰 정리합니다. 환율은 실제 결제일의 통화와 기준일을 확인해 기재하겠습니다.</p></article><article><h3>참여한 선택관광</h3><ul class="tour-list">${data.optionalTours.map(t=>`<li>${esc(date(t.date))} · <strong>${esc(t.title)}</strong> · €${t.priceEUR}</li>`).join('')}</ul></article>`
 :`<h2>준비</h2><p>체크한 항목은 이 여행 가이드에만 저장됩니다.</p><article><h3>준비물 체크리스트</h3>${checklist.map((v,i)=>`<p><label><input type="checkbox" data-check="${i}" ${reads()[i]?'checked':''}> ${esc(v)}</label></p>`).join('')}</article><article><h3>항공 일정</h3>${data.flights.map(f=>`<p><strong>${esc(f.number)}</strong> · ${esc(f.from)} → ${esc(f.to)} · ${esc(f.date)} ${esc(f.depart)}–${esc(f.arrive)}${f.arriveDate?' (+1일)':''}</p>`).join('')}</article>`
 }</main><footer>코카서스 여행 동반자 · 2026</footer>`;
 root.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{tab=b.dataset.tab;render()});
 root.querySelectorAll('[data-day]').forEach(b=>b.onclick=()=>{day=Number(b.dataset.day);render()});
 root.querySelector('[data-prev]')?.addEventListener('click',()=>{day--;render()});
 root.querySelector('[data-next]')?.addEventListener('click',()=>{day++;render()});
 root.querySelectorAll('[data-check]').forEach(b=>b.onchange=()=>{const state=reads();state[b.dataset.check]=b.checked;localStorage.setItem(storageKey,JSON.stringify(state))});
}
render();if('serviceWorker' in navigator)addEventListener('load',()=>navigator.serviceWorker.register(import.meta.env.BASE_URL+'sw-caucasus.js',{scope:import.meta.env.BASE_URL+'caucasus/'}).catch(()=>{}));
