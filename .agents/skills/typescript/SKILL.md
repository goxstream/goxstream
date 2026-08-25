---
name: typescript
description: Production TypeScript conventions for strict typing, inference, generics, discriminated unions, utility types, runtime validation, and safe narrowing. Prevents common anti-patterns like any abuse, unsafe assertions, and leaked vendor types.
user-invocable: false
---

# TypeScript Conventions

## Strict Mode

The project has `strict: true` enabled. This means:

- `strictNullChecks` — `null` and `undefined` are distinct types
- `noImplicitAny` — all values must have explicit or inferred types
- `strictFunctionTypes` — function parameter types are checked contravariantly
- `strictPropertyInitialization` — class properties must be initialized

Respect all strict checks. Do NOT add `// @ts-ignore` or `// @ts-expect-error` without a documented reason.

## Type Inference

Let TypeScript infer types when the inference is clear:

```ts
// Good — inference is obvious
const count = 42;
const items = [1, 2, 3];
const result = await getAnime(slug);

// Good — explicit return type documents the API
export async function getAnimeBySlug(slug: string): Promise<Anime | null> {
  // ...
}
```

Add explicit types when:
- The function is exported (return type documents the public API)
- The inference would be too complex or unclear
- The type needs to be narrower than what inference provides

## Discriminated Unions

Use discriminated unions for states and results:

```ts
type FetchResult<T> =
  | { status: "success"; data: T }
  | { status: "error"; error: string }
  | { status: "loading" };
```

## Utility Types

Use TypeScript's built-in utility types:

```ts
Partial<T>        // All properties optional
Required<T>       // All properties required
Pick<T, K>        // Subset of properties
Omit<T, K>        // Exclude properties
Record<K, V>      // Key-value mapping
Extract<T, U>     // Extract matching union members
Exclude<T, U>     // Exclude matching union members
NonNullable<T>    // Remove null/undefined
ReturnType<F>     // Infer function return type
Awaited<T>        // Unwrap Promise type
```

## Generics

Use generics to create reusable, type-safe utilities:

```ts
export async function fetchApi<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  return response.json() as Promise<T>;
}
```

Name generic parameters meaningfully when there are multiple: `<TData, TError>` instead of `<T, U>`.

## Runtime Validation

Validate data at external boundaries (API responses, user input, URL params):

```ts
import { z } from "zod"; // or valibot

const AnimeSchema = z.object({
  id: z.number(),
  title: z.string(),
  slug: z.string(),
  synopsis: z.string().optional(),
});

export function parseAnime(data: unknown) {
  return AnimeSchema.parse(data);
}
```

Do NOT trust `as T` casts for external data — validate it.

## Safe Narrowing

Use type guards and narrowing instead of assertions:

```ts
// Good — type guard
function isAnime(value: unknown): value is Anime {
  return typeof value === "object" && value !== null && "slug" in value;
}

// Good — narrowing with checks
if (result.status === "success") {
  // TypeScript knows result.data exists here
  console.log(result.data);
}

// Bad — unsafe assertion
const anime = result as Anime; // No runtime check
```

## Avoiding `any`

Never use `any` as a shortcut:

```ts
// Bad
function processData(data: any) { ... }

// Good
function processData(data: unknown) {
  // Validate and narrow the type
}

// Good — when the type is genuinely flexible
function processData<T extends Record<string, unknown>>(data: T) { ... }
```

If you encounter a typing problem, fix the type design rather than escaping to `any`.

## Vendor Type Isolation

Keep infrastructure/vendor-specific types from leaking into application code:

```ts
// Bad — Cloudflare types in a component
import type { D1Database } from "@cloudflare/workers-types";
function AnimeList({ db }: { db: D1Database }) { ... }

// Good — application types in components
function AnimeList({ anime }: { anime: Anime[] }) { ... }
```

Vendor types belong in infrastructure modules (`src/lib/db/`, etc.), not in UI components.
