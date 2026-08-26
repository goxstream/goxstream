import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  displayName: text("display_name").notNull(),
  role: text("role").notNull().$default(() => "user"),
  status: text("status").notNull().$default(() => "active"),
  membershipTier: text("membership_tier").notNull().$default(() => "free"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  lastActiveAt: integer("last_active_at", { mode: "timestamp" }),
});

export const userSettings = sqliteTable("user_settings", {
  userId: text("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  defaultQuality: text("default_quality").notNull().$default(() => "1080p"),
  defaultSubtitle: text("default_subtitle").notNull().$default(() => "indonesia"),
  autoPlayNext: integer("auto_play_next", { mode: "boolean" }).notNull().$default(() => true),
  autoSkipIntro: integer("auto_skip_intro", { mode: "boolean" }).notNull().$default(() => false),
  preferredAudio: text("preferred_audio").notNull().$default(() => "japanese"),
  newEpisodeAlerts: integer("new_episode_alerts", { mode: "boolean" }).notNull().$default(() => true),
  watchlistUpdates: integer("watchlist_updates", { mode: "boolean" }).notNull().$default(() => true),
});

export const usersRelations = relations(users, ({ one }) => ({
  settings: one(userSettings, {
    fields: [users.id],
    references: [userSettings.userId],
  }),
}));

export const userSettingsRelations = relations(userSettings, ({ one }) => ({
  user: one(users, {
    fields: [userSettings.userId],
    references: [users.id],
  }),
}));
