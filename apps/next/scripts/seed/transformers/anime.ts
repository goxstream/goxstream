import type { AniListMedia } from "../anilist";
import type { AnimeSeedData } from "./types";
import { slugify, stripHtml, capitalize, mapFormat, mapStatus } from "./utils";

export function transformAnimeEntity(
  media: AniListMedia,
  idx: number,
  usedAnimeSlugs: Set<string>
): AnimeSeedData {
  const animeId = `anime-${media.id}`;
  const titleRomaji = media.title.romaji || media.title.userPreferred || "Unknown Title";
  const baseSlug = slugify(titleRomaji) || `anime-${media.id}`;
  
  let slug = baseSlug;
  if (usedAnimeSlugs.has(slug)) {
    slug = `${baseSlug}-${media.id}`;
  }
  usedAnimeSlugs.add(slug);

  const totalEp = media.episodes && media.episodes > 0 ? media.episodes : 12;
  const rating = media.averageScore ? Number((media.averageScore / 10).toFixed(1)) : 8.0;

  return {
    id: animeId,
    slug,
    titleRomaji,
    titleEnglish: media.title.english || null,
    titleJapanese: media.title.native || null,
    synopsis: stripHtml(media.description),
    coverImage: media.coverImage.extraLarge || media.coverImage.large || null,
    bannerImage: media.bannerImage || media.coverImage.extraLarge || null,
    type: mapFormat(media.format),
    status: mapStatus(media.status),
    seasonName: capitalize(media.season),
    seasonYear: media.seasonYear || new Date().getFullYear(),
    episodesCount: totalEp,
    durationPerEp: `${media.duration || 24} min`,
    rating,
    isFeatured: idx < 5,
    isTrending: (media.trending ?? 0) > 0 || idx < 10,
    subOrDub: "SUB",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
