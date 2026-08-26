"use client";

import { useState, useCallback, useEffect } from "react";
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
  type PipelineStage,
  type PipelineStageId,
  type EngineMode,
} from "../lib/hls";

export interface UseHlsConverterOptions {
  animeSlug?: string;
  episodeNumber?: string;
  onUrlGenerated?: (url: string) => void;
}

const INITIAL_STAGES: PipelineStage[] = [
  { id: "init", label: "Init & Verify", status: "pending" },
  { id: "1080p", label: "1080p Stream", status: "pending" },
  { id: "720p", label: "720p HD Scale", status: "pending" },
  { id: "480p", label: "480p SD Scale", status: "pending" },
  { id: "upload", label: "Upload CDN", status: "pending" },
];

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
  const [stages, setStages] = useState<PipelineStage[]>(INITIAL_STAGES);
  const [totalDuration, setTotalDuration] = useState(0);
  const [engineMode, setEngineModeState] = useState<EngineMode>("mt");

  const setEngineMode = useCallback((newMode: EngineMode) => {
    setEngineModeState(newMode);
    setEngineStatus("unloaded");
  }, []);

  // Active stage timer ticker
  useEffect(() => {
    const isPipelineActive = status === "converting" || status === "uploading" || engineStatus === "loading";
    if (!isPipelineActive) return;

    const timer = setInterval(() => {
      setTotalDuration((prev) => prev + 1);
      setStages((prevStages) =>
        prevStages.map((stg) => {
          if (stg.status === "running") {
            return {
              ...stg,
              durationSeconds: (stg.durationSeconds || 0) + 1,
            };
          }
          return stg;
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [status, engineStatus]);

  const updateStageStatus = useCallback(
    (stageId: PipelineStageId, newStatus: "running" | "completed" | "error") => {
      setStages((prevStages) =>
        prevStages.map((stg) => {
          if (stg.id === stageId) {
            return { ...stg, status: newStatus };
          }
          // When moving to a new running stage, complete any previous running stage
          if (newStatus === "running" && stg.status === "running" && stg.id !== stageId) {
            return { ...stg, status: "completed" };
          }
          return stg;
        })
      );
    },
    []
  );

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
      setStages(INITIAL_STAGES);
      setTotalDuration(0);
      return;
    }

    setSelectedFile(file);
    setStages(INITIAL_STAGES);
    setTotalDuration(0);
    updateStageStatus("init", "running");

    const initMsg = "Validating MP4 format & 1080p resolution...";
    setStatusText(initMsg);
    addLog("info", `File selected: ${file.name} (${(file.size / (1024 * 1024)).toFixed(1)} MB)`);

    const valResult = await validateVideoFile(file);
    setValidationResult(valResult);

    if (!valResult.isValid) {
      setStatus("error");
      updateStageStatus("init", "error");
      const err = valResult.errorMessage || "Validation failed.";
      setStatusText(err);
      addLog("error", `Validation error: ${err}`);
    } else {
      setStatus("ready");
      updateStageStatus("init", "completed");
      setProgress(0);
      const readyMsg = `Verified MP4 ${valResult.resolution}: ${file.name} (${(file.size / (1024 * 1024)).toFixed(1)} MB)`;
      setStatusText(readyMsg);
      addLog("success", readyMsg);
    }
  }, [addLog, updateStageStatus]);

  /**
   * Action: Manual Engine Initialization
   */
  const initEngine = useCallback(async () => {
    if (engineStatus === "ready" || engineStatus === "loading") return;

    try {
      setEngineStatus("loading");
      updateStageStatus("init", "running");
      const msg = "Initializing FFmpeg WebAssembly Core engine on-demand...";
      setStatusText(msg);
      addLog("info", msg);

      await loadFFmpegCore((coreMsg) => {
        setStatusText(coreMsg);
        addLog("info", coreMsg);
      }, engineMode);

      setEngineStatus("ready");
      updateStageStatus("init", "completed");
      const readyMsg = "FFmpeg WASM Core Engine ready.";
      setStatusText(readyMsg);
      addLog("success", readyMsg);
    } catch (err: any) {
      setEngineStatus("error");
      updateStageStatus("init", "error");
      const errMsg = `Engine load failed: ${err?.message || "Unknown error"}`;
      setStatusText(errMsg);
      addLog("error", errMsg);
    }
  }, [engineStatus, engineMode, addLog, updateStageStatus]);

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
        ({ progress, message, stageId }) => {
          setProgress(progress);
          setStatusText(message);
          if (stageId) {
            updateStageStatus(stageId, "running");
          }
        },
        appendFfmpegLog
      );

      // Complete 480p stage
      updateStageStatus("480p", "completed");

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
  }, [selectedFile, validationResult, initEngine, addLog, appendFfmpegLog, updateStageStatus]);

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
      updateStageStatus("upload", "running");
      setProgress(10);
      addLog("info", "Starting upload of multi-resolution HLS package to CDN storage...");

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
      updateStageStatus("upload", "completed");
      setGeneratedUrl(result.url);
      const successMsg = "Multi-resolution HLS package successfully uploaded to CDN Storage!";
      setStatusText(successMsg);
      addLog("success", `${successMsg} URL: ${result.url}`);

      if (onUrlGenerated) {
        onUrlGenerated(result.url);
      }
    } catch (err: any) {
      setStatus("error");
      updateStageStatus("upload", "error");
      const errMsg = `Upload error: ${err?.message || "Network upload failed"}`;
      setStatusText(errMsg);
      addLog("error", errMsg);
    }
  }, [selectedFile, hlsResult, animeSlug, episodeNumber, onUrlGenerated, addLog, updateStageStatus]);

  return {
    selectedFile,
    validationResult,
    engineStatus,
    status,
    progress,
    statusText,
    generatedUrl,
    logs,
    stages,
    totalDuration,
    engineMode,
    setEngineMode,
    clearLogs,
    copyLogsToClipboard,
    handleFileSelect,
    initEngine,
    convertVideo,
    downloadHls,
    uploadHls,
  };
}
