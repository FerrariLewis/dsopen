#!/usr/bin/env node
/** Generate a DSH format-1 Git index from an immutable package commit. No npm dependencies. */
import { readFile, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const HELP = `生成 Harness「发现」索引（Node.js 20+，无需 npm install）

  node scripts/generate-index.mjs
  node scripts/generate-index.mjs --repo FerrariLewis/open --commit <40位SHA> --time <ISO时间>

--repo    GitHub 的 owner/repo；默认读取 package.json.repository
--commit  完整的 40 位提交 SHA；默认读取 git HEAD
--time    此提交的 ISO 日期时间；默认读取 git show 的提交时间
--out     输出文件；默认项目根目录 plugin-index.json
--help    显示此说明

脚本读取该提交中的 package.json，核对包名、版本和 DSH 兼容范围。
本地 Git 有该提交就直接读取；否则从 GitHub raw 读取，需要联网。
生成之后把 plugin-index.json 再提交到同一 GitHub 仓库。
`;

function git(args, root = ROOT) {
  try {
    return execFileSync('git', args, {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    }).trim();
  } catch {
    return null;
  }
}

function repoFromManifest(manifest) {
  const value =
    typeof manifest.repository === 'string' ? manifest.repository : manifest.repository?.url;
  return value?.match(/github\.com[/:]([^/]+\/[^/#]+?)(?:\.git)?(?:#.*)?$/i)?.[1];
}

function options(argv) {
  const result = {};
  for (let i = 0; i < argv.length; i++) {
    const key = argv[i];
    if (key === '--help' || key === '-h') {
      result.help = true;
      continue;
    }
    if (!['--repo', '--commit', '--time', '--out'].includes(key))
      throw new Error(`未知参数：${key}`);
    const value = argv[++i];
    if (!value || value.startsWith('--')) throw new Error(`${key} 缺少值。`);
    result[key.slice(2)] = value;
  }
  return result;
}

export function buildIndex({ manifest, repo, commit, publishTimestamp }) {
  if (
    !/^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})\/[A-Za-z0-9_.-]+$/.test(repo ?? '') ||
    /\/\.{1,2}$/.test(repo)
  )
    throw new Error('repo 必须是 GitHub 的 owner/repo，不能包含 URL、分支或目录。');
  if (!/^[a-f0-9]{40}$/.test(commit ?? ''))
    throw new Error('commit 必须是完整的 40 位小写提交 SHA。');
  if (!Number.isSafeInteger(publishTimestamp) || publishTimestamp < 0 || publishTimestamp >= 1e11)
    throw new Error('提交时间无效。');
  if (
    typeof manifest.name !== 'string' ||
    !manifest.name.trim() ||
    !/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/.test(manifest.version ?? '')
  )
    throw new Error('package.json 的包名或版本无效。');
  if (typeof manifest.dsh?.bundle?.patch !== 'string' || !manifest.dsh.bundle.patch.trim())
    throw new Error('package.json 必须声明 dsh.bundle.patch。');
  const range = manifest.dsh?.engines?.dsh;
  if (typeof range !== 'string' || !range.trim())
    throw new Error('package.json 必须声明 dsh.engines.dsh。');
  const url = `https://github.com/${repo}`;
  return {
    format: 1,
    title: { en: 'DSH LEWIS ENCHANTMENT', zh: '附魔台 · 开机动画' },
    description: {
      en: 'Startup animation releases for DeepSeek Harness.',
      zh: '附魔台开机动画的发布索引。',
    },
    metadata: { categories: { ui: { title: { en: 'Appearance', zh: '界面外观' } } } },
    plugins: [
      {
        name: manifest.name,
        title: { en: 'DSH LEWIS ENCHANTMENT', zh: '附魔台 · 开机动画' },
        description: {
          en: 'Full-length cinematic intros, press-any-key title covers, personal media and in-place updates.',
          zh: manifest.description,
        },
        author:
          typeof manifest.author === 'string'
            ? manifest.author
            : (manifest.author?.name ?? repo.split('/')[0]),
        homepage: `${url}#readme`,
        repository: { url },
        metadata: {
          category: 'ui',
          keywords: [
            ...new Set([...(manifest.keywords ?? []), '开机动画', '附魔台', 'startup', 'video']),
          ],
        },
        'dist-tags': { latest: manifest.version },
        versions: [
          {
            version: manifest.version,
            publishTimestamp,
            source: { type: 'git', url, commit },
            engines: { dsh: range },
          },
        ],
      },
    ],
  };
}

async function remoteManifest(repo, commit) {
  const response = await fetch(`https://raw.githubusercontent.com/${repo}/${commit}/package.json`, {
    signal: AbortSignal.timeout(20000),
    redirect: 'error',
  });
  if (!response.ok)
    throw new Error(
      `无法读取 GitHub 上该提交的 package.json（HTTP ${response.status}）。先上传源码，或在含该提交的 Git 目录运行。`,
    );
  return response.json();
}

export async function main(argv = process.argv.slice(2)) {
  const args = options(argv);
  if (args.help) {
    console.log(HELP);
    return;
  }
  const current = JSON.parse(await readFile(resolve(ROOT, 'package.json'), 'utf8'));
  const repo = args.repo ?? repoFromManifest(current);
  const commit = args.commit ?? git(['rev-parse', 'HEAD']);
  const isoTime = args.time ?? (commit && git(['show', '-s', '--format=%cI', commit]));
  if (!commit || !isoTime)
    throw new Error(
      '当前没有可读取的 Git 提交。先 git commit，或用 --commit <40位SHA> --time <带时区的ISO时间>。',
    );
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(isoTime))
    throw new Error('--time 请使用带时区的 ISO 时间，例如 2026-10-24T12:00:00+08:00。');
  // Validate before using a repository or SHA in either a URL or a Git argument.
  const index = buildIndex({
    manifest: current,
    repo,
    commit,
    publishTimestamp: Math.floor(Date.parse(isoTime) / 1000),
  });
  const localText = git(['show', `${commit}:package.json`]);
  const pinned = localText ? JSON.parse(localText) : await remoteManifest(repo, commit);
  for (const [label, a, b] of [
    ['包名', current.name, pinned.name],
    ['版本', current.version, pinned.version],
    ['DSH 兼容范围', current.dsh?.engines?.dsh, pinned.dsh?.engines?.dsh],
    ['bundle patch', current.dsh?.bundle?.patch, pinned.dsh?.bundle?.patch],
  ])
    if (a !== b) throw new Error(`${label}与该提交不一致。先提交当前源码，再为新提交生成索引。`);
  const output = resolve(ROOT, args.out ?? 'plugin-index.json');
  await writeFile(output, `${JSON.stringify(index, null, 2)}\n`, 'utf8');
  console.log(
    `已生成 ${output}\n固定源码：${repo}@${commit}\n包：${current.name}@${current.version}\n在 Harness → 插件 → 发现 → 索引源，添加：\nhttps://raw.githubusercontent.com/${repo}/main/plugin-index.json\n\n请把索引再提交到 GitHub；源码提交也必须推送。仓库默认分支若不是 main，请改用实际分支名。`,
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch((error) => {
    console.error(`生成失败：${error.message}`);
    process.exitCode = 1;
  });
}
