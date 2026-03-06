const ARCHITECTURE_BY_VERBOSITY = {
   minimal: `## Architecture
- Keep module boundaries clear and avoid mixing transport, domain, and persistence concerns.
- Prefer small composable units over speculative abstractions.
`,
   standard: `## Architecture
- Keep modules feature-oriented with clear boundaries between transport, domain logic, and persistence.
- Prefer composition and explicit contracts at boundaries; avoid cross-layer leakage.
- Preserve backward compatibility for public APIs, events, and schemas unless explicitly asked to break them.
- Make state ownership, side effects, and data flow explicit before introducing abstractions.
`,
   strict: `## Architecture
- MUST keep transport, domain, and persistence responsibilities separated; boundary layers stay thin.
- MUST prefer additive, backward-compatible evolution for public APIs, events, and database contracts.
- SHOULD choose the simplest architecture that can scale operationally; avoid speculative abstractions.
- SHOULD make ownership of state, transactions, concurrency, and failure handling explicit at system boundaries.
- SHOULD document major trade-offs when introducing new modules, queues, caches, or background jobs.
`,
};

export function architectureRules(verbosity = 'standard') {
   return ARCHITECTURE_BY_VERBOSITY[verbosity] ?? ARCHITECTURE_BY_VERBOSITY.standard;
}
