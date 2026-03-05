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
  \`\`\`tsx
  // ✓ const useFetchUser = (id: string) => { /* data logic */ }
  // ✗ fetching data directly inside JSX render
  \`\`\`
- SHOULD avoid unnecessary re-renders and state mutation.
  \`\`\`tsx
  // ✓ setState(prev => ({ ...prev, count: prev.count + 1 }))
  // ✗ state.count++; setState(state)
  \`\`\`
`,
};

export function reactRules(verbosity = 'standard') {
   return REACT_RULES[verbosity] ?? REACT_RULES.standard;
}
