const GO_RULES = {
   minimal: `## Go
- Check errors immediately and return context.
`,
   standard: `## Go
- Check errors immediately and wrap with context.
- Pass \`context.Context\` for cancellable I/O.
- Keep goroutines cancelable and synchronized.
- Follow Standard Go Project Layout: \`cmd/\` for entry points, \`internal/\` for private code, \`pkg/\` for public libraries.
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
- MUST follow Standard Go Project Layout:
  \`\`\`
  cmd/
  ├── <app>/
  │   └── main.go                # Application entry point
  internal/                      # Private application code
  ├── <domain>/
  │   ├── handler.go             # HTTP/gRPC handlers
  │   ├── service.go             # Business logic
  │   ├── repository.go          # Data access
  │   ├── model.go               # Domain types
  │   └── handler_test.go
  ├── config/                    # App configuration
  ├── middleware/                # HTTP middleware
  └── platform/                  # DB, cache, queue clients
  pkg/                           # Public reusable libraries
  ├── <lib>/
  migrations/                    # Database migrations
  \`\`\`
- SHOULD bound goroutines and protect shared state.
`,
};

export function goRules(verbosity = 'standard') {
   return GO_RULES[verbosity] ?? GO_RULES.standard;
}
