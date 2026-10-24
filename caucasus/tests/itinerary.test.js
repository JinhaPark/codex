import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const itinerary=JSON.parse(fs.readFileSync(new URL('../itinerary.json',import.meta.url),'utf8'));
test('caucasus schedule has all thirteen days and the documented flights',()=>{
 assert.equal(itinerary.days.length,13);
 assert.equal(itinerary.days[0].date,'2026-04-29');
 assert.equal(itinerary.days.at(-1).date,'2026-05-11');
 assert.deepEqual(itinerary.flights.map(f=>f.number),['TK021','TK336','TK2537','TK020']);
});
test('only attended optional activities are present in itinerary',()=>{
 assert.deepEqual(itinerary.optionalTours.map(t=>t.id).sort((a,b)=>a-b),[1,3,4]);
 const ids=new Set(itinerary.optionalTours.map(t=>t.id));
 for(const day of itinerary.days){for(const id of day.optionalTourIds||[])assert.ok(ids.has(id));for(const place of day.places){if(place.optionalTourId)assert.ok(ids.has(place.optionalTourId));}}
});
