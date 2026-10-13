import { EditEpisodeForm } from "./components/edit-episode-form";
import type { EpisodeItem } from "@/app/dashboard/episodes/types";

interface EditEpisodePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditEpisodePage({ params }: EditEpisodePageProps) {
  const { id } = await params;

  const episode: EpisodeItem = {
    id,
    animeId: "a-01",

    animeTitle: "Solo Leveling Season 2: Arise from the Shadow",
    animeSlug: "solo-leveling-season-2",
    episodeNumber: 1,
    title: "New Episode",
    thumbnail: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80",
    duration: "24:00",
    airDate: new Date().toISOString().split("T")[0],
    status: "draft",
    viewsCount: 0,
    isVip: false,
    servers: [
      {
        id: "srv-101",
        name: "Cloudflare R2 HLS",
        type: "hls",
        quality: "1080p",
        url: "https://cdn.goxstream.tv/hls/sl-s2-ep12/master.m3u8",
        isPrimary: true,
        health: "online",
        latencyMs: 38,
      },
    ],
    subtitles: [
      {
        id: "sub-1",
        language: "Indonesian",
        label: "Bahasa Indonesia",
        code: "id",
        url: "/subs/sl-ep12-id.vtt",
        isDefault: true,
        format: "vtt",
      },
    ],
    audioTracks: [
      {
        id: "aud-1",
        language: "Japanese",
        label: "Japanese Original",
        type: "original",
        isDefault: true,
      },
    ],
  };

  return <EditEpisodeForm initialEpisode={episode} />;
}
