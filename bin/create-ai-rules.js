#!/usr/bin/env node

import { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import { bold, dim, green, yellow, selectOne, selectMulti } from '../src/ui.js';
import { writeFileSafe } from '../src/fs-utils.js';
import { TARGETS, STACKS } from '../src/templates/index.js';

// --- Version & CLI flags ---
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(await fs.readFile(path.join(__dirname, '..', 'package.json'), 'utf8'));

const argv = process.argv.slice(2);
const FLAGS = new Set(argv.filter((a) => a.startsWith('-')));

// Parse --stack=<name> from argv
const stackArg = argv.find((a) => a.startsWith('--stack='));
const stackValue = stackArg ? stackArg.split('=')[1] : null;

const opts = {
   yes: FLAGS.has('--yes') || FLAGS.has('-y'),
   force: FLAGS.has('--force') || FLAGS.has('-f'),
   minimal: FLAGS.has('--minimal'),
   help: FLAGS.has('--help') || FLAGS.has('-h'),
   version: FLAGS.has('--version') || FLAGS.has('-v'),
   stack: stackValue,
};

// --- Help & Version ---
if (opts.version) {
   console.log(pkg.version);
   process.exit(0);
}

if (opts.help) {
   console.log(`
  ${bold('create-ai-rules')} v${pkg.version}
  Scaffold AI coding rules for your IDE assistants.

  ${bold('Usage')}
    npx create-ai-rules          Interactive mode
    npx create-ai-rules -y       Quick defaults (Copilot + Generic, TypeScript)

  ${bold('Flags')}
    -y, --yes           Accept defaults (Copilot + Generic, TypeScript stack)
    -f, --force         Overwrite existing files
    --stack=<name>      Set stack: ts, react, node, python, unity (with -y)
    --minimal           Skip optional files (prompts, skills, extras)
    -h, --help          Show this help
    -v, --version       Show version

  ${bold('Supported targets')}
    GitHub Copilot   .github/ (instructions + prompts + skills)
    Cursor           .cursor/rules/*.mdc + skills/
    Windsurf         .windsurfrules
    Claude Code      CLAUDE.md
    Cline            .clinerules
    Antigravity      .agent/rules/ + workflows/
    Generic          AGENTS.md

  ${bold('Stacks')}
    ts               TypeScript (generic) — default
    react            React / Next.js
    node             Node.js API
    python           Python
    unity            Unity (C#)

  ${bold('Interactive navigation')}
    ↑/↓   Move cursor
    Space  Toggle selection (multi-select)
    A      Select / deselect all
    Enter  Confirm
`);
   process.exit(0);
}

// ================================================================
//  Main
// ================================================================
async function main() {
   console.log(`\n${bold('create-ai-rules')} ${dim(`v${pkg.version}`)}`);
   console.log(dim('Scaffold AI coding rules for your IDE assistants.'));

   let selectedTargets = [];
   let stack = 'ts';
   let minimal = opts.minimal;

   if (opts.yes) {
      selectedTargets = ['copilot', 'generic'];
      // --stack=<name> overrides the default
      const validStacks = STACKS.map((s) => s.key);
      if (opts.stack && validStacks.includes(opts.stack)) {
         stack = opts.stack;
      }
      const stackLabel = STACKS.find((s) => s.key === stack)?.label ?? stack;
      console.log(dim(`\nUsing defaults: Copilot + Generic, ${stackLabel} stack.\n`));
   } else {
      // -- 1. Select targets --
      const chosenTargets = await selectMulti('1. Select targets', TARGETS);
      selectedTargets = chosenTargets.map((t) => t.key);

      // -- 2. Select stack --
      const chosenStack = await selectOne('2. Select tech stack', STACKS, 0);
      stack = chosenStack.key;

      // -- 3. Minimal mode --
      const minimalOptions = [
         { label: 'No  — include prompts, skills & extras', value: false },
         { label: 'Yes — core rule files only', value: true },
      ];
      const chosenMinimal = await selectOne('3. Minimal mode?', minimalOptions, 0);
      minimal = chosenMinimal.value;
   }

   const cfg = { stack, minimal };

   // -- Merge all files from selected targets --
   const merged = {};
   for (const k of selectedTargets) {
      const target = TARGETS.find((t) => t.key === k);
      if (!target) continue;
      Object.assign(merged, target.gen(cfg));
   }

   // -- Write files --
   console.log('');
   const results = [];
   for (const [relPath, content] of Object.entries(merged)) {
      const result = await writeFileSafe(relPath, content, { force: opts.force });
      results.push(result);

      if (result.status === 'written') {
         console.log(`  ${green('+')} ${relPath}`);
      } else {
         console.log(`  ${yellow('o')} ${relPath} ${dim('(exists, skipped)')}`);
      }
   }

   const written = results.filter((r) => r.status === 'written').length;
   const skipped = results.filter((r) => r.status === 'skipped').length;

   console.log(`\n${green('Done!')} ${written} written, ${skipped} skipped.`);
   if (skipped > 0 && !opts.force) {
      console.log(dim('Tip: re-run with --force to overwrite existing files.'));
   }

   console.log(`\n${bold('Next steps:')}`);
   console.log(`  1. Review & customize the generated rule files.`);
   console.log(`  2. Commit them to your repo.`);
   console.log(`  3. Your IDE assistant will pick them up automatically.\n`);
}

main().catch((err) => {
   console.error(`\n${bold('Error:')} ${err?.message ?? err}`);
   process.exit(1);
});
