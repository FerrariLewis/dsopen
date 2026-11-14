import { mkdir, readFile, writeFile, rename, unlink } from 'node:fs/promises';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { platform, arch } from 'node:os';
import { setTimeout as pause } from 'node:timers/promises';
import { createHarnessTelemetry, POLICY_VERSION } from './telemetry-adapter.js';
import { DEFAULT_TELEMETRY_ENDPOINT } from './constants.js';

const sharingError = (code, message) => Object.assign(new Error(message), { code });

export function collectionEndpoint(value, allowLocal = false) {
  if (!value || typeof value !== 'string') return null;
  try {
    const url = new URL(value);
    const local = ['127.0.0.1', 'localhost', '[::1]'].includes(url.hostname);
    if (
      url.username ||
      url.password ||
      url.search ||
      url.hash ||
      (url.protocol !== 'https:' && !(allowLocal && local && url.protocol === 'http:'))
    )
      return null;
    return url.href.replace(/\/$/, '');
  } catch {
    return null;
  }
}

/** Sharing is opt-in; authorization and installation credentials stay local. */
export function createTelemetryService({
  dataDir,
  ctx = {},
  pluginVersion = null,
  getPluginVersion = async () => pluginVersion,
  endpoint = process.env.DSOPEN_TELEMETRY_ENDPOINT ?? DEFAULT_TELEMETRY_ENDPOINT,
  allowLocal = process.env.DSOPEN_TELEMETRY_ALLOW_LOCAL === '1',
  fetchImpl = globalThis.fetch,
  now = () => new Date(),
} = {}) {
  const configuredEndpoint = collectionEndpoint(endpoint, allowLocal);
  const file = join(dataDir, 'telemetry.json');
  let queue = Promise.resolve(),
    currentClient = null,
    clientEndpoint = null,
    disposed = false;
  let runtimePluginVersion = pluginVersion;
  let cachedState = null,
    loadingState = null;
  let clientLocale = 'unknown';
  let controls = Promise.resolve(),
    controlSequence = 0,
    reportingBlocked = false;
  function control(callback) {
    const pending = controls.then(callback);
    controls = pending.catch(() => {});
    return pending;
  }
  function setRuntimeMetadata({ locale, harnessVersion } = {}) {
    if (typeof locale === 'string' && locale.length <= 35) clientLocale = locale;
    const version =
      typeof harnessVersion === 'string' &&
      harnessVersion.length <= 64 &&
      /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/.test(harnessVersion)
        ? harnessVersion
        : null;
    // This value came from the public renderer manifest and is explicitly client-reported.
    ctx.modules = version ? { manifest: { release: { version } } } : null;
  }
  const stateDefault = () => ({
    version: 1,
    sharing: false,
    consent: null,
    collectionEndpoint: null,
    withdrawalPending: false,
    adapter: {},
    lastResult: null,
  });
  function serialize(callback) {
    const pending = queue.then(callback);
    queue = pending.catch(() => {});
    return pending;
  }
  async function read() {
    if (cachedState) return cachedState;
    if (loadingState) return loadingState;
    loadingState = loadState();
    try {
      cachedState = await loadingState;
      return cachedState;
    } finally {
      loadingState = null;
    }
  }
  async function loadState() {
    try {
      const text = await readFile(file, 'utf8');
      if (text.length > 65536) throw new Error('Data-sharing state is too large.');
      const state = JSON.parse(text);
      if (
        state?.version !== 1 ||
        typeof state.sharing !== 'boolean' ||
        !state.adapter ||
        typeof state.adapter !== 'object'
      )
        throw new Error('Invalid data-sharing state.');
      return { ...stateDefault(), ...state };
    } catch (error) {
      if (error.code === 'ENOENT') return stateDefault();
      throw error;
    }
  }
  async function update(patch) {
    return serialize(async () => {
      const current = await read(),
        next = { ...current, ...patch, version: 1 };
      await mkdir(dataDir, { recursive: true });
      const temporary = join(dataDir, `telemetry.${randomUUID()}.tmp`);
      try {
        await writeFile(temporary, JSON.stringify(next, null, 2) + '\n', {
          flag: 'wx',
          mode: 0o600,
        });
        // Windows scanners or a concurrent status reader can briefly hold the target.
        for (let attempt = 0; ; attempt++) {
          try {
            await rename(temporary, file);
            break;
          } catch (error) {
            if (!['EPERM', 'EACCES', 'EBUSY'].includes(error.code) || attempt >= 4) throw error;
            await pause(15 * (attempt + 1));
          }
        }
        cachedState = next;
      } finally {
        await unlink(temporary).catch(() => {});
      }
      return next;
    });
  }
  const safeAdapter = (value) =>
    Object.fromEntries(
      ['installationId', 'credential', 'registrationPending', 'lastSentAt', 'withdrawn']
        .filter((key) => Object.hasOwn(value, key))
        .map((key) => [key, value[key]]),
    );
  function client(target) {
    if (currentClient && clientEndpoint === target) return currentClient;
    clientEndpoint = target;
    currentClient = createHarnessTelemetry({
      endpoint: target,
      ctx,
      pluginVersion: runtimePluginVersion,
      fetchImpl,
      now,
      locale: () => clientLocale,
      os: platform,
      arch,
      storage: {
        read: async () => (await read()).adapter,
        write: async (value) => {
          await update({ adapter: safeAdapter(value) });
        },
      },
      getConsentReceipt: async () => {
        const state = await read();
        return !disposed && state.sharing && state.collectionEndpoint === configuredEndpoint
          ? state.consent
          : null;
      },
    });
    return currentClient;
  }
  async function status() {
    const state = await read();
    const validConsent =
      state.sharing &&
      state.consent?.granted === true &&
      state.consent.policyVersion === POLICY_VERSION &&
      state.collectionEndpoint === configuredEndpoint;
    return {
      configured: !!configuredEndpoint,
      enabled: !!configuredEndpoint && !!validConsent,
      policyVersion: POLICY_VERSION,
      endpoint: configuredEndpoint,
      authorizationRequired: state.sharing && !validConsent,
      consentAt: state.consent?.timestamp || null,
      lastSentAt: state.adapter.lastSentAt || null,
      withdrawalPending: state.withdrawalPending === true,
      lastResult: state.lastResult,
      identityAssurance: 'self-reported',
      membershipLevelSupported: false,
    };
  }
  async function report({ locale, harnessVersion, event = 'heartbeat', force = false } = {}) {
    const sequence = controlSequence;
    if (disposed || reportingBlocked || !configuredEndpoint)
      return { sent: false, reason: 'not-configured' };
    runtimePluginVersion ||= await getPluginVersion();
    if (!runtimePluginVersion) return { sent: false, reason: 'version-unavailable' };
    setRuntimeMetadata({ locale, harnessVersion });
    const state = await read();
    if (reportingBlocked || sequence !== controlSequence || disposed)
      return { sent: false, reason: 'withdrawn' };
    if (state.withdrawalPending) return { sent: false, reason: 'withdrawal-pending' };
    if (!state.sharing || state.collectionEndpoint !== configuredEndpoint)
      return { sent: false, reason: 'authorization-required' };
    const result = await client(configuredEndpoint).report({ event, force });
    if (sequence === controlSequence && !reportingBlocked) await update({ lastResult: result });
    return result;
  }
  async function grantOperation(
    { policyVersion, confirmed, locale, harnessVersion } = {},
    sequence,
  ) {
    if (!configuredEndpoint)
      throw sharingError(
        'BOOT_TELEMETRY_UNCONFIGURED',
        '开发者尚未配置数据接收服务，当前不会发送任何数据。',
      );
    runtimePluginVersion ||= await getPluginVersion();
    if (!runtimePluginVersion)
      throw sharingError(
        'BOOT_TELEMETRY_VERSION_UNAVAILABLE',
        '暂时无法读取插件版本，请稍后重试。',
      );
    if (confirmed !== true || policyVersion !== POLICY_VERSION)
      throw sharingError(
        'BOOT_TELEMETRY_AUTHORIZATION_REQUIRED',
        '请阅读并明确同意当前版本的数据共享说明。',
      );
    const state = await read();
    if (sequence !== controlSequence) return status();
    if (state.withdrawalPending)
      throw sharingError(
        'BOOT_TELEMETRY_DELETION_PENDING',
        '此前的数据删除请求尚未完成，请先重试删除。',
      );
    if (
      state.collectionEndpoint &&
      state.collectionEndpoint !== configuredEndpoint &&
      state.adapter.credential
    )
      throw sharingError(
        'BOOT_TELEMETRY_COLLECTOR_CHANGED',
        '数据接收服务已变更，请先停止共享并删除原服务中的数据。',
      );
    if (
      state.sharing &&
      state.consent?.policyVersion === POLICY_VERSION &&
      state.collectionEndpoint === configuredEndpoint
    )
      return status();
    currentClient = null;
    reportingBlocked = false;
    await update({
      sharing: true,
      consent: { granted: true, policyVersion: POLICY_VERSION, timestamp: now().toISOString() },
      collectionEndpoint: configuredEndpoint,
      withdrawalPending: false,
      adapter: state.adapter.withdrawn ? {} : state.adapter,
      lastResult: null,
    });
    // Authorization persists before any network call. The settings dialog never waits for the collector.
    if (sequence === controlSequence)
      void report({ locale, harnessVersion, event: 'activated', force: true }).catch(() => {});
    return status();
  }
  async function withdrawOperation(pendingWithdrawal) {
    const state = await read();
    await update({ sharing: false, consent: null, withdrawalPending: true });
    const target = collectionEndpoint(state.collectionEndpoint, allowLocal);
    let result;
    if (!target)
      result = {
        withdrawn: true,
        remoteDeleted: !state.adapter.credential && !state.adapter.registrationPending,
        retryRequired: !!state.adapter.credential || !!state.adapter.registrationPending,
      };
    else result = await (pendingWithdrawal || client(target).withdraw());
    await update({
      withdrawalPending: !result.remoteDeleted,
      lastResult: result,
      ...(result.remoteDeleted ? { adapter: {}, collectionEndpoint: null } : {}),
    });
    return status();
  }
  function grant(value) {
    const sequence = ++controlSequence;
    return control(() => grantOperation(value, sequence));
  }
  function withdraw() {
    controlSequence++;
    reportingBlocked = true;
    // Stop/abort the active adapter immediately, before asynchronous disk work.
    const pendingWithdrawal = currentClient?.withdraw();
    return control(() => withdrawOperation(pendingWithdrawal));
  }
  return {
    status,
    report,
    grant,
    withdraw,
    dispose() {
      disposed = true;
      reportingBlocked = true;
    },
    setAccountContext(value) {
      Object.assign(ctx, value);
    },
  };
}
