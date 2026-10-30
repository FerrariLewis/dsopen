import { lstat, mkdir, readFile, readdir, rename, unlink, writeFile } from 'node:fs/promises';
import { basename, dirname, join, resolve } from 'node:path';
import { randomUUID } from 'node:crypto';

const ARCHIVE =
  /^(dsh-openup-lewis|dsh-boot-studio)-(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)-([a-f0-9]{64})\.tgz$/;
const PART = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\.part$/;
const RETRY_FILE = 'cleanup-pending.json';
const RETRY_MS = 60_000;
const MAX_RETRY_MS = 60 * RETRY_MS;
const TRANSIENT_IO = new Set([
  'EBUSY',
  'EPERM',
  'EAGAIN',
  'EINTR',
  'EMFILE',
  'ENFILE',
  'EIO',
  'ETIMEDOUT',
  'ESTALE',
]);
const PART_IDLE_MS = 10 * 60_000;
const pathKey = (value) => resolve(value).toLowerCase();
const isTransient = (error) => TRANSIENT_IO.has(error?.code);

function hasArchiveReference(text, name) {
  // Windows file: dependencies are case-insensitive. Be equally conservative
  // for every profile/lock scan, including percent-encoded path spellings.
  const folded = text.toLowerCase();
  const wanted = name.toLowerCase();
  return (
    folded.includes(wanted) ||
    folded.includes(encodeURIComponent(name).toLowerCase()) ||
    folded
      .replace(/%([0-9a-f]{2})/g, (_, byte) => String.fromCharCode(parseInt(byte, 16)))
      .toLowerCase()
      .includes(wanted)
  );
}

export function cachedArchiveIdentity(name) {
  const match = ARCHIVE.exec(name);
  return match
    ? { packageName: match[1], version: `${match[2]}.${match[3]}.${match[4]}`, sha256: match[5] }
    : null;
}

/** Only this plugin's own update-cache is eligible. Profile manifests and lock
 * files remain read-only: pnpm may still need a file: archive on its next run. */
export function createUpdateCache({
  dataDir,
  packageFile,
  now = Date.now,
  profileRoot = join(dirname(dataDir), 'profiles'),
  fs = {},
}) {
  const io = { lstat, mkdir, readFile, readdir, rename, unlink, writeFile, ...fs };
  const cacheDir = join(dataDir, 'update-cache');
  const protectedPaths = new Set();
  let running,
    retryTimer,
    retryOptions,
    retrySignature,
    retryRound = 0,
    disposed = false;
  const protect = (path) => protectedPaths.add(pathKey(path));
  const unprotect = (path) => protectedPaths.delete(pathKey(path));

  async function referenceFiles() {
    const directories = new Set();
    try {
      for (const item of await io.readdir(profileRoot, { withFileTypes: true })) {
        if (item.isDirectory() && !item.isSymbolicLink())
          directories.add(join(profileRoot, item.name));
        else if (item.isSymbolicLink()) throw Error('profile-link');
      }
    } catch (error) {
      if (error.code !== 'ENOENT')
        return { error: 'profile-unreadable', retryable: isTransient(error) };
    }
    // Also cover a custom data directory while the plugin runs inside a profile.
    for (
      let current = dirname(resolve(packageFile));
      dirname(current) !== current;
      current = dirname(current)
    ) {
      // pnpm nests another node_modules below .pnpm/<package>. The outer one
      // anchors the real profile; stopping at the first would miss its lockfile.
      if (basename(current) === 'node_modules') directories.add(dirname(current));
    }
    const texts = [];
    for (const dir of directories) {
      for (const name of ['package.json', 'pnpm-lock.yaml', 'node_modules/.pnpm/lock.yaml']) {
        const file = join(dir, name);
        try {
          const info = await io.lstat(file);
          if (!info.isFile() || info.isSymbolicLink() || info.size > 16 * 1024 * 1024)
            return { error: 'profile-unreadable' };
          const text = await io.readFile(file, 'utf8');
          if (name === 'package.json') JSON.parse(text);
          texts.push(text);
        } catch (error) {
          if (error.code !== 'ENOENT')
            return { error: 'profile-unreadable', retryable: isTransient(error) };
        }
      }
    }
    return { texts };
  }

  async function persist(pending) {
    const target = join(cacheDir, RETRY_FILE);
    if (!pending.length) {
      await io.unlink(target).catch((error) => {
        if (error.code !== 'ENOENT') throw error;
      });
      return;
    }
    const temp = join(cacheDir, `${randomUUID()}.part`);
    protect(temp);
    try {
      await io.writeFile(
        temp,
        JSON.stringify({ format: 1, updatedAt: now(), pending }, null, 2) + '\n',
        { flag: 'wx' },
      );
      await io.rename(temp, target);
    } finally {
      unprotect(temp);
      await io.unlink(temp).catch(() => {});
    }
  }

  async function perform({ installedVersion, keepSpecs = [] }) {
    const removed = [],
      pending = [],
      kept = [];
    let entries,
      retryable = false;
    try {
      const info = await io.lstat(cacheDir);
      if (!info.isDirectory() || info.isSymbolicLink()) throw Error('cache-directory-unsafe');
      entries = await io.readdir(cacheDir);
    } catch (error) {
      if (error.code === 'ENOENT') return { report: { removed, pending, kept }, retryable };
      return {
        report: {
          removed,
          pending: [{ name: 'update-cache', reason: 'cache-unreadable', attempts: 1 }],
          kept,
        },
        retryable: isTransient(error),
      };
    }
    let previous = {};
    try {
      const info = await io.lstat(join(cacheDir, RETRY_FILE));
      if (info.isFile() && !info.isSymbolicLink() && info.size < 262144) {
        const saved = JSON.parse(await io.readFile(join(cacheDir, RETRY_FILE), 'utf8'));
        if (saved.format === 1 && Array.isArray(saved.pending))
          previous = Object.fromEntries(saved.pending.map((item) => [item.name, item.attempts]));
      }
    } catch {
      /* Rebuild the queue from a fresh directory/reference scan. */
    }
    const defer = (name, reason, transient = false) => {
      retryable ||= transient;
      pending.push({
        name,
        reason,
        attempts: Math.min(
          1_000_000,
          (Number.isSafeInteger(previous[name]) ? previous[name] : 0) + 1,
        ),
      });
    };
    const references = await referenceFiles();
    const retained = new Set(keepSpecs.map(pathKey));
    for (const name of entries) {
      const archive = cachedArchiveIdentity(name),
        part = PART.test(name);
      if (!archive && !part) continue;
      const file = join(cacheDir, name);
      if (
        protectedPaths.has(pathKey(file)) ||
        retained.has(pathKey(file)) ||
        (archive && archive.version === installedVersion)
      ) {
        kept.push(name);
        continue;
      }
      try {
        const info = await io.lstat(file);
        // Never traverse links or recurse into arbitrary directories.
        if (!info.isFile() || info.isSymbolicLink()) {
          defer(name, 'unsafe-entry');
          continue;
        }
        if (part && now() - info.mtimeMs < PART_IDLE_MS) {
          defer(name, 'download-in-progress', true);
          continue;
        }
        if (archive && references.error) {
          defer(name, references.error, references.retryable);
          continue;
        }
        // Filenames include a content hash; matching the basename is intentionally
        // conservative across pnpm's absolute/relative, encoded and Windows paths.
        if (archive && references.texts.some((text) => hasArchiveReference(text, name))) {
          defer(name, 'profile-reference');
          continue;
        }
        // Re-check the profile immediately before unlink, covering changes made
        // while a large directory was being examined. No active profile is edited.
        if (archive) {
          const latest = await referenceFiles();
          if (latest.error || latest.texts.some((text) => hasArchiveReference(text, name))) {
            defer(name, latest.error || 'profile-reference', latest.retryable);
            continue;
          }
        }
        if (protectedPaths.has(pathKey(file))) {
          kept.push(name);
          continue;
        }
        await io.unlink(file);
        removed.push(name);
      } catch (error) {
        if (error.code !== 'ENOENT')
          defer(
            name,
            error.code === 'EBUSY' || error.code === 'EPERM' ? 'file-busy' : 'delete-failed',
            isTransient(error),
          );
      }
    }
    try {
      await persist(pending);
    } catch (error) {
      pending.push({ name: RETRY_FILE, reason: 'retry-state-unwritable', attempts: 1 });
      retryable ||= isTransient(error);
    }
    return { report: { removed, pending, kept }, retryable };
  }

  function clearRetry() {
    clearTimeout(retryTimer);
    retryTimer = null;
  }

  async function runCleanup(options, automatic = false) {
    // Serialize scans so a startup cleanup cannot race an installation ack.
    const previous = running;
    const task = (async () => {
      if (previous) await previous.catch(() => {});
      // A queued timer uses the latest completed event's installation state.
      if (automatic) options = retryOptions;
      const { report, retryable } = await perform(options);
      retryOptions = options;
      // References, malformed profiles and unsafe paths need an event recheck,
      // not a timer. Keep their pending records for startup/prepare/install ack.
      if (!retryable || disposed) {
        clearRetry();
        retryRound = 0;
        retrySignature = null;
      } else {
        const signature = JSON.stringify([
          options.installedVersion,
          (options.keepSpecs ?? []).map(pathKey).sort(),
          report.pending.map(({ name, reason }) => [name, reason]).sort(),
        ]);
        const changed = signature !== retrySignature || report.removed.length > 0;
        if (changed) {
          retryRound = 0;
          clearRetry();
        } else if (automatic) {
          retryRound = Math.min(6, retryRound + 1);
          clearRetry();
        }
        retrySignature = signature;
        // Manual checks do not advance backoff or postpone an existing timer.
        if (!retryTimer) {
          const delay = Math.min(MAX_RETRY_MS, RETRY_MS * 2 ** retryRound);
          retryTimer = setTimeout(() => {
            retryTimer = null;
            return runCleanup(retryOptions, true).catch(() => {});
          }, delay);
          retryTimer.unref?.();
        }
      }
      return report;
    })();
    running = task;
    try {
      return await task;
    } finally {
      if (running === task) running = null;
    }
  }
  return {
    cacheDir,
    cleanup: (options) => runCleanup(options),
    protect,
    unprotect,
    dispose() {
      disposed = true;
      clearRetry();
    },
  };
}
