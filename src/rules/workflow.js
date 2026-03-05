const WORKFLOW_BY_VERBOSITY = {
   minimal: `## Workflow
1. Understand context.
2. Plan briefly.
3. Implement minimal change.
4. Verify and summarize.
`,
   standard: `## Workflow
1. **Understand**: inspect related files, tests, and constraints.
2. **Plan**: outline approach in 2-3 sentences.
3. **Implement**: make focused, minimal edits.
4. **Verify**: run relevant checks/tests and inspect edge cases.
5. **Document**: summarize what changed and why.
`,
   strict: `## Workflow
1. **Understand**: inspect related files, tests, and interfaces.
2. **Plan**: list approach and assumptions before coding.
3. **Implement**: keep changes scoped to one logical concern.
4. **Verify**: run targeted checks; confirm no regressions.
5. **Document**: report changes, risks, and follow-up tasks.

## Rule Priority
- Apply conflicts in order: **Security > Correctness > Existing architecture > Performance > Style**.
- Use RFC 2119 semantics: **MUST / SHOULD / MAY**.
`,
};

export function workflowRules(verbosity = 'standard') {
   return WORKFLOW_BY_VERBOSITY[verbosity] ?? WORKFLOW_BY_VERBOSITY.standard;
}
