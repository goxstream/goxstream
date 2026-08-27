"use client";

import { useState } from "react";
import { SlidersHorizontal, Filter, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

export interface MobileFilterDrawerProps {
  status: string;
  onStatusChange: (s: string) => void;
  format: string;
  onFormatChange: (f: string) => void;
  audio: string;
  onAudioChange: (a: string) => void;
  season: string;
  onSeasonChange: (s: string) => void;
  year: string;
  onYearChange: (y: string) => void;
  sort: string;
  onSortChange: (s: string) => void;
  onResetFilters: () => void;
  activeFiltersCount: number;
}

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
            className="lg:hidden h-11 rounded-xl flex items-center justify-center gap-2 border-border bg-card w-full sm:w-auto"
          >
            <SlidersHorizontal className="size-4 text-primary" />
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

          {/* Mobile Filter Dropdowns using shadcn Select */}
          <div className="space-y-4">
            {/* Status */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Status
              </label>
              <Select value={status} onValueChange={(val) => val && onStatusChange(val)}>
                <SelectTrigger className="w-full h-10 text-sm bg-card rounded-lg border-border">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="z-50 bg-popover">
                  {ANIME_STATUSES.map((st) => (
                    <SelectItem key={st} value={st}>
                      {st}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Format */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Format / Type
              </label>
              <Select value={format} onValueChange={(val) => val && onFormatChange(val)}>
                <SelectTrigger className="w-full h-10 text-sm bg-card rounded-lg border-border">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent className="z-50 bg-popover">
                  {ANIME_FORMATS.map((fmt) => (
                    <SelectItem key={fmt} value={fmt}>
                      {fmt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Audio */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Sub / Dub Audio
              </label>
              <Select value={audio} onValueChange={(val) => val && onAudioChange(val)}>
                <SelectTrigger className="w-full h-10 text-sm bg-card rounded-lg border-border">
                  <SelectValue placeholder="Audio" />
                </SelectTrigger>
                <SelectContent className="z-50 bg-popover">
                  {ANIME_AUDIO_OPTIONS.map((aud) => (
                    <SelectItem key={aud} value={aud}>
                      {aud}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Season */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Season
              </label>
              <Select value={season} onValueChange={(val) => val && onSeasonChange(val)}>
                <SelectTrigger className="w-full h-10 text-sm bg-card rounded-lg border-border">
                  <SelectValue placeholder="Season" />
                </SelectTrigger>
                <SelectContent className="z-50 bg-popover">
                  {ANIME_SEASONS.map((sn) => (
                    <SelectItem key={sn} value={sn}>
                      {sn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Year */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Release Year
              </label>
              <Select value={year} onValueChange={(val) => val && onYearChange(val)}>
                <SelectTrigger className="w-full h-10 text-sm bg-card rounded-lg border-border">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent className="z-50 bg-popover">
                  {ANIME_YEARS.map((yr) => (
                    <SelectItem key={yr} value={yr}>
                      {yr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort By */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Sort Results By
              </label>
              <Select value={sort} onValueChange={(val) => val && onSortChange(val)}>
                <SelectTrigger className="w-full h-10 text-sm bg-card rounded-lg border-border">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="z-50 bg-popover">
                  {SORT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-border space-y-3">
          <Button
            variant="outline"
            onClick={() => {
              onResetFilters();
              setOpen(false);
            }}
            className="w-full h-10 rounded-lg flex items-center justify-center gap-2"
          >
            <RotateCcw className="size-4" />
            Reset All Filters
          </Button>

          <Button
            onClick={() => setOpen(false)}
            className="w-full h-10 rounded-lg font-semibold"
          >
            Apply Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
