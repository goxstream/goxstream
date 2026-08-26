"use client";

import { useState, useMemo } from "react";
import { Search, Tag, Edit2, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-card/40 p-3 rounded-xl border border-border/60">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Search genre or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 rounded-lg"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
            Filter Group:
          </span>
          <Select value={groupFilter} onValueChange={(val) => val && setGroupFilter(val)}>
            <SelectTrigger className="h-9 w-40 text-xs rounded-lg">
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
          <Card key={genre.id} className="rounded-xl border-border/60 bg-card/60 hover:border-border transition-colors shadow-xs">
            <CardContent className="p-4 flex flex-col justify-between gap-3 h-full">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline" className="text-[11px] font-medium rounded-md px-2">
                    {genre.group}
                  </Badge>
                  <Switch
                    checked={genre.isActive}
                    onCheckedChange={() => onToggleStatus(genre.id)}
                    aria-label={`Toggle ${genre.name} genre`}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Tag className="size-4 text-primary shrink-0" />
                  <span className="font-bold text-foreground text-sm truncate">
                    {genre.name}
                  </span>
                </div>

                {genre.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {genre.description}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-border/40 pt-2 text-xs">
                <span className="text-muted-foreground font-medium">
                  {genre.animeCount.toLocaleString()} Titles
                </span>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEditGenre(genre)}
                    className="size-7 text-muted-foreground hover:text-foreground rounded-lg"
                  >
                    <Edit2 className="size-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteGenre(genre.id)}
                    className="size-7 text-muted-foreground hover:text-destructive rounded-lg"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredGenres.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center p-8 border border-dashed border-border/60 rounded-xl text-center text-muted-foreground">
            <p className="text-sm">No genres found matching search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
