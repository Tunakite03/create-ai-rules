// ================================================================
//  SKILLS - Stack-aware reusable task templates
// ================================================================

export function buildSkills({ stacks }) {
   const files = {};

   // ── Common skills (all stacks) ────────────────────────────────

   files['.github/skills/git-workflow.md'] = `# Skill: Git Workflow

## Commit Messages — Conventional Commits
Format: \`type(scope): description\`

| Type | When to use |
|------|-------------|
| \`feat\` | New feature or capability |
| \`fix\` | Bug fix |
| \`refactor\` | Code change with no behavior change |
| \`test\` | Add or update tests |
| \`docs\` | Documentation only |
| \`perf\` | Performance improvement |
| \`chore\` | Build, tooling, CI changes |
| \`style\` | Formatting, white-space (no logic change) |

Rules:
- Subject: imperative mood, max 72 chars, no trailing period.
- Body: explain **WHY**, not what (the diff shows what).
- Footer: \`Closes #123\` or \`Breaking change: <description>\`.

## Project Notes
<!-- Add project-specific branch naming, required reviewers, merge strategy, or CI gates here. -->

Examples:
\`\`\`
feat(auth): add OAuth2 login with Google

Adds Google OAuth2 as an alternative sign-in method.
Users can now link their Google account in Settings > Account.

Closes #42
\`\`\`
\`\`\`
fix(api): return 404 when user not found instead of 500

Previously GetUser threw an unhandled exception when userId
didn't exist in the DB. Added explicit null-check + 404 response.
\`\`\`

## Branch Naming
- Feature : \`feat/<short-description>\`
- Bug fix  : \`fix/<issue-or-description>\`
- Hotfix   : \`hotfix/<critical-bug>\`
- Release  : \`release/v<semver>\`

## PR Checklist
- [ ] Tests pass locally
- [ ] No debug logs or commented-out code
- [ ] No hardcoded secrets or tokens
- [ ] Self-reviewed the diff
- [ ] PR description explains the WHY, not just the WHAT
- [ ] Breaking changes documented
`;

   files['.github/skills/debug.md'] = `# Skill: Debug an Issue

## Steps
1. **Reproduce** — get a minimal, repeatable case.
2. **Isolate** — binary-search the code path. Add logs to narrow scope.
3. **Hypothesize** — form a specific theory for the root cause.
4. **Verify** — write a failing test that proves the bug exists.
5. **Fix** — make the smallest change that fixes the failing test.
6. **Regression test** — ensure the test now passes and stays green.
7. **Scan** — look for the same pattern elsewhere in the codebase.

## Useful diagnostics
- Read error messages carefully — the stack trace shows the exact line.
- Check recent git changes: \`git log --oneline -20\`, \`git diff HEAD~1\`.
- Validate assumptions with \`console.log\` / \`print\` / breakpoints.
- Check environment: env vars, dependency versions, OS differences.

## Anti-patterns to avoid
- Don't fix symptoms — find the root cause.
- Don't suppress errors with try/catch without understanding them.
- Don't assume — verify every assumption with evidence.

## Project Notes
<!-- Add project-specific debugging tips, common pitfalls, or environment quirks here. -->
`;

   files['.github/skills/code-review.md'] = `# Skill: Code Review

## Review Process
1. **Understand** — Read the PR description and linked issue first.
2. **Skim** — Get the big picture. Understand the shape of the change.
3. **Deep dive** — Read each file carefully. Check logic, edge cases, naming.
4. **Test mentally** — Trace the code path with real inputs (happy + unhappy).
5. **Comment** — Be specific, suggest fixes, explain reasoning.

## Severity Levels
| Level | When to use |
|-------|-------------|
| \`🔴 critical\` | Bug, security flaw, data loss risk. Must fix before merge. |
| \`🟡 warning\` | Performance issue, bad pattern, potential tech debt. Should fix. |
| \`🔵 suggestion\` | Better approach exists, readability improvement. Nice to have. |
| \`⚪ nit\` | Style, naming, formatting. Optional. |

## What to Check
- **Correctness**: Does the logic handle all cases? Edge cases?
- **Security**: User input validated? Secrets exposed? SQL injection?
- **Performance**: N+1 queries? Unbounded loops? Memory leaks?
- **Naming**: Is every name clear? Would a new teammate understand?
- **Tests**: Happy path + edge cases + error cases covered?
- **Docs**: Public APIs documented? Breaking changes noted?

## Comment Template
\\\`\\\`\\\`
[severity] file.ts:L42
Issue: <what is wrong>
Why: <why it matters>
Fix: <suggested improvement with code>
\\\`\\\`\\\`

## Anti-patterns
- Don't just say "this is wrong" — explain WHY and suggest a fix.
- Don't nitpick style if a formatter/linter handles it.
- Don't approve without reading. "LGTM" without review is harmful.
- Don't block on subjective preferences. Distinguish opinion from rule.

## Project Notes
<!-- Add project-specific review criteria, team conventions, or required checks here. -->
`;

   files['.github/skills/api-design.md'] = `# Skill: Design a REST API

## URL Conventions
- Nouns, not verbs: \\\`/users\\\` not \\\`/getUsers\\\`.
- Plural resource names: \\\`/users\\\`, \\\`/orders\\\`, \\\`/products\\\`.
- Nest for relationships: \\\`/users/:id/orders\\\`.
- Use kebab-case: \\\`/order-items\\\` not \\\`/orderItems\\\`.
- Version prefix: \\\`/api/v1/users\\\`.

## HTTP Methods
| Method | Purpose | Idempotent | Response |
|--------|---------|------------|----------|
| GET | Read | Yes | 200, 404 |
| POST | Create | No | 201, 400, 409 |
| PUT | Full replace | Yes | 200, 404 |
| PATCH | Partial update | No | 200, 404 |
| DELETE | Remove | Yes | 204, 404 |

## Response Format
\\\`\\\`\\\`json
// Success (single)
{ "data": { "id": "1", "name": "Alice" } }

// Success (list)
{ "data": [...], "meta": { "page": 1, "limit": 20, "total": 142 } }

// Error
{ "error": { "code": "VALIDATION_ERROR", "message": "...", "details": [...] } }
\\\`\\\`\\\`

## Pagination
- Use cursor-based for infinite scroll: \\\`?cursor=abc&limit=20\\\`.
- Use offset-based for page navigation: \\\`?page=1&limit=20\\\`.
- Always return total count and next cursor/page link.

## Filtering & Sorting
- Filter: \\\`?status=active&role=admin\\\`.
- Sort: \\\`?sort=created_at:desc,name:asc\\\`.
- Search: \\\`?q=search+term\\\`.

## Checklist
- [ ] All endpoints follow RESTful conventions.
- [ ] Consistent response shape across all endpoints.
- [ ] Pagination on all list endpoints.
- [ ] Input validation with clear error messages.
- [ ] Rate limiting on public endpoints.
- [ ] API versioning strategy defined.
- [ ] Authentication/authorization on protected routes.
- [ ] OpenAPI/Swagger documentation generated.
`;

   files['.github/skills/create-migration.md'] = `# Skill: Create a Database Migration

## Principles
- Migrations are **immutable** once deployed. Never edit a merged migration.
- Every migration must be **reversible** — include both \\\`up\\\` and \\\`down\\\`.
- One logical change per migration file. Don't mix schema + data changes.
- Test migrations against a copy of production data before deploying.

## Safe Migration Patterns
| Change | Safe approach |
|--------|--------------|
| Add column | Add as nullable or with default value |
| Rename column | Add new → backfill → remove old (3 steps) |
| Remove column | Stop reading → deploy → remove column |
| Add index | Use \\\`CREATE INDEX CONCURRENTLY\\\` (Postgres) |
| Change type | Add new column → migrate data → swap → drop old |
| Add NOT NULL | Add column nullable → backfill → add constraint |

## Migration Template
\\\`\\\`\\\`
-- Migration: <YYYY-MM-DD>_<description>
-- Description: <what this migration does and WHY>

-- UP
ALTER TABLE users ADD COLUMN avatar_url TEXT DEFAULT NULL;
CREATE INDEX CONCURRENTLY idx_users_avatar ON users(avatar_url) WHERE avatar_url IS NOT NULL;

-- DOWN
DROP INDEX IF EXISTS idx_users_avatar;
ALTER TABLE users DROP COLUMN IF EXISTS avatar_url;
\\\`\\\`\\\`

## Zero-Downtime Checklist
- [ ] No table locks on large tables (use concurrent operations).
- [ ] New columns are nullable or have defaults (no breaking existing inserts).
- [ ] Application code handles both old and new schema during rollout.
- [ ] Data backfill runs as a separate step, not in the migration.
- [ ] Rollback script tested and verified.
- [ ] Migration tested against staging with production-like data volume.
- [ ] Foreign keys added without locking (where possible).
`;

   files['.github/skills/docker-deploy.md'] = `# Skill: Docker & Deployment

## Dockerfile Best Practices
\\\`\\\`\\\`dockerfile
# Multi-stage build for minimal production image
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --ignore-scripts
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
RUN addgroup -g 1001 -S appgroup && adduser -S appuser -u 1001 -G appgroup
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
USER appuser
EXPOSE 3000
CMD ["node", "dist/main.js"]
\\\`\\\`\\\`

## Docker Rules
- Use multi-stage builds to minimize image size.
- Pin base image versions (e.g., \\\`node:20.11-alpine\\\`, not \\\`node:latest\\\`).
- Run as non-root user. Never run containers as root in production.
- Use \\\`.dockerignore\\\` to exclude: \\\`node_modules\\\`, \\\`.git\\\`, \\\`.env\\\`, tests, docs.
- One process per container. Use Docker Compose for multi-service setups.
- Health checks: \\\`HEALTHCHECK CMD curl -f http://localhost:3000/health || exit 1\\\`.

## Docker Compose Template
\\\`\\\`\\\`yaml
services:
  app:
    build: .
    ports: ["3000:3000"]
    env_file: .env
    depends_on:
      db: { condition: service_healthy }
    restart: unless-stopped
  db:
    image: postgres:16-alpine
    volumes: ["pgdata:/var/lib/postgresql/data"]
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: myapp
      POSTGRES_PASSWORD: \${DB_PASSWORD}
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U myapp"]
      interval: 5s
      timeout: 3s
      retries: 5
volumes:
  pgdata:
\\\`\\\`\\\`

## CI/CD Checklist
- [ ] Linting and type checking pass.
- [ ] All tests pass (unit + integration).
- [ ] Docker image builds successfully.
- [ ] Security scanning on image (Trivy, Snyk).
- [ ] Environment variables documented and validated.
- [ ] Database migrations run before deployment.
- [ ] Health check endpoint verified post-deploy.
- [ ] Rollback plan documented and tested.
`;

   files['.github/skills/write-docs.md'] = `# Skill: Write Documentation

## README Structure
\\\`\\\`\\\`markdown
# Project Name
> One-line description of what this project does.

## Quick Start
<3-5 steps to get running>

## Features
- Feature A — brief description
- Feature B — brief description

## Installation
<detailed setup instructions>

## Usage
<code examples for common use cases>

## API Reference
<link to generated docs or brief reference>

## Contributing
<how to contribute, link to CONTRIBUTING.md>

## License
<license type>
\\\`\\\`\\\`

## Architecture Decision Record (ADR)
\\\`\\\`\\\`markdown
# ADR-<number>: <Title>
- **Date**: YYYY-MM-DD
- **Status**: proposed | accepted | deprecated | superseded
- **Context**: What is the issue? Why do we need to make a decision?
- **Decision**: What did we decide?
- **Consequences**: What are the trade-offs? What do we gain and lose?
- **Alternatives Considered**: What other options were evaluated?
\\\`\\\`\\\`

## Changelog Entry (Keep a Changelog format)
\\\`\\\`\\\`markdown
## [1.2.0] - YYYY-MM-DD
### Added
- New feature description.

### Changed
- Modified behavior description.

### Fixed
- Bug fix description. Closes #123.

### Removed
- Removed deprecated feature.
\\\`\\\`\\\`

## Checklist
- [ ] README has Quick Start that works in \\\`< 5 minutes\\\`.
- [ ] All public APIs documented with parameters, return types, examples.
- [ ] Architecture decisions recorded as ADRs.
- [ ] Changelog updated for every release.
- [ ] Environment variables documented with types and defaults.
- [ ] Diagrams for complex data flows or architecture.
- [ ] No stale docs — update docs when changing code.
`;

   files['.github/skills/memory-management.md'] = `# Skill: Project Memory & Context Management

## Core Memory Files
Maintain these files to provide persistent context across AI sessions:

### 1. Product Requirements (docs/product_requirements.md)
- **Purpose**: Define project goals, problems solved, core requirements
- **Update**: When scope changes or new features are planned
- **Contents**: User stories, success metrics, constraints, stakeholders

### 2. Architecture (docs/architecture.md)
- **Purpose**: System design, component relationships, dependencies
- **Update**: When adding major components or changing architecture
- **Contents**: Diagrams, data flow, integration points, tech stack

### 3. Technical Specs (docs/technical.md)
- **Purpose**: Development environment, key decisions, patterns
- **Update**: When adopting new patterns or making technical decisions
- **Contents**: Setup instructions, design patterns, coding standards, dependencies

### 4. Active Context (docs/active_context.md)
- **Purpose**: Current development focus and recent changes
- **Update**: At start/end of each work session
- **Contents**: Current focus, recent changes, next steps, blockers

### 5. Lessons Learned (docs/lessons_learned.md)
- **Purpose**: Capture patterns, mistakes, and solutions
- **Update**: When encountering and solving non-trivial issues
- **Contents**: Problem -> Solution -> Why it worked

### 6. Error Documentation (docs/error_log.md)
- **Purpose**: Reusable fixes for recurring issues
- **Update**: When fixing bugs that might recur
- **Contents**: Error signature -> Root cause -> Fix -> Prevention

## Memory Update Workflow
1. **Session Start**: Read \`active_context.md\` to resume work
2. **During Work**: Update \`active_context.md\` with decisions and changes
3. **Session End**: Summarize progress, update next steps
4. **Major Changes**: Update architecture/technical docs
5. **Lessons**: Document non-obvious solutions in \`lessons_learned.md\`

## Checklist
- [ ] All core memory files exist and are up-to-date
- [ ] Active context reflects current work accurately
- [ ] Architecture docs match actual implementation
- [ ] Technical decisions are documented with rationale
- [ ] Lessons learned capture reusable knowledge
- [ ] Error log prevents repeat mistakes
`;

   files['.github/skills/workflow-enforcement.md'] = `# Skill: Structured Development Workflow

## Five-Phase Development Cycle
Apply this workflow to every task, from small features to entire projects.

### Phase 1: Requirements & Clarification
**Goal**: Make requirements crystal clear before any work begins.

**Actions**:
1. Read and understand the request thoroughly
2. Ask clarifying questions:
   - What is the expected behavior?
   - What are the edge cases?
   - What are the acceptance criteria?
   - Are there performance/security constraints?
3. Document requirements in \`docs/active_context.md\`
4. Identify potential bottlenecks or risks upfront

**Output**: Clear, unambiguous requirements document

### Phase 2: Exhaustive Search & Optimal Plan
**Goal**: Explore all solution approaches and choose the best one.

**Actions**:
1. Search codebase for existing patterns to follow
2. Consider multiple approaches:
   - Simplest solution
   - Most maintainable solution
   - Highest performance solution
3. Evaluate trade-offs for each approach
4. Select optimal approach with clear reasoning
5. Break down into incremental steps

**Output**: Detailed implementation plan with justification

### Phase 3: User Validation
**Goal**: Confirm plan before implementation.

**Actions**:
1. Present the plan to user/team
2. Clearly state assumptions and design decisions
3. Explain why this approach is optimal
4. Get explicit approval before proceeding

**Output**: Approved plan ready for implementation

### Phase 4: Incremental Implementation
**Goal**: Build iteratively with continuous validation.

**Actions**:
1. Implement one functionality at a time
2. Test exhaustively after each increment:
   - Happy path
   - Edge cases
   - Error conditions
3. Update \`active_context.md\` with progress
4. Commit working increments (not broken code)
5. Move to next functionality only when current is solid

**Output**: Fully tested, working implementation

### Phase 5: Optimization & Suggestions
**Goal**: Improve and future-proof the solution.

**Actions**:
1. Review for optimization opportunities
2. Check security implications
3. Suggest additional features or improvements
4. Update documentation and memory files
5. Document lessons learned

**Output**: Polished solution + recommendations

## Workflow Checklist
- [ ] Requirements clarified and documented
- [ ] Multiple approaches considered
- [ ] Optimal plan selected with reasoning
- [ ] Plan validated before implementation
- [ ] Implemented incrementally with tests
- [ ] Each increment works before moving on
- [ ] Optimizations identified and applied
- [ ] Documentation updated
- [ ] Lessons learned captured
`;

   files['.github/skills/meta-instructions.md'] = `# Skill: Writing Effective AI Instructions

## Purpose
This meta-skill defines how to write, structure, and validate instruction files for AI coding assistants.

## Instruction File Structure

### 1. Header
- Start with category and specific topic
- Include purpose statement (one sentence)
- Define when to apply (specific conditions)

### 2. Core Rules
- Use imperative mood: "Use X" not "You should use X"
- Be specific and actionable: "Cache in Awake" not "Cache early"
- Provide rationale: "Use X because Y"
- Include anti-patterns: "Never do X because Y"

### 3. Examples
- Show correct implementation
- Show incorrect implementation with explanation
- Use realistic, project-relevant examples

### 4. Checklist
- Actionable verification items
- Binary yes/no checks
- Ordered by importance

## Instruction Quality Criteria

### Clarity
- [ ] No ambiguous terms or vague guidance
- [ ] Technical terms defined or linked
- [ ] Examples match the instruction level (beginner/advanced)

### Completeness
- [ ] Covers happy path and edge cases
- [ ] Includes error handling guidance
- [ ] Addresses common mistakes

### Consistency
- [ ] Aligns with other instructions in the project
- [ ] Uses same terminology as codebase
- [ ] Follows project coding standards

### Actionability
- [ ] Every rule can be verified
- [ ] Checklist items are testable
- [ ] Examples can be copy-pasted and adapted

## Validation Process
Before finalizing an instruction file:

1. **Clarity Check**: Can a junior developer understand it?
2. **Completeness Check**: Does it cover all scenarios?
3. **Consistency Check**: Does it align with existing rules?
4. **Test**: Apply it to real code and verify it works
5. **Review**: Get feedback from team members

## Checklist
- [ ] Instruction follows the standard template
- [ ] All sections are complete and clear
- [ ] Examples are realistic and tested
- [ ] Checklist items are actionable
- [ ] No contradictions with other instructions
- [ ] Validated against real code
`;

   files['.github/skills/ai-agent-behavior.md'] = `# Skill: AI Agent Behavior Patterns

## Follow-Up Question Enforcement
Before generating code, AI must ask clarifying questions when:

### Ambiguity Triggers
- Requirements mention "it" or "this" without clear referent
- Multiple valid interpretations exist
- Edge cases are not specified
- Performance/security requirements are unclear
- Integration points are not defined

### Required Questions
1. **Scope**: "Should this handle [edge case X]?"
2. **Behavior**: "When [condition Y], should it [action A] or [action B]?"
3. **Constraints**: "Are there performance/memory/security requirements?"
4. **Integration**: "How should this interact with [existing component]?"
5. **Validation**: "What are the acceptance criteria?"

### Confidence Declaration
Before implementing, AI should state understanding, key assumptions, edge cases to handle, and confidence level (High/Medium/Low).

## Reasoning Before Action
AI should think step-by-step:

### 1. Understand Context
- Read relevant files
- Identify existing patterns
- Check for similar implementations

### 2. Plan Approach
- List possible solutions
- Evaluate trade-offs
- Select best approach with reasoning

### 3. Verify Before Implementing
- Check assumptions
- Confirm approach aligns with project standards
- Identify potential issues

### 4. Implement Incrementally
- Start with smallest working unit
- Test before adding complexity
- Refactor as needed

## Code Generation Principles

### Read Before Write
- [ ] Existing code patterns identified
- [ ] Similar implementations found and studied
- [ ] Project conventions understood
- [ ] Dependencies and constraints known

### Minimal Changes
- [ ] Only modify what's necessary
- [ ] Preserve existing style and patterns
- [ ] No unnecessary refactoring
- [ ] No scope creep

### Test Coverage
- [ ] Happy path tested
- [ ] Edge cases tested
- [ ] Error conditions tested
- [ ] Integration points verified

### Documentation
- [ ] Code is self-documenting
- [ ] Complex logic has comments explaining WHY
- [ ] Public APIs have clear documentation
- [ ] Breaking changes are noted

## Response Format
Structure AI responses with: Understanding, Approach, Implementation, Testing, and Next Steps sections.

## Checklist
- [ ] Clarifying questions asked when needed
- [ ] Confidence level stated before implementation
- [ ] Existing code patterns followed
- [ ] Changes are minimal and focused
- [ ] Tests cover all scenarios
- [ ] Documentation is clear and complete
`;

   files['.github/skills/accessibility.md'] = `# Skill: Web Accessibility (WCAG 2.1 AA)

## Semantic HTML
- Use correct elements: \\\`<nav>\\\`, \\\`<main>\\\`, \\\`<section>\\\`, \\\`<article>\\\`, \\\`<aside>\\\`, \\\`<header>\\\`, \\\`<footer>\\\`.
- One \\\`<h1>\\\` per page. Headings in order: h1 → h2 → h3 (no skipping).
- Use \\\`<button>\\\` for actions, \\\`<a>\\\` for navigation. Never \\\`<div onClick>\\\`.
- Use \\\`<ul>\\\`/\\\`<ol>\\\` for lists. Use \\\`<table>\\\` for tabular data.

## Images & Media
- All \\\`<img>\\\` must have \\\`alt\\\` text. Decorative images: \\\`alt=""\\\`.
- Complex images (charts, diagrams) need extended descriptions.
- Videos need captions. Audio needs transcripts.

## Forms
- Every input must have a visible \\\`<label>\\\` (or \\\`aria-label\\\`).
- Group related fields with \\\`<fieldset>\\\` + \\\`<legend>\\\`.
- Error messages linked to inputs via \\\`aria-describedby\\\`.
- Required fields marked with \\\`aria-required="true"\\\`.
- Focus moves to the first error on submit.

## Keyboard Navigation
- All interactive elements reachable via Tab key.
- Visible focus indicator (never \\\`outline: none\\\` without replacement).
- Escape closes modals/dropdowns. Enter/Space activates buttons.
- Focus trapping inside modals (Tab cycles within modal).
- Skip links: \\\`<a href="#main" class="sr-only focus:not-sr-only">Skip to content</a>\\\`.

## Color & Contrast
- Text contrast ratio: **4.5:1** minimum (AA). Large text: **3:1**.
- Never use color alone to convey information (add icons, text, patterns).
- Test with grayscale filter to verify.

## ARIA Rules
- First rule of ARIA: don't use ARIA if native HTML works.
- \\\`aria-label\\\` for elements without visible text.
- \\\`aria-live="polite"\\\` for dynamic content updates (toasts, loading).
- \\\`role="alert"\\\` for error messages.
- \\\`aria-expanded\\\` for collapsible sections and dropdowns.

## Testing Tools
- Lighthouse accessibility audit (Chrome DevTools).
- axe DevTools browser extension.
- Screen reader testing: VoiceOver (Mac), NVDA (Windows).
- Keyboard-only navigation test.

## Checklist
- [ ] All images have appropriate alt text.
- [ ] All form inputs have labels.
- [ ] Color contrast meets WCAG AA (4.5:1).
- [ ] All functionality accessible via keyboard.
- [ ] Focus order is logical and visible.
- [ ] No content conveyed by color alone.
- [ ] ARIA used correctly (or not at all if native HTML suffices).
- [ ] Tested with screen reader.
`;

   // ── TypeScript / React / Node skills ─────────────────────────

   if (stacks.some((s) => ['ts', 'react', 'node', 'nestjs'].includes(s))) {
      files['.github/skills/create-service.md'] = `# Skill: Create a TypeScript Service

## Template
\`\`\`typescript
// src/services/<name>.service.ts
import type { <InputType>, <ReturnType> } from '../types';

export interface <Name>ServiceDeps {
  // inject DB, logger, other services here
}

export class <Name>Service {
  constructor(private readonly deps: <Name>ServiceDeps) {}

  async <methodName>(input: <InputType>): Promise<<ReturnType>> {
    // 1. Validate input
    // 2. Execute core logic
    // 3. Return result
  }
}
\`\`\`

## Checklist
- [ ] All public methods have explicit return types.
- [ ] Input validated at the start of each method.
- [ ] Dependencies injected via constructor (no global imports).
- [ ] Unit tests mock all injected dependencies.
- [ ] Errors thrown as typed custom error classes.
`;

      files['.github/skills/create-types.md'] = `# Skill: Design TypeScript Types

## Prefer interfaces for object shapes
\`\`\`typescript
interface User {
  readonly id: string;
  email: string;
  createdAt: Date;
}
\`\`\`

## Discriminated unions for state
\`\`\`typescript
type RequestState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };
\`\`\`

## Const object + derived union (prefer over enum)
\`\`\`typescript
const ROLE = { Admin: 'admin', User: 'user', Guest: 'guest' } as const;
type Role = (typeof ROLE)[keyof typeof ROLE];
\`\`\`

## Branded types for primitives
\`\`\`typescript
type UserId = string & { readonly _brand: 'UserId' };
const toUserId = (id: string): UserId => id as UserId;
\`\`\`

## Checklist
- [ ] No \`any\` — use \`unknown\` + type guard if type is truly unknown.
- [ ] No unconstrained generics — use \`<T extends Base>\`.
- [ ] Readonly where mutation is unintended.
- [ ] \`import type\` for type-only imports.
`;
   }

   // ── React skills ──────────────────────────────────────────────

   if (stacks.includes('react')) {
      files['.github/skills/create-component.md'] = `# Skill: Create a React Component

## Template
\`\`\`tsx
// src/components/<Name>/<Name>.tsx
import { type FC } from 'react';

export interface <Name>Props {
  // define props here
}

export const <Name>: FC<<Name>Props> = ({ /* props */ }) => {
  // hooks at the top
  // handlers named handle<Event>
  // early returns for loading/error states

  return (
    <div>
      {/* JSX */}
    </div>
  );
};

<Name>.displayName = '<Name>';
\`\`\`

## Checklist
- [ ] Props interface exported and named \`<Name>Props\`.
- [ ] No inline arrow functions in JSX — extract to named handlers.
- [ ] \`useCallback\` for functions passed to child components.
- [ ] Loading + error states handled explicitly.
- [ ] Accessible: alt text on images, labels on inputs, aria where needed.
- [ ] Colors only via Tailwind semantic tokens (no hardcoded hex).
- [ ] Tested: renders without crash, key interactions covered.
- [ ] Performance: Large lists are virtualized, expensive children are memoized.
`;

      files['.github/skills/create-hook.md'] = `# Skill: Create a Custom React Hook

## Template
\`\`\`typescript
// src/hooks/use<Name>.ts
import { useState, useEffect, useCallback } from 'react';

interface Use<Name>Options {
  // options
}

interface Use<Name>Return {
  // return values
}

export function use<Name>(options: Use<Name>Options): Use<Name>Return {
  const [state, setState] = useState<...>(/* initial */);

  useEffect(() => {
    // side effect
    return () => {
      // cleanup
    };
  }, [/* deps */]);

  const handleAction = useCallback(() => {
    // handler
  }, [/* deps */]);

  return { state, handleAction };
}
\`\`\`

## Checklist
- [ ] Named \`use<Name>\` (camelCase, "use" prefix).
- [ ] Returns a plain object (not array) unless mimicking useState pair.
- [ ] All effect dependencies listed correctly.
- [ ] Cleanup in useEffect return for subscriptions/timers.
- [ ] No direct DOM manipulation — use refs when needed.
- [ ] Unit tested in isolation with \`renderHook\`.
- [ ] Performance: State updates are batched/deferred if they cause heavy renders.
`;

      files['.github/skills/create-page.md'] = `# Skill: Create a Next.js Page / Route

## App Router page template
\`\`\`tsx
// app/<route>/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '<Page Title>',
  description: '<description>',
};

interface PageProps {
  params: { /* route params */ };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function <Name>Page({ params, searchParams }: PageProps) {
  // fetch data server-side here

  return (
    <main className="container mx-auto px-4 md:px-6">
      {/* page content */}
    </main>
  );
}
\`\`\`

## Checklist
- [ ] Metadata exported for SEO.
- [ ] Data fetching in Server Component (not client-side useEffect).
- [ ] Loading state: \`loading.tsx\` sibling file.
- [ ] Error state: \`error.tsx\` sibling file.
- [ ] Route params typed via \`PageProps\`.
- [ ] Page container uses \`container mx-auto px-4 md:px-6\`.
- [ ] Performance: Heavy client components are dynamically imported (\`next/dynamic\`).
`;
   }

   // ── Node API skills ───────────────────────────────────────────

   if (stacks.includes('node')) {
      files['.github/skills/create-endpoint.md'] = `# Skill: Create a REST API Endpoint

## Template (Express / Hono / Fastify pattern)
\`\`\`typescript
// src/routes/<resource>.routes.ts
import { Router } from 'express'; // or equivalent
import { z } from 'zod';
import { <Resource>Service } from '../services/<resource>.service';

const router = Router();

const Create<Resource>Schema = z.object({
  // define body schema
});

router.post('/<resource>', async (req, res, next) => {
  try {
    const body = Create<Resource>Schema.parse(req.body);
    const result = await <Resource>Service.create(body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
\`\`\`

## Checklist
- [ ] Input validated with schema (Zod / Joi) — never trust raw req.body.
- [ ] Correct HTTP status codes: 201 created, 200 ok, 400 bad input, 404 not found, 409 conflict.
- [ ] Errors forwarded to \`next(err)\` — not swallowed.
- [ ] Auth middleware applied where required.
- [ ] Response shape consistent with rest of API.
- [ ] Integration test added for happy path + error cases.
- [ ] Performance: DB calls are concurrent (\`Promise.all\`), no sync blocking calls.
`;

      files['.github/skills/create-middleware.md'] = `# Skill: Create Express Middleware

## Template
\`\`\`typescript
// src/middleware/<name>.middleware.ts
import type { Request, Response, NextFunction } from 'express';

export function <name>Middleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    // middleware logic
    next();
  } catch (err) {
    next(err);
  }
}
\`\`\`

## Error middleware (must have 4 params)
\`\`\`typescript
export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const status = err instanceof AppError ? err.statusCode : 500;
  const code   = err instanceof AppError ? err.code : 'INTERNAL_ERROR';
  res.status(status).json({ error: { code, message: String(err) } });
}
\`\`\`

## Checklist
- [ ] Always call \`next()\` or \`next(err)\` — never leave request hanging.
- [ ] Error middleware registered LAST in the app.
- [ ] No business logic in middleware — delegate to services.
- [ ] Middleware is stateless (no shared mutable state).
`;
   }

   // ── Python skills ─────────────────────────────────────────────

   if (stacks.includes('python')) {
      files['.github/skills/create-module.md'] = `# Skill: Create a Python Module

## Template
\`\`\`python
# src/<package>/<module>.py
"""<Module docstring: one-line summary.>

<Optional extended description.>
"""
from __future__ import annotations

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    pass  # type-only imports here


def <function_name>(param: <Type>) -> <ReturnType>:
    """<Summary line.>

    Args:
        param: Description.

    Returns:
        Description of return value.

    Raises:
        ValueError: When <condition>.
    """
    # implementation
\`\`\`

## Checklist
- [ ] Module-level docstring.
- [ ] All public functions have type hints and Google-style docstrings.
- [ ] \`from __future__ import annotations\` at the top.
- [ ] No mutable default arguments (\`def f(x=[]):\` is a bug).
- [ ] \`__all__\` list defined to control public API.
- [ ] Corresponding \`test_<module>.py\` created.
- [ ] Performance: Uses generators/yield for large sequences instead of lists.
`;

      files['.github/skills/create-dataclass.md'] = `# Skill: Create a Pydantic Model / Dataclass

## Pydantic v2 model
\`\`\`python
from pydantic import BaseModel, Field, field_validator

class <Name>(BaseModel):
    id: str = Field(..., description="Unique identifier")
    name: str = Field(..., min_length=1, max_length=100)
    value: float = Field(..., ge=0)

    @field_validator('name')
    @classmethod
    def validate_name(cls, v: str) -> str:
        return v.strip()

    model_config = {"frozen": True}  # immutable
\`\`\`

## Python dataclass (stdlib)
\`\`\`python
from dataclasses import dataclass, field

@dataclass(frozen=True)
class <Name>:
    id: str
    name: str
    tags: list[str] = field(default_factory=list)
\`\`\`

## Checklist
- [ ] Use Pydantic for external data (API requests/responses, config).
- [ ] Use \`@dataclass(frozen=True)\` for internal value objects.
- [ ] No raw \`dict\` for structured data — always a model/dataclass.
- [ ] Validators for non-trivial constraints.
- [ ] Fields documented with \`Field(description=...)\`.
`;
   }

   // ── NestJS skills ──────────────────────────────────────────────

   if (stacks.includes('nestjs')) {
      files['.github/skills/create-nestjs-module.md'] = `# Skill: Create a NestJS Module

## Template
\\\`\\\`\\\`typescript
// src/<feature>/<feature>.module.ts
import { Module } from '@nestjs/common';
import { <Feature>Controller } from './<feature>.controller';
import { <Feature>Service } from './<feature>.service';

@Module({
  imports: [],
  controllers: [<Feature>Controller],
  providers: [<Feature>Service],
  exports: [<Feature>Service], // export if other modules need this service
})
export class <Feature>Module {}
\\\`\\\`\\\`

## File structure
\\\`\\\`\\\`
src/<feature>/
├── <feature>.module.ts
├── <feature>.controller.ts
├── <feature>.service.ts
├── dto/
│   ├── create-<feature>.dto.ts
│   └── update-<feature>.dto.ts
├── entities/
│   └── <feature>.entity.ts
├── <feature>.controller.spec.ts
└── <feature>.service.spec.ts
\\\`\\\`\\\`

## Checklist
- [ ] Module registered in parent module's \\\`imports\\\` array.
- [ ] Controller handles HTTP only — no business logic.
- [ ] Service contains all business logic, injected via constructor.
- [ ] DTOs created for all request bodies with \\\`class-validator\\\` decorators.
- [ ] Entity defined with proper TypeORM/Prisma decorators.
- [ ] Unit tests for service and controller.
- [ ] Exports only what other modules need.
`;

      files['.github/skills/create-nestjs-controller.md'] = `# Skill: Create a NestJS REST Controller

## Template
\\\`\\\`\\\`typescript
// src/<feature>/<feature>.controller.ts
import {
  Controller, Get, Post, Put, Delete,
  Param, Body, Query, HttpCode, HttpStatus,
  ParseUUIDPipe, UsePipes, ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { <Feature>Service } from './<feature>.service';
import { Create<Feature>Dto } from './dto/create-<feature>.dto';
import { Update<Feature>Dto } from './dto/update-<feature>.dto';

@ApiTags('<feature>')
@Controller('<feature>')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class <Feature>Controller {
  constructor(private readonly <feature>Service: <Feature>Service) {}

  @Post()
  @ApiOperation({ summary: 'Create <feature>' })
  @ApiResponse({ status: 201, description: 'Created successfully.' })
  create(@Body() dto: Create<Feature>Dto) {
    return this.<feature>Service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all <feature>s' })
  findAll(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.<feature>Service.findAll({ page: +page, limit: +limit });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get <feature> by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.<feature>Service.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update <feature>' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: Update<Feature>Dto,
  ) {
    return this.<feature>Service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete <feature>' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.<feature>Service.remove(id);
  }
}
\\\`\\\`\\\`

## Checklist
- [ ] All routes use proper HTTP method decorators.
- [ ] Request data extracted via \\\`@Param()\\\`, \\\`@Body()\\\`, \\\`@Query()\\\` — not raw \\\`req\\\`.
- [ ] \\\`ValidationPipe\\\` applied with \\\`whitelist: true\\\`.
- [ ] Swagger decorators for API documentation.
- [ ] \\\`ParseUUIDPipe\\\` (or \\\`ParseIntPipe\\\`) for ID params.
- [ ] No business logic — only calls to service methods.
- [ ] Proper HTTP status codes for each operation.
- [ ] No long-running, CPU-heavy synchronous tasks inside route handlers (keeps event loop free).
`;

      files['.github/skills/create-nestjs-dto.md'] = `# Skill: Create NestJS DTOs

## Create DTO
\\\`\\\`\\\`typescript
// src/<feature>/dto/create-<feature>.dto.ts
import {
  IsString, IsNotEmpty, IsEmail, IsOptional,
  MinLength, MaxLength, IsEnum, IsNumber, Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Create<Feature>Dto {
  @ApiProperty({ description: 'Name of the <feature>', example: 'Example' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({ description: 'Email address', example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ description: 'Optional description' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
\\\`\\\`\\\`

## Update DTO (using mapped types)
\\\`\\\`\\\`typescript
// src/<feature>/dto/update-<feature>.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { Create<Feature>Dto } from './create-<feature>.dto';

export class Update<Feature>Dto extends PartialType(Create<Feature>Dto) {}
\\\`\\\`\\\`

## Response DTO
\\\`\\\`\\\`typescript
// src/<feature>/dto/<feature>-response.dto.ts
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class <Feature>ResponseDto {
  @Expose() id: string;
  @Expose() name: string;
  @Expose() email: string;
  @Expose() createdAt: Date;
  // password, internal fields etc. are excluded automatically
}
\\\`\\\`\\\`

## Checklist
- [ ] Every field has \\\`class-validator\\\` decorators.
- [ ] \\\`@ApiProperty()\\\` / \\\`@ApiPropertyOptional()\\\` for Swagger.
- [ ] Update DTO extends \\\`PartialType(CreateDto)\\\` — DRY.
- [ ] Response DTO uses \\\`@Exclude()\\\`/\\\`@Expose()\\\` to control output.
- [ ] Optional fields marked with \\\`@IsOptional()\\\` + \\\`?\\\` suffix.
- [ ] No raw \\\`any\\\` types in DTOs.
`;

      files['.github/skills/create-nestjs-guard.md'] = `# Skill: Create a NestJS Guard

## Auth Guard Template
\\\`\\\`\\\`typescript
// src/auth/guards/jwt-auth.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Check if route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);
    if (!token) throw new UnauthorizedException('Missing auth token');

    try {
      // validate token, attach user to request
      // request.user = decoded;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private extractToken(request: any): string | null {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : null;
  }
}
\\\`\\\`\\\`

## Custom Public Decorator
\\\`\\\`\\\`typescript
// src/auth/decorators/public.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
\\\`\\\`\\\`

## Usage
\\\`\\\`\\\`typescript
// Apply globally in main.ts
app.useGlobalGuards(new JwtAuthGuard(new Reflector()));

// Skip auth for specific routes
@Public()
@Get('health')
healthCheck() { return { status: 'ok' }; }
\\\`\\\`\\\`

## Checklist
- [ ] Guard implements \\\`CanActivate\\\` interface.
- [ ] Uses \\\`Reflector\\\` to check metadata for public routes.
- [ ] Throws \\\`UnauthorizedException\\\` with clear message.
- [ ] Token extraction handles missing/malformed headers gracefully.
- [ ] Guard registered globally or per-controller as appropriate.
- [ ] Corresponding \\\`@Public()\\\` decorator for unauthenticated routes.
`;
   }

   // ── Unity skills ──────────────────────────────────────────────

   if (stacks.includes('unity')) {
      files['.github/skills/create-monobehaviour.md'] = `# Skill: Create a MonoBehaviour

## Template
\`\`\`csharp
using UnityEngine;
using UnityEngine.Events;

/// <summary>
/// Brief description of what this component does.
/// </summary>
[RequireComponent(typeof(/* required component */))]
public sealed class <Name> : MonoBehaviour
{
    [Header("Config")]
    [SerializeField, Tooltip("Description of field.")] 
    private float _speed = 5f;

    [Header("Events")]
    public UnityEvent onActionComplete;

    // ── Cached references ─────────────────────────────
    private Rigidbody _rb;
    // private <OtherComponent> _other;

    // ── Lifecycle ─────────────────────────────────────
    private void Awake()
    {
        _rb = GetComponent<Rigidbody>(); // cache here, never in Update
    }

    private void OnEnable()
    {
        // subscribe to events
    }

    private void OnDisable()
    {
        // unsubscribe from events, stop coroutines
        StopAllCoroutines();
    }

    private void Start()
    {
        // initialization after all Awake() calls
    }

    private void Update()
    {
        // keep THIN — only read input, trigger state changes
    }

    private void FixedUpdate()
    {
        // physics / Rigidbody movement only
    }

    // ── Public API ────────────────────────────────────
    public void DoAction()
    {
        // logic
        onActionComplete.Invoke();
    }
}
\`\`\`

## Checklist
- [ ] All \`GetComponent\` calls cached in \`Awake\`.
- [ ] No \`FindObjectOfType\` / \`Camera.main\` in \`Update\`.
- [ ] Events unsubscribed in \`OnDisable\`.
- [ ] Coroutines stopped in \`OnDisable\`/\`OnDestroy\`.
- [ ] \`[Header]\`, \`[Tooltip]\` on all serialized fields.
- [ ] \`[RequireComponent]\` for hard dependencies.
- [ ] Class is \`sealed\` unless inheritance is needed.
- [ ] Performance: Zero allocations (no \`new\`) in \`Update\` or \`FixedUpdate\`.
`;

      files['.github/skills/create-scriptableobject.md'] = `# Skill: Create a ScriptableObject

## Template
\`\`\`csharp
using UnityEngine;

/// <summary>
/// <Description — what data this asset holds and when to use it.>
/// </summary>
[CreateAssetMenu(
    menuName = "Game/<Category>/<Name>",
    fileName = "New<Name>",
    order = 0)]
public sealed class <Name>SO : ScriptableObject
{
    [Header("Settings")]
    [SerializeField, Tooltip("Description.")] 
    private float _value = 1f;

    // Public read-only access
    public float Value => _value;

    // Optional: runtime state (reset on play if needed)
    // Use a separate RuntimeSet pattern for lists of objects.
}
\`\`\`

## When to use ScriptableObject
| Use case | Pattern |
|----------|---------|
| Config / tuning values | Plain SO with serialized fields |
| Shared runtime data between components | SO as data container |
| Events with no payload | \`ScriptableObject\` + \`UnityEvent\` |
| Item/ability definitions | SO as template + MonoBehaviour as instance |

## Checklist
- [ ] \`[CreateAssetMenu]\` with descriptive menu path.
- [ ] All fields serialized as private + property getter.
- [ ] No MonoBehaviour lifecycle methods in ScriptableObjects.
- [ ] Documented when and where the asset is used.
- [ ] Placed in \`Assets/Data/<Category>/\` folder.
`;

      files['.github/skills/unity-architecture.md'] = `# Skill: Unity Component Architecture

## Separation of concerns
| Layer | Responsibility | Example |
|-------|---------------|---------|
| Data | Config, definitions | ScriptableObject |
| State | Runtime values | StateManager, SO data container |
| Logic | Pure C# — no UnityEngine | Calculator, Pathfinder |
| Presentation | MonoBehaviour + View | PlayerView, UIHealthBar |
| Glue | Wires data → logic → view | PlayerController |

## Communication patterns
\`\`\`
// ✅ Good: decoupled via C# events
public class Health : MonoBehaviour {
    public event Action<float> OnChanged;
    public event Action OnDied;
}

// ✅ Good: decoupled via UnityEvent (inspector-wired)
public UnityEvent<float> onHealthChanged;

// ❌ Bad: tightly coupled direct reference
GetComponent<UIHealthBar>().UpdateBar(hp); // creates hard dependency
\`\`\`

## Object Pooling boilerplate
\`\`\`csharp
// Minimal pool using Unity 2021+ ObjectPool
using UnityEngine.Pool;

private IObjectPool<Bullet> _pool;

private void Awake() {
    _pool = new ObjectPool<Bullet>(
        createFunc:     () => Instantiate(_prefab),
        actionOnGet:    obj => obj.gameObject.SetActive(true),
        actionOnRelease:obj => obj.gameObject.SetActive(false),
        actionOnDestroy:obj => Destroy(obj.gameObject),
        defaultCapacity: 20, maxSize: 100);
}
\`\`\`

## Checklist
- [ ] No direct component references across unrelated GameObjects.
- [ ] Use object pooling for bullets, particles, enemies.
- [ ] ScriptableObject for all designer-tunable values.
- [ ] Pure C# classes for all testable game logic.
`;
   }

   return files;
}
