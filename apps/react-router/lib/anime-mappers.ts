import type { V1AnimeGet200ResponseDataInner } from "@shionstream/shionstream-sdk";
import type { V1AnimeSlugGet200ResponseData } from "@shionstream/shionstream-sdk";
import type { V1AnimeSlugEpisodesGet200ResponseDataInner } from "@shionstream/shionstream-sdk";
import type { V1EpisodesIdStreamGet200ResponseSourcesInner } from "@shionstream/shionstream-sdk";
import type { AnimeItem, EpisodeItem, StreamSource } from "@/types/anime";

/**
 * Normalizes anime status string from API to the UI union type.
 */
function toAnimeStatus(status: string): AnimeItem["status"] {
  switch (status) {
    case "ongoing":
      return "Ongoing";
    case "completed":
      return "Completed";
    default:
      return "Upcoming";
  }
}

/**
 * Normalizes anime type string from API to the UI union type.
 */
function toAnimeType(type: string): AnimeItem["type"] {
  const upper = type?.toUpperCase() || "TV";
  if (upper === "MOVIE") return "Movie";
  if (upper === "OVA") return "OVA";
  return "TV";
}

/**
 * Normalizes subOrDub string from API to the UI union type.
 */
function toSubOrDub(value: string): AnimeItem["subOrDub"] {
  const upper = value?.toUpperCase() || "SUB";
  if (upper.includes("DUB") && upper.includes("SUB")) return "SUB & DUB";
  if (upper.includes("DUB")) return "DUB";
  return "SUB";
}

/**
 * Maps an anime list item from the SDK catalog response to the UI AnimeItem.
 * Used for /v1/anime endpoints (no genres/studios objects — only flat fields).
 */
export function mapCatalogAnimeToItem(a: V1AnimeGet200ResponseDataInner): AnimeItem {
  return {
    id: a.id,
    slug: a.slug,
    title: a.titleRomaji || a.titleEnglish || "Untitled Anime",
    japaneseTitle: a.titleJapanese,
    synopsis: a.synopsis || "",
    coverImage: a.coverImage || "",
    bannerImage: a.bannerImage || a.coverImage,
    rating: a.rating ?? 0,
    episodesCount: a.episodesCount ?? 0,
    latestEpisode: a.episodesCount ?? 0,
    status: toAnimeStatus(a.status),
    type: toAnimeType(a.type),
    season: a.seasonName || "",
    year: a.seasonYear ?? 2026,
    genres: [],
    studio: "Studio",
    isTrending: a.isTrending,
    isFeatured: a.isFeatured,
    subOrDub: toSubOrDub(a.subOrDub),
  };
}

/**
 * Maps an anime detail from the SDK slug response to the UI AnimeItem.
 * The detail endpoint includes structured genres[] and studios[] arrays.
 */
export function mapDetailAnimeToItem(a: V1AnimeSlugGet200ResponseData): AnimeItem {
  return {
    id: a.id,
    slug: a.slug,
    title: a.titleRomaji || a.titleEnglish || "Untitled Anime",
    japaneseTitle: a.titleJapanese,
    synopsis: a.synopsis || "",
    coverImage: a.coverImage || "",
    bannerImage: a.bannerImage || a.coverImage,
    rating: a.rating ?? 0,
    episodesCount: a.episodesCount ?? 0,
    latestEpisode: a.episodesCount ?? 0,
    status: toAnimeStatus(a.status),
    type: toAnimeType(a.type),
    season: a.seasonName || "",
    year: a.seasonYear ?? 2026,
    genres: a.genres.map((g) => g.name),
    studio: a.studios.map((s) => s.name).join(", ") || "Studio",
    isTrending: a.isTrending,
    isFeatured: a.isFeatured,
    subOrDub: toSubOrDub(a.subOrDub),
  };
}

/**
 * Maps an episode from the SDK episodes response to the UI EpisodeItem.
 */
export function mapSdkEpisodeToItem(
  ep: V1AnimeSlugEpisodesGet200ResponseDataInner,
  anime: { id: string; slug: string; title: string; coverImage?: string },
): EpisodeItem {
  return {
    id: ep.id,
    animeId: anime.id,
    animeSlug: anime.slug,
    animeTitle: anime.title,
    episodeNumber: ep.number,
    episodeTitle: ep.title || `Episode ${ep.number}`,
    thumbnail: ep.thumbnail || anime.coverImage || "",
    duration: `${Math.round((ep.durationSeconds || 1440) / 60)}m`,
    releasedAt: ep.airDate || ep.createdAt || "",
    isSub: true,
    isDub: false,
  };
}

/**
 * Maps a stream source from the SDK stream response to the UI StreamSource.
 */
export function mapSdkStreamSource(
  s: V1EpisodesIdStreamGet200ResponseSourcesInner,
): StreamSource {
  return {
    id: s.id,
    serverName: s.serverName || "Primary Stream",
    quality: s.quality || "1080p",
    url: s.streamUrl,
    type: s.format === "hls" ? "hls" : "mp4",
    isPrimary: s.isPrimary,
    qualityUrls: {
      url1080p: s.url1080p || undefined,
      url720p: s.url720p || undefined,
      url480p: s.url480p || undefined,
      url360p: s.url360p || undefined,
    },
  };
}
