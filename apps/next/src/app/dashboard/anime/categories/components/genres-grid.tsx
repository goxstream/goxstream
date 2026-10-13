"use client";

import { useState, useMemo } from "react";
import { Search, Tag, Edit2, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { GenreItem, GenreGroup } from "../types";

interface GenresGridProps {
  genres: GenreItem[];
  onToggleStatus: (id: string) => void;
  onDeleteGenre: (id: string) => void;
  onEditGenre: (genre: GenreItem) => void;
}

const GROUPS: ("all" | GenreGroup)[] = ["all", "Main Genre", "Demographic", "Theme"];

export function GenresGrid({
  genres,
  onToggleStatus,
  onDeleteGenre,
  onEditGenre,
}: GenresGridProps) {
  const [search, setSearch] = useState("");
  const [groupFilter, setGroupFilter] = useState<string>("all");

  const filteredGenres = useMemo(() => {
    return genres.filter((g) => {
      if (search) {
        const query = search.toLowerCase();
        if (!g.name.toLowerCase().includes(query) && !g.slug.toLowerCase().includes(query)) {
          return false;
        }
      }
      if (groupFilter !== "all" && g.group !== groupFilter) {
        return false;
      }
      return true;
    });
  }, [genres, search, groupFilter]);

  return (
    <div className="flex flex-col gap-4">
      {/* Controls Bar */}
      <div className="bg-card/40 border-border/60 flex flex-col gap-3 rounded-xl border p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="text-muted-foreground absolute top-2.5 left-3 size-4" />
          <Input
            placeholder="Search genre or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 rounded-lg pl-9"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-xs font-medium whitespace-nowrap">
            Filter Group:
          </span>
          <Select value={groupFilter} onValueChange={(val) => val && setGroupFilter(val)}>
            <SelectTrigger className="h-9 w-40 rounded-lg text-xs">
              <SelectValue placeholder="Filter Group" />
            </SelectTrigger>
            <SelectContent>
              {GROUPS.map((grp) => (
                <SelectItem key={grp} value={grp} className="text-xs">
                  {grp === "all" ? "All Groups" : grp}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grid of Genre Cards */}
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredGenres.map((genre) => (
          <Card
            key={genre.id}
            className="border-border/60 bg-card/60 hover:border-border rounded-xl shadow-xs transition-colors"
          >
            <CardContent className="flex h-full flex-col justify-between gap-3 p-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline" className="rounded-md px-2 text-[11px] font-medium">
                    {genre.group}
                  </Badge>
                  <Switch
                    checked={genre.isActive}
                    onCheckedChange={() => onToggleStatus(genre.id)}
                    aria-label={`Toggle ${genre.name} genre`}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Tag className="text-primary size-4 shrink-0" />
                  <span className="text-foreground truncate text-sm font-bold">{genre.name}</span>
                </div>

                {genre.description && (
                  <p className="text-muted-foreground line-clamp-2 text-xs">{genre.description}</p>
                )}
              </div>

              <div className="border-border/40 flex items-center justify-between border-t pt-2 text-xs">
                <span className="text-muted-foreground font-medium">
                  {genre.animeCount.toLocaleString()} Titles
                </span>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEditGenre(genre)}
                    className="text-muted-foreground hover:text-foreground size-7 rounded-lg"
                  >
                    <Edit2 className="size-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteGenre(genre.id)}
                    className="text-muted-foreground hover:text-destructive size-7 rounded-lg"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredGenres.length === 0 && (
          <div className="border-border/60 text-muted-foreground col-span-full flex flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center">
            <p className="text-sm">No genres found matching search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
