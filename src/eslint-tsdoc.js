import tsdocPlugin from 'eslint-plugin-tsdoc';

export default [
  {
    files: ['**/*.{ts,mts,cts,tsx}'],
    plugins: {
      tsdoc: tsdocPlugin,
    },
    rules: {
      'tsdoc/syntax': 'error',
    },
  },
];
