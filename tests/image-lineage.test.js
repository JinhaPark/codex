import assert from 'node:assert/strict';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import test from 'node:test';
import { validateImageLineage } from '../scripts/validate-image-lineage.js';

const root = new URL('../', import.meta.url);
const read = path => fs.readFileSync(new URL(path, root));
const lineage = JSON.parse(read('docs/image-lineage.json'));
const manifest = JSON.parse(read('src/illustrations.json'));
const git = args => execFileSync('git', args, { cwd: root, maxBuffer: 10 * 1024 * 1024 });
const base = process.env.IMAGE_LINEAGE_BASE || 'HEAD';
// Fail closed if the configured baseline cannot be loaded (CI checks out full history).
const previous = JSON.parse(git(['show', `${base}:docs/image-lineage.json`]));
const run = (data = lineage, published = manifest, baseline = previous, reader = read) => validateImageLineage({
  lineage: data, manifest: published, previous: baseline, readFile: reader,
  readHistory: (commit, path) => {
    assert.match(commit || '', /^[a-f0-9]{40}$/);
    return git(['show', `${commit}:${path}`]);
  },
});

test('repository image lineage matches publication, bytes, graph and baseline lifecycle', t => {
  const result = run();
  const counts = {};
  for (const warning of result.warnings) counts[warning.split(':')[0]] = (counts[warning.split(':')[0]] || 0) + 1;
  t.diagnostic(`Non-failing availability notices: ${JSON.stringify(counts)}`);
  assert.deepEqual(result.errors, []);
});

function rejects(name, mutate, code) {
  test(name, () => {
    const data = structuredClone(lineage), published = structuredClone(manifest);
    mutate(data, published);
    assert.ok(run(data, published).errors.some(e => e.startsWith(`${code}:`)), code);
  });
}
rejects('missing lineage is rejected', d => d.images.pop(), 'manifest-without-lineage');
rejects('duplicate image IDs are rejected', d => d.images.push(structuredClone(d.images[0])), 'duplicate-lineage-id');
rejects('duplicate manifest IDs are rejected', (d, m) => m.push(structuredClone(m[0])), 'duplicate-manifest-id');
rejects('missing active revision is rejected', d => d.images[0].activeRevisionId = 'missing', 'active-revision-missing');
rejects('failed publication is rejected', d => d.images[0].revisions[0].status = 'failed', 'unvalidated-publication');
rejects('a publication cannot point at an archived revision', d => d.images[0].revisions[0].lifecycle = 'archived', 'active-revision-count');
rejects('manifest bytes cannot drift from lineage', (d, m) => m[0].variants[0].bytes++, 'published-variant-mismatch');
rejects('recorded hash corruption is rejected', d => d.images[0].revisions[0].variants[0].sha256 = '0'.repeat(64), 'variant-sha256');
rejects('recorded byte count corruption is rejected', d => d.images[0].revisions[0].variants[0].bytes++, 'variant-byte-count');
rejects('path traversal is rejected before reading files', d => d.images[0].revisions[0].variants[0].file = '../private.webp', 'variant-path');
rejects('missing editing parent is rejected', d => d.images.at(-1).revisions[0].parentRevisionId = 'missing', 'parent-missing');
rejects('editing cycles are rejected', d => { const r = d.images.at(-1).revisions[0]; r.parentRevisionId = r.revisionId; }, 'parent-cycle');
rejects('another source is not an editing parent', d => d.images.at(-1).revisions[0].parentRevisionId = d.images.at(-2).activeRevisionId, 'cross-source-edit-parent');
rejects('unknown master availability must be explicit', d => delete d.images.at(-1).revisions[0].masterAvailability, 'master-availability-required');
rejects('a remote URL alone cannot prove master persistence', d => d.images.at(-1).revisions[0].artifactRef = 'https://example.invalid/private.png?token=secret', 'master-receipt-schema');
rejects('a persisted label without a receipt is rejected', d => d.images.at(-1).revisions[0].masterAvailability = 'private-verified', 'master-receipt-schema');
rejects('unpublishing must remove manifest placement', d => d.images[0].lifecycle = 'archived', 'manifest-lineage-bijection');
rejects('active assets cannot jump directly to deleted', d => d.images[0].lifecycle = 'deleted', 'illegal-lifecycle-transition');
rejects('revision history cannot disappear', d => d.images[0].revisions = [], 'revision-tombstone-removed');
rejects('completed recipe cannot be overwritten', d => {
  // New image batches are absent from the baseline; mutate a completed baseline revision.
  const before = previous.images.flatMap(i => i.revisions).findLast(r => r.recipe?.prompt);
  const current = d.images.flatMap(i => i.revisions).find(r => r.revisionId === before.revisionId);
  current.recipe.prompt += ' changed';
}, 'revision-overwritten');
rejects('original artifact uploads are forbidden', d => d.images[0].sourceArtifactRef = 'remote:original.jpeg', 'original-upload-forbidden');
rejects('legacy exemption cannot be granted to a new revision', d => { const r = structuredClone(d.images[0].revisions[0]); r.revisionId += '-new'; r.lifecycle = 'archived'; d.images[0].revisions.push(r); }, 'new-legacy-bypass');

test('explicit legacy unknowns and unpersisted masters are notices, not errors', () => {
  const result = run();
  assert.deepEqual(result.errors, []);
  assert.ok(result.warnings.some(w => w.startsWith('legacy-history-unknown:')));
  assert.ok(result.warnings.some(w => w.startsWith('master-unpersisted:')));
});

test('safe master receipt is accepted only as historical verification, with remote recheck notice', () => {
  const data = structuredClone(lineage), r = data.images.at(-1).revisions[0];
  r.artifactRef = `private-master-v1:private-test:${r.outputSha256}`;
  r.masterAvailability = 'private-verified';
  r.masterCache = { schemaVersion: 1, backendId: 'private-test', sha256: r.outputSha256,
    bytes: 123456, width: r.optimizationRecipe.generatedDimensions[0], height: r.optimizationRecipe.generatedDimensions[1], format: 'PNG', verifiedAt: '2026-10-20T00:00:00Z',
    verification: 'download-sha256-decode', retention: 'until-explicit-delete' };
  assert.deepEqual(run(data).errors, []);
  assert.ok(run(data).warnings.some(w => w.startsWith('master-remote-recheck-required:')));
  r.masterCache.signedUrl = 'https://example.invalid/secret';
  assert.ok(run(data).errors.some(e => e.startsWith('master-receipt-schema:')));
  delete r.masterCache.signedUrl;
  r.masterCache.sha256 = '0'.repeat(64);
  assert.ok(run(data).errors.some(e => e.startsWith('master-receipt-identity:')));
});

function archive(data, published) {
  const image = data.images[0];
  published.splice(published.findIndex(m => m.id === image.illustrationId), 1);
  image.activeRevisionId = null; image.placement = null;
  for (const item of [image, image.revisions[0]]) {
    item.lifecycle = 'archived'; item.lifecycleReason = '사용 중단'; item.lifecycleChangedAt = '2026-10-20T00:00:00Z';
  }
}
test('unpublish and archive preserve the last publication and history', () => {
  const data = structuredClone(lineage), published = structuredClone(manifest);
  archive(data, published);
  assert.deepEqual(run(data, published).errors, []);
  data.images[0].lifecycleReason = '';
  assert.ok(run(data, published).errors.some(e => e.startsWith('lifecycle-audit-required:')));
});

test('archive, candidate, deleted require audit, tombstones and real Git recovery', () => {
  const data = structuredClone(lineage), published = structuredClone(manifest);
  archive(data, published);
  const archived = structuredClone(data);
  for (const item of [data.images[0], data.images[0].revisions[0]]) {
    item.lifecycle = 'deletion-candidate'; item.lifecycleReason = '정리 후보'; item.lifecycleChangedAt = '2026-10-21T00:00:00Z';
  }
  assert.deepEqual(run(data, published, archived).errors, []);
  const candidate = structuredClone(data), r = data.images[0].revisions[0];
  for (const item of [data.images[0], r]) {
    item.lifecycle = 'deleted'; item.lifecycleReason = '승인된 정리'; item.lifecycleChangedAt = '2026-10-22T00:00:00Z';
  }
  assert.ok(run(data, published, candidate).errors.some(e => e.startsWith('history-reference:')));
  r.historyArtifactRef = { commitSha: git(['rev-parse', 'HEAD']).toString().trim(), variants: r.variants.map(({ file, sha256 }) => ({ file, sha256 })) };
  assert.ok(run(data, published, candidate).errors.some(e => e.startsWith('deleted-file-still-present:')));
  const removed = new Set(r.variants.map(v => v.file));
  const reader = path => {
    if (removed.has(path)) throw Object.assign(new Error('removed'), { code: 'ENOENT' });
    return read(path);
  };
  assert.deepEqual(run(data, published, candidate, reader).errors, []);
});

test('verified edit replacement archives its actual parent and switches publication atomically', () => {
  const data = structuredClone(lineage), published = structuredClone(manifest);
  const image = data.images.at(-1), parent = image.revisions[0];
  const child = structuredClone(parent);
  child.revisionId += '-edit';
  child.parentRevisionId = parent.revisionId;
  child.recipe.parentOutputSha256 = parent.outputSha256;
  child.historyStatus = 'verified-edit-input';
  // This is a graph fixture: reuse the same published bytes to isolate pointer rules.
  parent.lifecycle = 'archived'; parent.lifecycleReason = '검증된 편집본으로 교체'; parent.lifecycleChangedAt = '2026-10-20T00:00:00Z';
  image.revisions.push(child);
  image.activeRevisionId = child.revisionId; image.lastPublishedRevisionId = child.revisionId;
  assert.deepEqual(run(data, published).errors, []);
  parent.lifecycle = 'deletion-candidate';
  assert.ok(run(data, published).errors.some(e => e.startsWith('parent-retention:')));
  parent.lifecycle = 'archived';
  child.recipe.parentOutputSha256 = '0'.repeat(64);
  assert.ok(run(data, published).errors.some(e => e.startsWith('parent-output-hash:')));
});
