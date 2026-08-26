"use client";

import type { HlsUploadOptions, HlsUploadResult } from "./types";

/**
 * Send multi-resolution HLS master manifest, variant manifests, and segment chunks
 * to storage API endpoint via FormData.
 */
export async function uploadHlsPackage(
  options: HlsUploadOptions
): Promise<HlsUploadResult> {
  const { animeSlug, episodeNumber, hlsResult, onProgress } = options;

  if (onProgress) onProgress(10, "Uploading multi-resolution HLS package to Storage...");

  const masterFileName = "master.m3u8";
  const masterUrl = `https://cdn.goxstream.tv/episodes/${animeSlug}/ep${episodeNumber || "12"}/${masterFileName}`;

  const formData = new FormData();
  formData.append("animeSlug", animeSlug);
  formData.append("episodeNum", episodeNumber || "12");

  // Attach Master Manifest
  if (hlsResult?.masterManifestBlob) {
    formData.append("file", hlsResult.masterManifestBlob, masterFileName);
  }

  // Attach Variant Manifests (1080p.m3u8, 720p.m3u8, 480p.m3u8)
  if (hlsResult?.variants && hlsResult.variants.length > 0) {
    hlsResult.variants.forEach(({ manifestFileName, manifestBlob }) => {
      formData.append("variants", manifestBlob, manifestFileName);
    });
  }

  // Attach Segment Chunks (.ts)
  if (hlsResult?.segmentBlobs && hlsResult.segmentBlobs.length > 0) {
    hlsResult.segmentBlobs.forEach(({ path, blob }) => {
      formData.append("segments", blob, path);
    });
  }

  if (onProgress) onProgress(40, "Transmitting multi-resolution payload to Storage endpoint...");

  const response = await fetch("/api/upload/hls", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Upload server responded with HTTP ${response.status}`);
  }

  const resData: any = await response.json();
  const finalUrl = resData?.data?.url || masterUrl;

  if (onProgress) onProgress(100, "Multi-resolution HLS Package successfully uploaded to CDN Storage!");

  return {
    url: finalUrl,
    sizeBytes: resData?.data?.sizeBytes,
  };
}
