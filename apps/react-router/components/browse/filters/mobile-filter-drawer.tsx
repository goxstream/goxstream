import { useState } from "react";
import { SlidersHorizontal, RotateCcw } from "lucide-react";
import { Button } from "@shionstream/ui/components/button";
import { Badge } from "@shionstream/ui/components/badge";
import { BaseFilterCombobox } from "./base-filter-combobox";
import { BaseGenreMultiSelectCombobox } from "./base-genre-multiselect-combobox";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@shionstream/ui/components/sheet";
import {
  ANIME_STATUSES,
  ANIME_FORMATS,
  ANIME_AUDIO_OPTIONS,
  ANIME_SEASONS,
  ANIME_YEARS,
  SORT_OPTIONS,
} from "@/lib/constants";
import type { MobileFilterDrawerProps } from "@/types/browse";

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
          <SheetHeader className="p-0 text-left">
            <SheetTitle className="text-foreground text-lg font-bold">
              Filter Anime Catalog
            </SheetTitle>
          </SheetHeader>

          <div className="space-y-4">
            <BaseFilterCombobox
              label="Sort Results By"
              value={sort}
              onValueChange={onSortChange}
              options={SORT_OPTIONS}
            />

            <BaseGenreMultiSelectCombobox value={genre} onValueChange={onGenreChange} />

            <BaseFilterCombobox
              label="Status"
              value={status}
              onValueChange={onStatusChange}
              options={ANIME_STATUSES}
            />

            <BaseFilterCombobox
              label="Format / Type"
              value={format}
              onValueChange={onFormatChange}
              options={ANIME_FORMATS}
            />

            <BaseFilterCombobox
              label="Audio Track"
              value={audio}
              onValueChange={onAudioChange}
              options={ANIME_AUDIO_OPTIONS}
            />

            <BaseFilterCombobox
              label="Season"
              value={season}
              onValueChange={onSeasonChange}
              options={ANIME_SEASONS.map((s) => ({
                label: s === "All" ? "All Seasons" : s,
                value: s,
              }))}
            />

            <BaseFilterCombobox
              label="Release Year"
              value={year}
              onValueChange={onYearChange}
              options={ANIME_YEARS.map((y) => ({ label: y === "All" ? "All Years" : y, value: y }))}
            />
          </div>
        </div>

        <div className="border-border/60 border-t pt-4">
          <Button
            variant="outline"
            onClick={() => {
              onResetFilters();
              setOpen(false);
            }}
            className="w-full gap-2 text-xs font-semibold"
          >
            <RotateCcw className="size-3.5" />
            <span>Reset All Filters</span>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
