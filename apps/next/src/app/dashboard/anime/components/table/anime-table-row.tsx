"use client";

import React from "react";
import { ChevronDown, ChevronRight, Edit2, Trash2, Star, MoreVertical, Flame } from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AnimeStatusBadge } from "./anime-status-badge";
import { AnimeInlineEditForm } from "../anime-inline-edit-form";
import type { AnimeItem } from "../../types";

interface AnimeTableRowProps {
  anime: AnimeItem;
  isExpanded: boolean;
  onToggleExpand: (id: string) => void;
  onOpenMobileEdit: (anime: AnimeItem) => void;
  onUpdateAnime: (updated: AnimeItem) => void;
  onDeleteAnime: (id: string) => void;
}

export function AnimeTableRow({
  anime,
  isExpanded,
  onToggleExpand,
  onOpenMobileEdit,
  onUpdateAnime,
  onDeleteAnime,
}: AnimeTableRowProps) {
  const handleEditClick = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      onOpenMobileEdit(anime);
    } else {
      onToggleExpand(anime.id);
    }
  };

  return (
    <React.Fragment>
      <TableRow
        className={`border-border/40 hover:bg-muted/40 cursor-pointer transition-colors ${isExpanded ? "bg-muted/30 font-medium" : ""}`}
        onClick={handleEditClick}
      >
        <TableCell className="p-2 text-center" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={handleEditClick}
            className="text-muted-foreground hover:text-foreground h-6 w-6"
          >
            {isExpanded ? (
              <ChevronDown className="text-primary h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </TableCell>

        <TableCell className="py-2.5">
          <div className="flex items-center gap-3">
            <div className="border-border/60 bg-muted relative aspect-2/3 w-9 shrink-0 overflow-hidden rounded border shadow-xs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={anime.coverImage}
                alt={anime.titleRomaji}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-foreground max-w-[200px] truncate text-xs font-semibold sm:max-w-[300px]">
                  {anime.titleRomaji}
                </span>
                {anime.trending && (
                  <Flame className="h-3 w-3 shrink-0 fill-orange-500 text-orange-500" />
                )}
              </div>
              <span className="text-muted-foreground block max-w-[240px] truncate text-[11px]">
                {anime.titleEnglish || anime.titleJapanese || anime.studios.join(", ")}
              </span>
            </div>
          </div>
        </TableCell>

        <TableCell className="py-2.5">
          <AnimeStatusBadge status={anime.status} />
        </TableCell>

        <TableCell className="py-2.5">
          <div className="flex flex-col">
            <span className="text-foreground text-xs font-medium">{anime.type}</span>
            <span className="text-muted-foreground text-[11px]">{anime.episodes} eps</span>
          </div>
        </TableCell>

        <TableCell className="py-2.5">
          <span className="text-foreground text-xs">
            {anime.season.season} {anime.season.year}
          </span>
        </TableCell>

        <TableCell className="py-2.5">
          <div className="flex max-w-[200px] flex-wrap gap-1">
            {anime.genres.slice(0, 2).map((g) => (
              <Badge
                key={g}
                variant="secondary"
                className="bg-muted text-muted-foreground border-border/40 px-1.5 py-0 text-[10px] font-normal"
              >
                {g}
              </Badge>
            ))}
            {anime.genres.length > 2 && (
              <span className="text-muted-foreground self-center text-[10px]">
                +{anime.genres.length - 2}
              </span>
            )}
          </div>
        </TableCell>

        <TableCell className="py-2.5">
          <div className="flex items-center gap-1 text-xs font-medium text-amber-500">
            <Star className="h-3.5 w-3.5 fill-amber-500" />
            <span>{anime.rating ? anime.rating.toFixed(1) : "N/A"}</span>
          </div>
        </TableCell>

        <TableCell className="py-2.5 pr-4 text-right" onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground h-7 w-7"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 text-xs">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-muted-foreground text-[11px] font-normal">
                  Actions
                </DropdownMenuLabel>
                <DropdownMenuItem onClick={handleEditClick}>
                  <Edit2 className="text-primary mr-2 h-3.5 w-3.5" />
                  {isExpanded ? "Close Edit" : "Edit Anime"}
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => onDeleteAnime(anime.id)}
              >
                <Trash2 className="mr-2 h-3.5 w-3.5" />
                Delete Anime
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>

      {isExpanded && (
        <TableRow className="border-border/60 hover:bg-transparent">
          <TableCell colSpan={8} className="p-0">
            <AnimeInlineEditForm
              anime={anime}
              onSave={(updated) => {
                onUpdateAnime(updated);
                onToggleExpand(anime.id);
              }}
              onCancel={() => onToggleExpand(anime.id)}
            />
          </TableCell>
        </TableRow>
      )}
    </React.Fragment>
  );
}
