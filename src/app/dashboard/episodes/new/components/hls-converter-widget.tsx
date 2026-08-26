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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useHlsConverter } from "../hooks/use-hls-converter";
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    selectedFile,
    validationResult,
    engineStatus,
    status,
    progress,
    statusText,
    logs,
    stages,
    totalDuration,
    clearLogs,
    copyLogsToClipboard,
    handleFileSelect,
    initEngine,
    convertVideo,
    downloadHls,
    uploadHls,
  } = useHlsConverter({
    animeSlug,
    episodeNumber,
    onUrlGenerated,
  });

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileSelect(file);
  };

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
    (validationResult ? !validationResult.isValid : false);

  return (
    <div className="p-4 rounded-xl border border-border/60 bg-muted/20 space-y-4">
      {/* Header & Engine Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileVideo className="size-4 text-primary" />
          <span className="text-xs font-bold text-foreground">
            Client-Side Multi-Resolution HLS Converter
          </span>
        </div>
        <div className="flex items-center gap-2">
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
              Loading Core WASM...
            </Badge>
          )}
          {engineStatus === "ready" && (
            <Badge
              variant="outline"
              className="text-[10px] bg-emerald-500/10 text-emerald-500 border-emerald-500/20 gap-1"
            >
              <Cpu className="size-3" />
              WASM Engine Ready
            </Badge>
          )}
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="video/mp4,.mp4"
        onChange={onInputChange}
        className="hidden"
      />

      {/* File Drop & Select Area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border border-dashed border-border/80 hover:border-primary p-4 rounded-lg bg-card cursor-pointer transition-colors flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <Upload className="size-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-xs font-semibold text-foreground">
                {selectedFile ? selectedFile.name : "Select Local MP4 Master Video (.mp4)"}
              </p>
              {validationResult?.isValid && (
                <Badge className="bg-emerald-500/15 text-emerald-500 border-emerald-500/30 text-[9px] gap-1 px-1.5 h-4">
                  <ShieldCheck className="size-2.5" />
                  MP4 1080p Verified
                </Badge>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {selectedFile
                ? `${validationResult?.resolution || "Inspecting..."} • ${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`
                : "Mandatory format: MP4 (.mp4), Minimum master resolution: 1080p (1920x1080)"}
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" type="button" className="text-xs h-8">
          Browse File
        </Button>
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
              <span className="truncate">{statusText || "Processing video pipeline..."}</span>
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
              Transcoded 100%
            </Badge>
          </div>
          <div className="flex items-center gap-1.5 pt-1 border-t border-sky-500/20 text-[11px] text-muted-foreground">
            <span>Generated Renditions:</span>
            <Badge variant="outline" className="bg-background text-[10px] text-foreground font-mono">1080p</Badge>
            <Badge variant="outline" className="bg-background text-[10px] text-foreground font-mono">720p</Badge>
            <Badge variant="outline" className="bg-background text-[10px] text-foreground font-mono">480p</Badge>
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
              Convert
            </>
          ) : status === "converting" ? (
            <>
              <RefreshCw className="size-3.5 animate-spin" />
              Converting... {progress}%
            </>
          ) : status === "converted" ? (
            <>
              <ArrowUpRight className="size-3.5" />
              Upload
            </>
          ) : status === "uploading" ? (
            <>
              <RefreshCw className="size-3.5 animate-spin" />
              Uploading... {progress}%
            </>
          ) : status === "complete" ? (
            <>
              <CheckCircle2 className="size-3.5" />
              Upload Complete ✓
            </>
          ) : (
            <>
              <Play className="size-3.5" />
              Convert
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
