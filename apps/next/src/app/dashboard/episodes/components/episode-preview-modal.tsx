"use client";

import Image from "next/image";
import { Play, Server, Globe, Volume2, Calendar, Eye, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
      <DialogContent className="border-border/60 bg-card p-6 sm:max-w-[640px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Episode #{episode.episodeNumber}
            </Badge>
            <DialogTitle className="text-foreground text-lg font-bold">{episode.title}</DialogTitle>
          </div>
          <DialogDescription className="text-muted-foreground text-sm">
            {episode.animeTitle}
          </DialogDescription>
        </DialogHeader>

        <div className="my-2 space-y-5">
          {/* Mock Video Container */}
          <div className="border-border/60 group relative flex aspect-video flex-col items-center justify-center overflow-hidden rounded-xl border bg-black">
            <Image
              src={episode.thumbnail}
              alt={episode.title}
              fill
              className="object-cover opacity-60 transition-opacity group-hover:opacity-40"
            />
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="bg-primary/90 text-primary-foreground flex size-14 items-center justify-center rounded-full shadow-lg transition-transform group-hover:scale-110">
                <Play className="fill-primary-foreground ml-1 size-6" />
              </div>
              <p className="rounded-full border border-white/10 bg-black/60 px-3 py-1 text-xs font-semibold text-white/90">
                Preview Player Sandbox
              </p>
            </div>
            <div className="absolute right-3 bottom-3 left-3 flex items-center justify-between rounded-lg border border-white/10 bg-black/70 px-3 py-1.5 text-xs text-white/80 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <span className="size-2 animate-pulse rounded-full bg-emerald-500" />
                <span>{episode.servers[0]?.name || "Default Server"}</span>
              </div>
              <span>{episode.duration}</span>
            </div>
          </div>

          {/* Details Metadata */}
          <div className="bg-muted/30 border-border/40 grid grid-cols-2 gap-4 rounded-lg border p-3 text-xs">
            <div className="text-muted-foreground flex items-center gap-2">
              <Calendar className="text-primary size-4" />
              <span>
                Air Date: <strong className="text-foreground">{episode.airDate}</strong>
              </span>
            </div>
            <div className="text-muted-foreground flex items-center gap-2">
              <Eye className="text-primary size-4" />
              <span>
                Total Views:{" "}
                <strong className="text-foreground">{episode.viewsCount.toLocaleString()}</strong>
              </span>
            </div>
          </div>

          {/* Active Servers */}
          <div>
            <h4 className="text-muted-foreground mb-2 flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase">
              <Server className="size-3.5" /> Video Server Sources ({episode.servers.length})
            </h4>
            <div className="space-y-1.5">
              {episode.servers.map((srv) => (
                <div
                  key={srv.id}
                  className="bg-muted/40 border-border/40 flex items-center justify-between rounded-md border px-3 py-2 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <Check className="size-3.5 text-emerald-500" />
                    <span className="text-foreground font-medium">{srv.name}</span>
                    <Badge variant="outline" className="py-0 text-[10px]">
                      {srv.quality}
                    </Badge>
                  </div>
                  <span className="text-muted-foreground font-mono">{srv.latencyMs}ms</span>
                </div>
              ))}
            </div>
          </div>

          {/* Subtitles & Audio */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-muted-foreground mb-2 flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase">
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
              <h4 className="text-muted-foreground mb-2 flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase">
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
