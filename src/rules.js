import { coreRules } from './rules/core.js';
import { architectureRules } from './rules/architecture.js';
import { workflowRules } from './rules/workflow.js';
import { qualityRules } from './rules/quality.js';
import { securityRules } from './rules/security.js';
import { performanceRules } from './rules/performance.js';
import { tsRules } from './rules/stacks/ts.js';
import { reactRules } from './rules/stacks/react.js';
import { nodeRules } from './rules/stacks/node.js';
import { nestjsRules } from './rules/stacks/nestjs.js';
import { pythonRules } from './rules/stacks/python.js';
import { unityRules } from './rules/stacks/unity.js';
import { goRules } from './rules/stacks/go.js';
import { flutterRules } from './rules/stacks/flutter.js';

export const VALID_STACKS = new Set(['ts', 'react', 'node', 'nestjs', 'python', 'unity', 'go', 'flutter']);
export const VALID_VERBOSITY = new Set(['minimal', 'standard', 'strict']);

const TS_STACKS = new Set(['ts', 'react', 'node', 'nestjs']);

const STACK_RULE_BUILDERS = {
   ts: tsRules,
   react: reactRules,
   node: nodeRules,
   nestjs: nestjsRules,
   python: pythonRules,
   unity: unityRules,
   go: goRules,
   flutter: flutterRules,
};

function normalizeVerbosity(verbosity = 'standard') {
   return VALID_VERBOSITY.has(verbosity) ? verbosity : 'standard';
}

function normalizeStacks(stacks) {
   const valid = (stacks ?? ['ts']).filter((s) => VALID_STACKS.has(s));
   if (valid.length > 0) return valid;
   console.warn('Warning: No valid stacks provided, falling back to "ts".');
   return ['ts'];
}

export function baseRules({ stacks, full = false, verbosity = 'standard' }) {
   const level = normalizeVerbosity(verbosity);
   const selectedStacks = normalizeStacks(stacks);

   const sections = [
      coreRules(level),
      architectureRules(level),
      workflowRules(level),
      qualityRules(level),
      securityRules(level),
      performanceRules(level),
   ];

   if (full) {
      const seen = new Set();

      if (selectedStacks.some((stack) => TS_STACKS.has(stack))) {
         sections.push(tsRules(level));
         seen.add('ts');
      }

      for (const stack of selectedStacks) {
         if (seen.has(stack)) continue;
         seen.add(stack);
         const builder = STACK_RULE_BUILDERS[stack];
         if (builder) sections.push(builder(level));
      }
   }

   return `${sections.join('\n')}`.trimEnd() + '\n';
}
