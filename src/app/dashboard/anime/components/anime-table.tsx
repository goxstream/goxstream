"use client";

import { useState } from "react";
import { Film } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
} from "@/components/ui/table";
import { AnimeTableRow } from "./table/anime-table-row";
import type { AnimeItem } from "../types";

interface AnimeTableProps {
  animeList: AnimeItem[];
  onUpdateAnime: (updated: AnimeItem) => void;
  onDeleteAnime: (id: string) => void;
  onOpenMobileEdit: (anime: AnimeItem) => void;
}

export function AnimeTable({
  animeList,
  onUpdateAnime,
  onDeleteAnime,
  onOpenMobileEdit,
}: AnimeTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  if (animeList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-card/40 rounded-lg border border-border/60 text-center">
        <Film className="h-10 w-10 text-muted-foreground/50 mb-3" />
        <h3 className="text-base font-semibold text-foreground">No anime found</h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-sm">
          No anime titles match your active filter search. Try resetting filters or adding a new anime title.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border/60 bg-card/40 overflow-hidden shadow-xs">
      <Table className="table-fixed w-full">
        <TableHeader className="bg-muted/30">
          <TableRow className="border-border/60 hover:bg-transparent">
            <TableHead className="w-10 text-center"></TableHead>
            <TableHead className="w-[30%] text-xs font-semibold">Title & Poster</TableHead>
            <TableHead className="w-[14%] text-xs font-semibold">Status</TableHead>
            <TableHead className="w-[12%] text-xs font-semibold">Format</TableHead>
            <TableHead className="w-[13%] text-xs font-semibold">Season</TableHead>
            <TableHead className="w-[17%] text-xs font-semibold">Genres</TableHead>
            <TableHead className="w-[10%] text-xs font-semibold">Rating</TableHead>
            <TableHead className="w-12 text-right pr-4">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className="divide-y divide-border/60">
          {animeList.map((anime) => (
            <AnimeTableRow
              key={anime.id}
              anime={anime}
              isExpanded={expandedId === anime.id}
              onToggleExpand={toggleExpand}
              onOpenMobileEdit={onOpenMobileEdit}
              onUpdateAnime={onUpdateAnime}
              onDeleteAnime={onDeleteAnime}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
