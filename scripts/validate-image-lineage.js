import { createHash } from 'node:crypto';

const states = ['active', 'archived', 'deletion-candidate', 'deleted'];
const statuses = ['queued', 'running', 'generated', 'validated', 'approved', 'failed', 'cancelled', 'legacy-verified'];
const publishable = ['validated', 'approved', 'legacy-verified'];
const hashPattern = /^[a-f0-9]{64}$/;
const webpPath = /^public\/illustrations\/[a-z0-9-]+\.webp$/;
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// Pure validation: callers supply byte readers; no mutation, network or image generation.
export function validateImageLineage({ manifest, lineage, readFile, previous, readHistory }) {
  const errors = [], warnings = [];
  const check = (ok, code, at) => { if (!ok) errors.push(`${code}: ${at}`); };
  const warn = (code, at) => warnings.push(`${code}: ${at}`);
  const images = lineage.images;
  if (!Array.isArray(images) || !Array.isArray(manifest)) return { errors: ['schema: expected image arrays'], warnings };
  check(lineage.schemaVersion === 1, 'schema-version', 'lineage');
  const byId = new Map(), revisions = new Map(), published = new Map();
  for (const art of manifest) {
    check(typeof art.id === 'string' && !published.has(art.id), 'duplicate-manifest-id', art.id);
    published.set(art.id, art);
  }
  for (const image of images) {
    const id = image.illustrationId;
    check(typeof id === 'string' && !byId.has(id), 'duplicate-lineage-id', id);
    byId.set(id, image);
    check(states.includes(image.lifecycle), 'image-lifecycle', id);
    check(image.sourceArtifactRef === null, 'original-upload-forbidden', id);
    check(image.sourceId === image.sourceSha256 && (image.sourceId === null || hashPattern.test(image.sourceId)), 'source-hash', id);
    check(Array.isArray(image.revisions) && image.revisions.length > 0, 'revision-list', id);
    for (const r of image.revisions || []) {
      check(typeof r.revisionId === 'string' && !revisions.has(r.revisionId), 'duplicate-revision-id', r.revisionId);
      revisions.set(r.revisionId, { image, r });
    }
  }
  const liveFiles = new Set();
  for (const image of images) {
    const id = image.illustrationId, art = published.get(id);
    const local = new Map((image.revisions || []).map(r => [r.revisionId, r]));
    const active = local.get(image.activeRevisionId);
    check(Boolean(art) === (image.lifecycle === 'active'), 'manifest-lineage-bijection', id);
    if (image.lifecycle === 'active') {
      check(Boolean(active), 'active-revision-missing', id);
      check(image.lastPublishedRevisionId === image.activeRevisionId, 'last-published-pointer', id);
      if (art) check(art.placement === image.placement, 'placement-mismatch', id);
    } else {
      check(image.activeRevisionId === null && image.placement === null, 'unpublish-before-archive', id);
    }
    check(image.lastPublishedRevisionId === null || local.has(image.lastPublishedRevisionId), 'last-published-missing', id);
    const activeRevisions = [...local.values()].filter(r => r.lifecycle === 'active');
    check(activeRevisions.length === (image.lifecycle === 'active' ? 1 : 0) && (!active || active.lifecycle === 'active'), 'active-revision-count', id);
    for (const r of local.values()) {
      const at = `${id}/${r.revisionId}`, legacy = r.status === 'legacy-verified';
      check(states.includes(r.lifecycle), 'revision-lifecycle', at);
      check(statuses.includes(r.status), 'revision-status', at);
      check(r.illustrationId === undefined ? legacy : r.illustrationId === id, 'revision-owner', at);
      if (r.lifecycle === 'active') {
        check(publishable.includes(r.status) && Boolean(r.validation), 'unvalidated-publication', at);
        if (!legacy) check(r.sourceId === image.sourceId, 'active-source-mismatch', at);
      }
      if (image.lifecycle === 'deleted') check(r.lifecycle === 'deleted', 'deleted-image-revision', at);
      if (legacy) {
        check(r.operation === 'legacy-publication-snapshot' && r.historyStatus === 'unknown' && r.parentRevisionId === null, 'legacy-marker', at);
        warn('legacy-history-unknown', at);
      } else {
        check(hashPattern.test(r.sourceId) && hashPattern.test(r.outputSha256), 'revision-hashes', at);
        check(Boolean(r.recipe) && hashPattern.test(r.recipeKey) && hashPattern.test(r.optimizeKey), 'recipe-record', at);
        if (r.artifactRef === null) {
          check(/missing|unpersisted/.test(r.masterAvailability || ''), 'master-availability-required', at);
          warn('master-unpersisted', at);
        } else check(typeof r.artifactRef === 'string' && !/^(\/|file:|data:)/.test(r.artifactRef), 'unsafe-master-reference', at);
      }
      const parent = revisions.get(r.parentRevisionId);
      if (r.parentRevisionId !== null) {
        check(Boolean(parent), 'parent-missing', at);
        if (parent) {
          check(parent.image === image, 'parent-owner', at);
          check((parent.r.sourceId ?? parent.image.sourceId) === r.sourceId, 'cross-source-edit-parent', at);
          check(!['deletion-candidate', 'deleted'].includes(parent.r.lifecycle), 'parent-retention', at);
          check(Boolean(parent.r.outputSha256) && r.recipe?.parentOutputSha256 === parent.r.outputSha256, 'parent-output-hash', at);
        }
      }
      const seen = new Set([r.revisionId]);
      let cursor = parent;
      while (cursor) {
        if (seen.has(cursor.r.revisionId)) { check(false, 'parent-cycle', at); break; }
        seen.add(cursor.r.revisionId);
        cursor = revisions.get(cursor.r.parentRevisionId);
      }
      if (r.replacesRevisionId != null) {
        const replaced = local.get(r.replacesRevisionId);
        check(Boolean(replaced) && replaced !== r, 'replacement-reference', at);
        check(r.parentRevisionId !== r.replacesRevisionId || replaced?.sourceId === r.sourceId, 'replacement-is-not-edit-parent', at);
      }
      check(Array.isArray(r.variants), 'variant-list', at);
      const files = new Set();
      for (const v of r.variants || []) {
        check(webpPath.test(v.file) && !files.has(v.file), 'variant-path', at);
        files.add(v.file);
        check(hashPattern.test(v.sha256) && Number.isInteger(v.bytes) && v.bytes > 0, 'variant-metadata', `${at}/${v.file}`);
        if (r.lifecycle !== 'deleted') liveFiles.add(v.file);
        if (!webpPath.test(v.file)) continue;
        try {
          let bytes;
          if (r.lifecycle === 'deleted') {
            let exists = false;
            try { readFile(v.file); exists = true; } catch (error) { if (error.code !== 'ENOENT') throw error; }
            check(!exists, 'deleted-file-still-present', v.file);
            const ref = r.historyArtifactRef;
            check(Boolean(ref) && /^[a-f0-9]{40}$/.test(ref?.commitSha), 'history-reference', at);
            const stored = ref?.variants?.find(item => item.file === v.file && item.sha256 === v.sha256);
            check(Boolean(stored), 'history-variant-reference', at);
            bytes = readHistory?.(ref?.commitSha, v.file);
            check(Boolean(bytes), 'history-unavailable', at);
          } else bytes = readFile(v.file);
          if (bytes) {
            check(bytes.length === v.bytes, 'variant-byte-count', v.file);
            check(sha256(bytes) === v.sha256, 'variant-sha256', v.file);
          }
        } catch (error) { check(false, 'variant-unreadable', `${v.file}: ${error.message}`); }
      }
      if (r === active && art) {
        const expected = art.variants.map(v => ({ ...v, file: `public/illustrations/${v.file}` }));
        check(expected.length > 0 && expected.length === (r.variants || []).length, 'published-variant-count', at);
        for (const v of expected) {
          const stored = r.variants?.find(s => s.file === v.file);
          check(Boolean(stored) && ['width', 'height', 'bytes', 'quality'].every(k => stored[k] === v[k]), 'published-variant-mismatch', `${at}/${v.file}`);
        }
      }
    }
  }
  for (const id of published.keys()) check(byId.has(id), 'manifest-without-lineage', id);
  for (const image of images) for (const r of image.revisions || []) if (r.lifecycle === 'deleted') {
    for (const v of r.variants || []) check(!liveFiles.has(v.file), 'shared-file-still-referenced', v.file);
  }
  if (previous) {
    const transitions = { active: ['active', 'archived'], archived: ['archived', 'active', 'deletion-candidate'], 'deletion-candidate': ['deletion-candidate', 'archived', 'deleted'], deleted: ['deleted'] };
    const transition = (old, next, at) => {
      check(transitions[old.lifecycle]?.includes(next.lifecycle), 'illegal-lifecycle-transition', at);
      if (old.lifecycle !== next.lifecycle) check(Boolean(next.lifecycleReason?.trim()) && Number.isFinite(Date.parse(next.lifecycleChangedAt)) && next.lifecycleChangedAt !== old.lifecycleChangedAt, 'lifecycle-audit-required', at);
    };
    for (const old of previous.images) {
      const next = byId.get(old.illustrationId);
      check(Boolean(next), 'image-tombstone-removed', old.illustrationId);
      if (!next) continue;
      transition(old, next, old.illustrationId);
      for (const before of old.revisions) {
        const after = next.revisions.find(r => r.revisionId === before.revisionId);
        check(Boolean(after), 'revision-tombstone-removed', before.revisionId);
        if (!after) continue;
        transition(before, after, before.revisionId);
        // Preserve completed history; lifecycle/recovery annotations may evolve.
        const immutable = ['parentRevisionId', 'sourceId', 'illustrationId', 'operation', 'recipe', 'recipeKey', 'outputSha256', 'variants', 'optimizeKey', 'optimizationRecipe', 'createdAt', 'historyStatus'];
        if (publishable.includes(before.status)) check(after.status === before.status || (before.status === 'validated' && after.status === 'approved'), 'completed-status-regressed', before.revisionId);
        if (publishable.includes(before.status)) for (const key of immutable) check(equal(before[key], after[key]), 'revision-overwritten', `${before.revisionId}/${key}`);
        if (before.revisionId === old.activeRevisionId && next.activeRevisionId && next.activeRevisionId !== old.activeRevisionId) check(after.lifecycle === 'archived', 'replacement-must-archive', before.revisionId);
      }
    }
    const oldIds = new Set(previous.images.flatMap(i => i.revisions.map(r => r.revisionId)));
    for (const { r } of revisions.values()) if (!oldIds.has(r.revisionId)) check(r.status !== 'legacy-verified', 'new-legacy-bypass', r.revisionId);
  }
  return { errors, warnings };
}
