import eslintReact from '@eslint-react/eslint-plugin';
import jsxA11y from 'eslint-plugin-jsx-a11y-x';
import reactHooks from 'eslint-plugin-react-hooks';

const JSX_FILES = ['**/*.{jsx,tsx}'];
// Custom hooks often live in plain .js/.ts files, so the hooks rules cover those too.
const ALL_FILES = ['**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}'];

/**
 * Registers the jsx-a11y-x fork under the `jsx-a11y` name, so rule names and
 * `eslint-disable` comments stay `jsx-a11y/*`.
 */
const a11yRecommended = {
  plugins: { 'jsx-a11y': jsxA11y },
  rules: Object.fromEntries(
    Object.entries(jsxA11y.configs.recommended.rules).map(([name, level]) => [
      name.replace(/^jsx-a11y-x\//, 'jsx-a11y/'),
      level,
    ]),
  ),
};

export default [
  { ...eslintReact.configs.recommended, files: JSX_FILES },
  { ...a11yRecommended, files: JSX_FILES },
  { ...reactHooks.configs.flat.recommended, files: ALL_FILES },
  {
    // eslint-plugin-react-hooks covers these, including the React Compiler rules.
    files: JSX_FILES,
    rules: {
      '@eslint-react/exhaustive-deps': 'off',
      '@eslint-react/purity': 'off',
      '@eslint-react/rules-of-hooks': 'off',
      '@eslint-react/set-state-in-effect': 'off',
    },
  },
];
