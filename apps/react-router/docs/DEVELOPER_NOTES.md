# Developer Notes — Missing API Data Fields

> **Purpose**: This document serves as a reference for developers working on the React Router
> frontend when API endpoints don't yet provide certain data fields. Instead of fabricating
> mock/fake data, follow the guidelines below.

---

## General Principle

**Never fabricate data.** If the API does not return a field, the frontend must:

1. Leave the field as `undefined` / empty string / `0` (depending on type).
2. Render a neutral placeholder in the UI (e.g. `—`, empty state, or hide the section).
3. Show an `<ApiError>` component if the entire API call fails.

---

## Known Missing Fields

### Schedule Data (`/v1/anime` endpoint)

The catalog list endpoint does **not** return schedule/broadcast information:

| Field | Expected Source | Current Status |
|---|---|---|
| `airDay` (day of week) | Dedicated schedule endpoint or `broadcastDay` field | ❌ Not available |
| `airTime` (broadcast time) | Dedicated schedule endpoint or `broadcastTime` field | ❌ Not available |
| `broadcastStatus` (airing_now / upcoming) | Real-time schedule API | ❌ Not available |

**Developer Action**: When a dedicated `/v1/schedule` or `/v1/anime/:slug/schedule` endpoint
is added to the API, update `hooks/use-schedule-anime.ts` to consume it. The hook currently
maps from `/v1/anime` as a best-effort approximation.

### Trending Metrics (`/v1/anime?sort=popular`)

The popular anime endpoint returns ranking by popularity but does **not** include
engagement analytics:

| Field | Expected Source | Current Status |
|---|---|---|
| `weeklyViews` | Analytics / trending metrics API | ❌ Not available |
| `monthlyViews` | Analytics / trending metrics API | ❌ Not available |
| `totalViews` | Analytics / trending metrics API | ❌ Not available |
| `weeklyGrowth` | Computed from analytics | ❌ Not available |
| `trendScore` | Computed from analytics | ❌ Not available |

**Developer Action**: When analytics/metrics are tracked and exposed via API,
update `hooks/use-trending-rankings.ts` and `types/anime.ts` (`TrendingAnimeItem`)
to consume real data. The fields are currently typed as optional (`?`).

### Stream Sources (`/v1/episodes/:id/stream`)

Stream sources are fetched per-episode. If no sources exist in the database:

| Scenario | Behavior |
|---|---|
| Episode has no stream sources | `sources` array is empty `[]` |
| Stream API returns error | Error is silently caught; sources remain `[]` |

**Developer Action**: The watch page UI must handle `sources.length === 0` gracefully
by displaying "No stream sources available for this episode" instead of a broken player.
Previously, demo videos (BigBuckBunny.mp4) were used as fallback — this has been removed.

### Catalog List vs Detail Endpoint

| Field | `/v1/anime` (list) | `/v1/anime/:slug` (detail) |
|---|---|---|
| `genres` | ❌ Not included | ✅ Array of `{ id, name }` |
| `studios` | ❌ Not included | ✅ Array of `{ id, name }` |

**Developer Action**: This is by design (list endpoint is lightweight). Components consuming
list data should handle empty genres/studios gracefully. If genres are needed in list views,
consider adding a query parameter to the API.

---

## Error Handling Pattern

All data-fetching hooks expose an `error` state:

```ts
const { data, isLoading, error } = useSomeHook();
```

Consuming components should render `<ApiError>` when `error` is not null:

```tsx
import { ApiError } from "@/components/api-error";

if (error) return <ApiError message={error} onRetry={() => window.location.reload()} />;
```

---

## When Adding New API Consumers

1. **Always add `error` state** to new hooks — never silently swallow errors.
2. **Never generate fake data** to fill UI gaps.
3. **Document missing fields** in this file if you discover the API doesn't provide expected data.
4. **Use `undefined` / optional types** for fields the API may add later.
