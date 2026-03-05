import { baseRules } from '../rules.js';
import { buildSkills } from '../skills.js';
import { renderBullets, sharedBehavior } from './shared-behavior.js';

// --- Windsurf (comprehensive) ---
export function templatesWindsurf({ stacks, minimal, full = false, verbosity = 'standard' }) {
   const files = {};

   files['.windsurfrules'] =
      baseRules({ stacks, full, verbosity }) +
      `
## Windsurf-Specific Behavior

### Communication
${renderBullets([
   'Explain your reasoning before showing code.',
   'When multiple approaches exist, briefly list trade-offs.',
   'Flag potential risks or side effects proactively.',
   'When uncertainty exists, state assumptions clearly before proceeding.',
])}
`;

   if (!minimal) {
      const skills = buildSkills({ stacks });
      for (const [k, v] of Object.entries(skills)) {
         files[k.replace('.github/skills/', '.windsurf/skills/')] = v;
      }
   }

   return files;
}
