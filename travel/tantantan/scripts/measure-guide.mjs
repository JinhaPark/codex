/** Reproducible explanatory-prose census; no generated HTML/code/data keys counted. */
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
const root=path.resolve(import.meta.dirname,'..');
const baseline=process.env.GUIDE_BASELINE || 'e3423e7246c2118cc641b35220cba04359459ab8';
const labels={geography:'지리·기후·생활양식',history:'역사',resources:'자원·에너지',economy:'경제',education:'교육'};
const core={'central-asia-geography-climate.js':'geography','central-asia-history.js':'history','central-asia-power-datacenters.js':'resources','central-asia-economy.js':'economy','central-asia-education.js':'education'};
const contentFiles=[...Object.keys(core),'silk-road-introduction.js','bukhara-history.js','history-samarkand.js','history-tashkent.js','history-bishkek.js','history-cholponata.js','history-almaty.js','uzbekistan-research.js','uzbekistan-architecture.js','islamic-architecture-comparative.js'];
const clean=s=>s.replace(/https?:\/\/\S+/gu,'').replace(/<[^>]*>/gu,'').replace(/&(?:amp|lt|gt|quot|#39);/g,x=>({'&amp;':'&','&lt;':'<','&gt;':'>','&quot;':'"','&#39;':"'"}[x])).trim();
const size=text=>({words:text?text.split(/\s+/u).length:0,characters:[...text.replace(/\s/gu,'')].length});
const hash=s=>createHash('sha256').update(s).digest('hex');
function category(file,title='',index=-1,old=false){
 if(old&&file==='central-asia-geography-climate.js'&&index>=0)return ['geography','geography','geography','resources','resources','resources','economy','education','geography','geography','geography'][index];
 if(file==='uzbekistan-research.js')return ['history','geography','history','resources','economy','resources'][index]||'history';
 if(core[file])return core[file];
 if(/경제|이주·도시|현대의 호수 관광/.test(title))return 'economy';
 if(/염류|전력|관개|배수|에너지/.test(title))return 'resources';
 if(/지질|사과의 땅|따뜻한 호수|추이 계곡|산악 자연|치르치크|오아시스는 자연|산록|식문화/.test(title))return 'geography';
 return 'history';
}
// Final editorial decisions below apply the team's reviewed chapter policies.
// They are distinct from automatic similarity matching and do not assert independent verification of every historical claim.
function editorialDecision(r,same,after){
 const policy='docs/audit/editorial-policy.md';
 const city='docs/audit/city-edit.md';
 const exact=same?{file:'src/'+same.file,path:same.path}:null;
 const chapter=r.path.match(/^chapters\.(\d+)/)?.[1];
 const coreTarget=section=>({file:'src/'+Object.keys(core).find(f=>core[f]===section),path:'chapters',section});
 const sameChapter=after.find(a=>a.file===r.file&&a.title===r.title);
 const local=sameChapter?{file:'src/'+sameChapter.file,path:sameChapter.path,title:sameChapter.title}:{file:'src/'+r.file,path:chapter===undefined?'intro':`chapters.${chapter}`};
 const decision=(finalAction,reason,destination=local,evidenceFile=policy)=>({finalAction,reason,destination,evidenceFile,decisionBasis:'전문 검토 후 정한 장별 편집 정책을 문단에 적용; 개별 주장 전체의 독립 사실 검증을 뜻하지 않음'});
 if(same)return decision('유지','설명 문자열이 최종 본문에 동일하게 남아 있음',exact,'docs/audit/measurement.json');
 if(/^history-(tashkent|bishkek|cholponata|almaty)\.js$/.test(r.file)&&/\.1$/.test(r.path)&&r.path.startsWith('chapters.'))return decision('삭제','각 장의 두 번째 문단이 같은 도시 배경과 관찰 권유를 반복하여 삭제; 고유 첫 문단은 해당 장에 보존',local,city);
 if(/^(bukhara-history|history-|islamic-architecture-comparative|uzbekistan-architecture)/.test(r.file))return decision('수정','장별 고유 유적·도시 설명을 압축·통합하고 공통 배경은 종합 역사로 연결; 구체적 정정은 도시 감사 기록 참조',local,city);
 if(r.file==='central-asia-power-datacenters.js'){
  if([0,6,7,8].includes(Number(chapter)))return decision('삭제','데이터센터 입지·투자수익률·장기 투자 시나리오는 여행 해설 화두에서 제외; 실제 전력망·공급 제약은 자원 장에 별도 통합',coreTarget('resources'));
  return decision('통합','발전원·송전망·계절 공급 제약을 자원·에너지 장으로 재구성하고 데이터센터 홍보·투자 전망은 제거',coreTarget('resources'));
 }
 if(r.file==='central-asia-geography-climate.js')return decision('통합',chapter==='10'?'여섯 관찰 포인트의 독립 장을 없애고 각 주제 본문에 관찰 관계를 분산':'지형→물→생활양식의 인과관계로 재편; 산업·경제·교육 문단은 대응 종합 장에 통합',coreTarget(r.section));
 if(r.file==='uzbekistan-research.js'){
  if(r.path.startsWith('4.'))return decision('수정','기준연도가 섞인 성장률·산업비중의 나열을 제거하고 동일 연도 WDI 3국 비교 및 상품·소득 구조 설명으로 교체',coreTarget('economy'));
  const target=r.path.startsWith('1.')?'geography':r.path.startsWith('3.')?'economy':r.section;
  return decision('통합','독립 우즈베키스탄 연구 장의 공통 역사·종교·생활·산업·환경 설명을 해당 5개 화두에 통합',coreTarget(target));
 }
 if(r.file==='silk-road-introduction.js')return decision('통합',[0,10].includes(Number(chapter))?'독립 서론의 여행 권유·질문 나열은 삭제하고 유용한 관찰 관계만 주제 본문에 통합':'소그드·교역·종교·제국·지식의 공통 배경을 종합 역사에 통합; 물과 오아시스는 지리로 연결',coreTarget(r.section));
 if(r.file==='central-asia-economy.js'){
  if(['투르크메니스탄','타지키스탄'].includes(r.title))return decision('삭제','독립 국가별 분석을 요청된 3국으로 제한하므로 해당 국가행·설명 제거',null);
  return decision('수정','5국 일반론을 3국의 실제 기업·상품·소득 구조, 동일 연도 WDI 비교와 통계 개념 설명으로 교체',coreTarget('economy'));
 }
 if(r.file==='main.js')return decision('통합','짧은 국가별 중복 해설과 일반적 관찰 권유를 대응 종합 장에 통합',coreTarget(r.section));
 if(r.file==='itinerary.json')return decision('수정','일정·방문지 설명의 고유 정보는 보존하고 중복 표현·확인되지 않은 단정·외화 표시를 필요한 범위에서 수정',local);
 return decision('수정','기존 설명을 해당 주제의 최종 본문으로 재편',coreTarget(r.section));
}
async function census(dir,old){
 const rows=[];const add=(file,loc,text,section,scope,title='')=>{if(typeof text!=='string')return;for(const [part,p] of text.split(/\n\s*\n/u).entries()){const t=clean(p);if(t)rows.push({file,path:`${loc}.${part}`,title,section,scope,text:t,...size(t),sha256:hash(t)});}};
 // Follow the actual static JS import graph, so superseded unrendered modules do not inflate the new manuscript.
 const active=new Set();async function visit(file){if(active.has(file))return;active.add(file);let code;try{code=await fs.readFile(path.join(dir,'src',file),'utf8')}catch{return}for(const m of code.matchAll(/(?:import|export)\s[^;]*?from\s*['"]\.\/([^'"]+\.js)['"]/g))await visit(m[1]);}
 await visit('main.js');
 for(const file of contentFiles){if(!active.has(file))continue;const m=(await import(pathToFileURL(path.join(dir,'src',file)))).default;if(!m)continue;const scope=core[file]?'core':'detail';
 if(Array.isArray(m)){m.forEach((v,i)=>{const sec=category(file,v.title,i,old);if(v.paragraphs){v.paragraphs.forEach((p,j)=>add(file,`${i}.paragraphs.${j}`,p,sec,scope,v.title));add(file,`${i}.note`,v.note,sec,scope,v.title)}else{add(file,`${i}.intro`,v.intro,sec,scope,v.city);v.sites?.forEach((v,j)=>add(file,`${i}.sites.${j}.description`,v[2],sec,scope,v[0]));}});}
 else{add(file,'intro',m.intro,category(file),scope);for(const [i,c] of (m.chapters||[]).entries()){const title=Array.isArray(c)?c[0]:c.title;const sec=category(file,title,i,old);if(Array.isArray(c)){(Array.isArray(c[1])?c[1]:[c[1]]).forEach((p,j)=>add(file,`chapters.${i}.paragraphs.${j}`,p,sec,scope,title));}else if(c.body)add(file,`chapters.${i}.body`,c.body,sec,scope,title);}
 // Old country descriptions are displayed as separate narrative details. New descriptions are table metadata and excluded.
 if(old&&file==='central-asia-economy.js'){
  m.countries?.forEach((c,i)=>add(file,`countries.${i}.description`,c.description,'economy',scope,c.name));
  const renderer=await import(pathToFileURL(path.join(dir,'src/render-economy.js')));const html=renderer.renderEconomy();const bodies=[...html.matchAll(/<div class="bukhara-chapter-body"><p>([\s\S]*?)<\/p><\/div>/g)].map(x=>x[1]);m.chapters.forEach((c,i)=>{if(!c.body)add(file,`chapters.${i}.rendered`,bodies[m.countries.length+i],'economy',scope,c.title)});
 }
 }
 }
 const itinerary=JSON.parse(await fs.readFile(path.join(dir,'src/itinerary.json'),'utf8'));
 itinerary.days.forEach((d,i)=>{const sec=([5,6,7,8].includes(i)?'geography':'history');add('itinerary.json',`days.${i}.guideKo`,d.guideKo,sec,'itinerary',d.cityKo);add('itinerary.json',`days.${i}.tipKo`,d.tipKo,sec,'itinerary',d.cityKo);d.placeDetails?.forEach((p,j)=>{const title=d.placesKo?.[j]||'';add('itinerary.json',`days.${i}.placeDetails.${j}.description`,p.description,/호수|협곡|국립공원|카라가이/.test(title)?'geography':sec,'itinerary',title)});});
 itinerary.essentials?.filter(e=>e.title!=='현지 여행 회화').forEach((e,i)=>add('itinerary.json',`essentials.${i}.body`,e.body,'geography','practical',e.title));
 // Include literal explanatory paragraphs in the guide renderer, excluding source prose, UI counters and data notes.
 for(const file of ['main.js','render-guide.js']){let code;try{code=await fs.readFile(path.join(dir,'src',file),'utf8')}catch{continue}if(file==='main.js'){const start=code.indexOf(":tab==='guide'?");const end=code.indexOf(":tab==='fx'?",start);code=start>=0?code.slice(start,end):'';}
 for(const [i,m] of [...code.matchAll(/<p(?:\s+[^>]*)?>([^<>$]*[가-힣][^<>$]*)<\/p>/g)].entries()){const t=m[1];if(/출처|참고자료|참고:|기준연도|조회일|자료 갱신일|여러 역사 연구|항목을 누르면|산업 특징 요약/.test(t))continue;add(file,`literalParagraph.${i}`,t,/호수|협곡|산맥/.test(t)?'geography':'history','detail');}}
 return rows;
}
const temp=await fs.mkdtemp(path.join(os.tmpdir(),'guide-baseline-'));
try{
 const archive=execFileSync('git',['archive',baseline,'src','data','package.json'],{cwd:root,maxBuffer:32*1024*1024});execFileSync('tar',['-x','-C',temp],{input:archive});
 const [before,after]=await Promise.all([census(temp,true),census(root,false)]);
 const sum=rows=>rows.reduce((t,r)=>({words:t.words+r.words,characters:t.characters+r.characters,paragraphs:t.paragraphs+1}),{words:0,characters:0,paragraphs:0});
 const comparison=(b,a)=>{const x=sum(b),y=sum(a);return{before:x,after:y,wordReductionPct:x.words?100*(1-y.words/x.words):null,characterReductionPct:x.characters?100*(1-y.characters/x.characters):null}};
 const total=comparison(before,after);const sections=Object.fromEntries(Object.keys(labels).map(s=>[s,comparison(before.filter(r=>r.section===s),after.filter(r=>r.section===s))]));const mainSections=Object.fromEntries(Object.keys(labels).map(s=>[s,sum(after.filter(r=>r.scope==='core'&&r.section===s))]));const mainTotal=sum(after.filter(r=>r.scope==='core'));for(const x of Object.values(mainSections))x.wordSharePct=100*x.words/mainTotal.words;
 const byHash=new Map(after.map(r=>[r.sha256,r]));const ledger=before.map(r=>{const same=byHash.get(r.sha256);const nearest=after.find(a=>a.file===r.file&&a.title===r.title)||after.find(a=>a.scope==='core'&&a.section===r.section);const state=same?'유지':after.some(a=>a.file===r.file)?'수정 후보':'통합·이동·삭제 후보';return{...r,action:state,assessment:same?'문자열 일치 확인':'자동 대응 추정; 의미 보존과 최종 조치는 수동 감사 기록을 함께 확인해야 함',target:same?{file:same.file,path:same.path}:nearest?{file:nearest.file,path:nearest.path}:null,...editorialDecision(r,same,after)};});
 const result={baseline,measuredAt:new Date().toISOString(),status:process.env.AUDIT_FINAL==='1'?'final audited working tree':'working-tree measurement; rerun after final edits',method:{words:'정규화한 본문 공백 분리 어절',characters:'공백 제외 Unicode code points',included:'실제로 import 연결된 설명 모듈 intro/chapter body/note/site description, 일정 guideKo/tipKo/placeDetails.description, 회화 제외 essentials, guide 정적 설명',excluded:'제목, 소스코드, JSON 키, URL·출처 목록, 이미지 캡션·메타데이터, 표·통계 메타데이터, 일정 시간표, 쇼핑/회화 UI',classification:'원래 장의 주제와 명시적 제목 규칙에 따라 5주제로 대응; 혼합 문단은 주된 화두 하나에 배정. core/detail/itinerary/practical 별도 기록',ledger:'action/target은 자동 후보, finalAction/reason/destination/evidenceFile은 전문 검토 후 정한 장별 편집 정책 적용 결과. 모든 개별 주장의 독립 사실 검증을 뜻하지 않음'},total,sections,mainSections,mainTotal,scopeTotals:Object.fromEntries(['core','detail','itinerary','practical'].map(s=>[s,comparison(before.filter(r=>r.scope===s),after.filter(r=>r.scope===s))])),afterParagraphs:after};
 const out=path.join(root,'docs/audit');await fs.mkdir(out,{recursive:true});await fs.writeFile(path.join(out,'measurement.json'),JSON.stringify(result,null,2)+'\n');await fs.writeFile(path.join(out,'paragraph-ledger.json'),JSON.stringify(ledger,null,2)+'\n');
 const pct=n=>n===null?'—':n.toFixed(1)+'%';let md=`# 설명 본문 분량 측정\n\n기준 커밋: ${baseline}. 측정: ${result.measuredAt}. ${process.env.AUDIT_FINAL==='1'?'최종 감사 시점 원고입니다. 이후 본문 변경 시 재실행해야 합니다.':'작업 중 파일이므로 최종 편집 후 재실행해야 합니다.'}\n\n${result.method.included}. ${result.method.excluded} 제외. 어절은 공백 단위이며 문자는 공백을 제외합니다. 전체에는 도시·유적 상세와 일정의 설명 문장이 포함됩니다. 시간표·출처·캡션은 포함하지 않습니다.\n\n|내용상 대응 섹션|이전 어절|이후 어절|어절 감축|이전 문자|이후 문자|문자 감축|\n|---|---:|---:|---:|---:|---:|---:|\n`;
 for(const [k,v]of [...Object.entries(sections),['전체',total]])md+=`|${labels[k]||k}|${v.before.words}|${v.after.words}|${pct(v.wordReductionPct)}|${v.before.characters}|${v.after.characters}|${pct(v.characterReductionPct)}|\n`;
 md+='\n## 종합 5개 섹션만의 비중\n\n도시·유적 상세와 일정 설명은 아래 비중에서 제외합니다.\n\n|섹션|어절|문자|어절 비중|\n|---|---:|---:|---:|\n';for(const[k,v]of Object.entries(mainSections))md+=`|${labels[k]}|${v.words}|${v.characters}|${pct(v.wordSharePct)}|\n`;
 md+='\n`paragraph-ledger.json`은 수정 전 모든 추출 문단을 기록합니다. action/target은 자동 대조 후보이며, finalAction/reason/destination/evidenceFile에는 전문 검토를 마친 장별 편집 정책을 적용한 최종 조치를 기록합니다. 이는 문단의 편집 판정이며 모든 개별 역사 주장을 새로 독립 검증했다는 뜻은 아닙니다. 핵심 정보 보존 여부는 보존 목록과 도시 편집 기록을 함께 확인합니다.\n\n재실행: `node scripts/measure-guide.mjs`\n';await fs.writeFile(path.join(out,'measurement.md'),md);console.log(JSON.stringify({total,mainSections},null,2));
}finally{await fs.rm(temp,{recursive:true,force:true});}
