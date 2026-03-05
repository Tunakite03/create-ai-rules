const SECURITY_BY_VERBOSITY = {
   minimal: `## Security
- Never expose secrets, tokens, or credentials.
- Validate and sanitize external inputs.
`,
   standard: `## Security
- Never log secrets, tokens, passwords, API keys, or PII.
- Never hardcode credentials; use environment variables.
- Validate/sanitize user input and file paths.
- Prefer parameterized queries over SQL string concatenation.
`,
   strict: `## Security
- MUST NOT log or leak secrets, credentials, or personal data.
- MUST validate and sanitize all boundary inputs (HTTP, CLI, files, DB).
- MUST use parameterized queries and safe path handling.
- SHOULD use least-privilege defaults and secure headers where applicable.
`,
};

export function securityRules(verbosity = 'standard') {
   return SECURITY_BY_VERBOSITY[verbosity] ?? SECURITY_BY_VERBOSITY.standard;
}
