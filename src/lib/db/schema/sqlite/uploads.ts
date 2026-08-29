import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { episodes } from "./episodes";
import { users } from "./users";

export const episodeUploads = sqliteTable("episode_uploads", {
  episodeId: text("episode_id")
    .primaryKey()
    .references(() => episodes.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  uploadedAt: integer("uploaded_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const episodeUploadsRelations = relations(episodeUploads, ({ one }) => ({
  episode: one(episodes, {
    fields: [episodeUploads.episodeId],
    references: [episodes.id],
  }),
  user: one(users, {
    fields: [episodeUploads.userId],
    references: [users.id],
  }),
}));
