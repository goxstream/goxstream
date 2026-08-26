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
});

export const serverNodes = pgTable("server_nodes", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  quality: text("quality").notNull().$default(() => "1080p"),
  priority: integer("priority").notNull().$default(() => 1),
  status: text("status").notNull().$default(() => "online"),
});

export const streamSources = pgTable("stream_sources", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  episodeId: text("episode_id")
    .notNull()
    .references(() => episodes.id, { onDelete: "cascade" }),
  serverNodeId: text("server_node_id")
    .notNull()
    .references(() => serverNodes.id, { onDelete: "cascade" }),
  streamUrl: text("stream_url").notNull(),
  format: text("format").notNull().$default(() => "hls"),
  quality: text("quality").notNull().$default(() => "1080p"),
});

export const subtitleTracks = pgTable("subtitle_tracks", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  episodeId: text("episode_id")
    .notNull()
    .references(() => episodes.id, { onDelete: "cascade" }),
  label: text("label").notNull(),
  languageCode: text("language_code").notNull(),
  fileUrl: text("file_url").notNull(),
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
