import * as sqliteSchema from "./sqlite";
import * as pgSchema from "./pg";

const connectionType = (process.env.DB_CONNECTION || "").toLowerCase();
const dbUrl = process.env.DB_URL || process.env.DATABASE_URL;

export const isPostgresEnv =
  connectionType !== "d1" &&
  (connectionType === "postgres" ||
    connectionType === "postgresql" ||
    (!connectionType && Boolean(dbUrl)));

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
  comments,
  commentLikes,
  commentReports,
  schedules,
  schedulesRelations,
  trendingStats,
  trendingStatsRelations,
} = activeSchema;

export { sqliteSchema, pgSchema };
