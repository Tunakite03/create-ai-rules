// ================================================================
//  TEMPLATES - Comprehensive AI Rules
// ================================================================

export function baseRules({ stack }) {
   const common = `# AI Coding Rules

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

   const ts = `
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

   const react = `
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
- Follow docs/ui-style-guide.md strictly.
- Do not hardcode colors; use semantic Tailwind tokens.
- Use rounded-lg as default radius.
- Ensure light/dark both look correct.
`;

   const nodeApi = `
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
`;

   const python = `
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
`;

   const unity = `
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
  - Use **object pooling** for frequently spawned/destroyed objects.
  - Avoid LINQ in hot paths (allocates garbage). Use for-loops instead.
  - Minimize allocations inside \`Update\` — no \`new\`, no string concatenation.
  - Use \`WaitForSeconds\` cached instance in coroutines (not \`new WaitForSeconds()\` every frame).
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

   const nestjs = `
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

   const stackMap = {
      ts: common + ts,
      react: common + ts + react,
      node: common + ts + nodeApi,
      nestjs: common + ts + nestjs,
      python: common + python,
      unity: common + unity,
   };

   return stackMap[stack] || common + ts;
}
