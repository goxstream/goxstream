"use client";

import { Edit2, Trash2, Star, Flame, MoreVertical } from "lucide-react";
import { Card } from "@/components/ui/card";
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
import type { AnimeItem } from "../../types";

interface AnimeCardMobileProps {
  anime: AnimeItem;
  onOpenMobileEdit: (anime: AnimeItem) => void;
  onDeleteAnime: (id: string) => void;
}

export function AnimeCardMobile({
  anime,
  onOpenMobileEdit,
  onDeleteAnime,
}: AnimeCardMobileProps) {
  return (
    <Card
      onClick={() => onOpenMobileEdit(anime)}
      className="p-3 border-border/60 bg-card/60 hover:bg-muted/40 transition-colors cursor-pointer flex gap-3 items-center shadow-xs"
    >
      {/* Poster Thumbnail */}
      <div className="relative aspect-2/3 w-14 rounded-md overflow-hidden border border-border/60 bg-muted shrink-0 shadow-xs">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={anime.coverImage}
          alt={anime.titleRomaji}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Details Middle Column */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-foreground truncate">
            {anime.titleRomaji}
          </span>
          {anime.trending && (
            <Flame className="h-3 w-3 text-orange-500 fill-orange-500 shrink-0" />
          )}
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <AnimeStatusBadge status={anime.status} />
          <span className="text-[11px] font-medium text-foreground bg-muted px-1.5 py-0.2 rounded border border-border/40">
            {anime.type}
          </span>
          <span className="text-[11px] text-muted-foreground">
            {anime.season.season} {anime.season.year}
          </span>
        </div>

        {/* Genres */}
        <div className="flex items-center gap-1 flex-wrap pt-0.5">
          {anime.genres.slice(0, 2).map((g) => (
            <Badge
              key={g}
              variant="secondary"
              className="text-[9px] px-1 py-0 bg-muted/80 text-muted-foreground font-normal border-border/40"
            >
              {g}
            </Badge>
          ))}
          {anime.genres.length > 2 && (
            <span className="text-[9px] text-muted-foreground">
              +{anime.genres.length - 2}
            </span>
          )}
        </div>
      </div>

      {/* Right Column: Rating & Actions */}
      <div className="flex flex-col items-end justify-between self-stretch shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger
            onClick={(e) => e.stopPropagation()}
            render={
              <Button
                variant="ghost"
                size="icon-xs"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
              />
            }
          >
            <MoreVertical className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36 text-xs">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-[10px] text-muted-foreground font-normal">
                Actions
              </DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onOpenMobileEdit(anime)}>
                <Edit2 className="h-3.5 w-3.5 mr-2 text-primary" />
                Edit Anime
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteAnime(anime.id);
              }}
            >
              <Trash2 className="h-3.5 w-3.5 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center gap-1 text-xs font-semibold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
          <Star className="h-3 w-3 fill-amber-500" />
          <span>{anime.rating ? anime.rating.toFixed(1) : "N/A"}</span>
        </div>
      </div>
    </Card>
  );
}
