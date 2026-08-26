import { pgTable, text, integer, real, timestamp, boolean, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const animes = pgTable("animes", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  slug: text("slug").notNull().unique(),
  titleRomaji: text("title_romaji").notNull(),
  titleEnglish: text("title_english"),
  titleJapanese: text("title_japanese"),
  synopsis: text("synopsis"),
  coverImage: text("cover_image"),
  bannerImage: text("banner_image"),
  type: text("type").notNull().$default(() => "TV"),
  status: text("status").notNull().$default(() => "Ongoing"),
  seasonName: text("season_name"),
  seasonYear: integer("season_year"),
  rating: real("rating").$default(() => 0),
  isFeatured: boolean("is_featured").notNull().$default(() => false),
  isTrending: boolean("is_trending").notNull().$default(() => false),
  subOrDub: text("sub_or_dub").notNull().$default(() => "SUB"),
  createdAt: timestamp("created_at")
    .notNull()
    .$defaultFn(() => new Date()),
});

export const genres = pgTable("genres", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
});

export const animeGenres = pgTable(
  "anime_genres",
  {
    animeId: text("anime_id")
      .notNull()
      .references(() => animes.id, { onDelete: "cascade" }),
    genreId: text("genre_id")
      .notNull()
      .references(() => genres.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.animeId, t.genreId] })]
);

export const studios = pgTable("studios", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
});

export const animeStudios = pgTable(
  "anime_studios",
  {
    animeId: text("anime_id")
      .notNull()
      .references(() => animes.id, { onDelete: "cascade" }),
    studioId: text("studio_id")
      .notNull()
      .references(() => studios.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.animeId, t.studioId] })]
);

export const schedules = pgTable("schedules", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  animeId: text("anime_id")
    .notNull()
    .references(() => animes.id, { onDelete: "cascade" }),
  releaseDay: text("release_day").notNull(),
  releaseTime: text("release_time").notNull(),
  timezone: text("timezone").notNull().$default(() => "UTC"),
});

export const trendingStats = pgTable("trending_stats", {
  animeId: text("anime_id")
    .primaryKey()
    .references(() => animes.id, { onDelete: "cascade" }),
  viewsToday: integer("views_today").notNull().$default(() => 0),
  viewsThisWeek: integer("views_this_week").notNull().$default(() => 0),
  rank: integer("rank").notNull().$default(() => 0),
});

export const animesRelations = relations(animes, ({ many, one }) => ({
  animeGenres: many(animeGenres),
  animeStudios: many(animeStudios),
  schedules: many(schedules),
  trendingStats: one(trendingStats, {
    fields: [animes.id],
    references: [trendingStats.animeId],
  }),
}));

export const genresRelations = relations(genres, ({ many }) => ({
  animeGenres: many(animeGenres),
}));

export const animeGenresRelations = relations(animeGenres, ({ one }) => ({
  anime: one(animes, {
    fields: [animeGenres.animeId],
    references: [animes.id],
  }),
  genre: one(genres, {
    fields: [animeGenres.genreId],
    references: [genres.id],
  }),
}));

export const studiosRelations = relations(studios, ({ many }) => ({
  animeStudios: many(animeStudios),
}));

export const animeStudiosRelations = relations(animeStudios, ({ one }) => ({
  anime: one(animes, {
    fields: [animeStudios.animeId],
    references: [animes.id],
  }),
  studio: one(studios, {
    fields: [animeStudios.studioId],
    references: [studios.id],
  }),
}));

export const schedulesRelations = relations(schedules, ({ one }) => ({
  anime: one(animes, {
    fields: [schedules.animeId],
    references: [animes.id],
  }),
}));

export const trendingStatsRelations = relations(trendingStats, ({ one }) => ({
  anime: one(animes, {
    fields: [trendingStats.animeId],
    references: [animes.id],
  }),
}));
