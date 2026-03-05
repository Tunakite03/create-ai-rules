const FLUTTER_RULES = {
   minimal: `## Flutter / Dart
- Keep widgets small and use null-safe patterns.
`,
   standard: `## Flutter / Dart
- Keep widgets small; move business logic outside widgets.
- Prefer immutable state and predictable state management.
- Use const constructors and scoped rebuilds for performance.
`,
   strict: `## Flutter / Dart
- MUST maintain null safety and avoid unsafe assertions.
- SHOULD keep widgets focused and state immutable.
- SHOULD optimize rebuild scope and dispose subscriptions/controllers.
`,
};

export function flutterRules(verbosity = 'standard') {
   return FLUTTER_RULES[verbosity] ?? FLUTTER_RULES.standard;
}
