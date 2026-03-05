import { baseRules } from '../rules.js';
import { buildSkills } from '../skills.js';

// --- Cline (comprehensive) ---
export function templatesCline({ stack, minimal, clineThink }) {
   const files = {};

   let content =
      baseRules({ stack }) +
      `
## Cline-Specific Behavior

### Workflow
- ALWAYS read relevant files before making any changes.
- Propose a detailed plan before implementing.
- Execute changes incrementally - one file at a time.
- Verify each change compiles before moving to the next.

### Code Quality
- Follow existing code patterns and conventions exactly.
- Keep diffs minimal and focused on the task.
- Do not refactor or clean up unrelated code.
- Add tests for new features and bug fixes.

### Error Recovery
- If a change breaks something, explain what went wrong.
- Propose a fix before continuing with other changes.
- Never leave the codebase in a broken state.

### Communication
- Show your plan before executing.
- Explain each significant change as you make it.
- Summarize all changes when done.
- Flag any concerns or follow-up items.
`;

   if (clineThink) {
      content += `
### Step-by-Step Thinking
- You MUST think step by step in order to plan and implement every task.
- ALWAYS outline your steps explicitly and reason about them before taking action.
- Ensure that your step-by-step thinking process is clearly visible in your responses.
`;
   }

   files['.clinerules'] = content;

   if (!minimal) {
      const skills = buildSkills({ stack });
      for (const [k, v] of Object.entries(skills)) {
         files[k.replace('.github/skills/', '.cline/skills/')] = v;
      }
   }

   return files;
}
