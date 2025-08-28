import tsdocPlugin from 'eslint-plugin-tsdoc';

export default [
  {
    files: ['**/*.ts'],
    plugins: {
      tsdoc: tsdocPlugin,
    },
    rules: {
      'tsdoc/syntax': 'error',
    },
  },
];
