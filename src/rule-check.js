import { baseRules } from './rules.js';

const ALL_STACKS = ['ts', 'react', 'node', 'nestjs', 'python', 'unity', 'go', 'flutter'];

function has(pattern, text) {
   return pattern.test(text);
}

export function runRuleChecks() {
   const text = baseRules({ stacks: ALL_STACKS, full: true, verbosity: 'strict' });
   const errors = [];
   const warnings = [];

   const hasNoNewDeps = has(/Do NOT add new dependencies unless asked/i, text);
   const hasHardLibRequirement = has(
      /Use\s+`?(Zod|Joi|orjson|ujson|Zustand|Jotai)`?.*(must|always|instead)/i,
      text
   );

   if (hasNoNewDeps && hasHardLibRequirement) {
      errors.push('Dependency conflict: forbids new dependencies but also requires specific libraries.');
   }

   if (has(/step-by-step thinking process is clearly visible/i, text)) {
      errors.push('Prompt safety conflict: rules require exposing step-by-step reasoning.');
   }

   if (!has(/Rule Priority/, text)) {
      warnings.push('Missing conflict resolution section (priority order + MUST/SHOULD/MAY).');
   }

   if (has(/\u00C3|\u00E2|\uFFFD/, text)) {
      warnings.push('Potential encoding artifacts detected (mojibake).');
   }

   return {
      ok: errors.length === 0,
      errors,
      warnings,
   };
}
