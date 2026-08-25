# Mandatory Project Rules

These rules apply to all code changes in this repository.

## UI

- Use the project's shadcn `base-nova` components. Check installed components before creating new primitives.
- Do NOT duplicate shadcn components or create custom versions of existing primitives without justification.
- Use **Lucide** (`lucide-react`) for generic/interface icons.
- Use **Simple Icons** for brand/service/company icons where available.
- Do NOT use emojis in application UI or source code unless explicitly required.
- Do NOT introduce arbitrary icon libraries when Lucide or Simple Icons is appropriate.

## Styling

- Use the repository's Tailwind v4 + shadcn design system.
- Use **semantic design tokens**: `bg-background`, `text-foreground`, `bg-primary`, `text-muted-foreground`, etc.
- Do NOT use arbitrary colors when a semantic token exists.

  ```
  # Wrong
  text-red-500
  bg-blue-500
  text-green-600

  # Correct
  text-destructive
  bg-primary
  text-muted-foreground
  ```

- When a genuinely new semantic token is needed, extend the design system centrally in `src/app/globals.css`.
- Do NOT add one-off color values scattered across components.
- Use `cn()` from `@/lib/utils` for conditional class composition.
- Use `gap-*` instead of `space-x-*` or `space-y-*`.
- Use `size-*` when width and height are equal.

## Code Organization

- Extract reusable components, hooks, utilities, types, constants, and data-access functions.
- Do NOT embed reusable logic directly in `page.tsx` files.
- Feature-specific code stays colocated with its feature.
- Global code must be genuinely reusable across unrelated features.
- Prefer source files under **360 lines**.
- Create directories only when a feature actually needs them.

## TypeScript

- Strict mode is enabled — respect it.
- Use meaningful types. Prefer type inference where appropriate.
- Do NOT use `any` as a shortcut. Fix the underlying type design.
- Do NOT use unsafe casts merely to silence compiler errors.
- Validate external/untrusted data at runtime boundaries.
- Keep infrastructure/vendor-specific types from leaking into application code.

## Cloudflare / Node.js Boundary

- Do NOT import Node.js-only modules (`fs`, `child_process`, `net`, etc.) into code that may execute in the Worker runtime.
- Do NOT use `env.DB`, `env.CACHE`, or other Cloudflare bindings directly in React components or general application modules.
- Access Cloudflare bindings through adapter modules in `src/lib/`.
- Local Wrangler/Miniflare bindings are development resources — do NOT describe them as production services.

## Architecture

- Do NOT introduce `domain/`, `application/`, `infrastructure/`, or `runtime/` layers unless actual complexity requires them.
- Do NOT create repository classes, service containers, dependency injection, or factory patterns unnecessarily.
- Prefer simple, idiomatic Next.js App Router conventions.
- Prefer straightforward TypeScript functions over class hierarchies.

## English-only

- All source code identifiers, comments, filenames, types, and developer documentation must be in English.
- User-facing application content may use any language the product requires.

## Skills

- Inspect relevant installed skills before implementing specialized functionality.
- Use official documentation over assumptions.
- Never invent framework behavior — verify uncertain APIs.
