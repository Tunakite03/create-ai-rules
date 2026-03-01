// ================================================================
//  Target registry & stack definitions
// ================================================================

import { templatesCopilot } from './copilot.js';
import { templatesCursor } from './cursor.js';
import { templatesWindsurf } from './windsurf.js';
import { templatesClaude } from './claude.js';
import { templatesCline } from './cline.js';
import { templatesAntigravity } from './antigravity.js';
import { templatesGeneric } from './generic.js';

export const TARGETS = [
   {
      key: 'copilot',
      label: 'GitHub Copilot',
      desc: '.github/ (instructions + prompts + skills)',
      gen: (cfg) => templatesCopilot(cfg),
   },
   {
      key: 'cursor',
      label: 'Cursor',
      desc: '.cursor/rules/*.mdc',
      gen: (cfg) => templatesCursor(cfg),
   },
   {
      key: 'windsurf',
      label: 'Windsurf',
      desc: '.windsurfrules',
      gen: (cfg) => templatesWindsurf(cfg),
   },
   {
      key: 'claude',
      label: 'Claude Code',
      desc: 'CLAUDE.md',
      gen: (cfg) => templatesClaude(cfg),
   },
   {
      key: 'cline',
      label: 'Cline',
      desc: '.clinerules',
      gen: (cfg) => templatesCline(cfg),
   },
   {
      key: 'antigravity',
      label: 'Antigravity',
      desc: '.agent/rules/ + workflows/',
      gen: (cfg) => templatesAntigravity(cfg),
   },
   {
      key: 'generic',
      label: 'Generic / Agents',
      desc: 'AGENTS.md',
      gen: (cfg) => templatesGeneric(cfg),
   },
];

export const STACKS = [
   { key: 'ts', label: 'TypeScript (generic)' },
   { key: 'react', label: 'React / Next.js' },
   { key: 'node', label: 'Node.js API' },
   { key: 'python', label: 'Python' },
   { key: 'unity', label: 'Unity (C#)' },
];
