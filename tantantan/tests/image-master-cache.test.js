import { execFileSync } from 'node:child_process';
import test from 'node:test';

test('private master cache contract, recovery and failure tests', t => {
  const output = execFileSync('python3', ['-m', 'unittest', 'discover', '-s', 'tests', '-p', 'test_image_master_cache.py', '-v'], {
    cwd: new URL('../', import.meta.url), encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'],
  });
  if (output.trim()) t.diagnostic(output.trim());
});
