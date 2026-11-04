const config = {
  // Fix markdown in-place
  '*.md': ['markdownlint --fix'],

  // Auto-fix + fail on remaining issues. `--no-warn-ignored` keeps staged files that ESLint
  // ignores (e.g. generated code) from counting as warnings.
  '*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}': [
    'prettier --write',
    'eslint --fix --max-warnings=0 --no-warn-ignored',
  ],

  // Fix json + yaml in-place
  '*.{json,yml,yaml}': ['prettier --write'],
};

export default config;
