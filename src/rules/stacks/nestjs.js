const NESTJS_RULES = {
   minimal: `## NestJS
- Keep modules feature-oriented and validate DTOs.
`,
   standard: `## NestJS
- Keep modules/controllers/services feature-scoped.
- Validate DTOs with pipes and class-validator/zod as project already uses.
- Keep business logic in services, not controllers.
`,
   strict: `## NestJS
- MUST keep feature boundaries clear across module/controller/service layers.
- MUST validate DTO input and map domain errors predictably.
- SHOULD keep controllers thin and services testable.
`,
};

export function nestjsRules(verbosity = 'standard') {
   return NESTJS_RULES[verbosity] ?? NESTJS_RULES.standard;
}
