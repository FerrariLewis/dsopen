/**
 * Opt-in data-sharing adapter. Never report before explicit authorization.
 * Only call after presenting the real collection notice and recording consent.
 * Account identity is client-reported; this is not DeepSeek OAuth authentication.
 */
export const POLICY_VERSION = '2026-11-14';
const OFFICIAL_PLATFORM_ORIGIN = 'https://platform.deepseek.com';

function consentValid(receipt) {
  return (
    receipt?.granted === true &&
    receipt.policyVersion === POLICY_VERSION &&
    typeof receipt.timestamp === 'string' &&
    Number.isFinite(Date.parse(receipt.timestamp))
  );
}

export function harnessVersion(ctx) {
  const value = ctx?.modules?.manifest?.release?.version;
  return typeof value === 'string' && value.length > 0 && value.length <= 80 ? value : null;
}

function officialAccountLink(value, pathname) {
  if (typeof value !== 'string') return false;
  try {
    const url = new URL(value);
    return (
      url.origin === OFFICIAL_PLATFORM_ORIGIN &&
      url.pathname === pathname &&
      !url.username &&
      !url.password &&
      !url.search &&
      !url.hash
    );
  } catch {
    return false;
  }
}

export async function readAllowedProfile(ctx, metadata, signal) {
  try {
    // State links project this service's configured origin without credentials.
    // Never read config or getPlatformSession() to discover the issuer.
    const host = ctx?.deepseekAccount;
    const remote = ctx?.remote?.account;
    const hostAvailable =
      typeof host?.getState === 'function' && typeof host?.getProfile === 'function';
    const account = hostAvailable ? host : remote;
    if (
      typeof account?.getState !== 'function' ||
      typeof account?.getProfile !== 'function' ||
      signal?.aborted
    )
      return null;
    const read = async (method, ...args) => {
      const result = await new Promise((resolve, reject) => {
        const abort = () => reject(new Error('Account lookup cancelled.'));
        if (signal?.aborted) {
          abort();
          return;
        }
        signal?.addEventListener('abort', abort, { once: true });
        Promise.resolve()
          .then(() => account[method](...args))
          .then(resolve, reject)
          .finally(() => signal?.removeEventListener('abort', abort));
      });
      return hostAvailable ? result : result?.ok ? result.value : null;
    };
    const state = await read('getState');
    if (
      signal?.aborted ||
      state?.status !== 'credential-stored' ||
      !officialAccountLink(state.links?.usageUrl, '/usage') ||
      !officialAccountLink(state.links?.topUpUrl, '/top_up')
    )
      return null;
    const result = await read('getProfile', metadata);
    if (signal?.aborted || result?.status !== 'ready') return null;
    const profile = result.value;
    if (typeof profile?.id !== 'string' || !profile.id.trim()) return null;
    // Profile can also contain contact and avatarUrl; copy only these fields.
    return {
      issuer: 'deepseek-platform',
      id: profile.id,
      name: typeof profile.name === 'string' ? profile.name : null,
    };
  } catch {
    return null;
  }
}

/** Storage persists installation credentials, consent state and send metadata only. */
export function createHarnessTelemetry({
  endpoint,
  ctx,
  pluginVersion,
  storage,
  getConsentReceipt,
  fetchImpl = globalThis.fetch,
  cryptoImpl = globalThis.crypto,
  now = () => new Date(),
  locale = () => Intl.DateTimeFormat().resolvedOptions().locale,
  os = () => 'unknown',
  arch = () => 'unknown',
  timeoutMs = 10000,
  retryDelayMs = 250,
}) {
  const url = new URL(endpoint);
  const local = ['127.0.0.1', 'localhost', '[::1]'].includes(url.hostname);
  if (
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    (url.protocol !== 'https:' && !(local && url.protocol === 'http:'))
  ) {
    throw new Error('Telemetry endpoint requires HTTPS (HTTP is allowed on loopback for preview).');
  }
  const base = url.href.replace(/\/$/, '');
  let inFlight = null;
  let reportController = null;
  let withdrawalRequested = false;
  let withdrawalInFlight = null;
  let storageQueue = Promise.resolve();
  function storeOperation(operation) {
    const pending = storageQueue.then(operation);
    storageQueue = pending.catch(() => {});
    return pending;
  }
  const readState = () => storeOperation(async () => (await storage.read()) || {});
  // Merge against the latest stored state. A late registration response must
  // retain its deletion credential without overwriting a withdrawal marker.
  const updateState = (patch) =>
    storeOperation(async () => {
      const current = (await storage.read()) || {};
      const next = { ...current, ...patch, ...(withdrawalRequested ? { withdrawn: true } : {}) };
      await storage.write(next);
      return next;
    });
  async function request(path, body, credential, method = 'POST', signal) {
    for (let attempt = 0; ; attempt++) {
      try {
        const response = await fetchImpl(base + path, {
          method,
          headers: {
            'Content-Type': 'application/json',
            ...(credential ? { Authorization: `Bearer ${credential}` } : {}),
          },
          ...(body === undefined ? {} : { body: JSON.stringify(body) }),
          signal: signal
            ? AbortSignal.any([signal, AbortSignal.timeout(timeoutMs)])
            : AbortSignal.timeout(timeoutMs),
          redirect: 'error',
          credentials: 'omit',
        });
        if (!response.ok) {
          await response.body?.cancel();
          throw Object.assign(new Error('Telemetry HTTP failure.'), {
            code: `HTTP_${response.status}`,
            httpStatus: response.status,
          });
        }
        return response.status === 204 ? null : await response.json();
      } catch (error) {
        const retryable =
          !error.httpStatus || [408, 429, 500, 502, 503, 504].includes(error.httpStatus);
        if (
          attempt >= 1 ||
          method !== 'POST' ||
          withdrawalRequested ||
          signal?.aborted ||
          !retryable
        )
          throw error;
        // Repeat the same installation/event ID. Never follow a redirect with account data.
        await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
        if (withdrawalRequested || signal?.aborted) throw error;
      }
    }
  }
  return {
    async report(options = {}) {
      if (withdrawalRequested) return { sent: false, reason: 'withdrawn' };
      if (inFlight) return { sent: false, reason: 'busy' };
      const controller = new AbortController();
      reportController = controller;
      const task = (async () => {
        let stage = 'preparing';
        try {
          const { event = 'heartbeat', force = false } = options || {};
          const receipt = await getConsentReceipt();
          if (withdrawalRequested) return { sent: false, reason: 'withdrawn' };
          if (!consentValid(receipt)) return { sent: false, reason: 'authorization-required' };
          let state = await readState();
          if (withdrawalRequested || state.withdrawn) return { sent: false, reason: 'withdrawn' };
          const time = now();
          const dailyLimited =
            !force && state.lastSentAt && time.getTime() - Date.parse(state.lastSentAt) < 86400000;
          if (dailyLimited && state.lastAccountIdentified !== false) {
            return { sent: false, reason: 'daily-limit' };
          }
          if (!state.installationId)
            state = await updateState({ installationId: cryptoImpl.randomUUID() });
          if (withdrawalRequested) return { sent: false, reason: 'withdrawn' };
          if (!state.credential) {
            stage = 'registration';
            state = await updateState({ registrationPending: true });
            if (withdrawalRequested) return { sent: false, reason: 'withdrawn' };
            // Receive a registration response even during withdrawal, retaining
            // its credential so the queued DELETE can remove the new record.
            const registration = await request('/api/registrations', {
              installationId: state.installationId,
            });
            if (typeof registration?.credential !== 'string' || !registration.credential)
              throw new Error('Installation registration did not return a credential.');
            state = await updateState({
              credential: registration.credential,
              registrationPending: false,
            });
          }
          if (withdrawalRequested) return { sent: false, reason: 'withdrawn' };
          const runtimeVersion = harnessVersion(ctx);
          let metadata = {
            version: runtimeVersion || 'unknown',
            locale: locale(),
            timezoneOffsetSeconds: -time.getTimezoneOffset() * 60,
          };
          if (typeof ctx?.accountUi?.clientMetadata === 'function')
            metadata = ctx.accountUi.clientMetadata(metadata.locale);
          const account = await readAllowedProfile(
            ctx,
            metadata,
            AbortSignal.any([controller.signal, AbortSignal.timeout(timeoutMs)]),
          );
          if (withdrawalRequested) return { sent: false, reason: 'withdrawn' };
          if (dailyLimited && !account) return { sent: false, reason: 'daily-limit' };
          const payload = {
            eventId: cryptoImpl.randomUUID(),
            installationId: state.installationId,
            event: state.lastSentAt ? event : 'activated',
            account,
            pluginVersion,
            harnessVersion: runtimeVersion,
            os: os(),
            arch: arch(),
            locale: metadata.locale,
            consent: { granted: true, policyVersion: POLICY_VERSION, timestamp: receipt.timestamp },
          };
          stage = 'event';
          await request('/api/events', payload, state.credential, 'POST', controller.signal);
          if (withdrawalRequested) return { sent: false, reason: 'withdrawn' };
          await updateState({
            lastSentAt: time.toISOString(),
            lastAccountIdentified: account !== null,
          });
          if (withdrawalRequested) return { sent: false, reason: 'withdrawn' };
          return { sent: true, accountIdentified: account !== null };
        } catch (error) {
          // Failures never block the opening animation or leak identity to logs.
          return {
            sent: false,
            reason: withdrawalRequested ? 'withdrawn' : 'unavailable',
            stage,
            ...(Number.isInteger(error?.httpStatus) ? { httpStatus: error.httpStatus } : {}),
            failureCode:
              typeof (error?.cause?.code || error?.code) === 'string' &&
              /^[A-Z_0-9]{1,64}$/.test(error?.cause?.code || error?.code)
                ? error.cause?.code || error.code
                : error?.name || 'Error',
          };
        }
      })();
      inFlight = task;
      try {
        return await task;
      } finally {
        if (inFlight === task) inFlight = null;
        if (reportController === controller) reportController = null;
      }
    },
    async withdraw() {
      withdrawalRequested = true;
      reportController?.abort();
      if (withdrawalInFlight) return withdrawalInFlight;
      const task = (async () => {
        try {
          // Persist immediately. Then wait for in-flight registration/profile/
          // event work before re-reading the latest deletion credential.
          await updateState({ withdrawn: true });
          await inFlight;
          const state = await readState();
          if (state.installationId && state.credential) {
            // DELETE deliberately does not inherit the aborted report signal.
            await request(
              `/api/registrations/${encodeURIComponent(state.installationId)}`,
              undefined,
              state.credential,
              'DELETE',
            );
            await storeOperation(() => storage.write({ withdrawn: true }));
            return { withdrawn: true, remoteDeleted: true };
          }
          // The server may have accepted registration but its response was lost.
          if (state.registrationPending)
            return { withdrawn: true, remoteDeleted: false, retryRequired: true };
          return { withdrawn: true, remoteDeleted: true };
        } catch {
          return { withdrawn: true, remoteDeleted: false, retryRequired: true };
        }
      })();
      withdrawalInFlight = task;
      try {
        return await task;
      } finally {
        if (withdrawalInFlight === task) withdrawalInFlight = null;
      }
    },
  };
}
