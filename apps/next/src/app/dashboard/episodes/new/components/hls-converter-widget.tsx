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
    <div className="border-border/60 bg-muted/20 space-y-4 rounded-xl border p-4">
      {/* Header & Engine Status */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <FileVideo className="text-primary size-4" />
          <span className="text-foreground text-xs font-bold">
            Instant 4-Resolution HLS Converter (Stream Copy Pipeline)
          </span>
          <Badge
            variant="outline"
            className="gap-1 border-emerald-500/30 bg-emerald-500/10 text-[10px] font-semibold text-emerald-500"
          >
            <Zap className="size-3 text-emerald-500" />
            Fast Stream Copy (&lt; 15s)
          </Badge>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Manual Engine Mode Toggle */}
          <div className="bg-background border-border/60 flex items-center gap-1 rounded-lg border p-0.5 text-[10px]">
            <button
              type="button"
              onClick={() => setEngineMode("st")}
              disabled={engineStatus === "loading" || status === "converting"}
              className={`rounded-md px-2 py-0.5 font-medium transition-colors ${
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
              className={`rounded-md px-2 py-0.5 font-medium transition-colors ${
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
              className="bg-muted/60 text-muted-foreground border-border/60 hover:border-primary/50 cursor-pointer gap-1 text-[10px] transition-colors"
            >
              <Cpu className="size-3" />
              Core Unloaded (Click to Init)
            </Badge>
          )}
          {engineStatus === "loading" && (
            <Badge
              variant="outline"
              className="animate-pulse gap-1 border-amber-500/20 bg-amber-500/10 text-[10px] text-amber-500"
            >
              <RefreshCw className="size-3 animate-spin" />
              Loading WASM Engine...
            </Badge>
          )}
          {engineStatus === "ready" && (
            <Badge
              variant="outline"
              className="gap-1 border-emerald-500/20 bg-emerald-500/10 text-[10px] text-emerald-500"
            >
              <Cpu className="size-3" />
              {isFFmpegMultiThreaded() ? "WASM MT Core Ready" : "WASM ST Core Ready"}
            </Badge>
          )}
        </div>
      </div>

      {/* File Inputs Grid: 1080p Master (Required), 720p HD (Optional), 480p SD (Optional), 360p Mobile (Optional) */}
      <div className="grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
          className="border-primary/60 hover:border-primary bg-card min-w-0 cursor-pointer space-y-2 rounded-lg border border-dashed p-3 transition-colors"
        >
          <div className="flex items-center justify-between gap-1">
            <span className="text-foreground flex items-center gap-1.5 truncate text-xs font-bold">
              <Upload className="text-primary size-3.5 shrink-0" /> 1080p Master
            </span>
            <Badge className="bg-primary/10 text-primary border-primary/20 h-4 shrink-0 px-1 text-[9px]">
              Required
            </Badge>
          </div>
          <p className="text-muted-foreground truncate text-[11px]">
            {selectedFile ? selectedFile.name : "Select MP4 1080p Video"}
          </p>
          {selectedFile && (
            <p className="truncate text-[10px] font-semibold text-emerald-500">
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
          className="border-border/80 hover:border-primary bg-card min-w-0 cursor-pointer space-y-2 rounded-lg border border-dashed p-3 transition-colors"
        >
          <div className="flex items-center justify-between gap-1">
            <span className="text-foreground flex items-center gap-1.5 truncate text-xs font-bold">
              <Upload className="text-muted-foreground size-3.5 shrink-0" /> 720p HD
            </span>
            <Badge variant="outline" className="text-muted-foreground h-4 shrink-0 px-1 text-[9px]">
              Optional
            </Badge>
          </div>
          <p className="text-muted-foreground truncate text-[11px]">
            {file720p ? file720p.name : "Select MP4 720p Video"}
          </p>
          {file720p && (
            <p className="truncate text-[10px] font-semibold text-emerald-500">
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
          className="border-border/80 hover:border-primary bg-card min-w-0 cursor-pointer space-y-2 rounded-lg border border-dashed p-3 transition-colors"
        >
          <div className="flex items-center justify-between gap-1">
            <span className="text-foreground flex items-center gap-1.5 truncate text-xs font-bold">
              <Upload className="text-muted-foreground size-3.5 shrink-0" /> 480p SD
            </span>
            <Badge variant="outline" className="text-muted-foreground h-4 shrink-0 px-1 text-[9px]">
              Optional
            </Badge>
          </div>
          <p className="text-muted-foreground truncate text-[11px]">
            {file480p ? file480p.name : "Select MP4 480p Video"}
          </p>
          {file480p && (
            <p className="truncate text-[10px] font-semibold text-emerald-500">
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
          className="border-border/80 hover:border-primary bg-card min-w-0 cursor-pointer space-y-2 rounded-lg border border-dashed p-3 transition-colors"
        >
          <div className="flex items-center justify-between gap-1">
            <span className="text-foreground flex items-center gap-1.5 truncate text-xs font-bold">
              <Upload className="text-muted-foreground size-3.5 shrink-0" /> 360p Mobile
            </span>
            <Badge variant="outline" className="text-muted-foreground h-4 shrink-0 px-1 text-[9px]">
              Optional
            </Badge>
          </div>
          <p className="text-muted-foreground truncate text-[11px]">
            {file360p ? file360p.name : "Select MP4 360p Video"}
          </p>
          {file360p && (
            <p className="truncate text-[10px] font-semibold text-emerald-500">
              {(file360p.size / (1024 * 1024)).toFixed(1)} MB • Ready
            </p>
          )}
        </div>
      </div>

      {/* Validation Failure Banner */}
      {validationResult && !validationResult.isValid && (
        <div className="bg-destructive/10 border-destructive/20 text-destructive flex items-center gap-2 rounded-lg border p-3 text-xs font-medium">
          <AlertCircle className="size-4 shrink-0" />
          <span>{validationResult.errorMessage}</span>
        </div>
      )}

      {/* Progress & Status Log Banners */}
      {(status === "converting" || status === "uploading" || engineStatus === "loading") && (
        <div className="bg-card border-border/40 space-y-2 rounded-lg border p-3">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-muted-foreground flex items-center gap-1.5 truncate">
              <RefreshCw className="text-primary size-3.5 shrink-0 animate-spin" />
              <span className="truncate">{statusText || "Processing Stream Copy pipeline..."}</span>
            </span>
            <span className="text-foreground ml-2 shrink-0 font-bold">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {/* Converted Success Banner & Multi-Res Badges */}
      {status === "converted" && (
        <div className="space-y-2 rounded-lg border border-sky-500/20 bg-sky-500/10 p-3 text-xs">
          <div className="flex items-center justify-between font-medium text-sky-500">
            <div className="flex items-center gap-2 truncate">
              <CheckCircle2 className="size-4 shrink-0" />
              <span className="truncate">{statusText}</span>
            </div>
            <Badge className="ml-2 shrink-0 bg-sky-500 text-[10px] font-bold text-black">
              Packaged 100% (&lt; 15s)
            </Badge>
          </div>
          <div className="text-muted-foreground flex flex-wrap items-center gap-1.5 border-t border-sky-500/20 pt-1 text-[11px]">
            <span>Active HLS Renditions:</span>
            <Badge
              variant="outline"
              className="bg-background text-foreground font-mono text-[10px]"
            >
              1080p
            </Badge>
            {file720p && (
              <Badge
                variant="outline"
                className="bg-background text-foreground font-mono text-[10px]"
              >
                720p
              </Badge>
            )}
            {file480p && (
              <Badge
                variant="outline"
                className="bg-background text-foreground font-mono text-[10px]"
              >
                480p
              </Badge>
            )}
            {file360p && (
              <Badge
                variant="outline"
                className="bg-background text-foreground font-mono text-[10px]"
              >
                360p
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Complete Banner */}
      {status === "complete" && (
        <div className="flex items-center justify-between rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs font-medium text-emerald-500">
          <div className="flex items-center gap-2 truncate">
            <CheckCircle2 className="size-4 shrink-0" />
            <span className="truncate">{statusText}</span>
          </div>
          <Badge className="ml-2 shrink-0 bg-emerald-500 text-[10px] font-bold text-black">
            Uploaded & Ready
          </Badge>
        </div>
      )}

      {/* Generic Error Banner */}
      {status === "error" && (!validationResult || validationResult.isValid) && (
        <div className="bg-destructive/10 border-destructive/20 text-destructive flex items-center gap-2 rounded-lg border p-3 text-xs font-medium">
          <AlertCircle className="size-4 shrink-0" />
          <span>{statusText}</span>
        </div>
      )}

      {/* Cloudflare-Style Fluid Segmented Build Pipeline Bar */}
      {(status !== "idle" || stages.some((s) => s.status !== "pending")) && (
        <PipelineStageBar stages={stages} totalDurationSeconds={totalDuration} />
      )}

      {/* Conversion Log Terminal History Drawer */}
      <ConversionLogDrawer logs={logs} onClearLogs={clearLogs} onCopyLogs={copyLogsToClipboard} />

      {/* Action Button Workflow */}
      <div className="flex items-center justify-end gap-2 pt-1">
        {/* Optional Download Button when Transcoded */}
        {status === "converted" && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={downloadHls}
            className="text-foreground border-border/80 hover:bg-muted gap-1.5 text-xs"
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
          className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 text-xs"
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
