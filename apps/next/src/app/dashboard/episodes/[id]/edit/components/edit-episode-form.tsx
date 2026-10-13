"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BasicInfoStep } from "@/app/dashboard/episodes/new/components/basic-info-step";
import { VideoSourcesStep } from "@/app/dashboard/episodes/new/components/video-sources-step";
import { SubtitlesAudioStep } from "@/app/dashboard/episodes/new/components/subtitles-audio-step";
import { PublishScheduleStep } from "@/app/dashboard/episodes/new/components/publish-schedule-step";
import { EditEpisodeHeader } from "./edit-episode-header";
import type {
  EpisodeItem,
  VideoServerSource,
  SubtitleTrack,
  AudioTrack,
  EpisodeStatus,
} from "@/app/dashboard/episodes/types";
import type { BasicEpisodeData } from "@/app/dashboard/episodes/new/types";
import { FileText, Server, Globe, CheckCircle2 } from "lucide-react";

interface EditEpisodeFormProps {
  initialEpisode: EpisodeItem;
}

export function EditEpisodeForm({ initialEpisode }: EditEpisodeFormProps) {
  const router = useRouter();

  const [basicData, setBasicData] = useState<BasicEpisodeData>({
    animeId: initialEpisode.animeId || "a-01",
    episodeNumber: String(initialEpisode.episodeNumber),
    title: initialEpisode.title || "",
    duration: initialEpisode.duration || "24:00",
    airDate: initialEpisode.airDate || new Date().toISOString().split("T")[0],
    thumbnail: initialEpisode.thumbnail || "",
    synopsis: "Official streaming release for this episode.",
    isVip: initialEpisode.isVip || false,
  });

  const [servers, setServers] = useState<VideoServerSource[]>(
    initialEpisode.servers && initialEpisode.servers.length > 0
      ? initialEpisode.servers
      : [
          {
            id: "srv-1",
            name: "Cloudflare R2 Primary Edge",
            type: "hls",
            quality: "1080p",
            url: "https://cdn.goxstream.tv/hls/master.m3u8",
            isPrimary: true,
            health: "online",
            latencyMs: 38,
          },
        ]
  );

  const [subtitles, setSubtitles] = useState<SubtitleTrack[]>(
    initialEpisode.subtitles || []
  );

  const [audioTracks, setAudioTracks] = useState<AudioTrack[]>(
    initialEpisode.audioTracks || []
  );

  const [status, setStatus] = useState<EpisodeStatus>(initialEpisode.status || "published");
  const [notifySubscribers, setNotifySubscribers] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

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
        latencyMs: 45,
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

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this episode?")) {
      router.push("/dashboard/episodes");
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto min-w-0 p-4 sm:p-6">
      <EditEpisodeHeader
        episodeId={initialEpisode.id}
        episodeNumber={basicData.episodeNumber || initialEpisode.episodeNumber}
        title={basicData.title || initialEpisode.title}
        animeTitle={initialEpisode.animeTitle}
        status={status}
        isSaving={isSaving}
        viewsCount={initialEpisode.viewsCount}
        onSave={handleSave}
        onDelete={handleDelete}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full h-auto p-1 bg-muted/40 border border-border/60 rounded-xl">
          <TabsTrigger
            value="basic"
            className="flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-xs"
          >
            <FileText className="size-4" />
            <span>1. Basic Info</span>
          </TabsTrigger>
          <TabsTrigger
            value="sources"
            className="flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-xs"
          >
            <Server className="size-4" />
            <span>2. Video Sources</span>
          </TabsTrigger>
          <TabsTrigger
            value="subtitles"
            className="flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-xs"
          >
            <Globe className="size-4" />
            <span>3. Subtitles & Audio</span>
          </TabsTrigger>
          <TabsTrigger
            value="publish"
            className="flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-xs"
          >
            <CheckCircle2 className="size-4" />
            <span>4. Preview & Publish</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="mt-0 focus-visible:outline-none">
          <BasicInfoStep formData={basicData} onChange={handleBasicChange} />
        </TabsContent>

        <TabsContent value="sources" className="mt-0 focus-visible:outline-none">
          <VideoSourcesStep
            servers={servers}
            onAddServer={handleAddServer}
            onRemoveServer={handleRemoveServer}
            onUpdateServer={handleUpdateServer}
          />
        </TabsContent>

        <TabsContent value="subtitles" className="mt-0 focus-visible:outline-none">
          <SubtitlesAudioStep
            subtitles={subtitles}
            audioTracks={audioTracks}
            onAddSubtitle={handleAddSubtitle}
            onRemoveSubtitle={handleRemoveSubtitle}
            onUpdateSubtitle={handleUpdateSubtitle}
            onAddAudio={handleAddAudio}
            onRemoveAudio={handleRemoveAudio}
            onUpdateAudio={handleUpdateAudio}
          />
        </TabsContent>

        <TabsContent value="publish" className="mt-0 focus-visible:outline-none">
          <PublishScheduleStep
            status={status}
            onStatusChange={setStatus}
            notifySubscribers={notifySubscribers}
            onNotifyChange={setNotifySubscribers}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
