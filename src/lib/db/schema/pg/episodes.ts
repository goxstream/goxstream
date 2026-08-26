import { pgTable, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { animes } from "./anime";

export const episodes = pgTable("episodes", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  animeId: text("anime_id")
    .notNull()
    .references(() => animes.id, { onDelete: "cascade" }),
  number: integer("number").notNull(),
  title: text("title").notNull(),
  durationSeconds: integer("duration_seconds").notNull().$default(() => 1440),
  thumbnail: text("thumbnail"),
  airDate: timestamp("air_date"),
  status: text("status").notNull().$default(() => "published"),
  viewsCount: integer("views_count").notNull().$default(() => 0),
  isVip: boolean("is_vip").notNull().$default(() => false),
  createdAt: timestamp("created_at")
    .notNull()
    .$defaultFn(() => new Date()),
});

export const serverNodes = pgTable("server_nodes", {
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
  isPrimary: boolean("is_primary").notNull().$default(() => false),
});

export const streamSources = pgTable("stream_sources", {
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
  isPrimary: boolean("is_primary").notNull().$default(() => false),
});

export const subtitleTracks = pgTable("subtitle_tracks", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  episodeId: text("episode_id")
    .notNull()
    .references(() => episodes.id, { onDelete: "cascade" }),
  label: text("label").notNull(),
  languageCode: text("language_code").notNull(),
  fileUrl: text("file_url").notNull(),
  format: text("format").notNull().$default(() => "vtt"),
  isDefault: boolean("is_default").notNull().$default(() => false),
});

export const audioTracks = pgTable("audio_tracks", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  episodeId: text("episode_id")
    .notNull()
    .references(() => episodes.id, { onDelete: "cascade" }),
  label: text("label").notNull(),
  languageCode: text("language_code").notNull(),
  audioUrl: text("audio_url").notNull(),
  type: text("type").notNull().$default(() => "original"),
  isDefault: boolean("is_default").notNull().$default(() => false),
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
