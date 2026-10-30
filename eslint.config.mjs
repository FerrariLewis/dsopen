import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';

// JSX references are not ordinary Identifier nodes. Mark only component roots
// and the classic JSX factory, so real unused imports still fail recommended rules.
const jsxReferences = {
  rules: {
    references: {
      create(context) {
        const use = (name, node) => context.sourceCode.markVariableAsUsed(name, node);
        return {
          JSXElement(node) {
            use('React', node);
          },
          JSXFragment(node) {
            use('React', node);
          },
          JSXOpeningElement(node) {
            let name = node.name;
            const member = name.type === 'JSXMemberExpression';
            while (name.type === 'JSXMemberExpression') name = name.object;
            if (name.type === 'JSXIdentifier' && (member || !/^[a-z]|-/.test(name.name)))
              use(name.name, node);
          },
        };
      },
    },
  },
};
const server = ['src/host.js', 'src/updates.js', 'src/update-cache.js'];
const shared = ['src/constants.js', 'src/version.js', 'src/release-notes.js'];

export default [
  { ignores: ['node_modules/**', 'lib/**', 'assets/**', 'npm-entry/**', 'release-assets/**'] },
  {
    files: ['src/**/*.{js,jsx}', 'scripts/**/*.mjs', 'tests/**/*.mjs', 'eslint.config.mjs'],
    languageOptions: { ecmaVersion: 'latest', sourceType: 'module' },
    rules: { ...js.configs.recommended.rules },
  },
  {
    files: [...server, 'scripts/**/*.mjs', 'tests/**/*.mjs', 'eslint.config.mjs'],
    languageOptions: { globals: globals.node },
  },
  {
    files: ['src/**/*.{js,jsx}'],
    ignores: [...server, ...shared],
    languageOptions: {
      globals: { ...globals.browser, __DSH_LEWIS_VERSION__: 'readonly' },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { 'react-hooks': reactHooks, jsx: jsxReferences },
    rules: {
      'jsx/references': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
    },
  },
];
