import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

const result = spawnSync('npx', ['vinext', 'build'], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

const output = resolve('dist/server/prerendered-routes/index.html');
if (!existsSync(output)) {
  process.exit(result.status || 1);
}

// Vinext currently emits a harmless libuv assertion after a successful build
// on Windows. The artifact check above distinguishes it from a failed build.
await import('./optimize-static-html.mjs');
