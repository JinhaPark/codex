import './style.css';
import data from './itinerary.json';
import uzbekistanResearch from './uzbekistan-research.js';
import bukharaHistory from './bukhara-history.js';
import history_samarkand from './history-samarkand.js';
import history_tashkent from './history-tashkent.js';
import history_bishkek from './history-bishkek.js';
import history_cholponata from './history-cholponata.js';
import history_almaty from './history-almaty.js';
const otherCityHistories=[history_samarkand,history_tashkent,history_bishkek,history_cholponata,history_almaty];
import architecture from './uzbekistan-architecture.js';
import silkRoadIntroduction from './silk-road-introduction.js';
import comparativeArchitecture from './islamic-architecture-comparative.js';
import centralAsiaEconomy from './central-asia-economy.js';
const root=document.querySelector('#app');
const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Tashkent',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
let day=Math.max(0,data.days.findIndex(d=>d.date===today));if(!data.days.some(d=>d.date===today))day=today>data.trip.end?9:0;
let tab='days';
const fxCurrencies={UZS:'우즈베키스탄 숨',KGS:'키르기스스탄 솜',KZT:'카자흐스탄 텡게'};
let fxCurrency='UZS',fxAmount='10000';
let fxRates=null,fxUpdated='',fxError='';
const won=n=>new Intl.NumberFormat('ko-KR',{maximumFractionDigits:0}).format(n);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const placeNames=['인천국제공항 제2여객터미널','타슈켄트 국제공항','부하라 아르크 성채','칼랸 미나레트','라비하우즈','나디르 디반베기 마드라사','이스마일 사마니 영묘','차슈마 아유브 영묘','시토라이 모히 호사 궁전','레기스탄 광장','비비하눔 모스크','아프라시압 박물관','울루그벡 천문대','구르에미르 영묘','타슈켄트 미노르 모스크','아미르 티무르 광장','하즈라티 이맘 단지','마나스 국제공항','루흐 오르도 문화센터','촐폰아타 암각화','이식쿨 호수','촐폰아타','알라아르차 국립공원','코르다이 국경','알마티','차른 협곡','루나 캐니언','블랙 캐니언','오이 카라가이','판필로프 공원','젠코프 승천 성당','그린 바자르','아르바트 거리'];
const maps=s=>'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(s);
const date=s=>new Date(s+'T12:00:00Z').toLocaleDateString('ko-KR',{month:'short',day:'numeric',weekday:'short',timeZone:'UTC'});
const checks=()=>{try{return JSON.parse(localStorage.getItem('central-asia-checks')||'{}')}catch{return {}}};
const travelPhrases=[['Assalomu alaykum','아살로무 알라이쿰','안녕하세요'],['Vaalaykum assalom','바알라이쿰 아살롬','인사에 대한 답'],['Salom','살롬','안녕'],['Rahmat','라흐마트','감사합니다'],['Iltimos','일티모스','부탁합니다'],['Ha / Yo‘q','하 / 요크','예 / 아니요'],['Kechirasiz','케치라시즈','실례합니다'],['Bu qancha turadi?','부 칸차 투라디?','얼마예요?'],['Juda qimmat!','주다 킴마트!','너무 비싸요!'],['Hojatxona qayerda?','호자트호나 카예르다?','화장실이 어디예요?']];
function speakUzbek(phrase){
 if(!('speechSynthesis' in window)){alert('이 브라우저는 음성 재생을 지원하지 않습니다.');return}
 const synth=window.speechSynthesis;
 synth.cancel();
 const voice=synth.getVoices().find(v=>/^uz(?:-|$)/i.test(v.lang));
 if(!voice){
  alert('이 기기에 우즈베크어 음성이 설치되어 있지 않습니다. 영어식 발음을 잘못 재생하지 않도록 음성 재생을 중단했습니다. 우즈베크어 음성 설치 또는 별도 우즈베크어 TTS 서비스가 필요합니다.');
  return;
 }
 const u=new SpeechSynthesisUtterance(phrase);
 u.lang=voice.lang;u.voice=voice;u.rate=0.9;
 synth.speak(u);
}


function renderEconomy(){return `<section class="bukhara-history" id="central-asia-economy"><h3>${esc(centralAsiaEconomy.title)}</h3><p class="bukhara-intro">${esc(centralAsiaEconomy.intro)}</p><div style="overflow-x:auto"><table style="width:100%;min-width:520px"><thead><tr><th>국가</th><th>인구(만 명)</th><th>GDP(억 달러)</th><th>1인당 GDP</th></tr></thead><tbody>${centralAsiaEconomy.countries.map(c=>`<tr><td>${esc(c[0])}</td><td>${esc(c[1])}</td><td>${esc(c[2])}</td><td>${esc(c[3])}</td></tr>`).join('')}</tbody></table></div><div class="bukhara-chapters">${centralAsiaEconomy.countries.map(c=>`<details class="bukhara-chapter"><summary>${esc(c[0])} — ${esc(c[4])}</summary><div class="bukhara-chapter-body"><p>${esc(c[5])}</p></div></details>`).join('')}${centralAsiaEconomy.chapters.map(([h,b])=>`<details class="bukhara-chapter"><summary>${esc(h)}</summary><div class="bukhara-chapter-body"><p>${esc(b)}</p></div></details>`).join('')}</div><div class="bukhara-references"><h4>출처</h4>${centralAsiaEconomy.sources.map(([n,u])=>`<a href="${esc(u)}" target="_blank" rel="noopener noreferrer">${esc(n)} ↗</a>`).join('')}</div></section>`}
const checklist=['여권과 여행 서류','여행자 보험','결제 카드와 현금','충전기와 보조배터리','편한 운동화','산악 지역용 보온 의류','온천용 수영복','선크림과 물','오프라인 지도','항공편과 열차 시간 재확인'];
function render(){
const d=data.days[day];
root.innerHTML=`<header><div class="eyebrow">실크로드 여행기 · 2026.10.12—21</div><h1>중앙아시아 <em>탄탄탄</em></h1><p>우즈베키스탄 · 키르기스스탄 · 카자흐스탄</p></header>
<nav aria-label="여행 메뉴"><button data-tab="days" class="${tab==='days'?'active':''}">일정</button><button data-tab="guide" class="${tab==='guide'?'active':''}">여행 해설</button><button data-tab="fx" class="${tab==='fx'?'active':''}">환율/회화</button><button data-tab="list" class="${tab==='list'?'active':''}">준비물</button></nav>
<main>${tab==='days'?`<div class="days">${data.days.map((x,i)=>`<button data-day="${i}" class="${day===i?'selected':''}"><small>${esc(date(x.date))}</small><strong>${i+1}</strong></button>`).join('')}</div>
<section><div class="eyebrow">${day+1}일차 · ${esc(d.countryKo)}</div><h2>${esc(d.cityKo)}</h2><p class="summary">${esc(d.summaryKo)}</p><article><h3>오늘의 일정</h3>${d.summaryKo.split(/(?<=\.)\s+/).map(x=>`<p>• ${esc(x)}</p>`).join('')}</article><article><h3>숙소</h3><p>${esc(d.hotelKo||d.hotel)}</p>${d.hotel!=='—'&&d.hotel!=='Overnight flight'?`<a target="_blank" rel="noopener" href="${maps(d.hotel)}">구글 지도에서 숙소 찾기 ↗</a>`:''}</article><article><h3>방문지와 지도</h3>${d.places.map((p,i)=>`<div class="destination-card"><div class="destination-body"><h4>${esc((d.placesKo||[])[i]||p)}</h4><p>${esc((d.placeDetails||[])[i]?.description||"방문지에 대한 상세 설명을 준비하고 있습니다.")}</p><a href="${maps(p)}" target="_blank" rel="noopener">구글 지도에서 위치 보기 ↗</a></div></div>`).join('')}</article><article class="note"><h3>역사와 지질 이야기</h3><p>${esc(d.guideKo)}</p></article><article class="note"><h3>여행 관찰 포인트</h3><p>${esc(d.tipKo)}</p></article></section><div class="pager"><button data-prev ${day===0?'disabled':''}>← 이전 날</button><button data-next ${day===9?'disabled':''}>다음 날 →</button></div>`:tab==='guide'?`<h2>여행 해설</h2><section class="bukhara-history" id="silk-road-introduction"><h3>${esc(silkRoadIntroduction.title)}</h3><p class="bukhara-intro">${esc(silkRoadIntroduction.intro)}</p><p class="bukhara-count">${silkRoadIntroduction.chapters.length}개 주제 · 열차 안에서 읽는 여행의 서론</p><div class="bukhara-chapters">${silkRoadIntroduction.chapters.map(([title,paragraphs],i)=>`<details class="bukhara-chapter" ${i===0?'open':''}><summary><span>${esc(title)}</span></summary><div class="bukhara-chapter-body">${paragraphs.map(p=>`<p>${esc(p)}</p>`).join('')}</div></details>`).join('')}</div><div class="bukhara-references"><h4>참고자료</h4>${silkRoadIntroduction.sources.map(([name,url])=>`<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(name)} ↗</a>`).join('')}</div></section><section class="bukhara-history" id="bukhara-history"><h3>${esc(bukharaHistory.title)}</h3><p class="bukhara-intro">${esc(bukharaHistory.intro)}</p><p class="bukhara-count">총 ${bukharaHistory.chapters.length}장 · 약 1만 자 · 본문은 오프라인에서도 열람 가능</p><div class="bukhara-chapters">${bukharaHistory.chapters.map(([title,paragraphs],i)=>`<details class="bukhara-chapter" ${i===0?'open':''}><summary><span>${esc(title)}</span></summary><div class="bukhara-chapter-body">${paragraphs.map(p=>`<p>${esc(p)}</p>`).join('')}</div></details>`).join('')}</div><div class="bukhara-references"><h4>참고자료</h4><p>본문은 여러 역사 연구와 세계유산 자료를 바탕으로 정리했습니다. 전승과 역사적 사실은 구분했습니다.</p>${bukharaHistory.sources.map(([name,url])=>`<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(name)} ↗</a>`).join('')}</div></section>${otherCityHistories.filter(city=>city.slug==="samarkand").map(city=>`<section class="bukhara-history" id="history-${esc(city.slug)}"><h3>${esc(city.title)} 도시사 심층 해설</h3><p class="bukhara-intro">${esc(city.intro)}</p><p class="bukhara-count">${city.chapters.length}개 주제 · 본문 오프라인 열람 가능</p><div class="bukhara-chapters">${city.chapters.map(([title,body],i)=>`<details class="bukhara-chapter"><summary><span>${esc(title)}</span></summary><div class="bukhara-chapter-body"><p>${esc(body)}</p></div></details>`).join('')}</div><div class="bukhara-references"><h4>참고자료</h4>${city.sources.map(([name,url])=>`<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(name)} ↗</a>`).join('')}</div></section>`).join('')}<section class="bukhara-history" id="architecture-comparative"><h3>${esc(comparativeArchitecture.title)}</h3><p class="bukhara-intro">${esc(comparativeArchitecture.intro)}</p><p class="bukhara-count">${comparativeArchitecture.chapters.length}개 비교 주제 · 사진 없이 읽기</p><div class="bukhara-chapters">${comparativeArchitecture.chapters.map(([title,paragraphs])=>`<details class="bukhara-chapter"><summary><span>${esc(title)}</span></summary><div class="bukhara-chapter-body">${paragraphs.map(p=>`<p>${esc(p)}</p>`).join('')}</div></details>`).join('')}</div><div class="bukhara-references"><h4>참고자료</h4>${comparativeArchitecture.sources.map(([name,url])=>`<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(name)} ↗</a>`).join('')}</div></section><section class="architecture-guide"><h3>우즈베키스탄 이슬람 건축 유산</h3><p class="architecture-intro">실크로드와 티무르 시대의 번영이 남긴 청색 타일, 거대한 돔, 정교한 벽돌 장식을 만나보세요. 사마르칸트·부하라의 주요 유적을 도시별로 정리했습니다.</p>${architecture.map((city,i)=>`<details class="architecture-city" ${i===0?'open':''}><summary><span class="city-name">${esc(city.city)} <small>${esc(city.en)}</small></span><span class="city-subtitle">${esc(city.subtitle)}</span></summary><div class="architecture-city-body"><p>${esc(city.intro)}</p>${city.sites.map(([name,en,description])=>`<div class="architecture-site"><h4>${esc(name)} <small>${esc(en)}</small></h4><p>${esc(description)}</p></div>`).join('')}</div></details>`).join('')}<p class="architecture-footnote">관찰 포인트 · 햇빛에 따라 달라지는 타일 색상, 기하학적 반복 무늬, 돔과 이완의 구조를 비교해 보세요.</p><p class="architecture-footnote">참고: <a href="https://whc.unesco.org/en/list/603" target="_blank" rel="noopener noreferrer">UNESCO 사마르칸트</a> · <a href="https://whc.unesco.org/en/list/602" target="_blank" rel="noopener noreferrer">UNESCO 부하라</a></p></section>${otherCityHistories.filter(city=>city.slug==="tashkent").map(city=>`<section class="bukhara-history" id="history-${esc(city.slug)}"><h3>${esc(city.title)} 도시사 심층 해설</h3><p class="bukhara-intro">${esc(city.intro)}</p><p class="bukhara-count">${city.chapters.length}개 주제 · 본문 오프라인 열람 가능</p><div class="bukhara-chapters">${city.chapters.map(([title,body],i)=>`<details class="bukhara-chapter"><summary><span>${esc(title)}</span></summary><div class="bukhara-chapter-body"><p>${esc(body)}</p></div></details>`).join('')}</div><div class="bukhara-references"><h4>참고자료</h4>${city.sources.map(([name,url])=>`<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(name)} ↗</a>`).join('')}</div></section>`).join('')}${otherCityHistories.filter(city=>!["tashkent","samarkand"].includes(city.slug)).map(city=>`<section class="bukhara-history" id="history-${esc(city.slug)}"><h3>${esc(city.title)} 도시사 심층 해설</h3><p class="bukhara-intro">${esc(city.intro)}</p><p class="bukhara-count">${city.chapters.length}개 주제 · 본문 오프라인 열람 가능</p><div class="bukhara-chapters">${city.chapters.map(([title,body],i)=>`<details class="bukhara-chapter"><summary><span>${esc(title)}</span></summary><div class="bukhara-chapter-body"><p>${esc(body)}</p></div></details>`).join('')}</div><div class="bukhara-references"><h4>참고자료</h4>${city.sources.map(([name,url])=>`<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(name)} ↗</a>`).join('')}</div></section>`).join('')}<section class="research"><h3>우즈베키스탄 심층 해설</h3><p>역사·문화·종교·산업·경제·지리와 환경을 함께 살펴보세요. 항목을 누르면 자세한 설명과 참고자료가 펼쳐집니다.</p>${uzbekistanResearch.map((topic,i)=>`<details class="research-topic" ${i===0?'open':''}><summary>${esc(topic.title)}</summary><div class="research-body">${topic.paragraphs.map(p=>`<p>${esc(p)}</p>`).join('')}<p class="research-note"><strong>여행 관찰 포인트</strong> · ${esc(topic.note)}</p><div class="research-sources"><strong>참고자료</strong>${topic.sources.map(([name,url])=>`<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(name)} ↗</a>`).join('')}</div></div></details>`).join('')}</section><article><h3>우즈베키스탄 · 실크로드</h3><p>부하라와 사마르칸트는 실크로드 교역과 학문의 중심지였습니다. 벽돌 아치, 청색 타일과 천문대 유적을 비교해 보세요.</p></article><article><h3>키르기스스탄 · 톈산산맥</h3><p>이식쿨 호수는 톈산산맥의 지각 분지에 자리합니다. 주변 산맥에는 융기와 침식의 흔적이 남아 있습니다.</p></article><article><h3>카자흐스탄 · 차른 협곡</h3><p>차른 협곡의 퇴적층은 과거 환경을 기록하며 하천 침식과 풍화가 오늘날의 협곡을 형성했습니다.</p></article>${renderEconomy()}${data.essentials.filter(e=>e.title!=='현지 여행 회화').map(e=>`<details><summary>${esc(e.title)}</summary><p>${esc(e.body)}</p></details>`).join('')}`:tab==='fx'?`<h2>환율/회화</h2><p>현지 통화를 원화로 환산합니다. 우즈베키스탄·키르기스스탄·카자흐스탄 통화를 지원합니다.</p><article class="fx-panel"><label for="fx-currency">현지 통화</label><select id="fx-currency">${Object.entries(fxCurrencies).map(([k,v])=>`<option value="${k}" ${fxCurrency===k?'selected':''}>${v} (${k})</option>`).join('')}</select><label for="fx-amount">현지 통화 금액</label><input id="fx-amount" type="number" min="0" step="any" inputmode="decimal" value="${esc(fxAmount)}"><div class="fx-result" id="fx-result"></div><button type="button" id="fx-refresh">최신 환율 새로고침</button><p class="fx-caption" id="fx-status"></p></article><article class="phrases"><h3>현지 여행 회화</h3><p>표의 셀을 누르면 우즈베크어 음성으로 재생합니다. 기기에 우즈베크어 음성이 없으면 잘못된 발음 대신 안내를 표시합니다. 현지에서 인사할 때는 아살로무 알라이쿰 또는 살롬을 사용하세요.</p><div class="phrase-scroll"><table class="phrase-table"><thead><tr><th scope="col">현지어</th><th scope="col">한국어 발음</th><th scope="col">뜻</th></tr></thead><tbody>${travelPhrases.map(([original,pronunciation,meaning])=>`<tr data-speak="${travelPhrases.indexOf(travelPhrases.find(p=>p[0]===original))}" tabindex="0" role="button" aria-label="${esc(original)} 발음 듣기"><td>${esc(original)} 🔊</td><td>${esc(pronunciation)}</td><td>${esc(meaning)}</td></tr>`).join('')}</tbody></table></div></article>`:`<h2>여행 준비물</h2><p>체크 상태는 이 기기에 저장됩니다.</p><article>${checklist.map((x,i)=>`<label class="check"><input type="checkbox" data-check="${i}" ${checks()[i]?'checked':''}><span>${esc(x)}</span></label>`).join('')}</article>`}</main><footer>중앙아시아 탄탄탄 · ${navigator.onLine?'온라인':'오프라인'}<p>현지 상황에 따라 일정이 변경될 수 있습니다.</p></footer>`;
if(tab==='fx')setupFx();
root.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{tab=b.dataset.tab;render()});
root.querySelectorAll('[data-day]').forEach(b=>b.onclick=()=>{day=Number(b.dataset.day);render()});
root.querySelector('[data-prev]')?.addEventListener('click',()=>{day--;render()});
root.querySelector('[data-next]')?.addEventListener('click',()=>{day++;render()});
root.querySelectorAll('[data-speak]').forEach(row=>{const play=()=>speakUzbek(travelPhrases[Number(row.dataset.speak)][0]);row.addEventListener('click',play);row.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();play()}})});
root.querySelectorAll('[data-check]').forEach(b=>b.onchange=()=>{let x=checks();x[b.dataset.check]=b.checked;localStorage.setItem('central-asia-checks',JSON.stringify(x))});
}
render();addEventListener('online',render);addEventListener('offline',render);
if('serviceWorker' in navigator)addEventListener('load',()=>navigator.serviceWorker.register(import.meta.env.BASE_URL+'sw.js').catch(()=>{}));

// Public exchange-rate data, no API key. Do not silently use stale estimates.
function showFx(){
 const result=root.querySelector('#fx-result'),status=root.querySelector('#fx-status');if(!result)return;
 const n=Number(fxAmount),rate=fxRates?.[fxCurrency];
 result.textContent=Number.isFinite(n)&&n>=0&&Number.isFinite(rate)?'≈ '+won(n*rate)+'원':'환율을 불러오는 중입니다';
 status.textContent=fxError|| (fxUpdated?'기준일: '+fxUpdated+' · 참고용 환율이며 실제 환전 금액과 다를 수 있습니다.':'인터넷 연결 후 환율을 조회합니다.');
}
async function fetchFx(force=false){
 if(fxRates&&!force){showFx();return}
 fxError='';showFx();
 try{
  const response=await fetch('https://latest.currency-api.pages.dev/v1/currencies/krw.json',{cache:'no-store'});
  if(!response.ok)throw Error('환율 서비스 오류');
  const json=await response.json();
  const rates={};for(const code of Object.keys(fxCurrencies)){const units=json.krw?.[code.toLowerCase()];if(!units||!Number.isFinite(units))throw Error('통화 정보 누락');rates[code]=1/units}
  fxRates=rates;fxUpdated=json.date||'조회 시점';fxError='';
 }catch(e){fxError=fxRates?'최신 환율을 가져오지 못했습니다. 마지막으로 조회한 환율입니다.':'환율을 가져오지 못했습니다. 인터넷 연결을 확인하고 다시 시도해 주세요.'}
 showFx();
}
function setupFx(){
 root.querySelector('#fx-currency').onchange=e=>{fxCurrency=e.target.value;showFx()};
 root.querySelector('#fx-amount').oninput=e=>{fxAmount=e.target.value;showFx()};
 root.querySelector('#fx-refresh').onclick=()=>fetchFx(true);
 showFx();fetchFx();
}
