import { baseRules } from '../rules.js';
import { buildSkills } from '../skills.js';
import { renderBullets, sharedBehavior } from './shared-behavior.js';

function instructionHeader(applyTo) {
   return `---\napplyTo: "${applyTo}"\n---\n`;
}

// --- GitHub Copilot (comprehensive) ---
export function templatesCopilot({ stacks, minimal, full = false, verbosity = 'standard' }) {
   const files = {};

   // Main instructions file
   files['.github/copilot-instructions.md'] = baseRules({ stacks, full, verbosity });

   // --- Granular instruction files ---

   files['.github/instructions/00-style.instructions.md'] =
      instructionHeader('**') +
      `# Style & Readability

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

## Workflow
${renderBullets([
         ...sharedBehavior.readBeforeWrite,
         'Propose the smallest safe diff before implementing.',
      ])}

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
   if (stacks.includes('unity')) {
      files['.github/instructions/05-unity.instructions.md'] =
         instructionHeader('**/*.cs') +
         `# Unity / C# Rules

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
   if (stacks.includes('react')) {
      files['.github/instructions/05-ui-style.instructions.md'] =
         instructionHeader('**/*.{tsx,jsx,css}') +
         `# UI Style Guide (Tailwind + shadcn/ui)

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

   // Go-specific instruction file
   if (stacks.includes('go')) {
      files['.github/instructions/05-go.instructions.md'] =
         instructionHeader('**/*.go') +
         `# Go Rules

## Error Handling
- Check errors immediately: \`if err != nil { return fmt.Errorf("context: %w", err) }\`.
- Wrap errors with \`%w\` for context. Use \`errors.Is()\` / \`errors.As()\` for checking.
- Never silently ignore errors. \`_ = fn()\` is a code smell.

## Naming
- Exported: \`PascalCase\`. Unexported: \`camelCase\`.
- Interfaces: \`-er\` suffix for single-method (\`Reader\`, \`Writer\`).
- Packages: short, lowercase, no underscores.
- Avoid stutter: \`http.Server\` not \`http.HTTPServer\`.

## Concurrency
- Share memory by communicating (channels), not by sharing memory.
- Always use \`sync.WaitGroup\` or \`errgroup.Group\` to wait for goroutines.
- Never start a goroutine without a way to stop it.
- Use \`context.Context\` for cancellation and timeouts.

## Functions
- Accept interfaces, return structs.
- First param: \`ctx context.Context\` for I/O or cancellable ops.
- Last return: \`error\` (by convention).
- Use \`defer\` for cleanup.

## Performance
- Pre-allocate slices: \`make([]T, 0, cap)\`.
- Use \`strings.Builder\` for concatenation.
- No \`reflect\` in hot paths.
- Profile with \`pprof\` before optimizing.

## Testing
- Table-driven tests with \`t.Run()\`.
- \`httptest.NewServer\` for HTTP handler tests.
- \`t.Cleanup()\` for teardown.
`;
   }

   // Flutter-specific instruction file
   if (stacks.includes('flutter')) {
      files['.github/instructions/05-flutter.instructions.md'] =
         instructionHeader('**/*.dart') +
         `# Flutter / Dart Rules

## Widgets
- Use \`const\` constructors wherever possible.
- Prefer \`StatelessWidget\` when no mutable state needed.
- Keep widgets small. Extract sub-widgets aggressively.
- No business logic in widgets — delegate to controllers/blocs.

## State Management
- Keep state immutable — use \`copyWith()\` or \`freezed\`.
- Dispose controllers/streams in \`dispose()\`.
- Use \`AsyncValue\` for async state (loading, error, data).

## Naming
- Classes: \`PascalCase\`. Variables/functions: \`camelCase\`.
- Files/packages: \`snake_case\`. Private: \`_camelCase\`.
- Constants: \`camelCase\` (Dart convention, not UPPER_SNAKE).

## Null Safety
- Dart 3+ null safety enforced. Never use \`!\` unless provably safe.
- Prefer \`??\` (null coalescing) and \`?.\` (null-aware access).

## Performance
- \`ListView.builder\` for long lists (never \`ListView(children:)\` with 100+ items).
- Scope \`setState()\` to smallest widget. Avoid full-screen rebuilds.
- Use \`RepaintBoundary\` for complex animations.
- Profile with Flutter DevTools.

## Architecture
- Layers: Presentation → Application → Domain → Data.
- Repository pattern for data access.
- Navigation: \`go_router\` with typed routes.
`;
   }

   files['.github/instructions/10-typescript.instructions.md'] =
      instructionHeader('**/*.{ts,tsx}') +
      `# TypeScript Rules

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

   files['.github/instructions/20-error-handling.instructions.md'] =
      instructionHeader('**/*.{ts,tsx,js,jsx}') +
      `# Error Handling Rules

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

   files['.github/instructions/30-security.instructions.md'] =
      instructionHeader('**') +
      `# Security Rules

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

   files['.github/instructions/40-testing.instructions.md'] =
      instructionHeader('**/*.{test,spec}.{ts,tsx,js,jsx}') +
      `# Testing Rules

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

   files['.github/instructions/50-performance.instructions.md'] =
      instructionHeader('**/*.{ts,tsx,js,jsx}') +
      `# Performance Rules

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

   files['.github/instructions/90-pr-checklist.instructions.md'] =
      instructionHeader('**') +
      `# PR Checklist

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

   // --- Skills (task-specific templates) ---
   if (!minimal) {
      const skills = buildSkills({ stacks });
      Object.assign(files, skills);
   }

   return files;
}
