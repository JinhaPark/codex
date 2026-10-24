import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../../shared/public/sw-tantantan.js', import.meta.url), 'utf8');
const current = 'ca26-tantantan-v1';
function worker({ put = async () => {}, fetch = async () => new Response('network') } = {}) {
  const stores = new Map(), handlers = {};
  const caches = {
    keys: async () => [...stores.keys()],
    delete: async key => stores.delete(key),
    open: async key => {
      if (!stores.has(key)) stores.set(key, new Map());
      const entries = stores.get(key);
      return {
        match: async request => entries.get(request.url ?? request),
        put: async (request, response) => { await put(); entries.set(request.url ?? request, response); }
      };
    },
    match: async request => {
      for (const entries of stores.values()) if (entries.has(request.url)) return entries.get(request.url);
    }
  };
  vm.runInNewContext(source, { caches, fetch, URL, Response, self: {
    location: { origin: 'https://example.github.io' },
    clients: { claim: async () => {} },
    addEventListener: (name, handler) => { handlers[name] = handler; }
  }});
  return { stores, handlers };
}

test('worker upgrade deletes only older travel-guide caches and preserves other sites', async () => {
  const { stores, handlers } = worker();
  for (const key of ['ca26-tantantan-v5-bukhara-registan', 'ca26-tantantan-v6-three-country-guide', 'ca26-tantantan-v7-minaret-refresh', 'ca26-tantantan-v8-reflection-cleanup', 'ca26-tantantan-v9-museum-photos', 'ca26-tantantan-v10-sites-feathers', 'ca26-tantantan-v11-gur-emir-cleanup', 'ca26-tantantan-v12-user-photo-batch', 'ca26-tantantan-v13-foreground-dinner', 'ca26-tantantan-v14-divan-begi', 'ca26-tantantan-v14-kazakhstan-deep-dives', 'ca26-tantantan-v15-kazakhstan-divan-begi', 'ca26-tantantan-v15-bibi-mohi', 'ca26-tantantan-v16-combined-guide-images', 'ca26-tantantan-v17-startup-loading', 'ca26-tantantan-v21-korean-travel-prose', current, 'other-site-v1']) stores.set(key, new Map());
  let completion;
  handlers.activate({ waitUntil: promise => { completion = promise; } });
  await completion;
  assert.deepEqual([...stores.keys()], [current, 'other-site-v1']);
});

test('guide requests use only the current guide cache and keep cache writes alive', async () => {
  let finishPut;
  const pendingPut = new Promise(resolve => { finishPut = resolve; });
  const { stores, handlers } = worker({ put: () => pendingPut });
  const request = { url: 'https://example.github.io/codex/tantantan/assets/app.js', method: 'GET' };
  stores.set('other-site-v1', new Map([[request.url, new Response('unrelated')]]));
  let response;
  const lifetimes = [];
  handlers.fetch({ request, respondWith: promise => { response = promise; }, waitUntil: promise => lifetimes.push(promise) });
  assert.equal(await (await response).text(), 'network');
  assert.equal(lifetimes.length, 1, 'A cache write must extend the fetch event lifetime');
  assert.equal(stores.get(current).size, 0);
  finishPut();
  await Promise.all(lifetimes);
  assert.equal(await stores.get(current).get(request.url).text(), 'network');
});

test('worker leaves requests outside its app path and non-GET requests alone', () => {
  const { handlers } = worker();
  for (const request of [
    { url: 'https://example.github.io/other/', method: 'GET' },
    { url: 'https://external.example/codex/tantantan/', method: 'GET' },
    { url: 'https://example.github.io/codex/tantantan/', method: 'POST' }
  ]) handlers.fetch({ request, respondWith: () => assert.fail('Unexpected interception') });
});


test('online navigation replaces stale HTML with the published document', async () => {
  const { stores, handlers } = worker({ fetch: async () => new Response('latest page') });
  stores.set(current, new Map([['/codex/tantantan/', new Response('old page')]]));
  let result;
  const lifetimes = [];
  handlers.fetch({ request: {url:'https://example.github.io/codex/tantantan/', method:'GET', mode:'navigate'}, respondWith: p => { result = p; }, waitUntil: p => lifetimes.push(p) });
  assert.equal(await (await result).text(), 'latest page');
  await Promise.all(lifetimes);
  assert.equal(await stores.get(current).get('/codex/tantantan/').text(), 'latest page');
});

test('offline navigation preserves the saved page and cached assets avoid the network', async () => {
  let requests = 0;
  const { stores, handlers } = worker({ fetch: async () => { requests++; throw new Error('offline'); } });
  const asset = 'https://example.github.io/codex/tantantan/assets/app.js';
  stores.set(current, new Map([['/codex/tantantan/', new Response('saved page')], [asset, new Response('saved asset')]]));
  let result;
  const event = request => ({request, respondWith: p => { result = p; }, waitUntil: () => {}});
  handlers.fetch(event({url:'https://example.github.io/codex/tantantan/', method:'GET', mode:'navigate'}));
  assert.equal(await (await result).text(), 'saved page');
  handlers.fetch(event({url:asset, method:'GET'}));
  assert.equal(await (await result).text(), 'saved asset');
  assert.equal(requests, 1);
});
