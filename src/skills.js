// ================================================================
//  SKILLS - Stack-aware reusable task templates
// ================================================================

export function buildSkills({ stacks }) {
   const files = {};

   // ── Common skills (all stacks) ────────────────────────────────

   files['.github/skills/git-workflow.md'] = `# Skill: Git Workflow

## Commits — Conventional Commits
\`type(scope): description\` — imperative mood, ≤72 chars, no trailing period.
Types: \`feat\` · \`fix\` · \`refactor\` · \`test\` · \`docs\` · \`perf\` · \`chore\` · \`style\`
Body: explain **WHY**, not what. Footer: \`Closes #123\` or \`Breaking change: …\`.

## Branches
\`feat/<desc>\` · \`fix/<desc>\` · \`hotfix/<desc>\` · \`release/v<semver>\`

## PR Checklist
- [ ] Tests pass; no debug logs or commented-out code
- [ ] No hardcoded secrets or tokens
- [ ] Self-reviewed diff; description explains WHY
- [ ] Breaking changes documented
`;

   files['.github/skills/debug.md'] = `# Skill: Debug an Issue

## Steps
1. **Reproduce** — minimal, repeatable case.
2. **Isolate** — binary-search the code path; add logs to narrow scope.
3. **Hypothesize** — form a specific theory for the root cause.
4. **Verify** — write a failing test that proves the bug.
5. **Fix** — smallest change that fixes the failing test.
6. **Regression test** — ensure the test stays green.
7. **Scan** — look for the same pattern elsewhere.

## Rules
- Don't fix symptoms — find the root cause.
- Don't suppress errors without understanding them.
- Check recent git changes: \`git log --oneline -20\`, \`git diff HEAD~1\`.
`;

   files['.github/skills/code-review.md'] = `# Skill: Code Review

## Process
1. **Understand** — Read PR description and linked issue first.
2. **Skim** — big picture, shape of the change.
3. **Deep dive** — logic, edge cases, naming, security.
4. **Test mentally** — trace code path with happy + unhappy inputs.
5. **Comment** — be specific, suggest fixes, explain reasoning.

## What to Check
- **Correctness**: all cases handled? Edge cases?
- **Security**: input validated? Secrets exposed? Injection?
- **Performance**: N+1 queries? Unbounded loops?
- **Tests**: happy + edge + error cases covered?

## Rules
- Explain WHY and suggest a fix — don't just say "this is wrong".
- Don't nitpick style if a linter handles it.
- Don't block on subjective preferences.
`;

   files['.github/skills/api-design.md'] = `# Skill: Design a REST API

## URL Conventions
- Nouns, not verbs: \`/users\` not \`/getUsers\`. Plural. Kebab-case.
- Nest for relationships: \`/users/:id/orders\`.
- Version prefix: \`/api/v1/…\`.

## HTTP Methods
| Method | Purpose | Idempotent | Success |
|--------|---------|------------|---------|
| GET | Read | Yes | 200 |
| POST | Create | No | 201 |
| PUT | Replace | Yes | 200 |
| PATCH | Partial | No | 200 |
| DELETE | Remove | Yes | 204 |

## Pagination & Filtering
- Cursor-based (\`?cursor=abc&limit=20\`) or offset-based (\`?page=1&limit=20\`).
- Filter: \`?status=active\`. Sort: \`?sort=created_at:desc\`.

## Checklist
- [ ] Consistent response shape (\`{ data, meta }\` / \`{ error: { code, message } }\`)
- [ ] Pagination on all list endpoints
- [ ] Input validation with clear error messages
- [ ] Auth on protected routes; rate limiting on public ones
`;

   files['.github/skills/system-design.md'] = `# Skill: Design a Scalable Change

## When to use
- Feature crosses module/service boundaries.
- New API, queue, cache, background job, or data model.
- Traffic/data volume can grow; failure handling matters.

## 1. Shape
- Identify actors, entry points, read vs write paths.
- Define data ownership, invariants, volume/latency constraints.

## 2. Boundaries
- Transport → services/use-cases → data-access.
- Feature-oriented modules with explicit contracts.
- Add queues/caches only for clear bottlenecks.

## 3. Scalability checklist
- [ ] List operations paginate and enforce max limits.
- [ ] Expensive work batched, streamed, or off the request path.
- [ ] Query/index strategy matches access patterns.
- [ ] Concurrency bounded; backpressure controlled.
- [ ] Cache TTL and invalidation strategy explicit.

## 4. Reliability & observability
- [ ] Timeouts and cancellation for external I/O.
- [ ] Retries are safe; idempotency defined for mutations.
- [ ] Partial failures and race conditions considered.
- [ ] Structured logs/metrics at important boundaries.

## 5. Rollout & compatibility
- [ ] Changes are additive and backward-compatible.
- [ ] Schema/API migrations support mixed-version rollout.
- [ ] Feature flags and rollback steps defined.
`;

   files['.github/skills/create-migration.md'] = `# Skill: Create a Database Migration

## Principles
- Migrations are **immutable** once deployed. Never edit a merged migration.
- Every migration must be **reversible** (up + down).
- One logical change per file. Don't mix schema + data changes.

## Safe Patterns
| Change | Safe approach |
|--------|--------------|
| Add column | Nullable or with default |
| Rename column | Add new → backfill → drop old (3 steps) |
| Remove column | Stop reading → deploy → drop |
| Add index | \`CREATE INDEX CONCURRENTLY\` (Postgres) |
| Change type | Add new → migrate data → swap → drop |

## Checklist
- [ ] No table locks on large tables
- [ ] New columns nullable or have defaults
- [ ] App handles both old and new schema during rollout
- [ ] Rollback tested; data backfill is a separate step
`;

   files['.github/skills/docker-deploy.md'] = `# Skill: Docker & Deployment

## Docker Rules
- Multi-stage builds; pin base image versions (not \`:latest\`).
- Run as non-root user. One process per container.
- \`.dockerignore\`: \`node_modules\`, \`.git\`, \`.env\`, tests, docs.
- Health checks: \`HEALTHCHECK CMD curl -f http://localhost:3000/health || exit 1\`.

## CI/CD Checklist
- [ ] Lint + type check + tests pass
- [ ] Docker image builds and passes security scan
- [ ] Env vars documented and validated
- [ ] DB migrations run before deploy
- [ ] Health check verified post-deploy
- [ ] Rollback plan documented
`;

   files['.github/skills/write-docs.md'] = `# Skill: Write Documentation

## README Structure
Project name → one-line description → Quick Start (≤5 steps) → Features → Installation → Usage → API Reference → Contributing → License.

## Key Formats
- **ADR**: Date, Status, Context, Decision, Consequences, Alternatives.
- **Changelog**: Keep a Changelog format — Added / Changed / Fixed / Removed per version.

## Checklist
- [ ] Quick Start works in < 5 minutes
- [ ] Public APIs documented with params, return types, examples
- [ ] Architecture decisions recorded as ADRs
- [ ] Env vars documented with types and defaults
- [ ] No stale docs — update when changing code
`;

   files['.github/skills/memory-management.md'] = `# Skill: Project Memory & Context

## Core Files
1. **\`docs/product_requirements.md\`** — goals, user stories, constraints.
2. **\`docs/architecture.md\`** — system design, components, data flow.
3. **\`docs/technical.md\`** — dev environment, patterns, decisions.
4. **\`docs/active_context.md\`** — current focus, recent changes, next steps.
5. **\`docs/lessons_learned.md\`** — problem → solution → why it worked.
6. **\`docs/error_log.md\`** — error signature → root cause → fix → prevention.

## Workflow
Session start: read \`active_context.md\`. During work: update it. Session end: summarize progress. Major changes: update architecture/technical docs.

## Checklist
- [ ] All core files exist and are current
- [ ] Active context reflects current work
- [ ] Lessons learned capture reusable knowledge
`;

   files['.github/skills/workflow-enforcement.md'] = `# Skill: Structured Development Workflow

## Five Phases
1. **Requirements** — Clarify expected behavior, edge cases, acceptance criteria. Document in \`active_context.md\`.
2. **Search & Plan** — Explore existing patterns, consider multiple approaches, select optimal with reasoning.
3. **Validate** — Present plan for high-risk/ambiguous work. For routine tasks, state assumptions and proceed.
4. **Implement** — Build incrementally, test each increment (happy + edge + error), commit working code only.
5. **Optimize** — Review security/performance, update docs, capture lessons learned.

## Checklist
- [ ] Requirements clarified before coding
- [ ] Multiple approaches considered
- [ ] Plan validated for high-risk changes
- [ ] Each increment tested before moving on
- [ ] Documentation and lessons updated
`;

   files['.github/skills/meta-instructions.md'] = `# Skill: Writing AI Instructions

## Structure
1. **Header** — category, purpose (one sentence), when to apply.
2. **Rules** — imperative mood, specific and actionable, include rationale and anti-patterns.
3. **Examples** — correct + incorrect with explanation.
4. **Checklist** — binary yes/no verification items.

## Quality Rules
- No ambiguous terms. Technical terms defined.
- Covers happy path, edge cases, and common mistakes.
- Every rule is verifiable. Examples are copy-pasteable.
- Consistent with other project instructions.
`;

   files['.github/skills/ai-agent-behavior.md'] = `# Skill: AI Agent Behavior

## Clarification
Ask when ambiguity blocks a safe change: scope, behavior options, constraints, integration points.
If the task is low-risk and reversible, state assumptions briefly and proceed with the smallest safe change.

## Reasoning
Reason through a structured checklist internally and present concise conclusions:
1. Read relevant files, identify existing patterns.
2. List solutions, evaluate trade-offs, select best approach.
3. Verify assumptions align with project standards.
4. Implement incrementally — smallest working unit first.

## Principles
- **Read before write**: identify patterns, conventions, constraints.
- **Minimal changes**: only modify what's necessary, preserve style.
- **Test coverage**: happy path + edge cases + error conditions.
- Code is self-documenting; comments explain WHY only.

## Checklist
- [ ] Clarifying questions asked when needed
- [ ] Existing code patterns followed
- [ ] Changes are minimal and focused
- [ ] Tests cover all scenarios
`;

   files['.github/skills/accessibility.md'] = `# Skill: Web Accessibility (WCAG 2.1 AA)

## Semantic HTML
- Correct elements: \`<nav>\`, \`<main>\`, \`<section>\`, \`<button>\` (not \`<div onClick>\`).
- One \`<h1>\` per page; headings in order (no skipping).

## Forms & Images
- Every \`<input>\` has a visible \`<label>\` (or \`aria-label\`). Group with \`<fieldset>\` + \`<legend>\`.
- All \`<img>\` have \`alt\` text. Decorative: \`alt=""\`. Videos need captions.

## Keyboard & Focus
- All interactive elements reachable via Tab. Visible focus indicator.
- Escape closes modals. Focus trapping inside modals.

## Color & ARIA
- Contrast: **4.5:1** text (AA). Never color alone to convey info.
- First rule of ARIA: don't use ARIA if native HTML works.
- \`aria-live="polite"\` for dynamic updates. \`role="alert"\` for errors.

## Checklist
- [ ] All images have alt text; inputs have labels
- [ ] Color contrast ≥ 4.5:1; no color-only information
- [ ] All functionality keyboard-accessible with visible focus
- [ ] ARIA used correctly (or not at all if native HTML suffices)
`;

   // ── TypeScript / React / Node skills ─────────────────────────

   if (stacks.some((s) => ['ts', 'react', 'node', 'nestjs', 'nextjs'].includes(s))) {
      files['.github/skills/create-service.md'] = `# Skill: Create a TypeScript Service

## Pattern
\`\`\`typescript
export interface <Name>ServiceDeps { /* DB, logger, other services */ }

export class <Name>Service {
  constructor(private readonly deps: <Name>ServiceDeps) {}
  async <method>(input: <Input>): Promise<<Output>> { /* validate → execute → return */ }
}
\`\`\`

## Checklist
- [ ] All public methods have explicit return types
- [ ] Input validated at method entry
- [ ] Dependencies injected via constructor (no global imports)
- [ ] Write methods define transaction/idempotency boundaries
- [ ] External I/O bounded (timeouts); logs don't leak secrets
- [ ] Errors thrown as typed custom error classes
- [ ] Unit tests mock all injected dependencies
`;

      files['.github/skills/create-types.md'] = `# Skill: Design TypeScript Types

## Patterns
\`\`\`typescript
// Interfaces for object shapes
interface User { readonly id: string; email: string; createdAt: Date; }

// Discriminated unions for state
type State<T> = { status: 'idle' } | { status: 'loading' } | { status: 'success'; data: T } | { status: 'error'; error: string };

// Const objects over enums
const ROLE = { Admin: 'admin', User: 'user' } as const;
type Role = (typeof ROLE)[keyof typeof ROLE];
\`\`\`

## Checklist
- [ ] No \`any\` — use \`unknown\` + type guard
- [ ] Constrained generics: \`<T extends Base>\`
- [ ] \`readonly\` where mutation is unintended
- [ ] \`import type\` for type-only imports
`;
   }

   // ── React skills ──────────────────────────────────────────────

   if (stacks.some((s) => ['react', 'nextjs'].includes(s))) {
      files['.github/skills/create-component.md'] = `# Skill: Create a React Component

## Pattern
\`\`\`tsx
export interface <Name>Props { /* props */ }

export const <Name>: FC<<Name>Props> = ({ /* destructure */ }) => {
  // hooks → handlers (handle<Event>) → early returns (loading/error) → JSX
};
\`\`\`

## Checklist
- [ ] Props interface exported as \`<Name>Props\`
- [ ] No inline arrow functions in JSX — extract to named handlers
- [ ] \`useCallback\` for functions passed to child components
- [ ] Loading + error states handled explicitly
- [ ] Accessible: alt text, labels, aria attributes
- [ ] Large lists virtualized; expensive children memoized
`;

      files['.github/skills/create-hook.md'] = `# Skill: Create a Custom React Hook

## Pattern
\`\`\`typescript
export function use<Name>(options: Use<Name>Options): Use<Name>Return {
  const [state, setState] = useState(initial);
  useEffect(() => { /* effect */ return () => { /* cleanup */ }; }, [deps]);
  const handleAction = useCallback(() => { /* handler */ }, [deps]);
  return { state, handleAction };
}
\`\`\`

## Checklist
- [ ] Named \`use<Name>\` (camelCase, "use" prefix)
- [ ] Returns plain object (not array) unless mimicking useState
- [ ] All effect dependencies listed; cleanup for subscriptions/timers
- [ ] Unit tested with \`renderHook\`
`;

      files['.github/skills/create-page.md'] = `# Skill: Create a Next.js Page

## Pattern
\`\`\`tsx
export const metadata: Metadata = { title: '…', description: '…' };

export default async function <Name>Page({ params, searchParams }: PageProps) {
  // fetch data server-side → render
}
\`\`\`

## Checklist
- [ ] Metadata exported for SEO
- [ ] Data fetched in Server Component (not client-side useEffect)
- [ ] \`loading.tsx\` + \`error.tsx\` sibling files
- [ ] Route params typed via \`PageProps\`
- [ ] Heavy client components dynamically imported (\`next/dynamic\`)
`;

      files['.github/skills/create-form.md'] = `# Skill: Create a React Form

## Pattern (react-hook-form + zod)
\`\`\`tsx
const schema = z.object({ email: z.string().email(), password: z.string().min(8) });
type FormData = z.infer<typeof schema>;

export function <Name>Form() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  return <form onSubmit={handleSubmit(onSubmit)}>…</form>;
}
\`\`\`

## Checklist
- [ ] Schema defined with zod; type inferred with \`z.infer\`
- [ ] Each input has \`id\`, \`<label>\`, and error display
- [ ] \`isSubmitting\` disables submit button
- [ ] Accessible: labels associated, errors announced
`;

      files['.github/skills/create-error-boundary.md'] = `# Skill: Create an Error Boundary

## Pattern
\`\`\`tsx
export class ErrorBoundary extends Component<{ children: ReactNode; fallback?: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return this.props.fallback ?? <FallbackUI onReset={() => this.setState({ hasError: false })} />;
    return this.props.children;
  }
}
\`\`\`

## Checklist
- [ ] Class component (only way to catch render errors)
- [ ] \`getDerivedStateFromError\` updates state
- [ ] Fallback UI with reset/retry button
`;

      files['.github/skills/react-testing.md'] = `# Skill: Test React Components

## Patterns
\`\`\`tsx
// Component: render → query by role/label/text → assert
render(<<Name> />);
expect(screen.getByRole('button')).toBeInTheDocument();

// Interaction: userEvent (not fireEvent)
const user = userEvent.setup();
await user.click(screen.getByRole('button'));

// Hook: renderHook + act
const { result } = renderHook(() => useHook());
act(() => result.current.doAction());
\`\`\`

## Checklist
- [ ] Test happy path, loading, error, and empty states
- [ ] Use \`userEvent\` for interactions
- [ ] Query by role/label/text (not test-id when possible)
- [ ] Async operations wrapped in \`waitFor\`
`;

      files['.github/skills/react-performance.md'] = `# Skill: React Performance

## Key Patterns
- \`React.memo\` for components receiving same props frequently.
- \`useCallback\` for handlers passed to memoized children.
- \`useMemo\` for expensive computations in render.
- Virtualization (\`@tanstack/react-virtual\`) for lists > 100 items.
- Dynamic imports (\`next/dynamic\`) for heavy below-fold components.

## Checklist
- [ ] No anonymous functions in JSX props of memoized children
- [ ] Expensive computations memoized with measured need
- [ ] Large lists virtualized
- [ ] Heavy components code-split
`;
   }

   // ── Next.js skills ─────────────────────────────────────────────

   if (stacks.includes('nextjs')) {
      files['.github/skills/create-server-action.md'] = `# Skill: Next.js Server Action

## Pattern
\`\`\`tsx
'use server';
export async function <name>Action(formData: FormData) {
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: 'Invalid input', issues: parsed.error.issues };
  try { /* mutate */ } catch { return { error: 'Failed' }; }
  revalidatePath('/<path>');
  redirect('/<path>/success');
}
\`\`\`

## Checklist
- [ ] \`'use server'\` directive at file top
- [ ] Input validated with Zod; returns error object on failure (never throws to client)
- [ ] \`revalidatePath\`/\`revalidateTag\` after mutation
- [ ] Client uses \`useActionState\` or \`useFormStatus\` for pending state
`;

      files['.github/skills/create-layout.md'] = `# Skill: Next.js Layout

## Pattern
\`\`\`tsx
export const metadata: Metadata = { title: { template: '%s | App', default: 'App' } };

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-screen"><nav>…</nav><main>{children}</main></div>;
}
\`\`\`

## Checklist
- [ ] Root layout has \`<html>\` and \`<body>\`
- [ ] Metadata exported for SEO (title template for nested layouts)
- [ ] Route groups \`(group)\` for shared layouts without URL impact
- [ ] Shared UI (nav, sidebar) in layouts, not pages
`;

      files['.github/skills/create-loading-error.md'] = `# Skill: Loading & Error States

## Files
- **\`loading.tsx\`** — skeleton/pulse UI while data loads.
- **\`error.tsx\`** — \`'use client'\` component with \`reset()\` retry button.
- **\`not-found.tsx\`** — 404 UI; trigger with \`notFound()\` function.

## Checklist
- [ ] \`loading.tsx\` for every route with async data
- [ ] \`error.tsx\` is a Client Component with \`reset()\` retry
- [ ] \`not-found.tsx\` handles missing resources
`;

      files['.github/skills/nextjs-middleware.md'] = `# Skill: Next.js Middleware

## Pattern
\`\`\`ts
// middleware.ts (project root)
export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  if (isProtected(request.nextUrl.pathname) && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
}
export const config = { matcher: ['/dashboard/:path*', '/settings/:path*'] };
\`\`\`

## Checklist
- [ ] \`middleware.ts\` at project root (not in \`app/\`)
- [ ] \`matcher\` config limits which routes run middleware
- [ ] URL manipulation via \`new URL()\`
- [ ] Returns \`NextResponse.next()\` to continue
`;

      files['.github/skills/nextjs-data-fetching.md'] = `# Skill: Next.js Data Fetching

## Caching Strategies
| Strategy | Config | Use Case |
|----------|--------|----------|
| Static | \`cache: 'force-cache'\` | Rarely changes |
| ISR | \`next: { revalidate: 60 }\` | Periodic updates |
| Dynamic | \`cache: 'no-store'\` | Real-time/user-specific |
| On-demand | \`revalidatePath/Tag()\` | After mutations |

## Checklist
- [ ] Fetch in Server Components when possible
- [ ] Parallel fetch with \`Promise.all\` for independent data
- [ ] \`notFound()\` for 404; throw for other errors
- [ ] Client-side: useSWR or React Query for interactivity
- [ ] \`revalidatePath\`/\`revalidateTag\` after mutations
`;
   }

   // ── Node API skills ───────────────────────────────────────────

   if (stacks.includes('node')) {
      files['.github/skills/create-endpoint.md'] = `# Skill: Create a REST API Endpoint

## Pattern
\`\`\`typescript
router.post('/<resource>', async (req, res, next) => {
  try {
    const body = validateCreate(req.body); // use the existing project validation layer
    const result = await service.create(body);
    res.status(201).json(result);
  } catch (err) { next(err); }
});
\`\`\`

## Checklist
- [ ] Input validated with the existing project validation layer (ask before adding new libs)
- [ ] Correct HTTP status codes (201/200/400/404/409)
- [ ] Errors forwarded to \`next(err)\` — not swallowed
- [ ] Auth middleware applied where required
- [ ] List endpoints use pagination with bounded limits
- [ ] Mutating endpoints consider idempotency/retry safety
- [ ] Integration test for happy path + error cases
`;

      files['.github/skills/create-middleware.md'] = `# Skill: Create Express Middleware

## Pattern
\`\`\`typescript
export function <name>Middleware(req: Request, res: Response, next: NextFunction): void {
  try { /* logic */ next(); } catch (err) { next(err); }
}

// Error middleware (must have 4 params) — register LAST
export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction): void {
  const status = err instanceof AppError ? err.statusCode : 500;
  res.status(status).json({ error: { code: err.code ?? 'INTERNAL_ERROR', message: String(err) } });
}
\`\`\`

## Checklist
- [ ] Always call \`next()\` or \`next(err)\` — never leave request hanging
- [ ] No business logic — delegate to services
- [ ] Middleware is stateless (no shared mutable state)
`;
   }

   // ── Python skills ─────────────────────────────────────────────

   if (stacks.includes('python')) {
      files['.github/skills/create-module.md'] = `# Skill: Create a Python Module

## Pattern
\`\`\`python
"""<One-line summary.>"""
from __future__ import annotations
from typing import TYPE_CHECKING
if TYPE_CHECKING:
    pass  # type-only imports

def <function>(param: <Type>) -> <Return>:
    """Summary. Args/Returns/Raises in Google style."""
\`\`\`

## Checklist
- [ ] Module-level docstring; \`from __future__ import annotations\`
- [ ] All public functions have type hints + Google-style docstrings
- [ ] No mutable default arguments (\`def f(x=[]):\` is a bug)
- [ ] \`__all__\` defined to control public API
- [ ] Uses generators/yield for large sequences
- [ ] Corresponding \`test_<module>.py\` created
`;

      files['.github/skills/create-dataclass.md'] = `# Skill: Pydantic Model / Dataclass

## Patterns
\`\`\`python
# Pydantic — for external data (API, config)
class User(BaseModel):
    id: str = Field(..., description="Unique identifier")
    name: str = Field(..., min_length=1, max_length=100)
    model_config = {"frozen": True}

# Dataclass — for internal value objects
@dataclass(frozen=True)
class Point:
    x: float
    y: float
\`\`\`

## Checklist
- [ ] Pydantic for external data; \`@dataclass(frozen=True)\` for value objects
- [ ] No raw \`dict\` for structured data — always a model/dataclass
- [ ] Validators for non-trivial constraints
`;
   }

   // ── NestJS skills ──────────────────────────────────────────────

   if (stacks.includes('nestjs')) {
      files['.github/skills/create-nestjs-module.md'] = `# Skill: Create a NestJS Module

## Structure
\`\`\`
src/<feature>/
├── <feature>.module.ts
├── presentation/http/<feature>.controller.ts
├── application/
│   ├── <feature>.service.ts
│   └── dto/ (create, update, query, response)
├── domain/
│   ├── <feature>.model.ts
│   ├── ports/<feature>.repository.ts
│   └── errors/<feature>-not-found.error.ts
└── infrastructure/persistence/<feature>.repository.ts
\`\`\`

## Pattern
\`\`\`typescript
@Module({
  controllers: [<Feature>Controller],
  providers: [
    <Feature>Service,
    { provide: <Feature>RepositoryToken, useClass: <Feature>RepositoryAdapter },
  ],
  exports: [<Feature>Service],
})
export class <Feature>Module {}
\`\`\`

## Checklist
- [ ] Module registered in parent's \`imports\`
- [ ] Module owns one feature with clear presentation, application, domain, and infrastructure boundaries
- [ ] Controller handles HTTP only — no business logic or ORM access
- [ ] DTOs model contracts; do not reuse ORM entities as API contracts
- [ ] Adapters wired through DI tokens for I/O boundaries
- [ ] Mutating flows define transaction/idempotency boundaries
- [ ] Long-running work moved to jobs/events instead of blocking request/response paths
- [ ] Exports minimal — only the API other modules need
`;

      files['.github/skills/create-nestjs-service.md'] = `# Skill: Create a NestJS Service

## Pattern
\`\`\`typescript
@Injectable()
export class <Feature>Service {
  constructor(
    @Inject(<Feature>RepositoryToken)
    private readonly repository: <Feature>Repository,
  ) {}

  async create(input: Create<Feature>Dto): Promise<<Feature>ResponseDto> {
    const created = await this.repository.create(input);
    return this.toResponse(created);
  }

  async findOne(id: string): Promise<<Feature>ResponseDto> {
    const item = await this.repository.findById(id);
    if (!item) throw new <Feature>NotFoundError(id);
    return this.toResponse(item);
  }
}
\`\`\`

## Checklist
- [ ] No HTTP decorators or framework exceptions in services
- [ ] Inject repository/gateway ports instead of ORM clients directly
- [ ] Write flows define transaction and idempotency boundaries explicitly
- [ ] Downstream I/O bounded with timeouts/cancellation
- [ ] Domain errors thrown from application/domain, mapped at HTTP boundary
- [ ] Mapping to response contract is centralized
- [ ] Unit tests mock ports/gateways, not Nest internals
`;

      files['.github/skills/create-nestjs-controller.md'] = `# Skill: Create a NestJS Controller

## Pattern
\`\`\`typescript
@ApiTags('<feature>')
@Controller('<feature>')
export class <Feature>Controller {
  constructor(private readonly service: <Feature>Service) {}

  @Post()
  create(@Body() dto: Create<Feature>Dto): Promise<<Feature>ResponseDto> {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query() query: List<Feature>QueryDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: Update<Feature>Dto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) { return this.service.remove(id); }
}
\`\`\`

## Checklist
- [ ] Typed DTOs via \`@Body()\`, \`@Query()\`, \`@Param()\` — not raw \`req\`
- [ ] List endpoints accept query DTOs with bounded limits
- [ ] Swagger decorators on all routes
- [ ] \`ParseUUIDPipe\`/\`ParseIntPipe\` for ID params
- [ ] No business logic — delegate to service only
- [ ] Return response DTOs or paginated envelopes, not ORM entities
- [ ] Use \`@Patch()\` for partial updates; \`@Put()\` for full replacement
`;

      files['.github/skills/create-nestjs-dto.md'] = `# Skill: NestJS DTOs

## Patterns
\`\`\`typescript
// Create DTO — class-validator + Swagger
export class Create<Feature>Dto {
  @ApiProperty() @IsString() @IsNotEmpty() @MaxLength(100) readonly name!: string;
  @ApiProperty() @IsEmail() readonly email!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() readonly description?: string;
}

// Update DTO — reuse Create via mapped type
export class Update<Feature>Dto extends PartialType(Create<Feature>Dto) {}

// Query DTO — bounded pagination
export class List<Feature>QueryDto {
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) readonly page: number = 1;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) readonly limit: number = 20;
}

// Response DTO — expose only public fields
@Exclude()
export class <Feature>ResponseDto {
  @Expose() id!: string;
  @Expose() name!: string;
}
\`\`\`

## Checklist
- [ ] Separate create/update/query/response DTOs; never reuse ORM entities
- [ ] All inbound fields have \`class-validator\` decorators
- [ ] Update DTO extends \`PartialType(CreateDto)\`
- [ ] Query DTOs bound pagination limits and coerce types safely
- [ ] Response DTOs expose only public fields
- [ ] No raw \`any\` types
`;

      files['.github/skills/create-nestjs-guard.md'] = `# Skill: NestJS Guard

## Pattern
\`\`\`typescript
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(), context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<{ headers: { authorization?: string } }>();
    const token = this.extractBearerToken(request);
    if (!token) throw new UnauthorizedException('Missing auth token');
    // validate token, attach user
    return true;
  }

  private extractBearerToken(req: { headers: { authorization?: string } }): string | null {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : null;
  }
}

// Public decorator: @Public() skips auth
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
\`\`\`

## Checklist
- [ ] Implements \`CanActivate\`; uses \`Reflector\` for metadata
- [ ] Throws \`UnauthorizedException\` with clear message
- [ ] Handles missing/malformed headers gracefully
- [ ] \`@Public()\` decorator for unauthenticated routes
`;
   }

   // ── Unity skills ──────────────────────────────────────────────

   if (stacks.includes('unity')) {
      files['.github/skills/create-monobehaviour.md'] = `# Skill: Create a MonoBehaviour

## Pattern
\`\`\`csharp
[RequireComponent(typeof(Rigidbody))]
public sealed class <Name> : MonoBehaviour
{
    [Header("Config")]
    [SerializeField, Tooltip("Description.")] private float _speed = 5f;

    [Header("Events")]
    public UnityEvent onActionComplete;

    private Rigidbody _rb;

    private void Awake() { _rb = GetComponent<Rigidbody>(); }  // cache here, never in Update
    private void OnEnable() { /* subscribe events */ }
    private void OnDisable() { /* unsubscribe events */ StopAllCoroutines(); }
    private void Update() { /* thin: read input, trigger state changes */ }
    private void FixedUpdate() { /* physics only */ }
}
\`\`\`

## Checklist
- [ ] All \`GetComponent\` cached in \`Awake\`; no \`FindObjectOfType\`/\`Camera.main\` in Update
- [ ] Events unsubscribed + coroutines stopped in \`OnDisable\`
- [ ] \`[Header]\`, \`[Tooltip]\` on serialized fields; \`[RequireComponent]\` for hard deps
- [ ] Class is \`sealed\` unless inheritance needed
- [ ] Zero allocations in \`Update\`/\`FixedUpdate\`
`;

      files['.github/skills/create-scriptableobject.md'] = `# Skill: Create a ScriptableObject

## Pattern
\`\`\`csharp
[CreateAssetMenu(menuName = "Game/<Category>/<Name>", fileName = "New<Name>")]
public sealed class <Name>SO : ScriptableObject
{
    [SerializeField, Tooltip("Description.")] private float _value = 1f;
    public float Value => _value;
}
\`\`\`

## When to Use
Config/tuning values · shared runtime data · events · item/ability definitions as templates.

## Checklist
- [ ] \`[CreateAssetMenu]\` with descriptive menu path
- [ ] Fields: private serialized + property getter
- [ ] No MonoBehaviour lifecycle in ScriptableObjects
- [ ] Placed in \`Assets/Data/<Category>/\`
`;

      files['.github/skills/unity-architecture.md'] = `# Skill: Unity Architecture

## Layers
| Layer | Responsibility | Example |
|-------|---------------|---------|
| Data | Config, definitions | ScriptableObject |
| State | Runtime values | StateManager, SO container |
| Logic | Pure C# (no UnityEngine) | Calculator, Pathfinder |
| Presentation | MonoBehaviour + View | PlayerView, UIHealthBar |
| Glue | Wires data → logic → view | PlayerController |

## Communication
- **C# events** (\`event Action<T>\`) or **UnityEvents** for decoupling.
- Avoid direct \`GetComponent\` across unrelated GameObjects.

## Object Pooling
Use \`UnityEngine.Pool.ObjectPool<T>\` — configure \`createFunc\`, \`actionOnGet\` (activate), \`actionOnRelease\` (deactivate).

## Checklist
- [ ] No direct component refs across unrelated objects
- [ ] Object pooling for bullets, particles, enemies
- [ ] ScriptableObject for designer-tunable values
- [ ] Pure C# classes for testable game logic
`;
   }

   return files;
}
