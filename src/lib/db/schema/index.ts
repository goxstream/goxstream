import * as sqliteSchema from "./sqlite";
import * as pgSchema from "./pg";

const connectionType = (process.env.DB_CONNECTION || "").toLowerCase();
const dbUrl = process.env.DB_URL || process.env.DATABASE_URL;

export const isPostgresEnv =
  connectionType === "postgres" ||
  connectionType === "postgresql" ||
  Boolean(dbUrl);

export * from "./sqlite";
export { sqliteSchema, pgSchema };
