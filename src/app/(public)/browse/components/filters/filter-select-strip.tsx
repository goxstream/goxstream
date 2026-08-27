"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ANIME_STATUSES,
  ANIME_FORMATS,
  ANIME_AUDIO_OPTIONS,
  ANIME_SEASONS,
  ANIME_YEARS,
  SORT_OPTIONS,
} from "@/lib/mock-anime";

export interface FilterSelectStripProps {
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
}

export function FilterSelectStrip({
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
}: FilterSelectStripProps) {
  return (
    <div className="space-y-3">
      {/* Primary Desktop Filter Dropdowns using shadcn Select */}
      <div className="hidden lg:flex items-center gap-3 flex-wrap">
        {/* Status */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status:</span>
          <Select value={status} onValueChange={(val) => val && onStatusChange(val)}>
            <SelectTrigger className="h-9 min-w-28 text-xs font-medium bg-card rounded-lg border-border/80">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="z-50 min-w-32 bg-popover">
              {ANIME_STATUSES.map((st) => (
                <SelectItem key={st} value={st} className="text-xs">
                  {st}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Format */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Type:</span>
          <Select value={format} onValueChange={(val) => val && onFormatChange(val)}>
            <SelectTrigger className="h-9 min-w-24 text-xs font-medium bg-card rounded-lg border-border/80">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent className="z-50 min-w-28 bg-popover">
              {ANIME_FORMATS.map((fmt) => (
                <SelectItem key={fmt} value={fmt} className="text-xs">
                  {fmt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Audio */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Audio:</span>
          <Select value={audio} onValueChange={(val) => val && onAudioChange(val)}>
            <SelectTrigger className="h-9 min-w-28 text-xs font-medium bg-card rounded-lg border-border/80">
              <SelectValue placeholder="Audio" />
            </SelectTrigger>
            <SelectContent className="z-50 min-w-32 bg-popover">
              {ANIME_AUDIO_OPTIONS.map((aud) => (
                <SelectItem key={aud} value={aud} className="text-xs">
                  {aud}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sort By */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sort:</span>
          <Select value={sort} onValueChange={(val) => val && onSortChange(val)}>
            <SelectTrigger className="h-9 min-w-36 text-xs font-medium bg-card rounded-lg border-border/80">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="z-50 min-w-40 bg-popover">
              {SORT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="text-xs">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Season & Year Secondary Options */}
        <div className="flex items-center gap-2 border-l border-border/60 pl-3">
          {/* Season */}
          <Select value={season} onValueChange={(val) => val && onSeasonChange(val)}>
            <SelectTrigger className="h-9 min-w-28 text-xs font-medium bg-muted/40 rounded-lg border-border/60">
              <SelectValue placeholder="Season: All" />
            </SelectTrigger>
            <SelectContent className="z-50 min-w-32 bg-popover">
              {ANIME_SEASONS.map((sn) => (
                <SelectItem key={sn} value={sn} className="text-xs">
                  {sn === "All" ? "Season: All" : sn}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Year */}
          <Select value={year} onValueChange={(val) => val && onYearChange(val)}>
            <SelectTrigger className="h-9 min-w-24 text-xs font-medium bg-muted/40 rounded-lg border-border/60">
              <SelectValue placeholder="Year: All" />
            </SelectTrigger>
            <SelectContent className="z-50 min-w-28 bg-popover">
              {ANIME_YEARS.map((yr) => (
                <SelectItem key={yr} value={yr} className="text-xs">
                  {yr === "All" ? "Year: All" : yr}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
