const config = {
  // Fix markdown in-place
  '*.md': ['markdownlint --fix'],

  // Auto-fix + fail on remaining issues
  '*.{js,ts,tsx}': ['prettier --write', 'eslint --fix --max-warnings=0'],

  // Fix json + yaml in-place
  '*.json': ['prettier --write'],
  '*.{yml,yaml}': ['prettier --write'],
};

export default config;
