// Lint this repo with the presets it ships.
import base from './src/eslint-base.js';
import node from './src/eslint-node.js';

export default [
  // Smoke-test fixtures contain deliberate lint errors.
  { ignores: ['test/fixtures/**'] },
  ...base,
  ...node,
];
