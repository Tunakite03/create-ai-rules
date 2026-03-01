# create-ai-rules

> Scaffold AI coding rules, prompts & skills for your IDE assistants in seconds.

One command to generate well-structured rule files for **GitHub Copilot**, **Cursor**, **Windsurf**, **Claude Code**, **Cline**, and more.

## Why?

AI coding assistants work better when they understand your project's conventions. But setting up rule files for each IDE is tedious. `create-ai-rules` generates opinionated, best-practice rule files tailored to your tech stack — ready to commit.

## Quick Start

```bash
# Interactive mode (arrow-key navigation)
npx create-ai-rules

# Quick defaults (Copilot + Generic, TypeScript)
npx create-ai-rules -y

# Non-interactive with specific stack
npx create-ai-rules -y --stack=react
```

No install required — just `npx` and go.

## Supported Targets

| Target               | Files Generated |
| -------------------- | --------------- |
| **GitHub Copilot**   | `.github/copilot-instructions.md` + `instructions/` + `prompts/` + `skills/` |
| **Cursor**           | `.cursor/rules/*.mdc` + `.cursor/skills/` |
| **Windsurf**         | `.windsurfrules` |
| **Claude Code**      | `CLAUDE.md` |
| **Cline**            | `.clinerules` |
| **Generic / Agents** | `AGENTS.md` |

## Supported Stacks

| Stack | Includes |
| ----- | -------- |
| **TypeScript** (generic) | TS strict mode, type patterns, barrel exports |
| **React / Next.js** | Hooks, a11y, Tailwind + shadcn/ui style guide, component skills |
| **Node.js API** | Zod validation, middleware, structured errors, graceful shutdown |
| **Python** | Type hints, PEP 8, Pydantic, asyncio, pytest |
| **Unity (C#)** | MonoBehaviour lifecycle, performance, ScriptableObject, architecture |

## CLI Flags

```
-y, --yes           Accept defaults (Copilot + Generic, TypeScript)
-f, --force         Overwrite existing files
--stack=<name>      Set stack: ts, react, node, python, unity (used with -y)
--minimal           Skip optional files (prompts, skills, extras)
-h, --help          Show help
-v, --version       Show version
```

## Interactive Navigation

The CLI uses arrow-key navigation — no typing numbers:

```
↑ / ↓     Move cursor
Space     Toggle selection (multi-select)
A         Select / deselect all
Enter     Confirm
Ctrl+C    Exit
```

## Example

```bash
$ npx create-ai-rules

  create-ai-rules v1.5.0
  Scaffold AI coding rules for your IDE assistants.

  1. Select targets  ↑↓ · Space select · A = all · Enter confirm

    ❯ ◉ GitHub Copilot  .github/ (instructions + prompts + skills)
      ◉ Cursor  .cursor/rules/*.mdc + skills/
      ◯ Windsurf  .windsurfrules
      ◯ Claude Code  CLAUDE.md
      ◯ Cline  .clinerules
      ◯ Generic / Agents  AGENTS.md

  ✔ GitHub Copilot, Cursor

  2. Select tech stack  ↑↓ · Enter

    ❯ TypeScript (generic)
      React / Next.js
      Node.js API
      Python
      Unity (C#)

  ✔ React / Next.js

  3. Minimal mode?  ↑↓ · Enter

    ❯ No  — include prompts, skills & extras
      Yes — core rule files only

  ✔ No  — include prompts, skills & extras

  + .github/copilot-instructions.md
  + .github/instructions/00-style.instructions.md
  + .github/instructions/05-ui-style.instructions.md
  + .github/instructions/10-typescript.instructions.md
  + .github/instructions/20-error-handling.instructions.md
  + .github/instructions/30-security.instructions.md
  + .github/instructions/40-testing.instructions.md
  + .github/instructions/50-performance.instructions.md
  + .github/instructions/90-pr-checklist.instructions.md
  + .github/prompts/implement-feature.prompt.md
  + .github/prompts/fix-bug.prompt.md
  + .github/prompts/refactor.prompt.md
  + .github/prompts/code-review.prompt.md
  + .github/prompts/write-tests.prompt.md
  + .github/prompts/explain-code.prompt.md
  + .github/skills/git-workflow.md
  + .github/skills/debug.md
  + .github/skills/create-service.md
  + .github/skills/create-types.md
  + .github/skills/create-component.md
  + .github/skills/create-hook.md
  + .github/skills/create-page.md
  + .cursor/rules/base.mdc
  + .cursor/rules/style.mdc
  + .cursor/rules/ui-style.mdc
  + .cursor/rules/error-handling.mdc
  + .cursor/rules/security.mdc
  + .cursor/rules/pr-checklist.mdc
  + .cursor/rules/testing.mdc
  + .cursor/rules/performance.mdc
  + .cursor/skills/git-workflow.md
  + .cursor/skills/debug.md
  + .cursor/skills/create-service.md
  + .cursor/skills/create-types.md
  + .cursor/skills/create-component.md
  + .cursor/skills/create-hook.md
  + .cursor/skills/create-page.md

  Done! 37 written, 0 skipped.
```

## What's Generated?

### Rules (all targets)

| Category | What it covers |
|----------|---------------|
| **AI Behavior** | Read before write, plan before code, minimal diffs |
| **Code Quality** | Small functions, explicit naming, early returns, pure functions |
| **Error Handling** | Typed errors, actionable messages, boundary validation |
| **Security** | No hardcoded secrets, input sanitization, parameterized queries |
| **Performance** | Avoid N+1, pagination, lazy loading, streaming |
| **Git** | Conventional commits, minimal diffs, single logical unit per change |
| **UI Theme** | Never change colors/themes unless asked, use design tokens |

### Stack-Specific Rules

| Stack | Key rules |
|-------|-----------|
| **TypeScript** | `strict: true`, `unknown` over `any`, discriminated unions, `satisfies`, `as const` |
| **React** | Hooks patterns, a11y (WCAG AA), state management, error boundaries, Tailwind + shadcn/ui style guide |
| **Node/API** | Zod validation, structured errors, middleware patterns, graceful shutdown, health checks |
| **Python** | Type hints, PEP 8, dataclasses/Pydantic, `asyncio`, pytest |
| **Unity** | MonoBehaviour lifecycle, `GetComponent` caching, object pooling, `ScriptableObject`, physics in `FixedUpdate` |

### Prompts (Copilot)

6 detailed workflow templates: implement feature, fix bug, refactor, code review, write tests, explain code.

### Skills (Copilot + Cursor)

Stack-aware task scaffolds with code templates and checklists:

| Skill | Stacks |
|-------|--------|
| `git-workflow.md` | All |
| `debug.md` | All |
| `create-service.md` | TS, React, Node |
| `create-types.md` | TS, React, Node |
| `create-component.md` | React |
| `create-hook.md` | React |
| `create-page.md` | React |
| `create-endpoint.md` | Node |
| `create-middleware.md` | Node |
| `create-module.md` | Python |
| `create-dataclass.md` | Python |
| `create-monobehaviour.md` | Unity |
| `create-scriptableobject.md` | Unity |
| `unity-architecture.md` | Unity |

### PR Checklist (Copilot + Cursor)

Comprehensive checklist covering correctness, quality, safety, testing, and documentation.

## Safe by Default

Existing files are **skipped** unless you pass `--force`. Re-run anytime to add missing files.

## Global Install (optional)

```bash
npm install -g create-ai-rules
create-ai-rules
```

## Contributing

1. Fork the repo
2. Create a feature branch
3. Add your IDE target or stack in `bin/create-ai-rules.js` (follow existing patterns)
4. Submit a PR

## License

MIT
