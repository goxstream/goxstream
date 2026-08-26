import type { AniListMedia } from "../anilist";
import type { GenreSeedData, StudioSeedData, AnimeGenreRelation, AnimeStudioRelation } from "./types";
import { slugify } from "./utils";

export function extractTaxonomies(
  media: AniListMedia,
  animeId: string,
  genreMap: Map<string, GenreSeedData>,
  studioMap: Map<string, StudioSeedData>
) {
  const animeGenres: AnimeGenreRelation[] = [];
  const animeStudios: AnimeStudioRelation[] = [];

  if (media.genres) {
    media.genres.forEach((gName) => {
      const gSlug = slugify(gName) || "genre";
      if (!genreMap.has(gSlug)) {
        genreMap.set(gSlug, {
          id: `genre-${gSlug}`,
          name: gName,
          slug: gSlug,
        });
      }
      animeGenres.push({
        animeId,
        genreId: genreMap.get(gSlug)!.id,
      });
    });
  }

  if (media.studios?.nodes) {
    media.studios.nodes.forEach((studio) => {
      const sSlug = slugify(studio.name) || "studio";
      if (!studioMap.has(sSlug)) {
        studioMap.set(sSlug, {
          id: `studio-${sSlug}`,
          name: studio.name,
          slug: sSlug,
        });
      }
      animeStudios.push({
        animeId,
        studioId: studioMap.get(sSlug)!.id,
      });
    });
  }

  return { animeGenres, animeStudios };
}
