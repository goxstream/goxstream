import { defineConfig } from "drizzle-kit";

const connectionType = (process.env.DB_CONNECTION || "").toLowerCase();
const dbUrl = process.env.DB_URL || process.env.DATABASE_URL;

const isPostgres =
  connectionType !== "d1" &&
  (connectionType === "postgres" ||
    connectionType === "postgresql" ||
    (!connectionType && Boolean(dbUrl)));

export default defineConfig({
  schema: isPostgres
    ? "./src/lib/db/schema/pg/index.ts"
    : "./src/lib/db/schema/sqlite/index.ts",
  out: isPostgres ? "./drizzle/pg" : "./drizzle/d1",
  dialect: isPostgres ? "postgresql" : "sqlite",
  ...(isPostgres && dbUrl ? { dbCredentials: { url: dbUrl } } : {}),
});
