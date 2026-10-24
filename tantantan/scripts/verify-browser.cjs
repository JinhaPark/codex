/* Optional production-build integration QA. NODE_PATH may point to an external Playwright installation.
 * Run npm run build first; QA_CHROMIUM optionally selects an installed browser executable.
 * Screenshots and results go outside the repository, never into the production bundle. */
const fs = require('node:fs'), path = require('node:path'), http = require('node:http'), assert = require('node:assert/strict');
const {chromium} = require('playwright');
const repo = path.resolve(__dirname, '..'), qa = path.resolve(repo, '../qa-guide-reader');
const manifest = JSON.parse(fs.readFileSync(path.join(repo, 'src/illustrations.json')));
const itineraryRefs = JSON.parse(fs.readFileSync(path.join(repo, 'src/itinerary-illustrations.json')));
const itinerary = JSON.parse(fs.readFileSync(path.join(repo, 'src/itinerary.json')));
const coverage = JSON.parse(fs.readFileSync(path.join(repo, 'docs/audit/destination-images.json')));
const currentCache = fs.readFileSync(path.join(repo, 'public/sw.js'), 'utf8').match(/const CACHE = '([^']+)'/)[1];
const mime = {'.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.webp':'image/webp', '.json':'application/json', '.svg':'image/svg+xml'};
fs.mkdirSync(qa, {recursive:true});
let fixture = false, browser;
const server = http.createServer((req,res)=>{
 const route = decodeURIComponent(req.url.split('?')[0]);
 let file = path.resolve(repo, 'dist', route.replace(/^\/codex\//, '') || 'index.html');
 if (route.startsWith('/qa-fonts/')) file = path.resolve(repo, '../qa-runtime/node_modules/@fontsource/noto-sans-kr/files', path.basename(route));
 if ((!route.startsWith('/qa-fonts/') && (!route.startsWith('/codex/') || !file.startsWith(path.join(repo, 'dist')+path.sep))) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {res.writeHead(404);res.end();return;}
 let bytes = fs.readFileSync(file);
 if (fixture && file.endsWith('/sw.js')) bytes = Buffer.from(bytes.toString().replace(currentCache, 'ca26-pages-v27-shopping-preparation-tabs'));
 res.writeHead(200, {'Content-Type':mime[path.extname(file)] || 'application/octet-stream','Cache-Control':'no-store'});res.end(bytes);
});
async function fits(page, label) {
 const sizes = await page.evaluate(()=>({width:innerWidth, scroll:document.documentElement.scrollWidth}));
 assert.ok(sizes.scroll <= sizes.width, label+' '+JSON.stringify(sizes));
}
async function settle(page) {await page.waitForFunction(()=>!document.querySelector('#app[data-guide-restoring]'));await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));}
async function openArticle(page, base, category, id) {
 await page.goto(`${base}#guide/${category}/${id}`);await page.locator(`[data-guide-article="${id}"]`).waitFor();await settle(page);
}
async function decodeFigure(page, figure) {
 await figure.evaluate(n=>{for(let p=n.parentElement;p;p=p.parentElement) if(p.tagName==='DETAILS') p.open=true;});
 await figure.scrollIntoViewIfNeeded();
 return figure.locator('img').evaluate(async n=>{await n.decode();const r=n.getBoundingClientRect();return {naturalWidth:n.naturalWidth,naturalHeight:n.naturalHeight,width:r.width,height:r.height,attributeWidth:+n.getAttribute('width'),attributeHeight:+n.getAttribute('height'),src:n.currentSrc,lazy:n.loading,alt:n.alt};});
}
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const base = `http://127.0.0.1:${server.address().port}/codex/`;
 browser = await chromium.launch({headless:true, ...(process.env.QA_CHROMIUM ? {executablePath:process.env.QA_CHROMIUM} : {}), args:['--no-sandbox','--disable-dev-shm-usage']});
 const context = await browser.newContext({viewport:{width:375,height:812},isMobile:true,hasTouch:true,serviceWorkers:'block'});
 await context.route('https://latest.currency-api.pages.dev/**',r=>r.fulfill({contentType:'application/json',body:JSON.stringify({date:'2026-10-17',krw:{uzs:10,kgs:.0656,kzt:.4}})}));
 const fontCss = path.resolve(repo, '../qa-runtime/node_modules/@fontsource/noto-sans-kr/400.css');
 if (fs.existsSync(fontCss)) {
  await context.addInitScript(css=>addEventListener('DOMContentLoaded',()=>{const style=document.createElement('style');style.textContent=css;document.head.append(style);}), fs.readFileSync(fontCss,'utf8').replaceAll('./files/', '/qa-fonts/') + '\n:root{font-family:"Noto Sans KR",sans-serif}');
 }
 const page = await context.newPage(), errors = [], seen = new Map(), maps = new Set();
 page.on('pageerror', e=>errors.push(e.message));await page.goto(base);await page.evaluate(()=>document.fonts.ready);
 // A focused path for date-placement and caption edits, without rerunning unrelated flows.
 if (process.argv.includes('--itinerary-only')) {
  for (const width of [375,390,430]) {
   await page.setViewportSize({width,height:812});await page.locator('[data-tab="days"]').click();
   for (const day of [1,2,5]) {
    await page.locator(`[data-day="${day}"]`).click();await fits(page,`focused itinerary ${day} at ${width}`);await artwork('day:'+day,false);
    assert.equal(await page.locator('[data-illustration="lyabi-hauz-portal-watercolor"]').count(),day===1?1:0);
    if(day===1) {assert.equal(await page.locator('[data-illustration="lyabi-hauz-evening-watercolor"]').count(),0);assert.equal(await page.locator('[data-illustration="bukhara-kalyan-minaret-pencil"]').count(),0);assert.equal(await page.locator('[data-illustration="bukhara-poi-kalyan-watercolor"]').count(),1);await decodeFigure(page,page.locator('[data-illustration="lyabi-hauz-portal-watercolor"]'));await page.screenshot({path:path.join(qa,`lyabi-hauz-oct13-${width}.png`)});}
    if(day===5) {const figure=page.locator('[data-illustration="cholponata-balbal-pencil"]');assert.equal(await figure.locator('figcaption').textContent(),'촐폰아타 암각화 구역 — 발발 석상');await decodeFigure(page,figure);await page.screenshot({path:path.join(qa,`balbal-caption-${width}.png`)});}
   }
  }
  await openArticle(page,base,'cities','bukhara-history');const evening=page.locator('[data-illustration="lyabi-hauz-evening-watercolor"]');assert.equal(await evening.count(),1);await decodeFigure(page,evening);await page.screenshot({path:path.join(qa,'lyabi-hauz-guide-430.png')});
  assert.deepEqual(errors,[]);console.log(JSON.stringify({passed:true,scope:'itinerary-only',viewports:[375,390,430],days:['2026-10-13','2026-10-14','2026-10-17'],javascriptErrors:errors}));return;
 }
 const articles = [];
 await page.locator('[data-tab="guide"]').click();
 for (const category of ['core','cities','architecture','kazakhstan']) {
  
  for (const link of await page.locator(`#guide-group-${category} + .guide-book-list [data-guide-inline]`).all()) articles.push({category,id:await link.getAttribute('data-guide-inline')});
 }
 assert.equal(articles.length,15);
 // The original plain header has no decorative map or horizontal title scroller.
 async function plainBanner(target) {
  const header = target.locator('.site-banner');
  assert.equal(await header.locator('img').count(),0);
  assert.equal(await header.evaluate(n=>getComputedStyle(n).backgroundColor),'rgb(20, 49, 60)');
  assert.equal(await header.evaluate(n=>getComputedStyle(n).backgroundImage),'none');
  assert.match(await header.locator('h1').textContent(),/중앙아시아.*탄탄탄/);
  assert.match(await header.textContent(),/2026.10.12/);
  assert.match(await header.textContent(),/우즈베키스탄 · 키르기스스탄 · 카자흐스탄/);
 }
 assert.ok(!manifest.some(art=>art.purpose==='site-banner'));
 for (const width of [375,390,430,768,1280,1920]) {
  await page.setViewportSize({width,height:900});await page.locator('[data-tab="days"]').click();await page.evaluate(()=>scrollTo(0,0));await page.evaluate(()=>document.fonts.ready);
  await plainBanner(page);await fits(page,'plain banner '+width);
  for (const selector of ['.site-banner h1','.site-banner .eyebrow','.site-banner p']) {
   const box=await page.locator(selector).boundingBox();assert.ok(box.x>=0&&box.x+box.width<=width,selector+' visible at '+width);
  }
  await settle(page);await page.screenshot({path:path.join(qa,`banner-${width}.png`)});
 }
 if(process.argv.includes('--banner-only')) {assert.deepEqual(errors,[]);console.log(JSON.stringify({passed:true,scope:'banner-only',viewports:[375,390,430,768,1280,1920],javascriptErrors:errors}));return;}
 await page.setViewportSize({width:375,height:812});
 async function artwork(state, record) {
  const allFigures = await page.locator('[data-illustration]').all();
  const stateIds = await page.locator('[data-illustration]').evaluateAll(nodes=>nodes.map(n=>n.dataset.illustration));
  assert.equal(new Set(stateIds).size,stateIds.length,state+' has no duplicate figures');
  for (const f of allFigures) {
   const id = await f.getAttribute('data-illustration'), art = manifest.find(a=>a.id===id);assert.ok(art,id);
   if(record) seen.set(id,[...(seen.get(id)||[]),state]);
   assert.equal(await f.locator('figcaption').textContent(),art.caption);
   assert.doesNotMatch(await f.locator('figcaption').textContent(),/사진을? 바탕|사용자 제공|AI로? 생성|재해석/);
   const p = await decodeFigure(page, f);assert.ok(p.naturalWidth>0 && p.alt.length>15 && p.lazy==='lazy');
   assert.equal(p.attributeWidth, art.width);assert.equal(p.attributeHeight, art.height);
   const v = art.variants.find(v=>p.src.endsWith('/'+v.file));assert.ok(v,id+' variant');
   assert.ok(Math.abs(p.height-p.width*v.height/v.width)<=1,id+' image ratio');
   if(art.height>art.width) assert.ok(p.height<=812,id+' portrait fits');
   const box = await f.boundingBox();assert.ok(box.x>=0 && box.x+box.width<=page.viewportSize().width,id+' fits');
  }
 }
 const {default:economy} = await import(path.join(repo,'src/central-asia-economy.js'));
 const {fx} = await import(path.join(repo,'src/research-data.js'));
 const narrativeWords = {};
 for (const width of [375,390,430]) {
  console.log('Checking mobile viewport', width);
  await page.setViewportSize({width,height:812});await page.locator('[data-tab="days"]').click();
  for(let day=0;day<10;day++) {
   await page.locator(`[data-day="${day}"]`).click();await fits(page,`day ${day} at ${width}`);
   for(const a of await page.locator('a[href*="google.com/maps/"]').all()) {const href=await a.getAttribute('href');assert.ok(new URL(href).searchParams.get('query'));maps.add(href);}
   await artwork('day:'+day,width===375);
  }
  for (const {id,category} of articles) {
   await openArticle(page,base,category,id);
   const groups=page.locator('[data-reader-section]');assert.ok(await groups.count()>=1 && await groups.count()<=4,id+' coarse groups');
   assert.equal(await page.locator('[data-reader-section] [data-reader-section]').count(),0);
   await page.locator('[data-guide-expand]').click();assert.equal(await page.locator('[data-reader-section]:not([open])').count(),0);
   await page.locator('details').evaluateAll(nodes=>nodes.forEach(n=>n.open=true));await fits(page,id+' '+width);
   if(width===375 && category==='core') narrativeWords[id]=await page.locator('.bukhara-intro,.reader-subsection p').evaluateAll(nodes=>nodes.map(n=>n.textContent).join(' ').split(/\s+/).length);
   if(id==='economy') {
    const number=n=>new Intl.NumberFormat('ko-KR',{maximumFractionDigits:0}).format(n);
    assert.equal(await page.locator('.economy-table tbody tr').count(),3);
    assert.deepEqual(await page.locator('.economy-table tbody th').allTextContents(),['우즈베키스탄','키르기스스탄','카자흐스탄']);
    for(let i=0;i<economy.countries.length;i++) {const c=economy.countries[i],cells=await page.locator('.economy-table tbody tr').nth(i).locator('td').allTextContents();assert.deepEqual(cells.slice(0,4),[number(c.population/10000),number(c.gdpUsd*fx.usdKrw/1e12),number(c.gdpPerCapitaUsd*fx.usdKrw/10000),c.remittancesPctGdp>0&&c.remittancesPctGdp<.1?'0.1 미만':number(c.remittancesPctGdp)]);}
    const caption=await page.locator('.economy-table caption').boundingBox(),table=await page.locator('.economy-table').boundingBox();assert.ok(caption.width>=table.width*.8);
   }
   if(id==='education') for(const amount of await page.locator('.education-table').first().locator('tbody td:first-of-type').allTextContents()) assert.match(amount,/만 원\/년/);
   await artwork(id,width===375);
   await page.locator('[data-guide-collapse]').click();assert.equal(await page.locator('[data-reader-section][open]').count(),0);
   await page.locator('[data-guide-toc]').click();assert.ok(await page.locator('.reader-toc').evaluate(n=>n.open));
   await page.locator('[data-guide-jump]').last().click();await settle(page);
   assert.ok(await groups.last().evaluate(n=>n.open));
   const box=await groups.last().boundingBox();assert.ok(box.y>=100 && box.y<180,id+' anchor clears sticky bars: '+box.y);
  }
  await page.locator('[data-tab="fx"]').click();await fits(page,'shopping '+width);await artwork('shopping',width===375);
  await page.locator('#fx-currency').selectOption('KGS');await page.locator('#fx-amount').fill('500');await page.waitForFunction(()=>document.querySelector('#fx-result').textContent.includes('7,622'));
  await page.locator('[data-tab="list"]').click();await fits(page,'preparation '+width);
 }
 assert.ok(Object.entries(narrativeWords).every(([id,n])=>id==='history'||narrativeWords.history>n));
 for(const art of manifest.filter(a=>a.purpose!=='site-banner')) {
  const states=seen.get(art.id)||[];
  const day=itineraryRefs.find(d=>[...Object.values(d.places).flat(),...d.extras.flatMap(g=>g.ids)].includes(art.id));
  const expectedDay=day ? 'day:'+itinerary.days.findIndex(d=>d.date===day.date) : art.placement.startsWith('day:') ? 'day:'+art.placement.split(':')[1] : null;
  assert.equal(states.filter(s=>s===expectedDay).length,expectedDay ? 1 : 0,art.id+' occurs once on the mapped day');
  assert.equal(states.filter(s=>s.startsWith('day:')).length,expectedDay ? 1 : 0,art.id+' has no unintended itinerary duplicates');
  assert.equal(states.length,art.placement.startsWith('day:') || !expectedDay ? 1 : 2,art.id+' preserves one guide appearance and one authorized itinerary appearance');
 }
 assert.deepEqual([...seen.keys()].sort(),manifest.filter(a=>a.purpose!=='site-banner').map(a=>a.id).sort());
 for(const row of coverage) for(const id of row.imageIds) assert.ok(seen.has(id),row.place+' coverage');
 let decodedVariants=0;
 for(const art of manifest) for(const v of art.variants) {const dims=await page.evaluate(async url=>{const img=new Image();img.src=url;await img.decode();return [img.naturalWidth,img.naturalHeight];},base+'illustrations/'+v.file);assert.deepEqual(dims,[v.width,v.height]);decodedVariants++;}
 await page.locator('[data-tab="days"]').click();await page.locator('[data-day="1"]').click();
 assert.equal(await page.locator('[data-illustration="lyabi-hauz-portal-watercolor"]').count(),1);
 await page.locator('[data-illustration="lyabi-hauz-portal-watercolor"]').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(qa,'lyabi-hauz-oct13-430.png')});
 await page.locator('[data-day="2"]').click();assert.equal(await page.locator('[data-illustration="lyabi-hauz-portal-watercolor"]').count(),0);
 await page.locator('[data-day="5"]').click();const balbal=page.locator('[data-illustration="cholponata-balbal-pencil"]');assert.equal(await balbal.locator('figcaption').textContent(),'촐폰아타 암각화 구역 — 발발 석상');await decodeFigure(page,balbal);await page.screenshot({path:path.join(qa,'balbal-caption-430.png')});
 // User journey: list -> article -> section -> back -> reopen, tab switch and reload.
 await page.goto(base+'#guide/cities');await settle(page);await openArticle(page,base,'cities','bukhara-history');
 await page.locator('[data-guide-collapse]').click();await page.locator('[data-reader-section] > summary').nth(2).click();await page.locator('[data-reader-section]').nth(2).scrollIntoViewIfNeeded();await page.evaluate(()=>scrollBy(0,150));
 const before=await page.evaluate(()=>scrollY);
 await page.locator('[data-guide-list]').first().click();await settle(page);assert.equal(await page.locator('[data-guide-inline]').count(),15);
 await page.goBack();await settle(page);assert.ok(await page.locator('[data-reader-section]').nth(2).evaluate(n=>n.open));assert.ok(Math.abs(await page.evaluate(()=>scrollY)-before)<3,'Back restores reading position');
 await page.locator('[data-tab="list"]').click();await page.locator('[data-check="0"]').check();await page.locator('[data-tab="guide"]').click();await settle(page);
 assert.ok(Math.abs(await page.evaluate(()=>scrollY)-before)<3,'Tab switch restores reading position');
 await page.reload();await settle(page);assert.ok(Math.abs(await page.evaluate(()=>scrollY)-before)<3,'Reload restores reading position');
 await page.locator('[data-tab="list"]').click();assert.ok(await page.locator('[data-check="0"]').isChecked());
 await page.locator('[data-tab="fx"]').click();await page.evaluate(()=>{window.speechSynthesis.getVoices=()=>[];});let fallback='';page.once('dialog',async d=>{fallback=d.message();await d.accept();});await page.locator('[data-speak="0"]').click();assert.match(fallback,/우즈베크어 음성/);
 await openArticle(page,base,'cities','history-almaty');await page.locator('[data-guide-toc]').click();await page.keyboard.press('Escape');assert.ok(!await page.locator('.reader-toc').evaluate(n=>n.open));
 await page.locator('[data-guide-toc]').click();await page.locator('[data-guide-jump]').last().click();await settle(page);
 await page.locator('[data-guide-toc]').click();await page.screenshot({path:path.join(qa,'toc-430.png')});await page.keyboard.press('Escape');
 await page.goto(base+'#guide/cities');await settle(page);await page.screenshot({path:path.join(qa,'library-430.png')});
 await openArticle(page,base,'cities','bukhara-history');await page.locator('[data-guide-collapse]').click();await page.locator('[data-reader-section] > summary').first().click();await page.evaluate(()=>scrollTo(0,document.querySelector('main').offsetTop-60));await page.screenshot({path:path.join(qa,'bukhara-430.png')});
 // Large text, keyboard focus and blocked/corrupt storage keep the reader usable.
 await page.addStyleTag({content:'.guide-reader p,.guide-reader h4,.guide-book p{font-size:36px!important}.guide-reader summary{font-size:32px!important}'});await fits(page,'large text');
 await page.goto(base+'#history-almaty');assert.equal(await page.locator('[data-guide-article]').getAttribute('data-guide-article'),'history-almaty');
 const unavailable=await browser.newContext({serviceWorkers:'block'});await unavailable.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw Error('Storage blocked');}}));const un=await unavailable.newPage();await un.goto(base+'#guide/cities/history-almaty');await un.locator('[data-guide-collapse]').click();await un.locator('[data-guide-toc]').click();await un.locator('[data-guide-jump]').last().click();await un.locator('[data-guide-list]').first().click();assert.equal(await un.locator('.guide-library').count(),1);await unavailable.close();
 // A current-app cache-name fixture exercises the worker transition; it is not an old app binary.
 fixture=true;const swContext=await browser.newContext({viewport:{width:375,height:812}}),sw=await swContext.newPage();await sw.goto(base);await sw.evaluate(()=>navigator.serviceWorker.ready);await sw.reload();await sw.waitForFunction(()=>navigator.serviceWorker.controller);
 await sw.evaluate(async()=>{await caches.open('other-site-v1').then(c=>c.put('/other-site/',new Response('preserve me')));});fixture=false;
 await sw.evaluate(async()=>{const changed=new Promise(r=>navigator.serviceWorker.addEventListener('controllerchange',r,{once:true}));await(await navigator.serviceWorker.ready).update();await changed;});
 await sw.waitForFunction(async current=>{const keys=await caches.keys();return keys.includes(current)&&!keys.includes('ca26-pages-v27-shopping-preparation-tabs');},currentCache);
 assert.equal(await sw.evaluate(async()=>{const c=await caches.open('other-site-v1');return(await c.match('/other-site/')).text();}),'preserve me');
 await sw.reload();await plainBanner(sw);
 const visited=[];
 for(const {id,category} of articles) {await openArticle(sw,base,category,id);for(const f of await sw.locator('[data-illustration]').all()){visited.push({id:await f.getAttribute('data-illustration'),article:id,category});await decodeFigure(sw,f);}}
 await sw.locator('[data-tab="days"]').click();await sw.locator('[data-day="1"]').click();await decodeFigure(sw,sw.locator('[data-illustration="lyabi-hauz-portal-watercolor"]'));
 await swContext.setOffline(true);await sw.reload();await plainBanner(sw);
 await sw.locator('[data-tab="days"]').click();await sw.locator('[data-day="1"]').click();await decodeFigure(sw,sw.locator('[data-illustration="lyabi-hauz-portal-watercolor"]'));
 for(const {id,category} of articles) {await openArticle(sw,base,category,id);for(const f of await sw.locator('[data-illustration]').all())await decodeFigure(sw,f);}
 await sw.locator('[data-guide-collapse]').click();await sw.locator('[data-guide-toc]').click();await sw.locator('[data-guide-jump]').last().click();await settle(sw);assert.ok(await sw.locator('[data-reader-section]').last().evaluate(n=>n.open));
 assert.deepEqual(errors,[]);
 const result={passed:true,checkedAt:new Date().toISOString(),browser:await browser.version(),viewports:[375,390,430],articles:articles.length,dayStates:10,coarseSectionsMax:4,images:seen.size,itineraryMappedIllustrations:itineraryRefs.flatMap(d=>[...Object.values(d.places).flat(),...d.extras.flatMap(g=>g.ids)]).length,lyabiHauzOnOctober13:true,balbalAreaCaption:true,decodedVariants,mapLinks:maps.size,narrativeWords,readingPositionBackTabReload:true,tocOpensAndClearsStickyBars:true,escapeClosesDialog:true,storageUnavailable:true,legacyLinks:true,checklistPersistence:true,fxFixture:true,voiceFallback:true,offlineAllArticlesAndVisitedGuideImages:true,cacheUpgrade:currentCache,otherCachePreserved:true,javascriptErrors:errors,limits:['Local production build in Chromium, not an actual iPhone Safari or installed home-screen PWA','Live FX service not tested; deterministic fixture used','Cache upgrade uses current app with old cache name, not historical deployed bytes','Unvisited images are not guaranteed offline']};
 fs.writeFileSync(path.join(qa,'result.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(async()=>{if(browser)await browser.close();server.close();});
