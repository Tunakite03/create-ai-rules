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

### Before Writing Code
${renderBullets([
         ...sharedBehavior.readBeforeWrite,
         'Check related tests to understand expected behavior.',
      ])}

### While Writing Code
${renderBullets([
         ...sharedBehavior.minimalDiff,
         'Follow the established code style exactly (indentation, naming, patterns).',
         'Add comprehensive error handling for all new code paths.',
      ])}

### After Writing Code
${renderBullets(sharedBehavior.verification)}

### Communication Style
${renderBullets([
         ...sharedBehavior.communication,
         'Lead with the answer and show code changes with file paths.',
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
