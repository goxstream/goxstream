# GoxStream — AI Agent Development Instructions

## Repository Context

Online anime streaming platform built with:

| Technology | Version / Details |
|---|---|
| Next.js | 16.2.11, App Router |
| React | 19.1.7 |
| TypeScript | 5.7.4, strict mode |
| Tailwind CSS | v4 (`@tailwindcss/postcss`) |
| shadcn | v4.19.0, `base-nova` style, Base UI primitives (`@base-ui/react`) |
| Icons | Lucide React (`lucide-react`) |
| Drizzle ORM | Database access (D1 primary target) |
| OpenNext | `@opennextjs/cloudflare` ^1.19.9 |
| Wrangler | v4.125.0 |
| Cloudflare Workers | Primary deployment target |
| Package manager | pnpm |
| Path alias | `@/*` → `./src/*` |
| CSS variables | oklch color tokens in `src/app/globals.css` |

## Development Principles

1. **Inspect before modifying.** Read existing code, config, and installed skills before making changes.
2. **Reuse existing code.** Check for existing components, hooks, utilities, and skills before creating new ones.
3. **No duplicate implementations.** Never create a component, hook, or utility that already exists.
4. **Prefer simple solutions.** Use straightforward TypeScript functions and Next.js conventions.
5. **No premature abstractions.** Only introduce abstractions when actual complexity requires them.
6. **Feature colocation.** Keep feature-specific code close to its route/feature.
7. **Global code must be genuinely reusable.** Do not promote feature-specific code to global directories.
8. **Isolate infrastructure APIs.** Cloudflare-specific APIs must not leak into general application code.
9. **Maintain portability.** Keep the application reasonably deployable on both Cloudflare Workers and Node.js/VPS.
10. **Verify uncertain behavior.** Check official documentation rather than guessing framework/library APIs.
11. **Do not manually edit `src/components/ui/`.** This directory is strictly managed by shadcn CLI. Modify styles globally via `src/app/globals.css` or pass `className` props from parent components.
12. **Restrained design aesthetic.** Avoid heavy shadows (`shadow-2xl`, `shadow-xl`, `shadow-lg`, colored glow effects). Elevate elements with clean border outlines (`border-border/60`) or subtle shadows (`shadow-xs` / `shadow-sm`). Standardize radii to `rounded-md` / `rounded-lg` / `rounded-xl`.
13. **Workspace & artifact discipline.** Never write or leave temporary markdown (`.md`) plan files inside the project workspace folder. Save implementation plans exclusively in the system artifact directory (`<appDataDir>/brain/<conversation-id>/`).

## Project Structure

```
.
├── src/
│   ├── app/                    # Next.js App Router routes
│   │   ├── layout.tsx          # Root layout
│   │   ├── globals.css         # Design tokens and base styles
│   │   ├── page.tsx            # Home page
│   │   ├── <feature>/          # Feature routes (created as needed)
│   │   │   ├── page.tsx
│   │   │   ├── components/     # Feature-private components
│   │   │   ├── hooks/          # Feature-private hooks
│   │   │   ├── lib/            # Feature-private utilities
│   │   │   ├── types.ts
│   │   │   └── constants.ts
│   │   └── api/                # Route Handlers
│   │
│   ├── components/
│   │   └── ui/                 # shadcn components (managed by CLI)
│   │
│   ├── hooks/                  # Globally reusable hooks
│   ├── lib/                    # Application-wide utilities
│   │   ├── utils.ts            # cn() and shared utilities
│   │   └── db/                 # Drizzle ORM database layer
│   │
│   └── types/                  # Globally shared types
│
├── drizzle/                    # Drizzle migrations (created when needed)
├── public/                     # Static assets
│
├── .agents/
│   ├── rules/
│   │   └── important.md        # Mandatory project rules
│   └── skills/
│       ├── shadcn/             # Official shadcn skill
│       ├── migrate-radix-to-base/  # Official Base UI migration skill
│       ├── wrangler/           # Official Cloudflare Wrangler skill
│       ├── workers-best-practices/ # Official Cloudflare Workers skill
│       ├── nextjs-opennext/    # Next.js + OpenNext + CF Workers
│       ├── drizzle/            # Drizzle ORM patterns
│       ├── typescript/         # TypeScript conventions
│       └── modular-architecture/   # Code organization patterns
│
├── AGENTS.md                   # This file
├── next.config.ts
├── open-next.config.ts
├── wrangler.jsonc
├── components.json             # shadcn configuration
├── tsconfig.json
└── package.json
```

> Do not create directories preemptively. Create them only when a feature actually needs them.

## Next.js Conventions

- **Server Components by default.** Only add `"use client"` when client-side interactivity, state, or browser APIs require it.
- **Do not turn entire route trees into Client Components.**
- **Context-Aware Rendering Strategy.** Server Components (RSC) and Server-Side Rendering (SSR) remain the default baseline. However, evaluate and apply the most optimal rendering paradigm based on specific feature requirements:
  - **SSG / ISR:** Ideal for static content, documentation, or catalog pages requiring edge caching and ultra-low latency.
  - **CSR:** Reserved for highly dynamic client UI, video player controls, client-only APIs, or rich interactivity.
  - **PPR (Partial Prerendering):** Use where a static shell combined with streamed dynamic subtrees improves Core Web Vitals. *Note: Verify OpenNext and Cloudflare Workers runtime compatibility before adopting experimental PPR features.*
- **Page files compose.** `page.tsx` should primarily compose components, not contain large JSX structures or business logic.
- Use appropriate Next.js patterns: layouts, `error.tsx`, metadata APIs, Server Actions, Route Handlers.
  - **Loading UI MUST use Skeletons.** All component loading placeholders MUST use the shadcn `Skeleton` component (`@/components/ui/skeleton`).
  - **Mandatory CSR for Dynamic Data & Skeletons.** Dynamic components displaying live data with skeleton loading states MUST use Client-Side Rendering (`"use client"` with client-side data fetching/hooks) to offload execution to the client, reduce Cloudflare Workers CPU load (preventing Error 1102 CPU limit), and fetch data on-demand for the active viewport.
  - **Inline Component Skeletons Mandatory.** Skeletons MUST be integrated directly inline inside the target component file itself (e.g., via `isLoading` prop inside `<EpisodeCard isLoading={true} />`). All separate skeleton components, functions, or files (such as `EpisodeCardSkeleton`, `episode-card-skeleton.tsx`, `LatestEpisodesSectionSkeleton`, or page/route skeleton files) are strictly prohibited. A component file MUST be the single source of truth for both its loaded state and its skeleton loading state.
    ```tsx
    // Inline Skeleton Pattern combining shadcn UI primitives (Card, Skeleton)
    export function EpisodeCard({ episode, isLoading }: EpisodeCardProps) {
      if (isLoading || !episode) {
        return (
          <Card className="flex items-center gap-4 p-3 border-border/60">
            <Skeleton className="aspect-video w-36 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-1/3" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </Card>
        );
      }
      return <Card className="flex items-center gap-4 p-3 border-border/60">...</Card>;
    }
    ```
  - **No spinners or top loaders.** The use of spinners, top loaders, progress bars, or other non-skeleton indicators is strictly prohibited.
  - **Maintain structural layout.** Skeletons must visually mimic the shape and structure of the fully loaded content to prevent Cumulative Layout Shift (CLS).
- **Streaming and caching** where beneficial.
- **Dynamic rendering** only when necessary.

### Page Composition

```tsx
// Good: page.tsx composes components
export default function AnimePage() {
  return (
    <>
      <AnimeHero />
      <AnimeInfo />
      <EpisodeList />
    </>
  );
}
```

Do not put large JSX, reusable hooks, database queries, or complex logic directly in page or components/**.tsx files.

## Component Scope

### Feature-private components

Components used by only one feature stay colocated:

```
app/anime/[slug]/
├── page.tsx
└── components/
    ├── anime-hero.tsx
    ├── anime-info.tsx
    └── episode-list.tsx
```

### Global components

Components reused across unrelated features go in `src/components/`:

```
src/components/
├── ui/            # shadcn (managed by CLI — do not manually edit)
├── header.tsx
├── footer.tsx
└── search-command.tsx
```

Do not promote a component to global merely because it *might* become reusable.

## Cloudflare-first, Not Cloudflare-locked

### Architecture

```
Next.js Application
       │
  ┌────┴────┐
  │         │
CF Workers  Node.js/VPS
  │         │
D1/KV/R2   SQL/Redis/S3
```

### Infrastructure Isolation

Cloudflare bindings must NOT leak throughout the application. Access them through small adapter modules:

```
src/lib/db/         # Database (D1 → SQLite/PostgreSQL)
src/lib/cache/      # Cache (KV → Redis) — when needed
src/lib/storage/    # Object storage (R2 → S3) — when needed
```

Create these only when the functionality is actually required.

### Runtime Boundary

Do NOT assume Node.js APIs are available in Cloudflare Workers:

- `fs`, `child_process`, `net`, `dgram` — unavailable
- `process` — limited
- Native Node modules — unavailable
- Filesystem-dependent libraries — unavailable

### Development Workflow

```bash
pnpm dev          # Normal Next.js development (Node.js)
pnpm preview      # OpenNext + Wrangler (Workers-compatible local runtime)
pnpm deploy       # Production deployment to Cloudflare Workers
```

Local Wrangler/Miniflare resources are development/testing resources — do not describe them as production services.

## Database / Drizzle

- Drizzle ORM for database access.
- Cloudflare D1 is the primary database target.
- Keep database queries out of presentation components.
- Prefer simple data-access functions over repository classes.

```
UI → server function/action/route handler → data-access function → Drizzle → database
```

## File Size Guideline

Prefer source files under **360 lines**. When approaching this limit, extract cohesive modules. This is a maintainability guideline, not a reason to create meaningless files.

## Dependency Direction

```
Page / UI
    ↓
Feature logic
    ↓
Shared application utilities
    ↓
Infrastructure integrations
```

Avoid circular dependencies. Infrastructure code should not be a dependency of presentation components.

## Installed Skills

Before specialized work, inspect relevant installed skills:

| Skill | Purpose |
|---|---|
| `shadcn` | Component installation, composition, variants, accessibility, theming |
| `migrate-radix-to-base` | Migrating Radix → Base UI components |
| `wrangler` | Cloudflare Wrangler CLI commands and configuration |
| `workers-best-practices` | Cloudflare Workers code patterns and anti-patterns |
| `nextjs-opennext` | Next.js 16 App Router + OpenNext + Workers deployment |
| `drizzle` | Drizzle ORM schema, migrations, query patterns |
| `typescript` | TypeScript strict typing conventions |
| `modular-architecture` | Feature colocation and code organization |

## English-only Source Code

All source code must use English: comments, identifiers, filenames, types, constants, documentation. User-facing content may use any language the product requires.

## Do Not Over-Architect

This is an open-source hobby project. Do NOT introduce:

- Dependency injection frameworks
- Service containers
- Repository classes for every model
- Generic CRUD abstractions
- Excessive factory patterns
- Unnecessary interfaces or domain layers
- `domain/`, `application/`, `infrastructure/`, `runtime/` layers

Prefer:

```ts
export async function getAnimeBySlug(slug: string) {
  // Simple data-access function
}
```
