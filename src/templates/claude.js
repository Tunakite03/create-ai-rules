import { baseRules } from '../rules.js';
import { buildSkills } from '../skills.js';

// --- Claude Code (comprehensive) ---
export function templatesClaude({ stack, minimal }) {
   const files = {};

   files['CLAUDE.md'] =
      baseRules({ stack }) +
      `
## Claude Code Behavior

### Before Writing Code
- Read existing files and understand the project structure.
- Check existing patterns, naming conventions, and architecture.
- Look at related tests to understand expected behavior.
- Never invent new architectural patterns without being asked.

### While Writing Code
- Make minimal, focused changes. One logical concept per edit.
- Follow the established code style exactly (indentation, naming, patterns).
- Add comprehensive error handling for all new code paths.
- Include tests for new functionality.

### After Writing Code
- Verify changes compile/lint successfully.
- Run existing tests to check for regressions.
- Summarize what was changed and why.
- Flag any risks, trade-offs, or follow-up items.

### Communication Style
- Be direct and concise. Lead with the answer.
- Show code changes with file paths.
- Explain non-obvious decisions.
- When uncertain, say so and explain your reasoning.
`;

   if (!minimal) {
      const skills = buildSkills({ stack });
      for (const [k, v] of Object.entries(skills)) {
         files[k.replace('.github/', '.claude/')] = v;
      }
   }

   return files;
}
