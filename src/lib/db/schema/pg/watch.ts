import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";
import { animes } from "./anime";
import { episodes } from "./episodes";

export const watchlists = pgTable("watchlists", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  animeId: text("anime_id")
    .notNull()
    .references(() => animes.id, { onDelete: "cascade" }),
  status: text("status").notNull().$default(() => "plan_to_watch"),
  createdAt: timestamp("created_at")
    .notNull()
    .$defaultFn(() => new Date()),
});

export const watchHistories = pgTable("watch_histories", {
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
  progressSeconds: integer("progress_seconds").notNull().$default(() => 0),
  lastWatchedAt: timestamp("last_watched_at")
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
