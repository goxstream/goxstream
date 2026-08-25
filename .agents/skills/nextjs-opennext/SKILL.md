---
name: nextjs-opennext
description: Next.js 16 App Router conventions combined with OpenNext Cloudflare Workers deployment. Covers Server/Client Components, Server Actions, Route Handlers, caching, streaming, runtime constraints, and local development with Wrangler bindings.
user-invocable: false
---

# Next.js 16 + OpenNext + Cloudflare Workers

## App Router Conventions

### Server Components (default)

All components are Server Components unless explicitly marked with `"use client"`. Server Components can:

- Directly `await` data
- Access server-only resources (databases, secrets, bindings)
- Render without shipping JavaScript to the client
- Use `async/await` at the component level

### Client Components

Add `"use client"` only when the component needs:

- `useState`, `useReducer`, `useEffect`, `useRef`
- Event handlers (`onClick`, `onChange`, `onSubmit`)
- Browser APIs (`window`, `document`, `localStorage`)
- Third-party client-only libraries

Keep Client Components as leaf nodes in the component tree.

### Server Actions

Use Server Actions for form mutations and data writes:

```tsx
"use server";

export async function createComment(formData: FormData) {
  // Validate, write to database, revalidate
}
```

- Define in a separate `actions.ts` file or inline with `"use server"` directive
- Always validate input (Server Actions are public HTTP endpoints)
- Use `revalidatePath()` or `revalidateTag()` after mutations

### Route Handlers

Use Route Handlers (`app/api/.../route.ts`) for:

- Webhooks
- Third-party API integrations
- Streaming responses
- Non-form HTTP APIs

```ts
export async function GET(request: Request) {
  // Handle request
  return Response.json({ data });
}
```

### Layouts and Templates

- `layout.tsx` — shared UI that persists across navigations
- `loading.tsx` — streaming loading UI (React Suspense boundary)
- `error.tsx` — route-level error boundary (must be a Client Component)
- `not-found.tsx` — 404 UI

### Metadata

Use the Metadata API for SEO:

```tsx
export const metadata: Metadata = {
  title: "Anime Title — GoxStream",
  description: "Watch Anime Title episodes online",
};
```

Or `generateMetadata` for dynamic routes.

### Caching and Revalidation

- `fetch()` results are cached by default in production
- Use `revalidate` option or `revalidateTag()` for ISR
- Use `export const dynamic = "force-dynamic"` only when truly needed
- Prefer `unstable_cache` for non-fetch data sources

## OpenNext + Cloudflare Workers

### How It Works

```
Next.js build output
       ↓
OpenNext adapter (@opennextjs/cloudflare)
       ↓
Cloudflare Workers-compatible bundle
       ↓
wrangler deploy
```

### Cloudflare Bindings Access

Use `getCloudflareContext()` to access bindings in server-side code:

```ts
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function getData() {
  const { env } = await getCloudflareContext();
  const db = env.DB; // D1
  const kv = env.CACHE; // KV
  const bucket = env.MEDIA; // R2
}
```

This works in:
- Server Components
- Server Actions
- Route Handlers
- Middleware

It does NOT work in:
- Client Components
- Client-side code

### Configuration Files

| File | Purpose |
|---|---|
| `next.config.ts` | Next.js configuration + `initOpenNextCloudflareForDev()` |
| `open-next.config.ts` | OpenNext adapter configuration |
| `wrangler.jsonc` | Cloudflare Worker configuration, bindings, compatibility |
| `.dev.vars` | Local environment variables for Wrangler dev |

### Node.js APIs NOT Available in Workers

These will fail at runtime in Cloudflare Workers:

- `fs` / `fs/promises`
- `child_process`
- `net`, `dgram`, `tls`
- `cluster`
- `worker_threads`
- Native addons / `.node` files
- `__dirname`, `__filename` (use `import.meta.url`)
- Long-lived connections (WebSocket servers via Durable Objects instead)

### Development Workflow

```bash
pnpm dev          # Next.js dev server (Node.js runtime, hot reload)
pnpm preview      # Build + run on local Workers runtime (tests CF compatibility)
pnpm deploy       # Build + deploy to Cloudflare Workers
```

Use `pnpm dev` for normal development. Use `pnpm preview` to verify Cloudflare compatibility before deploying.

### Current Bindings (wrangler.jsonc)

| Binding | Type | Name |
|---|---|---|
| `IMAGES` | Images | Image optimization |
| `ASSETS` | Assets | Static asset serving |
| `WORKER_SELF_REFERENCE` | Service | Self-reference for caching |

D1, KV, and R2 bindings should be added to `wrangler.jsonc` when those features are implemented.
