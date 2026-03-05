#!/usr/bin/env node

import { measureRules } from '../src/output-metrics.js';

const stacks = ['ts', 'react', 'node', 'nestjs', 'python', 'unity', 'go', 'flutter'];

const scenarios = [
   { name: 'core-standard-ts', cfg: { stacks: ['ts'], full: false, verbosity: 'standard' } },
   { name: 'full-standard-all-stacks', cfg: { stacks, full: true, verbosity: 'standard' } },
   { name: 'full-minimal-all-stacks', cfg: { stacks, full: true, verbosity: 'minimal' } },
   { name: 'full-strict-all-stacks', cfg: { stacks, full: true, verbosity: 'strict' } },
];

for (const { name, cfg } of scenarios) {
   const { chars, lines } = measureRules(cfg);
   console.log(`${name}: chars=${chars}, lines=${lines}`);
}
