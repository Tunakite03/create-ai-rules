// ================================================================
//  TEMPLATES - Comprehensive AI Rules
// ================================================================

const VALID_STACKS = new Set(['ts', 'react', 'node', 'nestjs', 'python', 'unity', 'go', 'flutter']);

// ── Stack-specific rule sections ──────────────────────────────

const commonRules = `# AI Coding Rules

## Identity & Behavior
- You are an expert software engineer embedded in this project.
- Read existing code BEFORE writing new code. Match patterns already in use.
- Think step-by-step. Plan before you code.
- When uncertain, ask for clarification instead of guessing.

## Core Workflow
1. **Understand** - Read related files, understand the context.
2. **Plan** - Outline your approach in 2-3 sentences.
3. **Implement** - Write minimal, correct code.
4. **Verify** - Check for errors, edge cases, and regressions.
5. **Document** - Explain what changed and why.

## Non-negotiables
- Do NOT use \`any\` (or equivalent loose types) unless explicitly requested.
- Do NOT add new dependencies unless asked. Use what is already installed.
- Do NOT change public APIs, function signatures, or database schemas unless asked.
- Do NOT remove existing code comments, tests, or functionality without reason.
- Do NOT invent new architectural patterns - follow what the codebase already uses.
- Follow existing code style, formatting, and naming conventions exactly.

## Code Quality
- **Small functions** (< 40 lines). Extract helpers aggressively.
- **Explicit naming** over abbreviations. \`getUserById\` not \`getUsr\`.
- **Early returns** to reduce nesting. Max 2-3 levels of indentation.
- **Pure functions** when possible. Minimize mutation and side effects.
- **Single responsibility** - each function/module does one thing well.
- **DRY but not at the cost of clarity** - duplication is better than wrong abstraction.
- Comments explain **why**, never **what**. Code should be self-documenting.

## Error Handling
- Never swallow errors silently. Always handle or re-throw with context.
- Use typed/structured errors, not raw strings.
- Validate inputs at system boundaries (API endpoints, CLI args, file I/O).
- Provide actionable error messages: what went wrong + how to fix it.
- Handle \`null\`/\`undefined\`/empty states explicitly - never assume data exists.

## Security
- NEVER log secrets, tokens, passwords, API keys, or PII.
- NEVER hardcode credentials. Use environment variables.
- Sanitize user inputs before database queries or shell commands.
- Use parameterized queries, never string concatenation for SQL.
- Validate and sanitize file paths to prevent path traversal.
- Set appropriate CORS, CSP, and security headers.

## Performance
- Do NOT prematurely optimize. Correctness first.
- Avoid N+1 queries - batch database operations.
- Use pagination for list endpoints.
- Memoize expensive computations only when measured to be slow.
- Prefer streaming over loading entire datasets into memory.

## Git & Diffs
- Minimal diffs - change ONLY what is needed for the task.
- Do not reformat or restructure files unrelated to the task.
- Each change should be a single logical unit.
- Commit messages: \`type(scope): description\` (conventional commits).

## Output Format
When implementing changes, always provide:
1. **Plan** - brief explanation of approach (2-3 sentences)
2. **Changes** - the actual code changes with file paths
3. **Tests** - new or updated tests covering the change
4. **Edge cases** - what could break, boundary conditions considered
`;

const tsRules = `
## TypeScript
- Enable and respect \`strict: true\`. Never weaken tsconfig.
- Prefer \`unknown\` + type-guards over \`any\`. Use \`any\` only as last resort.
- Avoid type assertions (\`as\`). When unavoidable, add a comment explaining why.
- Use \`satisfies\` for config objects to get type checking + inference.
- Use discriminated unions for state modeling (\`type State = { status: "loading" } | { status: "success"; data: T }\`).
- Prefer \`interface\` for object shapes, \`type\` for unions/intersections/utilities.
- Use \`readonly\` for data that should not be mutated.
- Prefer \`const\` assertions for literal types: \`as const\`.
- Generic constraints: \`<T extends Base>\` not unconstrained \`<T>\`.
- Avoid \`enum\` - prefer const objects with \`as const\` + derived union type.
- Use \`Map\`/\`Set\` instead of plain objects when keys are dynamic.
- Handle promise rejections. Never use unhandled \`.then()\` without \`.catch()\`.
- Prefer \`import type\` for type-only imports to reduce bundle size.
- Use barrel exports (\`index.ts\`) sparingly - they can cause circular deps.
`;

const reactRules = `
## React
- Functional components + hooks only. No class components.
- Keep components presentational. Data fetching belongs in hooks or services.
- Custom hooks for reusable logic: \`use<Name>\` convention.
- Component file structure: types -> component -> styles -> exports.
- Props interface named \`<Component>Props\`. Export it.
- Avoid inline function definitions in JSX - extract to named handlers.
- Use \`useCallback\` for functions passed to child components.
- Use \`useMemo\` only for expensive computations (not for primitives).
- State management: local state first -> context -> external store.
- Never mutate state directly. Use functional updates: \`setState(prev => ...)\`.
- Key prop: use stable unique IDs, never array index (unless static list).
- Accessibility (a11y):
  - All \`<img>\` must have \`alt\` text.
  - All form inputs must have associated \`<label>\`.
  - Buttons must have accessible text (visible or \`aria-label\`).
  - Use semantic HTML: \`<nav>\`, \`<main>\`, \`<section>\`, \`<article>\`.
  - Support keyboard navigation (\`tabIndex\`, \`onKeyDown\`).
  - Color contrast must meet WCAG AA (4.5:1 for text).
- Styling: follow the existing pattern (Tailwind / CSS Modules / styled-components).
- Error boundaries for graceful failure in component trees.
- Lazy loading: \`React.lazy()\` + \`Suspense\` for route-level code splitting.
- Forms: use controlled components. Validate on blur + submit.
- Avoid prop drilling > 2 levels. Use context or composition instead.
- Performance:
  - Memoize expensive child components (\`React.memo\`) when parent re-renders frequently.
  - Use virtualization (\`react-window\` / \`react-virtuoso\`) for long lists to prevent DOM bloat.
  - Avoid creating anonymous objects/functions in render for props passed to memoized children.
  - Keep React Context flat. Deep context causes widespread re-renders. Use Zustand/Jotai for atomic state.
  - Use \`useTransition\` or \`useDeferredValue\` for non-blocking state updates (e.g., search filtering).
- Follow docs/ui-style-guide.md strictly.
- Do not hardcode colors; use semantic Tailwind tokens.
- Use rounded-lg as default radius.
- Ensure light/dark both look correct.
`;

const nodeApiRules = `
## Node / API
- Use async/await everywhere. No callbacks, no raw \`.then()\` chains.
- Validate ALL request inputs at the boundary using a schema library (Zod, Joi, etc.).
- Consistent error response format: \`{ error: { code: "INVALID_INPUT", message: "..." } }\`.
- Error codes as constants: \`INVALID_INPUT\`, \`NOT_FOUND\`, \`UNAUTHORIZED\`, \`FORBIDDEN\`, \`CONFLICT\`, \`INTERNAL_ERROR\`.
- HTTP status codes: use correct ones (400, 401, 403, 404, 409, 422, 500).
- Middleware pattern: auth -> validation -> handler -> error handler.
- Database:
  - Use transactions for multi-step mutations.
  - Parameterized queries only. Never concatenate user input into SQL.
  - Add indexes for frequently queried columns.
  - Use migrations for schema changes, never manual DDL.
- Logging:
  - Structured JSON logs with correlation IDs.
  - Log levels: error (failures), warn (degraded), info (key events), debug (dev).
  - NEVER log request bodies containing passwords, tokens, or PII.
- Rate limiting on public endpoints.
- Graceful shutdown: handle SIGTERM, drain connections, close DB pools.
- Health check endpoint: \`GET /health\` returning \`{ status: "ok" }\`.
- Pagination: cursor-based preferred, offset-based acceptable.
- Idempotency: POST/PUT endpoints should be safely retryable.
- Performance:
  - Offload heavy CPU tasks (e.g., image processing) to Worker Threads or a background queue (BullMQ).
  - Use Streams (\`stream.pipeline\`) instead of buffering large files in memory.
  - Run independent async operations concurrently using \`Promise.all()\`.
  - Avoid synchronous blocking operations (\`readFileSync\`, \`JSON.parse\` on huge payloads).
  - Configure database connection pooling with max/min pool sizes tuned to your infrastructure.
`;

const pythonRules = `
## Python
- Type hints on ALL public functions. Use \`from __future__ import annotations\`.
- Follow PEP 8 strictly (line length, naming, spacing).
- Use \`dataclasses\` or \`Pydantic\` for structured data, not raw dicts.
- Prefer list/dict/set comprehensions over \`map()\`/\`filter()\` when clearer.
- Use \`pathlib.Path\` instead of \`os.path\` for file operations.
- Context managers (\`with\`) for all resource handling (files, connections, locks).
- Use \`logging\` module, not \`print()\` for production code.
- Virtual environments: never install globally.
- Exception handling:
  - Catch specific exceptions, never bare \`except:\`.
  - Custom exception classes for domain errors.
  - Always include context in error messages.
- Async (\`asyncio\`):
  - Use \`async/await\` for I/O-bound operations.
  - Never mix sync and async without proper bridging.
  - Use \`asyncio.gather()\` for concurrent operations.
- Testing:
  - \`pytest\` as the test runner.
  - Fixtures for setup/teardown.
  - \`@pytest.mark.parametrize\` for data-driven tests.
  - Mock external services, not internal logic.
- f-strings for string formatting (not \`.format()\` or \`%\`).
- Use \`Enum\` for fixed sets of values.
- Docstrings: Google style or NumPy style, be consistent.
- Performance:
  - Use generators/yield instead of returning massive lists to save memory.
  - Use \`orjson\` or \`ujson\` instead of the standard \`json\` module for high-throughput APIs.
  - Profile before optimizing using \`cProfile\` or \`line_profiler\`.
  - Use vectorized operations (\`numpy\`, \`pandas\`) instead of native Python loops for large datasets.
  - Avoid excessive string concatenation in loops (\`str += msg\`); use \`''.join(list)\` instead.
`;

const unityRules = `
## Unity / C#
- Naming:
  - Methods, Properties, Classes: \`PascalCase\`.
  - Private fields: \`_camelCase\`. Serialized private fields: \`[SerializeField] private Type _fieldName\`.
  - Constants: \`UPPER_SNAKE_CASE\`.
- MonoBehaviour lifecycle order: \`Awake\` → \`OnEnable\` → \`Start\` → \`FixedUpdate\` → \`Update\` → \`LateUpdate\` → \`OnDisable\` → \`OnDestroy\`.
  - Init dependencies in \`Awake\`, subscribe events in \`OnEnable\`, unsubscribe in \`OnDisable\`.
  - Never call heavy logic in \`Update\` that can be event-driven.
- Performance:
  - Cache every \`GetComponent<T>()\` call in \`Awake\`/\`Start\` — never in \`Update\`.
  - Never call \`FindObjectOfType\`, \`GameObject.Find\`, or \`Camera.main\` in \`Update\`.
  - Use **object pooling** for frequently spawned/destroyed objects (\`IObjectPool\`).
  - Avoid LINQ in hot paths (allocates garbage). Use for-loops instead.
  - Minimize allocations inside \`Update\` — no \`new\`, no string concatenation, use \`StringBuilder\`.
  - Use \`WaitForSeconds\` cached instance in coroutines (not \`new WaitForSeconds()\` every frame).
  - Prefer \`ScriptableObjects\` over parsing raw JSON/XML at runtime.
  - Use \`Addressables\` to manage memory footprint dynamically instead of loading everything via \`Resources\`.
  - Use value types (\`struct\`) and \`[StructLayout]\` for hot-path data to minimize Garbage Collection stalls.
- Physics:
  - All physics/Rigidbody movement must happen in \`FixedUpdate\`.
  - Use layers and \`LayerMask\` for collision filtering — never string-based layer lookup.
  - Prefer \`Rigidbody.MovePosition\` / \`MoveRotation\` over modifying \`transform\` directly on physics objects.
- Coroutines vs async:
  - Prefer coroutines for simple timed sequences.
  - Use \`async/await\` with \`UniTask\` (if available) for complex async flows.
  - Always stop coroutines in \`OnDisable\` / \`OnDestroy\`.
- Architecture:
  - Use \`ScriptableObject\` for shared data and configuration.
  - Prefer composition over inheritance. Avoid deep MonoBehaviour hierarchies.
  - Use events / UnityEvent / delegates to decouple components — avoid direct GetComponent calls across unrelated objects.
  - Use \`[RequireComponent(typeof(T))]\` to enforce hard dependencies.
- Scenes & Prefabs:
  - Keep prefabs self-contained. Avoid prefabs that depend on scene-specific objects.
  - Use \`Addressables\` or \`Resources.Load\` for dynamic asset loading — not hard references.
- Editor:
  - Use \`[Header]\`, \`[Tooltip]\`, \`[Space]\` for Inspector clarity.
  - Never use \`#if UNITY_EDITOR\` blocks inside runtime logic — put editor code in \`Editor/\` folders.
  - Custom editors and property drawers go in \`Assets/Editor/\`.
`;

const nestjsRules = `
## NestJS
- Architecture:
  - Follow modular architecture. Every feature = its own module.
  - Module file structure: \`<feature>.module.ts\`, \`<feature>.controller.ts\`, \`<feature>.service.ts\`, \`<feature>.dto.ts\`, \`<feature>.entity.ts\`.
  - Keep modules self-contained. Import/export only what is necessary.
  - Use \`@Global()\` sparingly — only for truly app-wide modules (config, logging).
- Controllers:
  - Controllers handle HTTP only. No business logic — delegate to services.
  - Use proper HTTP method decorators: \`@Get()\`, \`@Post()\`, \`@Put()\`, \`@Patch()\`, \`@Delete()\`.
  - Use \`@Param()\`, \`@Query()\`, \`@Body()\` to extract request data — never access \`req\` directly.
  - Always validate request bodies with DTOs + \`ValidationPipe\`.
  - Return proper HTTP status codes: \`@HttpCode(HttpStatus.NO_CONTENT)\` for 204, etc.
  - Use \`@ApiTags()\`, \`@ApiOperation()\`, \`@ApiResponse()\` for Swagger docs.
- Services & Dependency Injection:
  - All business logic lives in \`@Injectable()\` services.
  - Inject dependencies via constructor. Never use \`ModuleRef\` unless absolutely necessary.
  - Prefer constructor injection over property injection.
  - Use custom providers (\`useFactory\`, \`useValue\`, \`useClass\`) for complex initialization.
  - Scope: default singleton. Use \`Scope.REQUEST\` only when truly needed (it hurts performance).
- DTOs & Validation:
  - One DTO per operation: \`CreateUserDto\`, \`UpdateUserDto\`, \`UserResponseDto\`.
  - Use \`class-validator\` decorators: \`@IsString()\`, \`@IsEmail()\`, \`@IsNotEmpty()\`, \`@MinLength()\`, etc.
  - Use \`class-transformer\`: \`@Exclude()\`, \`@Expose()\`, \`@Transform()\` for response shaping.
  - Use \`PartialType()\`, \`PickType()\`, \`OmitType()\`, \`IntersectionType()\` from \`@nestjs/mapped-types\`.
  - Enable global \`ValidationPipe\` with \`whitelist: true\` and \`forbidNonWhitelisted: true\`.
- Guards, Pipes, Interceptors, Filters:
  - \`Guards\` for authorization (\`@UseGuards(AuthGuard)\`).
  - \`Pipes\` for input transformation/validation (\`@UsePipes(ValidationPipe)\`).
  - \`Interceptors\` for cross-cutting concerns (logging, caching, response mapping).
  - \`Exception Filters\` for consistent error responses (\`@Catch()\`).
  - Execution order: Middleware → Guards → Interceptors (before) → Pipes → Handler → Interceptors (after) → Filters (on error).
- Database:
  - Use TypeORM or Prisma. Follow the repository pattern.
  - Entities in \`<feature>.entity.ts\`. Use \`@Entity()\`, \`@Column()\`, \`@PrimaryGeneratedColumn()\`.
  - Use migrations for all schema changes. Never \`synchronize: true\` in production.
  - Use transactions (\`QueryRunner\` or \`@Transaction()\`) for multi-step mutations.
  - Use query builders for complex queries. Avoid raw SQL unless performance-critical.
- Config & Environment:
  - Use \`@nestjs/config\` with \`ConfigModule.forRoot()\`.
  - Validate env vars with \`Joi\` or \`Zod\` schema in \`validationSchema\`.
  - Inject config via \`ConfigService\` — never use \`process.env\` directly.
  - Use namespaced configs (\`registerAs()\`) for complex configuration.
- Testing:
  - Use \`@nestjs/testing\` \`Test.createTestingModule()\` for unit tests.
  - Mock providers with \`{ provide: Service, useValue: mockService }\`.
  - Use \`supertest\` for e2e tests against the running app.
  - Test guards, pipes and interceptors in isolation.
  - Test file naming: \`<name>.spec.ts\` (unit), \`<name>.e2e-spec.ts\` (e2e).
- Performance:
  - Consider using \`FastifyAdapter\` instead of \`ExpressAdapter\` for high-throughput APIs.
  - Avoid using \`class-transformer\` (\`new ValidationPipe({ transform: true })\`) on hot paths as it is slow. Use manual mapping if performance is critical.
  - Map database entities to plain objects or use query builder \`.getRawMany()\` for large datasets instead of instantiating full Entity class instances.
  - Use caching (\`CacheModule\`) for frequently accessed, rarely changing data.
  - Offload heavy tasks (email, image processing) to queues (BullMQ/RabbitMQ) instead of blocking the main thread.
- Naming Conventions:
  - Files: \`kebab-case\` — \`user-profile.controller.ts\`, \`create-user.dto.ts\`.
  - Classes: \`PascalCase\` — \`UserProfileController\`, \`CreateUserDto\`.
  - Suffixes: \`.module\`, \`.controller\`, \`.service\`, \`.dto\`, \`.entity\`, \`.guard\`, \`.pipe\`, \`.interceptor\`, \`.filter\`, \`.decorator\`.
`;

const golangRules = `
## Go
- Follow [Effective Go](https://go.dev/doc/effective_go) and the Go Code Review Comments.
- Use \`gofmt\` / \`goimports\` for formatting. No debates on style.
- Naming:
  - Short, concise names. \`r\` not \`reader\` in small scopes.
  - Exported names: \`PascalCase\`. Unexported: \`camelCase\`.
  - Interfaces: single-method = \`-er\` suffix (\`Reader\`, \`Writer\`, \`Closer\`).
  - Packages: short, lowercase, no underscores. \`http\`, \`json\`, \`auth\`.
  - Avoid package-level stutter: \`http.Server\` not \`http.HTTPServer\`.
- Error handling:
  - Check errors immediately: \`if err != nil { return fmt.Errorf("...: %w", err) }\`.
  - Wrap errors with \`fmt.Errorf("context: %w", err)\` for stack context.
  - Use \`errors.Is()\` and \`errors.As()\` for checking, not type assertions.
  - Custom errors: implement \`Error() string\` interface.
  - Never silently ignore errors: \`_ = doSomething()\` is a code smell.
- Functions:
  - Accept interfaces, return structs.
  - First param \`ctx context.Context\` when function does I/O or is cancellable.
  - Last return value is \`error\` (by convention).
  - Prefer returning early to reduce nesting.
- Concurrency:
  - Don't communicate by sharing memory; share memory by communicating (channels).
  - Always use \`sync.WaitGroup\` or \`errgroup.Group\` to wait for goroutines.
  - Never start a goroutine without a way to stop it (context cancellation).
  - Protect shared state with \`sync.Mutex\` — keep critical sections small.
  - Use \`context.Context\` for cancellation and timeouts on all I/O operations.
- Patterns:
  - Use \`defer\` for cleanup (close files, unlock mutexes, flush buffers).
  - Use table-driven tests with \`t.Run()\` subtests.
  - Use \`struct embedding\` for composition, not inheritance.
  - Prefer \`io.Reader\` / \`io.Writer\` interfaces for flexible I/O.
- Performance:
  - Pre-allocate slices with \`make([]T, 0, capacity)\` when size is known.
  - Use \`strings.Builder\` for string concatenation in loops.
  - Profile with \`pprof\` before optimizing. Measure, don't guess.
  - Use \`sync.Pool\` for frequently allocated/freed objects in hot paths.
  - Avoid \`reflect\` in performance-critical code.
- Testing:
  - Tests in same package: \`foo_test.go\` for white-box, \`foo_test\` package for black-box.
  - Use \`testify/assert\` or stdlib for assertions.
  - Use \`httptest.NewServer\` for HTTP handler testing.
  - Use \`t.Cleanup()\` for test teardown, not \`defer\` in test body.
`;

const flutterRules = `
## Flutter / Dart
- Use Dart 3+ with null safety. Never use \`!\` (null assertion) unless provably safe.
- Naming:
  - Classes, enums, typedefs, extensions: \`PascalCase\`.
  - Variables, functions, parameters: \`camelCase\`.
  - Libraries, packages, directories, source files: \`snake_case\`.
  - Constants: \`camelCase\` (not UPPER_SNAKE — Dart convention).
  - Private members: \`_camelCase\` prefix.
- Widgets:
  - Keep widgets small and focused. Extract sub-widgets aggressively.
  - Use \`const\` constructors wherever possible for performance.
  - Prefer \`StatelessWidget\` over \`StatefulWidget\` when no mutable state is needed.
  - Never put business logic in widgets — delegate to controllers/notifiers/blocs.
  - Use \`Key\` for widgets in lists or when Flutter needs to differentiate instances.
- State Management:
  - Choose one and be consistent: Riverpod (recommended), Bloc/Cubit, Provider.
  - Keep state immutable — use \`copyWith()\` patterns or \`freezed\` package.
  - Avoid global mutable singletons. Use DI or provider-based injection.
  - Dispose controllers/streams in \`dispose()\` — never leak subscriptions.
  - Use \`AsyncValue\` / \`AsyncNotifier\` for async state (loading, error, data).
- Architecture:
  - Separate layers: Presentation (widgets) → Application (controllers) → Domain (entities) → Data (repositories).
  - Repository pattern for data access. Widgets never call APIs directly.
  - Use \`freezed\` or sealed classes for discriminated union states.
  - Navigation: use \`go_router\` or framework router with typed routes.
- Performance:
  - Use \`const\` constructors to prevent unnecessary rebuilds.
  - Use \`ListView.builder\` / \`GridView.builder\` for long lists (never \`ListView(children: [...])\` with 100+ items).
  - Avoid \`setState()\` on entire screen — scope rebuilds to the smallest widget.
  - Use \`RepaintBoundary\` for complex animations or frequently changing UI regions.
  - Minimize widget tree depth. Deep trees slow layout and painting.
  - Profile with Flutter DevTools. Check for jank in the timeline view.
- Async:
  - Use \`async/await\` everywhere. No raw \`.then()\` chains.
  - Handle errors: \`try/catch\` or \`AsyncValue\` — never let futures fail silently.
  - Cancel streams and timers when the widget is disposed.
- Testing:
  - Unit tests for business logic (controllers, services, repositories).
  - Widget tests for UI components (\`WidgetTester\`, \`find.byType\`, \`pump\`).
  - Integration tests for critical user journeys.
  - Mock dependencies with \`mocktail\` or \`mockito\`.
- Platform:
  - Use \`Platform.isAndroid\` / \`Platform.isIOS\` sparingly — prefer adaptive widgets.
  - Responsive layouts: \`LayoutBuilder\`, \`MediaQuery\`, or \`responsive_framework\`.
  - Handle platform channels safely — always handle \`MissingPluginException\`.
`;

const TS_STACKS = new Set(['ts', 'react', 'node', 'nestjs']);

// Extra rules per stack, beyond commonRules and tsRules
const STACK_EXTRA_RULES = {
   ts: '',
   react: reactRules,
   node: nodeApiRules,
   nestjs: nestjsRules,
   python: pythonRules,
   unity: unityRules,
   go: golangRules,
   flutter: flutterRules,
};

export function baseRules({ stacks }) {
   const valid = (stacks ?? ['ts']).filter((s) => VALID_STACKS.has(s));
   if (valid.length === 0) {
      console.warn(`Warning: No valid stacks provided, falling back to "ts".`);
      valid.push('ts');
   }

   let result = commonRules;

   if (valid.some((s) => TS_STACKS.has(s))) {
      result += tsRules;
   }

   const seen = new Set();
   for (const s of valid) {
      if (seen.has(s)) continue;
      seen.add(s);
      result += STACK_EXTRA_RULES[s] ?? '';
   }

   return result;
}
