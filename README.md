# @m14n/devkit

Shared developer toolkit with ESLint, Prettier, Commitlint, TypeScript, lint-staged and semantic-release configs for
consistent project setup.

## Installation

```sh
npm i -D @m14n/devkit
```

## Quick Reference

| Tool             | Config path                     | Example usage                                                                   |
| ---------------- | ------------------------------- | ------------------------------------------------------------------------------- |
| Commitlint       | `@m14n/devkit/commitlint`       | `extends: ['@m14n/devkit/commitlint']` in `commitlint.config.js`                |
| ESLint Base      | `@m14n/devkit/eslint-base`      | `import node from '@m14n/devkit/eslint-base'` in `eslint.config.js`.            |
| ESLint Browser   | `@m14n/devkit/eslint-browser`   | `import browser from '@m14n/devkit/eslint-browser'` in `eslint.config.js`.      |
| ESLint Node      | `@m14n/devkit/eslint-node`      | `import node from '@m14n/devkit/eslint-node'`                                   |
| ESLint React     | `@m14n/devkit/eslint-react`     | `import react from '@m14n/devkit/eslint-react'`                                 |
| ESLint TSDoc     | `@m14n/devkit/eslint-tsdoc`     | `import tsdoc from '@m14n/devkit/eslint-tsdoc'`                                 |
| ESLint Test      | `@m14n/devkit/eslint-vitest`    | `import test from '@m14n/devkit/eslint-vitest'`                                 |
| Prettier         | `@m14n/devkit/prettier`         | `"prettier": "@m14n/devkit/prettier"` in `package.json`                         |
| TypeScript       | `@m14n/devkit/tsconfig.*.json`  | `"extends": "@m14n/devkit/tsconfig.node.json"` in `tsconfig.json`               |
| lint-staged      | `@m14n/devkit/lint-staged`      | `export { default } from '@m14n/devkit/lint-staged'` in `lint-staged.config.js` |
| semantic-release | `@m14n/devkit/semantic-release` | `"extends": "@m14n/devkit/semantic-release"` in `.releaserc.json`.              |

## Usage

### ESLint

Pick the presets you need and compose them in your eslint.config.js (Flat Config, ESLint v9+).

```js
// eslint.config.js
import base from '@m14n/devkit/eslint-base';
import node from '@m14n/devkit/eslint-node';
// If using Browser:
// import browser from '@m14n/devkit/eslint-browser';
// If using React:
// import react from '@m14n/devkit/eslint-react';
// If using Vitest:
// import vitest from '@m14n/devkit/eslint-vitest';

export default [
  ...base,
  ...node,
  // ...browser,
  // ...react,
  // ...vitest
];
```

#### Available ESLint presets

| Subpath                       | Purpose                          | Requires            |
| ----------------------------- | -------------------------------- | ------------------- |
| `@m14n/devkit/eslint-base`    | Base TypeScript + import + tsdoc | core peers only.    |
| `@m14n/devkit/eslint-browser` | Browser globals / rules.         | none (just globals) |
| `@m14n/devkit/eslint-node`    | Node globals / rules             | none (just globals) |
| `@m14n/devkit/eslint-react`   | React, Hooks, a11y               | React plugins (opt) |
| `@m14n/devkit/eslint-tsdoc`   | Vitest globals                   | tsdoc plugins (opt) |
| `@m14n/devkit/eslint-vitest`  | Vitest globals                   | none (just globals) |

### Prettier

Reference in your `package.json`:

```json
{
  "prettier": "@m14n/devkit/prettier"
}
```

### TypeScript

Pick the preset that matches your project:

| Preset                                  | Use for                               |
| --------------------------------------- | ------------------------------------- |
| `@m14n/devkit/tsconfig.base.json`       | Base defaults, no runtime assumptions |
| `@m14n/devkit/tsconfig.browser.json`    | Browser libraries (no JSX)            |
| `@m14n/devkit/tsconfig.decorators.json` | Decorators.                           |
| `@m14n/devkit/tsconfig.node.json`       | Node (18+) libraries or CLIs          |
| `@m14n/devkit/tsconfig.react.json`      | React libraries (with JSX)            |
| `@m14n/devkit/tsconfig.strict.json`     | Add stricter typing checks            |

Example (`tsconfig.json`):

```json
{
  "extends": "@m14n/devkit/tsconfig.node.json",
  "compilerOptions": {
    "typeRoots": ["node_modules/@types", "src/@types"]
  },
  "exclude": ["dist", "node_modules"],
  "include": ["./src/**/*.ts"]
}
```

### Commitlint

Add a `commitlint.config.cjs` (or .js):

```js
module.exports = {
  extends: ['@m14n/devkit/commitlint'],
};
```

### lint-staged (optional, recommended)

Use the provided lint-staged config to run Prettier, ESLint, and Markdownlint on staged files.

Create a `.lintstagedrc.js` in your project root:

```js
// .lintstagedrc.js
export { default } from '@m14n/devkit/lint-staged';
```

### semantic-release (optional, recommended)

Use the shared config in your `.releaserc.json`:

```json
{
  "extends": "@m14n/devkit/semantic-release"
}
```

## What to install?

Install only what you actually use. Copy the block(s) that match your project.

### Core (ESLint base + Prettier + TypeScript)

```sh
npm i -D @eslint/js \
  @typescript-eslint/parser \
  @typescript-eslint/eslint-plugin \
  eslint \
  eslint-config-prettier \
  eslint-plugin-import \
  prettier typescript
```

### ESLint Node preset

```sh
npm i -D globals
```

### ESLint React preset

```sh
npm i -D eslint-plugin-jsx-a11y \
  eslint-plugin-react \
  eslint-plugin-react-hooks
```

### ESLint Test (Vitest) preset

```sh
npm i -D @vitest/coverage-v8 \
  vitest

# In tests, either import from 'vitest' or add `"types": ["node", "vitest"]` in `tsconfig.test.json`.
```

### Prettier

```sh
npm i -D prettier
```

### Commitlint preset

```sh
npm i -D @commitlint/config-conventional \
  commitlint
```

### lint-staged (optional, recommended)

```sh
npm i -D lint-staged \
  markdownlint-cli
```

### semantic-release (optional)

```sh
npm i -D semantic-release \
  @semantic-release/changelog \
  @semantic-release/commit-analyzer \
  @semantic-release/git \
  @semantic-release/github \
  @semantic-release/npm \
  @semantic-release/release-notes-generator
```

## Git hooks (Husky)

To keep code quality checks consistent, we recommend using [Husky](https://typicode.github.io/husky/)
to run **Commitlint**, **lint-staged**, and a final check before pushing.

Initialize Husky once in your repo:

```sh
npx husky init
```

This will create a `.husky/` folder. Then add hooks:

```sh
npx husky add .husky/commit-msg "npx commitlint --edit \$1"
npx husky add .husky/pre-commit "npx lint-staged"
npx husky add .husky/pre-push "npm run check"
```

(Optional) Commit the `.husky/` folder so your team shares the same hooks:

```sh
git add .husky
git commit -m "chore: set up husky hooks"
```

From now on:

- `commit-msg` → validates commit messages with Commitlint
- `pre-commit` → runs Prettier + ESLint + Markdownlint on staged files via lint-staged
- `pre-push` → runs the full npm run check (type-check + build + es-check)

## License

MIT

---

For issues and contributions, see [GitHub](https://github.com/m14n/devkit).
