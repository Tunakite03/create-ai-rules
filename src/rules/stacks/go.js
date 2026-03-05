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
  \`\`\`go
  // ✓ if err != nil { return fmt.Errorf("load config: %w", err) }
  // ✗ if err != nil { return err }  // loses context
  \`\`\`
- MUST pass context for I/O and cancellation.
  \`\`\`go
  // ✓ func FetchUser(ctx context.Context, id string) (*User, error)
  // ✗ func FetchUser(id string) (*User, error)  // no cancellation
  \`\`\`
- SHOULD bound goroutines and protect shared state.
`,
};

export function goRules(verbosity = 'standard') {
   return GO_RULES[verbosity] ?? GO_RULES.standard;
}
