export interface TranscodeProgress {
  progress: number;
  message: string;
}

export interface HlsVariantRendition {
  resolution: string; // e.g. "1080p", "720p", "480p"
  manifestFileName: string; // e.g. "1080p.m3u8"
  manifestBlob: Blob;
}

export interface HlsSegmentFile {
  path: string; // e.g. "1080p/segment0.ts" or "segment0.ts"
  fileName: string;
  blob: Blob;
}

export interface HlsTranscodeResult {
  masterManifestBlob: Blob;
  masterManifestFileName: string;
  variants: HlsVariantRendition[];
  segmentBlobs: HlsSegmentFile[];
}

export type EngineStatus = "unloaded" | "loading" | "ready" | "error";

export type ConverterStatus =
  | "idle"
  | "ready"
  | "converting"
  | "converted"
  | "uploading"
  | "complete"
  | "error";

export interface HlsUploadOptions {
  animeSlug: string;
  episodeNumber: string;
  hlsResult: HlsTranscodeResult | null;
  onProgress?: (progress: number, message: string) => void;
}

export interface HlsUploadResult {
  url: string;
  sizeBytes?: number;
}
