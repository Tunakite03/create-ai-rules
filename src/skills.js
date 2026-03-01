// ================================================================
//  SKILLS - Stack-aware reusable task templates
// ================================================================

export function buildSkills({ stack }) {
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
`;

   // ── TypeScript / React / Node skills ─────────────────────────

   if (stack === 'ts' || stack === 'react' || stack === 'node') {
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

   if (stack === 'react') {
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
`;
   }

   // ── Node API skills ───────────────────────────────────────────

   if (stack === 'node') {
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

   if (stack === 'python') {
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

   // ── Unity skills ──────────────────────────────────────────────

   if (stack === 'unity') {
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
