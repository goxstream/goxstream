"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type {
  BasicEpisodeData,
  EpisodeFormContextType,
  VideoServerSource,
  SubtitleTrack,
  AudioTrack,
  EpisodeStatus,
} from "../types";

export function useEpisodeFormState(): EpisodeFormContextType {
  const router = useRouter();

  const [basicData, setBasicData] = useState<BasicEpisodeData>({
    animeId: "a-01",
    episodeNumber: "",
    title: "",
    duration: "24:00",
    airDate: new Date().toISOString().split("T")[0],
    thumbnail: "",
    synopsis: "",
    isVip: false,
  });

  const [servers, setServers] = useState<VideoServerSource[]>([
    {
      id: "srv-1",
      name: "Primary HLS Storage",
      type: "hls",
      quality: "1080p",
      url: "",
      isPrimary: true,
      health: "online",
      latencyMs: 35,
    },
  ]);

  const [subtitles, setSubtitles] = useState<SubtitleTrack[]>([
    {
      id: "sub-1",
      language: "Indonesian",
      label: "Bahasa Indonesia",
      code: "id",
      url: "",
      isDefault: true,
      format: "vtt",
    },
  ]);

  const [audioTracks, setAudioTracks] = useState<AudioTrack[]>([
    {
      id: "aud-1",
      language: "Japanese",
      label: "Japanese Original",
      type: "original",
      isDefault: true,
    },
  ]);

  const [status, setStatus] = useState<EpisodeStatus>("published");
  const [notifySubscribers, setNotifySubscribers] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const handleBasicChange = (key: string, value: string | boolean) => {
    setBasicData((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddServer = () => {
    setServers((prev) => [
      ...prev,
      {
        id: `srv-${Date.now()}`,
        name: `Backup Mirror ${prev.length + 1}`,
        type: "hls",
        quality: "720p",
        url: "",
        isPrimary: false,
        health: "online",
        latencyMs: 50,
      },
    ]);
  };

  const handleRemoveServer = (id: string) => {
    setServers((prev) => prev.filter((s) => s.id !== id));
  };

  const handleUpdateServer = (id: string, key: keyof VideoServerSource, value: any) => {
    setServers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [key]: value } : s))
    );
  };

  const handleAddSubtitle = () => {
    setSubtitles((prev) => [
      ...prev,
      {
        id: `sub-${Date.now()}`,
        language: "English",
        label: "English",
        code: "en",
        url: "",
        isDefault: false,
        format: "vtt",
      },
    ]);
  };

  const handleRemoveSubtitle = (id: string) => {
    setSubtitles((prev) => prev.filter((s) => s.id !== id));
  };

  const handleUpdateSubtitle = (id: string, key: keyof SubtitleTrack, value: any) => {
    setSubtitles((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [key]: value } : s))
    );
  };

  const handleAddAudio = () => {
    setAudioTracks((prev) => [
      ...prev,
      {
        id: `aud-${Date.now()}`,
        language: "English",
        label: "English Dub",
        type: "dub",
        isDefault: false,
      },
    ]);
  };

  const handleRemoveAudio = (id: string) => {
    setAudioTracks((prev) => prev.filter((a) => a.id !== id));
  };

  const handleUpdateAudio = (id: string, key: keyof AudioTrack, value: any) => {
    setAudioTracks((prev) =>
      prev.map((a) => (a.id === id ? { ...a, [key]: value } : a))
    );
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      router.push("/dashboard/episodes");
    }, 600);
  };

  return {
    basicData,
    handleBasicChange,
    servers,
    handleAddServer,
    handleRemoveServer,
    handleUpdateServer,
    subtitles,
    handleAddSubtitle,
    handleRemoveSubtitle,
    handleUpdateSubtitle,
    audioTracks,
    handleAddAudio,
    handleRemoveAudio,
    handleUpdateAudio,
    status,
    setStatus,
    notifySubscribers,
    setNotifySubscribers,
    isSaving,
    handleSave,
  };
}
