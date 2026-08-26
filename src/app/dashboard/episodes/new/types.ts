import type { VideoServerSource, SubtitleTrack, AudioTrack, EpisodeStatus, ServerType } from "../types";

export interface BasicEpisodeData {
  animeId: string;
  episodeNumber: string;
  title: string;
  duration: string;
  airDate: string;
  thumbnail: string;
  synopsis: string;
  isVip: boolean;
}

export interface EpisodeFormContextType {
  basicData: BasicEpisodeData;
  handleBasicChange: (key: keyof BasicEpisodeData | string, value: string | boolean) => void;
  servers: VideoServerSource[];
  handleAddServer: () => void;
  handleRemoveServer: (id: string) => void;
  handleUpdateServer: (id: string, key: keyof VideoServerSource, value: any) => void;
  subtitles: SubtitleTrack[];
  handleAddSubtitle: () => void;
  handleRemoveSubtitle: (id: string) => void;
  handleUpdateSubtitle: (id: string, key: keyof SubtitleTrack, value: any) => void;
  audioTracks: AudioTrack[];
  handleAddAudio: () => void;
  handleRemoveAudio: (id: string) => void;
  handleUpdateAudio: (id: string, key: keyof AudioTrack, value: any) => void;
  status: EpisodeStatus;
  setStatus: (status: EpisodeStatus) => void;
  notifySubscribers: boolean;
  setNotifySubscribers: (notify: boolean) => void;
  isSaving: boolean;
  handleSave: () => void;
}

export type { VideoServerSource, SubtitleTrack, AudioTrack, EpisodeStatus, ServerType };
