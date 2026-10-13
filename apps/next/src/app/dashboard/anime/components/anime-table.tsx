"use client";

import { useState } from "react";
import { Film } from "lucide-react";
import { Table, TableHeader, TableBody, TableRow, TableHead } from "@/components/ui/table";
import { AnimeTableRow } from "./table/anime-table-row";
import { AnimeCardMobile } from "./table/anime-card-mobile";
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
      <div className="bg-card/40 border-border/60 flex flex-col items-center justify-center rounded-lg border p-12 text-center">
        <Film className="text-muted-foreground/50 mb-3 h-10 w-10" />
        <h3 className="text-foreground text-base font-semibold">No anime found</h3>
        <p className="text-muted-foreground mt-1 max-w-sm text-xs">
          No anime titles match your active filter search. Try resetting filters or adding a new
          anime title.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Mobile Card List View (< md) */}
      <div className="space-y-2.5 md:hidden">
        {animeList.map((anime) => (
          <AnimeCardMobile
            key={anime.id}
            anime={anime}
            onOpenMobileEdit={onOpenMobileEdit}
            onDeleteAnime={onDeleteAnime}
          />
        ))}
      </div>

      {/* Desktop Data Table View (≥ md) */}
      <div className="border-border/60 bg-card/40 hidden overflow-hidden rounded-lg border shadow-xs md:block">
        <Table className="w-full table-fixed">
          <TableHeader className="bg-muted/30">
            <TableRow className="border-border/60 hover:bg-transparent">
              <TableHead className="w-10 text-center"></TableHead>
              <TableHead className="w-[30%] text-xs font-semibold">Title & Poster</TableHead>
              <TableHead className="w-[14%] text-xs font-semibold">Status</TableHead>
              <TableHead className="w-[12%] text-xs font-semibold">Format</TableHead>
              <TableHead className="w-[13%] text-xs font-semibold">Season</TableHead>
              <TableHead className="w-[17%] text-xs font-semibold">Genres</TableHead>
              <TableHead className="w-[10%] text-xs font-semibold">Rating</TableHead>
              <TableHead className="w-12 pr-4 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-border/60 divide-y">
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
    </div>
  );
}
