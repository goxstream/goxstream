"use client";

import JSZip from "jszip";
import type { HlsTranscodeResult } from "./types";

/**
 * Package multi-resolution HLS manifest & variant segment files into a single .zip archive
 * and trigger client browser download for local inspection/testing.
 */
export async function downloadHlsPackageZip(
  hlsResult: HlsTranscodeResult,
  zipFileName = "hls-multi-res-package.zip"
): Promise<void> {
  if (!hlsResult || !hlsResult.masterManifestBlob) {
    throw new Error("No HLS transcode result available to download.");
  }

  const zip = new JSZip();

  // 1. Add Master Playlist manifest (master.m3u8)
  zip.file(hlsResult.masterManifestFileName || "master.m3u8", hlsResult.masterManifestBlob);

  // 2. Add Variant Manifests (1080p.m3u8, 720p.m3u8, 480p.m3u8)
  if (hlsResult.variants && hlsResult.variants.length > 0) {
    hlsResult.variants.forEach(({ manifestFileName, manifestBlob }) => {
      zip.file(manifestFileName, manifestBlob);
    });
  }

  // 3. Add Segment Chunks (.ts)
  if (hlsResult.segmentBlobs && hlsResult.segmentBlobs.length > 0) {
    hlsResult.segmentBlobs.forEach(({ path, blob }) => {
      zip.file(path, blob);
    });
  }

  // 4. Generate .zip Blob
  const zipBlob = await zip.generateAsync({ type: "blob" });

  // 5. Trigger browser download anchor
  const url = URL.createObjectURL(zipBlob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = zipFileName.endsWith(".zip") ? zipFileName : `${zipFileName}.zip`;
  document.body.appendChild(anchor);
  anchor.click();

  // Cleanup DOM and object URL
  document.body.removeChild(anchor);
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
