import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// Keep npm scripts portable and opt out of development-tool telemetry.
const binaries = {
  astro: 'astro/bin/astro.mjs',
  openspec: '@fission-ai/openspec/bin/openspec.js',
};
const binary = binaries[process.argv[2]];
if (!binary) throw new Error('Expected astro or openspec');
const result = spawnSync(
  process.execPath,
  [
    fileURLToPath(new URL(`../node_modules/${binary}`, import.meta.url)),
    ...process.argv.slice(3),
  ],
  {
    stdio: 'inherit',
    env: {
      ...process.env,
      ASTRO_TELEMETRY_DISABLED: '1',
      OPENSPEC_TELEMETRY: '0',
    },
  },
);
if (result.error) throw result.error;
process.exit(result.status ?? 1);
