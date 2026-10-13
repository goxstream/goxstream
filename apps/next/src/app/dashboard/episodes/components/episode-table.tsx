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
      return (
        <Badge className="border-emerald-500/20 bg-emerald-500/10 font-normal text-emerald-500">
          Published
        </Badge>
      );
    case "scheduled":
      return (
        <Badge className="border-sky-500/20 bg-sky-500/10 font-normal text-sky-500">
          Scheduled
        </Badge>
      );
    case "draft":
      return (
        <Badge variant="secondary" className="font-normal">
          Draft
        </Badge>
      );
    case "processing":
      return (
        <Badge className="border-amber-500/20 bg-amber-500/10 font-normal text-amber-500">
          Processing
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

function renderServerHealthIcon(health: ServerHealth) {
  switch (health) {
    case "online":
      return <CheckCircle className="mr-1 inline size-3.5 text-emerald-500" />;
    case "degraded":
      return <AlertCircle className="mr-1 inline size-3.5 text-amber-500" />;
    case "offline":
      return <XCircle className="text-destructive mr-1 inline size-3.5" />;
  }
}

export function EpisodeTable({ episodes, onPreview, onDelete }: EpisodeTableProps) {
  if (episodes.length === 0) {
    return (
      <div className="bg-card border-border/60 flex flex-col items-center justify-center rounded-xl border p-12 text-center">
        <Server className="text-muted-foreground/50 mb-3 size-12" />
        <h3 className="text-foreground text-lg font-semibold">No episodes found</h3>
        <p className="text-muted-foreground mt-1 max-w-sm text-sm">
          Try adjusting your search filter or add a new episode to your catalog.
        </p>
      </div>
    );
  }

  return (
    <div className="border-border/60 bg-card overflow-hidden rounded-xl border">
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
              <TableCell className="text-foreground font-bold">#{ep.episodeNumber}</TableCell>

              {/* Episode Info */}
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="bg-muted border-border/60 group relative size-14 shrink-0 overflow-hidden rounded-lg border">
                    <Image
                      src={ep.thumbnail}
                      alt={ep.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="56px"
                    />
                    <button
                      onClick={() => onPreview(ep)}
                      className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100"
                      title="Preview Episode"
                    >
                      <Play className="size-5 fill-white text-white" />
                    </button>
                    {ep.isVip && (
                      <span className="absolute top-1 left-1 rounded bg-amber-500 p-0.5 text-[10px] font-bold text-black">
                        <Lock className="inline size-2.5" />
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-foreground line-clamp-1 font-semibold">{ep.title}</span>
                    </div>
                    <div className="text-muted-foreground mt-1 flex items-center gap-2 text-xs">
                      <span>{ep.duration}</span>
                      <span>•</span>
                      <span>Aired: {ep.airDate}</span>
                    </div>
                  </div>
                </div>
              </TableCell>

              {/* Anime Title */}
              <TableCell className="text-muted-foreground line-clamp-1 max-w-[200px] text-sm font-medium">
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
                      className="bg-muted text-muted-foreground border-border/40 inline-flex items-center rounded border px-2 py-0.5"
                      title={`${srv.name} (${srv.quality}) - ${srv.health}`}
                    >
                      {renderServerHealthIcon(srv.health)}
                      {srv.quality}
                    </span>
                  ))}
                  {ep.servers.length === 0 && (
                    <span className="text-destructive flex items-center gap-1 text-xs">
                      <XCircle className="size-3.5" /> No servers
                    </span>
                  )}
                </div>
              </TableCell>

              {/* Subtitles */}
              <TableCell>
                <div className="text-muted-foreground flex items-center gap-1 text-xs">
                  <Globe className="text-primary size-3.5" />
                  <span>
                    {ep.subtitles.length > 0
                      ? ep.subtitles.map((s) => s.code.toUpperCase()).join(", ")
                      : "None"}
                  </span>
                </div>
              </TableCell>

              {/* Views */}
              <TableCell className="text-foreground text-right text-sm font-medium">
                {ep.viewsCount.toLocaleString()}
              </TableCell>

              {/* Actions */}
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-8">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Episode Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onPreview(ep)}>
                      <Play className="text-primary mr-2 size-4" />
                      Quick Preview
                    </DropdownMenuItem>
                    <Link href={`/dashboard/episodes/${ep.id}/edit`}>
                      <DropdownMenuItem>
                        <Edit className="mr-2 size-4" />
                        Edit Details
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDelete(ep.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 size-4" />
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
