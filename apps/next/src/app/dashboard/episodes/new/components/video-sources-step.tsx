"use client";

import { Plus, Trash2, Server, CheckCircle2, Link2, Sparkles, Layers } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
    <div className="space-y-4 bg-card p-4 sm:p-6 rounded-xl border border-border/60 min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3 min-w-0">
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-foreground">Video Server Sources</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure primary internal HLS converter or add multi-quality backup mirror server sources.
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={onAddServer} className="gap-1.5 text-xs shrink-0 self-start sm:self-auto">
          <Plus className="size-4" />
          Add Server Source
        </Button>
      </div>

      <div className="space-y-4 min-w-0">
        {servers.map((srv, idx) => {
          const isDefaultPrimary = srv.isPrimary || idx === 0;

          if (isDefaultPrimary) {
            return (
              <div
                key={srv.id}
                className="p-3.5 sm:p-5 rounded-xl border border-primary/30 bg-primary/5 space-y-4 relative min-w-0 overflow-hidden"
              >
                <div className="flex items-center justify-between gap-2 min-w-0 flex-wrap">
                  <div className="flex items-center gap-2 min-w-0">
                    <Server className="size-4 text-primary shrink-0" />
                    <span className="text-sm font-semibold text-foreground truncate">
                      Primary HLS Storage (Auto-Transcoder)
                    </span>
                  </div>
                  <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] shrink-0">
                    <CheckCircle2 className="size-3 mr-1 inline" /> Primary Default
                  </Badge>
                </div>

                <div className="space-y-3 min-w-0">
                  <div className="flex items-center gap-1.5 text-xs text-primary font-semibold">
                    <Sparkles className="size-3.5 shrink-0" />
                    <span className="truncate">Internal Multi-Resolution HLS Converter & Object Storage Uploader</span>
                  </div>
                  <HlsConverterWidget
                    onUrlGenerated={(url) => onUpdateServer(srv.id, "url", url)}
                  />

                  {/* Auto-Generated Master Playlist CDN URL Success Banner (Read-Only) */}
                  {srv.url && (
                    <div className="p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/5 space-y-1.5 min-w-0 mt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="size-3.5" /> Auto-Generated Master Playlist CDN URL
                        </span>
                      </div>
                      <p className="text-xs font-mono text-foreground break-all select-all bg-background/60 p-2 rounded border border-border/40">
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
              className="p-3.5 sm:p-4 rounded-xl border border-border/60 bg-muted/10 space-y-4 relative min-w-0 overflow-hidden"
            >
              <div className="flex items-center justify-between gap-2 min-w-0">
                <div className="flex items-center gap-2 min-w-0 flex-wrap">
                  <Server className="size-4 text-muted-foreground shrink-0" />
                  <span className="text-sm font-semibold text-foreground truncate">
                    Backup Source #{idx} - {srv.name || "Mirror Server"}
                  </span>
                  <Badge variant="outline" className="text-[10px] font-semibold bg-background border-border/60">
                    {streamConfig.label}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveServer(srv.id)}
                  className="size-7 text-muted-foreground hover:text-destructive shrink-0"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>

              {/* Server Name & Stream Method Bar */}
              <div className="grid gap-3 sm:grid-cols-2 min-w-0">
                {/* Server Name Input */}
                <div className="space-y-1 min-w-0">
                  <Label className="text-[11px] font-medium text-muted-foreground">Server Name</Label>
                  <Input
                    placeholder="e.g. Backup Mirror Server 1"
                    value={srv.name}
                    onChange={(e) => onUpdateServer(srv.id, "name", e.target.value)}
                    className="h-8 text-xs border-border/60 w-full min-w-0"
                  />
                </div>

                {/* Stream Method Combobox / Select */}
                <div className="space-y-1 min-w-0">
                  <Label className="text-[11px] font-medium text-muted-foreground">Stream Method</Label>
                  <Select
                    value={srv.type}
                    onValueChange={(val) => val && onUpdateServer(srv.id, "type", val)}
                  >
                    <SelectTrigger className="h-8 text-xs border-border/60 w-full min-w-0">
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
              <div className="space-y-2 pt-1 min-w-0">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
                  <Layers className="size-3.5 shrink-0 text-primary" />
                  <span className="truncate">Multi-Quality Stream URLs ({streamConfig.label})</span>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 min-w-0">
                  {/* 1080p Full HD URL */}
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-medium text-foreground">1080p Full HD URL</span>
                      <Badge variant="outline" className="text-[9px] px-1 h-3.5">1080p</Badge>
                    </div>
                    <Input
                      placeholder={`https://example.com/stream/1080p${srv.type === 'hls' ? '.m3u8' : srv.type === 'mp4' ? '.mp4' : ''}`}
                      value={qualityUrls.url1080p || ""}
                      onChange={(e) => handleQualityUrlChange("url1080p", e.target.value)}
                      className="h-8 text-xs border-border/60 font-mono w-full min-w-0 truncate"
                    />
                  </div>

                  {/* 720p HD URL */}
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-medium text-foreground">720p HD URL</span>
                      <Badge variant="outline" className="text-[9px] px-1 h-3.5">720p</Badge>
                    </div>
                    <Input
                      placeholder={`https://example.com/stream/720p${srv.type === 'hls' ? '.m3u8' : srv.type === 'mp4' ? '.mp4' : ''}`}
                      value={qualityUrls.url720p || ""}
                      onChange={(e) => handleQualityUrlChange("url720p", e.target.value)}
                      className="h-8 text-xs border-border/60 font-mono w-full min-w-0 truncate"
                    />
                  </div>

                  {/* 480p SD URL */}
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-medium text-foreground">480p SD URL</span>
                      <Badge variant="outline" className="text-[9px] px-1 h-3.5">480p</Badge>
                    </div>
                    <Input
                      placeholder={`https://example.com/stream/480p${srv.type === 'hls' ? '.m3u8' : srv.type === 'mp4' ? '.mp4' : ''}`}
                      value={qualityUrls.url480p || ""}
                      onChange={(e) => handleQualityUrlChange("url480p", e.target.value)}
                      className="h-8 text-xs border-border/60 font-mono w-full min-w-0 truncate"
                    />
                  </div>

                  {/* 360p Mobile URL */}
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-medium text-foreground">360p Mobile URL</span>
                      <Badge variant="outline" className="text-[9px] px-1 h-3.5">360p</Badge>
                    </div>
                    <Input
                      placeholder={`https://example.com/stream/360p${srv.type === 'hls' ? '.m3u8' : srv.type === 'mp4' ? '.mp4' : ''}`}
                      value={qualityUrls.url360p || ""}
                      onChange={(e) => handleQualityUrlChange("url360p", e.target.value)}
                      className="h-8 text-xs border-border/60 font-mono w-full min-w-0 truncate"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Fill URL for available resolution qualities. None are strictly required, but filled fields will define the stream relation for this source method.
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
