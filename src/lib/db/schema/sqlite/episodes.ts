import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { animes } from "./anime";

export const episodes = sqliteTable("episodes", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  animeId: text("anime_id")
    .notNull()
    .references(() => animes.id, { onDelete: "cascade" }),
  number: integer("number").notNull(),
  title: text("title").notNull(),
  durationSeconds: integer("duration_seconds").notNull().$default(() => 1440),
  thumbnail: text("thumbnail"),
  airDate: integer("air_date", { mode: "timestamp" }),
  status: text("status").notNull().$default(() => "published"),
  viewsCount: integer("views_count").notNull().$default(() => 0),
  isVip: integer("is_vip", { mode: "boolean" }).notNull().$default(() => false),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const serverNodes = sqliteTable("server_nodes", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  region: text("region"),
  provider: text("provider"),
  endpoint: text("endpoint"),
  quality: text("quality").notNull().$default(() => "1080p"),
  priority: integer("priority").notNull().$default(() => 1),
  status: text("status").notNull().$default(() => "online"),
  healthStatus: text("health_status").notNull().$default(() => "online"),
  latencyMs: integer("latency_ms").notNull().$default(() => 0),
  isPrimary: integer("is_primary", { mode: "boolean" }).notNull().$default(() => false),
});

export const streamSources = sqliteTable("stream_sources", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  episodeId: text("episode_id")
    .notNull()
    .references(() => episodes.id, { onDelete: "cascade" }),
  serverNodeId: text("server_node_id")
    .notNull()
    .references(() => serverNodes.id, { onDelete: "cascade" }),
  serverName: text("server_name"),
  streamUrl: text("stream_url").notNull(),
  format: text("format").notNull().$default(() => "hls"),
  quality: text("quality").notNull().$default(() => "1080p"),
  url1080p: text("url_1080p"),
  url720p: text("url_720p"),
  url480p: text("url_480p"),
  url360p: text("url_360p"),
  isPrimary: integer("is_primary", { mode: "boolean" }).notNull().$default(() => false),
});

export const subtitleTracks = sqliteTable("subtitle_tracks", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  episodeId: text("episode_id")
    .notNull()
    .references(() => episodes.id, { onDelete: "cascade" }),
  label: text("label").notNull(),
  languageCode: text("language_code").notNull(),
  fileUrl: text("file_url").notNull(),
  format: text("format").notNull().$default(() => "vtt"),
  isDefault: integer("is_default", { mode: "boolean" }).notNull().$default(() => false),
});

export const audioTracks = sqliteTable("audio_tracks", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  episodeId: text("episode_id")
    .notNull()
    .references(() => episodes.id, { onDelete: "cascade" }),
  label: text("label").notNull(),
  languageCode: text("language_code").notNull(),
  audioUrl: text("audio_url").notNull(),
  type: text("type").notNull().$default(() => "original"),
  isDefault: integer("is_default", { mode: "boolean" }).notNull().$default(() => false),
});

export const episodesRelations = relations(episodes, ({ one, many }) => ({
  anime: one(animes, {
    fields: [episodes.animeId],
    references: [animes.id],
  }),
  streamSources: many(streamSources),
  subtitleTracks: many(subtitleTracks),
  audioTracks: many(audioTracks),
}));

export const serverNodesRelations = relations(serverNodes, ({ many }) => ({
  streamSources: many(streamSources),
}));

export const streamSourcesRelations = relations(streamSources, ({ one }) => ({
  episode: one(episodes, {
    fields: [streamSources.episodeId],
    references: [episodes.id],
  }),
  serverNode: one(serverNodes, {
    fields: [streamSources.serverNodeId],
    references: [serverNodes.id],
  }),
}));

export const subtitleTracksRelations = relations(subtitleTracks, ({ one }) => ({
  episode: one(episodes, {
    fields: [subtitleTracks.episodeId],
    references: [episodes.id],
  }),
}));

export const audioTracksRelations = relations(audioTracks, ({ one }) => ({
  episode: one(episodes, {
    fields: [audioTracks.episodeId],
    references: [episodes.id],
  }),
}));
