import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import economy from '../src/central-asia-economy.js';
import { formatEconomyNumber, renderEconomy } from '../src/render-economy.js';

const snapshot = JSON.parse(fs.readFileSync(new URL('../data/wdi-2024-2026-10-17.json', import.meta.url)));

test('country values and provenance match the preserved WDI response', () => {
  assert.deepEqual(economy.countries.map(c => c.iso3).sort(), ['KAZ', 'KGZ', 'TJK', 'TKM', 'UZB']);
  for (const country of economy.countries) {
    for (const [field, indicator] of Object.entries(economy.metadata.indicators)) {
      const [metadata, observations] = snapshot.indicators[indicator].response;
      const observation = observations.find(row => row.countryiso3code === country.iso3);
      assert.equal(country[field], observation.value);
      assert.equal(country.year, Number(observation.date));
      assert.equal(country.sourceUpdatedAt, metadata.lastupdated);
    }
    assert.equal(country.retrievedAt, snapshot.retrievedAt);
    assert.ok(Math.abs(country.gdpUsd / country.population - country.gdpPerCapitaUsd) < 0.01);
  }
});

test('rendering retains the comparison, visible warning, units and pinned sources', () => {
  const html = renderEconomy();
  assert.equal((html.match(/scope="row"/g) || []).length, 5);
  assert.equal((html.match(/scope="col"/g) || []).length, 4);
  for (const value of ['2,915', '5,904', '1,214', '2,515', '1,362', '47.2%', '17.6%', '13.7%', '약 2.4배']) {
    assert.ok(html.includes(value), value);
  }
  assert.ok(html.includes('미 달러/명'));
  assert.ok(html.indexOf('출처 간 차이의 원인') < html.indexOf('<details'));
  for (const source of economy.sources.slice(0, 4)) {
    assert.equal(new URL(source.url).searchParams.get('date'), String(economy.metadata.year));
  }
});

test('missing data remains distinct from zero and text is escaped', () => {
  assert.equal(formatEconomyNumber(null), '자료 없음');
  assert.equal(formatEconomyNumber(undefined), '자료 없음');
  assert.equal(formatEconomyNumber(NaN), '자료 없음');
  assert.equal(formatEconomyNumber(0), '0');
  const changed = structuredClone(economy);
  changed.countries[0].name = '<script>alert(1)</script>';
  changed.countries[0].population = null;
  const html = renderEconomy(changed);
  assert.ok(!html.includes('<script>'));
  assert.ok(html.includes('&lt;script&gt;'));
  assert.ok(html.includes('자료 없음'));
  assert.ok(html.includes('투르크메니스탄 자료 없음'));
});

test('summary figures are recalculated from raw numbers', () => {
  const changed = structuredClone(economy);
  changed.countries.find(c => c.iso3 === 'KAZ').gdpUsd = 2 * changed.countries.find(c => c.iso3 === 'UZB').gdpUsd;
  changed.countries.find(c => c.iso3 === 'TJK').remittancesPctGdp = 10;
  const html = renderEconomy(changed);
  assert.ok(html.includes('약 2.0배'));
  assert.ok(html.includes('타지키스탄 10.0%'));
});
