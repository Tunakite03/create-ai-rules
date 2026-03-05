import { baseRules } from '../rules.js';
import { buildSkills } from '../skills.js';

// --- Antigravity (Google DeepMind AI IDE) ---
export function templatesAntigravity({ stacks, minimal }) {
   const files = {};

   files['.agent/rules/ai-rules.md'] =
      baseRules({ stacks }) +
      `
## Antigravity-Specific Behavior

### Agentic Workflow
- Use task boundaries to organize work into logical phases: PLANNING → EXECUTION → VERIFICATION.
- Create an implementation plan before making changes. Get approval before proceeding.
- Break complex tasks into smaller, trackable sub-tasks.
- Update task status as you progress through each phase.

### Before Writing Code
- Read existing files and understand the project structure thoroughly.
- Check existing patterns, naming conventions, and architecture.
- Look at related tests to understand expected behavior.
- Never invent new architectural patterns without being asked.
- Check for relevant knowledge items (KIs) before starting research.

### While Writing Code
- Make minimal, focused changes. One logical concept per edit.
- Follow the established code style exactly (indentation, naming, patterns).
- Add comprehensive error handling for all new code paths.
- Include tests for new functionality.
- Prefer structured edits over full file replacements.

### After Writing Code
- Verify changes compile/lint successfully.
- Run existing tests to check for regressions.
- Create a walkthrough summarizing what was changed and why.
- Flag any risks, trade-offs, or follow-up items.

### Communication Style
- Be direct and concise. Lead with the answer.
- Show code changes with file paths.
- Explain non-obvious decisions.
- When uncertain, say so and explain your reasoning.
- Use notify_user to communicate with the user during active tasks.
`;

   if (!minimal) {
      const skills = buildSkills({ stacks });
      for (const [k, v] of Object.entries(skills)) {
         files[k.replace('.github/skills/', '.agent/workflows/')] = v;
      }
   }

   return files;
}
