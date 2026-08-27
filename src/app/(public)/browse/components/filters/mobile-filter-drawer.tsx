"use client";

import { useState } from "react";
import { SlidersHorizontal, Filter, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BaseFilterCombobox } from "./base-filter-combobox";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
      <SheetTrigger
        render={
          <Button
            variant="outline"
            className="lg:hidden h-10 rounded-xl flex items-center justify-center gap-2 border-border bg-card w-full sm:w-auto text-xs font-semibold"
          >
            <SlidersHorizontal className="size-3.5 text-primary" />
            <span>Filters & Options</span>
            {activeFiltersCount > 0 && (
              <Badge className="ml-1 size-5 rounded-full p-0 flex items-center justify-center text-[10px] font-bold bg-primary text-primary-foreground">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        }
      />
      <SheetContent side="right" className="w-[320px] sm:w-[380px] bg-background border-border p-6 flex flex-col justify-between overflow-y-auto">
        <div className="space-y-6">
          <SheetHeader className="p-0 text-left border-b border-border pb-4">
            <SheetTitle className="flex items-center gap-2 text-lg font-bold">
              <Filter className="size-5 text-primary" />
              Filter Anime
            </SheetTitle>
          </SheetHeader>

          {/* Mobile Filter Dropdowns using Base UI Combobox */}
          <div className="space-y-4">
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

        <div className="pt-6 border-t border-border space-y-3">
          <Button
            variant="outline"
            onClick={() => {
              onResetFilters();
              setOpen(false);
            }}
            className="w-full h-10 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold"
          >
            <RotateCcw className="size-3.5" />
            Reset All Filters
          </Button>

          <Button
            onClick={() => setOpen(false)}
            className="w-full h-10 rounded-xl font-semibold text-xs"
          >
            Apply Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
