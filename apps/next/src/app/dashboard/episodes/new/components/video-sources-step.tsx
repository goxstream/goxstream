"use client";

import { Plus, Trash2, Server, CheckCircle2, Link2, Sparkles, Layers } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { HlsConverterWidget } from "./hls-converter-widget";
import { STREAM_TYPE_CONFIG } from "../constants";
import type { VideoServerSource, QualityUrls } from "../types";

interface VideoSourcesStepProps {
  servers: VideoServerSource[];
  onAddServer: () => void;
  onRemoveServer: (id: string) => void;
  onUpdateServer: (id: string, key: keyof VideoServerSource, value: any) => void;
}

export function VideoSourcesStep({
  servers,
  onAddServer,
  onRemoveServer,
  onUpdateServer,
}: VideoSourcesStepProps) {
  return (
    <div className="bg-card border-border/60 min-w-0 space-y-4 rounded-xl border p-4 sm:p-6">
      <div className="border-border/60 flex min-w-0 flex-col justify-between gap-3 border-b pb-3 sm:flex-row sm:items-center">
        <div className="min-w-0">
          <h3 className="text-foreground text-base font-semibold">Video Server Sources</h3>
          <p className="text-muted-foreground mt-0.5 text-xs">
            Configure primary internal HLS converter or add multi-quality backup mirror server
            sources.
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={onAddServer}
          className="shrink-0 gap-1.5 self-start text-xs sm:self-auto"
        >
          <Plus className="size-4" />
          Add Server Source
        </Button>
      </div>

      <div className="min-w-0 space-y-4">
        {servers.map((srv, idx) => {
          const isDefaultPrimary = srv.isPrimary || idx === 0;

          if (isDefaultPrimary) {
            return (
              <div
                key={srv.id}
                className="border-primary/30 bg-primary/5 relative min-w-0 space-y-4 overflow-hidden rounded-xl border p-3.5 sm:p-5"
              >
                <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <Server className="text-primary size-4 shrink-0" />
                    <span className="text-foreground truncate text-sm font-semibold">
                      Primary HLS Storage (Auto-Transcoder)
                    </span>
                  </div>
                  <Badge className="bg-primary/10 text-primary border-primary/20 shrink-0 text-[10px]">
                    <CheckCircle2 className="mr-1 inline size-3" /> Primary Default
                  </Badge>
                </div>

                <div className="min-w-0 space-y-3">
                  <div className="text-primary flex items-center gap-1.5 text-xs font-semibold">
                    <Sparkles className="size-3.5 shrink-0" />
                    <span className="truncate">
                      Internal Multi-Resolution HLS Converter & Object Storage Uploader
                    </span>
                  </div>
                  <HlsConverterWidget
                    onUrlGenerated={(url) => onUpdateServer(srv.id, "url", url)}
                  />

                  {/* Auto-Generated Master Playlist CDN URL Success Banner (Read-Only) */}
                  {srv.url && (
                    <div className="mt-3 min-w-0 space-y-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="size-3.5" /> Auto-Generated Master Playlist CDN
                          URL
                        </span>
                      </div>
                      <p className="text-foreground bg-background/60 border-border/40 rounded border p-2 font-mono text-xs break-all select-all">
                        {srv.url}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          }

          // Backup Mirror Server (1 Source Method = All 4 Qualities)
          const streamConfig = STREAM_TYPE_CONFIG[srv.type] || STREAM_TYPE_CONFIG.hls;
          const qualityUrls: QualityUrls = srv.qualityUrls || {
            url1080p: srv.url || "",
            url720p: "",
            url480p: "",
            url360p: "",
          };

          const handleQualityUrlChange = (key: keyof QualityUrls, val: string) => {
            const updated = {
              ...qualityUrls,
              [key]: val,
            };
            onUpdateServer(srv.id, "qualityUrls", updated);
            if (key === "url1080p" || !srv.url) {
              onUpdateServer(srv.id, "url", val);
            }
          };

          return (
            <div
              key={srv.id}
              className="border-border/60 bg-muted/10 relative min-w-0 space-y-4 overflow-hidden rounded-xl border p-3.5 sm:p-4"
            >
              <div className="flex min-w-0 items-center justify-between gap-2">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <Server className="text-muted-foreground size-4 shrink-0" />
                  <span className="text-foreground truncate text-sm font-semibold">
                    Backup Source #{idx} - {srv.name || "Mirror Server"}
                  </span>
                  <Badge
                    variant="outline"
                    className="bg-background border-border/60 text-[10px] font-semibold"
                  >
                    {streamConfig.label}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveServer(srv.id)}
                  className="text-muted-foreground hover:text-destructive size-7 shrink-0"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>

              {/* Server Name & Stream Method Bar */}
              <div className="grid min-w-0 gap-3 sm:grid-cols-2">
                {/* Server Name Input */}
                <div className="min-w-0 space-y-1">
                  <Label className="text-muted-foreground text-[11px] font-medium">
                    Server Name
                  </Label>
                  <Input
                    placeholder="e.g. Backup Mirror Server 1"
                    value={srv.name}
                    onChange={(e) => onUpdateServer(srv.id, "name", e.target.value)}
                    className="border-border/60 h-8 w-full min-w-0 text-xs"
                  />
                </div>

                {/* Stream Method Combobox / Select */}
                <div className="min-w-0 space-y-1">
                  <Label className="text-muted-foreground text-[11px] font-medium">
                    Stream Method
                  </Label>
                  <Select
                    value={srv.type}
                    onValueChange={(val) => val && onUpdateServer(srv.id, "type", val)}
                  >
                    <SelectTrigger className="border-border/60 h-8 w-full min-w-0 text-xs">
                      <SelectValue className="truncate" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hls">HLS (.m3u8)</SelectItem>
                      <SelectItem value="mp4">MP4 Direct Video</SelectItem>
                      <SelectItem value="embed">iFrame Embed (Third Party)</SelectItem>
                      <SelectItem value="dash">MPEG-DASH (.mpd)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* 4 Multi-Quality URL Input Grid (1080p, 720p, 480p, 360p) */}
              <div className="min-w-0 space-y-2 pt-1">
                <div className="text-muted-foreground flex items-center gap-1.5 text-xs font-semibold">
                  <Layers className="text-primary size-3.5 shrink-0" />
                  <span className="truncate">Multi-Quality Stream URLs ({streamConfig.label})</span>
                </div>

                <div className="grid min-w-0 gap-3 sm:grid-cols-2">
                  {/* 1080p Full HD URL */}
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-foreground font-medium">1080p Full HD URL</span>
                      <Badge variant="outline" className="h-3.5 px-1 text-[9px]">
                        1080p
                      </Badge>
                    </div>
                    <Input
                      placeholder={`https://example.com/stream/1080p${srv.type === "hls" ? ".m3u8" : srv.type === "mp4" ? ".mp4" : ""}`}
                      value={qualityUrls.url1080p || ""}
                      onChange={(e) => handleQualityUrlChange("url1080p", e.target.value)}
                      className="border-border/60 h-8 w-full min-w-0 truncate font-mono text-xs"
                    />
                  </div>

                  {/* 720p HD URL */}
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-foreground font-medium">720p HD URL</span>
                      <Badge variant="outline" className="h-3.5 px-1 text-[9px]">
                        720p
                      </Badge>
                    </div>
                    <Input
                      placeholder={`https://example.com/stream/720p${srv.type === "hls" ? ".m3u8" : srv.type === "mp4" ? ".mp4" : ""}`}
                      value={qualityUrls.url720p || ""}
                      onChange={(e) => handleQualityUrlChange("url720p", e.target.value)}
                      className="border-border/60 h-8 w-full min-w-0 truncate font-mono text-xs"
                    />
                  </div>

                  {/* 480p SD URL */}
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-foreground font-medium">480p SD URL</span>
                      <Badge variant="outline" className="h-3.5 px-1 text-[9px]">
                        480p
                      </Badge>
                    </div>
                    <Input
                      placeholder={`https://example.com/stream/480p${srv.type === "hls" ? ".m3u8" : srv.type === "mp4" ? ".mp4" : ""}`}
                      value={qualityUrls.url480p || ""}
                      onChange={(e) => handleQualityUrlChange("url480p", e.target.value)}
                      className="border-border/60 h-8 w-full min-w-0 truncate font-mono text-xs"
                    />
                  </div>

                  {/* 360p Mobile URL */}
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-foreground font-medium">360p Mobile URL</span>
                      <Badge variant="outline" className="h-3.5 px-1 text-[9px]">
                        360p
                      </Badge>
                    </div>
                    <Input
                      placeholder={`https://example.com/stream/360p${srv.type === "hls" ? ".m3u8" : srv.type === "mp4" ? ".mp4" : ""}`}
                      value={qualityUrls.url360p || ""}
                      onChange={(e) => handleQualityUrlChange("url360p", e.target.value)}
                      className="border-border/60 h-8 w-full min-w-0 truncate font-mono text-xs"
                    />
                  </div>
                </div>
                <p className="text-muted-foreground mt-1 text-[11px]">
                  Fill URL for available resolution qualities. None are strictly required, but
                  filled fields will define the stream relation for this source method.
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
