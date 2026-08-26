"use client";

import { Plus, Trash2, Server, CheckCircle2, Link2, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { HlsConverterWidget } from "./hls-converter-widget";
import type { VideoServerSource } from "../../types";

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
    <div className="space-y-4 bg-card p-6 rounded-xl border border-border/60">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div>
          <h3 className="text-base font-semibold text-foreground">Video Server Sources</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure default internal HLS video converter or add third-party embed & mirror links.
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={onAddServer} className="gap-1.5 text-xs">
          <Plus className="size-4" />
          Add Server Source
        </Button>
      </div>

      <div className="space-y-4">
        {servers.map((srv, idx) => {
          const isDefaultServer = srv.isPrimary || srv.name.toLowerCase().includes("default") || srv.name.toLowerCase().includes("r2");

          return (
            <div
              key={srv.id}
              className="p-4 rounded-xl border border-border/60 bg-muted/10 space-y-4 relative"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Server className="size-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">
                    Source #{idx + 1} - {srv.name}
                  </span>
                  {srv.isPrimary && (
                    <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px]">
                      <CheckCircle2 className="size-3 mr-1 inline" /> Primary Default
                    </Badge>
                  )}
                </div>
                {servers.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveServer(srv.id)}
                    className="size-7 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                )}
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {/* Server Name */}
                <div className="space-y-1">
                  <Label className="text-[11px] font-medium text-muted-foreground">Server Name</Label>
                  <Input
                    placeholder="e.g. Cloudflare R2 HLS"
                    value={srv.name}
                    onChange={(e) => onUpdateServer(srv.id, "name", e.target.value)}
                    className="h-8 text-xs border-border/60"
                  />
                </div>

                {/* Server Type */}
                <div className="space-y-1">
                  <Label className="text-[11px] font-medium text-muted-foreground">Stream Type</Label>
                  <Select
                    value={srv.type}
                    onValueChange={(val) => val && onUpdateServer(srv.id, "type", val)}
                  >
                    <SelectTrigger className="h-8 text-xs border-border/60">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hls">HLS (.m3u8 Default)</SelectItem>
                      <SelectItem value="mp4">MP4 Direct</SelectItem>
                      <SelectItem value="embed">iFrame Embed (Third Party)</SelectItem>
                      <SelectItem value="dash">MPEG-DASH (.mpd)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Quality */}
                <div className="space-y-1">
                  <Label className="text-[11px] font-medium text-muted-foreground">Max Resolution</Label>
                  <Select
                    value={srv.quality}
                    onValueChange={(val) => val && onUpdateServer(srv.id, "quality", val)}
                  >
                    <SelectTrigger className="h-8 text-xs border-border/60">
                      <SelectValue />
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

                {/* Server Storage Mode Widget or Raw URL Input */}
                <div className="space-y-2 sm:col-span-3 pt-1">
                  {isDefaultServer ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-1.5 text-xs text-primary font-semibold">
                        <Sparkles className="size-3.5" />
                        <span>Default Internal Storage HLS Converter</span>
                      </div>
                      <HlsConverterWidget
                        onUrlGenerated={(url) => onUpdateServer(srv.id, "url", url)}
                      />
                      <div className="space-y-1">
                        <Label className="text-[11px] font-medium text-muted-foreground">Master Playlist CDN URL</Label>
                        <Input
                          placeholder="https://cdn.goxstream.tv/hls/master.m3u8"
                          value={srv.url}
                          onChange={(e) => onUpdateServer(srv.id, "url", e.target.value)}
                          className="h-8 text-xs border-border/60 font-mono"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
                        <Link2 className="size-3.5" />
                        <span>Third-Party Embed / Raw Mirror Stream URL</span>
                      </div>
                      <Input
                        placeholder="https://embed.stream/v/12345 or https://bunny.cdn/..."
                        value={srv.url}
                        onChange={(e) => onUpdateServer(srv.id, "url", e.target.value)}
                        className="h-8 text-xs border-border/60 font-mono"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
