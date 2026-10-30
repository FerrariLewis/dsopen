import assert from 'node:assert/strict';
import test from 'node:test';
import { compareVersions, isNewerVersion, parseVersion, versionParts } from '../src/version.js';

test('version protocol compares numbers rather than strings', () => {
  assert.equal(isNewerVersion('1.3.10', '1.3.9'), true);
  assert.equal(compareVersions('1.3.1', '1.3.0'), 1);
  assert.equal(compareVersions('1.3.1', '1.3.1'), 0);
  assert.equal(compareVersions('1.2.10', '1.3.0'), -1);
});

test('invalid and unsafe versions cannot bypass update validation', () => {
  for (const value of [
    null,
    {},
    '1.3',
    '01.3.1',
    '1.3.1-beta',
    '1.3.1+build',
    '9007199254740992.0.0',
  ]) {
    assert.equal(parseVersion(value), null);
    assert.throws(() => versionParts(value), { code: 'BOOT_VERSION_INVALID' });
  }
  assert.deepEqual(versionParts('0.0.0'), [0, 0, 0]);
});
