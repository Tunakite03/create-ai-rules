const QUALITY_BY_VERBOSITY = {
   minimal: `## Quality
- Prefer clear names and early returns.
- Keep functions small and single-purpose.
- Do not refactor unrelated code.
`,
   standard: `## Quality
- Use explicit naming and single-responsibility functions.
- Prefer early returns to reduce nesting.
- Avoid broad refactors unrelated to the task.
- Preserve public APIs unless explicitly requested.
- Handle null/undefined/empty states explicitly.
`,
   strict: `## Quality
- Keep functions small and focused; extract helpers when clarity improves.
- Prefer immutable/pure logic where practical.
- Preserve public APIs, contracts, and behavior unless asked to change them.
- Never swallow errors; add actionable context.
- Add tests for new behavior and regression coverage for fixes.
`,
};

export function qualityRules(verbosity = 'standard') {
   return QUALITY_BY_VERBOSITY[verbosity] ?? QUALITY_BY_VERBOSITY.standard;
}
