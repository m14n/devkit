# @m14n/devkit

Shared developer toolkit with ESLint, Prettier, Commitlint, TypeScript, lint-staged and semantic-release configs for
consistent project setup.

## Installation

```sh
npm i -D @m14n/devkit
```

### Compatibility

| Tool       | Supported versions |
| ---------- | ------------------ |
| Node.js    | 22+                |
| ESLint     | 10                 |
| TypeScript | 5.0 – 6.0          |
| Prettier   | 3                  |

The TypeScript range is limited by what typescript-eslint supports.

## Quick Reference

| Tool             | Config path                     | Example usage                                                                   |
| ---------------- | ------------------------------- | ------------------------------------------------------------------------------- |
| Commitlint       | `@m14n/devkit/commitlint`       | `extends: ['@m14n/devkit/commitlint']` in `commitlint.config.js`                |
| ESLint Base      | `@m14n/devkit/eslint-base`      | `import base from '@m14n/devkit/eslint-base'` in `eslint.config.js`.            |
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

Pick the presets you need and compose them in your `eslint.config.js` (flat config, ESLint 10). Put `base` first.

```js
// eslint.config.js
import base from '@m14n/devkit/eslint-base';
import node from '@m14n/devkit/eslint-node';
// If using Browser:
// import browser from '@m14n/devkit/eslint-browser';
// If using React:
// import react from '@m14n/devkit/eslint-react';
// If using TSDoc:
// import tsdoc from '@m14n/devkit/eslint-tsdoc';
// If using Vitest:
// import vitest from '@m14n/devkit/eslint-vitest';

export default [
  ...base,
  ...node,
  // ...browser,
  // ...react,
  // ...tsdoc,
  // ...vitest,
];
```

#### Available ESLint presets

| Subpath                       | Purpose                                                         | Requires                                                                               |
| ----------------------------- | --------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `@m14n/devkit/eslint-base`    | JS + type-checked TypeScript, import order, Prettier-compatible | Core peers                                                                             |
| `@m14n/devkit/eslint-browser` | Browser globals                                                 | `globals`                                                                              |
| `@m14n/devkit/eslint-node`    | Node globals                                                    | `globals`                                                                              |
| `@m14n/devkit/eslint-react`   | React, Hooks (incl. React Compiler rules), JSX accessibility    | `@eslint-react/eslint-plugin`, `eslint-plugin-react-hooks`, `eslint-plugin-jsx-a11y-x` |
| `@m14n/devkit/eslint-tsdoc`   | TSDoc comment syntax                                            | `eslint-plugin-tsdoc`                                                                  |
| `@m14n/devkit/eslint-vitest`  | Vitest globals in `*.test.*` / `*.spec.*`                       | none                                                                                   |

Good to know about `eslint-base`:

- It lints `.js`, `.mjs`, `.cjs`, `.jsx`, `.ts`, `.mts`, `.cts` and `.tsx` files, and ignores `dist/` and `coverage/`.
- TypeScript files are type-checked through typescript-eslint's
  [project service](https://typescript-eslint.io/packages/parser#projectservice), which finds the nearest
  `tsconfig.json` for each file. Every linted `.ts` file must be included by a tsconfig. Config files such as
  `vitest.config.ts` are a common miss.
- It ends with [`eslint-config-prettier`](https://github.com/prettier/eslint-config-prettier), so formatting is left to
  Prettier. Run Prettier on its own (for example via lint-staged), not through ESLint.

Good to know about `eslint-react`:

- It uses [`@eslint-react/eslint-plugin`](https://eslint-react.xyz) for React rules,
  [`eslint-plugin-react-hooks`](https://react.dev/reference/eslint-plugin-react-hooks) for the Hooks and React Compiler
  rules, and [`eslint-plugin-jsx-a11y-x`](https://github.com/es-tooling/eslint-plugin-jsx-a11y-x) for accessibility.
- Accessibility rules keep the `jsx-a11y/*` names, so existing `eslint-disable` comments keep working.
- It is ESM-only, because `@eslint-react/eslint-plugin` is. Load it from `eslint.config.js` or `eslint.config.mjs`, not
  from a CommonJS `eslint.config.cjs`.

### Prettier

Reference in your `package.json`:

```json
{
  "prettier": "@m14n/devkit/prettier"
}
```

### TypeScript

Pick the preset that matches your project:

| Preset                                  | Use for                                                |
| --------------------------------------- | ------------------------------------------------------ |
| `@m14n/devkit/tsconfig.base.json`       | Base defaults, no runtime assumptions                  |
| `@m14n/devkit/tsconfig.browser.json`    | Browser libraries (no JSX)                             |
| `@m14n/devkit/tsconfig.decorators.json` | Add-on: legacy decorators + metadata                   |
| `@m14n/devkit/tsconfig.lib.json`        | Add-on: emit `.d.ts`, declaration maps and source maps |
| `@m14n/devkit/tsconfig.node.json`       | Node (22+) libraries or CLIs                           |
| `@m14n/devkit/tsconfig.react.json`      | React libraries (with JSX)                             |
| `@m14n/devkit/tsconfig.strict.json`     | Add-on: stricter typing checks                         |

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

The `strict`, `decorators` and `lib` presets are add-ons. Combine them with a runtime preset using an `extends` array
(TypeScript 5+). Later entries win:

```json
{
  "extends": ["@m14n/devkit/tsconfig.node.json", "@m14n/devkit/tsconfig.strict.json", "@m14n/devkit/tsconfig.lib.json"]
}
```

### Commitlint

Add a `commitlint.config.js`:

```js
// commitlint.config.js
export default {
  extends: ['@m14n/devkit/commitlint'],
};
```

If your project is CommonJS (no `"type": "module"` in `package.json`), name the file `commitlint.config.mjs`.

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
  eslint-plugin-import-x \
  prettier typescript
```

### ESLint Node / Browser presets

```sh
npm i -D globals
```

### ESLint TSDoc preset

```sh
npm i -D eslint-plugin-tsdoc
```

### ESLint React preset

```sh
npm i -D @eslint-react/eslint-plugin \
  eslint-plugin-jsx-a11y-x \
  eslint-plugin-react-hooks
```

### ESLint Test (Vitest) preset

The preset itself needs no extra packages. It only declares the Vitest globals for `*.test.*` and `*.spec.*` files.
For type-checking, either import from `'vitest'` in your tests or add `"types": ["node", "vitest/globals"]` to the
tsconfig that covers them.

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
  @semantic-release/commit-analyzer \
  @semantic-release/github \
  @semantic-release/npm \
  @semantic-release/release-notes-generator
```

## Git hooks (Husky)

To keep code quality checks consistent, we recommend using [Husky](https://typicode.github.io/husky/)
to run **Commitlint**, **lint-staged**, and a final check before pushing.

Install and initialize Husky (v9) once in your repo:

```sh
npm i -D husky
npx husky init
```

This creates a `.husky/` folder and adds a `"prepare": "husky"` script to your `package.json`. Then write the hooks:

```sh
echo 'npx --no -- commitlint --edit "$1"' > .husky/commit-msg
echo 'npx lint-staged' > .husky/pre-commit
echo 'npm run check' > .husky/pre-push
```

The `pre-push` hook expects a `check` script in your `package.json` (for example type-check + build). Change it to
whatever your project uses.

Commit the `.husky/` folder so your team shares the same hooks:

```sh
git add .husky
git commit -m "chore: set up husky hooks"
```

From now on:

- `commit-msg` → validates commit messages with Commitlint
- `pre-commit` → runs Prettier + ESLint + Markdownlint on staged files via lint-staged
- `pre-push` → runs `npm run check`

## Upgrading

Release notes for every version are on [GitHub Releases](https://github.com/m14n/devkit/releases).

### From 1.x to 2.0

- **ESLint 10 is required.** ESLint 9 is no longer supported upstream. Update `eslint` and `@eslint/js` to 10:
  `npm i -D eslint@10 @eslint/js@10`.
- **The React preset uses maintained plugins that support ESLint 10.** Swap the plugins:

  ```sh
  npm rm eslint-plugin-react eslint-plugin-jsx-a11y
  npm i -D @eslint-react/eslint-plugin eslint-plugin-jsx-a11y-x
  ```

  `react/*` rules are replaced by `@eslint-react/*` rules. Update any `eslint-disable` comments and rule overrides
  that name them (for example `react/jsx-key` is now `@eslint-react/no-missing-key`). `jsx-a11y/*` and `react-hooks/*`
  rule names don't change. React version detection now reads `settings['react-x']` instead of `settings.react`.

- **`@m14n/devkit/eslint-react` can no longer be loaded with `require`.** Use an ESM ESLint config
  (`eslint.config.js` or `.mjs`).

### From 0.x to 1.0

- **`eslint-plugin-import` → `eslint-plugin-import-x`.** Run
  `npm rm eslint-plugin-import && npm i -D eslint-plugin-import-x`. Rule names stay `import/*`, so existing
  `eslint-disable` comments keep working.
- **`eslint-plugin-prettier` is no longer used.** Remove it and run Prettier on its own. `eslint-base` now includes
  `eslint-config-prettier`.
- **`eslint-base` now lints JavaScript files too** and uses typescript-eslint's project service instead of
  `parserOptions.project: './tsconfig.json'`. Make sure every linted `.ts` file is included by a tsconfig.
- **`eslint-react` now enables the recommended rule sets** of `eslint-plugin-react`, `eslint-plugin-react-hooks` and
  `eslint-plugin-jsx-a11y`. Expect new findings.
- **`tsconfig.base.json` no longer sets `declaration`, `declarationMap`, `sourceMap` or `importHelpers`.** Libraries
  should add `@m14n/devkit/tsconfig.lib.json` to their `extends`.
- **TypeScript 6.1+ and 7 aren't supported yet** (typescript-eslint supports up to 6.0).

## Development

```sh
npm install     # also installs the Git hooks (Husky)
npm run lint    # Prettier + ESLint on this repo, using the presets it ships
npm run check   # type-check, build and ES-version check of dist/
npm test        # build, then smoke-test every export and preset
```

- `npm test` runs [test/smoke.test.js](test/smoke.test.js) against the built package. It lints the files in
  `test/fixtures/` with all ESLint presets combined and checks which rules fire. When you change a preset, add or update
  a fixture there.
- Git hooks: `commit-msg` runs commitlint, `pre-commit` runs lint-staged, and `pre-push` runs `check` and `test`.
- CI runs `check` and `test` on every pull request and on pushes to `develop`. Merging to `main` publishes a release
  via semantic-release, so commit messages must follow [Conventional Commits](https://www.conventionalcommits.org/).

## License

MIT

---

For issues and contributions, see [GitHub](https://github.com/m14n/devkit).
