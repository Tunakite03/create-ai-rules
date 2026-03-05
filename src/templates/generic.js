import { baseRules } from '../rules.js';
import { buildSkills } from '../skills.js';

// --- Generic / Agents (comprehensive) ---
export function templatesGeneric({ stacks, minimal }) {
   const files = {};

   files['AGENTS.md'] =
      baseRules({ stacks }) +
      `
## Agent Behavior Guidelines

### Before Starting
- Read and understand the project structure.
- Identify existing patterns, conventions, and dependencies.
- Ask for clarification if the task is ambiguous.

### During Implementation
- Follow existing patterns exactly. Do not introduce new ones.
- Make the smallest possible change that solves the problem.
- Add tests for new functionality.
- Handle errors and edge cases explicitly.

### After Completing
- Verify all changes compile and tests pass.
- Summarize what was changed and why.
- Note any risks, trade-offs, or follow-up needed.

### Note
This is a tool-agnostic rules file. If your IDE uses a specific
filename (e.g., \`.cursorrules\`, \`CLAUDE.md\`, \`.windsurfrules\`),
copy this content to the appropriate location.
`;

   if (!minimal) {
      const skills = buildSkills({ stacks });
      Object.assign(files, skills);
   }

   return files;
}
