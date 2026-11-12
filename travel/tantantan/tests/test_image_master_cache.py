"""Contract tests use synthetic PNGs; no user photos or remote credentials."""
import copy
import io
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

from PIL import Image, PngImagePlugin

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
from image_master_cache import (CacheError, CommandBackend, DirectoryBackend, commit_lineage,
                                digest, lookup, persist, restore, retrieve)


def png(color='red', metadata=False):
    data = io.BytesIO()
    info = PngImagePlugin.PngInfo()
    if metadata:
        info.add_text('GPS', 'private location')
    Image.new('RGB', (16, 12), color).save(data, format='PNG', pnginfo=info)
    return data.getvalue()


class ProviderFixture(DirectoryBackend):
    """Simulate a durable provider contract, never evidence of a real remote store."""
    def probe(self):
        return {**super().probe(), 'durable': True, 'retention': 'until-explicit-delete'}


class MasterCacheTest(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.repo = self.root / 'repo'
        (self.repo / 'docs').mkdir(parents=True)
        (self.repo / 'public').mkdir()
        self.webp = self.repo / 'public/existing.webp'
        self.webp.write_bytes(b'existing publication must survive')
        self.data = png()
        self.record = {'revisionId': 'r1', 'sourceId': 'a' * 64, 'outputSha256': digest(self.data),
                       'recipeKey': 'b' * 64, 'status': 'validated', 'validation': {'review': True},
                       'operation': 'style-transfer-and-cleanup', 'lifecycle': 'active',
                       'artifactRef': None, 'masterAvailability': 'unpersisted', 'variants': [],
                       'optimizationRecipe': {'generatedDimensions': [16, 12]}}
        self.record['recipe'] = {'cacheVersion': 'travel-photo-cache-v1', 'sourceSha256': 'a' * 64,
                                 'prompt': 'Synthetic illustration fixture'}
        self.key = digest(json.dumps(self.record['recipe'], sort_keys=True, separators=(',', ':')).encode())
        self.record['recipeKey'] = self.key
        self.lineage = {'schemaVersion': 1, 'images': [{'illustrationId': 'test', 'sourceSha256': 'a' * 64,
                         'sourceArtifactRef': None, 'revisions': [self.record]}]}
        self.attestation = {'kind': 'generated-illustration', 'revisionId': 'r1',
                            'outputSha256': digest(self.data), 'sourceCopiesExcluded': True,
                            'visualReviewPassed': True}
        self.backend = ProviderFixture(self.root / 'objects', self.repo)

    def save(self):
        return persist(self.lineage, 'r1', self.data, self.attestation, self.backend)[0]

    def test_roundtrip_restore_and_reuse_after_workspace_loss(self):
        before = copy.deepcopy(self.lineage)
        saved = self.save()
        self.assertEqual(self.lineage, before)
        self.assertEqual(saved['images'][0]['revisions'][0]['masterAvailability'], 'private-verified')
        # A new backend instance and no local generation input: read only stored bytes.
        backend = ProviderFixture(self.root / 'objects', self.repo)
        output = self.root / 'restored.png'
        self.assertTrue(restore(saved, 'r1', backend, output, self.repo)['reusable'])
        self.assertEqual(output.read_bytes(), self.data)
        self.assertTrue(lookup(saved, self.key, backend)['reusable'])

    def test_idempotent_store_does_not_duplicate_objects(self):
        self.save()
        self.save()
        self.assertEqual(len(list(self.backend.root.iterdir())), 1)

    def test_local_directory_cannot_claim_persistence(self):
        backend = DirectoryBackend(self.root / 'test-only', self.repo)
        updated, report = persist(self.lineage, 'r1', self.data, self.attestation, backend)
        self.assertIsNone(updated)
        self.assertFalse(report['reusable'])
        self.assertIsNone(self.record['artifactRef'])

    def test_readback_corruption_prevents_receipt(self):
        self.backend.get = lambda key: png('blue')
        with self.assertRaisesRegex(CacheError, 'hash-mismatch'):
            self.save()
        self.assertIsNone(self.record['artifactRef'])

    def test_failed_upload_does_not_change_lineage_or_publication(self):
        baseline = copy.deepcopy(self.lineage)
        def fail(*args):
            raise PermissionError('secret token must not escape')
        self.backend.put = fail
        with self.assertRaises(PermissionError):
            self.save()
        self.assertEqual(self.lineage, baseline)
        self.assertEqual(self.webp.read_bytes(), b'existing publication must survive')

    def test_access_revoked_after_put_cannot_create_receipt(self):
        probe = self.backend.probe
        calls = []
        def revoked():
            calls.append(1)
            return {**probe(), 'private': len(calls) == 1}
        self.backend.probe = revoked
        with self.assertRaisesRegex(CacheError, 'not-ready'):
            self.save()

    def test_corruption_missing_denied_and_unconfigured_are_safe_misses(self):
        saved = self.save()
        path = self.backend.object_path(digest(self.data))
        path.write_bytes(png('blue'))
        result = restore(saved, 'r1', self.backend, self.root / 'out.png', self.repo)
        self.assertEqual(result['state'], 'master-hash-mismatch')
        path.unlink()
        self.assertEqual(restore(saved, 'r1', self.backend, self.root / 'out.png', self.repo)['state'], 'master-missing')
        def denied(key):
            raise PermissionError('https://secret.example/token')
        self.backend.get = denied
        result = restore(saved, 'r1', self.backend, self.root / 'out.png', self.repo)
        self.assertEqual(result, {'state': 'access-denied', 'reusable': False, 'action': 'keep-published-webp'})
        self.assertEqual(restore(saved, 'r1', None, self.root / 'out.png', self.repo)['state'], 'backend-unconfigured')
        self.assertFalse((self.root / 'out.png').exists())
        self.assertEqual(self.webp.read_bytes(), b'existing publication must survive')

    def test_unpersisted_and_legacy_records_are_never_hits(self):
        self.assertEqual(restore(self.lineage, 'r1', self.backend, self.root / 'out.png', self.repo)['state'], 'master-unpersisted')
        self.record['status'] = 'legacy-verified'
        self.assertEqual(restore(self.lineage, 'r1', self.backend, self.root / 'out.png', self.repo)['state'], 'legacy-history-unknown')

    def test_original_bytes_original_copies_and_webp_are_rejected_before_put(self):
        self.lineage['images'][0]['sourceSha256'] = digest(self.data)
        with self.assertRaisesRegex(CacheError, 'original-upload-forbidden'):
            self.save()
        self.lineage['images'][0]['sourceSha256'] = 'a' * 64
        for key, value in [('kind', 'normalized-source-copy'), ('sourceCopiesExcluded', False), ('visualReviewPassed', False)]:
            att = {**self.attestation, key: value}
            with self.assertRaisesRegex(CacheError, 'attestation-required'):
                persist(self.lineage, 'r1', self.data, att, self.backend)
        for data in [b'RIFF-webp-variant', b'\xff\xd8\xffJPEG', b'HEIC']:
            with self.assertRaisesRegex(CacheError, 'png-required'):
                persist(self.lineage, 'r1', data, self.attestation, self.backend)
        self.assertEqual(list(self.backend.root.iterdir()), [])

    def test_known_published_hash_is_not_a_master(self):
        self.record['variants'] = [{'sha256': digest(self.data)}]
        with self.assertRaisesRegex(CacheError, 'variant-is-not-master'):
            self.save()

    def test_failed_incomplete_deleted_documentary_cannot_upload(self):
        for key, value in [('status', 'failed'), ('status', 'generated'), ('lifecycle', 'deleted'),
                           ('operation', 'documentary-photo'), ('sourceId', None)]:
            previous = self.record[key]
            self.record[key] = value
            with self.assertRaises(CacheError):
                self.save()
            self.record[key] = previous
        self.assertEqual(list(self.backend.root.iterdir()), [])

    def test_metadata_decode_dimensions_and_receipt_size_validation(self):
        for data in [png(metadata=True), self.data[:-20]]:
            self.record['outputSha256'] = digest(data)
            with self.assertRaises(CacheError):
                persist(self.lineage, 'r1', data, self.attestation, self.backend)
        self.record['outputSha256'] = digest(self.data)
        self.record['optimizationRecipe']['generatedDimensions'] = [32, 24]
        with self.assertRaisesRegex(CacheError, 'dimensions-mismatch'):
            self.save()
        self.record['optimizationRecipe']['generatedDimensions'] = [16, 12]
        saved = self.save()
        saved['images'][0]['revisions'][0]['masterCache']['bytes'] += 1
        with self.assertRaisesRegex(CacheError, 'receipt-metadata-mismatch'):
            retrieve(saved, 'r1', self.backend)

    def test_ambiguous_recipe_requires_explicit_selection(self):
        saved = self.save()
        other = copy.deepcopy(saved['images'][0]['revisions'][0])
        other['revisionId'] = 'r2'
        saved['images'][0]['revisions'].append(other)
        result = lookup(saved, self.key, self.backend)
        self.assertEqual(result['state'], 'ambiguous-candidates')
        self.assertFalse(result['reusable'])
        self.assertEqual(lookup(saved, self.key, self.backend, 'r2')['revisionId'], 'r2')
        self.assertFalse(lookup(saved, 'c' * 64, self.backend)['reusable'])

    def test_recipe_drift_cannot_be_reused(self):
        saved = self.save()
        saved['images'][0]['revisions'][0]['recipe']['prompt'] += ' changed'
        self.assertFalse(lookup(saved, self.key, self.backend)['reusable'])

    def test_wrong_backend_and_non_durable_remote_are_rejected(self):
        saved = self.save()
        other = ProviderFixture(self.root / 'other', self.repo, 'other')
        with self.assertRaisesRegex(CacheError, 'wrong-backend'):
            retrieve(saved, 'r1', other)
        remote = CommandBackend([sys.executable], 'remote')
        remote.probe = lambda: {**self.backend.probe(), 'backendId': 'remote', 'durable': False}
        remote.put = lambda *args: self.fail('unverified remote must not receive bytes')
        with self.assertRaisesRegex(CacheError, 'durability-not-confirmed'):
            persist(self.lineage, 'r1', self.data, self.attestation, remote)

    def test_no_public_write_symlink_or_existing_destination_overwrite(self):
        saved = self.save()
        for target in [self.webp, self.repo / 'private.png']:
            self.assertEqual(restore(saved, 'r1', self.backend, target, self.repo)['state'], 'private-path-inside-repository')
        target = self.root / 'existing.png'
        target.write_bytes(b'keep')
        self.assertEqual(restore(saved, 'r1', self.backend, target, self.repo)['state'], 'destination-conflict')
        self.assertEqual(target.read_bytes(), b'keep')
        link = self.root / 'link.png'
        link.symlink_to(target)
        self.assertEqual(restore(saved, 'r1', self.backend, link, self.repo)['state'], 'symlink-forbidden')
        self.assertEqual(self.webp.read_bytes(), b'existing publication must survive')

    def test_private_directory_permissions_traversal_and_immutable_collision(self):
        directory = self.root / 'public-dir'
        directory.mkdir(mode=0o755)
        with self.assertRaisesRegex(CacheError, 'private-directory-required'):
            DirectoryBackend(directory, self.repo)
        with self.assertRaises(CacheError):
            self.backend.get('../outside')
        self.backend.object_path(digest(self.data)).write_bytes(b'bad')
        with self.assertRaisesRegex(CacheError, 'immutable-object-conflict'):
            self.save()

    def test_compare_and_swap_prevents_lost_updates_and_respects_lock(self):
        path = self.repo / 'docs/image-lineage.json'
        baseline = json.dumps(self.lineage).encode()
        path.write_bytes(baseline)
        updated = self.save()
        path.write_bytes(b'concurrent change')
        with self.assertRaisesRegex(CacheError, 'lineage-changed'):
            commit_lineage(path, baseline, updated)
        self.assertEqual(path.read_bytes(), b'concurrent change')
        path.write_bytes(baseline)
        lock = path.with_name(path.name + '.master-cache.lock')
        lock.write_text('other writer')
        with self.assertRaisesRegex(CacheError, 'lineage-locked'):
            commit_lineage(path, baseline, updated)
        self.assertEqual(lock.read_text(), 'other writer')
        lock.unlink()
        commit_lineage(path, baseline, updated)
        self.assertEqual(json.loads(path.read_bytes()), updated)
        self.assertFalse(lock.exists())

    def test_provider_failures_do_not_leak_secrets(self):
        backend = CommandBackend([sys.executable, '-c', "import sys; sys.stderr.write('TOKEN=secret'); sys.exit(1)"], 'private-test')
        saved = self.save()
        saved['images'][0]['revisions'][0]['masterCache']['backendId'] = 'private-test'
        saved['images'][0]['revisions'][0]['artifactRef'] = 'private-master-v1:private-test:' + digest(self.data)
        self.assertEqual(restore(saved, 'r1', backend, self.root / 'out.png', self.repo)['state'], 'provider-unavailable')

    def test_command_provider_roundtrip_contract(self):
        script = self.root / 'provider.py'
        script.write_text('''import json, sys, shutil
from pathlib import Path
r=json.load(sys.stdin); root=Path(sys.argv[1]); key=r.get('key'); op=r['operation']
assert r['protocol']=='private-master-cache-v1'
if op=='put':
    target=root/key
    if target.exists(): assert target.read_bytes()==Path(r['path']).read_bytes()
    else: shutil.copyfile(r['path'], target)
elif op=='get': shutil.copyfile(root/key, r['path'])
print(json.dumps(dict(ok=True, backendId='command-test', private=True, durable=True,
                     read=True, write=True, immutable=True, retention='until-explicit-delete')))
''')
        backend = CommandBackend([sys.executable, str(script), str(self.backend.root)], 'command-test')
        saved, _ = persist(self.lineage, 'r1', self.data, self.attestation, backend)
        self.assertEqual(retrieve(saved, 'r1', backend), self.data)

    def test_cli_missing_backend_returns_safe_json_and_leaves_real_lineage_unchanged(self):
        repo = Path(__file__).resolve().parents[2]
        path = repo / 'shared/images/image-lineage.json'
        before = path.read_bytes()
        result = subprocess.run([sys.executable, str(repo / 'tantantan/scripts/image_master_cache.py'), 'probe'],
                                capture_output=True, env={k: v for k, v in os.environ.items() if k != 'IMAGE_MASTER_CACHE_CONFIG'})
        self.assertEqual(json.loads(result.stdout)['state'], 'backend-unconfigured')
        self.assertEqual(path.read_bytes(), before)


if __name__ == '__main__':
    unittest.main()
