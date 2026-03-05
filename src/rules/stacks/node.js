const NODE_RULES = {
   minimal: `## Node.js
- Validate input and return consistent errors.
`,
   standard: `## Node.js
- Validate request input at boundaries.
- Return typed/structured errors with clear status codes.
- Avoid blocking synchronous I/O in request paths.
`,
   strict: `## Node.js
- MUST validate input and emit consistent error payloads.
- MUST avoid blocking synchronous I/O in server request paths.
- SHOULD use bounded concurrency and connection pooling.
`,
};

export function nodeRules(verbosity = 'standard') {
   return NODE_RULES[verbosity] ?? NODE_RULES.standard;
}
