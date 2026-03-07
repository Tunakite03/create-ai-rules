const PYTHON_RULES = {
   minimal: `## Python
- Use type hints on public functions.
`,
   standard: `## Python
- Use type hints for public interfaces.
- Prefer pathlib/context managers and structured logging.
- Catch specific exceptions with useful context.
- Use src layout with package-based organization; separate domain logic from API and data layers.
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
- MUST follow src-layout folder structure:
  \`\`\`
  src/
  └── <package>/
      ├── __init__.py
      ├── api/                     # Routes / endpoints
      │   ├── __init__.py
      │   ├── routes.py
      │   └── dependencies.py      # Dependency injection
      ├── core/                    # Configuration, settings
      │   ├── config.py
      │   └── security.py
      ├── models/                  # Pydantic schemas & ORM models
      │   ├── schemas.py
      │   └── entities.py
      ├── services/                # Business logic
      ├── repositories/            # Data access layer
      └── utils/                   # Helpers, shared utilities
  tests/
  ├── conftest.py
  ├── unit/
  └── integration/
  \`\`\`
- SHOULD profile before major performance optimizations.
`,
};

export function pythonRules(verbosity = 'standard') {
   return PYTHON_RULES[verbosity] ?? PYTHON_RULES.standard;
}
