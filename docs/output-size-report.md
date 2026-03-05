# Output Size Report (Before vs After Refactor)

Baseline was measured from the legacy `src/rules.js` before module split.
After values were measured from the refactored rule composer.

| Scenario | Before (chars / lines) | After (chars / lines) | Reduction |
|---|---:|---:|---:|
| Full stacks output (`ts,react,node,nestjs,python,unity,go,flutter`) | 32401 / 536 | 2504 / 72 | -92.27% chars, -86.57% lines |
| Default TypeScript-focused output | 4729 / 88 | 1215 / 34 | -74.31% chars, -61.36% lines |

## Commands used

```bash
node --input-type=module -e "import { baseRules } from './src/rules.js'; const text=baseRules({stacks:['ts','react','node','nestjs','python','unity','go','flutter']}); console.log(JSON.stringify({chars:text.length,lines:text.split('\\n').length}));"
```

```bash
node --input-type=module -e "import { baseRules } from './src/rules.js'; const text=baseRules({stacks:['ts']}); console.log(JSON.stringify({chars:text.length,lines:text.split('\\n').length}));"
```

```bash
node --input-type=module -e "import { baseRules } from './src/rules.js'; const all=['ts','react','node','nestjs','python','unity','go','flutter']; const a=baseRules({stacks:all,full:true,verbosity:'standard'}); const b=baseRules({stacks:['ts'],full:false,verbosity:'standard'}); console.log(JSON.stringify({after_full_all:{chars:a.length,lines:a.split('\\n').length},after_core_ts:{chars:b.length,lines:b.split('\\n').length}}));"
```
