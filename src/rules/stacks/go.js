const GO_RULES = {
   minimal: `## Go
- Check errors immediately and return context.
`,
   standard: `## Go
- Check errors immediately and wrap with context.
- Pass \`context.Context\` for cancellable I/O.
- Keep goroutines cancelable and synchronized.
`,
   strict: `## Go
- MUST check and wrap errors at call sites.
- MUST pass context for I/O and cancellation.
- SHOULD bound goroutines and protect shared state.
`,
};

export function goRules(verbosity = 'standard') {
   return GO_RULES[verbosity] ?? GO_RULES.standard;
}
