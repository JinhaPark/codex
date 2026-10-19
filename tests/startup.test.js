import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const script = html.match(/<script id="startup-script">([\s\S]*?)<\/script>/)[1];
function startup(online = true) {
  const listeners = new Map(), timers = new Map();
  const nodes = {
    'startup-status': {textContent: '여행 가이드를 불러오고 있습니다.'},
    'startup-help': {textContent: '연결 상태에 따라 잠시 걸릴 수 있습니다.'},
    'startup-retry': {hidden: true, addEventListener: (name, fn) => { nodes.click = fn; }}
  };
  let reloads = 0;
  const window = {
    location: {reload: () => reloads++},
    addEventListener: (name, fn) => listeners.set(name, fn),
    removeEventListener: name => listeners.delete(name)
  };
  vm.runInNewContext(script, {
    window, navigator: {onLine: online},
    document: {getElementById: id => nodes[id]},
    setTimeout: (fn, ms) => { timers.set(1, {fn, ms}); return 1; },
    clearTimeout: id => timers.delete(id)
  });
  return {nodes, window, timers, listeners, reloads: () => reloads};
}

test('slow startup offers a manual retry without automatically reloading', () => {
  const s = startup();
  assert.equal(s.nodes['startup-retry'].hidden, true);
  assert.equal(s.timers.get(1).ms, 12000);
  s.timers.get(1).fn();
  assert.match(s.nodes['startup-status'].textContent, /시간/);
  assert.equal(s.nodes['startup-retry'].hidden, false);
  assert.equal(s.reloads(), 0);
  s.nodes.click();
  assert.equal(s.reloads(), 1);
});

test('offline startup explains the connection requirement immediately', () => {
  const s = startup(false);
  assert.match(s.nodes['startup-help'].textContent, /현재 오프라인/);
  assert.equal(s.nodes['startup-retry'].hidden, false);
});

test('entry script failure offers retry but unrelated image errors do not', () => {
  const s = startup();
  const fail = s.listeners.get('error');
  fail({type: 'error', target: {tagName: 'IMG'}});
  assert.equal(s.nodes['startup-retry'].hidden, true);
  // Vite moves the module into <head> and drops the source element's id.
  fail({type: 'error', target: {tagName: 'SCRIPT', type: 'module'}});
  assert.match(s.nodes['startup-status'].textContent, /불러오지 못/);
  assert.equal(s.nodes['startup-retry'].hidden, false);
  assert.equal(s.timers.size, 0);
});

test('successful app startup cancels the timer and removes temporary error handlers', () => {
  const s = startup();
  s.listeners.get('guide:ready')();
  assert.equal(s.timers.size, 0);
  for (const name of ['error', 'unhandledrejection', 'online', 'offline']) {
    assert.equal(s.listeners.has(name), false);
  }
  assert.equal(s.nodes['startup-retry'].hidden, true);
});
