"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Play,
  MoreHorizontal,
  Edit,
  Trash2,
  Lock,
  Server,
  Globe,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { EpisodeItem, EpisodeStatus, ServerHealth } from "../types";

interface EpisodeTableProps {
  episodes: EpisodeItem[];
  onPreview: (episode: EpisodeItem) => void;
  onDelete: (id: string) => void;
}

function renderStatusBadge(status: EpisodeStatus) {
  switch (status) {
    case "published":
      return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-normal">Published</Badge>;
    case "scheduled":
      return <Badge className="bg-sky-500/10 text-sky-500 border-sky-500/20 font-normal">Scheduled</Badge>;
    case "draft":
      return <Badge variant="secondary" className="font-normal">Draft</Badge>;
    case "processing":
      return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 font-normal">Processing</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

function renderServerHealthIcon(health: ServerHealth) {
  switch (health) {
    case "online":
      return <CheckCircle className="size-3.5 text-emerald-500 inline mr-1" />;
    case "degraded":
      return <AlertCircle className="size-3.5 text-amber-500 inline mr-1" />;
    case "offline":
      return <XCircle className="size-3.5 text-destructive inline mr-1" />;
  }
}

export function EpisodeTable({ episodes, onPreview, onDelete }: EpisodeTableProps) {
  if (episodes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-card border border-border/60 rounded-xl">
        <Server className="size-12 text-muted-foreground/50 mb-3" />
        <h3 className="text-lg font-semibold text-foreground">No episodes found</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm">
          Try adjusting your search filter or add a new episode to your catalog.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-border/60 hover:bg-transparent">
            <TableHead className="w-[80px]">Ep #</TableHead>
            <TableHead className="min-w-[280px]">Episode Info</TableHead>
            <TableHead className="min-w-[180px]">Anime Series</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Active Servers</TableHead>
            <TableHead>Subtitles</TableHead>
            <TableHead className="text-right">Views</TableHead>
            <TableHead className="w-[60px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {episodes.map((ep) => (
            <TableRow key={ep.id} className="border-border/60 hover:bg-muted/40">
              {/* Ep Number */}
              <TableCell className="font-bold text-foreground">
                #{ep.episodeNumber}
              </TableCell>

              {/* Episode Info */}
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="relative size-14 rounded-lg overflow-hidden shrink-0 bg-muted border border-border/60 group">
                    <Image
                      src={ep.thumbnail}
                      alt={ep.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="56px"
                    />
                    <button
                      onClick={() => onPreview(ep)}
                      className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Preview Episode"
                    >
                      <Play className="size-5 text-white fill-white" />
                    </button>
                    {ep.isVip && (
                      <span className="absolute top-1 left-1 bg-amber-500 text-black p-0.5 rounded text-[10px] font-bold">
                        <Lock className="size-2.5 inline" />
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-foreground line-clamp-1">
                        {ep.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <span>{ep.duration}</span>
                      <span>•</span>
                      <span>Aired: {ep.airDate}</span>
                    </div>
                  </div>
                </div>
              </TableCell>

              {/* Anime Title */}
              <TableCell className="text-sm font-medium text-muted-foreground line-clamp-1 max-w-[200px]">
                {ep.animeTitle}
              </TableCell>

              {/* Status */}
              <TableCell>{renderStatusBadge(ep.status)}</TableCell>

              {/* Servers */}
              <TableCell>
                <div className="flex items-center gap-1.5 text-xs font-medium">
                  {ep.servers.map((srv) => (
                    <span
                      key={srv.id}
                      className="inline-flex items-center px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border/40"
                      title={`${srv.name} (${srv.quality}) - ${srv.health}`}
                    >
                      {renderServerHealthIcon(srv.health)}
                      {srv.quality}
                    </span>
                  ))}
                  {ep.servers.length === 0 && (
                    <span className="text-xs text-destructive flex items-center gap-1">
                      <XCircle className="size-3.5" /> No servers
                    </span>
                  )}
                </div>
              </TableCell>

              {/* Subtitles */}
              <TableCell>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Globe className="size-3.5 text-primary" />
                  <span>
                    {ep.subtitles.length > 0
                      ? ep.subtitles.map((s) => s.code.toUpperCase()).join(", ")
                      : "None"}
                  </span>
                </div>
              </TableCell>

              {/* Views */}
              <TableCell className="text-right font-medium text-foreground text-sm">
                {ep.viewsCount.toLocaleString()}
              </TableCell>

              {/* Actions */}
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button variant="ghost" size="icon" className="size-8">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    }
                  />
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Episode Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onPreview(ep)}>
                      <Play className="size-4 mr-2 text-primary" />
                      Quick Preview
                    </DropdownMenuItem>
                    <Link href={`/dashboard/episodes/new?edit=${ep.id}`}>
                      <DropdownMenuItem>
                        <Edit className="size-4 mr-2" />
                        Edit Details
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDelete(ep.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="size-4 mr-2" />
                      Delete Episode
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
