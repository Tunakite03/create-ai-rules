import { baseRules } from './rules.js';

function metrics(text) {
   return {
      chars: text.length,
      lines: text.split('\n').length,
   };
}

export function measureRules(config) {
   return metrics(baseRules(config));
}
