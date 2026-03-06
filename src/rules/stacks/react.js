const REACT_RULES = {
   minimal: `## React
- Prefer functional components and hooks.
- Keep components small and focused; extract logic to custom hooks.
- Use TypeScript for all components with explicit prop interfaces.
`,
   standard: `## React
- Use functional components + hooks only. No class components.
- Keep components presentational; move data logic to hooks/services.
- Export explicit Props interfaces: \`interface ComponentProps { ... }\`
- Use \`useCallback\` for handlers passed to children; \`useMemo\` for expensive computations.
- Handle loading, error, and empty states explicitly in components.
- Prefer controlled components for forms; validate with libraries (react-hook-form + zod).
`,
   strict: `## React
- MUST use functional components with explicit TypeScript prop interfaces.
  \`\`\`tsx
  // ✓ interface UserCardProps { user: User; onSelect: (id: string) => void }
  // ✗ const UserCard = ({ user, onSelect }: any) => ...
  \`\`\`
- MUST keep components focused under 100 lines; extract hooks for reusable logic.
  \`\`\`tsx
  // ✓ const useFetchUser = (id: string) => { /* data logic */ }
  // ✗ fetching data directly inside JSX render
  \`\`\`
- MUST avoid unnecessary re-renders and state mutation.
  \`\`\`tsx
  // ✓ setState(prev => ({ ...prev, count: prev.count + 1 }))
  // ✗ state.count++; setState(state)
  \`\`\`
- MUST handle all states: loading, error, empty, success.
  \`\`\`tsx
  // ✓ if (isLoading) return <Skeleton />; if (error) return <ErrorBoundary />; if (!data.length) return <Empty />
  // ✗ return data.map(item => ...) // crashes on undefined
  \`\`\`
- SHOULD use error boundaries for component-level error recovery.
- SHOULD memoize expensive computations and callbacks passed to children.
- SHOULD use controlled components with explicit validation for forms.
- SHOULD colocate related components, hooks, and tests in feature folders.
`,
};

export function reactRules(verbosity = 'standard') {
   return REACT_RULES[verbosity] ?? REACT_RULES.standard;
}
