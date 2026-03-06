import test from 'node:test';
import assert from 'node:assert/strict';

import { runRuleChecks } from '../src/rule-check.js';
import { baseRules } from '../src/rules.js';
import { buildSkills } from '../src/skills.js';

test('strict base rules include architecture and scalable I/O guidance', () => {
   const text = baseRules({ stacks: ['ts', 'node'], full: true, verbosity: 'strict' });

   assert.match(text, /^## Architecture$/m);
   assert.match(text, /backward-compatible|backward compatibility/i);
   assert.match(text, /timeouts?|deadlines?|cancellation/i);
});

test('common skills include system design guidance', () => {
   const skills = buildSkills({ stacks: ['node'] });
   const systemDesign = skills['.github/skills/system-design.md'];

   assert.ok(systemDesign);
   assert.match(systemDesign, /Scalability checklist/i);
   assert.match(systemDesign, /Rollout & compatibility/i);
});

test('ai agent behavior prefers concise structured reasoning', () => {
   const skills = buildSkills({ stacks: ['ts'] });
   const agentBehavior = skills['.github/skills/ai-agent-behavior.md'];

   assert.match(agentBehavior, /structured checklist internally/i);
   assert.doesNotMatch(agentBehavior, /AI should think step-by-step/i);
   assert.match(agentBehavior, /state assumptions briefly and proceed/i);
});

test('node endpoint skill does not hardcode a new validation dependency', () => {
   const skills = buildSkills({ stacks: ['node'] });
   const endpoint = skills['.github/skills/create-endpoint.md'];

   assert.doesNotMatch(endpoint, /import \{ z \} from 'zod'/);
   assert.match(endpoint, /existing project validation layer/i);
   assert.match(endpoint, /idempotency\/retry safety/i);
});

test('nestjs skills promote layered feature boundaries and scalable services', () => {
   const skills = buildSkills({ stacks: ['nestjs'] });
   const moduleSkill = skills['.github/skills/create-nestjs-module.md'];
   const serviceSkill = skills['.github/skills/create-nestjs-service.md'];

   assert.ok(moduleSkill);
   assert.ok(serviceSkill);
   assert.match(moduleSkill, /presentation, application, domain, and infrastructure boundaries/i);
   assert.match(moduleSkill, /jobs\/events instead of blocking request\/response paths/i);
   assert.match(serviceSkill, /transaction and idempotency boundaries explicitly/i);
   assert.match(serviceSkill, /ports instead of ORM clients directly/i);
});

test('nestjs controller and guard skills prefer typed boundaries without raw parsing', () => {
   const skills = buildSkills({ stacks: ['nestjs'] });
   const controllerSkill = skills['.github/skills/create-nestjs-controller.md'];
   const guardSkill = skills['.github/skills/create-nestjs-guard.md'];

   assert.match(controllerSkill, /List<Feature>QueryDto/);
   assert.match(controllerSkill, /paginated envelopes, not ORM entities/i);
   assert.doesNotMatch(controllerSkill, /\+page/);
   assert.match(controllerSkill, /@Patch\(\)/);
   assert.doesNotMatch(guardSkill, /request: any/);
});

test('rule checks pass without errors after architecture updates', () => {
   const report = runRuleChecks();

   assert.equal(report.ok, true);
   assert.deepEqual(report.errors, []);
});
