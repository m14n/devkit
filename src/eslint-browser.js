import globals from 'globals';

export default [
  {
    files: ['**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}'],
    languageOptions: {
      globals: globals.browser,
    },
  },
];
