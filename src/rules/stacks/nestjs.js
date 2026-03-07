const NESTJS_RULES = {
   minimal: `## NestJS
- Keep modules feature-oriented; controllers thin, services testable.
- Validate DTOs at the boundary. Never trust raw request payloads.
`,
   standard: `## NestJS
- One module per feature domain. Controllers handle HTTP only; logic lives in services.
- Validate all DTOs with \`ValidationPipe\` + class-validator or Zod — never in controller bodies.
- Use custom exception filters to map domain errors to consistent HTTP responses.
- Inject dependencies via constructor; avoid \`ModuleRef.get()\` for regular service wiring.
- Use \`@UseGuards\` / \`@UseInterceptors\` at controller or global scope — not inline in methods.
- Organize by feature modules with colocated controller, service, DTOs, and entities per domain.
`,
   strict: `## NestJS
- MUST enforce module/controller/service layer separation — no business logic in controllers.
  \`\`\`ts
  // ✓ @Get(':id') async getUser(@Param('id') id: string) { return this.userService.findById(id); }
  // ✗ @Get(':id') async getUser(@Param('id') id: string) { return this.repo.findOne({ where: { id } }); }
  \`\`\`
- MUST validate DTOs via \`ValidationPipe\` (global) or per-route. Never trust raw \`@Body()\`.
  \`\`\`ts
  // ✓ app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  // ✗ class CreateUserDto { name: string }  // no @IsString(), no validation
  \`\`\`
- MUST map domain errors through a global \`ExceptionFilter\` — never \`throw new HttpException\` deep in services.
  \`\`\`ts
  // ✓ throw new UserNotFoundError(id);  // caught by DomainExceptionFilter → 404
  // ✗ throw new NotFoundException(\`User \${id} not found\`);  // couples service to HTTP
  \`\`\`
- MUST follow feature-module folder structure:
  \`\`\`
  src/
  ├── main.ts
  ├── app.module.ts
  ├── common/                  # Shared cross-cutting concerns
  │   ├── decorators/
  │   ├── filters/             # Global exception filters
  │   ├── guards/              # Auth, role guards
  │   ├── interceptors/        # Logging, transform interceptors
  │   └── pipes/               # Custom validation pipes
  ├── config/                  # Configuration module & env validation
  │   └── config.module.ts
  ├── modules/
  │   └── <feature>/           # One module per domain
  │       ├── dto/             # Request/response DTOs
  │       ├── entities/        # TypeORM/Prisma entities
  │       ├── <feature>.controller.ts
  │       ├── <feature>.service.ts
  │       ├── <feature>.module.ts
  │       ├── <feature>.repository.ts
  │       └── <feature>.controller.spec.ts
  └── shared/                  # Shared services, utilities, constants
  \`\`\`
- SHOULD scope providers to the correct lifecycle (\`REQUEST\` for per-request state, default singleton for stateless services).
- SHOULD use interceptors for cross-cutting concerns (logging, response transforms) — not ad-hoc in services.
`,
};

export function nestjsRules(verbosity = 'standard') {
   return NESTJS_RULES[verbosity] ?? NESTJS_RULES.standard;
}
