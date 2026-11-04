import jsxA11y from 'eslint-plugin-jsx-a11y';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

const JSX_FILES = ['**/*.{jsx,tsx}'];
// Custom hooks often live in plain .js/.ts files, so the hooks rules cover those too.
const ALL_FILES = ['**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}'];

export default [
  { ...react.configs.flat.recommended, files: JSX_FILES },
  { ...react.configs.flat['jsx-runtime'], files: JSX_FILES },
  { ...jsxA11y.flatConfigs.recommended, files: JSX_FILES },
  { ...reactHooks.configs.flat.recommended, files: ALL_FILES },
  {
    files: JSX_FILES,
    settings: {
      react: { version: 'detect' },
    },
  },
  {
    // TypeScript already checks props.
    files: ['**/*.tsx'],
    rules: {
      'react/prop-types': 'off',
    },
  },
];
