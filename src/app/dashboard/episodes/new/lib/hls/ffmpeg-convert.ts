"use client";

import { fetchFile } from "@ffmpeg/util";
import { loadFFmpegCore, terminateAndResetFFmpeg } from "./ffmpeg-init";
import type {
  TranscodeProgress,
  TranscodeLogEntry,
  HlsTranscodeResult,
  HlsVariantRendition,
  HlsSegmentFile,
  MultiResolutionInputFiles,
} from "./types";

/**
 * Multi-Resolution Instant Stream Copy HLS Packaging (< 15 seconds).
 * Processes pre-rendered multi-resolution inputs (1080p, 720p, 480p) via
 * 100% Stream Copy (-c copy) without CPU re-encoding overhead or WASM crashes.
 */
export async function transcodeVideoToHls(
  input: File | MultiResolutionInputFiles,
  onProgressCallback?: (p: TranscodeProgress) => void,
  onLogCallback?: (entry: TranscodeLogEntry) => void
): Promise<HlsTranscodeResult> {
  let currentStageId: "init" | "1080p" | "720p" | "480p" | "upload" = "init";

  const inputFiles: MultiResolutionInputFiles =
    input instanceof File
      ? { file1080p: input, file720p: null, file480p: null }
      : input;

  if (onLogCallback) {
    onLogCallback({
      id: `log-${Date.now()}-copy`,
      timestamp: new Date().toLocaleTimeString("en-US", { hour12: false }),
      type: "info",
      message: "[Stream Copy Pipeline] Executing 100% Fast Stream Copy (-c copy) without CPU re-encoding overhead.",
    });
  }

  const ffmpeg = await loadFFmpegCore((msg) => {
    if (onProgressCallback) {
      onProgressCallback({ progress: 10, message: msg, stageId: "init" });
    }
  });

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
    const percentage = Math.min(Math.max(Math.round(progress * 100), 0), 100);
    if (onProgressCallback) {
      onProgressCallback({
        progress: percentage,
        message: `Packaging HLS segment (${percentage}%)...`,
        stageId: currentStageId,
      });
    }
  };

  ffmpeg.on("log", logHandler);
  ffmpeg.on("progress", progressHandler);

  try {
    // 1. Rendition 1080p Full HD (Stream Copy)
    currentStageId = "1080p";
    const file1080 = inputFiles.file1080p;
    const input1080Name = "input_1080p_" + Date.now() + ".mp4";

    if (onProgressCallback) {
      onProgressCallback({ progress: 20, message: `Mounting 1080p Master (${file1080.name}) into VFS...`, stageId: "1080p" });
    }

    const data1080 = await fetchFile(file1080);
    await ffmpeg.writeFile(input1080Name, data1080);

    if (onProgressCallback) {
      onProgressCallback({ progress: 30, message: "Stream Copying 1080p to HLS segments...", stageId: "1080p" });
    }

    await ffmpeg.exec([
      "-i", input1080Name,
      "-c:v", "copy",
      "-c:a", "copy",
      "-start_number", "0",
      "-hls_time", "10",
      "-hls_list_size", "0",
      "-f", "hls",
      "1080p.m3u8",
    ]);

    const manifest1080 = await ffmpeg.readFile("1080p.m3u8");
    variants.push({
      resolution: "1080p",
      manifestFileName: "1080p.m3u8",
      manifestBlob: new Blob([new Uint8Array(manifest1080 as Uint8Array)], {
        type: "application/x-mpegURL",
      }),
    });

    await ffmpeg.deleteFile(input1080Name);
    await ffmpeg.deleteFile("1080p.m3u8");

    // 2. Rendition 720p HD (Stream Copy if file provided)
    if (inputFiles.file720p) {
      currentStageId = "720p";
      const file720 = inputFiles.file720p;
      const input720Name = "input_720p_" + Date.now() + ".mp4";

      if (onProgressCallback) {
        onProgressCallback({ progress: 55, message: `Mounting 720p Source (${file720.name}) into VFS...`, stageId: "720p" });
      }

      const data720 = await fetchFile(file720);
      await ffmpeg.writeFile(input720Name, data720);

      if (onProgressCallback) {
        onProgressCallback({ progress: 65, message: "Stream Copying 720p to HLS segments...", stageId: "720p" });
      }

      await ffmpeg.exec([
        "-i", input720Name,
        "-c:v", "copy",
        "-c:a", "copy",
        "-start_number", "0",
        "-hls_time", "10",
        "-hls_list_size", "0",
        "-f", "hls",
        "720p.m3u8",
      ]);

      const manifest720 = await ffmpeg.readFile("720p.m3u8");
      variants.push({
        resolution: "720p",
        manifestFileName: "720p.m3u8",
        manifestBlob: new Blob([new Uint8Array(manifest720 as Uint8Array)], {
          type: "application/x-mpegURL",
        }),
      });

      await ffmpeg.deleteFile(input720Name);
      await ffmpeg.deleteFile("720p.m3u8");
    }

    // 3. Rendition 480p SD (Stream Copy if file provided)
    if (inputFiles.file480p) {
      currentStageId = "480p";
      const file480 = inputFiles.file480p;
      const input480Name = "input_480p_" + Date.now() + ".mp4";

      if (onProgressCallback) {
        onProgressCallback({ progress: 75, message: `Mounting 480p Source (${file480.name}) into VFS...`, stageId: "480p" });
      }

      const data480 = await fetchFile(file480);
      await ffmpeg.writeFile(input480Name, data480);

      if (onProgressCallback) {
        onProgressCallback({ progress: 85, message: "Stream Copying 480p to HLS segments...", stageId: "480p" });
      }

      await ffmpeg.exec([
        "-i", input480Name,
        "-c:v", "copy",
        "-c:a", "copy",
        "-start_number", "0",
        "-hls_time", "10",
        "-hls_list_size", "0",
        "-f", "hls",
        "480p.m3u8",
      ]);

      const manifest480 = await ffmpeg.readFile("480p.m3u8");
      variants.push({
        resolution: "480p",
        manifestFileName: "480p.m3u8",
        manifestBlob: new Blob([new Uint8Array(manifest480 as Uint8Array)], {
          type: "application/x-mpegURL",
        }),
      });

      await ffmpeg.deleteFile(input480Name);
      await ffmpeg.deleteFile("480p.m3u8");
    }

    // 4. Extract all generated .ts segment files from VFS
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

    // 5. Generate Master Playlist index (master.m3u8) dynamically based on active variants
    const masterLines: string[] = [
      "#EXTM3U",
      "#EXT-X-VERSION:3",
      "",
    ];

    if (variants.some((v) => v.resolution === "1080p")) {
      masterLines.push(
        '#EXT-X-STREAM-INF:BANDWIDTH=5000000,RESOLUTION=1920x1080,NAME="1080p"',
        "1080p.m3u8",
        ""
      );
    }
    if (variants.some((v) => v.resolution === "720p")) {
      masterLines.push(
        '#EXT-X-STREAM-INF:BANDWIDTH=2800000,RESOLUTION=1280x720,NAME="720p"',
        "720p.m3u8",
        ""
      );
    }
    if (variants.some((v) => v.resolution === "480p")) {
      masterLines.push(
        '#EXT-X-STREAM-INF:BANDWIDTH=1400000,RESOLUTION=854x480,NAME="480p"',
        "480p.m3u8",
        ""
      );
    }

    const masterManifestContent = masterLines.join("\n");
    const masterManifestBlob = new Blob([masterManifestContent], {
      type: "application/x-mpegURL",
    });

    if (onProgressCallback) {
      onProgressCallback({ progress: 100, message: "Instant Multi-Resolution HLS Packaging Complete!" });
    }

    return {
      masterManifestBlob,
      masterManifestFileName: "master.m3u8",
      variants,
      segmentBlobs,
    };
  } catch (err) {
    terminateAndResetFFmpeg();
    throw err;
  } finally {
    ffmpeg.off("log", logHandler);
    ffmpeg.off("progress", progressHandler);
  }
}
