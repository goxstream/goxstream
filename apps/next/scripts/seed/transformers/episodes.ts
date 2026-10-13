import type { AniListMedia } from "../anilist";
import type {
  EpisodeSeedData,
  StreamSourceSeedData,
  SubtitleTrackSeedData,
  AudioTrackSeedData,
} from "./types";
import { SAMPLE_HLS_STREAMS } from "./utils";

export function generateEpisodesAndMedia(
  media: AniListMedia,
  animeId: string,
  idx: number
) {
  const episodes: EpisodeSeedData[] = [];
  const streamSources: StreamSourceSeedData[] = [];
  const subtitleTracks: SubtitleTrackSeedData[] = [];
  const audioTracks: AudioTrackSeedData[] = [];

  const totalEp = media.episodes && media.episodes > 0 ? media.episodes : 12;
  const epToGenerate = Math.min(totalEp, 24);
  const streamUrl = SAMPLE_HLS_STREAMS[idx % SAMPLE_HLS_STREAMS.length];
  const epDurationSeconds = (media.duration || 24) * 60;

  for (let epNum = 1; epNum <= epToGenerate; epNum++) {
    const episodeId = `ep-${media.id}-${epNum}`;

    episodes.push({
      id: episodeId,
      animeId,
      number: epNum,
      title: `Episode ${epNum}`,
      durationSeconds: epDurationSeconds,
      thumbnail: media.bannerImage || media.coverImage.large || null,
      airDate: new Date(Date.now() - (epToGenerate - epNum) * 7 * 24 * 60 * 60 * 1000),
      status: "published",
      viewsCount: Math.floor(Math.random() * 50000) + 1000,
      isVip: epNum > 3,
      createdAt: new Date(),
    });

    streamSources.push({
      id: `stream-${episodeId}-primary`,
      episodeId,
      serverName: "Main Server",
      streamUrl,
      format: "hls",
      quality: "1080p",
      url1080p: streamUrl,
      url720p: streamUrl,
      url480p: streamUrl,
      url360p: streamUrl,
      isPrimary: true,
    });

    subtitleTracks.push(
      {
        id: `sub-${episodeId}-id`,
        episodeId,
        label: "Indonesian",
        languageCode: "id",
        fileUrl: "https://goxstream.com/subtitles/sample-id.vtt",
        format: "vtt",
        isDefault: true,
      },
      {
        id: `sub-${episodeId}-en`,
        episodeId,
        label: "English",
        languageCode: "en",
        fileUrl: "https://goxstream.com/subtitles/sample-en.vtt",
        format: "vtt",
        isDefault: false,
      }
    );

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

  return { episodes, streamSources, subtitleTracks, audioTracks, epToGenerate };
}
