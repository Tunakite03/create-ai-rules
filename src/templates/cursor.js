import { baseRules } from '../rules.js';
import { buildSkills } from '../skills.js';

// --- Cursor (comprehensive .mdc rules) ---
export function templatesCursor({ stack, minimal }) {
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

   // --- PR Checklist ---
   files['.cursor/rules/pr-checklist.mdc'] = `---
description: Pull request quality checklist
globs:
alwaysApply: false
---
# PR Checklist

## Before Submitting
- [ ] Code compiles with zero warnings.
- [ ] All existing tests pass.
- [ ] New code has tests (happy path + edge cases + errors).
- [ ] Minimal diff — only changes needed for the task.
- [ ] No debug logs, console.log, commented-out code.
- [ ] No hardcoded secrets, tokens, or credentials.
- [ ] Typed errors (no raw string throws).
- [ ] Inputs validated at boundaries.
- [ ] Accessible: labels, alt text, keyboard nav where applicable.
- [ ] Breaking changes documented.
- [ ] PR description explains WHY, not just WHAT.
`;

   // --- Skills (remapped to .cursor/skills/) ---
   if (!minimal) {
      const skills = buildSkills({ stack });
      for (const [k, v] of Object.entries(skills)) {
         files[k.replace('.github/skills/', '.cursor/skills/')] = v;
      }
   }

   return files;
}
