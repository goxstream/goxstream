import type { EpisodeItem, StreamSource } from "@/types/anime";

/**
 * Maps raw database episode record with parent relations into EpisodeItem UI format
 */
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

/**
 * Maps raw stream sources records and appends CDN fallback if empty
 */
export function mapToStreamSources(rawSources: any[], episodeId: string): StreamSource[] {
  const sources: StreamSource[] = (rawSources || []).map((ss: any) => ({
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

  return sources;
}
