# Modular Architecture Rules

## Organization

- Feature-specific code stays colocated with its route. Do NOT move it to global directories prematurely.
- Create directories only when a feature actually needs them.
- Do NOT pre-create empty `components/`, `hooks/`, `lib/`, `types.ts` for every route.

## Component Scope

- Components used by one feature stay in that feature's `components/` directory.
- Components used by multiple unrelated features go in `src/components/`.
- Do NOT promote components to global speculatively.

## Page Files

- `page.tsx` composes components — it does NOT contain large JSX or business logic.
- Extract reusable components, hooks, and utilities from page files.

## Dependencies

- UI components do NOT import infrastructure modules directly.
- No circular dependencies.
- Feature code may import from `src/lib/` but NOT from other features.

## File Size

- Prefer source files under 360 lines.
- Extract when there are genuine separate responsibilities, not merely to hit a line count.

## Anti-Patterns

- Do NOT introduce `domain/`, `application/`, `infrastructure/`, or `runtime/` layers.
- Do NOT create repository classes, service containers, or factory patterns.
- Do NOT create barrel exports (`index.ts`) everywhere.
- Do NOT extract abstractions until 2+ consumers actually exist.
