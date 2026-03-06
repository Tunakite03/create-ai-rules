const REACT_RULES = {
   minimal: `## React / Next.js
- Functional components + hooks only. No class components.
- Default to Server Components; add \`'use client'\` only when needed (hooks, events, browser APIs).
- Fetch data on the server (Server Components / Server Actions); avoid client-side \`useEffect\` for data loading.
- Co-locate loading/error states: \`loading.tsx\`, \`error.tsx\` siblings.
`,
   standard: `## React / Next.js
- Use functional components + hooks only.
- Default to Server Components. Add \`'use client'\` only when the component uses hooks, event handlers, or browser APIs.
- Keep components presentational; move data logic to hooks (client) or server functions (server).
- Fetch data on the server via \`async\` Server Components or Server Actions — avoid client-side \`useEffect\` for initial data loading.
- Use Server Actions (\`'use server'\`) for mutations and form handling — not API route handlers.
- Export \`metadata\` / \`generateMetadata\` from every page for SEO.
- Co-locate \`loading.tsx\` and \`error.tsx\` siblings for every route segment.
- Use \`next/image\` for all images, \`next/link\` for all internal navigation, \`next/font\` for fonts.
- Validate environment variables at startup; never expose server-only secrets to client bundles (\`NEXT_PUBLIC_\` prefix only for client vars).
`,
   strict: `## React / Next.js
- MUST use functional components and hooks. No class components.
- MUST default to Server Components. Add \`'use client'\` only when the component uses hooks, event handlers, or browser APIs.
  \`\`\`tsx
  // ✓ Server Component (default) — no directive needed
  export default async function UserProfile({ userId }: { userId: string }) {
    const user = await getUser(userId);
    return <h1>{user.name}</h1>;
  }
  // ✗ Adding 'use client' just to render data — unnecessary client bundle
  \`\`\`
- MUST fetch data on the server (Server Components / Server Actions). Never use client \`useEffect\` for initial data loading.
  \`\`\`tsx
  // ✓ async Server Component
  const data = await fetch('https://api.example.com/data', { next: { revalidate: 60 } });
  // ✗ useEffect(() => { fetch('/api/data').then(setData) }, [])
  \`\`\`
- MUST use Server Actions (\`'use server'\`) for mutations and form handling.
  \`\`\`tsx
  // ✓ async function createPost(formData: FormData) { 'use server'; ... }
  // ✗ const handler = async () => { await fetch('/api/posts', { method: 'POST' }) }
  \`\`\`
- MUST export \`metadata\` or \`generateMetadata\` from every \`page.tsx\` and \`layout.tsx\`.
- MUST co-locate \`loading.tsx\` and \`error.tsx\` for every route segment that fetches data.
- SHOULD keep components small and focused. Extract reusable logic to custom hooks (client) or utility functions (server).
- SHOULD avoid unnecessary re-renders: memoize callbacks passed to children, use \`React.memo\` for expensive pure components.
  \`\`\`tsx
  // ✓ setState(prev => ({ ...prev, count: prev.count + 1 }))
  // ✗ state.count++; setState(state)
  \`\`\`
- SHOULD push client interactivity to leaf components. Keep the tree mostly server-rendered.
- SHOULD use \`next/image\`, \`next/link\`, \`next/font\` — never raw \`<img>\`, \`<a>\`, or CSS font imports.
- SHOULD dynamically import heavy client components: \`const Chart = dynamic(() => import('./Chart'), { ssr: false })\`.
`,
};

export function reactRules(verbosity = 'standard') {
   return REACT_RULES[verbosity] ?? REACT_RULES.standard;
}
