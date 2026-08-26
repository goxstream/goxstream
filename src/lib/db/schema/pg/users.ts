import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  displayName: text("display_name").notNull(),
  role: text("role").notNull().$default(() => "user"),
  status: text("status").notNull().$default(() => "active"),
  membershipTier: text("membership_tier").notNull().$default(() => "free"),
  createdAt: timestamp("created_at")
    .notNull()
    .$defaultFn(() => new Date()),
  lastActiveAt: timestamp("last_active_at"),
});

export const userSettings = pgTable("user_settings", {
  userId: text("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  defaultQuality: text("default_quality").notNull().$default(() => "1080p"),
  defaultSubtitle: text("default_subtitle").notNull().$default(() => "indonesia"),
  autoPlayNext: boolean("auto_play_next").notNull().$default(() => true),
  autoSkipIntro: boolean("auto_skip_intro").notNull().$default(() => false),
  preferredAudio: text("preferred_audio").notNull().$default(() => "japanese"),
  newEpisodeAlerts: boolean("new_episode_alerts").notNull().$default(() => true),
  watchlistUpdates: boolean("watchlist_updates").notNull().$default(() => true),
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
