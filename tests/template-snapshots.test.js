import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { templatesCopilot } from '../src/templates/copilot.js';
import { templatesCursor } from '../src/templates/cursor.js';
import { templatesClaude } from '../src/templates/claude.js';
import { templatesWindsurf } from '../src/templates/windsurf.js';
import { templatesCline } from '../src/templates/cline.js';
import { templatesGeneric } from '../src/templates/generic.js';

const cfg = { stacks: ['ts'], minimal: true };

const cases = [
   {
      name: 'copilot main instructions snapshot',
      actual: templatesCopilot(cfg)['.github/copilot-instructions.md'],
      snapshot: 'tests/snapshots/copilot-instructions.md.snap',
   },
   {
      name: 'cursor base rules snapshot',
      actual: templatesCursor(cfg)['.cursor/rules/base.mdc'],
      snapshot: 'tests/snapshots/cursor-base.mdc.snap',
   },
   {
      name: 'claude rules snapshot',
      actual: templatesClaude(cfg)['CLAUDE.md'],
      snapshot: 'tests/snapshots/claude.md.snap',
   },
   {
      name: 'windsurf rules snapshot',
      actual: templatesWindsurf(cfg)['.windsurfrules'],
      snapshot: 'tests/snapshots/windsurf.rules.snap',
   },
   {
      name: 'cline rules snapshot',
      actual: templatesCline(cfg)['.clinerules'],
      snapshot: 'tests/snapshots/cline.rules.snap',
   },
   {
      name: 'generic rules snapshot',
      actual: templatesGeneric(cfg)['AGENTS.md'],
      snapshot: 'tests/snapshots/agents.md.snap',
   },
];

for (const { name, actual, snapshot } of cases) {
   test(name, () => {
      const expected = readFileSync(snapshot, 'utf8');
      assert.equal(actual, expected);
   });
}
