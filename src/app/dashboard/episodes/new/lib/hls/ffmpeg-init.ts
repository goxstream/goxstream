"use client";

import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";

let ffmpegInstance: FFmpeg | null = null;
let loadPromise: Promise<FFmpeg> | null = null;

/**
 * Manually initialize `@ffmpeg/ffmpeg` WebAssembly Core on-demand.
 * Includes in-flight promise deduplication and fallback CDN to prevent race conditions & load failures.
 */
export async function loadFFmpegCore(
  onProgress?: (msg: string) => void
): Promise<FFmpeg> {
  // 1. Return existing loaded instance if already ready
  if (ffmpegInstance && ffmpegInstance.loaded) {
    if (onProgress) onProgress("FFmpeg WASM Core engine is ready.");
    return ffmpegInstance;
  }

  // 2. Return in-flight loading promise to avoid duplicate concurrent load calls
  if (loadPromise) {
    if (onProgress) onProgress("FFmpeg WASM Core initialization in progress...");
    return loadPromise;
  }

  if (!ffmpegInstance) {
    ffmpegInstance = new FFmpeg();
  }

  const instance = ffmpegInstance;

  // 3. Initiate single load promise
  loadPromise = (async () => {
    if (onProgress) onProgress("Loading FFmpeg WebAssembly core binaries...");

    const primaryCDN = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
    const fallbackCDN = "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/umd";

    try {
      await instance.load({
        coreURL: await toBlobURL(`${primaryCDN}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${primaryCDN}/ffmpeg-core.wasm`, "application/wasm"),
      });

      if (onProgress) onProgress("FFmpeg WASM Core loaded successfully.");
      return instance;
    } catch (primaryErr: any) {
      // Retrying with fallback CDN if primary fails
      try {
        if (onProgress) onProgress("Primary CDN failed. Retrying with fallback CDN (jsDelivr)...");
        await instance.load({
          coreURL: await toBlobURL(`${fallbackCDN}/ffmpeg-core.js`, "text/javascript"),
          wasmURL: await toBlobURL(`${fallbackCDN}/ffmpeg-core.wasm`, "application/wasm"),
        });

        if (onProgress) onProgress("FFmpeg WASM Core loaded successfully via fallback CDN.");
        return instance;
      } catch (fallbackErr: any) {
        loadPromise = null;
        throw new Error(
          `Failed to load FFmpeg WASM Core: ${primaryErr?.message || fallbackErr?.message || "Network error fetching WASM core"}`
        );
      }
    }
  })();

  return loadPromise;
}

/**
 * Check if the FFmpeg engine is currently loaded.
 */
export function isFFmpegCoreLoaded(): boolean {
  return ffmpegInstance !== null && ffmpegInstance.loaded;
}

/**
 * Get current loaded FFmpeg instance.
 */
export function getFFmpegInstance(): FFmpeg | null {
  return ffmpegInstance;
}
