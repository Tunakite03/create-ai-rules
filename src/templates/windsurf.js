import { baseRules } from '../rules.js';
import { buildSkills } from '../skills.js';
import { renderBullets, sharedBehavior } from './shared-behavior.js';

// --- Windsurf (comprehensive) ---
export function templatesWindsurf({ stacks, minimal }) {
   const files = {};

   files['.windsurfrules'] =
      baseRules({ stacks }) +
      `
## Windsurf-Specific Behavior

### Workflow
${renderBullets([
         ...sharedBehavior.readBeforeWrite,
         'Plan your approach before writing code.',
         'If unsure about context, ask before assuming.',
      ])}

### Code Changes
${renderBullets([
         ...sharedBehavior.minimalDiff,
         'Follow existing patterns in the codebase exactly.',
         'Verify changes compile and pass lint before finishing.',
      ])}

### Communication
${renderBullets([
         'Explain your reasoning before showing code.',
         'When multiple approaches exist, briefly list trade-offs.',
         'Flag potential risks or side effects proactively.',
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
