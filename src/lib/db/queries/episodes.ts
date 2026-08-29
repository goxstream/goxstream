import { eq, desc, asc, and } from "drizzle-orm";
import { getDb } from "../index";
import { episodes, animes } from "../schema";
import { getAnimeBySlug } from "./anime";
import type { EpisodeItem, EpisodeWatchDetails } from "@/types/anime";
import { mapToEpisodeItem, mapToStreamSources } from "./episodes.mappers";

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

  const sources = mapToStreamSources(currentEpRaw.streamSources || [], currentEpRaw.id);

  return {
    anime,
    episode: currentEpisode,
    prevEpisode,
    nextEpisode,
    sources,
  };
}
