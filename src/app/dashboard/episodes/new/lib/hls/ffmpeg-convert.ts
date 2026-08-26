"use client";

import { fetchFile } from "@ffmpeg/util";
import { loadFFmpegCore } from "./ffmpeg-init";
import type {
  TranscodeProgress,
  TranscodeLogEntry,
  HlsTranscodeResult,
  HlsVariantRendition,
  HlsSegmentFile,
} from "./types";

/**
 * Multi-Resolution HLS Transcoder (1080p, 720p, 480p adaptive bitrate renditions).
 */
export async function transcodeVideoToHls(
  file: File,
  onProgressCallback?: (p: TranscodeProgress) => void,
  onLogCallback?: (entry: TranscodeLogEntry) => void
): Promise<HlsTranscodeResult> {
  const ffmpeg = await loadFFmpegCore((msg) => {
    if (onProgressCallback) {
      onProgressCallback({ progress: 10, message: msg });
    }
  });

  const inputName = "input_" + Date.now() + ".mp4";

  if (onProgressCallback) {
    onProgressCallback({ progress: 15, message: `Mounting ${file.name} into WASM VFS...` });
  }

  // 1. Write input video file to FFmpeg Virtual File System
  const fileData = await fetchFile(file);
  await ffmpeg.writeFile(inputName, fileData);

  const variants: HlsVariantRendition[] = [];
  const segmentBlobs: HlsSegmentFile[] = [];

  const logHandler = ({ message }: { message: string }) => {
    console.log("%c[FFmpeg WASM]", "color: #06b6d4; font-weight: bold;", message);
    if (onLogCallback) {
      onLogCallback({
        id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        timestamp: new Date().toLocaleTimeString("en-US", { hour12: false }),
        type: "ffmpeg",
        message,
      });
    }
  };

  const progressHandler = ({ progress }: { progress: number }) => {
    const percentage = Math.min(Math.max(Math.round(progress * 100), 20), 85);
    if (onProgressCallback) {
      onProgressCallback({
        progress: percentage,
        message: `Encoding multi-resolution HLS renditions (${percentage}%)...`,
      });
    }
  };

  ffmpeg.on("log", logHandler);
  ffmpeg.on("progress", progressHandler);

  try {
    // 2. Rendition 1: 1080p Master Rendition (Stream Copy / Full HD)
    if (onProgressCallback) {
      onProgressCallback({ progress: 25, message: "Generating 1080p Full HD stream rendition..." });
    }
    await ffmpeg.exec([
      "-i", inputName,
      "-c:v", "copy",
      "-c:a", "copy",
      "-start_number", "0",
      "-hls_time", "10",
      "-hls_list_size", "0",
      "-f", "hls",
      "1080p.m3u8",
    ]);

    // Read 1080p Manifest
    const manifest1080 = await ffmpeg.readFile("1080p.m3u8");
    variants.push({
      resolution: "1080p",
      manifestFileName: "1080p.m3u8",
      manifestBlob: new Blob([new Uint8Array(manifest1080 as Uint8Array)], {
        type: "application/x-mpegURL",
      }),
    });
    await ffmpeg.deleteFile("1080p.m3u8");

    // 3. Rendition 2: 720p HD Rendition (Ultrafast preset)
    if (onProgressCallback) {
      onProgressCallback({ progress: 50, message: "Generating 720p HD scaled stream rendition..." });
    }
    await ffmpeg.exec([
      "-i", inputName,
      "-vf", "scale=-2:720",
      "-c:v", "libx264",
      "-preset", "ultrafast",
      "-c:a", "copy",
      "-start_number", "0",
      "-hls_time", "10",
      "-hls_list_size", "0",
      "-f", "hls",
      "720p.m3u8",
    ]);

    // Read 720p Manifest
    const manifest720 = await ffmpeg.readFile("720p.m3u8");
    variants.push({
      resolution: "720p",
      manifestFileName: "720p.m3u8",
      manifestBlob: new Blob([new Uint8Array(manifest720 as Uint8Array)], {
        type: "application/x-mpegURL",
      }),
    });
    await ffmpeg.deleteFile("720p.m3u8");

    // 4. Rendition 3: 480p SD Rendition (Ultrafast preset)
    if (onProgressCallback) {
      onProgressCallback({ progress: 75, message: "Generating 480p SD scaled stream rendition..." });
    }
    await ffmpeg.exec([
      "-i", inputName,
      "-vf", "scale=-2:480",
      "-c:v", "libx264",
      "-preset", "ultrafast",
      "-c:a", "copy",
      "-start_number", "0",
      "-hls_time", "10",
      "-hls_list_size", "0",
      "-f", "hls",
      "480p.m3u8",
    ]);

    // Read 480p Manifest
    const manifest480 = await ffmpeg.readFile("480p.m3u8");
    variants.push({
      resolution: "480p",
      manifestFileName: "480p.m3u8",
      manifestBlob: new Blob([new Uint8Array(manifest480 as Uint8Array)], {
        type: "application/x-mpegURL",
      }),
    });
    await ffmpeg.deleteFile("480p.m3u8");

    // 5. Extract all generated .ts segment files from VFS
    const dirEntries = await ffmpeg.listDir(".");
    for (const entry of dirEntries) {
      if (!entry.isDir && entry.name.endsWith(".ts")) {
        const segData = await ffmpeg.readFile(entry.name);
        const segBlob = new Blob([new Uint8Array(segData as Uint8Array)], { type: "video/MP2T" });
        segmentBlobs.push({
          path: entry.name,
          fileName: entry.name,
          blob: segBlob,
        });

        await ffmpeg.deleteFile(entry.name);
      }
    }

    // Clean up input video file
    await ffmpeg.deleteFile(inputName);

    // 6. Generate Master Playlist index (master.m3u8)
    const masterManifestContent = [
      "#EXTM3U",
      "#EXT-X-VERSION:3",
      "",
      '#EXT-X-STREAM-INF:BANDWIDTH=5000000,RESOLUTION=1920x1080,NAME="1080p"',
      "1080p.m3u8",
      "",
      '#EXT-X-STREAM-INF:BANDWIDTH=2800000,RESOLUTION=1280x720,NAME="720p"',
      "720p.m3u8",
      "",
      '#EXT-X-STREAM-INF:BANDWIDTH=1400000,RESOLUTION=854x480,NAME="480p"',
      "480p.m3u8",
      "",
    ].join("\n");

    const masterManifestBlob = new Blob([masterManifestContent], {
      type: "application/x-mpegURL",
    });

    if (onProgressCallback) {
      onProgressCallback({ progress: 100, message: "Multi-Resolution HLS Transcoding Complete!" });
    }

    return {
      masterManifestBlob,
      masterManifestFileName: "master.m3u8",
      variants,
      segmentBlobs,
    };
  } finally {
    ffmpeg.off("log", logHandler);
    ffmpeg.off("progress", progressHandler);
  }
}
