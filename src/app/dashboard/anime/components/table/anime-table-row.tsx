"use client";

import React from "react";
import { ChevronDown, ChevronRight, Edit2, Trash2, Star, MoreVertical, Flame } from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AnimeStatusBadge } from "./anime-status-badge";
import { AnimeInlineEditForm } from "../anime-inline-edit-form";
import type { AnimeItem } from "../../types";

interface AnimeTableRowProps {
  anime: AnimeItem;
  isExpanded: boolean;
  onToggleExpand: (id: string) => void;
  onUpdateAnime: (updated: AnimeItem) => void;
  onDeleteAnime: (id: string) => void;
}

export function AnimeTableRow({ anime, isExpanded, onToggleExpand, onUpdateAnime, onDeleteAnime }: AnimeTableRowProps) {
  return (
    <React.Fragment>
      <TableRow
        className={`transition-colors border-border/40 hover:bg-muted/40 cursor-pointer ${isExpanded ? "bg-muted/30 font-medium" : ""}`}
        onClick={() => onToggleExpand(anime.id)}
      >
        <TableCell className="text-center p-2" onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" size="icon-xs" onClick={() => onToggleExpand(anime.id)} className="h-6 w-6 text-muted-foreground hover:text-foreground">
            {isExpanded ? <ChevronDown className="h-4 w-4 text-primary" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </TableCell>

        <TableCell className="py-2.5">
          <div className="flex items-center gap-3">
            <div className="relative aspect-2/3 w-9 rounded overflow-hidden border border-border/60 bg-muted shrink-0 shadow-xs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={anime.coverImage} alt={anime.titleRomaji} className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-foreground truncate max-w-[200px] sm:max-w-[300px]">{anime.titleRomaji}</span>
                {anime.trending && <Flame className="h-3 w-3 text-orange-500 fill-orange-500 shrink-0" />}
              </div>
              <span className="text-[11px] text-muted-foreground block truncate max-w-[240px]">
                {anime.titleEnglish || anime.titleJapanese || anime.studios.join(", ")}
              </span>
            </div>
          </div>
        </TableCell>

        <TableCell className="py-2.5"><AnimeStatusBadge status={anime.status} /></TableCell>

        <TableCell className="py-2.5">
          <div className="flex flex-col">
            <span className="text-xs font-medium text-foreground">{anime.type}</span>
            <span className="text-[11px] text-muted-foreground">{anime.episodes} eps</span>
          </div>
        </TableCell>

        <TableCell className="py-2.5">
          <span className="text-xs text-foreground">{anime.season.season} {anime.season.year}</span>
        </TableCell>

        <TableCell className="py-2.5">
          <div className="flex flex-wrap gap-1 max-w-[200px]">
            {anime.genres.slice(0, 2).map((g) => (
              <Badge key={g} variant="secondary" className="text-[10px] px-1.5 py-0 bg-muted text-muted-foreground font-normal border-border/40">{g}</Badge>
            ))}
            {anime.genres.length > 2 && <span className="text-[10px] text-muted-foreground self-center">+{anime.genres.length - 2}</span>}
          </div>
        </TableCell>

        <TableCell className="py-2.5">
          <div className="flex items-center gap-1 text-xs font-medium text-amber-500">
            <Star className="h-3.5 w-3.5 fill-amber-500" />
            <span>{anime.rating ? anime.rating.toFixed(1) : "N/A"}</span>
          </div>
        </TableCell>

        <TableCell className="py-2.5 text-right pr-4" onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" size="icon-xs" className="h-7 w-7 text-muted-foreground hover:text-foreground" />}>
              <MoreVertical className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 text-xs">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-[11px] text-muted-foreground font-normal">Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => onToggleExpand(anime.id)}>
                  <Edit2 className="h-3.5 w-3.5 mr-2 text-primary" />
                  {isExpanded ? "Close Edit" : "Inline Edit"}
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => onDeleteAnime(anime.id)}>
                <Trash2 className="h-3.5 w-3.5 mr-2" />
                Delete Anime
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>

      {isExpanded && (
        <TableRow className="hover:bg-transparent border-border/60">
          <TableCell colSpan={8} className="p-0">
            <AnimeInlineEditForm
              anime={anime}
              onSave={(updated) => { onUpdateAnime(updated); onToggleExpand(anime.id); }}
              onCancel={() => onToggleExpand(anime.id)}
            />
          </TableCell>
        </TableRow>
      )}
    </React.Fragment>
  );
}
