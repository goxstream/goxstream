import type { AniListMedia } from "../anilist";
import type {
  AnimeSeedData,
  GenreSeedData,
  StudioSeedData,
  AnimeGenreRelation,
  AnimeStudioRelation,
  EpisodeSeedData,
  ServerNodeSeedData,
  StreamSourceSeedData,
  SubtitleTrackSeedData,
  AudioTrackSeedData,
  ScheduleSeedData,
  TrendingStatSeedData,
  TransformedSeedBundle,
} from "./types";
import { transformAnimeEntity } from "./anime";
import { extractTaxonomies } from "./taxonomy";
import { generateEpisodesAndMedia } from "./episodes";
import { generateScheduleAndStats } from "./stats";

export * from "./types";
export * from "./utils";
export * from "./anime";
export * from "./taxonomy";
export * from "./episodes";
export * from "./stats";

export function transformAniListToEntities(mediaList: AniListMedia[]): TransformedSeedBundle {
  const genreMap = new Map<string, GenreSeedData>();
  const studioMap = new Map<string, StudioSeedData>();
  const usedAnimeSlugs = new Set<string>();

  const animes: AnimeSeedData[] = [];
  const animeGenres: AnimeGenreRelation[] = [];
  const animeStudios: AnimeStudioRelation[] = [];
  const episodes: EpisodeSeedData[] = [];
  const streamSources: StreamSourceSeedData[] = [];
  const subtitleTracks: SubtitleTrackSeedData[] = [];
  const audioTracks: AudioTrackSeedData[] = [];
  const schedules: ScheduleSeedData[] = [];
  const trendingStats: TrendingStatSeedData[] = [];

  const primaryServerNode: ServerNodeSeedData = {
    id: "sn-primary-alpha",
    name: "GoxStream CDN Alpha",
    region: "Asia-East (Singapore)",
    provider: "Cloudflare R2 CDN",
    endpoint: "https://cdn-alpha.goxstream.com",
    quality: "1080p",
    priority: 1,
    status: "online",
    healthStatus: "online",
    latencyMs: 18,
    isPrimary: true,
  };

  const backupServerNode: ServerNodeSeedData = {
    id: "sn-backup-beta",
    name: "GoxStream CDN Beta",
    region: "Asia-Southeast (Jakarta)",
    provider: "FastEdge CDN",
    endpoint: "https://cdn-beta.goxstream.com",
    quality: "720p",
    priority: 2,
    status: "online",
    healthStatus: "online",
    latencyMs: 25,
    isPrimary: false,
  };

  const serverNodes: ServerNodeSeedData[] = [primaryServerNode, backupServerNode];

  mediaList.forEach((media, idx) => {
    const anime = transformAnimeEntity(media, idx, usedAnimeSlugs);
    animes.push(anime);

    const { animeGenres: aGenres, animeStudios: aStudios } = extractTaxonomies(
      media,
      anime.id,
      genreMap,
      studioMap
    );
    animeGenres.push(...aGenres);
    animeStudios.push(...aStudios);

    const {
      episodes: eps,
      streamSources: streams,
      subtitleTracks: subs,
      audioTracks: audios,
      epToGenerate,
    } = generateEpisodesAndMedia(media, anime.id, idx, primaryServerNode);

    episodes.push(...eps);
    streamSources.push(...streams);
    subtitleTracks.push(...subs);
    audioTracks.push(...audios);

    const { schedule, trendingStat } = generateScheduleAndStats(
      anime.id,
      anime.status,
      idx,
      epToGenerate
    );

    if (schedule) schedules.push(schedule);
    trendingStats.push(trendingStat);
  });

  return {
    animes,
    genres: Array.from(genreMap.values()),
    studios: Array.from(studioMap.values()),
    animeGenres,
    animeStudios,
    episodes,
    serverNodes,
    streamSources,
    subtitleTracks,
    audioTracks,
    schedules,
    trendingStats,
  };
}
