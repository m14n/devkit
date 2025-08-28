import globals from 'globals';

export default [
  {
    files: ['**/*.{ts,js}'],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
];
