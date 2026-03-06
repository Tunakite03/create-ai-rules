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
   const hasHardLibRequirement = has(/Use\s+`?(Zod|Joi|orjson|ujson|Zustand|Jotai)`?.*(must|always|instead)/i, text);

   if (hasNoNewDeps && hasHardLibRequirement) {
      errors.push('Dependency conflict: forbids new dependencies but also requires specific libraries.');
   }

   if (has(/step-by-step thinking process is clearly visible/i, text)) {
      errors.push('Prompt safety conflict: rules require exposing step-by-step reasoning.');
   }

   if (!has(/^## Architecture$/m, text)) {
      warnings.push('Missing architecture section with boundary and compatibility guidance.');
   }

   if (!has(/backward-compatible|backward compatibility/i, text)) {
      warnings.push('Missing backward compatibility guidance for public contracts.');
   }

   if (!has(/timeouts?|deadlines?|cancellation/i, text)) {
      warnings.push('Missing I/O bounding guidance (timeouts, deadlines, or cancellation).');
   }

   if (!has(/Rule Priority/, text)) {
      warnings.push('Missing conflict resolution section (priority order + MUST/SHOULD/MAY).');
   }

   if (has(/\u00C3|\u00E2|\uFFFD/, text)) {
      warnings.push('Potential encoding artifacts detected (mojibake).');
   }

   // Warn when the total output likely exceeds a useful context hint size.
   const estimatedTokens = Math.round(text.length / 4);
   if (estimatedTokens > 2000) {
      warnings.push(
         `Output is large (~${estimatedTokens} estimated tokens). Consider using a lower verbosity or fewer stacks.`,
      );
   }

   // Detect duplicate section headers that may confuse AI context.
   const headers = [...text.matchAll(/^## (.+)/gm)].map((m) => m[1].trim());
   const seen = new Set();
   const dupes = headers.filter((h) => (seen.has(h) ? true : (seen.add(h), false)));
   if (dupes.length > 0) {
      warnings.push(`Duplicate section headers found: ${dupes.join(', ')}.`);
   }

   return {
      ok: errors.length === 0,
      errors,
      warnings,
   };
}
