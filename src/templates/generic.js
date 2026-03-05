import { baseRules } from '../rules.js';
import { buildSkills } from '../skills.js';
import { renderBullets, sharedBehavior } from './shared-behavior.js';

// --- Generic / Agents (comprehensive) ---
export function templatesGeneric({ stacks, minimal, full = false, verbosity = 'standard' }) {
   const files = {};

   files['AGENTS.md'] =
      baseRules({ stacks, full, verbosity }) +
      `
## Agent Behavior Guidelines

### Before Starting
${renderBullets([
         ...sharedBehavior.readBeforeWrite,
         'Identify existing dependencies before making changes.',
         'Ask for clarification if the task is ambiguous.',
      ])}

### During Implementation
${renderBullets([
         ...sharedBehavior.minimalDiff,
         'Handle errors and edge cases explicitly.',
      ])}

### After Completing
${renderBullets(sharedBehavior.verification)}

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
