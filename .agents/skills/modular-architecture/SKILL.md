---
name: modular-architecture
description: Idiomatic Next.js App Router feature organization patterns. Covers feature colocation, component scope, dependency direction, file-size management, circular dependency prevention, and when NOT to introduce enterprise-style layers.
user-invocable: false
---

# Modular Architecture — Next.js Feature Organization

## Core Principle

> Use idiomatic Next.js App Router conventions. Do NOT introduce `domain/`, `application/`, `infrastructure/`, or `runtime/` layers merely for architectural purity.

## Feature Colocation

Keep feature-specific code next to its route:

```
app/anime/[slug]/
├── page.tsx              # Page composition
├── components/           # Feature-private components
│   ├── anime-hero.tsx
│   ├── anime-info.tsx
│   └── episode-list.tsx
├── hooks/                # Feature-private hooks
│   └── use-anime-data.ts
├── lib/                  # Feature-private utilities
│   └── format-episode.ts
├── types.ts              # Feature-specific types
└── constants.ts          # Feature-specific constants
```

### Rules

- Create directories only when needed — do NOT pre-create empty directories
- A feature with only `page.tsx` and one component does NOT need `components/`, `hooks/`, `lib/`, etc.
- Start simple, extract when complexity demands it

## Component Scope

### Feature-private (colocated)

Components used by only ONE feature stay in that feature's `components/` directory:

```
app/watch/[episodeId]/components/video-player.tsx
```

### Global (shared)

Components used by MULTIPLE unrelated features go in `src/components/`:

```
src/components/header.tsx
src/components/footer.tsx
src/components/search-command.tsx
```

### Promotion criteria

Move a component to global ONLY when:
- It is actually imported by 2+ unrelated features
- It has a stable, general-purpose API
- It does not depend on feature-specific types or state

Do NOT promote speculatively.

## Page Composition

`page.tsx` should primarily compose — not implement:

```tsx
// Good
export default async function AnimePage({ params }: Props) {
  const anime = await getAnimeBySlug(params.slug);
  return (
    <>
      <AnimeHero anime={anime} />
      <AnimeInfo anime={anime} />
      <EpisodeList animeId={anime.id} />
    </>
  );
}

// Bad — too much logic and markup in page.tsx
export default async function AnimePage({ params }: Props) {
  const anime = await db.query.anime.findFirst({ ... });
  return (
    <div className="...">
      <div className="...">
        <h1>{anime.title}</h1>
        {/* 200 lines of inline JSX */}
      </div>
    </div>
  );
}
```

## Dependency Direction

```
Pages / UI Components
         ↓
Feature Logic (hooks, utilities)
         ↓
Shared Application Utilities (lib/)
         ↓
Infrastructure (lib/db/, lib/cache/)
```

### Rules

- UI components do NOT import infrastructure modules directly
- Feature logic may import shared utilities and infrastructure
- Infrastructure modules do NOT import from UI or features
- No circular dependencies — if A imports B, B must NOT import A

## File Size Management

Target: source files under **360 lines**.

When a file approaches this limit:

1. Identify distinct responsibilities
2. Extract cohesive modules (components, hooks, utilities)
3. Keep extracted modules colocated if feature-specific
4. Move to global only if genuinely reusable

Do NOT split files artificially — a 400-line file with one cohesive responsibility is better than 4 files with arbitrary boundaries.

## Shared Utilities (`src/lib/`)

Use `src/lib/` for genuinely application-wide functionality:

```
src/lib/
├── utils.ts          # cn() and general utilities
├── db/               # Database layer
├── cache/            # Cache layer (when needed)
├── storage/          # Object storage (when needed)
├── auth/             # Authentication (when needed)
└── validation/       # Shared validation schemas (when needed)
```

Do NOT use `src/lib/` as a dumping ground. Feature-specific utilities stay in the feature.

## Global Hooks (`src/hooks/`)

Use `src/hooks/` only for hooks reused across unrelated features:

```
src/hooks/
├── useDebounce.ts
├── useMediaQuery.ts
└── useLocalStorage.ts
```

Feature-specific hooks stay colocated.

## Anti-Patterns to Avoid

| Anti-Pattern | Why It's Wrong | What to Do Instead |
|---|---|---|
| `domain/` layer | Unnecessary complexity for this project | Use feature colocation |
| `infrastructure/` layer | Over-abstraction | Use `src/lib/` for shared infra |
| Repository class per table | Boilerplate without value | Simple data-access functions |
| Service class for every operation | Enterprise pattern, not needed | Functions in feature `lib/` |
| Barrel exports (`index.ts`) everywhere | Increases bundle size, slows imports | Direct imports |
| Premature abstraction | Creates coupling to unused interfaces | Extract when 2+ consumers exist |
