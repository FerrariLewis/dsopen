import { CORE_PACKAGE_NAME, NPM_ENTRY_NAME, API_TIMEOUTS } from './constants.js';
import { parseVersion, isNewerVersion } from './version.js';
import { clientError, readJSONResponse } from './api-client.js';

// One renderer document is one launch. Neither a conversation change nor a slot
// remount starts another automatic check or repeats a dismissed prompt.
const PACKAGE_NAMES = new Set([NPM_ENTRY_NAME, CORE_PACKAGE_NAME]);

export function isAvailableUpdate(status) {
  if (
    !status ||
    status.available !== true ||
    status.channelReady !== true ||
    !PACKAGE_NAMES.has(status.packageName)
  )
    return false;
  const latest = parseVersion(status.latestVersion),
    current = parseVersion(status.currentVersion);
  if (!latest || !current || (status.manifest && status.manifest.version !== status.latestVersion))
    return false;
  return isNewerVersion(status.latestVersion, status.currentVersion);
}

export function createStartupUpdateSession() {
  let snapshot = { checking: false, checked: false, status: null, dismissed: false };
  let checkPromise;
  let completedVersion;
  const listeners = new Set();
  function publish(patch) {
    snapshot = { ...snapshot, ...patch };
    listeners.forEach((listener) => {
      try {
        listener(snapshot);
      } catch {
        /* Observers cannot block launch. */
      }
    });
    return snapshot;
  }
  return {
    getSnapshot: () => snapshot,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    check(request) {
      if (checkPromise) return checkPromise;
      publish({ checking: true });
      checkPromise = Promise.resolve()
        .then(() => request('/updates/check', { method: 'POST', body: '{}' }))
        .then(
          (value) => {
            const status =
              completedVersion && value ? { ...value, currentVersion: completedVersion } : value;
            publish({
              checking: false,
              checked: true,
              status: isAvailableUpdate(status) ? status : null,
            });
            return snapshot.status;
          },
          () => {
            publish({ checking: false, checked: true, status: null });
            return null;
          },
        );
      return checkPromise;
    },
    dismiss() {
      publish({ dismissed: true });
    },
    updated(version) {
      if (!parseVersion(version)) return;
      completedVersion = version;
      publish({
        dismissed: true,
        status: snapshot.status
          ? { ...snapshot.status, available: false, currentVersion: version }
          : null,
      });
    },
  };
}

export const startupUpdateSession = createStartupUpdateSession();

function absoluteArchivePath(spec) {
  return (
    typeof spec === 'string' &&
    spec.length < 8192 &&
    // eslint-disable-next-line no-control-regex -- Installer paths must exclude embedded control characters.
    !/[\u0000-\u001f\u007f]/.test(spec) &&
    (/^[A-Za-z]:[\\/]/.test(spec) ||
      /^\/(?!\/)/.test(spec) ||
      /^\\\\[^\\/]+[\\/][^\\/]+[\\/]/.test(spec)) &&
    !spec.split(/[\\/]/).includes('..') &&
    spec.endsWith('.tgz')
  );
}

export function validatePreparedUpdate(staged, status) {
  if (
    !isAvailableUpdate(status) ||
    !staged ||
    staged.version !== status.latestVersion ||
    staged.requiresRestart !== true ||
    !/^[a-f0-9]{64}$/.test(staged.sha256 || '') ||
    !absoluteArchivePath(staged.spec)
  ) {
    throw Error('更新包准备结果无效，未请求安装。');
  }
  const segments = staged.spec.split(/[\\/]/);
  const basename = `${status.packageName}-${staged.version}-${staged.sha256}.tgz`;
  if (segments.at(-1) !== basename || segments.at(-2) !== 'update-cache')
    throw Error('更新包路径与已校验的名称、版本或 SHA-256 不一致，未请求安装。');
  return staged;
}

const harnessServices = new Set();

/** Optional service injection does not make old Harness versions fail to load. */
export function bindHarnessServices(services = {}) {
  const entry = {
    pluginManager:
      typeof services.pluginManager?.installBundle === 'function' ? services.pluginManager : null,
    pluginNavigation:
      typeof services.pluginNavigation?.openBundle === 'function' ||
      typeof services.pluginNavigation?.openList === 'function'
        ? services.pluginNavigation
        : null,
  };
  if (!entry.pluginManager && !entry.pluginNavigation) return () => {};
  harnessServices.add(entry);
  return () => harnessServices.delete(entry);
}

function harnessService(name) {
  return [...harnessServices].reverse().find((entry) => entry[name])?.[name] || null;
}

export function canOpenHarnessPluginManager() {
  return !!harnessService('pluginNavigation');
}
export function openHarnessPluginManager(packageName = NPM_ENTRY_NAME) {
  const navigation = harnessService('pluginNavigation');
  if (!navigation) return false;
  if (typeof navigation.openBundle === 'function') navigation.openBundle(packageName);
  else navigation.openList();
  return true;
}

const classifiedInstallErrors = new WeakSet();
function installError(code, message, properties) {
  const error = clientError(code, message, properties);
  classifiedInstallErrors.add(error);
  return error;
}
function uncertainInstall(properties) {
  return installError(
    'BOOT_HARNESS_INSTALL_UNCERTAIN',
    '更新响应超时。请在插件管理中核对实际版本后重试。',
    { ...properties, uncertain: true },
  );
}

function installedResult(answer, version) {
  if (!answer || answer.ok !== true) throw uncertainInstall({ details: answer?.error });
  const result = answer.value;
  if (result && ['failed', 'cancelled'].includes(result.application))
    throw installError('BOOT_HARNESS_INSTALL_FAILED', '更新未完成，请在插件管理中查看详情。', {
      details: result?.error,
    });
  if (!result || !['applied', 'restart-required'].includes(result.application) || result.error)
    throw uncertainInstall({ details: result?.error });
  if (result.version && result.version !== version)
    throw installError(
      'BOOT_HARNESS_INSTALL_VERSION',
      'Harness 返回的版本与更新目标不一致，请查看插件管理。',
      { uncertain: true },
    );
  return result;
}

/** Prefer Harness's generated Remote API; only absent services use legacy HTTP.
 * Once an install has been sent, a lost answer must never submit it again. */
export async function installVerifiedUpdate(
  spec,
  version,
  {
    fetchImpl = fetch,
    pluginManager = harnessService('pluginManager'),
    timeout = API_TIMEOUTS.install,
  } = {},
) {
  if (!absoluteArchivePath(spec) || !parseVersion(version))
    throw Error('更新包路径或版本无效，未请求安装。');
  const rpcId =
    globalThis.crypto?.randomUUID?.() ||
    `lewis-enchant-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const controller = new AbortController();
  let timer;
  const deadline = new Promise((_, reject) => {
    timer = setTimeout(() => {
      controller.abort();
      reject(
        installError(
          'BOOT_HARNESS_INSTALL_UNCERTAIN',
          '更新响应超时。请在插件管理中核对实际版本后重试。',
          { uncertain: true },
        ),
      );
    }, timeout);
  });
  try {
    if (pluginManager) {
      const answer = await Promise.race([
        pluginManager.installBundle(spec, { enabled: true, saveExact: true, requestId: rpcId }),
        deadline,
      ]);
      return installedResult(answer, version);
    }
    const response = await Promise.race([
      fetchImpl('/api/pluginManager/installBundle', {
        method: 'POST',
        credentials: 'same-origin',
        signal: controller.signal,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          type: 'client-request',
          rpcId,
          method: 'pluginManager/installBundle',
          payload: {
            args: { spec, options: { enabled: true, saveExact: true, requestId: rpcId } },
          },
        }),
      }),
      deadline,
    ]);
    if (response.status === 401 || response.status === 403)
      throw installError(
        'BOOT_HARNESS_INSTALL_PERMISSION',
        '当前连接没有管理插件的权限，请使用 Harness 主窗口的拥有者连接。',
      );
    if (response.status === 404 || response.status === 405)
      throw installError(
        'BOOT_HARNESS_INSTALL_UNAVAILABLE',
        '当前 Harness 不支持自动安装此更新，请打开插件管理完成更新。',
      );
    if (!response.ok) throw uncertainInstall({ status: response.status });
    let envelope;
    try {
      envelope = await Promise.race([readJSONResponse(response), deadline]);
    } catch (error) {
      if (classifiedInstallErrors.has(error)) throw error;
      throw installError(
        'BOOT_HARNESS_INSTALL_RESPONSE',
        'Harness 未接受更新请求，请在插件管理中查看详情。',
        { cause: error, uncertain: true },
      );
    }
    if (
      envelope.type !== 'server-response' ||
      envelope.rpcId !== rpcId ||
      typeof envelope.result?.ok !== 'boolean'
    )
      throw installError(
        'BOOT_HARNESS_INSTALL_RESPONSE',
        'Harness 未接受更新请求，请在插件管理中查看详情。',
        { uncertain: true },
      );
    return installedResult(envelope.result, version);
  } catch (error) {
    if (controller.signal.aborted)
      throw installError(
        'BOOT_HARNESS_INSTALL_UNCERTAIN',
        '更新响应超时。请在插件管理中核对实际版本后重试。',
        { cause: error, uncertain: true },
      );
    // Foreign transport errors often carry codes such as ECONNRESET. They do
    // not prove that Harness rejected an install already sent on the wire.
    if (classifiedInstallErrors.has(error)) throw error;
    throw uncertainInstall({ cause: error });
  } finally {
    clearTimeout(timer);
  }
}

const activeUpdates = new Map();
const completedUpdates = new Map();
const uncertainUpdates = new Map();
const pendingAcknowledgements = new Map();
const updateKey = (status) => `${status?.packageName}@${status?.latestVersion}`;
export function appliedUpdate(status) {
  return completedUpdates.get(updateKey(status)) || null;
}

/** Cleanup acknowledgment never changes a successful installation into failure. */
export async function retryUpdateAcknowledgements(request) {
  for (const [key, entry] of pendingAcknowledgements) {
    if (!entry.promise)
      entry.promise = Promise.resolve()
        .then(() =>
          request('/updates/installed', {
            method: 'POST',
            body: JSON.stringify({ version: entry.version, spec: entry.spec }),
          }),
        )
        .then(() => {
          entry.value.cleanupPending = false;
          if (pendingAcknowledgements.get(key) === entry) pendingAcknowledgements.delete(key);
        })
        .catch(() => {
          /* Retry at the next manual check; the package is already installed. */
        })
        .finally(() => {
          entry.promise = null;
        });
    await entry.promise;
  }
}

/** Plugin disposal can invalidate a pending download, never retract an install
 * already sent to Harness. Ordinary settings-panel unmounts do not call this. */
export function cancelPendingUpdates() {
  let count = 0;
  for (const [key, task] of activeUpdates) {
    if (task.installStarted || task.canceled) continue;
    task.canceled = true;
    task.stopPolling?.();
    if (activeUpdates.get(key) === task) activeUpdates.delete(key);
    count++;
  }
  return count;
}

/** Manual and automatic prompts share validation and one install per artifact. */
export async function prepareAndInstallUpdate(
  request,
  status,
  { onPhase, onProgress, install = installVerifiedUpdate, pollInterval = 500 } = {},
) {
  if (!isAvailableUpdate(status)) throw Error('更新版本无效或尚未公开，请重新检查更新。');
  const key = updateKey(status);
  if (completedUpdates.has(key)) return completedUpdates.get(key);
  if (uncertainUpdates.has(key)) throw uncertainUpdates.get(key);
  let task = activeUpdates.get(key);
  if (!task) {
    task = {
      observers: new Set(),
      progressObservers: new Set(),
      phase: 'prepare',
      progress: {
        version: status.latestVersion,
        phase: 'prepare',
        downloadedBytes: 0,
        totalBytes: null,
        percent: null,
      },
      promise: null,
      canceled: false,
      installStarted: false,
      stopPolling: null,
    };
    activeUpdates.set(key, task);
    const emit = (phase) => {
      task.phase = phase;
      task.observers.forEach((listener) => {
        try {
          listener(phase);
        } catch {
          /* Preserve installer flow. */
        }
      });
    };
    const emitProgress = (progress) => {
      task.progress = progress;
      task.progressObservers.forEach((listener) => {
        try {
          listener(progress);
        } catch {
          /* Progress cannot interrupt installation. */
        }
      });
    };
    task.promise = Promise.resolve()
      .then(async () => {
        let stopped = false,
          timer;
        task.stopPolling = () => {
          stopped = true;
          clearTimeout(timer);
        };
        const assertActive = () => {
          if (task.canceled) throw Error('更新已取消：插件已停用或卸载，未请求安装。');
        };
        async function poll() {
          try {
            const progress = await request('/updates/progress');
            if (
              !stopped &&
              progress?.version === status.latestVersion &&
              ['checking', 'downloading', 'verifying', 'ready'].includes(progress.phase)
            )
              emitProgress(progress);
          } catch {
            /* Downloading must survive a missed progress response. */
          }
          if (!stopped) timer = setTimeout(poll, pollInterval);
        }
        try {
          assertActive();
          const preparing = request('/updates/prepare', {
            method: 'POST',
            body: JSON.stringify({ version: status.latestVersion }),
          });
          void poll();
          const staged = validatePreparedUpdate(await preparing, status);
          assertActive();
          task.stopPolling();
          emit('install');
          emitProgress({ ...task.progress, phase: 'install', percent: null });
          // A synchronous observer can dispose the plugin while the stage changes.
          assertActive();
          task.installStarted = true;
          const result = await install(staged.spec, staged.version);
          const value = { version: staged.version, result };
          completedUpdates.set(key, value);
          value.cleanupPending = true;
          pendingAcknowledgements.set(key, { version: staged.version, spec: staged.spec, value });
          void retryUpdateAcknowledgements(request);
          emit('complete');
          emitProgress({ ...task.progress, phase: 'complete', percent: 100 });
          return value;
        } catch (error) {
          if (error?.uncertain) uncertainUpdates.set(key, error);
          emitProgress({
            ...task.progress,
            phase: task.canceled ? 'canceled' : 'error',
            percent: null,
          });
          throw error;
        } finally {
          task.stopPolling();
        }
      })
      .finally(() => {
        if (activeUpdates.get(key) === task) activeUpdates.delete(key);
      });
  }
  if (typeof onPhase === 'function') {
    task.observers.add(onPhase);
    try {
      onPhase(task.phase);
    } catch {
      /* Observers cannot stop installation. */
    }
  }
  if (typeof onProgress === 'function') {
    task.progressObservers.add(onProgress);
    try {
      onProgress(task.progress);
    } catch {
      /* Observers cannot stop installation. */
    }
  }
  try {
    return await task.promise;
  } finally {
    task.observers.delete(onPhase);
    task.progressObservers.delete(onProgress);
  }
}
