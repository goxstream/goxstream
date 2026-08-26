"use client";

import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";

let ffmpegInstance: FFmpeg | null = null;
let loadPromise: Promise<FFmpeg> | null = null;
let isMultiThreadedMode = false;

/**
 * Manually initialize `@ffmpeg/ffmpeg` WebAssembly Core on-demand.
 * Supports Multi-Threaded Core (@ffmpeg/core-mt) with automatic single-thread fallback.
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
    const supportsMultiThread =
      typeof window !== "undefined" &&
      typeof SharedArrayBuffer !== "undefined" &&
      window.crossOriginIsolated;

    const mtCDN = "https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/umd";
    const stCDN = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
    const fallbackCDN = "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/umd";

    if (supportsMultiThread) {
      try {
        if (onProgress) onProgress("Loading FFmpeg Multi-Threaded WASM core (@ffmpeg/core-mt)...");
        await instance.load({
          coreURL: await toBlobURL(`${mtCDN}/ffmpeg-core.js`, "text/javascript"),
          wasmURL: await toBlobURL(`${mtCDN}/ffmpeg-core.wasm`, "application/wasm"),
          workerURL: await toBlobURL(`${mtCDN}/ffmpeg-core.worker.js`, "text/javascript"),
        });

        isMultiThreadedMode = true;
        if (onProgress) onProgress("FFmpeg Multi-Threaded WASM Core loaded successfully.");
        return instance;
      } catch (mtErr: any) {
        if (onProgress) onProgress("Multi-threaded load failed. Falling back to Single-Threaded Core...");
      }
    }

    // Single-Threaded fallback / default
    try {
      if (onProgress) onProgress("Loading FFmpeg Single-Threaded WASM core (@ffmpeg/core)...");
      await instance.load({
        coreURL: await toBlobURL(`${stCDN}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${stCDN}/ffmpeg-core.wasm`, "application/wasm"),
      });

      isMultiThreadedMode = false;
      if (onProgress) onProgress("FFmpeg Single-Threaded WASM Core loaded successfully.");
      return instance;
    } catch (stErr: any) {
      try {
        if (onProgress) onProgress("Retrying with jsDelivr CDN fallback...");
        await instance.load({
          coreURL: await toBlobURL(`${fallbackCDN}/ffmpeg-core.js`, "text/javascript"),
          wasmURL: await toBlobURL(`${fallbackCDN}/ffmpeg-core.wasm`, "application/wasm"),
        });

        isMultiThreadedMode = false;
        if (onProgress) onProgress("FFmpeg WASM Core loaded successfully via fallback CDN.");
        return instance;
      } catch (fallbackErr: any) {
        loadPromise = null;
        throw new Error(
          `Failed to load FFmpeg WASM Core: ${stErr?.message || fallbackErr?.message || "Network error fetching WASM core"}`
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
 * Check if current loaded engine is operating in multi-threaded mode.
 */
export function isFFmpegMultiThreaded(): boolean {
  return isMultiThreadedMode;
}

/**
 * Get current loaded FFmpeg instance.
 */
export function getFFmpegInstance(): FFmpeg | null {
  return ffmpegInstance;
}
