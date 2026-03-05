import { baseRules } from '../rules.js';
import { buildSkills } from '../skills.js';
import { renderBullets, sharedBehavior } from './shared-behavior.js';

// --- Cline (comprehensive) ---
export function templatesCline({ stacks, minimal, full = false, verbosity = 'standard' }) {
   const files = {};

   let content =
      baseRules({ stacks, full, verbosity }) +
      `
## Cline-Specific Behavior

### Workflow
${renderBullets([
         ...sharedBehavior.readBeforeWrite,
         'Propose a detailed plan before implementing.',
         'Execute changes incrementally - one file at a time.',
      ])}

### Code Quality
${renderBullets([
         ...sharedBehavior.minimalDiff,
         'Follow existing code patterns and conventions exactly.',
      ])}

### Error Recovery
- If a change breaks something, explain what went wrong.
- Propose a fix before continuing with other changes.
- Never leave the codebase in a broken state.

### Communication
${renderBullets([
         'Show your plan before executing.',
         'Explain each significant change as you make it.',
         'Summarize all changes when done.',
         'Flag any concerns or follow-up items.',
      ])}
`;

   files['.clinerules'] = content;

   if (!minimal) {
      const skills = buildSkills({ stacks });
      for (const [k, v] of Object.entries(skills)) {
         files[k.replace('.github/skills/', '.cline/skills/')] = v;
      }
   }

   return files;
}
