import globals from 'globals';
import importPlugin from 'eslint-plugin-import';
import js from '@eslint/js';
import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  {
    files: ['**/*.ts'],
    plugins: {
      '@typescript-eslint': ts,
      import: importPlugin,
    },
    languageOptions: {
      globals: { ...globals.node },
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        project: './tsconfig.json',
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      ...ts.configs['recommended-requiring-type-checking'].rules,
      ...ts.configs['stylistic-type-checked'].rules,
      '@typescript-eslint/experimental-decorators': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/no-empty-function': 'off',
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
      'no-redeclare': 'off',
      'no-unused-vars': 'off',
      'padded-blocks': ['error', 'never'],
      quotes: [
        'error',
        'single',
        {
          avoidEscape: true,
        },
      ],
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
    files: ['**/*.spec.ts'],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },
];
