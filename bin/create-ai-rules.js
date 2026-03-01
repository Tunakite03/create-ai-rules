#!/usr/bin/env node

import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";
import readline from "node:readline";
import { fileURLToPath } from "node:url";

// --- Version & CLI flags ---
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(await fs.readFile(path.join(__dirname, "..", "package.json"), "utf8"));

const argv = process.argv.slice(2);
const FLAGS = new Set(argv.filter((a) => a.startsWith("-")));

const opts = {
  yes: FLAGS.has("--yes") || FLAGS.has("-y"),
  force: FLAGS.has("--force") || FLAGS.has("-f"),
  minimal: FLAGS.has("--minimal"),
  help: FLAGS.has("--help") || FLAGS.has("-h"),
  version: FLAGS.has("--version") || FLAGS.has("-v"),
};

// --- Help & Version ---
if (opts.version) {
  console.log(pkg.version);
  process.exit(0);
}

if (opts.help) {
  console.log(`
  ${bold("create-ai-rules")} v${pkg.version}
  Scaffold AI coding rules for your IDE assistants.

  ${bold("Usage")}
    npx create-ai-rules          Interactive mode
    npx create-ai-rules -y       Quick defaults (Copilot + Generic, TypeScript)

  ${bold("Flags")}
    -y, --yes       Accept defaults (Copilot + Generic, TypeScript stack)
    -f, --force     Overwrite existing files
    --minimal       Skip optional files (prompts, conventions doc)
    -h, --help      Show this help
    -v, --version   Show version

  ${bold("Supported targets")}
    1) GitHub Copilot   .github/copilot-instructions.md + .github/instructions/*
    2) Cursor           .cursor/rules/*.mdc
    3) Windsurf         .windsurfrules
    4) Claude Code      CLAUDE.md
    5) Cline            .clinerules
    6) Generic          AGENTS.md
`);
  process.exit(0);
}

// --- Helpers ---
function bold(s) {
  return `\x1b[1m${s}\x1b[0m`;
}
function green(s) {
  return `\x1b[32m${s}\x1b[0m`;
}
function yellow(s) {
  return `\x1b[33m${s}\x1b[0m`;
}
function cyan(s) {
  return `\x1b[36m${s}\x1b[0m`;
}
function dim(s) {
  return `\x1b[2m${s}\x1b[0m`;
}

function rlInterface() {
  return readline.createInterface({ input: process.stdin, output: process.stdout });
}

function ask(rl, q) {
  return new Promise((resolve) => rl.question(q, (ans) => resolve(ans.trim())));
}

function parseChoice(input, max) {
  if (input.toLowerCase() === "all" || input === "*") {
    return Array.from({ length: max }, (_, i) => i + 1);
  }
  const parts = input
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => Number(s))
    .filter((n) => Number.isFinite(n) && n >= 1 && n <= max);
  return [...new Set(parts)];
}

async function ensureDir(absPath) {
  await fs.mkdir(path.dirname(absPath), { recursive: true });
}

async function exists(absPath) {
  try {
    await fs.access(absPath);
    return true;
  } catch {
    return false;
  }
}

async function writeFileSafe(relPath, content, { force }) {
  const abs = path.join(process.cwd(), relPath);
  await ensureDir(abs);

  if (!force && (await exists(abs))) {
    return { relPath, status: "skipped" };
  }
  await fs.writeFile(abs, content, "utf8");
  return { relPath, status: "written" };
}

// ============================
//  Templates
// ============================

function baseRules({ stack }) {
  const common = `# AI Coding Rules

## Goals
- Write correct, readable, maintainable code.
- Minimal diffs - change only what is needed.
- Strong typing, predictable behavior.

## Non-negotiables
- Do NOT use \`any\` unless explicitly requested.
- Do NOT add new dependencies unless asked.
- Do NOT change public APIs unless asked.
- Follow existing code style & conventions.

## Engineering principles
- Prefer early returns; avoid deep nesting.
- Prefer pure functions; minimize mutation.
- Validate inputs at boundaries.
- Never log secrets or credentials.

## Output format
1. Plan - brief explanation of approach
2. Patch - relevant code changes
3. Tests - new/updated tests
4. Edge cases - what could break
`;

  const ts = `
## TypeScript
- Strict typing; prefer \`unknown\` + type-guards over \`any\`.
- Avoid type assertions (\`as\`) unless necessary and localized.
- Prefer \`satisfies\` for config objects.
- Use discriminated unions for state modeling.
`;

  const react = `
## React
- Functional components + hooks only.
- Keep UI components presentational; data fetching in hooks/services.
- Accessibility: all inputs labeled, buttons have accessible text.
- Follow existing design system / Tailwind / shadcn patterns.
- Memoize expensive computations; avoid premature optimization.
`;

  const nodeApi = `
## Node / API
- Validate request inputs at the boundary (Zod, Joi, etc.).
- Consistent error tokens: \`INVALID_INPUT\`, \`NOT_FOUND\`, ...
- Never swallow errors - handle or re-throw with context.
- Use async/await; avoid callback-style code.
`;

  const python = `
## Python
- Type hints on all public functions.
- Follow PEP 8 and existing project style.
- Use dataclasses / Pydantic for structured data.
- Prefer list comprehensions over map/filter where clearer.
`;

  const stackMap = {
    ts: common + ts,
    react: common + ts + react,
    node: common + ts + nodeApi,
    python: common + python,
  };

  return stackMap[stack] || common + ts;
}

// --- GitHub Copilot ---
function templatesCopilot({ stack, minimal }) {
  const files = {};

  files[".github/copilot-instructions.md"] = baseRules({ stack });

  files[".github/instructions/00-style.instructions.md"] = `---
applyTo: "**"
---
# Style & Readability
- Small functions (< 40 lines). Extract helpers aggressively.
- Explicit naming > abbreviations.
- Early returns to reduce nesting.
- Comments explain "why", not "what".
`;

  files[".github/instructions/10-typescript.instructions.md"] = `---
applyTo: "**/*.{ts,tsx}"
---
# TypeScript Rules
- No \`any\` unless explicitly allowed.
- Prefer discriminated unions for state.
- Handle \`null | undefined\` explicitly.
- Use \`satisfies\` for config objects.
`;

  files[".github/instructions/40-testing.instructions.md"] = `---
applyTo: "**/*.{test,spec}.{ts,tsx,js}"
---
# Testing Rules
- Add/update tests when logic changes.
- Deterministic tests - mock time, random, network.
- Prefer table-driven / parameterized tests.
- Descriptive test names: \`should <expected> when <condition>\`.
`;

  files[".github/instructions/90-pr-checklist.instructions.md"] = `---
applyTo: "**"
---
# PR Checklist
- [ ] Types correct, no implicit any
- [ ] No new deps added without approval
- [ ] Minimal diff
- [ ] Edge cases handled
- [ ] Tests updated/added
- [ ] No secrets or credentials logged
`;

  if (!minimal) {
    files[".github/prompts/implement-feature.prompt.md"] = `# Implement Feature
Task: <describe the feature>
Constraints: minimal diff, no new deps, keep public API stable.
Deliver: plan -> patch -> tests -> edge cases.
`;

    files[".github/prompts/fix-bug.prompt.md"] = `# Fix Bug
Bug: <describe the bug>
Steps to reproduce: <steps>
Expected: <expected behavior>
Deliver: root cause -> fix -> regression test.
`;

    files[".github/prompts/refactor.prompt.md"] = `# Refactor
Target: <file or module>
Goal: <why refactor - readability, performance, ...>
Constraints: no behavior change, all tests must pass after.
`;
  }

  return files;
}

// --- Cursor ---
function templatesCursor({ stack, minimal }) {
  const files = {};

  files[".cursor/rules/base.mdc"] = `---
description: Base coding rules for AI assistant
globs: 
alwaysApply: true
---
${baseRules({ stack })}
`;

  files[".cursor/rules/style.mdc"] = `---
description: Style & readability rules
globs: 
alwaysApply: true
---
# Style & Readability
- Small functions (< 40 lines). Extract helpers.
- Explicit naming > abbreviations.
- Early returns to reduce nesting.
- Comments explain "why", not "what".
- When editing: propose smallest viable diff.
- If unsure: ask for the missing file/context instead of guessing.
`;

  if (!minimal) {
    files[".cursor/rules/testing.mdc"] = `---
description: Testing conventions
globs: "**/*.{test,spec}.{ts,tsx,js,jsx,py}"
alwaysApply: false
---
# Testing Rules
- Add/update tests when logic changes.
- Deterministic tests - mock time, random, network.
- Prefer table-driven tests.
- Descriptive test names.
`;
  }

  return files;
}

// --- Windsurf ---
function templatesWindsurf({ stack }) {
  return {
    ".windsurfrules": baseRules({ stack }) + `
## Windsurf-specific
- When editing: propose smallest viable diff.
- If unsure about context: ask before assuming.
- Follow the existing patterns in the codebase.
`,
  };
}

// --- Claude Code ---
function templatesClaude({ stack }) {
  return {
    "CLAUDE.md": baseRules({ stack }) + `
## Claude Code behavior
- Prefer reading existing patterns in the repo before writing new code.
- Avoid inventing new architecture unless explicitly asked.
- When making changes, verify they compile/lint first.
`,
  };
}

// --- Cline ---
function templatesCline({ stack }) {
  return {
    ".clinerules": baseRules({ stack }) + `
## Cline-specific
- Always read relevant files before making changes.
- Propose a plan before implementing.
- Keep diffs minimal and focused.
`,
  };
}

// --- Generic / Agents ---
function templatesGeneric({ stack }) {
  return {
    "AGENTS.md": baseRules({ stack }) + `
## Note
This is a tool-agnostic rules file. If your IDE uses a different
filename, copy this content to the appropriate location.
`,
  };
}

// ============================
//  Target registry
// ============================
const TARGETS = [
  {
    key: "copilot",
    label: "GitHub Copilot",
    desc: ".github/copilot-instructions.md + .github/instructions/*",
    gen: (cfg) => templatesCopilot(cfg),
  },
  {
    key: "cursor",
    label: "Cursor",
    desc: ".cursor/rules/*.mdc",
    gen: (cfg) => templatesCursor(cfg),
  },
  {
    key: "windsurf",
    label: "Windsurf",
    desc: ".windsurfrules",
    gen: (cfg) => templatesWindsurf(cfg),
  },
  {
    key: "claude",
    label: "Claude Code",
    desc: "CLAUDE.md",
    gen: (cfg) => templatesClaude(cfg),
  },
  {
    key: "cline",
    label: "Cline",
    desc: ".clinerules",
    gen: (cfg) => templatesCline(cfg),
  },
  {
    key: "generic",
    label: "Generic / Agents",
    desc: "AGENTS.md",
    gen: (cfg) => templatesGeneric(cfg),
  },
];

const STACKS = [
  { key: "ts", label: "TypeScript (generic)" },
  { key: "react", label: "React / Next.js" },
  { key: "node", label: "Node.js API" },
  { key: "python", label: "Python" },
];

// ============================
//  Main
// ============================
async function main() {
  console.log(`\n${bold("create-ai-rules")} ${dim(`v${pkg.version}`)}`);
  console.log(dim("Scaffold AI coding rules for your IDE assistants.\n"));

  const rl = rlInterface();

  try {
    let selectedTargets = [];
    let stack = "ts";
    let minimal = opts.minimal;

    if (opts.yes) {
      selectedTargets = ["copilot", "generic"];
      stack = "ts";
      console.log(dim("Using defaults: Copilot + Generic, TypeScript stack.\n"));
    } else {
      // -- Select targets --
      console.log(`${bold("1.")} Select targets ${dim("(comma-separated, e.g. 1,2,3 or 'all')")}\n`);
      TARGETS.forEach((t, i) =>
        console.log(`   ${cyan(`${i + 1})`)} ${t.label}  ${dim(t.desc)}`)
      );

      const rawTargets = await ask(rl, `\n  ${bold("Your choice:")} `);
      const ids = parseChoice(rawTargets, TARGETS.length);
      selectedTargets = ids.map((i) => TARGETS[i - 1].key);

      if (selectedTargets.length === 0) {
        console.log(yellow("\nNo target selected. Exiting.\n"));
        process.exit(0);
      }

      // -- Select stack --
      console.log(`\n${bold("2.")} Select tech stack\n`);
      STACKS.forEach((s, i) =>
        console.log(`   ${cyan(`${i + 1})`)} ${s.label}`)
      );

      const rawStack = await ask(rl, `\n  ${bold("Your choice")} ${dim("[1]")}: `);
      const sid = Number(rawStack);
      if (Number.isFinite(sid) && sid >= 1 && sid <= STACKS.length) {
        stack = STACKS[sid - 1].key;
      }

      // -- Minimal mode --
      const rawMinimal = await ask(rl, `\n  ${bold("Minimal mode?")} ${dim("(skip prompts & extras)")} [y/N]: `);
      minimal = /^y(es)?$/i.test(rawMinimal);
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
    console.log("");
    const results = [];
    for (const [relPath, content] of Object.entries(merged)) {
      const result = await writeFileSafe(relPath, content, { force: opts.force });
      results.push(result);

      if (result.status === "written") {
        console.log(`  ${green("+")} ${relPath}`);
      } else {
        console.log(`  ${yellow("o")} ${relPath} ${dim("(exists, skipped)")}`);
      }
    }

    const written = results.filter((r) => r.status === "written").length;
    const skipped = results.filter((r) => r.status === "skipped").length;

    console.log(`\n${green("Done!")} ${written} written, ${skipped} skipped.`);
    if (skipped > 0 && !opts.force) {
      console.log(dim("Tip: re-run with --force to overwrite existing files."));
    }

    console.log(`\n${bold("Next steps:")}`);
    console.log(`  1. Review & customize the generated rule files.`);
    console.log(`  2. Commit them to your repo.`);
    console.log(`  3. Your IDE assistant will pick them up automatically.\n`);
  } finally {
    rl.close();
  }
}

main().catch((err) => {
  console.error(`\n${bold("Error:")} ${err?.message ?? err}`);
  process.exit(1);
});
