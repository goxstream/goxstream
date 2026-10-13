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

export function AnimeCardMobile({ anime, onOpenMobileEdit, onDeleteAnime }: AnimeCardMobileProps) {
  return (
    <Card
      onClick={() => onOpenMobileEdit(anime)}
      className="border-border/60 bg-card/60 hover:bg-muted/40 flex cursor-pointer items-center gap-3 p-3 shadow-xs transition-colors"
    >
      {/* Poster Thumbnail */}
      <div className="border-border/60 bg-muted relative aspect-2/3 w-14 shrink-0 overflow-hidden rounded-md border shadow-xs">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={anime.coverImage}
          alt={anime.titleRomaji}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Details Middle Column */}
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-center gap-1.5">
          <span className="text-foreground truncate text-xs font-bold">{anime.titleRomaji}</span>
          {anime.trending && <Flame className="h-3 w-3 shrink-0 fill-orange-500 text-orange-500" />}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <AnimeStatusBadge status={anime.status} />
          <span className="text-foreground bg-muted py-0.2 border-border/40 rounded border px-1.5 text-[11px] font-medium">
            {anime.type}
          </span>
          <span className="text-muted-foreground text-[11px]">
            {anime.season.season} {anime.season.year}
          </span>
        </div>

        {/* Genres */}
        <div className="flex flex-wrap items-center gap-1 pt-0.5">
          {anime.genres.slice(0, 2).map((g) => (
            <Badge
              key={g}
              variant="secondary"
              className="bg-muted/80 text-muted-foreground border-border/40 px-1 py-0 text-[9px] font-normal"
            >
              {g}
            </Badge>
          ))}
          {anime.genres.length > 2 && (
            <span className="text-muted-foreground text-[9px]">+{anime.genres.length - 2}</span>
          )}
        </div>
      </div>

      {/* Right Column: Rating & Actions */}
      <div className="flex shrink-0 flex-col items-end justify-between self-stretch">
        <DropdownMenu>
          <DropdownMenuTrigger onClick={(e) => e.stopPropagation()} asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground h-7 w-7"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36 text-xs">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-muted-foreground text-[10px] font-normal">
                Actions
              </DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onOpenMobileEdit(anime)}>
                <Edit2 className="text-primary mr-2 h-3.5 w-3.5" />
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
              <Trash2 className="mr-2 h-3.5 w-3.5" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center gap-1 rounded border border-amber-500/20 bg-amber-500/10 px-1.5 py-0.5 text-xs font-semibold text-amber-500">
          <Star className="h-3 w-3 fill-amber-500" />
          <span>{anime.rating ? anime.rating.toFixed(1) : "N/A"}</span>
        </div>
      </div>
    </Card>
  );
}
