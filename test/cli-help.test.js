import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

import { STACKS } from '../src/templates/index.js';

const runHelp = () => {
   const result = spawnSync(process.execPath, ['bin/create-ai-rules.js', '--help'], {
      encoding: 'utf8',
   });

   assert.equal(result.status, 0, `--help should exit with code 0. stderr: ${result.stderr}`);
   return result.stdout;
};

test('CLI help includes all stack keys in --stack flag description', () => {
   const output = runHelp();
   const expected = `Set stack(s): ${STACKS.map((stack) => stack.key).join(', ')} (comma-separated, used with -y)`;

   assert.match(output, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
});

test('CLI help lists every supported stack label', () => {
   const output = runHelp();

   for (const stack of STACKS) {
      assert.match(output, new RegExp(`${stack.key}\\s+${stack.label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`));
   }

   assert.match(output, /ts\s+TypeScript \(generic\) — default/);
});
