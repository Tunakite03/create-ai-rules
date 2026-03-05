const UNITY_RULES = {
   minimal: `## Unity / C#
- Cache expensive lookups and keep Update lightweight.
`,
   standard: `## Unity / C#
- Cache \`GetComponent\` calls; avoid repeated scene searches.
- Keep heavy logic out of \`Update\`; prefer events/coroutines.
- Use pooling for frequently spawned objects.
`,
   strict: `## Unity / C#
- MUST avoid expensive lookups/allocations in frame loops.
- SHOULD cache components and use object pooling in hot paths.
- SHOULD separate runtime logic from editor-only code.
`,
};

export function unityRules(verbosity = 'standard') {
   return UNITY_RULES[verbosity] ?? UNITY_RULES.standard;
}
