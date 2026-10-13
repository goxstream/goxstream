"use client";

import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";
import { getEstimatedDownlinkMbps, calculateDynamicTimeoutMs } from "./network-speed";

export type EngineMode = "st" | "mt" | "auto";

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

async function fetchBlobURL(url: string, mimeType: string): Promise<string> {
  return toBlobURL(url, mimeType);
}

/**
 * Helper to fetch and instantiate Multi-Threaded FFmpeg core inside the timeout boundary.
 */
async function loadMTCore(instance: FFmpeg, cdnBase: string, onProgress?: (msg: string) => void) {
  if (onProgress) onProgress(`Fetching multi-threaded WASM core binaries from ${cdnBase}...`);
  const coreURL = await fetchBlobURL(`${cdnBase}/ffmpeg-core.js`, "text/javascript");
  const wasmURL = await fetchBlobURL(`${cdnBase}/ffmpeg-core.wasm`, "application/wasm");
  const workerURL = await fetchBlobURL(`${cdnBase}/ffmpeg-core.worker.js`, "text/javascript");

  if (onProgress) onProgress("Instantiating multi-threaded WASM core worker pool...");
  await instance.load({ coreURL, wasmURL, workerURL });
}

/**
 * Helper to fetch and instantiate Single-Threaded FFmpeg core inside the timeout boundary.
 */
async function loadSTCore(instance: FFmpeg, cdnBase: string, onProgress?: (msg: string) => void) {
  if (onProgress) onProgress(`Fetching single-threaded WASM core binaries from ${cdnBase}...`);
  const coreURL = await fetchBlobURL(`${cdnBase}/ffmpeg-core.js`, "text/javascript");
  const wasmURL = await fetchBlobURL(`${cdnBase}/ffmpeg-core.wasm`, "application/wasm");

  if (onProgress) onProgress("Instantiating single-threaded WASM core...");
  await instance.load({ coreURL, wasmURL });
}

/**
 * Manually initialize `@ffmpeg/ffmpeg` WebAssembly Core on-demand.
 * Enforces strict engine mode boundaries without unwanted automatic fallbacks.
 */
export async function loadFFmpegCore(
  onProgress?: (msg: string) => void,
  mode: EngineMode = "mt"
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

  // 3. Initiate single load promise with fresh instance allocation per attempt
  loadPromise = (async () => {
    const mbps = await getEstimatedDownlinkMbps();

    if (mode === "mt") {
      if (onProgress) onProgress("User selected Multi-Threaded WASM Core mode...");

      const crossIsolated = typeof window !== "undefined" && window.crossOriginIsolated;
      const sabSupported = typeof window !== "undefined" && typeof SharedArrayBuffer !== "undefined";

      if (!crossIsolated || !sabSupported) {
        ffmpegInstance = null;
        loadPromise = null;
        throw new Error(
          "Multi-Threaded WASM Core requires Cross-Origin Isolation (window.crossOriginIsolated) and SharedArrayBuffer. Please verify server COOP/COEP headers or switch to Single-Threaded mode."
        );
      }

      const mtTimeoutMs = calculateDynamicTimeoutMs(33, mbps);
      if (onProgress) {
        onProgress(`Network bandwidth: ~${mbps.toFixed(1)} Mbps (Adaptive MT CDN timeout budget: ${(mtTimeoutMs / 1000).toFixed(0)}s)`);
      }

      // Tier 1: Primary Multi-Threaded CDN (jsDelivr)
      try {
        if (onProgress) onProgress("Loading Multi-Threaded WASM core via jsDelivr CDN...");
        const instance = new FFmpeg();
        ffmpegInstance = instance;
        await timeoutPromise(
          loadMTCore(instance, MT_PRIMARY_CDN, onProgress),
          mtTimeoutMs,
          `Primary MT CDN load timeout (${(mtTimeoutMs / 1000).toFixed(0)}s budget)`
        );

        isMultiThreadedMode = true;
        if (onProgress) onProgress("FFmpeg Multi-Threaded WASM Core loaded successfully (jsDelivr).");
        return instance;
      } catch (mtPrimaryErr: any) {
        // Tier 2: Fallback Multi-Threaded CDN (unpkg)
        try {
          if (onProgress) onProgress(`jsDelivr MT failed (${mtPrimaryErr?.message || "Error"}). Retrying unpkg MT CDN...`);
          const instance = new FFmpeg();
          ffmpegInstance = instance;
          await timeoutPromise(
            loadMTCore(instance, MT_FALLBACK_CDN, onProgress),
            mtTimeoutMs,
            `Fallback MT CDN load timeout (${(mtTimeoutMs / 1000).toFixed(0)}s budget)`
          );

          isMultiThreadedMode = true;
          if (onProgress) onProgress("FFmpeg Multi-Threaded WASM Core loaded successfully via unpkg.");
          return instance;
        } catch (mtFallbackErr: any) {
          ffmpegInstance = null;
          loadPromise = null;
          throw new Error(
            `Multi-Threaded WASM Core load failed on all CDNs: ${mtFallbackErr?.message || "MT Core load failed"}`
          );
        }
      }
    }

    // Single-Threaded Mode (mode === "st")
    if (onProgress) onProgress("User selected Single-Threaded WASM Core mode...");
    const stTimeoutMs = calculateDynamicTimeoutMs(32, mbps);

    // Tier 1: Primary Single-Threaded CDN (jsDelivr)
    try {
      if (onProgress) onProgress("Loading Single-Threaded WASM core via jsDelivr CDN...");
      const instance = new FFmpeg();
      ffmpegInstance = instance;
      await timeoutPromise(
        loadSTCore(instance, ST_PRIMARY_CDN, onProgress),
        stTimeoutMs,
        `Primary ST CDN load timeout (${(stTimeoutMs / 1000).toFixed(0)}s budget)`
      );

      isMultiThreadedMode = false;
      if (onProgress) onProgress("FFmpeg Single-Threaded WASM Core loaded successfully (jsDelivr).");
      return instance;
    } catch (stPrimaryErr: any) {
      // Tier 2: Fallback Single-Threaded CDN (unpkg)
      try {
        if (onProgress) onProgress(`jsDelivr ST failed (${stPrimaryErr?.message || "Error"}). Retrying unpkg ST CDN...`);
        const instance = new FFmpeg();
        ffmpegInstance = instance;
        await timeoutPromise(
          loadSTCore(instance, ST_FALLBACK_CDN, onProgress),
          stTimeoutMs,
          `Fallback ST CDN load timeout (${(stTimeoutMs / 1000).toFixed(0)}s budget)`
        );

        isMultiThreadedMode = false;
        if (onProgress) onProgress("FFmpeg Single-Threaded WASM Core loaded successfully via unpkg.");
        return instance;
      } catch (stFallbackErr: any) {
        ffmpegInstance = null;
        loadPromise = null;
        throw new Error(
          `Single-Threaded WASM Core load failed on all CDNs: ${stFallbackErr?.message || "ST Core load failed"}`
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

/**
 * Safely terminate and reset the FFmpeg WASM engine singleton state.
 * Call this if a fatal WASM runtime exception occurs.
 */
export function terminateAndResetFFmpeg(): void {
  if (ffmpegInstance) {
    try {
      ffmpegInstance.terminate();
    } catch {
      // Ignore cleanup error if already terminated
    }
  }
  ffmpegInstance = null;
  loadPromise = null;
  isMultiThreadedMode = false;
}

