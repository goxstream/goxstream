import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  displayName: text("display_name").notNull(),
  avatarUrl: text("avatar_url"),
  bannerUrl: text("banner_url"),
  bio: text("bio"),
  role: text("role").notNull().$default(() => "user"),
  status: text("status").notNull().$default(() => "active"),
  membershipTier: text("membership_tier").notNull().$default(() => "free"),
  createdAt: timestamp("created_at")
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at")
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
  marketingEmails: boolean("marketing_emails").notNull().$default(() => false),
  publicWatchlist: boolean("public_watchlist").notNull().$default(() => true),
});

export const sessions = pgTable("sessions", {
  token: text("token").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at")
    .notNull()
    .$defaultFn(() => new Date()),
  userAgent: text("user_agent"),
  ipAddress: text("ip_address"),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  settings: one(userSettings, {
    fields: [users.id],
    references: [userSettings.userId],
  }),
  sessions: many(sessions),
}));

export const userSettingsRelations = relations(userSettings, ({ one }) => ({
  user: one(users, {
    fields: [userSettings.userId],
    references: [users.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));
