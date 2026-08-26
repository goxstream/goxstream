"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, CheckCircle2, PlaySquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BasicInfoStep } from "./components/basic-info-step";
import { VideoSourcesStep } from "./components/video-sources-step";
import { SubtitlesAudioStep } from "./components/subtitles-audio-step";
import { PublishScheduleStep } from "./components/publish-schedule-step";
import type { VideoServerSource, SubtitleTrack, AudioTrack, EpisodeStatus } from "../types";

export default function AddEpisodePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("basic");

  // Form State
  const [basicData, setBasicData] = useState({
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
      name: "Cloudflare R2 HLS Primary",
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

  // Video Server Source Handlers
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

  // Subtitle Handlers
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

  // Audio Track Handlers
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

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      {/* Top Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-border/60">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/episodes">
            <Button variant="outline" size="icon" className="size-9 border-border/60">
              <ArrowLeft className="size-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <PlaySquare className="size-5 text-primary" />
              <h1 className="text-xl font-bold tracking-tight text-foreground">
                Add New Episode
              </h1>
            </div>
            <p className="text-xs text-muted-foreground">
              Configure metadata, video sources, subtitles, and release schedule.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
          >
            <Save className="size-4 mr-1.5" />
            Save Draft
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <CheckCircle2 className="size-4 mr-1.5" />
            {isSaving ? "Publishing..." : "Publish Episode"}
          </Button>
        </div>
      </div>

      {/* Stepper Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 w-full h-11 border border-border/60 bg-card p-1 rounded-xl">
          <TabsTrigger value="basic" className="text-xs font-semibold">
            1. Basic Info
          </TabsTrigger>
          <TabsTrigger value="sources" className="text-xs font-semibold">
            2. Video Sources
          </TabsTrigger>
          <TabsTrigger value="subtitles" className="text-xs font-semibold">
            3. Subs & Audio
          </TabsTrigger>
          <TabsTrigger value="publish" className="text-xs font-semibold">
            4. Publish
          </TabsTrigger>
        </TabsList>

        <div className="mt-4 min-h-[580px]">
          <TabsContent value="basic">
            <BasicInfoStep formData={basicData} onChange={handleBasicChange} />
          </TabsContent>

          <TabsContent value="sources">
            <VideoSourcesStep
              servers={servers}
              onAddServer={handleAddServer}
              onRemoveServer={handleRemoveServer}
              onUpdateServer={handleUpdateServer}
            />
          </TabsContent>

          <TabsContent value="subtitles">
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

          <TabsContent value="publish">
            <PublishScheduleStep
              status={status}
              notifySubscribers={notifySubscribers}
              onStatusChange={setStatus}
              onNotifyChange={setNotifySubscribers}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
