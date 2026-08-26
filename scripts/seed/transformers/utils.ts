export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function stripHtml(html: string | null): string | null {
  if (!html) return null;
  return html.replace(/<[^>]*>?/gm, "").trim();
}

export function capitalize(text: string | null): string | null {
  if (!text) return null;
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export function mapStatus(status: string | null): string {
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

export function mapFormat(format: string | null): string {
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
export const SAMPLE_HLS_STREAMS = [
  "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
  "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8",
  "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8",
];
