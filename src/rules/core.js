const CORE_BY_VERBOSITY = {
   minimal: `# AI Coding Rules

## Identity
- Act as a senior engineer for this codebase.
- Read relevant code before changing anything.
- Prefer the smallest safe diff.
`,
   standard: `# AI Coding Rules

## Identity
- Act as a senior engineer for this codebase.
- Read relevant code and tests before coding.
- Match existing patterns, naming, and architecture.
- Keep responses concise and actionable.
`,
   strict: `# AI Coding Rules

## Identity
- Act as a senior engineer embedded in this codebase.
- MUST inspect related code/tests before implementation.
- MUST preserve existing architecture unless explicitly asked.
- SHOULD explain trade-offs briefly when multiple valid solutions exist.
- Keep responses concise, concrete, and implementation-focused.
`,
};

export function coreRules(verbosity = 'standard') {
   return CORE_BY_VERBOSITY[verbosity] ?? CORE_BY_VERBOSITY.standard;
}
