---
name: drizzle
description: Drizzle ORM patterns for schema definition, migrations, queries, type inference, and D1 integration. Covers data-access function patterns, portability between D1 and PostgreSQL, and preventing common anti-patterns.
user-invocable: false
---

# Drizzle ORM

## Schema Organization

Keep schema files in `src/lib/db/`:

```
src/lib/db/
├── index.ts          # Database client initialization
├── schema.ts         # All table definitions (or split by domain)
└── queries/          # Data-access functions (created as needed)
```

For larger schemas, split by domain area:

```
src/lib/db/
├── index.ts
├── schema/
│   ├── anime.ts
│   ├── user.ts
│   └── index.ts      # Re-exports all tables
└── queries/
    ├── anime.ts
    └── user.ts
```

## Schema Definition

Use Drizzle's schema builder:

```ts
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const anime = sqliteTable("anime", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  synopsis: text("synopsis"),
  coverUrl: text("cover_url"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});
```

### Type Inference

Use Drizzle's built-in type inference:

```ts
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";

export type Anime = InferSelectModel<typeof anime>;
export type NewAnime = InferInsertModel<typeof anime>;
```

## Database Client

### D1 (Cloudflare Workers)

```ts
import { drizzle } from "drizzle-orm/d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import * as schema from "./schema";

export async function getDb() {
  const { env } = await getCloudflareContext();
  return drizzle(env.DB, { schema });
}
```

### Portable Alternative

For Node.js/VPS deployment, swap the driver:

```ts
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";

const sqlite = new Database("local.db");
export const db = drizzle(sqlite, { schema });
```

## Data-Access Functions

Prefer simple functions over repository classes:

```ts
// src/lib/db/queries/anime.ts
import { eq } from "drizzle-orm";
import { getDb } from "../index";
import { anime } from "../schema";

export async function getAnimeBySlug(slug: string) {
  const db = await getDb();
  return db.query.anime.findFirst({
    where: eq(anime.slug, slug),
  });
}

export async function listAnime(limit = 20, offset = 0) {
  const db = await getDb();
  return db.query.anime.findMany({
    limit,
    offset,
    orderBy: (anime, { desc }) => [desc(anime.createdAt)],
  });
}
```

## Migrations

Use Drizzle Kit for migrations:

```bash
pnpm drizzle-kit generate    # Generate migration from schema changes
pnpm drizzle-kit migrate     # Apply migrations locally
```

Configure in `drizzle.config.ts`:

```ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
});
```

## Relations

Define relations for type-safe queries:

```ts
import { relations } from "drizzle-orm";

export const animeRelations = relations(anime, ({ many }) => ({
  episodes: many(episode),
}));

export const episodeRelations = relations(episode, ({ one }) => ({
  anime: one(anime, {
    fields: [episode.animeId],
    references: [anime.id],
  }),
}));
```

## D1 Considerations

- D1 is SQLite-based — use `sqliteTable`, not `pgTable`
- D1 has a 100-parameter limit per query — batch large inserts
- Use D1's batch API for transactions: `db.batch([...])`
- `BEGIN TRANSACTION` does not work on D1 — use batch API instead
- Foreign keys require `PRAGMA foreign_keys = ON` (set in D1 dashboard or migration)
