import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../public/sw.js', import.meta.url), 'utf8');
const current = 'ca26-pages-v30-border-porter-tip';
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
  for (const key of ['ca26-pages-v5-bukhara-registan', 'ca26-pages-v6-three-country-guide', 'ca26-pages-v7-minaret-refresh', 'ca26-pages-v8-reflection-cleanup', 'ca26-pages-v9-museum-photos', 'ca26-pages-v10-sites-feathers', 'ca26-pages-v11-gur-emir-cleanup', 'ca26-pages-v12-user-photo-batch', 'ca26-pages-v13-foreground-dinner', 'ca26-pages-v14-divan-begi', 'ca26-pages-v14-kazakhstan-deep-dives', 'ca26-pages-v15-kazakhstan-divan-begi', 'ca26-pages-v15-bibi-mohi', 'ca26-pages-v16-combined-guide-images', 'ca26-pages-v17-startup-loading', 'ca26-pages-v21-korean-travel-prose', current, 'other-site-v1']) stores.set(key, new Map());
  let completion;
  handlers.activate({ waitUntil: promise => { completion = promise; } });
  await completion;
  assert.deepEqual([...stores.keys()], [current, 'other-site-v1']);
});

test('guide requests use only the current guide cache and keep cache writes alive', async () => {
  let finishPut;
  const pendingPut = new Promise(resolve => { finishPut = resolve; });
  const { stores, handlers } = worker({ put: () => pendingPut });
  const request = { url: 'https://example.github.io/codex/assets/app.js', method: 'GET' };
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
    { url: 'https://external.example/codex/', method: 'GET' },
    { url: 'https://example.github.io/codex/', method: 'POST' }
  ]) handlers.fetch({ request, respondWith: () => assert.fail('Unexpected interception') });
});
