# Next.js + OpenNext Rules

## Server vs Client Components

- Default to Server Components. Only add `"use client"` when required.
- Do NOT mark entire route trees as Client Components.
- Do NOT use `"use client"` merely because a child component needs it — push the boundary down.
- Do NOT import server-only modules in Client Components.

## Data Access

- Do NOT call `getCloudflareContext()` in Client Components.
- Do NOT perform database queries directly in presentation components.
- Use Server Actions for mutations, not manual `fetch()` to API routes.
- Validate all Server Action inputs — they are public endpoints.

## Runtime Safety

- Do NOT use Node.js-only APIs (`fs`, `child_process`, etc.) in code that runs on Workers.
- Do NOT assume `process.env` works the same way in Workers — use `getCloudflareContext()` for bindings.
- Test Workers compatibility with `pnpm preview` before deploying.

## Caching

- Do NOT add `export const dynamic = "force-dynamic"` unless truly needed.
- Prefer incremental revalidation over disabling caching entirely.
- Use `revalidatePath()` / `revalidateTag()` after mutations.

## Configuration

- Do NOT modify `open-next.config.ts` without understanding the OpenNext adapter.
- Add new Cloudflare bindings to `wrangler.jsonc`, not to application code.
- Keep `initOpenNextCloudflareForDev()` in `next.config.ts` for local binding access.
