import { baseRules } from '../rules.js';
import { buildSkills } from '../skills.js';

// --- Windsurf (comprehensive) ---
export function templatesWindsurf({ stack, minimal }) {
   const files = {};

   files['.windsurfrules'] =
      baseRules({ stack }) +
      `
## Windsurf-Specific Behavior

### Workflow
- ALWAYS read related files before making changes.
- Plan your approach before writing code.
- Propose the smallest viable diff for each change.
- If unsure about context, ask before assuming.

### Code Changes
- Follow existing patterns in the codebase exactly.
- Do not refactor unrelated code in the same change.
- Verify changes compile and pass lint before finishing.
- Add tests for any new logic or bug fixes.

### Communication
- Explain your reasoning before showing code.
- When multiple approaches exist, briefly list trade-offs.
- Flag potential risks or side effects proactively.
`;

   if (!minimal) {
      const skills = buildSkills({ stack });
      for (const [k, v] of Object.entries(skills)) {
         files[k.replace('.github/skills/', '.windsurf/skills/')] = v;
      }
   }

   return files;
}
