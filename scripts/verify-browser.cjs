/* Optional integration QA: requires Playwright and a Chromium executable; no production dependency. */
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require('playwright');
const repo=path.resolve(__dirname,'..'),scratch=path.dirname(repo),qa=path.join(scratch,'qa-integration');
const manifest=JSON.parse(fs.readFileSync(path.join(repo,'src/illustrations.json')));
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.webp':'image/webp','.svg':'image/svg+xml','.woff2':'font/woff2'};
fs.mkdirSync(qa,{recursive:true});
let cacheFixture=false;
const server=http.createServer((req,res)=>{
 let route=decodeURIComponent(req.url.split('?')[0]),file;
 if(route.startsWith('/qa-fonts/'))file=path.join(scratch,'.qa-runtime/node_modules/@fontsource/noto-sans-kr',route.slice(10));
 else if(route.startsWith('/codex/'))file=path.join(repo,'dist',route.slice(7)||'index.html');
 if(!file||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end();return;}
 let bytes=fs.readFileSync(file);
 if(cacheFixture&&file.endsWith('/sw.js'))bytes=Buffer.from(bytes.toString().replace('ca26-pages-v6-three-country-guide','ca26-pages-v5-bukhara-registan'));
 res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(bytes);
});
async function fit(page,label){const x=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));assert.ok(x.scroll<=x.width,label+' '+JSON.stringify(x));}
async function decodeFigure(page,id){const f=page.locator(`[data-illustration="${id}"]`);await f.evaluate(n=>{for(let p=n.parentElement;p;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;});await f.scrollIntoViewIfNeeded();return f.locator('img').evaluate(async n=>{await n.decode();const r=n.getBoundingClientRect();return {naturalWidth:n.naturalWidth,naturalHeight:n.naturalHeight,width:r.width,height:r.height,declaredWidth:n.width,declaredHeight:n.height,attributeWidth:+n.getAttribute('width'),attributeHeight:+n.getAttribute('height'),src:n.currentSrc,lazy:n.loading,alt:n.alt};});}
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const base=`http://127.0.0.1:${server.address().port}/codex/`;
 const browser=await chromium.launch({executablePath:process.env.QA_CHROMIUM||path.join(scratch,'.qa-runtime/chromium'),headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu']});
 const context=await browser.newContext({viewport:{width:375,height:812},deviceScaleFactor:2,isMobile:true,hasTouch:true,serviceWorkers:'block'});
 await context.route('https://latest.currency-api.pages.dev/**',r=>r.fulfill({contentType:'application/json',body:JSON.stringify({date:'2026-10-17',krw:{uzs:10,kgs:.0656,kzt:.4}})}));
 const errors=[],seen=new Map(),maps=new Set(),screens=[];
 const {default:economy}=await import(path.join(repo,'src/central-asia-economy.js'));const {fx}=await import(path.join(repo,'src/research-data.js'));
 const number=(n,digits)=>new Intl.NumberFormat('ko-KR',{minimumFractionDigits:digits,maximumFractionDigits:digits}).format(n);
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));await page.goto(base);
 const font=path.join(scratch,'.qa-runtime/node_modules/@fontsource/noto-sans-kr/400.css');
 if(fs.existsSync(font)){await page.addStyleTag({content:fs.readFileSync(font,'utf8').replace(/url\(\.\/files\//g,'url(/qa-fonts/files/')+'\nbody{font-family:"Noto Sans KR",sans-serif}'});await page.evaluate(()=>document.fonts.ready);}
 const artwork=async(state)=>{for(const f of await page.locator('[data-illustration]').all()){const id=await f.getAttribute('data-illustration');seen.set(id,[...(seen.get(id)||[]),state]);const p=await decodeFigure(page,id);assert.ok(p.naturalWidth>0&&p.alt.length>15&&p.lazy==='lazy');assert.ok(Math.abs(p.width/p.height-p.attributeWidth/p.attributeHeight)<.003,id+' ratio');}};
 for(const width of [375,390,430]){
  await page.setViewportSize({width,height:812});await page.locator('[data-tab="days"]').click();
  for(let day=0;day<10;day++){await page.locator(`[data-day="${day}"]`).click();await fit(page,`day ${day} width ${width}`);for(const a of await page.locator('a[href*="google.com/maps/"]').all()){const href=await a.getAttribute('href');assert.ok(new URL(href).searchParams.get('query'));maps.add(href);}if(width===375)await artwork('day:'+day);}
  await page.locator('[data-tab="guide"]').click();await page.locator('details').evaluateAll(nodes=>nodes.forEach(n=>n.open=true));await fit(page,'guide '+width);
  assert.deepEqual(await page.locator('[data-core-section]').evaluateAll(nodes=>nodes.map(n=>n.dataset.coreSection)),['geography','history','resources','economy','education']);
  assert.equal(await page.locator('.economy-table tbody tr').count(),3);
  const captionBox=await page.locator('.economy-table caption').boundingBox(),tableBox=await page.locator('.economy-table').boundingBox();assert.ok(captionBox.width>=tableBox.width*.8,'Economy caption uses readable mobile width');
  assert.deepEqual(await page.locator('.economy-table tbody th').allTextContents(),['우즈베키스탄','키르기스스탄','카자흐스탄']);
  for(let i=0;i<economy.countries.length;i++){const c=economy.countries[i],cells=await page.locator('.economy-table tbody tr').nth(i).locator('td').allTextContents();assert.deepEqual(cells.slice(0,4),[number(c.population/10000,1),number(c.gdpUsd*fx.usdKrw/1e12,1),number(c.gdpPerCapitaUsd*fx.usdKrw/10000,1),number(c.remittancesPctGdp,2)]);}
  for(const amount of await page.locator('.education-table').first().locator('tbody td:first-of-type').allTextContents())assert.match(amount,/만 원\/년/,'Tuition units remain visible when mobile hides table headers');
  const labels=await page.locator('.economy-table td[data-label]').evaluateAll(nodes=>nodes.map(n=>n.dataset.label));assert.ok(labels.includes('명목 GDP (조 원)')&&labels.includes('1인당 GDP (만 원/명)'));
  if(width===375)await artwork('guide');
  for(const anchor of await page.locator('.guide-toc a').all()){const href=await anchor.getAttribute('href');assert.equal(await page.locator(href).count(),1,href);}
  for(const target of ['economy','education']){await page.locator(target==='economy'?'.economy-table':'.education-table').first().evaluate(n=>n.scrollIntoView({block:'start'}));await page.evaluate(()=>scrollBy(0,-65));const filename=`${target}-${width}.png`;await page.screenshot({path:path.join(qa,filename)});screens.push(filename);}
  await page.locator('[data-tab="fx"]').click();await page.locator('details').evaluateAll(nodes=>nodes.forEach(n=>n.open=true));await fit(page,'fx '+width);if(width===375)await artwork('fx');
  await page.locator('#fx-currency').selectOption('KGS');await page.locator('#fx-amount').fill('500');await page.waitForFunction(()=>document.querySelector('#fx-result').textContent.includes('7,622'));assert.match(await page.locator('#fx-status').textContent(),/2026-10-17/);
  await page.locator('[data-tab="list"]').click();await fit(page,'list '+width);
 }
 const duplicates=[...seen].filter(([,states])=>states.length!==1);assert.deepEqual(duplicates,[],'Each illustration occurs once across tabs/day states');assert.equal(seen.size,23);
 await page.locator('[data-check="0"]').check();await page.reload();await page.locator('[data-tab="list"]').click();assert.ok(await page.locator('[data-check="0"]').isChecked());
 await page.locator('[data-tab="fx"]').click();await page.evaluate(()=>{window.speechSynthesis.getVoices=()=>[];});let spokenFallback='';page.once('dialog',async d=>{spokenFallback=d.message();await d.accept();});await page.locator('[data-speak="0"]').click();assert.match(spokenFallback,/우즈베크어 음성/);
 const assetResults=[];for(const art of manifest)for(const v of art.variants){const result=await page.evaluate(async({url})=>{const i=new Image();i.src=url;await i.decode();return [i.naturalWidth,i.naturalHeight];},{url:base+'illustrations/'+v.file});assert.deepEqual(result,[v.width,v.height]);assetResults.push(v.file);}
 await page.locator('[data-tab="guide"]').click();const narrativeWords=await page.locator('[data-core-section]').evaluateAll(nodes=>Object.fromEntries(nodes.map(n=>[n.dataset.coreSection,[...n.querySelectorAll('.bukhara-intro,.bukhara-chapters .bukhara-chapter-body > p')].map(p=>p.textContent).join(' ').trim().split(/\s+/).length])));assert.ok(Object.entries(narrativeWords).every(([id,n])=>id==='history'||narrativeWords.history>n),'History is the longest main narrative');
 assert.deepEqual(errors,[]);
 // Exercise a controlled v5-named cache fixture using the current app, then real v6 worker.
 // This verifies lifecycle behavior, not a byte-for-byte old deployed application's migration.
 cacheFixture=true;const swContext=await browser.newContext({viewport:{width:375,height:812}});const sw=await swContext.newPage();await sw.goto(base);await sw.evaluate(()=>navigator.serviceWorker.ready);await sw.reload();await sw.waitForFunction(()=>navigator.serviceWorker.controller);
 await sw.evaluate(async()=>{await caches.open('ca26-pages-v5-bukhara-registan').then(c=>c.put('/codex/old-fixture',new Response('old')));await caches.open('other-site-v1').then(c=>c.put('/other-site/',new Response('preserve me')));});cacheFixture=false;
 await sw.evaluate(async()=>{const changed=new Promise(r=>navigator.serviceWorker.addEventListener('controllerchange',r,{once:true}));await (await navigator.serviceWorker.ready).update();await changed;});
 await sw.waitForFunction(async()=>{const keys=await caches.keys();return keys.includes('ca26-pages-v6-three-country-guide')&&!keys.includes('ca26-pages-v5-bukhara-registan');});assert.equal(await sw.evaluate(async()=>{const c=await caches.open('other-site-v1');return (await c.match('/other-site/'))?.text();}),'preserve me');await sw.reload();await sw.locator('[data-tab="guide"]').click();await sw.locator('details').evaluateAll(nodes=>nodes.forEach(n=>n.open=true));await decodeFigure(sw,'issyk-kul-cruise-tian-shan-watercolor');
 await swContext.setOffline(true);await sw.reload();await sw.locator('[data-tab="guide"]').click();await sw.locator('details').evaluateAll(nodes=>nodes.forEach(n=>n.open=true));await decodeFigure(sw,'issyk-kul-cruise-tian-shan-watercolor');assert.equal(await sw.locator('[data-core-section]').count(),5);
 const result={passed:true,checkedAt:new Date().toISOString(),browser:await browser.version(),viewports:[375,390,430],dayStatesPerViewport:10,tabCount:4,uniqueIllustrations:seen.size,decodedAssetUrls:assetResults.length,duplicateIllustrationPlacements:duplicates,mapLinks:maps.size,javascriptErrors:errors,narrativeWords,economyCountries:3,krwUnits:true,economyDisplayedValuesMatchSourceCalculations:true,checklistPersistence:true,uzbekVoiceUnavailableFallback:true,fxFixtureConversion:'500 KGS → 7,622 KRW',offlineVisitedGuideAndImage:true,cacheUpgradeFixture:'v5 cache name/current app → v6; old cache removed',unrelatedOriginCachePreserved:true,screenshots:screens,limits:['Local production build, not deployed PR','FX tested with deterministic fixture; live rate service not tested','PWA migration used controlled cache-name fixture, not historical deployed bundle','Previously unvisited external links/assets are not guaranteed offline']};
 fs.writeFileSync(path.join(repo,'docs/audit/browser.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));await browser.close();server.close();
})().catch(e=>{console.error(e);server.close();process.exit(1)});
