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
  type TranscodeLogEntry,
  type LogSeverity,
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
  const [logs, setLogs] = useState<TranscodeLogEntry[]>([]);

  const addLog = useCallback((type: LogSeverity, message: string) => {
    const timestamp = new Date().toLocaleTimeString("en-US", { hour12: false });
    const entry: TranscodeLogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp,
      type,
      message,
    };

    if (type === "error") {
      console.error(`%c[Studio Converter Error] [${timestamp}]`, "color: #ef4444; font-weight: bold;", message);
    } else if (type === "success") {
      console.log(`%c[Studio Converter Success] [${timestamp}]`, "color: #10b981; font-weight: bold;", message);
    } else if (type === "ffmpeg") {
      console.log(`%c[FFmpeg WASM] [${timestamp}]`, "color: #06b6d4; font-weight: bold;", message);
    } else {
      console.info(`%c[Studio Converter] [${timestamp}]`, "color: #a855f7; font-weight: bold;", message);
    }

    setLogs((prev) => [...prev, entry]);
  }, []);

  const appendFfmpegLog = useCallback((entry: TranscodeLogEntry) => {
    setLogs((prev) => [...prev, entry]);
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  const copyLogsToClipboard = useCallback(() => {
    const text = logs.map((l) => `[${l.timestamp}] [${l.type.toUpperCase()}] ${l.message}`).join("\n");
    navigator.clipboard.writeText(text);
  }, [logs]);

  const handleFileSelect = useCallback(async (file: File | null) => {
    if (!file) {
      setSelectedFile(null);
      setValidationResult(null);
      setStatus("idle");
      return;
    }

    setSelectedFile(file);
    const initMsg = "Validating MP4 format & 1080p resolution...";
    setStatusText(initMsg);
    addLog("info", `File selected: ${file.name} (${(file.size / (1024 * 1024)).toFixed(1)} MB)`);

    const valResult = await validateVideoFile(file);
    setValidationResult(valResult);

    if (!valResult.isValid) {
      setStatus("error");
      const err = valResult.errorMessage || "Validation failed.";
      setStatusText(err);
      addLog("error", `Validation error: ${err}`);
    } else {
      setStatus("ready");
      setProgress(0);
      const readyMsg = `Verified MP4 ${valResult.resolution}: ${file.name} (${(file.size / (1024 * 1024)).toFixed(1)} MB)`;
      setStatusText(readyMsg);
      addLog("success", readyMsg);
    }
  }, [addLog]);

  /**
   * Action: Manual Engine Initialization
   */
  const initEngine = useCallback(async () => {
    if (engineStatus === "ready" || engineStatus === "loading") return;

    try {
      setEngineStatus("loading");
      const msg = "Initializing FFmpeg WebAssembly Core engine on-demand...";
      setStatusText(msg);
      addLog("info", msg);

      await loadFFmpegCore((coreMsg) => {
        setStatusText(coreMsg);
        addLog("info", coreMsg);
      });

      setEngineStatus("ready");
      const readyMsg = "FFmpeg WASM Core Engine ready.";
      setStatusText(readyMsg);
      addLog("success", readyMsg);
    } catch (err: any) {
      setEngineStatus("error");
      const errMsg = `Engine load failed: ${err?.message || "Unknown error"}`;
      setStatusText(errMsg);
      addLog("error", errMsg);
    }
  }, [engineStatus, addLog]);

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
      const startMsg = "Starting multi-resolution FFmpeg WASM transcode pipeline...";
      setStatusText(startMsg);
      addLog("info", startMsg);

      const result = await transcodeVideoToHls(
        selectedFile,
        ({ progress, message }) => {
          setProgress(progress);
          setStatusText(message);
          addLog("info", `[Progress ${progress}%] ${message}`);
        },
        appendFfmpegLog
      );

      setHlsResult(result);
      setStatus("converted");
      const successMsg = "Multi-Resolution Transcoding Successful! Generated 1080p, 720p, 480p renditions & master playlist.";
      setStatusText(successMsg);
      addLog("success", successMsg);
    } catch (err: any) {
      setStatus("error");
      const errMsg = `Conversion error: ${err?.message || "Transcoding failed"}`;
      setStatusText(errMsg);
      addLog("error", errMsg);
    }
  }, [selectedFile, validationResult, initEngine, addLog, appendFfmpegLog]);

  /**
   * Action 2 (Optional): Download Multi-Resolution HLS Package (.zip)
   */
  const downloadHls = useCallback(async () => {
    if (!hlsResult) return;

    try {
      const zipName = `${animeSlug}-ep${episodeNumber || "12"}-multi-hls.zip`;
      const msg = "Packaging multi-resolution HLS renditions into ZIP archive...";
      setStatusText(msg);
      addLog("info", msg);

      await downloadHlsPackageZip(hlsResult, zipName);
      const successMsg = `Downloaded ${zipName} successfully!`;
      setStatusText(successMsg);
      addLog("success", successMsg);
    } catch (err: any) {
      const errMsg = `Download error: ${err?.message || "ZIP generation failed"}`;
      setStatusText(errMsg);
      addLog("error", errMsg);
    }
  }, [hlsResult, animeSlug, episodeNumber, addLog]);

  /**
   * Action 3: Upload Multi-Resolution HLS Package to Storage API
   */
  const uploadHls = useCallback(async () => {
    if (!selectedFile) return;

    try {
      setStatus("uploading");
      setProgress(10);
      addLog("info", "Starting upload of multi-resolution HLS package to CDN storage...");

      const result = await uploadHlsPackage({
        animeSlug,
        episodeNumber,
        hlsResult,
        onProgress: (prog, msg) => {
          setProgress(prog);
          setStatusText(msg);
          addLog("info", `[Upload ${prog}%] ${msg}`);
        },
      });

      setProgress(100);
      setStatus("complete");
      setGeneratedUrl(result.url);
      const successMsg = "Multi-resolution HLS package successfully uploaded to CDN Storage!";
      setStatusText(successMsg);
      addLog("success", `${successMsg} URL: ${result.url}`);

      if (onUrlGenerated) {
        onUrlGenerated(result.url);
      }
    } catch (err: any) {
      setStatus("error");
      const errMsg = `Upload error: ${err?.message || "Network upload failed"}`;
      setStatusText(errMsg);
      addLog("error", errMsg);
    }
  }, [selectedFile, hlsResult, animeSlug, episodeNumber, onUrlGenerated, addLog]);

  return {
    selectedFile,
    validationResult,
    engineStatus,
    status,
    progress,
    statusText,
    generatedUrl,
    logs,
    clearLogs,
    copyLogsToClipboard,
    handleFileSelect,
    initEngine,
    convertVideo,
    downloadHls,
    uploadHls,
  };
}
