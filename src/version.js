/** One stable-version protocol shared by host, renderer and release tooling. */
export const VERSION_PATTERN = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;

export function parseVersion(value) {
  if (typeof value !== 'string' || !VERSION_PATTERN.test(value)) return null;
  const parts = value.split('.').map(Number);
  return parts.every(Number.isSafeInteger) ? parts : null;
}

export function versionParts(value) {
  if (typeof value !== 'string' || !VERSION_PATTERN.test(value)) {
    throw Object.assign(new Error('维护版本必须使用 X.Y.Z 稳定版本号。'), {
      code: 'BOOT_VERSION_INVALID',
    });
  }
  const parts = parseVersion(value);
  if (!parts) {
    throw Object.assign(new Error('版本号过大。'), { code: 'BOOT_VERSION_INVALID' });
  }
  return parts;
}

export function compareVersions(candidate, current) {
  const left = versionParts(candidate);
  const right = versionParts(current);
  for (let index = 0; index < left.length; index++) {
    if (left[index] !== right[index]) return left[index] > right[index] ? 1 : -1;
  }
  return 0;
}

export function isNewerVersion(candidate, current) {
  return compareVersions(candidate, current) > 0;
}
