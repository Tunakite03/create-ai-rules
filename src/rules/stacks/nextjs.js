const NEXTJS_RULES = {
   minimal: `## Next.js
- Use App Router (app/) directory structure.
- Server Components by default; \`'use client'\` only when needed.
- Export \`metadata\` object for SEO; use \`generateMetadata\` for dynamic data.
`,
   standard: `## Next.js
- Use App Router with Server Components by default.
- Mark Client Components with \`'use client'\` only when using hooks, browser APIs, or event handlers.
- Export \`metadata\` or \`generateMetadata\` from page/layout for SEO.
- Use Server Actions for mutations; validate with Zod. Separate read queries (\`lib/data/\`) from write actions (\`lib/actions/\`).
- Create \`loading.tsx\` and \`error.tsx\` for each route segment.
- Use \`next/dynamic\` for heavy client components; prefer named imports.
- Fetch data in Server Components; avoid \`useEffect\` for data loading.
- Use route groups \`(group)/\` with their own \`layout.tsx\` to scope shells (auth, marketing, app).
- Colocate route-specific files in \`_components/\` and \`_lib/\` (private folders) within the route; share UI in \`components/ui/\`.
- Use \`middleware.ts\` at the project root for auth guards, redirects, and i18n — not per-page checks.
- Group domain logic under \`features/\`; use \`services/\` for external API/third-party clients; \`providers/\` for React context providers.
`,
   strict: `## Next.js
- MUST use Server Components by default; \`'use client'\` only when necessary.
  \`\`\`tsx
  // ✓ // No directive — Server Component, fetches directly
  // ✓ 'use client' // Only for useState, useEffect, onClick, browser APIs
  // ✗ 'use client' // Just to fetch data — use Server Component instead
  \`\`\`
- MUST export metadata from pages/layouts for SEO.
  \`\`\`tsx
  // ✓ export const metadata: Metadata = { title: 'Page', description: '...' }
  // ✓ export async function generateMetadata({ params }) { return { title: params.id } }
  // ✗ <title>Hardcoded</title> in layout
  \`\`\`
- MUST validate Server Action inputs with Zod or equivalent.
  \`\`\`tsx
  // ✓ const parsed = schema.safeParse(formData); if (!parsed.success) return { error: parsed.error }
  // ✗ const name = formData.get('name') // no validation, no error shape
  \`\`\`
- MUST separate read queries from write actions, and isolate external integrations in \`services/\`.
  \`\`\`ts
  // ✓ lib/data/users.ts      → getUser(id)          // DB reads for Server Components
  // ✓ lib/actions/users.ts   → updateUser(...)       // Server Action mutations
  // ✓ services/stripe.ts     → createCheckout(...)   // Third-party API client wrappers
  // ✗ mixing DB reads, mutations, and Stripe calls in the same file
  \`\`\`
- MUST use \`middleware.ts\` for cross-cutting concerns; never duplicate auth checks in each page.
  \`\`\`ts
  // ✓ middleware.ts — matches '/dashboard/:path*', redirects if no session
  // ✗ checking session in every dashboard page.tsx individually
  \`\`\`
- MUST follow the scalable App Router folder structure:
  \`\`\`
  middleware.ts                  # Auth, i18n, redirects — runs on the Edge
  instrumentation.ts             # OpenTelemetry / observability setup
  next.config.ts
  public/
  src/
  ├── app/                       # App Router — folders = URL segments
  │   ├── layout.tsx             # Root layout (<html>, <body>, global providers)
  │   ├── page.tsx               # Home page /
  │   ├── loading.tsx            # Root loading skeleton
  │   ├── error.tsx              # Root error boundary
  │   ├── not-found.tsx          # 404 page
  │   ├── global-error.tsx       # Catches errors inside root layout itself
  │   │
  │   ├── (marketing)/           # Route group — public pages, own layout
  │   │   ├── layout.tsx         # Marketing shell (no sidebar/auth)
  │   │   ├── page.tsx           # Landing /
  │   │   ├── about/page.tsx
  │   │   └── blog/
  │   │       ├── page.tsx       # /blog
  │   │       ├── [slug]/
  │   │       │   └── page.tsx   # /blog/:slug
  │   │       └── _components/   # Private — blog-only components, not routable
  │   │
  │   ├── (app)/                 # Route group — authenticated app shell
  │   │   ├── layout.tsx         # App shell (sidebar, nav, session guard)
  │   │   ├── dashboard/
  │   │   │   ├── page.tsx
  │   │   │   ├── loading.tsx
  │   │   │   ├── error.tsx
  │   │   │   ├── _components/   # Route-private UI components
  │   │   │   └── _lib/          # Route-private data queries & helpers
  │   │   └── settings/
  │   │       └── page.tsx
  │   │
  │   ├── (auth)/                # Route group — login / register, own layout
  │   │   ├── layout.tsx         # Centered card layout, no sidebar
  │   │   ├── login/page.tsx
  │   │   └── register/page.tsx
  │   │
  │   └── api/                   # Route Handlers (webhooks, OAuth callbacks)
  │       └── [...]/route.ts
  │
  ├── components/                # Shared, reusable UI components
  │   ├── ui/                    # Primitives: Button, Input, Dialog, Badge
  │   └── layout/                # App-wide partials: Header, Footer, Sidebar
  │
  ├── features/                  # Domain-driven feature modules
  │   └── <feature>/             # e.g. users/, billing/, dashboard/
  │       ├── components/        # Feature-scoped UI components
  │       ├── hooks/             # Feature-scoped hooks
  │       ├── actions.ts         # Server Actions for this feature
  │       ├── queries.ts         # DB read queries for this feature
  │       ├── schemas.ts         # Zod schemas for this feature
  │       └── types.ts           # Feature-specific TypeScript types
  │
  ├── lib/                       # Low-level shared utilities (no business logic)
  │   ├── data/                  # Generic DB helpers / query builders
  │   ├── actions/               # Shared / cross-feature Server Actions
  │   ├── validations/           # Global Zod schemas
  │   └── utils.ts               # Pure utility functions
  │
  ├── services/                  # External API & third-party client wrappers
  │   ├── stripe.ts              # Payment
  │   ├── email.ts               # Resend / SendGrid
  │   └── storage.ts             # S3 / Cloudflare R2
  │
  ├── hooks/                     # Shared custom React hooks (client-side)
  ├── providers/                 # React context providers (Theme, Auth, Toast)
  ├── store/                     # Client state: Zustand / Jotai atoms
  ├── types/                     # Global TypeScript types and interfaces
  ├── constants/                 # App-wide magic strings, enums, static data
  └── config/                    # siteConfig, nav links, env-derived settings
  \`\`\`
- SHOULD use Server Actions for form mutations; redirect with \`redirect()\` after success.
- SHOULD use \`next/dynamic\` for heavy client components below the fold.
- SHOULD use \`revalidatePath\` / \`revalidateTag\` after mutations — never stale cache.
- SHOULD use \`generateStaticParams\` for known dynamic segments to enable static generation.
- SHOULD prefer \`_components/\` (private folder) over a plain \`components/\` folder inside a route to make non-routability explicit.
`,
};

export function nextjsRules(verbosity = 'standard') {
   return NEXTJS_RULES[verbosity] ?? NEXTJS_RULES.standard;
}
