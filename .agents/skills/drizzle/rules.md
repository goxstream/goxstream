# Drizzle ORM Rules

## Schema

- Define tables using `sqliteTable` (D1 is SQLite-based).
- Use Drizzle's type inference (`InferSelectModel`, `InferInsertModel`) instead of manually writing types.
- Keep schema files in `src/lib/db/schema.ts` or `src/lib/db/schema/`.
- Export all tables and relations from a single entry point.

## Data Access

- Do NOT put database queries directly in React components.
- Do NOT put database queries in Client Components.
- Use data-access functions in `src/lib/db/queries/`.
- Prefer simple functions over repository classes.

## Queries

- Use the relational query API (`db.query.*`) for reads with relations.
- Use the SQL-like API (`db.select()`, `db.insert()`, etc.) for complex queries.
- Do NOT scatter Drizzle imports across the application — centralize in `src/lib/db/`.

## Migrations

- Always use Drizzle Kit to generate migrations from schema changes.
- Do NOT manually write migration SQL unless Drizzle Kit cannot express the change.
- Review generated migrations before applying.

## D1 Specific

- Do NOT use `BEGIN TRANSACTION` / `COMMIT` — use D1 batch API instead.
- Do NOT exceed 100 parameters per query — batch large inserts.
- Do NOT use PostgreSQL-specific features (arrays, JSONB, etc.) in D1 schemas.

## Portability

- Keep schema definitions database-agnostic where practical.
- Isolate D1-specific code (batch API, binding access) in `src/lib/db/index.ts`.
- A future PostgreSQL migration should only require changing the driver and table definitions.
