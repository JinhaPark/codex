import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import economy from '../src/central-asia-economy.js';
import { formatEconomyNumber, renderEconomy, renderKumtor } from '../src/render-economy.js';
import { fx, kumtor, toKrw, revenueToGdpPct } from '../src/research-data.js';
const snapshot = JSON.parse(fs.readFileSync(new URL('../data/wdi-2024-2026-10-18.json', import.meta.url)));
test('exactly three countries match the official same-year WDI snapshot', () => {
 assert.deepEqual(economy.countries.map(c=>c.iso3),['UZB','KGZ','KAZ']);
 for(const country of economy.countries){
  for(const [field, indicator] of Object.entries(economy.metadata.indicators)){
   const [meta, rows]=snapshot.indicators[indicator].response;
   const observation=rows.find(r=>r.countryiso3code===country.iso3);
   assert.equal(country[field],observation.value);assert.equal(country.year,Number(observation.date));assert.equal(country.sourceUpdatedAt,meta.lastupdated);
  }
  assert.equal(country.retrievedAt,snapshot.retrievedAt);
 }
});
test('KRW conversion uses one dated cross-rate and preserves missing values',()=>{
 assert.equal(fx.effectiveDate,'2026-10-17');
 assert.equal(toKrw(100,'USD'),100*87.45/.0656);
 assert.equal(toKrw(null,'USD'),null);assert.equal(formatEconomyNumber(null),'자료 없음');assert.equal(formatEconomyNumber(0),'0');
 const html=renderEconomy();assert.equal((html.match(/scope="row"/g)||[]).length,3);assert.equal((html.match(/scope="col"/g)||[]).length,6);
 for(const c of economy.countries)assert.ok(html.includes(formatEconomyNumber(c.gdpUsd*fx.usdKrw,1e12,1)));
 assert.ok(html.includes('만 원/명'));assert.ok(!html.includes('투르크메니스탄'));assert.ok(!html.includes('타지키스탄'));
 const changed=structuredClone(economy);changed.countries[0].name='<script>bad</script>';changed.countries[0].gdpUsd=null;
 assert.ok(renderEconomy(changed).includes('&lt;script&gt;'));assert.ok(!renderEconomy(changed).includes('<script>'));assert.ok(renderEconomy(changed).includes('자료 없음'));
});
test('Kumtor sales comparison does not masquerade as value added',()=>{
 assert.ok(Math.abs(revenueToGdpPct()-6.340773480662984)<1e-10);
 assert.equal(kumtor.goldValueAddedPct2025,null);assert.equal(kumtor.productionKg,12081);
 const changed={...kumtor,revenueUsd:kumtor.kyrgyzGdpUsd/10};assert.equal(revenueToGdpPct(changed),10);
 assert.ok(renderKumtor(changed).includes('10.00%'));assert.ok(renderKumtor().includes('부가가치 기여율 아님'));
});
