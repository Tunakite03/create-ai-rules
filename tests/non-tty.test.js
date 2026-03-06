import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import process from 'node:process';

import { selectOne, selectMulti } from '../src/ui.js';
import { STACKS } from '../src/templates/index.js';

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function withTTY(stdinTTY, stdoutTTY, fn) {
   const stdinDesc = Object.getOwnPropertyDescriptor(process.stdin, 'isTTY');
   const stdoutDesc = Object.getOwnPropertyDescriptor(process.stdout, 'isTTY');

   Object.defineProperty(process.stdin, 'isTTY', { value: stdinTTY, configurable: true });
   Object.defineProperty(process.stdout, 'isTTY', { value: stdoutTTY, configurable: true });

   try {
      return fn();
   } finally {
      if (stdinDesc) {
         Object.defineProperty(process.stdin, 'isTTY', stdinDesc);
      }
      if (stdoutDesc) {
         Object.defineProperty(process.stdout, 'isTTY', stdoutDesc);
      }
   }
}

test('selectOne returns default item in non-TTY mode', async () => {
   const result = await withTTY(false, false, () => selectOne('Pick one', ['a', 'b'], 1));
   assert.equal(result, 'b');
});

test('selectMulti returns sensible defaults in non-TTY mode', async () => {
   const result = await withTTY(false, false, () => selectMulti('Pick many', ['a', 'b', 'c']));
   assert.deepEqual(result, ['a', 'b']);
});

test('CLI exits with guidance in non-interactive mode without --yes', () => {
   const run = spawnSync(process.execPath, ['bin/create-ai-rules.js'], {
      cwd: process.cwd(),
      stdio: ['pipe', 'pipe', 'pipe'],
      encoding: 'utf8',
      env: { ...process.env, FORCE_COLOR: '0' },
   });

   assert.equal(run.status, 2);
   assert.match(run.stderr, /Non-interactive mode detected\./);
   assert.match(run.stderr, /--yes \(-y\)/);
});

test('CLI help lists every supported stack from the shared registry', () => {
   const run = spawnSync(process.execPath, ['bin/create-ai-rules.js', '--help'], {
      cwd: process.cwd(),
      stdio: ['pipe', 'pipe', 'pipe'],
      encoding: 'utf8',
      env: { ...process.env, FORCE_COLOR: '0' },
   });

   assert.equal(run.status, 0, `--help should exit with code 0. stderr: ${run.stderr}`);
   assert.equal(STACKS.some((stack) => stack.key === 'nextjs'), true);
   assert.match(run.stdout, /nextjs\s+Next\.js/);
   assert.match(
      run.stdout,
      new RegExp(escapeRegExp(`Set stack(s): ${STACKS.map((stack) => stack.key).join(', ')} (comma-separated, used with -y)`)),
   );

   for (const stack of STACKS) {
      assert.match(run.stdout, new RegExp(`${escapeRegExp(stack.key)}\\s+${escapeRegExp(stack.label)}`));
   }
});
