import { gzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';

export function packageManifest(version = '1.3.1', extra = {}) {
  return {
    name: 'dsh-openup-lewis',
    version,
    repository: { type: 'git', url: 'git+https://github.com/FerrariLewis/open.git' },
    dsh: { bundle: { patch: './cordis.patch.yml' } },
    lewisEnchantRelease: { version, notes: '测试更新说明' },
    ...extra,
  };
}
export function tarEntry(name, body = '', type = '0') {
  const content = Buffer.isBuffer(body) ? body : Buffer.from(body);
  const header = Buffer.alloc(512);
  header.write(name, 0, 100);
  header.write('0000644\0', 100, 8);
  header.write('0000000\0', 108, 8);
  header.write('0000000\0', 116, 8);
  header.write(content.length.toString(8).padStart(11, '0') + '\0', 124, 12);
  header.fill(32, 148, 156);
  header.write(type, 156, 1);
  header.write('ustar\0', 257, 6);
  let checksum = 0;
  for (const byte of header) checksum += byte;
  header.write(checksum.toString(8).padStart(6, '0') + '\0 ', 148, 8);
  return Buffer.concat([header, content, Buffer.alloc((512 - (content.length % 512)) % 512)]);
}
export function archive(pkg = packageManifest(), extraEntries = []) {
  return gzipSync(
    Buffer.concat([
      tarEntry('package/package.json', JSON.stringify(pkg)),
      tarEntry('package/cordis.patch.yml', '- id: dsh-boot-studio\n'),
      ...extraEntries,
      Buffer.alloc(1024),
    ]),
  );
}
export function archiveName(version, bytes, name = 'dsh-openup-lewis') {
  return `${name}-${version}-${createHash('sha256').update(bytes).digest('hex')}.tgz`;
}
export function npmMetadata(pkg, bytes) {
  return {
    ...pkg,
    dist: {
      tarball: `https://registry.npmjs.org/${pkg.name}/-/${pkg.name}-${pkg.version}.tgz`,
      integrity: 'sha512-' + createHash('sha512').update(bytes).digest('base64'),
    },
  };
}
