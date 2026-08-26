"use client";

import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";

let ffmpegInstance: FFmpeg | null = null;
let isLoaded = false;

/**
 * Manually initialize `@ffmpeg/ffmpeg` WebAssembly Core on-demand.
 * Prevents fetching heavy WASM binaries on page mount.
 */
export async function loadFFmpegCore(
  onProgress?: (msg: string) => void
): Promise<FFmpeg> {
  if (ffmpegInstance && isLoaded) {
    return ffmpegInstance;
  }

  if (!ffmpegInstance) {
    ffmpegInstance = new FFmpeg();
  }

  if (onProgress) onProgress("Loading FFmpeg WebAssembly core binaries...");

  try {
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
    await ffmpegInstance.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
    });

    isLoaded = true;
    if (onProgress) onProgress("FFmpeg WASM Core loaded successfully.");
    return ffmpegInstance;
  } catch (err: any) {
    isLoaded = false;
    throw new Error(
      `Failed to load FFmpeg WASM Core: ${err?.message || "Unknown error"}`
    );
  }
}

/**
 * Check if the FFmpeg engine is currently loaded.
 */
export function isFFmpegCoreLoaded(): boolean {
  return isLoaded && ffmpegInstance !== null;
}

/**
 * Get current loaded FFmpeg instance.
 */
export function getFFmpegInstance(): FFmpeg | null {
  return ffmpegInstance;
}
