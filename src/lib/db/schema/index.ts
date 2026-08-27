import * as sqliteSchema from "./sqlite";
import * as pgSchema from "./pg";

const connectionType = (process.env.DB_CONNECTION || "").toLowerCase();
const dbUrl = process.env.DB_URL || process.env.DATABASE_URL;

export const isPostgresEnv =
  connectionType === "postgres" ||
  connectionType === "postgresql" ||
  Boolean(dbUrl);

const activeSchema: typeof sqliteSchema = isPostgresEnv
  ? (pgSchema as any)
  : sqliteSchema;

export const {
  users,
  userSettings,
  sessions,
  usersRelations,
  userSettingsRelations,
  sessionsRelations,
  animes,
  genres,
  studios,
  animeGenres,
  animeStudios,
  episodes,
  streamSources,
  subtitleTracks,
  audioTracks,
  serverNodes,
  watchlists,
  watchHistories,
} = activeSchema;

export { sqliteSchema, pgSchema };
