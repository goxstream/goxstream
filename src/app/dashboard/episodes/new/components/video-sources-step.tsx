"use client";

import { Plus, Trash2, Server, CheckCircle2, Link2, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { HlsConverterWidget } from "./hls-converter-widget";
import { STREAM_TYPE_CONFIG } from "../constants";
import type { VideoServerSource } from "../types";

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
            Configure primary internal HLS video converter or add third-party embed & mirror links.
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

          // Backup Mirror Servers (Third-Party / Embeds)
          const streamConfig = STREAM_TYPE_CONFIG[srv.type] || STREAM_TYPE_CONFIG.hls;

          return (
            <div
              key={srv.id}
              className="p-3.5 sm:p-4 rounded-xl border border-border/60 bg-muted/10 space-y-4 relative min-w-0 overflow-hidden"
            >
              <div className="flex items-center justify-between gap-2 min-w-0">
                <div className="flex items-center gap-2 min-w-0 flex-wrap">
                  <Server className="size-4 text-muted-foreground shrink-0" />
                  <span className="text-sm font-semibold text-foreground truncate">
                    Backup Source #{idx} - {srv.name}
                  </span>
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

              <div className="grid gap-3 sm:grid-cols-3 min-w-0">
                {/* Server Name */}
                <div className="space-y-1 min-w-0">
                  <Label className="text-[11px] font-medium text-muted-foreground">Server Name</Label>
                  <Input
                    placeholder="e.g. Backup Mirror Server 1"
                    value={srv.name}
                    onChange={(e) => onUpdateServer(srv.id, "name", e.target.value)}
                    className="h-8 text-xs border-border/60 w-full min-w-0"
                  />
                </div>

                {/* Server Type */}
                <div className="space-y-1 min-w-0">
                  <Label className="text-[11px] font-medium text-muted-foreground">Stream Type</Label>
                  <Select
                    value={srv.type}
                    onValueChange={(val) => val && onUpdateServer(srv.id, "type", val)}
                  >
                    <SelectTrigger className="h-8 text-xs border-border/60 w-full min-w-0">
                      <SelectValue className="truncate" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hls">HLS (.m3u8)</SelectItem>
                      <SelectItem value="mp4">MP4 Direct</SelectItem>
                      <SelectItem value="embed">iFrame Embed (Third Party)</SelectItem>
                      <SelectItem value="dash">MPEG-DASH (.mpd)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Quality */}
                <div className="space-y-1 min-w-0">
                  <Label className="text-[11px] font-medium text-muted-foreground">Max Resolution</Label>
                  <Select
                    value={srv.quality}
                    onValueChange={(val) => val && onUpdateServer(srv.id, "quality", val)}
                  >
                    <SelectTrigger className="h-8 text-xs border-border/60 w-full min-w-0">
                      <SelectValue className="truncate" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1080p">1080p Full HD</SelectItem>
                      <SelectItem value="720p">720p HD</SelectItem>
                      <SelectItem value="480p">480p SD</SelectItem>
                      <SelectItem value="360p">360p Mobile</SelectItem>
                      <SelectItem value="auto">Adaptive Auto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Dynamic Stream URL Input per Selected Stream Type */}
                <div className="space-y-1 sm:col-span-3 pt-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
                    <Link2 className="size-3.5 shrink-0" />
                    <span className="truncate">{streamConfig.label}</span>
                  </div>
                  <Input
                    placeholder={streamConfig.placeholder}
                    value={srv.url}
                    onChange={(e) => onUpdateServer(srv.id, "url", e.target.value)}
                    className="h-8 text-xs border-border/60 font-mono w-full min-w-0 truncate"
                  />
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {streamConfig.hint}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
