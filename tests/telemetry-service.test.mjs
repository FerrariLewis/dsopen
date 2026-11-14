import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createTelemetryService, collectionEndpoint } from '../src/telemetry-service.js';

const receipt = {
  confirmed: true,
  policyVersion: '2026-11-14',
  locale: 'zh-CN',
  harnessVersion: '0.2.1-rc.5',
};
const json = (value, status = 200) =>
  new Response(JSON.stringify(value), { status, headers: { 'content-type': 'application/json' } });
const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
async function waitFor(predicate) {
  for (let i = 0; i < 200; i++) {
    if (await predicate()) return;
    await delay(5);
  }
  throw new Error('Expected condition did not arrive');
}
async function fixture(t, options = {}) {
  const dataDir = await mkdtemp(join(tmpdir(), 'dsopen-sharing-test-'));
  const requests = [],
    profileReads = [];
  let now = Date.parse('2026-11-14T08:00:00.000Z');
  const ctx = {
    deepseekAccount: {
      async getState() {
        profileReads.push('state');
        return {
          status: 'credential-stored',
          links: {
            usageUrl: 'https://platform.deepseek.com/usage',
            topUpUrl: 'https://platform.deepseek.com/top_up',
          },
        };
      },
      async getProfile(metadata) {
        profileReads.push(metadata);
        return {
          status: 'ready',
          value: {
            id: 'RAW-PRIVATE-ACCOUNT-ID',
            name: '测试昵称',
            contact: 'NEVER-STORE-CONTACT',
            avatarUrl: 'https://example.invalid/avatar',
          },
        };
      },
    },
  };
  const fetchImpl = async (url, init) => {
    requests.push({
      url,
      method: init.method,
      headers: init.headers,
      body: init.body ? JSON.parse(init.body) : null,
    });
    if (options.fetchImpl) return options.fetchImpl(url, init);
    return json(
      url.endsWith('/api/registrations')
        ? { credential: 'installation-deletion-secret' }
        : { accepted: true },
    );
  };
  const service = createTelemetryService({
    dataDir,
    ctx,
    pluginVersion: '1.3.4',
    endpoint: 'https://collector.example.invalid',
    now: () => new Date(now),
    ...options,
    fetchImpl,
  });
  t.after(async () => {
    service.dispose();
    await rm(dataDir, { recursive: true, force: true });
  });
  return {
    service,
    dataDir,
    requests,
    profileReads,
    ctx,
    fetchImpl,
    advance: () => {
      now += 86400001;
    },
  };
}

test('sharing is off by default; unconfigured and insecure endpoints never send', async (t) => {
  assert.equal(collectionEndpoint('http://collector.example.invalid'), null);
  assert.equal(collectionEndpoint('http://127.0.0.1:4318'), null);
  assert.equal(collectionEndpoint('http://127.0.0.1:4318', true), 'http://127.0.0.1:4318');
  const { service, requests, profileReads } = await fixture(t, { endpoint: '' });
  assert.equal((await service.status()).configured, false);
  await service.report(receipt);
  await assert.rejects(service.grant(receipt), /尚未配置/);
  assert.equal(requests.length, 0);
  assert.equal(profileReads.length, 0);
});
test('the bundled production collector remains completely inactive without consent', async (t) => {
  const { service, requests, profileReads } = await fixture(t, { endpoint: undefined });
  const status = await service.status();
  assert.equal(status.endpoint, 'https://dsopen-collector-lewis.lewiszhouyichen.chatgpt.site');
  assert.equal(status.configured, true);
  assert.equal(status.enabled, false);
  await service.report(receipt);
  assert.equal(requests.length, 0);
  assert.equal(profileReads.length, 0);
});
test('explicit consent persists; real runtime metadata, daily limit, field minimization and revoke', async (t) => {
  const { service, requests, profileReads, dataDir, advance } = await fixture(t);
  assert.equal((await service.status()).enabled, false);
  await service.report(receipt);
  assert.equal(requests.length, 0);
  await assert.rejects(service.grant({ ...receipt, confirmed: false }), /明确同意/);
  await service.grant(receipt);
  await waitFor(async () => {
    const status = await service.status();
    if (status.lastResult?.reason === 'unavailable')
      throw new Error(
        JSON.stringify({
          status,
          requests: requests.map((r) => ({ url: r.url, method: r.method })),
          profileReads,
        }),
      );
    return !!status.lastSentAt && !status.reporting;
  });
  const event = requests.find((r) => r.url.endsWith('/api/events')).body;
  assert.equal(event.harnessVersion, '0.2.1-rc.5');
  assert.equal(event.locale, 'zh-CN');
  assert.deepEqual(event.account, {
    issuer: 'deepseek-platform',
    id: 'RAW-PRIVATE-ACCOUNT-ID',
    name: '测试昵称',
  });
  assert.equal(profileReads[1].version, '0.2.1-rc.5');
  const persisted = await readFile(join(dataDir, 'telemetry.json'), 'utf8');
  assert.doesNotMatch(persisted, /RAW-PRIVATE|测试昵称|NEVER-STORE-CONTACT/);
  assert.equal((await service.report(receipt)).reason, 'daily-limit');
  advance();
  assert.equal((await service.report(receipt)).sent, true);
  const stopped = await service.withdraw();
  assert.equal(stopped.enabled, false);
  assert.equal(stopped.withdrawalPending, false);
  assert.equal(stopped.lastResult.remoteDeleted, true);
  assert.equal(requests.at(-1).method, 'DELETE');
  const count = requests.length;
  await service.report(receipt);
  assert.equal(requests.length, count);
  assert.doesNotMatch(
    await readFile(join(dataDir, 'telemetry.json'), 'utf8'),
    /installation-deletion-secret/,
  );
});
test('withdrawal racing registration retains credential, deletes registration, and sends no identity', async (t) => {
  let releaseRegistration, entered;
  const gate = new Promise((resolve) => {
    entered = resolve;
  });
  const registration = new Promise((resolve) => {
    releaseRegistration = resolve;
  });
  const calls = [];
  const { service } = await fixture(t, {
    fetchImpl: async (url, init) => {
      calls.push({ url, method: init.method });
      if (url.endsWith('/api/registrations')) {
        entered();
        await registration;
        return json({ credential: 'late-deletion-credential' });
      }
      return json({ accepted: true });
    },
  });
  await service.grant(receipt);
  await gate;
  const stopped = service.withdraw();
  releaseRegistration();
  const result = await stopped;
  assert.equal(result.enabled, false);
  assert.equal(result.lastResult.remoteDeleted, true);
  assert.equal(
    calls.some((r) => r.url.endsWith('/api/events')),
    false,
  );
  assert.equal(calls.at(-1).method, 'DELETE');
});
test('failed deletion stops reporting, retains deletion credential, and supports retry', async (t) => {
  let failures = 1;
  const { service, requests, dataDir } = await fixture(t, {
    fetchImpl: async (url, init) => {
      if (init.method === 'DELETE' && failures-- > 0) return json({}, 503);
      return json(url.endsWith('/api/registrations') ? { credential: 'keep-until-delete' } : {});
    },
  });
  await service.grant(receipt);
  await waitFor(async () => {
    const current = await service.status();
    if (current.lastResult?.reason === 'unavailable') throw new Error(JSON.stringify(current));
    return !!current.lastSentAt;
  });
  const pending = await service.withdraw();
  assert.equal(pending.enabled, false);
  assert.equal(pending.withdrawalPending, true);
  assert.match(await readFile(join(dataDir, 'telemetry.json'), 'utf8'), /keep-until-delete/);
  const count = requests.length;
  await service.report(receipt);
  assert.equal(requests.length, count);
  const done = await service.withdraw();
  assert.equal(done.withdrawalPending, false);
  assert.equal(done.lastResult.remoteDeleted, true);
});
test('collector changes require fresh authorization and delete from the previous collector', async (t) => {
  const { service, dataDir, requests, fetchImpl } = await fixture(t);
  await service.grant(receipt);
  await waitFor(async () => {
    const current = await service.status();
    if (current.lastResult?.reason === 'unavailable') throw new Error(JSON.stringify(current));
    return !!current.lastSentAt;
  });
  service.dispose();
  const changed = createTelemetryService({
    dataDir,
    pluginVersion: '1.3.4',
    endpoint: 'https://changed.example.invalid',
    fetchImpl,
  });
  t.after(() => changed.dispose());
  assert.equal((await changed.status()).enabled, false);
  assert.equal((await changed.status()).authorizationRequired, true);
  await changed.report(receipt);
  assert.equal(
    requests.some((r) => r.url.startsWith('https://changed.')),
    false,
  );
  await assert.rejects(changed.grant(receipt), /服务已变更/);
  await changed.withdraw();
  assert.equal(requests.at(-1).url.startsWith('https://collector.example.invalid/'), true);
});
test('corrupted consent state fails closed', async (t) => {
  const { service, dataDir, requests } = await fixture(t);
  await writeFile(join(dataDir, 'telemetry.json'), 'not json');
  await assert.rejects(service.report(receipt));
  assert.equal(requests.length, 0);
});

test('transient network failure retries registration; daily check preserves the successful result', async (t) => {
  let attempts = 0;
  const { service, requests } = await fixture(t, {
    fetchImpl: async (url) => {
      if (url.endsWith('/api/registrations') && attempts++ === 0)
        throw Object.assign(new TypeError('private-network-detail'), {
          cause: { code: 'ECONNRESET' },
        });
      return json(url.endsWith('/api/registrations') ? { credential: 'retry-secret' } : {});
    },
  });
  await service.grant(receipt);
  await waitFor(async () => (await service.status()).lastResult?.sent);
  assert.equal(attempts, 2);
  const registrations = requests.filter((r) => r.url.endsWith('/api/registrations'));
  assert.equal(registrations[0].body.installationId, registrations[1].body.installationId);
  await service.report(receipt);
  assert.equal((await service.status()).lastResult.sent, true);
});

test('failure is visible and explicit retry works without revoking consent', async (t) => {
  let offline = true;
  const { service } = await fixture(t, {
    fetchImpl: async (url) => {
      if (offline)
        throw Object.assign(new TypeError('DO-NOT-EXPOSE-PRIVATE-DETAIL'), {
          cause: { code: 'ENOTFOUND' },
        });
      return json(url.endsWith('/api/registrations') ? { credential: 'retry-secret' } : {});
    },
  });
  assert.equal((await service.retry(receipt)).enabled, false);
  await service.grant(receipt);
  await waitFor(async () => (await service.status()).lastResult?.reason === 'unavailable');
  const failed = await service.status();
  assert.equal(failed.lastResult.stage, 'registration');
  assert.equal(failed.lastResult.failureCode, 'ENOTFOUND');
  assert.doesNotMatch(JSON.stringify(failed), /DO-NOT-EXPOSE|retry-secret/);
  offline = false;
  assert.equal((await service.retry(receipt)).reporting, true);
  await waitFor(async () => (await service.status()).lastResult?.sent);
  assert.equal((await service.status()).consentAt, failed.consentAt);
});

test('a newly available account can identify an anonymous installation during the daily limit', async (t) => {
  const { service, ctx, requests } = await fixture(t);
  const account = ctx.deepseekAccount;
  ctx.deepseekAccount = null;
  await service.grant(receipt);
  await waitFor(async () => (await service.status()).lastResult?.sent);
  assert.equal((await service.status()).lastResult.accountIdentified, false);
  const count = requests.length;
  assert.equal((await service.report(receipt)).reason, 'daily-limit');
  assert.equal(requests.length, count);
  ctx.deepseekAccount = account;
  assert.equal((await service.report(receipt)).accountIdentified, true);
  assert.equal(requests.at(-1).body.account.name, '测试昵称');
  assert.equal((await service.report(receipt)).reason, 'daily-limit');
});

test('a conflicting registration is not retried and reports the safe HTTP status', async (t) => {
  const { service, requests } = await fixture(t, { fetchImpl: async () => json({}, 409) });
  await service.grant(receipt);
  await waitFor(async () => (await service.status()).lastResult?.reason === 'unavailable');
  assert.equal(requests.length, 1);
  assert.equal((await service.status()).lastResult.httpStatus, 409);
});
