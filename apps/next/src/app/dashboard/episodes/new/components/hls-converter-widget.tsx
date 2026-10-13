"use client";

import { useRef } from "react";
import {
  Upload,
  FileVideo,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Play,
  ArrowUpRight,
  Cpu,
  Download,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useHlsConverter } from "../hooks/use-hls-converter";
import { isFFmpegMultiThreaded } from "../lib/hls";
import { ConversionLogDrawer } from "./conversion-log-drawer";
import { PipelineStageBar } from "./pipeline-stage-bar";

interface HlsConverterWidgetProps {
  animeSlug?: string;
  episodeNumber?: string;
  onUrlGenerated: (url: string) => void;
}

export function HlsConverterWidget({
  animeSlug,
  episodeNumber,
  onUrlGenerated,
}: HlsConverterWidgetProps) {
  const fileInput1080Ref = useRef<HTMLInputElement>(null);
  const fileInput720Ref = useRef<HTMLInputElement>(null);
  const fileInput480Ref = useRef<HTMLInputElement>(null);
  const fileInput360Ref = useRef<HTMLInputElement>(null);

  const {
    selectedFile,
    file720p,
    file480p,
    file360p,
    validationResult,
    engineStatus,
    status,
    progress,
    statusText,
    logs,
    stages,
    totalDuration,
    engineMode,
    setEngineMode,
    clearLogs,
    copyLogsToClipboard,
    handleFileSelect,
    handleFileSelect720p,
    handleFileSelect480p,
    handleFileSelect360p,
    initEngine,
    convertVideo,
    downloadHls,
    uploadHls,
  } = useHlsConverter({
    animeSlug,
    episodeNumber,
    onUrlGenerated,
  });

  const handlePrimaryButtonClick = () => {
    if (status === "ready" || status === "idle") {
      convertVideo();
    } else if (status === "converted") {
      uploadHls();
    }
  };

  const isConvertDisabled =
    status === "idle" ||
    status === "converting" ||
    status === "uploading" ||
    status === "complete" ||
    !selectedFile ||
    (validationResult ? !validationResult.isValid : false);

  return (
    <div className="p-4 rounded-xl border border-border/60 bg-muted/20 space-y-4">
      {/* Header & Engine Status */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <FileVideo className="size-4 text-primary" />
          <span className="text-xs font-bold text-foreground">
            Instant 4-Resolution HLS Converter (Stream Copy Pipeline)
          </span>
          <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-500 border-emerald-500/30 font-semibold gap-1">
            <Zap className="size-3 text-emerald-500" />
            Fast Stream Copy (&lt; 15s)
          </Badge>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Manual Engine Mode Toggle */}
          <div className="flex items-center gap-1 bg-background border border-border/60 rounded-lg p-0.5 text-[10px]">
            <button
              type="button"
              onClick={() => setEngineMode("st")}
              disabled={engineStatus === "loading" || status === "converting"}
              className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
                engineMode === "st"
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Single-Threaded
            </button>
            <button
              type="button"
              onClick={() => setEngineMode("mt")}
              disabled={engineStatus === "loading" || status === "converting"}
              className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
                engineMode === "mt"
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Multi-Threaded
            </button>
          </div>

          {engineStatus === "unloaded" && (
            <Badge
              variant="outline"
              onClick={initEngine}
              className="text-[10px] bg-muted/60 text-muted-foreground border-border/60 cursor-pointer hover:border-primary/50 transition-colors gap-1"
            >
              <Cpu className="size-3" />
              Core Unloaded (Click to Init)
            </Badge>
          )}
          {engineStatus === "loading" && (
            <Badge
              variant="outline"
              className="text-[10px] bg-amber-500/10 text-amber-500 border-amber-500/20 gap-1 animate-pulse"
            >
              <RefreshCw className="size-3 animate-spin" />
              Loading WASM Engine...
            </Badge>
          )}
          {engineStatus === "ready" && (
            <Badge
              variant="outline"
              className="text-[10px] bg-emerald-500/10 text-emerald-500 border-emerald-500/20 gap-1"
            >
              <Cpu className="size-3" />
              {isFFmpegMultiThreaded() ? "WASM MT Core Ready" : "WASM ST Core Ready"}
            </Badge>
          )}
        </div>
      </div>

      {/* File Inputs Grid: 1080p Master (Required), 720p HD (Optional), 480p SD (Optional), 360p Mobile (Optional) */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 min-w-0">
        {/* 1080p Master Slot */}
        <input
          type="file"
          ref={fileInput1080Ref}
          accept="video/mp4,.mp4"
          onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
          className="hidden"
        />
        <div
          onClick={() => fileInput1080Ref.current?.click()}
          className="border border-dashed border-primary/60 hover:border-primary p-3 rounded-lg bg-card cursor-pointer transition-colors space-y-2 min-w-0"
        >
          <div className="flex items-center justify-between gap-1">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5 truncate">
              <Upload className="size-3.5 text-primary shrink-0" /> 1080p Master
            </span>
            <Badge className="bg-primary/10 text-primary border-primary/20 text-[9px] px-1 h-4 shrink-0">
              Required
            </Badge>
          </div>
          <p className="text-[11px] text-muted-foreground truncate">
            {selectedFile ? selectedFile.name : "Select MP4 1080p Video"}
          </p>
          {selectedFile && (
            <p className="text-[10px] text-emerald-500 font-semibold truncate">
              {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB • Ready
            </p>
          )}
        </div>

        {/* 720p HD Slot (Optional) */}
        <input
          type="file"
          ref={fileInput720Ref}
          accept="video/mp4,.mp4"
          onChange={(e) => handleFileSelect720p(e.target.files?.[0] || null)}
          className="hidden"
        />
        <div
          onClick={() => fileInput720Ref.current?.click()}
          className="border border-dashed border-border/80 hover:border-primary p-3 rounded-lg bg-card cursor-pointer transition-colors space-y-2 min-w-0"
        >
          <div className="flex items-center justify-between gap-1">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5 truncate">
              <Upload className="size-3.5 text-muted-foreground shrink-0" /> 720p HD
            </span>
            <Badge variant="outline" className="text-[9px] text-muted-foreground px-1 h-4 shrink-0">
              Optional
            </Badge>
          </div>
          <p className="text-[11px] text-muted-foreground truncate">
            {file720p ? file720p.name : "Select MP4 720p Video"}
          </p>
          {file720p && (
            <p className="text-[10px] text-emerald-500 font-semibold truncate">
              {(file720p.size / (1024 * 1024)).toFixed(1)} MB • Ready
            </p>
          )}
        </div>

        {/* 480p SD Slot (Optional) */}
        <input
          type="file"
          ref={fileInput480Ref}
          accept="video/mp4,.mp4"
          onChange={(e) => handleFileSelect480p(e.target.files?.[0] || null)}
          className="hidden"
        />
        <div
          onClick={() => fileInput480Ref.current?.click()}
          className="border border-dashed border-border/80 hover:border-primary p-3 rounded-lg bg-card cursor-pointer transition-colors space-y-2 min-w-0"
        >
          <div className="flex items-center justify-between gap-1">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5 truncate">
              <Upload className="size-3.5 text-muted-foreground shrink-0" /> 480p SD
            </span>
            <Badge variant="outline" className="text-[9px] text-muted-foreground px-1 h-4 shrink-0">
              Optional
            </Badge>
          </div>
          <p className="text-[11px] text-muted-foreground truncate">
            {file480p ? file480p.name : "Select MP4 480p Video"}
          </p>
          {file480p && (
            <p className="text-[10px] text-emerald-500 font-semibold truncate">
              {(file480p.size / (1024 * 1024)).toFixed(1)} MB • Ready
            </p>
          )}
        </div>

        {/* 360p Mobile SD Slot (Optional) */}
        <input
          type="file"
          ref={fileInput360Ref}
          accept="video/mp4,.mp4"
          onChange={(e) => handleFileSelect360p(e.target.files?.[0] || null)}
          className="hidden"
        />
        <div
          onClick={() => fileInput360Ref.current?.click()}
          className="border border-dashed border-border/80 hover:border-primary p-3 rounded-lg bg-card cursor-pointer transition-colors space-y-2 min-w-0"
        >
          <div className="flex items-center justify-between gap-1">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5 truncate">
              <Upload className="size-3.5 text-muted-foreground shrink-0" /> 360p Mobile
            </span>
            <Badge variant="outline" className="text-[9px] text-muted-foreground px-1 h-4 shrink-0">
              Optional
            </Badge>
          </div>
          <p className="text-[11px] text-muted-foreground truncate">
            {file360p ? file360p.name : "Select MP4 360p Video"}
          </p>
          {file360p && (
            <p className="text-[10px] text-emerald-500 font-semibold truncate">
              {(file360p.size / (1024 * 1024)).toFixed(1)} MB • Ready
            </p>
          )}
        </div>
      </div>

      {/* Validation Failure Banner */}
      {validationResult && !validationResult.isValid && (
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-xs flex items-center gap-2 text-destructive font-medium">
          <AlertCircle className="size-4 shrink-0" />
          <span>{validationResult.errorMessage}</span>
        </div>
      )}

      {/* Progress & Status Log Banners */}
      {(status === "converting" || status === "uploading" || engineStatus === "loading") && (
        <div className="space-y-2 bg-card p-3 rounded-lg border border-border/40">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-muted-foreground flex items-center gap-1.5 truncate">
              <RefreshCw className="size-3.5 animate-spin text-primary shrink-0" />
              <span className="truncate">{statusText || "Processing Stream Copy pipeline..."}</span>
            </span>
            <span className="text-foreground font-bold shrink-0 ml-2">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {/* Converted Success Banner & Multi-Res Badges */}
      {status === "converted" && (
        <div className="p-3 rounded-lg bg-sky-500/10 border border-sky-500/20 text-xs space-y-2">
          <div className="flex items-center justify-between text-sky-500 font-medium">
            <div className="flex items-center gap-2 truncate">
              <CheckCircle2 className="size-4 shrink-0" />
              <span className="truncate">{statusText}</span>
            </div>
            <Badge className="bg-sky-500 text-black text-[10px] font-bold shrink-0 ml-2">
              Packaged 100% (&lt; 15s)
            </Badge>
          </div>
          <div className="flex items-center gap-1.5 pt-1 border-t border-sky-500/20 text-[11px] text-muted-foreground flex-wrap">
            <span>Active HLS Renditions:</span>
            <Badge variant="outline" className="bg-background text-[10px] text-foreground font-mono">1080p</Badge>
            {file720p && <Badge variant="outline" className="bg-background text-[10px] text-foreground font-mono">720p</Badge>}
            {file480p && <Badge variant="outline" className="bg-background text-[10px] text-foreground font-mono">480p</Badge>}
            {file360p && <Badge variant="outline" className="bg-background text-[10px] text-foreground font-mono">360p</Badge>}
          </div>
        </div>
      )}

      {/* Complete Banner */}
      {status === "complete" && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs flex items-center justify-between text-emerald-500 font-medium">
          <div className="flex items-center gap-2 truncate">
            <CheckCircle2 className="size-4 shrink-0" />
            <span className="truncate">{statusText}</span>
          </div>
          <Badge className="bg-emerald-500 text-black text-[10px] font-bold shrink-0 ml-2">
            Uploaded & Ready
          </Badge>
        </div>
      )}

      {/* Generic Error Banner */}
      {status === "error" && (!validationResult || validationResult.isValid) && (
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-xs flex items-center gap-2 text-destructive font-medium">
          <AlertCircle className="size-4 shrink-0" />
          <span>{statusText}</span>
        </div>
      )}

      {/* Cloudflare-Style Fluid Segmented Build Pipeline Bar */}
      {(status !== "idle" || stages.some((s) => s.status !== "pending")) && (
        <PipelineStageBar
          stages={stages}
          totalDurationSeconds={totalDuration}
        />
      )}

      {/* Conversion Log Terminal History Drawer */}
      <ConversionLogDrawer
        logs={logs}
        onClearLogs={clearLogs}
        onCopyLogs={copyLogsToClipboard}
      />

      {/* Action Button Workflow */}
      <div className="flex items-center justify-end gap-2 pt-1">
        {/* Optional Download Button when Transcoded */}
        {status === "converted" && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={downloadHls}
            className="gap-1.5 text-xs text-foreground border-border/80 hover:bg-muted"
          >
            <Download className="size-3.5 text-sky-500" />
            Download HLS (.zip)
          </Button>
        )}

        {/* Primary Action Button (Convert / Upload) */}
        <Button
          type="button"
          size="sm"
          onClick={handlePrimaryButtonClick}
          disabled={isConvertDisabled}
          className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 text-xs"
        >
          {status === "idle" || status === "ready" ? (
            <>
              <Play className="size-3.5" />
              Convert HLS (&lt; 15s)
            </>
          ) : status === "converting" ? (
            <>
              <RefreshCw className="size-3.5 animate-spin" />
              Packaging... {progress}%
            </>
          ) : status === "converted" ? (
            <>
              <ArrowUpRight className="size-3.5" />
              Upload to CDN
            </>
          ) : status === "uploading" ? (
            <>
              <RefreshCw className="size-3.5 animate-spin" />
              Uploading... {progress}%
            </>
          ) : status === "complete" ? (
            <>
              <CheckCircle2 className="size-3.5" />
              Upload Complete
            </>
          ) : (
            <>
              <Play className="size-3.5" />
              Convert HLS (&lt; 15s)
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
