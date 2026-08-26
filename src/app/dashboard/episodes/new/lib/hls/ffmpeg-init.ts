"use client";

import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";

let ffmpegInstance: FFmpeg | null = null;
let loadPromise: Promise<FFmpeg> | null = null;
let isMultiThreadedMode = false;

const CORE_VERSION = "0.12.10";
const MT_PRIMARY_CDN = `https://cdn.jsdelivr.net/npm/@ffmpeg/core-mt@${CORE_VERSION}/dist/umd`;
const MT_FALLBACK_CDN = `https://unpkg.com/@ffmpeg/core-mt@${CORE_VERSION}/dist/umd`;
const ST_PRIMARY_CDN = `https://cdn.jsdelivr.net/npm/@ffmpeg/core@${CORE_VERSION}/dist/umd`;
const ST_FALLBACK_CDN = `https://unpkg.com/@ffmpeg/core@${CORE_VERSION}/dist/umd`;

/**
 * Helper to race a promise against a timeout.
 */
function timeoutPromise<T>(promise: Promise<T>, ms: number, errorMessage: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(errorMessage)), ms)
    ),
  ]);
}

/**
 * Helper to fetch and instantiate Multi-Threaded FFmpeg core inside the timeout boundary.
 */
async function loadMTCore(instance: FFmpeg, cdnBase: string, onProgress?: (msg: string) => void) {
  if (onProgress) onProgress(`Fetching multi-threaded WASM core binaries from CDN...`);
  const coreURL = await toBlobURL(`${cdnBase}/ffmpeg-core.js`, "text/javascript");
  const wasmURL = await toBlobURL(`${cdnBase}/ffmpeg-core.wasm`, "application/wasm");
  const workerURL = await toBlobURL(`${cdnBase}/ffmpeg-core.worker.js`, "text/javascript");

  if (onProgress) onProgress("Instantiating multi-threaded WASM core worker pool...");
  await instance.load({ coreURL, wasmURL, workerURL });
}

/**
 * Helper to fetch and instantiate Single-Threaded FFmpeg core inside the timeout boundary.
 */
async function loadSTCore(instance: FFmpeg, cdnBase: string, onProgress?: (msg: string) => void) {
  if (onProgress) onProgress(`Fetching single-threaded WASM core binaries...`);
  const coreURL = await toBlobURL(`${cdnBase}/ffmpeg-core.js`, "text/javascript");
  const wasmURL = await toBlobURL(`${cdnBase}/ffmpeg-core.wasm`, "application/wasm");

  if (onProgress) onProgress("Instantiating single-threaded WASM core...");
  await instance.load({ coreURL, wasmURL });
}

/**
 * Manually initialize `@ffmpeg/ffmpeg` WebAssembly Core on-demand.
 * Supports Multi-Threaded Core (@ffmpeg/core-mt) with strict timeout boundaries, CDN retries, and single-thread fallback.
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

    if (supportsMultiThread) {
      // 3a. Try Primary Multi-Threaded CDN (jsDelivr) with 8s timeout
      try {
        if (onProgress) onProgress("Loading FFmpeg Multi-Threaded WASM core (@ffmpeg/core-mt)...");
        await timeoutPromise(
          loadMTCore(instance, MT_PRIMARY_CDN, onProgress),
          8000,
          "Primary multi-threaded core load timeout (8s limit)"
        );

        isMultiThreadedMode = true;
        if (onProgress) onProgress("FFmpeg Multi-Threaded WASM Core loaded successfully.");
        return instance;
      } catch (mtPrimaryErr: any) {
        // 3b. Try Fallback Multi-Threaded CDN (unpkg) with 8s timeout
        try {
          if (onProgress) onProgress(`Primary MT CDN failed (${mtPrimaryErr?.message}). Retrying with unpkg...`);
          await timeoutPromise(
            loadMTCore(instance, MT_FALLBACK_CDN, onProgress),
            8000,
            "Fallback multi-threaded core load timeout (8s limit)"
          );

          isMultiThreadedMode = true;
          if (onProgress) onProgress("FFmpeg Multi-Threaded WASM Core loaded successfully via fallback CDN.");
          return instance;
        } catch (mtFallbackErr: any) {
          if (onProgress) onProgress("Multi-Threaded CDN load failed/timed out. Falling back to Single-Threaded Core...");
        }
      }
    }

    // 4a. Try Primary Single-Threaded CDN (jsDelivr) with 15s timeout
    try {
      if (onProgress) onProgress("Loading FFmpeg Single-Threaded WASM core (@ffmpeg/core)...");
      await timeoutPromise(
        loadSTCore(instance, ST_PRIMARY_CDN, onProgress),
        15000,
        "Single-threaded core load timeout"
      );

      isMultiThreadedMode = false;
      if (onProgress) onProgress("FFmpeg Single-Threaded WASM Core loaded successfully.");
      return instance;
    } catch (stPrimaryErr: any) {
      // 4b. Try Fallback Single-Threaded CDN (unpkg)
      try {
        if (onProgress) onProgress("Retrying Single-Threaded core with unpkg fallback CDN...");
        await timeoutPromise(
          loadSTCore(instance, ST_FALLBACK_CDN, onProgress),
          15000,
          "Single-threaded fallback core load timeout"
        );

        isMultiThreadedMode = false;
        if (onProgress) onProgress("FFmpeg WASM Core loaded successfully via fallback CDN.");
        return instance;
      } catch (stFallbackErr: any) {
        loadPromise = null;
        throw new Error(
          `Failed to load FFmpeg WASM Core: ${stPrimaryErr?.message || stFallbackErr?.message || "Network error fetching WASM core"}`
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
