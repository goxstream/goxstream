import type { AniListMedia } from "./anilist";

export interface AnimeSeedData {
  id: string;
  slug: string;
  titleRomaji: string;
  titleEnglish: string | null;
  titleJapanese: string | null;
  synopsis: string | null;
  coverImage: string | null;
  bannerImage: string | null;
  type: string;
  status: string;
  seasonName: string | null;
  seasonYear: number | null;
  episodesCount: number;
  durationPerEp: string | null;
  rating: number;
  isFeatured: boolean;
  isTrending: boolean;
  subOrDub: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GenreSeedData {
  id: string;
  name: string;
  slug: string;
}

export interface StudioSeedData {
  id: string;
  name: string;
  slug: string;
}

export interface AnimeGenreRelation {
  animeId: string;
  genreId: string;
}

export interface AnimeStudioRelation {
  animeId: string;
  studioId: string;
}

export interface EpisodeSeedData {
  id: string;
  animeId: string;
  number: number;
  title: string;
  durationSeconds: number;
  thumbnail: string | null;
  airDate: Date | null;
  status: string;
  viewsCount: number;
  isVip: boolean;
  createdAt: Date;
}

export interface ServerNodeSeedData {
  id: string;
  name: string;
  region: string;
  provider: string;
  endpoint: string;
  quality: string;
  priority: number;
  status: string;
  healthStatus: string;
  latencyMs: number;
  isPrimary: boolean;
}

export interface StreamSourceSeedData {
  id: string;
  episodeId: string;
  serverNodeId: string;
  serverName: string;
  streamUrl: string;
  format: string;
  quality: string;
  url1080p: string | null;
  url720p: string | null;
  url480p: string | null;
  url360p: string | null;
  isPrimary: boolean;
}

export interface SubtitleTrackSeedData {
  id: string;
  episodeId: string;
  label: string;
  languageCode: string;
  fileUrl: string;
  format: string;
  isDefault: boolean;
}

export interface AudioTrackSeedData {
  id: string;
  episodeId: string;
  label: string;
  languageCode: string;
  audioUrl: string;
  type: string;
  isDefault: boolean;
}

export interface ScheduleSeedData {
  id: string;
  animeId: string;
  releaseDay: string;
  releaseTime: string;
  episodeNumber: number | null;
  status: string;
  timezone: string;
}

export interface TrendingStatSeedData {
  animeId: string;
  rank: number;
  previousRank: number;
  viewsToday: number;
  viewsThisWeek: number;
  weeklyViews: number;
  monthlyViews: number;
  totalViews: number;
  trendScore: number;
  updatedAt: Date;
}

export interface TransformedSeedBundle {
  animes: AnimeSeedData[];
  genres: GenreSeedData[];
  studios: StudioSeedData[];
  animeGenres: AnimeGenreRelation[];
  animeStudios: AnimeStudioRelation[];
  episodes: EpisodeSeedData[];
  serverNodes: ServerNodeSeedData[];
  streamSources: StreamSourceSeedData[];
  subtitleTracks: SubtitleTrackSeedData[];
  audioTracks: AudioTrackSeedData[];
  schedules: ScheduleSeedData[];
  trendingStats: TrendingStatSeedData[];
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function stripHtml(html: string | null): string | null {
  if (!html) return null;
  return html.replace(/<[^>]*>?/gm, "").trim();
}

function capitalize(text: string | null): string | null {
  if (!text) return null;
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

function mapStatus(status: string | null): string {
  switch (status?.toUpperCase()) {
    case "RELEASING":
      return "Ongoing";
    case "FINISHED":
      return "Completed";
    case "NOT_YET_RELEASED":
      return "Upcoming";
    case "CANCELLED":
    case "HIATUS":
      return "Completed";
    default:
      return "Ongoing";
  }
}

function mapFormat(format: string | null): string {
  switch (format?.toUpperCase()) {
    case "TV":
    case "TV_SHORT":
      return "TV";
    case "MOVIE":
      return "Movie";
    case "SPECIAL":
    case "OVA":
    case "ONA":
      return "OVA";
    default:
      return "TV";
  }
}

// Sample public HLS streams for testing video player functionality
const SAMPLE_HLS_STREAMS = [
  "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
  "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8",
  "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8",
];

export function transformAniListToEntities(mediaList: AniListMedia[]): TransformedSeedBundle {
  const genreMap = new Map<string, GenreSeedData>();
  const studioMap = new Map<string, StudioSeedData>();

  const animes: AnimeSeedData[] = [];
  const animeGenres: AnimeGenreRelation[] = [];
  const animeStudios: AnimeStudioRelation[] = [];
  const episodes: EpisodeSeedData[] = [];
  const streamSources: StreamSourceSeedData[] = [];
  const subtitleTracks: SubtitleTrackSeedData[] = [];
  const audioTracks: AudioTrackSeedData[] = [];
  const schedules: ScheduleSeedData[] = [];
  const trendingStats: TrendingStatSeedData[] = [];

  // Seed Server Nodes
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
    const animeId = `anime-${media.id}`;
    const titleRomaji = media.title.romaji || media.title.userPreferred || "Unknown Title";
    const rawSlug = slugify(titleRomaji);
    const slug = rawSlug ? rawSlug : `anime-${media.id}`;

    const totalEp = media.episodes && media.episodes > 0 ? media.episodes : 12;
    const epToGenerate = Math.min(totalEp, 24); // Limit generated episodes per anime to 24 for clean seeding

    const rating = media.averageScore ? Number((media.averageScore / 10).toFixed(1)) : 8.0;

    const anime: AnimeSeedData = {
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
      isFeatured: idx < 5, // Top 5 as featured
      isTrending: (media.trending ?? 0) > 0 || idx < 10,
      subOrDub: "SUB",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    animes.push(anime);

    // Process Genres
    if (media.genres) {
      media.genres.forEach((gName) => {
        const gSlug = slugify(gName);
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

    // Process Studios
    if (media.studios?.nodes) {
      media.studios.nodes.forEach((studio) => {
        const sSlug = slugify(studio.name);
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

    // Process Episodes
    const streamUrl = SAMPLE_HLS_STREAMS[idx % SAMPLE_HLS_STREAMS.length];
    const epDurationSeconds = (media.duration || 24) * 60;

    for (let epNum = 1; epNum <= epToGenerate; epNum++) {
      const episodeId = `ep-${media.id}-${epNum}`;
      const epTitle = `Episode ${epNum}`;

      const episode: EpisodeSeedData = {
        id: episodeId,
        animeId,
        number: epNum,
        title: epTitle,
        durationSeconds: epDurationSeconds,
        thumbnail: media.bannerImage || media.coverImage.large || null,
        airDate: new Date(Date.now() - (epToGenerate - epNum) * 7 * 24 * 60 * 60 * 1000),
        status: "published",
        viewsCount: Math.floor(Math.random() * 50000) + 1000,
        isVip: epNum > 3, // Episode 4+ VIP preview
        createdAt: new Date(),
      };
      episodes.push(episode);

      // Stream Source (Primary)
      streamSources.push({
        id: `stream-${episodeId}-primary`,
        episodeId,
        serverNodeId: primaryServerNode.id,
        serverName: primaryServerNode.name,
        streamUrl,
        format: "hls",
        quality: "1080p",
        url1080p: streamUrl,
        url720p: streamUrl,
        url480p: streamUrl,
        url360p: streamUrl,
        isPrimary: true,
      });

      // Subtitle Tracks
      subtitleTracks.push({
        id: `sub-${episodeId}-id`,
        episodeId,
        label: "Indonesian",
        languageCode: "id",
        fileUrl: "https://goxstream.com/subtitles/sample-id.vtt",
        format: "vtt",
        isDefault: true,
      });

      subtitleTracks.push({
        id: `sub-${episodeId}-en`,
        episodeId,
        label: "English",
        languageCode: "en",
        fileUrl: "https://goxstream.com/subtitles/sample-en.vtt",
        format: "vtt",
        isDefault: false,
      });

      // Audio Track
      audioTracks.push({
        id: `audio-${episodeId}-ja`,
        episodeId,
        label: "Japanese (Original)",
        languageCode: "ja",
        audioUrl: streamUrl,
        type: "original",
        isDefault: true,
      });
    }

    // Schedule (if ongoing or currently releasing)
    if (anime.status === "Ongoing") {
      const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
      const releaseDay = days[idx % days.length];
      const releaseTime = "18:00";

      schedules.push({
        id: `sched-${animeId}`,
        animeId,
        releaseDay,
        releaseTime,
        episodeNumber: epToGenerate + 1,
        status: "upcoming",
        timezone: "UTC",
      });
    }

    // Trending Stats
    const viewsToday = Math.floor(Math.random() * 12000) + 1500;
    const viewsThisWeek = viewsToday * 7;

    trendingStats.push({
      animeId,
      rank: idx + 1,
      previousRank: idx + 1 + (Math.floor(Math.random() * 5) - 2),
      viewsToday,
      viewsThisWeek,
      weeklyViews: viewsThisWeek,
      monthlyViews: viewsThisWeek * 4,
      totalViews: viewsThisWeek * 12,
      trendScore: Number((100 - idx * 4 + Math.random() * 3).toFixed(2)),
      updatedAt: new Date(),
    });
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
