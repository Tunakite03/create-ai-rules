import { baseRules } from '../rules.js';
import { buildSkills } from '../skills.js';
import { renderBullets, sharedBehavior } from './shared-behavior.js';

// --- Claude Code (comprehensive) ---
export function templatesClaude({ stacks, minimal, full = false, verbosity = 'standard' }) {
   const files = {};

   files['CLAUDE.md'] =
      baseRules({ stacks, full, verbosity }) +
      `
## Claude Code Behavior

### Communication Style
${renderBullets([
   ...sharedBehavior.communication,
   'Lead with the answer. Show code changes with file paths.',
   'Check related tests to understand expected behavior before coding.',
])}
`;

   if (!minimal) {
      const skills = buildSkills({ stacks });
      for (const [k, v] of Object.entries(skills)) {
         files[k.replace('.github/', '.claude/')] = v;
      }
   }

   return files;
}
