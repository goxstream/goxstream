export type EpisodeStatus = "published" | "draft" | "scheduled" | "processing";

export type StreamQuality = "1080p" | "720p" | "480p" | "360p" | "auto";

export type ServerType = "hls" | "mp4" | "embed" | "dash";

export type ServerHealth = "online" | "degraded" | "offline";

export interface QualityUrls {
  url1080p?: string;
  url720p?: string;
  url480p?: string;
  url360p?: string;
}

export interface VideoServerSource {
  id: string;
  name: string;
  type: ServerType;
  quality: StreamQuality;
  url: string;
  qualityUrls?: QualityUrls;
  isPrimary: boolean;
  health: ServerHealth;
  latencyMs: number;
}

export interface SubtitleTrack {
  id: string;
  language: string;
  label: string;
  code: string; // ISO 639-1 e.g. "id", "en", "ja"
  url: string;
  isDefault: boolean;
  format: "vtt" | "srt" | "ass";
}

export interface AudioTrack {
  id: string;
  language: string;
  label: string;
  type: "original" | "dub" | "commentary";
  isDefault: boolean;
}

export interface EpisodeItem {
  id: string;
  animeId: string;
  animeTitle: string;
  animeSlug: string;
  episodeNumber: number;
  title: string;
  thumbnail: string;
  duration: string; // e.g. "24:15"
  airDate: string; // ISO date string
  status: EpisodeStatus;
  viewsCount: number;
  servers: VideoServerSource[];
  subtitles: SubtitleTrack[];
  audioTracks: AudioTrack[];
  isVip: boolean;
}

export interface EpisodeFilterState {
  search: string;
  animeId: string;
  status: string; // "all" | EpisodeStatus
  serverStatus: string; // "all" | "online" | "degraded" | "offline"
  sortBy: "newest" | "oldest" | "views" | "number";
}

export interface EpisodeStats {
  totalEpisodes: number;
  publishedEpisodes: number;
  draftEpisodes: number;
  serverIssues: number;
  totalViews: number;
}

export interface ServerNode {
  id: string;
  name: string;
  region: string;
  provider: string; // e.g. "Cloudflare R2", "BunnyCDN", "MegaStream"
  endpoint: string;
  status: ServerHealth;
  latencyMs: number;
  activeConnections: number;
  bandwidthUsageGbps: number;
  totalCapacityGbps: number;
  isPrimary: boolean;
}

export interface SubtitleCoverageItem {
  animeId: string;
  animeTitle: string;
  totalEpisodes: number;
  subtitlesCount: {
    id: number; // Indonesian
    en: number; // English
    ja: number; // Japanese
  };
  missingCount: number;
}
