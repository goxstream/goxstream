"use client";

import { useState } from "react";
import { SlidersHorizontal, Filter, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BaseFilterCombobox } from "./base-filter-combobox";
import { BaseGenreMultiSelectCombobox } from "./base-genre-multiselect-combobox";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  ANIME_STATUSES,
  ANIME_FORMATS,
  ANIME_AUDIO_OPTIONS,
  ANIME_SEASONS,
  ANIME_YEARS,
  SORT_OPTIONS,
} from "@/lib/constants";
import type { MobileFilterDrawerProps } from "../../types";

export function MobileFilterDrawer({
  genre,
  onGenreChange,
  status,
  onStatusChange,
  format,
  onFormatChange,
  audio,
  onAudioChange,
  season,
  onSeasonChange,
  year,
  onYearChange,
  sort,
  onSortChange,
  onResetFilters,
  activeFiltersCount,
}: MobileFilterDrawerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="border-border bg-card flex h-10 w-full items-center justify-center gap-2 rounded-xl text-xs font-semibold sm:w-auto lg:hidden"
        >
          <SlidersHorizontal className="text-primary size-3.5" />
          <span>Filters & Options</span>
          {activeFiltersCount > 0 && (
            <Badge className="bg-primary text-primary-foreground ml-1 flex size-5 items-center justify-center rounded-full p-0 text-[10px] font-bold">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="bg-background border-border flex w-[320px] flex-col justify-between overflow-y-auto p-6 sm:w-[380px]"
      >
        <div className="space-y-6">
          <SheetHeader className="border-border border-b p-0 pb-4 text-left">
            <SheetTitle className="flex items-center gap-2 text-lg font-bold">
              <Filter className="text-primary size-5" />
              Filter Anime
            </SheetTitle>
          </SheetHeader>

          {/* Mobile Filter Dropdowns using Base UI Combobox */}
          <div className="space-y-4">
            <BaseGenreMultiSelectCombobox
              value={genre}
              onValueChange={onGenreChange}
              contentClassName="z-[70]"
            />

            <BaseFilterCombobox
              label="Status"
              value={status}
              onValueChange={onStatusChange}
              options={ANIME_STATUSES}
              contentClassName="z-[70]"
            />

            <BaseFilterCombobox
              label="Format / Type"
              value={format}
              onValueChange={onFormatChange}
              options={ANIME_FORMATS}
              contentClassName="z-[70]"
            />

            <BaseFilterCombobox
              label="Sub / Dub Audio"
              value={audio}
              onValueChange={onAudioChange}
              options={ANIME_AUDIO_OPTIONS}
              contentClassName="z-[70]"
            />

            <BaseFilterCombobox
              label="Season"
              value={season}
              onValueChange={onSeasonChange}
              options={ANIME_SEASONS}
              contentClassName="z-[70]"
            />

            <BaseFilterCombobox
              label="Release Year"
              value={year}
              onValueChange={onYearChange}
              options={ANIME_YEARS}
              contentClassName="z-[70]"
            />

            <BaseFilterCombobox
              label="Sort Results By"
              value={sort}
              onValueChange={onSortChange}
              options={SORT_OPTIONS}
              contentClassName="z-[70]"
            />
          </div>
        </div>

        <div className="border-border space-y-3 border-t pt-6">
          <Button
            variant="outline"
            onClick={() => {
              onResetFilters();
              setOpen(false);
            }}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-xl text-xs font-semibold"
          >
            <RotateCcw className="size-3.5" />
            Reset All Filters
          </Button>

          <Button
            onClick={() => setOpen(false)}
            className="h-10 w-full rounded-xl text-xs font-semibold"
          >
            Apply Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
