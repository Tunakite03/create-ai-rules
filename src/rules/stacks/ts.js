const TS_RULES = {
   minimal: `## TypeScript
- Keep strict typing; avoid \`any\`.
`,
   standard: `## TypeScript
- Keep strict typing; prefer \`unknown\` + guards over \`any\`.
- Use discriminated unions for state-like models.
`,
   strict: `## TypeScript
- MUST preserve strict typing and avoid \`any\` unless explicitly required.
- SHOULD prefer \`unknown\` + type guards and minimize unsafe assertions.
- SHOULD model state with discriminated unions and readonly types.
`,
};

export function tsRules(verbosity = 'standard') {
   return TS_RULES[verbosity] ?? TS_RULES.standard;
}
