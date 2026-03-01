#!/usr/bin/env node

import { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

// --- Version & CLI flags ---
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(await fs.readFile(path.join(__dirname, '..', 'package.json'), 'utf8'));

const argv = process.argv.slice(2);
const FLAGS = new Set(argv.filter((a) => a.startsWith('-')));

const opts = {
   yes: FLAGS.has('--yes') || FLAGS.has('-y'),
   force: FLAGS.has('--force') || FLAGS.has('-f'),
   minimal: FLAGS.has('--minimal'),
   help: FLAGS.has('--help') || FLAGS.has('-h'),
   version: FLAGS.has('--version') || FLAGS.has('-v'),
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
    -y, --yes       Accept defaults (Copilot + Generic, TypeScript stack)
    -f, --force     Overwrite existing files
    --minimal       Skip optional files (prompts, skills, conventions)
    -h, --help      Show this help
    -v, --version   Show version

  ${bold('Supported targets')}
    GitHub Copilot   .github/ (instructions + prompts)
    Cursor           .cursor/rules/*.mdc
    Windsurf         .windsurfrules
    Claude Code      CLAUDE.md
    Cline            .clinerules
    Generic          AGENTS.md

  ${bold('Interactive navigation')}
    ↑/↓   Move cursor
    Space  Toggle selection (multi-select)
    A      Select / deselect all
    Enter  Confirm
`);
   process.exit(0);
}

// --- ANSI helpers ---
function bold(s) {
   return `\x1b[1m${s}\x1b[0m`;
}
function green(s) {
   return `\x1b[32m${s}\x1b[0m`;
}
function yellow(s) {
   return `\x1b[33m${s}\x1b[0m`;
}
function dim(s) {
   return `\x1b[2m${s}\x1b[0m`;
}

// --- Arrow-key interactive selectors ---

function itemLabel(item) {
   if (typeof item === 'string') return item;
   return item.desc ? `${item.label}  ${dim(item.desc)}` : item.label;
}

/** Single-select: ↑/↓ to navigate, Enter to confirm. */
async function selectOne(question, items, defaultIdx = 0) {
   if (!process.stdin.isTTY) return items[defaultIdx];

   return new Promise((resolve) => {
      let cursor = defaultIdx;
      const count = items.length;

      const render = (redraw) => {
         if (redraw) process.stdout.write(`\x1B[${count}A`);
         for (let i = 0; i < count; i++) {
            const label = itemLabel(items[i]);
            process.stdout.write(
               i === cursor ? `  ${green('❯')} ${bold(label)}\x1B[0K\n` : `    ${dim(label)}\x1B[0K\n`,
            );
         }
      };

      process.stdout.write(`\n${bold(question)}  ${dim('↑↓ · Enter')}\n\n`);
      render(false);
      process.stdout.write('\x1B[?25l');

      process.stdin.setRawMode(true);
      process.stdin.resume();
      process.stdin.setEncoding('utf8');

      const onData = (key) => {
         if (key === '\x03') {
            cleanup();
            process.exit(0);
         }
         // Up: ANSI or Windows raw \xe0H
         if (key === '\x1B[A' || key === '\xe0H' || key === '\x00H') {
            cursor = (cursor - 1 + count) % count;
            render(true);
            return;
         }
         // Down: ANSI or Windows raw \xe0P
         if (key === '\x1B[B' || key === '\xe0P' || key === '\x00P') {
            cursor = (cursor + 1) % count;
            render(true);
            return;
         }
         if (key === '\r' || key === '\n') {
            cleanup();
            process.stdout.write(`\x1B[${count}A\x1B[J`);
            process.stdout.write(`  ${green('✔')} ${bold(itemLabel(items[cursor]))}\n`);
            resolve(items[cursor]);
         }
      };

      const cleanup = () => {
         process.stdin.removeListener('data', onData);
         process.stdin.setRawMode(false);
         process.stdin.pause();
         process.stdout.write('\x1B[?25h');
      };

      process.stdin.on('data', onData);
   });
}

/**
 * Multi-select: ↑/↓ navigate, Space toggle, A = toggle all, Enter confirm.
 * Returns array of selected items.
 */
async function selectMulti(question, items) {
   if (!process.stdin.isTTY) return items;

   return new Promise((resolve) => {
      let cursor = 0;
      const selected = new Set();
      const count = items.length;

      const render = (redraw) => {
         if (redraw) process.stdout.write(`\x1B[${count}A`);
         for (let i = 0; i < count; i++) {
            const label = itemLabel(items[i]);
            const check = selected.has(i) ? green('◉') : dim('◯');
            const pointer = i === cursor ? green('❯') : ' ';
            const text = i === cursor ? bold(label) : dim(label);
            process.stdout.write(`  ${pointer} ${check} ${text}\x1B[0K\n`);
         }
      };

      process.stdout.write(`\n${bold(question)}  ${dim('↑↓ · Space select · A = all · Enter confirm')}\n\n`);
      render(false);
      process.stdout.write('\x1B[?25l');

      process.stdin.setRawMode(true);
      process.stdin.resume();
      process.stdin.setEncoding('utf8');

      const onData = (key) => {
         if (key === '\x03') {
            cleanup();
            process.exit(0);
         }
         // Up: ANSI or Windows raw \xe0H
         if (key === '\x1B[A' || key === '\xe0H' || key === '\x00H') {
            cursor = (cursor - 1 + count) % count;
            render(true);
            return;
         }
         // Down: ANSI or Windows raw \xe0P
         if (key === '\x1B[B' || key === '\xe0P' || key === '\x00P') {
            cursor = (cursor + 1) % count;
            render(true);
            return;
         }
         if (key === ' ') {
            selected.has(cursor) ? selected.delete(cursor) : selected.add(cursor);
            render(true);
            return;
         }
         if (key === 'a' || key === 'A') {
            selected.size === count ? selected.clear() : items.forEach((_, i) => selected.add(i));
            render(true);
            return;
         }
         if (key === '\r' || key === '\n') {
            if (selected.size === 0) {
               // Show hint without clearing the list
               process.stdout.write(`\x1B[${count + 1}A`);
               process.stdout.write(
                  `\n${bold(question)}  ${yellow('← press Space to select an item first')}\x1B[0K\n\n`,
               );
               render(false);
               return;
            }
            cleanup();
            const chosen = [...selected].sort((a, b) => a - b).map((i) => items[i]);
            process.stdout.write(`\x1B[${count}A\x1B[J`);
            process.stdout.write(`  ${green('✔')} ${chosen.map((it) => bold(it.label ?? it)).join(', ')}\n`);
            resolve(chosen);
         }
      };

      const cleanup = () => {
         process.stdin.removeListener('data', onData);
         process.stdin.setRawMode(false);
         process.stdin.pause();
         process.stdout.write('\x1B[?25h');
      };

      process.stdin.on('data', onData);
   });
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
      return { relPath, status: 'skipped' };
   }
   await fs.writeFile(abs, content, 'utf8');
   return { relPath, status: 'written' };
}
// ================================================================
//  TEMPLATES - Comprehensive AI Rules
// ================================================================

function baseRules({ stack }) {
   const common = `# AI Coding Rules

## Identity & Behavior
- You are an expert software engineer embedded in this project.
- Read existing code BEFORE writing new code. Match patterns already in use.
- Think step-by-step. Plan before you code.
- When uncertain, ask for clarification instead of guessing.

## Core Workflow
1. **Understand** - Read related files, understand the context.
2. **Plan** - Outline your approach in 2-3 sentences.
3. **Implement** - Write minimal, correct code.
4. **Verify** - Check for errors, edge cases, and regressions.
5. **Document** - Explain what changed and why.

## Non-negotiables
- Do NOT use \`any\` (or equivalent loose types) unless explicitly requested.
- Do NOT add new dependencies unless asked. Use what is already installed.
- Do NOT change public APIs, function signatures, or database schemas unless asked.
- Do NOT remove existing code comments, tests, or functionality without reason.
- Do NOT invent new architectural patterns - follow what the codebase already uses.
- Follow existing code style, formatting, and naming conventions exactly.

## Code Quality
- **Small functions** (< 40 lines). Extract helpers aggressively.
- **Explicit naming** over abbreviations. \`getUserById\` not \`getUsr\`.
- **Early returns** to reduce nesting. Max 2-3 levels of indentation.
- **Pure functions** when possible. Minimize mutation and side effects.
- **Single responsibility** - each function/module does one thing well.
- **DRY but not at the cost of clarity** - duplication is better than wrong abstraction.
- Comments explain **why**, never **what**. Code should be self-documenting.

## Error Handling
- Never swallow errors silently. Always handle or re-throw with context.
- Use typed/structured errors, not raw strings.
- Validate inputs at system boundaries (API endpoints, CLI args, file I/O).
- Provide actionable error messages: what went wrong + how to fix it.
- Handle \`null\`/\`undefined\`/empty states explicitly - never assume data exists.

## Security
- NEVER log secrets, tokens, passwords, API keys, or PII.
- NEVER hardcode credentials. Use environment variables.
- Sanitize user inputs before database queries or shell commands.
- Use parameterized queries, never string concatenation for SQL.
- Validate and sanitize file paths to prevent path traversal.
- Set appropriate CORS, CSP, and security headers.

## Performance
- Do NOT prematurely optimize. Correctness first.
- Avoid N+1 queries - batch database operations.
- Use pagination for list endpoints.
- Memoize expensive computations only when measured to be slow.
- Prefer streaming over loading entire datasets into memory.

## Git & Diffs
- Minimal diffs - change ONLY what is needed for the task.
- Do not reformat or restructure files unrelated to the task.
- Each change should be a single logical unit.
- Commit messages: \`type(scope): description\` (conventional commits).

## Output Format
When implementing changes, always provide:
1. **Plan** - brief explanation of approach (2-3 sentences)
2. **Changes** - the actual code changes with file paths
3. **Tests** - new or updated tests covering the change
4. **Edge cases** - what could break, boundary conditions considered
`;

   const ts = `
## TypeScript
- Enable and respect \`strict: true\`. Never weaken tsconfig.
- Prefer \`unknown\` + type-guards over \`any\`. Use \`any\` only as last resort.
- Avoid type assertions (\`as\`). When unavoidable, add a comment explaining why.
- Use \`satisfies\` for config objects to get type checking + inference.
- Use discriminated unions for state modeling (\`type State = { status: "loading" } | { status: "success"; data: T }\`).
- Prefer \`interface\` for object shapes, \`type\` for unions/intersections/utilities.
- Use \`readonly\` for data that should not be mutated.
- Prefer \`const\` assertions for literal types: \`as const\`.
- Generic constraints: \`<T extends Base>\` not unconstrained \`<T>\`.
- Avoid \`enum\` - prefer const objects with \`as const\` + derived union type.
- Use \`Map\`/\`Set\` instead of plain objects when keys are dynamic.
- Handle promise rejections. Never use unhandled \`.then()\` without \`.catch()\`.
- Prefer \`import type\` for type-only imports to reduce bundle size.
- Use barrel exports (\`index.ts\`) sparingly - they can cause circular deps.
`;

   const react = `
## React
- Functional components + hooks only. No class components.
- Keep components presentational. Data fetching belongs in hooks or services.
- Custom hooks for reusable logic: \`use<Name>\` convention.
- Component file structure: types -> component -> styles -> exports.
- Props interface named \`<Component>Props\`. Export it.
- Avoid inline function definitions in JSX - extract to named handlers.
- Use \`useCallback\` for functions passed to child components.
- Use \`useMemo\` only for expensive computations (not for primitives).
- State management: local state first -> context -> external store.
- Never mutate state directly. Use functional updates: \`setState(prev => ...)\`.
- Key prop: use stable unique IDs, never array index (unless static list).
- Accessibility (a11y):
  - All \`<img>\` must have \`alt\` text.
  - All form inputs must have associated \`<label>\`.
  - Buttons must have accessible text (visible or \`aria-label\`).
  - Use semantic HTML: \`<nav>\`, \`<main>\`, \`<section>\`, \`<article>\`.
  - Support keyboard navigation (\`tabIndex\`, \`onKeyDown\`).
  - Color contrast must meet WCAG AA (4.5:1 for text).
- Styling: follow the existing pattern (Tailwind / CSS Modules / styled-components).
- Error boundaries for graceful failure in component trees.
- Lazy loading: \`React.lazy()\` + \`Suspense\` for route-level code splitting.
- Forms: use controlled components. Validate on blur + submit.
- Avoid prop drilling > 2 levels. Use context or composition instead.
- Follow docs/ui-style-guide.md strictly.
- Do not hardcode colors; use semantic Tailwind tokens.
- Use rounded-lg as default radius.
- Ensure light/dark both look correct.
`;

   const nodeApi = `
## Node / API
- Use async/await everywhere. No callbacks, no raw \`.then()\` chains.
- Validate ALL request inputs at the boundary using a schema library (Zod, Joi, etc.).
- Consistent error response format: \`{ error: { code: "INVALID_INPUT", message: "..." } }\`.
- Error codes as constants: \`INVALID_INPUT\`, \`NOT_FOUND\`, \`UNAUTHORIZED\`, \`FORBIDDEN\`, \`CONFLICT\`, \`INTERNAL_ERROR\`.
- HTTP status codes: use correct ones (400, 401, 403, 404, 409, 422, 500).
- Middleware pattern: auth -> validation -> handler -> error handler.
- Database:
  - Use transactions for multi-step mutations.
  - Parameterized queries only. Never concatenate user input into SQL.
  - Add indexes for frequently queried columns.
  - Use migrations for schema changes, never manual DDL.
- Logging:
  - Structured JSON logs with correlation IDs.
  - Log levels: error (failures), warn (degraded), info (key events), debug (dev).
  - NEVER log request bodies containing passwords, tokens, or PII.
- Rate limiting on public endpoints.
- Graceful shutdown: handle SIGTERM, drain connections, close DB pools.
- Health check endpoint: \`GET /health\` returning \`{ status: "ok" }\`.
- Pagination: cursor-based preferred, offset-based acceptable.
- Idempotency: POST/PUT endpoints should be safely retryable.
`;

   const python = `
## Python
- Type hints on ALL public functions. Use \`from __future__ import annotations\`.
- Follow PEP 8 strictly (line length, naming, spacing).
- Use \`dataclasses\` or \`Pydantic\` for structured data, not raw dicts.
- Prefer list/dict/set comprehensions over \`map()\`/\`filter()\` when clearer.
- Use \`pathlib.Path\` instead of \`os.path\` for file operations.
- Context managers (\`with\`) for all resource handling (files, connections, locks).
- Use \`logging\` module, not \`print()\` for production code.
- Virtual environments: never install globally.
- Exception handling:
  - Catch specific exceptions, never bare \`except:\`.
  - Custom exception classes for domain errors.
  - Always include context in error messages.
- Async (\`asyncio\`):
  - Use \`async/await\` for I/O-bound operations.
  - Never mix sync and async without proper bridging.
  - Use \`asyncio.gather()\` for concurrent operations.
- Testing:
  - \`pytest\` as the test runner.
  - Fixtures for setup/teardown.
  - \`@pytest.mark.parametrize\` for data-driven tests.
  - Mock external services, not internal logic.
- f-strings for string formatting (not \`.format()\` or \`%\`).
- Use \`Enum\` for fixed sets of values.
- Docstrings: Google style or NumPy style, be consistent.
`;

   const unity = `
## Unity / C#
- Naming:
  - Methods, Properties, Classes: \`PascalCase\`.
  - Private fields: \`_camelCase\`. Serialized private fields: \`[SerializeField] private Type _fieldName\`.
  - Constants: \`UPPER_SNAKE_CASE\`.
- MonoBehaviour lifecycle order: \`Awake\` → \`OnEnable\` → \`Start\` → \`FixedUpdate\` → \`Update\` → \`LateUpdate\` → \`OnDisable\` → \`OnDestroy\`.
  - Init dependencies in \`Awake\`, subscribe events in \`OnEnable\`, unsubscribe in \`OnDisable\`.
  - Never call heavy logic in \`Update\` that can be event-driven.
- Performance:
  - Cache every \`GetComponent<T>()\` call in \`Awake\`/\`Start\` — never in \`Update\`.
  - Never call \`FindObjectOfType\`, \`GameObject.Find\`, or \`Camera.main\` in \`Update\`.
  - Use **object pooling** for frequently spawned/destroyed objects.
  - Avoid LINQ in hot paths (allocates garbage). Use for-loops instead.
  - Minimize allocations inside \`Update\` — no \`new\`, no string concatenation.
  - Use \`WaitForSeconds\` cached instance in coroutines (not \`new WaitForSeconds()\` every frame).
- Physics:
  - All physics/Rigidbody movement must happen in \`FixedUpdate\`.
  - Use layers and \`LayerMask\` for collision filtering — never string-based layer lookup.
  - Prefer \`Rigidbody.MovePosition\` / \`MoveRotation\` over modifying \`transform\` directly on physics objects.
- Coroutines vs async:
  - Prefer coroutines for simple timed sequences.
  - Use \`async/await\` with \`UniTask\` (if available) for complex async flows.
  - Always stop coroutines in \`OnDisable\` / \`OnDestroy\`.
- Architecture:
  - Use \`ScriptableObject\` for shared data and configuration.
  - Prefer composition over inheritance. Avoid deep MonoBehaviour hierarchies.
  - Use events / UnityEvent / delegates to decouple components — avoid direct GetComponent calls across unrelated objects.
  - Use \`[RequireComponent(typeof(T))]\` to enforce hard dependencies.
- Scenes & Prefabs:
  - Keep prefabs self-contained. Avoid prefabs that depend on scene-specific objects.
  - Use \`Addressables\` or \`Resources.Load\` for dynamic asset loading — not hard references.
- Editor:
  - Use \`[Header]\`, \`[Tooltip]\`, \`[Space]\` for Inspector clarity.
  - Never use \`#if UNITY_EDITOR\` blocks inside runtime logic — put editor code in \`Editor/\` folders.
  - Custom editors and property drawers go in \`Assets/Editor/\`.
`;

   const stackMap = {
      ts: common + ts,
      react: common + ts + react,
      node: common + ts + nodeApi,
      python: common + python,
      unity: common + unity,
   };

   return stackMap[stack] || common + ts;
}
// --- GitHub Copilot (comprehensive) ---
function templatesCopilot({ stack, minimal }) {
   const files = {};

   // Main instructions file
   files['.github/copilot-instructions.md'] = baseRules({ stack });

   // --- Granular instruction files ---

   files['.github/instructions/00-style.instructions.md'] = `---
applyTo: "**"
---
# Style & Readability

## Functions
- Keep functions under 40 lines. If longer, extract helpers.
- One level of abstraction per function.
- Max 3 parameters. Use an options object for more.
- Name functions as verbs: \`createUser\`, \`validateInput\`, \`fetchOrders\`.

## Naming
- Variables/functions: \`camelCase\`
- Types/Classes/Components: \`PascalCase\`
- Constants: \`UPPER_SNAKE_CASE\`
- Files: \`kebab-case.ts\` or match existing convention
- Boolean vars: \`is\`, \`has\`, \`should\`, \`can\` prefix (\`isVisible\`, \`hasAccess\`)
- Event handlers: \`handle<Event>\` (\`handleClick\`, \`handleSubmit\`)

## Structure
- Early returns to reduce nesting. Max 2-3 indentation levels.
- Guard clauses at the top of functions.
- Group related code together. Separate with blank lines.
- Imports order: built-in -> external -> internal -> types -> styles.

## Comments
- Comments explain WHY, not WHAT. Code is self-documenting.
- Use JSDoc/TSDoc for public APIs with \`@param\`, \`@returns\`, \`@throws\`, \`@example\`.
- TODO format: \`// TODO(username): description (#issue-number)\`
- Remove commented-out code. Use git history instead.

## UI Theme & Colors
- Do NOT change existing colors, themes, or design tokens unless explicitly asked.
- Use design tokens / CSS variables / theme constants — never hardcode hex/rgb values inline.
- Reference the project's color palette. Do NOT invent new colors.
- Preserve the existing visual hierarchy (font sizes, spacing, border-radius, shadows).
- When adding new UI elements, match the closest existing component's style.
- Do NOT switch between light/dark mode behavior unless instructed.
- Do NOT change opacity, gradients, or color transformations on existing elements.
- If a design system (Tailwind, shadcn, MUI, etc.) is in use, use ONLY its tokens/classes.
- Before changing any visual property, ask: "Does this match the existing theme?"
`;

   // Unity-specific instruction file
   if (stack === 'unity') {
      files['.github/instructions/05-unity.instructions.md'] = `---
applyTo: "**/*.cs"
---
# Unity / C# Rules

## Lifecycle
- Init dependencies: \`Awake\`. Subscribe events: \`OnEnable\`. Unsubscribe: \`OnDisable\`.
- Physics / Rigidbody movement: \`FixedUpdate\` only.
- Never put heavy logic in \`Update\` that can be event-driven.

## Performance — Hot Path Rules
- Cache \`GetComponent<T>()\` in \`Awake\`/\`Start\`. NEVER in \`Update\`.
- Never call \`FindObjectOfType\`, \`GameObject.Find\`, or \`Camera.main\` in \`Update\`.
- Use object pooling for frequently spawned/destroyed objects.
- No LINQ in \`Update\` / \`FixedUpdate\` — use for-loops to avoid GC allocations.
- No \`new\`, no string concatenation inside hot loops.
- Cache \`WaitForSeconds\` — do not \`new WaitForSeconds()\` every coroutine iteration.

## Architecture
- Use \`ScriptableObject\` for shared config/data.
- Decouple with events (C# events / UnityEvent / delegates). Avoid cross-object \`GetComponent\` chains.
- \`[RequireComponent(typeof(T))]\` to enforce hard dependencies.
- Prefer composition over MonoBehaviour inheritance.

## Naming
- Methods, Properties, Classes: \`PascalCase\`.
- Private fields: \`_camelCase\`. Serialized private fields: \`[SerializeField]\`.
- Constants: \`UPPER_SNAKE_CASE\`.

## Prefabs & Assets
- Prefabs must be self-contained (no direct scene-object references).
- Dynamic loading: \`Addressables\` or \`Resources.Load\` — not serialized hard refs.

## Editor Code
- All editor scripts inside \`Assets/Editor/\`.
- Use \`[Header]\`, \`[Tooltip]\`, \`[Space]\` for Inspector clarity.
- No \`#if UNITY_EDITOR\` inside runtime MonoBehaviour logic.
`;
   }

   // Tailwind + shadcn/ui style guide for React stack
   if (stack === 'react') {
      files['.github/instructions/05-ui-style.instructions.md'] = `---
applyTo: "**/*.{tsx,jsx,css}"
---
# UI Style Guide (Tailwind + shadcn/ui)

## Theme
- Dark mode: class-based (\`dark\` class on html/body).
- Use semantic tokens ONLY:
  - \`background\` / \`foreground\`
  - \`primary\` / \`primary-foreground\`
  - \`secondary\` / \`secondary-foreground\`
  - \`muted\` / \`muted-foreground\`
  - \`accent\` / \`accent-foreground\`
  - \`destructive\` / \`destructive-foreground\`
  - \`border\` / \`ring\`
  - \`card\` / \`card-foreground\`
  - \`popover\` / \`popover-foreground\`

## Colors
- Do NOT hardcode hex/rgb colors in components.
- Use Tailwind semantic classes:
  - \`bg-background\`, \`text-foreground\`
  - \`bg-primary\`, \`text-primary-foreground\`
  - \`bg-muted\`, \`text-muted-foreground\`
  - \`border-border\`, \`ring-ring\`
- Do NOT invent new colors or override theme variables.
- Do NOT change existing color mappings unless explicitly asked.

## Radius
- Default: \`rounded-lg\` for cards, modals, buttons.
- Use \`rounded-md\` for small inputs, \`rounded-sm\` for chips/badges.
- Match existing border-radius patterns. Do NOT mix.

## Spacing
- Page padding: \`px-4 md:px-6\`
- Card padding: \`p-4\` (default), \`p-6\` for large sections.
- Use \`gap-2\` / \`gap-3\` / \`gap-4\` consistently (avoid random spacing).
- Section spacing: \`space-y-4\` or \`space-y-6\`.

## Components
- Prefer shadcn/ui components first. Do NOT build custom alternatives.
- Avoid custom button/input/dialog styles — use shadcn \`<Button>\`, \`<Input>\`, \`<Dialog>\`.
- When shadcn doesn't have a component, match its visual style.
- Do NOT change shadcn component defaults (variants, sizes) unless asked.

## Examples
- Card: \`className="rounded-lg border border-border bg-background p-4"\`
- Primary button: \`<Button variant="default" />\`
- Secondary button: \`<Button variant="secondary" />\`
- Muted text: \`className="text-sm text-muted-foreground"\`
- Page container: \`className="container mx-auto px-4 md:px-6"\`
`;
   }

   files['.github/instructions/10-typescript.instructions.md'] = `---
applyTo: "**/*.{ts,tsx}"
---
# TypeScript Rules

## Types
- Enable \`strict: true\`. Never weaken compiler options.
- No \`any\`. Use \`unknown\` + type guards, or the correct specific type.
- Avoid \`as\` assertions. If needed, add a comment explaining why.
- Use \`satisfies\` for config: \`const cfg = { ... } satisfies Config\`.
- Prefer \`interface\` for object shapes (extendable). \`type\` for unions.
- Use \`readonly\` for immutable data.
- Avoid \`enum\` - use \`as const\` objects with derived union types.
- Use \`import type\` for type-only imports.

## Patterns
- Discriminated unions for state: \`{ status: "loading" } | { status: "ok"; data: T }\`
- Result pattern for errors: \`{ ok: true; data: T } | { ok: false; error: E }\`
- Type narrowing with \`in\`, \`typeof\`, \`instanceof\`, custom type guards.
- Generic constraints: \`<T extends Base>\` not unbounded \`<T>\`.
- Utility types: \`Pick\`, \`Omit\`, \`Partial\`, \`Required\`, \`Record\`.

## Safety
- Handle \`null | undefined\` explicitly. Use optional chaining \`?.\` and nullish coalescing \`??\`.
- Exhaustive switch with \`never\` default: \`default: { const _: never = x; }\`
- Validate external data (API responses, env vars) at the boundary with Zod or similar.
- Prefer \`Map\`/\`Set\` over plain objects for dynamic keys.
`;

   files['.github/instructions/20-error-handling.instructions.md'] = `---
applyTo: "**/*.{ts,tsx,js,jsx}"
---
# Error Handling Rules

## Principles
- Never swallow errors. Handle or re-throw with added context.
- Use typed errors with error codes, not raw strings.
- Provide actionable error messages: what happened + how to fix.
- Log errors at the point of handling, not at every catch.

## Patterns
- Custom error classes extending \`Error\` with a \`code\` property.
- Result type: \`type Result<T, E = Error> = { ok: true; data: T } | { ok: false; error: E }\`
- Try/catch only at boundaries (API handlers, event listeners).
- Avoid \`catch (e) { console.log(e) }\` - always re-throw or return error state.

## Async Errors
- Always \`await\` promises or attach error handlers.
- Use \`Promise.allSettled()\` when some failures are acceptable.
- Handle stream errors and close events explicitly.

## User-Facing Errors
- Separate internal error details from user-facing messages.
- Never expose stack traces, SQL errors, or internal paths to users.
- Return consistent error shape: \`{ error: { code, message, details? } }\`.
`;

   files['.github/instructions/30-security.instructions.md'] = `---
applyTo: "**"
---
# Security Rules

## Secrets
- NEVER hardcode secrets, API keys, tokens, or passwords in source code.
- Use environment variables or secret managers.
- NEVER log secrets, tokens, or PII (personally identifiable information).
- Add secret patterns to \`.gitignore\` (\`.env\`, \`*.pem\`, \`*.key\`).

## Input Validation
- Validate ALL external inputs: HTTP requests, CLI args, file contents, env vars.
- Use allowlists, not blocklists for input validation.
- Sanitize user input before rendering (prevent XSS).
- Use parameterized queries for databases (prevent SQL injection).
- Validate file paths to prevent path traversal (\`../\` attacks).

## Authentication & Authorization
- Check auth on every request, not just at the route level.
- Use constant-time comparison for secrets/tokens.
- Hash passwords with bcrypt/argon2. Never store plaintext.
- Set appropriate token expiration times.

## Headers & Transport
- Use HTTPS everywhere. Set HSTS headers.
- Configure Content-Security-Policy (CSP).
- Set \`X-Content-Type-Options: nosniff\`.
- Configure CORS with specific origins, not \`*\` in production.
`;

   files['.github/instructions/40-testing.instructions.md'] = `---
applyTo: "**/*.{test,spec}.{ts,tsx,js,jsx}"
---
# Testing Rules

## When to Write Tests
- Every new feature must have tests.
- Every bug fix must have a regression test.
- Refactors must not break existing tests.
- Test edge cases: empty inputs, null, boundaries, large datasets.

## Test Structure
- Arrange-Act-Assert (AAA) pattern.
- One assertion concept per test (can have multiple \`expect\` for one concept).
- Descriptive names: \`should <expected behavior> when <condition>\`.
- Group related tests with \`describe\` blocks.

## Test Quality
- Tests must be deterministic. Mock: time, random, network, file system.
- Prefer table-driven / parameterized tests for multiple similar cases.
- Test behavior, not implementation. Don't test private methods directly.
- Avoid testing framework internals or third-party library behavior.

## Mocking
- Mock at boundaries: HTTP calls, database, file system, external APIs.
- Do NOT mock the module under test.
- Use dependency injection to make code testable.
- Reset mocks between tests to prevent leakage.

## Coverage
- Aim for meaningful coverage, not 100% line coverage.
- Critical paths (auth, payments, data mutations) must have thorough tests.
- Integration tests for API endpoints and data flows.
- E2E tests for critical user journeys.
`;

   files['.github/instructions/50-performance.instructions.md'] = `---
applyTo: "**/*.{ts,tsx,js,jsx}"
---
# Performance Rules

## Principles
- Correctness FIRST, then optimize when measured to be slow.
- Profile before optimizing. Don't guess bottlenecks.
- Document WHY an optimization was made (with benchmarks if possible).

## Data Fetching
- Avoid N+1 queries. Use batch loading, joins, or DataLoader.
- Paginate list responses. Never return unbounded result sets.
- Use database indexes for frequently filtered/sorted columns.
- Cache expensive queries / computations with appropriate TTL.

## Frontend
- Lazy load routes and heavy components (\`React.lazy\` / dynamic import).
- Debounce user input handlers (search, resize, scroll).
- Virtualize long lists (react-window, tanstack-virtual).
- Optimize images: proper format, sizing, lazy loading.
- Minimize re-renders: \`React.memo\`, \`useMemo\`, \`useCallback\` when measurably helpful.

## Backend
- Stream large responses instead of buffering.
- Use connection pooling for databases.
- Avoid synchronous I/O in request handlers.
- Set appropriate cache headers (ETags, Cache-Control).
`;

   files['.github/instructions/90-pr-checklist.instructions.md'] = `---
applyTo: "**"
---
# PR Checklist

Before submitting any change, verify:

## Correctness
- [ ] Types are correct, no implicit \`any\`
- [ ] Edge cases handled (null, empty, boundary values)
- [ ] Error states handled with proper messages
- [ ] No regressions to existing functionality

## Quality
- [ ] Minimal diff - only changes needed for the task
- [ ] No dead code, commented-out code, or console.logs
- [ ] Functions < 40 lines, max 3 params
- [ ] Naming is clear and consistent with codebase

## Safety
- [ ] No secrets, keys, or PII in code or logs
- [ ] Inputs validated at boundaries
- [ ] No new dependencies added without approval
- [ ] SQL uses parameterized queries (if applicable)

## Testing
- [ ] Tests added/updated for the change
- [ ] Tests are deterministic (no flaky tests)
- [ ] Edge cases covered in tests

## Documentation
- [ ] Public APIs documented with JSDoc/TSDoc
- [ ] Breaking changes noted (if any)
- [ ] README updated (if applicable)
`;
   // --- Prompts (detailed workflow guides) ---
   if (!minimal) {
      files['.github/prompts/implement-feature.prompt.md'] = `# Implement Feature

## Context
- Feature: <describe the feature in detail>
- Related files: <list key files>
- Acceptance criteria: <list specific criteria>

## Instructions
1. Read all related files first. Understand the current architecture.
2. Plan your approach in 2-3 sentences. Identify affected components.
3. Implement with minimal changes. Follow existing patterns.
4. Add comprehensive tests (happy path + edge cases + error cases).
5. Update types/interfaces if needed.
6. Verify no regressions to existing functionality.

## Constraints
- Minimal diff. Do not refactor unrelated code.
- No new dependencies without explicit approval.
- Keep public API backward compatible.
- All existing tests must still pass.

## Deliverables
1. **Plan** - approach explanation
2. **Implementation** - code changes with file paths
3. **Tests** - comprehensive test coverage
4. **Edge cases** - boundary conditions considered
`;

      files['.github/prompts/fix-bug.prompt.md'] = `# Fix Bug

## Bug Report
- Description: <what is broken>
- Steps to reproduce: <exact steps>
- Expected behavior: <what should happen>
- Actual behavior: <what happens instead>
- Environment: <OS, browser, Node version, etc.>

## Instructions
1. Reproduce the bug mentally by reading the relevant code path.
2. Identify the root cause. Explain WHY it happens, not just WHERE.
3. Write a failing test that demonstrates the bug.
4. Implement the minimal fix.
5. Verify the test now passes.
6. Check for similar bugs in related code paths.
7. Add regression test to prevent recurrence.

## Deliverables
1. **Root cause analysis** - why the bug occurs
2. **Failing test** - proves the bug exists
3. **Fix** - minimal code change
4. **Regression test** - prevents recurrence
5. **Related risks** - could this bug exist elsewhere?
`;

      files['.github/prompts/refactor.prompt.md'] = `# Refactor

## Target
- File/Module: <path to refactor>
- Current problem: <why refactor - complexity, duplication, readability>
- Goal: <desired outcome>

## Instructions
1. Read the entire file/module and understand all its responsibilities.
2. Identify all callers/consumers of the code being refactored.
3. Plan the refactoring steps (each step should leave code working).
4. Make incremental changes. Each step must keep all tests passing.
5. Do NOT change external behavior. Same inputs -> same outputs.
6. Update tests if internal structure changes, but test the same behaviors.

## Constraints
- Zero behavior changes. This is a pure refactor.
- All existing tests must pass after refactoring.
- Do not change function signatures used by other modules.
- Each commit should be a single, reviewable logical step.

## Deliverables
1. **Analysis** - current problems identified
2. **Plan** - step-by-step refactoring approach
3. **Changes** - incremental code changes
4. **Verification** - all tests pass, no behavior change
`;

      files['.github/prompts/code-review.prompt.md'] = `# Code Review

## What to Review
- File(s): <file paths or PR link>
- Context: <what the change is about>

## Review Checklist
Analyze the code for:

### Correctness
- Does the logic handle all cases correctly?
- Are edge cases handled (null, empty, max/min, concurrent)?
- Are error paths handled properly?

### Security
- Any hardcoded secrets or credentials?
- Is user input validated and sanitized?
- Are there SQL injection, XSS, or path traversal risks?

### Performance
- Any N+1 queries or unbounded loops?
- Is there unnecessary data fetching or computation?
- Are there memory leaks (unclosed resources, growing arrays)?

### Maintainability
- Are functions small and single-purpose?
- Is naming clear and consistent?
- Could future developers understand this code easily?

### Testing
- Are tests comprehensive? (happy path + edge cases + errors)
- Are tests deterministic?
- Is test coverage adequate for the change?

## Output Format
For each issue found:
- **Severity**: critical / warning / suggestion / nit
- **Location**: file:line
- **Issue**: what is wrong
- **Fix**: suggested improvement
`;

      files['.github/prompts/write-tests.prompt.md'] = `# Write Tests

## Target
- File/Function: <path to test>
- Test file: <path to test file, or "create new">

## Instructions
1. Read the source code thoroughly. Understand all code paths.
2. Identify test scenarios:
   - Happy path (normal usage)
   - Edge cases (empty, null, boundary values, max/min)
   - Error cases (invalid input, network failure, timeout)
   - Concurrent/race conditions (if applicable)
3. Write tests using Arrange-Act-Assert pattern.
4. Use descriptive test names: \`should <expected> when <condition>\`.
5. Mock external dependencies (API calls, DB, file system).
6. Tests must be deterministic - mock time, random, network.

## Test Template
\`\`\`
describe("<ModuleName>", () => {
  describe("<functionName>", () => {
    it("should <expected behavior> when <condition>", () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
\`\`\`

## Constraints
- Do NOT test implementation details. Test behavior.
- Do NOT mock the module under test.
- Each test should be independent (no shared mutable state).
- Reset all mocks between tests.
`;

      files['.github/prompts/explain-code.prompt.md'] = `# Explain Code

## Target
- File/Function: <path or paste code>
- Depth: <high-level overview / detailed walkthrough / line-by-line>

## Instructions
Provide a structured explanation:

1. **Purpose** - What does this code do? (1-2 sentences)
2. **Architecture** - How is it structured? Key components/modules.
3. **Data Flow** - How does data move through the system?
4. **Key Decisions** - Why was it built this way? Trade-offs made.
5. **Dependencies** - What external libraries/services does it use?
6. **Edge Cases** - How are errors and edge cases handled?
7. **Potential Issues** - Any risks, tech debt, or improvement opportunities.

## Output Format
- Use headers and bullet points for clarity.
- Include code snippets when referencing specific parts.
- Highlight any areas that seem fragile or unclear.
`;
   }

   return files;
}
// --- Cursor (comprehensive .mdc rules) ---
function templatesCursor({ stack, minimal }) {
   const files = {};

   files['.cursor/rules/base.mdc'] = `---
description: Base coding rules for AI assistant
globs: 
alwaysApply: true
---
${baseRules({ stack })}
`;

   files['.cursor/rules/style.mdc'] = `---
description: Style and readability conventions
globs: 
alwaysApply: true
---
# Style & Readability

## Workflow
- Read existing code BEFORE writing. Match current patterns.
- Plan your approach before coding. Think step-by-step.
- When editing: propose the SMALLEST viable diff.
- If unsure about context: ask instead of guessing.

## Code Style
- Small functions (< 40 lines). Extract helpers aggressively.
- Explicit naming > abbreviations. \`getUserById\` not \`getUsr\`.
- Early returns to reduce nesting. Max 2-3 levels.
- Comments explain WHY, not WHAT.
- Group imports: built-in -> external -> internal -> types.

## Naming Conventions
- Variables/functions: camelCase
- Types/Classes: PascalCase
- Constants: UPPER_SNAKE_CASE
- Booleans: is/has/should/can prefix
- Event handlers: handle<Event>

## UI Theme & Colors
- Do NOT change existing colors, themes, or design tokens unless explicitly asked.
- Use design tokens / CSS variables / theme constants — never hardcode colors inline.
- Reference the project's color palette. Do NOT invent new colors.
- Preserve existing visual hierarchy (font sizes, spacing, shadows).
- Match the closest existing component's style for new UI elements.
- Do NOT switch light/dark mode or change opacity/gradients unless instructed.
- If a design system is in use, use ONLY its tokens/classes.
`;

   // Unity-specific Cursor rules
   if (stack === 'unity') {
      files['.cursor/rules/unity.mdc'] = [
         '---',
         'description: Unity C# patterns and performance rules',
         'globs: "**/*.cs"',
         'alwaysApply: true',
         '---',
         '# Unity / C# Rules',
         '',
         '## Lifecycle',
         '- Awake: init/cache. OnEnable: subscribe. OnDisable: unsubscribe. FixedUpdate: physics.',
         '- Never run heavy logic in Update that can be event-driven.',
         '',
         '## Performance',
         '- Cache GetComponent<T>() in Awake/Start — NEVER in Update.',
         '- No FindObjectOfType / GameObject.Find / Camera.main in Update.',
         '- Object pooling for frequently spawned objects.',
         '- No LINQ in hot loops — use for-loops to avoid GC.',
         '- No `new` allocations inside Update/FixedUpdate.',
         '- Cache WaitForSeconds instances.',
         '',
         '## Architecture',
         '- ScriptableObject for shared data/config.',
         '- Decouple with C# events / UnityEvent / delegates.',
         '- [RequireComponent] to enforce hard dependencies.',
         '- Composition over MonoBehaviour inheritance.',
         '',
         '## Naming',
         '- Methods/Properties/Classes: PascalCase.',
         '- Private fields: _camelCase. Serialized: [SerializeField] private Type _field.',
         '- Constants: UPPER_SNAKE_CASE.',
         '',
         '## Editor Code',
         '- All editor scripts in Assets/Editor/.',
         '- Use [Header], [Tooltip], [Space] for Inspector UX.',
         '- No #if UNITY_EDITOR inside runtime MonoBehaviour logic.',
         '',
      ].join('\n');
   }

   // Tailwind + shadcn style guide for React stack
   if (stack === 'react') {
      files['.cursor/rules/ui-style.mdc'] = [
         '---',
         'description: Tailwind + shadcn/ui style guide',
         'globs: "**/*.{tsx,jsx,css}"',
         'alwaysApply: true',
         '---',
         '# UI Style Guide (Tailwind + shadcn/ui)',
         '',
         '## Theme',
         '- Dark mode: class-based (`dark` class on html/body).',
         '- Use semantic tokens ONLY: background/foreground, primary/primary-foreground,',
         '  secondary/secondary-foreground, muted/muted-foreground, accent/accent-foreground,',
         '  destructive/destructive-foreground, border/ring, card/card-foreground, popover/popover-foreground.',
         '',
         '## Colors',
         '- Do NOT hardcode hex/rgb colors. Use Tailwind semantic classes:',
         '  bg-background, text-foreground, bg-primary, text-primary-foreground, bg-muted,',
         '  text-muted-foreground, border-border, ring-ring.',
         '- Do NOT invent new colors or override theme variables.',
         '',
         '## Radius',
         '- rounded-lg for cards/modals/buttons, rounded-md for inputs, rounded-sm for chips.',
         '',
         '## Spacing',
         '- Page: px-4 md:px-6. Cards: p-4 (default), p-6 (large).',
         '- Use gap-2/gap-3/gap-4 consistently. Sections: space-y-4 or space-y-6.',
         '',
         '## Components',
         '- Prefer shadcn/ui first. Do NOT build custom alternatives.',
         '- Use shadcn variants, do NOT change defaults unless asked.',
         '',
      ].join('\n');
   }

   files['.cursor/rules/error-handling.mdc'] = `---
description: Error handling patterns
globs: "**/*.{ts,tsx,js,jsx,py}"
alwaysApply: true
---
# Error Handling

- Never swallow errors silently. Handle or re-throw with context.
- Use typed errors with error codes, not raw strings.
- Validate inputs at system boundaries.
- Provide actionable error messages.
- Handle null/undefined/empty states explicitly.
- Try/catch only at boundaries (API handlers, event listeners).
- Custom error classes with \`code\` property for programmatic handling.
`;

   files['.cursor/rules/security.mdc'] = `---
description: Security rules
globs: 
alwaysApply: true
---
# Security

- NEVER hardcode secrets, API keys, or passwords.
- NEVER log credentials, tokens, or PII.
- Validate and sanitize ALL user inputs.
- Parameterized queries only (no string concatenation for SQL).
- Validate file paths to prevent traversal attacks.
- Use HTTPS, set security headers (CSP, HSTS, nosniff).
`;

   if (!minimal) {
      files['.cursor/rules/testing.mdc'] = `---
description: Testing conventions and requirements
globs: "**/*.{test,spec}.{ts,tsx,js,jsx,py}"
alwaysApply: false
---
# Testing Rules

## When to Write Tests
- Every new feature must have tests.
- Every bug fix needs a regression test.
- Edge cases: null, empty, boundary values, error states.

## How to Write Tests
- Arrange-Act-Assert pattern.
- Descriptive names: should <expected> when <condition>.
- Deterministic: mock time, random, network, file system.
- Table-driven tests for similar scenarios.
- Mock at boundaries, not internals.
- Each test independent, no shared mutable state.
`;

      files['.cursor/rules/performance.mdc'] = `---
description: Performance guidelines
globs: "**/*.{ts,tsx,js,jsx}"
alwaysApply: false
---
# Performance

- Correctness first. Optimize only when measured to be slow.
- Avoid N+1 queries. Batch database operations.
- Paginate list responses. No unbounded result sets.
- Lazy load routes and heavy components.
- Debounce user input handlers.
- Use connection pooling for databases.
- Stream large responses instead of buffering.
`;
   }

   return files;
}

// --- Windsurf (comprehensive) ---
function templatesWindsurf({ stack }) {
   return {
      '.windsurfrules':
         baseRules({ stack }) +
         `
## Windsurf-Specific Behavior

### Workflow
- ALWAYS read related files before making changes.
- Plan your approach before writing code.
- Propose the smallest viable diff for each change.
- If unsure about context, ask before assuming.

### Code Changes
- Follow existing patterns in the codebase exactly.
- Do not refactor unrelated code in the same change.
- Verify changes compile and pass lint before finishing.
- Add tests for any new logic or bug fixes.

### Communication
- Explain your reasoning before showing code.
- When multiple approaches exist, briefly list trade-offs.
- Flag potential risks or side effects proactively.
`,
   };
}

// --- Claude Code (comprehensive) ---
function templatesClaude({ stack }) {
   return {
      'CLAUDE.md':
         baseRules({ stack }) +
         `
## Claude Code Behavior

### Before Writing Code
- Read existing files and understand the project structure.
- Check existing patterns, naming conventions, and architecture.
- Look at related tests to understand expected behavior.
- Never invent new architectural patterns without being asked.

### While Writing Code
- Make minimal, focused changes. One logical concept per edit.
- Follow the established code style exactly (indentation, naming, patterns).
- Add comprehensive error handling for all new code paths.
- Include tests for new functionality.

### After Writing Code
- Verify changes compile/lint successfully.
- Run existing tests to check for regressions.
- Summarize what was changed and why.
- Flag any risks, trade-offs, or follow-up items.

### Communication Style
- Be direct and concise. Lead with the answer.
- Show code changes with file paths.
- Explain non-obvious decisions.
- When uncertain, say so and explain your reasoning.
`,
   };
}

// --- Cline (comprehensive) ---
function templatesCline({ stack }) {
   return {
      '.clinerules':
         baseRules({ stack }) +
         `
## Cline-Specific Behavior

### Workflow
- ALWAYS read relevant files before making any changes.
- Propose a detailed plan before implementing.
- Execute changes incrementally - one file at a time.
- Verify each change compiles before moving to the next.

### Code Quality
- Follow existing code patterns and conventions exactly.
- Keep diffs minimal and focused on the task.
- Do not refactor or clean up unrelated code.
- Add tests for new features and bug fixes.

### Error Recovery
- If a change breaks something, explain what went wrong.
- Propose a fix before continuing with other changes.
- Never leave the codebase in a broken state.

### Communication
- Show your plan before executing.
- Explain each significant change as you make it.
- Summarize all changes when done.
- Flag any concerns or follow-up items.
`,
   };
}

// --- Generic / Agents (comprehensive) ---
function templatesGeneric({ stack }) {
   return {
      'AGENTS.md':
         baseRules({ stack }) +
         `
## Agent Behavior Guidelines

### Before Starting
- Read and understand the project structure.
- Identify existing patterns, conventions, and dependencies.
- Ask for clarification if the task is ambiguous.

### During Implementation
- Follow existing patterns exactly. Do not introduce new ones.
- Make the smallest possible change that solves the problem.
- Add tests for new functionality.
- Handle errors and edge cases explicitly.

### After Completing
- Verify all changes compile and tests pass.
- Summarize what was changed and why.
- Note any risks, trade-offs, or follow-up needed.

### Note
This is a tool-agnostic rules file. If your IDE uses a specific
filename (e.g., \`.cursorrules\`, \`CLAUDE.md\`, \`.windsurfrules\`),
copy this content to the appropriate location.
`,
   };
}
// ================================================================
//  Target registry
// ================================================================
const TARGETS = [
   {
      key: 'copilot',
      label: 'GitHub Copilot',
      desc: '.github/ (instructions + prompts)',
      gen: (cfg) => templatesCopilot(cfg),
   },
   {
      key: 'cursor',
      label: 'Cursor',
      desc: '.cursor/rules/*.mdc',
      gen: (cfg) => templatesCursor(cfg),
   },
   {
      key: 'windsurf',
      label: 'Windsurf',
      desc: '.windsurfrules',
      gen: (cfg) => templatesWindsurf(cfg),
   },
   {
      key: 'claude',
      label: 'Claude Code',
      desc: 'CLAUDE.md',
      gen: (cfg) => templatesClaude(cfg),
   },
   {
      key: 'cline',
      label: 'Cline',
      desc: '.clinerules',
      gen: (cfg) => templatesCline(cfg),
   },
   {
      key: 'generic',
      label: 'Generic / Agents',
      desc: 'AGENTS.md',
      gen: (cfg) => templatesGeneric(cfg),
   },
];

const STACKS = [
   { key: 'ts', label: 'TypeScript (generic)' },
   { key: 'react', label: 'React / Next.js' },
   { key: 'node', label: 'Node.js API' },
   { key: 'python', label: 'Python' },
   { key: 'unity', label: 'Unity (C#)' },
];

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
      stack = 'ts';
      console.log(dim('\nUsing defaults: Copilot + Generic, TypeScript stack.\n'));
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
