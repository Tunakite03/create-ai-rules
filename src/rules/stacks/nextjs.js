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
- Use Server Actions for mutations; validate input with Zod.
- Create \`loading.tsx\` and \`error.tsx\` for each route segment.
- Use \`next/dynamic\` for heavy client components; prefer named imports.
- Fetch data in Server Components; avoid \`useEffect\` for data loading.
`,
   strict: `## Next.js
- MUST use Server Components by default; \`'use client'\` only when necessary.
  \`\`\`tsx
  // ✓ // No directive - Server Component, fetches directly
  // ✓ 'use client' // Only for useState, useEffect, onClick, etc.
  // ✗ 'use client' // Just to fetch data - use Server Component instead
  \`\`\`
- MUST export metadata from pages/layouts for SEO.
  \`\`\`tsx
  // ✓ export const metadata: Metadata = { title: 'Page', description: '...' }
  // ✓ export async function generateMetadata({ params }) { return { title: params.id } }
  // ✗ <title>Hardcoded</title> in layout
  \`\`\`
- MUST validate Server Action inputs with Zod or equivalent.
  \`\`\`tsx
  // ✓ const schema = z.object({ name: z.string() }); const parsed = schema.parse(formData);
  // ✗ const name = formData.get('name') // no validation
  \`\`\`
- MUST provide loading and error UI for route segments.
  \`\`\`
  app/
  ├── page.tsx
  ├── loading.tsx    // Required for loading state
  └── error.tsx      // Required for error boundary
  \`\`\`
- SHOULD use Server Actions for form mutations; redirect with \`redirect()\`.
- SHOULD use \`next/dynamic\` for heavy client components below the fold.
- SHOULD fetch data in Server Components; avoid client-side \`useEffect\` fetching.
- SHOULD use \`revalidatePath\` / \`revalidateTag\` for cache invalidation after mutations.
- SHOULD colocate route-specific components in the route folder.
`,
};

export function nextjsRules(verbosity = 'standard') {
   return NEXTJS_RULES[verbosity] ?? NEXTJS_RULES.standard;
}
