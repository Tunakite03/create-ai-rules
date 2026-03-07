const FLUTTER_RULES = {
   minimal: `## Flutter / Dart
- Keep widgets small and use null-safe patterns.
`,
   standard: `## Flutter / Dart
- Keep widgets small; move business logic outside widgets.
- Prefer immutable state and predictable state management.
- Use const constructors and scoped rebuilds for performance.
- Organize by features with clean architecture layers: data, domain, and presentation per feature.
`,
   strict: `## Flutter / Dart
- MUST maintain null safety and avoid unsafe assertions.
- MUST follow feature-first folder structure:
  \`\`\`
  lib/
  ├── app/                       # App entry, routing, DI setup
  │   ├── app.dart
  │   └── router.dart
  ├── core/                      # Shared app-wide infrastructure
  │   ├── constants/
  │   ├── theme/
  │   ├── utils/
  │   └── network/               # API client, interceptors
  ├── features/                  # Feature modules
  │   └── <feature>/
  │       ├── data/              # Repositories impl, data sources, DTOs
  │       ├── domain/            # Entities, use cases, repository interfaces
  │       └── presentation/      # Screens, widgets, state (Bloc/Riverpod)
  ├── shared/                    # Shared widgets, extensions
  │   └── widgets/
  └── l10n/                      # Localization
  \`\`\`
- SHOULD keep widgets focused and state immutable.
- SHOULD optimize rebuild scope and dispose subscriptions/controllers.
`,
};

export function flutterRules(verbosity = 'standard') {
   return FLUTTER_RULES[verbosity] ?? FLUTTER_RULES.standard;
}
