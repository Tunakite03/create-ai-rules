const PYTHON_RULES = {
   minimal: `## Python
- Use type hints on public functions.
`,
   standard: `## Python
- Use type hints for public interfaces.
- Prefer pathlib/context managers and structured logging.
- Catch specific exceptions with useful context.
`,
   strict: `## Python
- MUST type public interfaces and avoid bare \`except\`.
  \`\`\`python
  # ✓ except ValueError as e: raise RuntimeError('context') from e
  # ✗ except: pass
  \`\`\`
- SHOULD use context managers for resources and structured logging.
  \`\`\`python
  # ✓ with open(path) as f: data = f.read()
  # ✗ f = open(path); data = f.read()  # no close guarantee
  \`\`\`
- SHOULD profile before major performance optimizations.
`,
};

export function pythonRules(verbosity = 'standard') {
   return PYTHON_RULES[verbosity] ?? PYTHON_RULES.standard;
}
