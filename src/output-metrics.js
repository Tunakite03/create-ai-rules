import { baseRules } from './rules.js';

function metrics(text) {
   return {
      chars: text.length,
      lines: text.split('\n').length,
      // GPT-4 / Claude approximation: ~4 chars per token
      tokens: Math.round(text.length / 4),
   };
}

export function measureRules(config) {
   return metrics(baseRules(config));
}
