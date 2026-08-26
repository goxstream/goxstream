"use client";

import { useState, useCallback } from "react";
import {
  validateVideoFile,
  loadFFmpegCore,
  isFFmpegCoreLoaded,
  transcodeVideoToHls,
  downloadHlsPackageZip,
  uploadHlsPackage,
  type EngineStatus,
  type ConverterStatus,
  type HlsTranscodeResult,
  type VideoValidationResult,
} from "../lib/hls";

export interface UseHlsConverterOptions {
  animeSlug?: string;
  episodeNumber?: string;
  onUrlGenerated?: (url: string) => void;
}

export function useHlsConverter({
  animeSlug = "solo-leveling-season-2",
  episodeNumber = "12",
  onUrlGenerated,
}: UseHlsConverterOptions = {}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationResult, setValidationResult] = useState<VideoValidationResult | null>(null);
  const [engineStatus, setEngineStatus] = useState<EngineStatus>(
    isFFmpegCoreLoaded() ? "ready" : "unloaded"
  );
  const [status, setStatus] = useState<ConverterStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("");
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [hlsResult, setHlsResult] = useState<HlsTranscodeResult | null>(null);

  const handleFileSelect = useCallback(async (file: File | null) => {
    if (!file) {
      setSelectedFile(null);
      setValidationResult(null);
      setStatus("idle");
      return;
    }

    setSelectedFile(file);
    setStatusText("Validating MP4 format & 1080p resolution...");

    const valResult = await validateVideoFile(file);
    setValidationResult(valResult);

    if (!valResult.isValid) {
      setStatus("error");
      setStatusText(valResult.errorMessage || "Validation failed.");
    } else {
      setStatus("ready");
      setProgress(0);
      setStatusText(`Verified MP4 ${valResult.resolution}: ${file.name} (${(file.size / (1024 * 1024)).toFixed(1)} MB)`);
    }
  }, []);

  /**
   * Action: Manual Engine Initialization
   */
  const initEngine = useCallback(async () => {
    if (engineStatus === "ready" || engineStatus === "loading") return;

    try {
      setEngineStatus("loading");
      setStatusText("Initializing FFmpeg WebAssembly Core engine on-demand...");
      await loadFFmpegCore((msg) => setStatusText(msg));
      setEngineStatus("ready");
      setStatusText("FFmpeg WASM Core Engine ready.");
    } catch (err: any) {
      setEngineStatus("error");
      setStatusText(`Engine load failed: ${err?.message || "Unknown error"}`);
    }
  }, [engineStatus]);

  /**
   * Action 1: Multi-Resolution Video Transcode to HLS (1080p, 720p, 480p)
   */
  const convertVideo = useCallback(async () => {
    if (!selectedFile || (validationResult && !validationResult.isValid)) return;

    try {
      if (!isFFmpegCoreLoaded()) {
        await initEngine();
      }

      setStatus("converting");
      setProgress(5);
      setStatusText("Starting multi-resolution FFmpeg WASM transcode pipeline...");

      const result = await transcodeVideoToHls(selectedFile, ({ progress, message }) => {
        setProgress(progress);
        setStatusText(message);
      });

      setHlsResult(result);
      setStatus("converted");
      setStatusText(
        `Multi-Resolution Transcoding Successful! Generated 1080p, 720p, 480p renditions & master playlist.`
      );
    } catch (err: any) {
      setStatus("error");
      setStatusText(`Conversion error: ${err?.message || "Transcoding failed"}`);
    }
  }, [selectedFile, validationResult, initEngine]);

  /**
   * Action 2 (Optional): Download Multi-Resolution HLS Package (.zip)
   */
  const downloadHls = useCallback(async () => {
    if (!hlsResult) return;

    try {
      const zipName = `${animeSlug}-ep${episodeNumber || "12"}-multi-hls.zip`;
      setStatusText("Packaging multi-resolution HLS renditions into ZIP archive...");
      await downloadHlsPackageZip(hlsResult, zipName);
      setStatusText(`Downloaded ${zipName} successfully!`);
    } catch (err: any) {
      setStatusText(`Download error: ${err?.message || "ZIP generation failed"}`);
    }
  }, [hlsResult, animeSlug, episodeNumber]);

  /**
   * Action 3: Upload Multi-Resolution HLS Package to Storage API
   */
  const uploadHls = useCallback(async () => {
    if (!selectedFile) return;

    try {
      setStatus("uploading");
      setProgress(10);

      const result = await uploadHlsPackage({
        animeSlug,
        episodeNumber,
        hlsResult,
        onProgress: (prog, msg) => {
          setProgress(prog);
          setStatusText(msg);
        },
      });

      setProgress(100);
      setStatus("complete");
      setGeneratedUrl(result.url);
      setStatusText("Multi-resolution HLS package successfully uploaded to CDN Storage!");
      if (onUrlGenerated) {
        onUrlGenerated(result.url);
      }
    } catch (err: any) {
      setStatus("error");
      setStatusText(`Upload error: ${err?.message || "Network upload failed"}`);
    }
  }, [selectedFile, hlsResult, animeSlug, episodeNumber, onUrlGenerated]);

  return {
    selectedFile,
    validationResult,
    engineStatus,
    status,
    progress,
    statusText,
    generatedUrl,
    handleFileSelect,
    initEngine,
    convertVideo,
    downloadHls,
    uploadHls,
  };
}
