import { sqliteTable, text, integer, real, index, uniqueIndex } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { users } from "./auth";
import { animes } from "./anime";
import { episodes } from "./episodes";

export const watchlists = sqliteTable(
  "watchlists",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    animeId: text("anime_id")
      .notNull()
      .references(() => animes.id, { onDelete: "cascade" }),
    status: text("status")
      .notNull()
      .$default(() => "plan_to_watch"),
    isFavorite: integer("is_favorite", { mode: "boolean" })
      .notNull()
      .$default(() => false),
    currentEpisode: integer("current_episode")
      .notNull()
      .$default(() => 0),
    userRating: real("user_rating"),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (t) => [uniqueIndex("uidx_watchlist_user_anime").on(t.userId, t.animeId)],
);

export const watchHistories = sqliteTable(
  "watch_histories",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
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
    progressPercent: real("progress_percent")
      .notNull()
      .$default(() => 0),
    durationSeconds: integer("duration_seconds")
      .notNull()
      .$default(() => 0),
    progressSeconds: integer("progress_seconds")
      .notNull()
      .$default(() => 0),
    lastWatchedAt: integer("last_watched_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (t) => [
    uniqueIndex("uidx_history_user_episode").on(t.userId, t.episodeId),
    index("idx_watch_histories_user_last").on(t.userId, t.lastWatchedAt),
  ],
);

export const userSettings = sqliteTable("user_settings", {
  userId: text("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  defaultQuality: text("default_quality")
    .notNull()
    .$default(() => "1080p"),
  defaultSubtitle: text("default_subtitle")
    .notNull()
    .$default(() => "indonesia"),
  autoPlayNext: integer("auto_play_next", { mode: "boolean" })
    .notNull()
    .$default(() => true),
  autoSkipIntro: integer("auto_skip_intro", { mode: "boolean" })
    .notNull()
    .$default(() => false),
  preferredAudio: text("preferred_audio")
    .notNull()
    .$default(() => "japanese"),
  newEpisodeAlerts: integer("new_episode_alerts", { mode: "boolean" })
    .notNull()
    .$default(() => true),
  watchlistUpdates: integer("watchlist_updates", { mode: "boolean" })
    .notNull()
    .$default(() => true),
  marketingEmails: integer("marketing_emails", { mode: "boolean" })
    .notNull()
    .$default(() => false),
  publicWatchlist: integer("public_watchlist", { mode: "boolean" })
    .notNull()
    .$default(() => true),
});

// ── Drizzle Relations ─────────────────────────────────────────────────

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

export const userSettingsRelations = relations(userSettings, ({ one }) => ({
  user: one(users, {
    fields: [userSettings.userId],
    references: [users.id],
  }),
}));
