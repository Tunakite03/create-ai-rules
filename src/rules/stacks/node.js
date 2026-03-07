const NODE_RULES = {
   minimal: `## Node.js
- Validate input and return consistent errors.
`,
   standard: `## Node.js
- Validate request input at boundaries.
- Return typed/structured errors with clear status codes.
- Avoid blocking synchronous I/O in request paths.
- Organize by feature modules; colocate routes, handlers, and services per domain.
`,
   strict: `## Node.js
- MUST validate input and emit consistent error payloads.
- MUST avoid blocking synchronous I/O in server request paths.
- MUST follow feature-module folder structure:
  \`\`\`
  src/
  ├── index.ts                   # App entry point
  ├── config/                    # Environment & app configuration
  │   ├── env.ts
  │   └── database.ts
  ├── modules/                   # Feature modules
  │   └── <feature>/
  │       ├── <feature>.routes.ts
  │       ├── <feature>.controller.ts
  │       ├── <feature>.service.ts
  │       ├── <feature>.repository.ts
  │       ├── <feature>.types.ts
  │       └── <feature>.test.ts
  ├── middleware/                # Shared middleware (auth, logging, errors)
  ├── lib/                       # Shared utilities, helpers
  └── types/                     # Global TypeScript definitions
  \`\`\`
- SHOULD use bounded concurrency and connection pooling.
`,
};

export function nodeRules(verbosity = 'standard') {
   return NODE_RULES[verbosity] ?? NODE_RULES.standard;
}
