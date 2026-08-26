"use client";

import Image from "next/image";
import { Play, Server, Globe, Volume2, Calendar, Eye, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { EpisodeItem } from "../types";

interface EpisodePreviewModalProps {
  episode: EpisodeItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EpisodePreviewModal({ episode, isOpen, onClose }: EpisodePreviewModalProps) {
  if (!episode) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[640px] border-border/60 bg-card p-6">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Episode #{episode.episodeNumber}
            </Badge>
            <DialogTitle className="text-lg font-bold text-foreground">
              {episode.title}
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-muted-foreground">
            {episode.animeTitle}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 my-2">
          {/* Mock Video Container */}
          <div className="relative aspect-video rounded-xl bg-black overflow-hidden border border-border/60 flex flex-col items-center justify-center group">
            <Image
              src={episode.thumbnail}
              alt={episode.title}
              fill
              className="object-cover opacity-60 group-hover:opacity-40 transition-opacity"
            />
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="size-14 rounded-full bg-primary/90 text-primary-foreground flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Play className="size-6 fill-primary-foreground ml-1" />
              </div>
              <p className="text-xs font-semibold text-white/90 bg-black/60 px-3 py-1 rounded-full border border-white/10">
                Preview Player Sandbox
              </p>
            </div>
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white/80 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{episode.servers[0]?.name || "Default Server"}</span>
              </div>
              <span>{episode.duration}</span>
            </div>
          </div>

          {/* Details Metadata */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-muted/30 p-3 rounded-lg border border-border/40">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="size-4 text-primary" />
              <span>Air Date: <strong className="text-foreground">{episode.airDate}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Eye className="size-4 text-primary" />
              <span>Total Views: <strong className="text-foreground">{episode.viewsCount.toLocaleString()}</strong></span>
            </div>
          </div>

          {/* Active Servers */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
              <Server className="size-3.5" /> Video Server Sources ({episode.servers.length})
            </h4>
            <div className="space-y-1.5">
              {episode.servers.map((srv) => (
                <div
                  key={srv.id}
                  className="flex items-center justify-between text-xs bg-muted/40 px-3 py-2 rounded-md border border-border/40"
                >
                  <div className="flex items-center gap-2">
                    <Check className="size-3.5 text-emerald-500" />
                    <span className="font-medium text-foreground">{srv.name}</span>
                    <Badge variant="outline" className="text-[10px] py-0">{srv.quality}</Badge>
                  </div>
                  <span className="text-muted-foreground font-mono">{srv.latencyMs}ms</span>
                </div>
              ))}
            </div>
          </div>

          {/* Subtitles & Audio */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                <Globe className="size-3.5" /> Subtitles
              </h4>
              <div className="flex flex-wrap gap-1">
                {episode.subtitles.map((sub) => (
                  <Badge key={sub.id} variant="secondary" className="text-xs">
                    {sub.language} ({sub.format.toUpperCase()})
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                <Volume2 className="size-3.5" /> Audio Tracks
              </h4>
              <div className="flex flex-wrap gap-1">
                {episode.audioTracks.map((aud) => (
                  <Badge key={aud.id} variant="outline" className="text-xs">
                    {aud.language} ({aud.type})
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="outline" onClick={onClose}>
            Close Preview
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
