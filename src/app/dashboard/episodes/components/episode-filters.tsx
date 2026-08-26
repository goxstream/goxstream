"use client";

import { Search, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AnimeSelectCombobox } from "./anime-select-combobox";
import type { EpisodeFilterState } from "../types";

interface EpisodeFiltersProps {
  filters: EpisodeFilterState;
  onFilterChange: (key: keyof EpisodeFilterState, value: string) => void;
  onReset: () => void;
  animeOptions: { id: string; title: string }[];
}

export function EpisodeFilters({
  filters,
  onFilterChange,
  onReset,
  animeOptions,
}: EpisodeFiltersProps) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between bg-card p-4 rounded-xl border border-border/60">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search episode title or number..."
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            className="pl-9 h-9 border-border/60 text-xs"
          />
        </div>

        {/* Anime Searchable Combobox */}
        <AnimeSelectCombobox
          value={filters.animeId}
          onValueChange={(val) => onFilterChange("animeId", val)}
          options={animeOptions}
          allowAllOption={true}
          className="w-full sm:w-[220px]"
        />

        {/* Status Filter */}
        <Select
          value={filters.status}
          onValueChange={(val) => val && onFilterChange("status", val)}
        >
          <SelectTrigger className="w-full sm:w-[150px] h-9 border-border/60 text-xs">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
          </SelectContent>
        </Select>

        {/* Server Status Filter */}
        <Select
          value={filters.serverStatus}
          onValueChange={(val) => val && onFilterChange("serverStatus", val)}
        >
          <SelectTrigger className="w-full sm:w-[160px] h-9 border-border/60 text-xs">
            <SelectValue placeholder="Server Health" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Server Health</SelectItem>
            <SelectItem value="online">Online</SelectItem>
            <SelectItem value="degraded">Degraded</SelectItem>
            <SelectItem value="offline">Offline / Issue</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sort & Reset */}
      <div className="flex items-center gap-2">
        <Select
          value={filters.sortBy}
          onValueChange={(val) => val && onFilterChange("sortBy", val)}
        >
          <SelectTrigger className="w-[140px] h-9 border-border/60 text-xs">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="views">Most Views</SelectItem>
            <SelectItem value="number">Episode No.</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="icon"
          onClick={onReset}
          className="h-9 w-9 border-border/60 shrink-0"
          title="Reset Filters"
        >
          <RotateCcw className="size-4" />
        </Button>
      </div>
    </div>
  );
}
