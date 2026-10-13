import type { WatchlistItem, WatchHistoryItem } from "@/types/user";
import type { AnimeItem } from "@/types/anime";

/**
 * Maps raw database watchlist record with relations into WatchlistItem UI format
 */
export function mapToWatchlistItem(w: any): WatchlistItem {
  const anime: AnimeItem = {
    id: w.anime?.id || w.animeId,
    title: w.anime?.titleEnglish || w.anime?.titleRomaji || "Anime",
    slug: w.anime?.slug || "anime",
    coverImage: w.anime?.coverImage || "",
    bannerImage: w.anime?.bannerImage || undefined,
    type: (w.anime?.type as AnimeItem["type"]) || "TV",
    genres: ["Action", "Fantasy"],
    synopsis: w.anime?.synopsis || "",
    rating: typeof w.anime?.rating === "number" ? w.anime.rating : 0,
    episodesCount: w.anime?.episodesCount || 12,
    status: (w.anime?.status as AnimeItem["status"]) || "Ongoing",
    season: w.anime?.seasonName || "Spring",
    year: w.anime?.seasonYear || 2026,
    studio: "Unknown Studio",
    subOrDub: (w.anime?.subOrDub as AnimeItem["subOrDub"]) || "SUB",
  };

  return {
    id: w.id,
    anime,
    status: (w.status as WatchlistItem["status"]) || "watching",
    currentEpisode: w.currentEpisode || 1,
    totalEpisodes: w.anime?.episodesCount || 12,
    isFavorite: Boolean(w.isFavorite),
    rating: w.rating || 0,
    updatedAt: w.updatedAt ? new Date(w.updatedAt).toISOString() : new Date().toISOString(),
  };
}

/**
 * Maps raw database watch history record with relations into WatchHistoryItem UI format
 */
export function mapToWatchHistoryItem(h: any): WatchHistoryItem {
  const duration = h.durationSeconds || 1440;
  const progressPercent = h.durationSeconds
    ? Math.min(100, Math.round((h.progressSeconds / duration) * 100))
    : h.progressPercent || 0;

  const lastWatchedAtStr = h.lastWatchedAt
    ? new Date(h.lastWatchedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : "Today";

  const epNum = h.episode?.episodeNumber || h.episodeNumber || 1;

  return {
    id: h.id,
    animeId: h.animeId,
    animeTitle: h.anime?.titleEnglish || h.anime?.titleRomaji || "Anime",
    animeSlug: h.anime?.slug || "anime",
    animeCover: h.anime?.coverImage || "",
    episodeNumber: epNum,
    episodeTitle: h.episode?.title || `Episode ${epNum}`,
    watchedSeconds: h.progressSeconds || 0,
    durationSeconds: duration,
    progressPercent,
    lastWatchedAt: lastWatchedAtStr,
  };
}
