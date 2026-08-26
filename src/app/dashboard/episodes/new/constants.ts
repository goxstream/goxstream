import type { ServerType } from "./types";

export interface StreamTypeConfig {
  label: string;
  placeholder: string;
  hint: string;
}

export const STREAM_TYPE_CONFIG: Record<ServerType, StreamTypeConfig> = {
  hls: {
    label: "HLS Master Playlist URL (.m3u8)",
    placeholder: "https://cdn.example.com/hls/master.m3u8",
    hint: "Enter direct HTTP Live Streaming playlist manifest link.",
  },
  mp4: {
    label: "Direct MP4 Video File URL (.mp4)",
    placeholder: "https://cdn.example.com/videos/episode-1080p.mp4",
    hint: "Enter direct HTTPS link to progressive MP4 file.",
  },
  embed: {
    label: "Third-Party iFrame Embed URL",
    placeholder: "https://player.provider.com/embed/v12345",
    hint: "Enter third-party video player embed or iFrame URL.",
  },
  dash: {
    label: "MPEG-DASH Manifest URL (.mpd)",
    placeholder: "https://cdn.example.com/dash/manifest.mpd",
    hint: "Enter Dynamic Adaptive Streaming over HTTP manifest link.",
  },
};

export const ANIME_SERIES_OPTIONS = [
  { id: "a-01", title: "Solo Leveling Season 2: Arise from the Shadow" },
  { id: "a-02", title: "Demon Slayer: Hashira Training Arc" },
  { id: "a-03", title: "Jujutsu Kaisen Season 3: Culling Game" },
  { id: "a-04", title: "Frieren: Beyond Journey's End Season 2" },
];

export const STUDIO_STEPS = [
  { id: "basic", label: "1. Basic Info", href: "/dashboard/episodes/new/basic" },
  { id: "sources", label: "2. Video Sources", href: "/dashboard/episodes/new/sources" },
  { id: "subtitles", label: "3. Subs & Audio", href: "/dashboard/episodes/new/subtitles" },
  { id: "publish", label: "4. Publish", href: "/dashboard/episodes/new/publish" },
];

export const STUDIO_NAVIGATION_MAP: Record<
  string,
  { prev?: { href: string; label: string }; next?: { href: string; label: string } }
> = {
  "/dashboard/episodes/new/basic": {
    next: { href: "/dashboard/episodes/new/sources", label: "Video Sources" },
  },
  "/dashboard/episodes/new/sources": {
    prev: { href: "/dashboard/episodes/new/basic", label: "Basic Info" },
    next: { href: "/dashboard/episodes/new/subtitles", label: "Subs & Audio" },
  },
  "/dashboard/episodes/new/subtitles": {
    prev: { href: "/dashboard/episodes/new/sources", label: "Video Sources" },
    next: { href: "/dashboard/episodes/new/publish", label: "Publish Settings" },
  },
  "/dashboard/episodes/new/publish": {
    prev: { href: "/dashboard/episodes/new/subtitles", label: "Subs & Audio" },
  },
};
