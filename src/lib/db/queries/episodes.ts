import { eq, desc, asc, and } from "drizzle-orm";
import { getDb } from "../index";
import { episodes, streamSources, animes } from "../schema";
import { getAnimeBySlug, mapToAnimeItem } from "./anime";
import type { EpisodeItem, EpisodeWatchDetails, StreamSource } from "@/types/anime";

export function mapToEpisodeItem(raw: any, animeSlug: string, animeTitle: string): EpisodeItem {
  const durationMin = raw.durationSeconds ? `${Math.floor(raw.durationSeconds / 60)} min` : "24 min";
  const dateStr = raw.airDate instanceof Date
    ? raw.airDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "Recently";

  return {
    id: raw.id,
    animeId: raw.animeId,
    animeSlug,
    animeTitle,
    episodeNumber: raw.number,
    episodeTitle: raw.title || `Episode ${raw.number}`,
    thumbnail: raw.thumbnail || "",
    duration: durationMin,
    releasedAt: dateStr,
    isSub: true,
    isDub: false,
  };
}

export async function getLatestEpisodes(limit = 10): Promise<EpisodeItem[]> {
  const db = await getDb();
  const rawEpisodes = await db.query.episodes.findMany({
    limit,
    orderBy: [desc(episodes.createdAt)],
    with: {
      anime: true,
    },
  });

  return rawEpisodes.map((ep: any) =>
    mapToEpisodeItem(
      ep,
      ep.anime?.slug || "",
      ep.anime?.titleEnglish || ep.anime?.titleRomaji || "Anime"
    )
  );
}

export async function getEpisodesByAnimeSlug(animeSlug: string): Promise<EpisodeItem[]> {
  const db = await getDb();
  const animeRecord = await db.query.animes.findFirst({
    where: eq(animes.slug, animeSlug),
  });

  if (!animeRecord) return [];

  const rawEpisodes = await db.query.episodes.findMany({
    where: eq(episodes.animeId, animeRecord.id),
    orderBy: [asc(episodes.number)],
  });

  const animeTitle = animeRecord.titleEnglish || animeRecord.titleRomaji || "Anime";
  return rawEpisodes.map((ep: any) => mapToEpisodeItem(ep, animeSlug, animeTitle));
}

export async function getEpisodeWatchDetails(
  animeSlug: string,
  episodeNumber: number
): Promise<EpisodeWatchDetails | null> {
  const db = await getDb();
  const anime = await getAnimeBySlug(animeSlug);
  if (!anime) return null;

  const animeRecord = await db.query.animes.findFirst({
    where: eq(animes.slug, animeSlug),
  });
  if (!animeRecord) return null;

  const currentEpRaw = await db.query.episodes.findFirst({
    where: and(
      eq(episodes.animeId, animeRecord.id),
      eq(episodes.number, episodeNumber)
    ),
    with: {
      streamSources: true,
    },
  });

  if (!currentEpRaw) return null;

  const allEpisodes = await db.query.episodes.findMany({
    where: eq(episodes.animeId, animeRecord.id),
    orderBy: [asc(episodes.number)],
  });

  const animeTitle = anime.title;
  const currentEpisode = mapToEpisodeItem(currentEpRaw, animeSlug, animeTitle);

  const prevEpRaw = allEpisodes.find((ep: any) => ep.number === episodeNumber - 1);
  const nextEpRaw = allEpisodes.find((ep: any) => ep.number === episodeNumber + 1);

  const prevEpisode = prevEpRaw ? mapToEpisodeItem(prevEpRaw, animeSlug, animeTitle) : undefined;
  const nextEpisode = nextEpRaw ? mapToEpisodeItem(nextEpRaw, animeSlug, animeTitle) : undefined;

  const sources: StreamSource[] = (currentEpRaw.streamSources || []).map((ss: any) => ({
    id: ss.id,
    serverName: ss.serverName || "Default Server",
    quality: ss.quality || "1080p",
    url: ss.streamUrl,
    type: (ss.format as StreamSource["type"]) || "hls",
    isPrimary: Boolean(ss.isPrimary),
    qualityUrls: {
      url1080p: ss.url1080p || undefined,
      url720p: ss.url720p || undefined,
      url480p: ss.url480p || undefined,
      url360p: ss.url360p || undefined,
    },
  }));

  // Fallback demo stream if no stream sources populated
  if (sources.length === 0) {
    sources.push({
      id: `fallback-${currentEpRaw.id}`,
      serverName: "GoxStream CDN Alpha",
      quality: "1080p",
      url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
      type: "hls",
      isPrimary: true,
    });
  }

  return {
    anime,
    episode: currentEpisode,
    prevEpisode,
    nextEpisode,
    sources,
  };
}
