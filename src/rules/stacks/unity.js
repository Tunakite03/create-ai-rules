const UNITY_RULES = {
   minimal: `## Unity / C#
- Cache expensive lookups and keep Update lightweight.
`,
   standard: `## Unity / C#
- Cache \`GetComponent\` calls; avoid repeated scene searches.
- Keep heavy logic out of \`Update\`; prefer events/coroutines.
- Use pooling for frequently spawned objects.
- Organize scripts by system (Core, Gameplay, UI, Utils); keep project assets under \`_Project/\`.
`,
   strict: `## Unity / C#
- MUST avoid expensive lookups/allocations in frame loops.
- MUST follow structured project layout:
  \`\`\`
  Assets/
  ├── _Project/                  # All project-specific assets
  │   ├── Scripts/
  │   │   ├── Core/              # Managers, singletons, event system
  │   │   ├── Gameplay/          # Player, enemies, items, game logic
  │   │   ├── UI/                # UI controllers, views, HUD
  │   │   ├── Data/              # ScriptableObjects, configs
  │   │   └── Utils/             # Helpers, extensions
  │   ├── Prefabs/
  │   ├── Scenes/
  │   ├── Materials/
  │   ├── Textures/
  │   ├── Audio/
  │   └── Animations/
  ├── Plugins/                   # Third-party plugins
  └── Editor/                    # Editor-only scripts and tools
  \`\`\`
- SHOULD cache components and use object pooling in hot paths.
- SHOULD separate runtime logic from editor-only code.
`,
};

export function unityRules(verbosity = 'standard') {
   return UNITY_RULES[verbosity] ?? UNITY_RULES.standard;
}
