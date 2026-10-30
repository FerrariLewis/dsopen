import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';
import { ESLint } from 'eslint';
import { serverRuntimeFiles, runtimeOutputPath } from '../scripts/server-runtime.mjs';

const root = dirname(dirname(fileURLToPath(import.meta.url)));

test('server graph includes side-effect imports, re-exports and lazy imports, excluding browser-only source', async (t) => {
  const directory = await mkdtemp(join(tmpdir(), 'lewis-server-graph-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  await mkdir(join(directory, 'nested'));
  const files = {
    'host.js': `import './boot.js'; export { value } from './nested/export.js';
      export const later = () => import('./nested/lazy.js');`,
    'boot.js': `import './nested/side-effect.js';`,
    'nested/export.js': `import { basename } from 'node:path'; export const value = basename('/a/b');`,
    'nested/lazy.js': `export * from './leaf.js';`,
    'nested/leaf.js': 'export const done = true;',
    'nested/side-effect.js': 'globalThis.started = true;',
    'unused-browser.js': 'document.body.dataset.unused = true;',
  };
  for (const [name, text] of Object.entries(files)) await writeFile(join(directory, name), text);
  assert.deepEqual(
    await serverRuntimeFiles(directory),
    Object.keys(files)
      .filter((name) => name !== 'unused-browser.js')
      .sort(),
  );
  assert.equal(runtimeOutputPath('host.js'), 'index.js');
  await rm(join(directory, 'nested/leaf.js'));
  await assert.rejects(serverRuntimeFiles(directory), /leaf\.js/);
});

test('standalone graph rejects unresolved computed imports, runtime packages and imports outside source', async (t) => {
  const directory = await mkdtemp(join(tmpdir(), 'lewis-server-invalid-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  for (const source of [
    'export const later = (path) => import(path);',
    'export const later = (path) => import(`./${path}.js`);',
    'import something from "runtime-dependency"; export { something };',
    'export * from "../outside.js";',
    'export const later = () => import("./missing.js").catch(() => null);',
    'export const later = (path) => require(path);',
  ]) {
    await writeFile(join(directory, 'host.js'), source);
    await assert.rejects(serverRuntimeFiles(directory));
  }
});

test('publishing depends on same-commit Windows and Linux checks without shared cancellation locks', async () => {
  const checks = parse(await readFile(join(root, '.github/workflows/check.yml'), 'utf8'));
  const publish = parse(await readFile(join(root, '.github/workflows/publish.yml'), 'utf8'));
  assert.ok(Object.hasOwn(checks.on, 'workflow_call'));
  assert.deepEqual(checks.jobs.check.strategy.matrix.os, ['ubuntu-latest', 'windows-latest']);
  assert.equal(checks.jobs.check['continue-on-error'], undefined);
  assert.equal(checks.concurrency, undefined);
  assert.equal(checks.jobs.check.concurrency, undefined);
  assert.equal(publish.jobs.check.uses, './.github/workflows/check.yml');
  assert.deepEqual(publish.jobs.check.permissions, { contents: 'read' });
  assert.equal(publish.jobs.publish.needs, 'check');
  assert.equal(publish.jobs.publish.if, undefined);
  assert.ok(Object.hasOwn(publish.on, 'workflow_dispatch'));
  for (const branch of publish.on.push.branches)
    assert.ok(checks.on.push['branches-ignore'].includes(branch));
  for (const path of [
    'src/**',
    'scripts/**',
    'tests/**',
    'pnpm-workspace.yaml',
    '.github/workflows/check.yml',
  ])
    assert.ok(publish.on.push.paths.includes(path));
  assert.equal(publish.permissions.contents, 'write');
  assert.equal(publish.concurrency['cancel-in-progress'], false);
});

test('recommended lint understands JSX bindings, fragments and lexical shadows without hiding unused variables', async () => {
  const eslint = new ESLint({ cwd: root });
  const source = `import React from 'react';
    const unused = 1;
    const Shared = () => null;
    const UI = { Item: () => null };
    export function View() {
      const Shared = () => null;
      const UI = { Item: () => null };
      return <><Shared /><UI.Item /><div /></>;
    }`;
  const [result] = await eslint.lintText(source, { filePath: 'src/lint-fixture.jsx' });
  const unused = result.messages.filter((message) => message.ruleId === 'no-unused-vars');
  assert.equal(unused.length, 3);
  for (const name of ['unused', 'Shared', 'UI'])
    assert.equal(unused.filter((message) => message.message.includes(`'${name}'`)).length, 1);
  assert.equal(result.messages.filter((message) => message.ruleId !== 'no-unused-vars').length, 0);
});

test('lint separates browser, Node and environment-neutral shared modules', async () => {
  const eslint = new ESLint({ cwd: root });
  const check = async (source, filePath) =>
    (await eslint.lintText(source, { filePath }))[0].messages;
  assert.equal((await check('window.alert(document.title);', 'src/lint-fixture.js')).length, 0);
  assert.equal(
    (await check('process.stdout.write(Buffer.from("ok"));', 'scripts/lint-fixture.mjs')).length,
    0,
  );
  assert.equal(
    (await check('export const root = window;', 'src/constants.js')).filter(
      (message) => message.ruleId === 'no-undef',
    ).length,
    1,
  );
  assert.equal(
    (await check('process.exitCode = 1;', 'src/lint-fixture.js')).filter(
      (message) => message.ruleId === 'no-undef',
    ).length,
    1,
  );
  assert.equal(
    (await check('window.alert("no");', 'src/host.js')).filter(
      (message) => message.ruleId === 'no-undef',
    ).length,
    1,
  );
});
