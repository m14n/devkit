import js from '@eslint/js';
import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import-x';

const JS_FILES = ['**/*.{js,mjs,cjs,jsx}'];
const TS_FILES = ['**/*.{ts,mts,cts,tsx}'];
const TS_TEST_FILES = ['**/*.{test,spec}.{ts,mts,cts,tsx}'];

export default [
  {
    ignores: ['**/dist/**', '**/coverage/**'],
  },

  // JavaScript + TypeScript
  {
    files: [...JS_FILES, ...TS_FILES],
    plugins: {
      import: importPlugin,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      ...js.configs.recommended.rules,
      'import/order': [
        'error',
        {
          groups: [
            'builtin', // Node.js built-ins
            'external', // External modules (npm packages)
            'internal', // Internal modules (e.g., aliases or paths like `@m14n/...`)
            ['parent', 'sibling'], // Parent and sibling modules
            'index', // Index files (e.g., `./index`)
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          alphabetize: {
            order: 'asc', // Sort alphabetically
            caseInsensitive: false, // Uppercase imports first
          },
          distinctGroup: true, // Separate groups with newlines
          'newlines-between': 'always',
        },
      ],
      'no-console': 'warn',
      'sort-imports': [
        'error',
        {
          ignoreCase: false,
          ignoreDeclarationSort: true,
          ignoreMemberSort: false,
          memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
        },
      ],
    },
  },
  {
    files: ['**/*.cjs'],
    languageOptions: {
      sourceType: 'commonjs',
    },
  },

  // TypeScript (type-checked)
  {
    files: TS_FILES,
    plugins: {
      '@typescript-eslint': ts,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        // Finds the nearest tsconfig.json for each file; works in monorepos.
        projectService: true,
      },
    },
    rules: {
      // Turns off core rules that TypeScript already covers (e.g. `no-undef`, `no-redeclare`).
      ...ts.configs['eslint-recommended'].overrides[0].rules,
      ...ts.configs['recommended-type-checked'].rules,
      ...ts.configs['stylistic-type-checked'].rules,
      '@typescript-eslint/array-type': ['error', { default: 'generic' }],
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-empty-object-type': ['error', { allowInterfaces: 'always' }],
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/no-redeclare': ['error', { ignoreDeclarationMerge: true }],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/triple-slash-reference': 'off',
      'no-redeclare': 'off',
      'no-unused-vars': 'off',
    },
  },
  {
    files: TS_TEST_FILES,
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },

  // Must stay last: turns off every rule that conflicts with Prettier.
  prettier,
];
