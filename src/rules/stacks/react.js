const REACT_RULES = {
   minimal: `## React
- Prefer functional components and hooks.
`,
   standard: `## React
- Use functional components + hooks only.
- Keep components presentational; move data logic to hooks/services.
`,
   strict: `## React
- MUST use functional components and hooks.
- SHOULD keep UI components focused and extract reusable hook logic.
- SHOULD avoid unnecessary re-renders and state mutation.
`,
};

export function reactRules(verbosity = 'standard') {
   return REACT_RULES[verbosity] ?? REACT_RULES.standard;
}
