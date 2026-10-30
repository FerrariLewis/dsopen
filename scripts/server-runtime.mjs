/** Discover the complete standalone Node ESM graph without changing its source. */
import { build } from 'esbuild';
import { parse } from 'acorn';
import { readFile } from 'node:fs/promises';
import { isBuiltin } from 'node:module';
import { dirname, extname, isAbsolute, relative, resolve } from 'node:path';

export async function serverRuntimeFiles(directory, entry = 'host.js') {
  const base = resolve(directory);
  const result = await build({
    absWorkingDir: base,
    entryPoints: [resolve(base, entry)],
    bundle: true,
    write: false,
    metafile: true,
    format: 'esm',
    platform: 'node',
    target: 'node20',
    treeShaking: false,
    ignoreAnnotations: true,
    logLevel: 'silent',
    logOverride: {
      'unsupported-dynamic-import': 'error',
      'unsupported-require-call': 'error',
      'ignored-dynamic-import': 'error',
      'require-resolve-not-external': 'error',
    },
    plugins: [
      {
        name: 'standalone-node-esm',
        setup(builder) {
          builder.onLoad({ filter: /\.js$/ }, async (args) => {
            const contents = await readFile(args.path, 'utf8');
            const pending = [parse(contents, { ecmaVersion: 'latest', sourceType: 'module' })];
            while (pending.length) {
              const node = pending.pop();
              if (
                node.type === 'ImportExpression' &&
                !(node.source.type === 'Literal' && typeof node.source.value === 'string')
              )
                throw new Error('Runtime dynamic imports must use literal module paths.');
              for (const value of Object.values(node)) {
                if (Array.isArray(value)) pending.push(...value.filter((child) => child?.type));
                else if (value?.type) pending.push(value);
              }
            }
            return { contents, loader: 'js' };
          });
          builder.onResolve({ filter: /.*/ }, (args) => {
            if (args.kind === 'entry-point') return;
            if (!['import-statement', 'dynamic-import'].includes(args.kind))
              throw new Error(`Runtime dependencies must use explicit ESM imports: ${args.path}`);
            if (isBuiltin(args.path)) return { path: args.path, external: true };
            if (!args.path.startsWith('./') && !args.path.startsWith('../'))
              throw new Error(`Runtime cannot depend on external packages: ${args.path}`);
            const path = resolve(dirname(args.importer), args.path);
            const name = relative(base, path);
            if (
              isAbsolute(name) ||
              name === '..' ||
              name.startsWith('../') ||
              name.startsWith('..\\') ||
              !['.js', '.json'].includes(extname(path))
            )
              throw new Error(
                `Runtime dependency must stay within its ESM directory: ${args.path}`,
              );
            return { path };
          });
        },
      },
    ],
  });
  return Object.keys(result.metafile.inputs)
    .map((path) => relative(base, resolve(base, path)).replaceAll('\\', '/'))
    .sort();
}

export function runtimeOutputPath(source) {
  return source === 'host.js' ? 'index.js' : source;
}
