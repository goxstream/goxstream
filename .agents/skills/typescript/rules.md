# TypeScript Rules

## No `any`

- Do NOT use `any` as a shortcut for unresolved typing problems.
- Use `unknown` for values of genuinely unknown type, then narrow.
- Use generics for flexible but type-safe APIs.

## No Unsafe Assertions

- Do NOT use `as T` to silence compiler errors without runtime validation.
- Do NOT use `!` (non-null assertion) without verifying the value exists.
- Do NOT add `@ts-ignore` or `@ts-expect-error` without a documented reason.

## External Boundaries

- Validate all external data (API responses, user input, URL params) at runtime.
- Use Zod, Valibot, or equivalent for schema validation.
- Do NOT trust `as T` casts for data from external sources.

## Type Design

- Use discriminated unions for state representations.
- Use Drizzle's `InferSelectModel` / `InferInsertModel` for database types.
- Export explicit return types on public functions.
- Use utility types (`Partial`, `Pick`, `Omit`, etc.) instead of manual type construction.

## Vendor Types

- Keep Cloudflare, Drizzle, and other vendor-specific types in infrastructure modules.
- Application code (components, hooks, pages) should use application-level types.
- Do NOT import `@cloudflare/workers-types` in UI components.
