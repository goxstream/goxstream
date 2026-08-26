import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { users } from "./users";
import { animes } from "./anime";
import { episodes } from "./episodes";

export const watchlists = sqliteTable("watchlists", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  animeId: text("anime_id")
    .notNull()
    .references(() => animes.id, { onDelete: "cascade" }),
  status: text("status").notNull().$default(() => "plan_to_watch"),
  isFavorite: integer("is_favorite", { mode: "boolean" }).notNull().$default(() => false),
  currentEpisode: integer("current_episode").notNull().$default(() => 0),
  userRating: real("user_rating"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const watchHistories = sqliteTable("watch_histories", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  animeId: text("anime_id")
    .notNull()
    .references(() => animes.id, { onDelete: "cascade" }),
  episodeId: text("episode_id")
    .notNull()
    .references(() => episodes.id, { onDelete: "cascade" }),
  episodeNumber: integer("episode_number"),
  progressPercent: real("progress_percent").notNull().$default(() => 0),
  durationSeconds: integer("duration_seconds").notNull().$default(() => 0),
  progressSeconds: integer("progress_seconds").notNull().$default(() => 0),
  lastWatchedAt: integer("last_watched_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const watchlistsRelations = relations(watchlists, ({ one }) => ({
  user: one(users, {
    fields: [watchlists.userId],
    references: [users.id],
  }),
  anime: one(animes, {
    fields: [watchlists.animeId],
    references: [animes.id],
  }),
}));

export const watchHistoriesRelations = relations(watchHistories, ({ one }) => ({
  user: one(users, {
    fields: [watchHistories.userId],
    references: [users.id],
  }),
  anime: one(animes, {
    fields: [watchHistories.animeId],
    references: [animes.id],
  }),
  episode: one(episodes, {
    fields: [watchHistories.episodeId],
    references: [episodes.id],
  }),
}));
