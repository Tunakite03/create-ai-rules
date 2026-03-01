# create-ai-rules

> Scaffold AI coding rules & instructions for your IDE assistants in seconds.

One command to generate well-structured rule files for **GitHub Copilot**, **Cursor**, **Windsurf**, **Claude Code**, **Cline**, and more.

## Why?

AI coding assistants work better when they understand your project's conventions. But setting up rule files for each IDE is tedious. `create-ai-rules` generates opinionated, best-practice rule files tailored to your tech stack — ready to commit.

## Quick Start

```bash
# Interactive mode
npx create-ai-rules

# Quick defaults (Copilot + Generic, TypeScript)
npx create-ai-rules -y
```

No install required — just `npx` and go.

## Supported Targets

| #   | Target               | Files Generated                                                                                              |
| --- | -------------------- | ------------------------------------------------------------------------------------------------------------ |
| 1   | **GitHub Copilot**   | `.github/copilot-instructions.md` + `.github/instructions/*.instructions.md` + `.github/prompts/*.prompt.md` |
| 2   | **Cursor**           | `.cursor/rules/*.mdc`                                                                                        |
| 3   | **Windsurf**         | `.windsurfrules`                                                                                             |
| 4   | **Claude Code**      | `CLAUDE.md`                                                                                                  |
| 5   | **Cline**            | `.clinerules`                                                                                                |
| 6   | **Generic / Agents** | `AGENTS.md`                                                                                                  |

## Supported Stacks

| #   | Stack                |
| --- | -------------------- |
| 1   | TypeScript (generic) |
| 2   | React / Next.js      |
| 3   | Node.js API          |
| 4   | Python               |

## CLI Flags

```
-y, --yes       Accept defaults (Copilot + Generic, TypeScript stack)
-f, --force     Overwrite existing files
--minimal       Skip optional files (prompts, conventions doc)
-h, --help      Show help
-v, --version   Show version
```

## Example

```bash
$ npx create-ai-rules

  create-ai-rules v1.1.0
  Scaffold AI coding rules for your IDE assistants.

  1. Select targets (comma-separated, e.g. 1,2,3 or 'all')

     1) GitHub Copilot   .github/copilot-instructions.md + .github/instructions/*
     2) Cursor           .cursor/rules/*.mdc
     3) Windsurf         .windsurfrules
     4) Claude Code      CLAUDE.md
     5) Cline            .clinerules
     6) Generic / Agents AGENTS.md

  Your choice: 1,2

  2. Select tech stack

     1) TypeScript (generic)
     2) React / Next.js
     3) Node.js API
     4) Python

  Your choice [1]: 2

  Minimal mode? (skip prompts & extras) [y/N]: n

  + .github/copilot-instructions.md
  + .github/instructions/00-style.instructions.md
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
  + .cursor/rules/base.mdc
  + .cursor/rules/style.mdc
  + .cursor/rules/error-handling.mdc
  + .cursor/rules/security.mdc
  + .cursor/rules/testing.mdc
  + .cursor/rules/performance.mdc

  Done! 20 written, 0 skipped.

  Next steps:
    1. Review & customize the generated rule files.
    2. Commit them to your repo.
    3. Your IDE assistant will pick them up automatically.
```

## What's Generated?

Comprehensive, production-grade rules covering:

### Core Rules (all targets)

- **AI Behavior** — read before write, plan before code, minimal diffs
- **Code Quality** — small functions, explicit naming, early returns, pure functions
- **Error Handling** — typed errors, actionable messages, boundary validation
- **Security** — no hardcoded secrets, input sanitization, parameterized queries
- **Performance** — avoid N+1, pagination, lazy loading, streaming
- **Git** — conventional commits, minimal diffs, single logical unit per change

### Stack-Specific Rules

- **TypeScript** — strict mode, `unknown` over `any`, discriminated unions, `satisfies`, `as const`
- **React** — hooks patterns, a11y (WCAG AA), state management, error boundaries, lazy loading
- **Node/API** — Zod validation, structured errors, middleware patterns, graceful shutdown
- **Python** — type hints, PEP 8, dataclasses/Pydantic, `asyncio`, pytest

### Copilot Extras (7 instruction files + 6 prompt templates)

- **Instructions**: style, TypeScript, error handling, security, testing, performance, PR checklist
- **Prompts**: implement feature, fix bug, refactor, code review, write tests, explain code

### Cursor Extras (up to 6 `.mdc` rule files)

- Base rules, style, error handling, security, testing, performance

Files are safe by default — existing files are **skipped** unless you pass `--force`.

## Global Install (optional)

```bash
npm install -g create-ai-rules
create-ai-rules
```

## Contributing

1. Fork the repo
2. Create a feature branch
3. Add your IDE target in `bin/create-ai-rules.js` (follow the existing pattern)
4. Submit a PR

## License

MIT
