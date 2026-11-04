// Smoke tests against the built package (`dist/`). Run with `npm test`, which builds first.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

import { ESLint } from 'eslint';
import * as prettier from 'prettier';
import ts from 'typescript';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const fixtures = join(root, 'test', 'fixtures');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const require = createRequire(import.meta.url);

const jsExports = Object.keys(pkg.exports).filter((key) => !key.endsWith('.json'));
const jsonExports = Object.keys(pkg.exports).filter((key) => key.endsWith('.json'));
const id = (key) => `${pkg.name}${key.slice(1)}`;

/** Collects every file path an `exports` entry points to. */
function targets(entry) {
  return typeof entry === 'string' ? [entry] : Object.values(entry).flatMap(targets);
}

describe('package exports', () => {
  for (const key of jsExports) {
    // Presets whose plugins are ESM-only (e.g. eslint-react) have no `require` entry.
    const hasRequire = 'require' in pkg.exports[key];
    it(`${key} loads via import${hasRequire ? ' and require' : ' (ESM only)'}`, async () => {
      const esm = (await import(id(key))).default;
      assert.ok(esm && typeof esm === 'object', 'ESM default export');
      if (!hasRequire) return;
      const cjs = require(id(key));
      assert.ok((cjs.default ?? cjs) && typeof (cjs.default ?? cjs) === 'object', 'CJS export');
    });
  }

  for (const key of jsonExports) {
    it(`${key} resolves`, () => {
      assert.ok(existsSync(require.resolve(id(key))));
    });
  }

  it('every export target is included in the published tarball', () => {
    const [{ files }] = JSON.parse(
      execFileSync('npm', ['pack', '--dry-run', '--json', '--ignore-scripts'], {
        cwd: root,
        encoding: 'utf8',
      }),
    );
    const packed = new Set(files.map((file) => `./${file.path}`));
    const missing = Object.values(pkg.exports)
      .flatMap(targets)
      .filter((target) => !packed.has(target));
    assert.deepEqual(missing, []);
  });
});

describe('eslint presets', async () => {
  const load = async (name) => (await import(id(`./eslint-${name}`))).default;
  const config = [
    ...(await load('base')),
    ...(await load('node')),
    ...(await load('react')),
    ...(await load('tsdoc')),
    ...(await load('vitest')),
    // React isn't installed here, so pin the version instead of `detect`.
    { settings: { 'react-x': { version: '19.0' } } },
  ];
  const eslint = new ESLint({ cwd: fixtures, overrideConfigFile: true, overrideConfig: config });
  const results = await eslint.lintFiles(['src']);
  const rulesFor = (file) => {
    const result = results.find((r) => r.filePath.endsWith(`/src/${file}`));
    assert.ok(result, `${file} was linted`);
    const fatal = result.messages.filter((m) => m.fatal);
    assert.deepEqual(fatal, [], `${file} has no parsing errors`);
    return result.messages.map((m) => m.ruleId);
  };
  const expectClean = (file) => assert.deepEqual(rulesFor(file), [], `${file} is clean`);
  const expectRules = (file, expected) => {
    const actual = rulesFor(file);
    for (const rule of expected) assert.ok(actual.includes(rule), `${file} reports ${rule}`);
  };

  it('accepts clean TypeScript (Node types, empty interfaces, TSDoc)', () =>
    expectClean('clean.ts'));

  it('reports type-aware and import problems in TypeScript', () =>
    expectRules('bad.ts', [
      'import/order',
      '@typescript-eslint/array-type',
      '@typescript-eslint/no-floating-promises',
      '@typescript-eslint/no-unused-expressions',
    ]));

  it('reports React, Hooks and a11y problems in TSX', () =>
    expectRules('List.tsx', [
      '@eslint-react/no-missing-key',
      'react-hooks/exhaustive-deps',
      'react-hooks/set-state-in-effect',
      'jsx-a11y/alt-text',
      'jsx-a11y/click-events-have-key-events',
    ]));

  it('reports each hooks problem once (react-hooks, not @eslint-react)', () => {
    const duplicates = rulesFor('List.tsx').filter((rule) =>
      ['@eslint-react/exhaustive-deps', '@eslint-react/set-state-in-effect'].includes(rule),
    );
    assert.deepEqual(duplicates, []);
  });

  it('lints CommonJS with Node globals', () =>
    assert.deepEqual(rulesFor('legacy.cjs'), ['no-undef'], 'only `undefinedThing` is undefined'));

  it('lints ES modules', () => assert.deepEqual(rulesFor('tool.mjs'), ['no-console']));

  it('allows non-null assertions in tests', () => expectClean('clean.test.ts'));

  it('defines Vitest globals in tests', () => expectClean('globals.test.js'));
});

describe('prettier preset', () => {
  it('formats with the shared options', async () => {
    const { default: options } = await import(id('./prettier'));
    const output = await prettier.format('const a = {b: "c"}', {
      ...options,
      parser: 'typescript',
    });
    assert.equal(output, "const a = { b: 'c' };\n");
  });
});

describe('tsconfig presets', () => {
  it('combine through an extends array', () => {
    const parsed = ts.getParsedCommandLineOfConfigFile(
      join(fixtures, 'tsconfig.json'),
      {},
      {
        ...ts.sys,
        onUnRecoverableConfigFileDiagnostic: (diagnostic) =>
          assert.fail(String(diagnostic.messageText)),
      },
    );
    assert.deepEqual(parsed.errors, []);
    assert.equal(parsed.options.strict, true, 'base');
    assert.equal(parsed.options.noImplicitAny, true, 'base sets noImplicitAny explicitly');
    assert.equal(parsed.options.jsx, ts.JsxEmit.ReactJSX, 'react');
    assert.equal(parsed.options.noUncheckedIndexedAccess, true, 'strict');
    assert.equal(parsed.options.declaration, true, 'lib');
    assert.equal(parsed.options.importHelpers, undefined, 'no tslib requirement');
  });
});

describe('semantic-release preset', () => {
  it('uses the commit-analyzer releaseRules option', async () => {
    const { default: config } = await import(id('./semantic-release'));
    const [name, options] = config.plugins[0];
    assert.equal(name, '@semantic-release/commit-analyzer');
    assert.deepEqual(options.releaseRules, [{ type: 'chore', release: false }]);
  });
});
