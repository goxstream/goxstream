import { X, RotateCcw } from "lucide-react";
import { Badge } from "@goxstream/ui/components/badge";
import { Button } from "@goxstream/ui/components/button";
import { parseActiveGenres, removeGenreFromSelection } from "@/lib/filter-utils";
import type { ActiveFiltersBarProps } from "@/types/browse";

export function ActiveFiltersBar({
  query,
  genre,
  status,
  format,
  audio,
  season,
  year,
  activeFiltersCount,
  onQueryChange,
  onGenreChange,
  onStatusChange,
  onFormatChange,
  onAudioChange,
  onSeasonChange,
  onYearChange,
  onResetFilters,
}: ActiveFiltersBarProps) {
  if (activeFiltersCount === 0) return null;

  const activeGenres = parseActiveGenres(genre);

  const handleRemoveGenre = (targetGenre: string) => {
    const nextGenreValue = removeGenreFromSelection(genre, targetGenre);
    onGenreChange(nextGenreValue);
  };

  return (
    <div className="border-border/40 flex flex-wrap items-center gap-2 border-t pt-2">
      <span className="text-muted-foreground text-xs font-semibold">Active:</span>

      {query && (
        <Badge
          variant="secondary"
          className="bg-primary/10 text-primary border-primary/20 flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium"
        >
          <span>Search: &quot;{query}&quot;</span>
          <button
            type="button"
            onClick={() => onQueryChange("")}
            className="hover:opacity-75"
            aria-label="Remove search filter"
          >
            <X className="size-3" />
          </button>
        </Badge>
      )}

      {activeGenres.map((singleGenre) => (
        <Badge
          key={singleGenre}
          variant="secondary"
          className="bg-primary/10 text-primary border-primary/20 flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium"
        >
          <span>Genre: {singleGenre}</span>
          <button
            type="button"
            onClick={() => handleRemoveGenre(singleGenre)}
            className="hover:opacity-75"
            aria-label={`Remove genre ${singleGenre}`}
          >
            <X className="size-3" />
          </button>
        </Badge>
      ))}

      {status !== "All" && (
        <Badge
          variant="secondary"
          className="bg-primary/10 text-primary border-primary/20 flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium"
        >
          <span>Status: {status}</span>
          <button
            type="button"
            onClick={() => onStatusChange("All")}
            className="hover:opacity-75"
            aria-label="Remove status filter"
          >
            <X className="size-3" />
          </button>
        </Badge>
      )}

      {format !== "All" && (
        <Badge
          variant="secondary"
          className="bg-primary/10 text-primary border-primary/20 flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium"
        >
          <span>Format: {format}</span>
          <button
            type="button"
            onClick={() => onFormatChange("All")}
            className="hover:opacity-75"
            aria-label="Remove format filter"
          >
            <X className="size-3" />
          </button>
        </Badge>
      )}

      {audio !== "All" && (
        <Badge
          variant="secondary"
          className="bg-primary/10 text-primary border-primary/20 flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium"
        >
          <span>Audio: {audio}</span>
          <button
            type="button"
            onClick={() => onAudioChange("All")}
            className="hover:opacity-75"
            aria-label="Remove audio filter"
          >
            <X className="size-3" />
          </button>
        </Badge>
      )}

      {season !== "All" && (
        <Badge
          variant="secondary"
          className="bg-primary/10 text-primary border-primary/20 flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium"
        >
          <span>Season: {season}</span>
          <button
            type="button"
            onClick={() => onSeasonChange("All")}
            className="hover:opacity-75"
            aria-label="Remove season filter"
          >
            <X className="size-3" />
          </button>
        </Badge>
      )}

      {year !== "All" && (
        <Badge
          variant="secondary"
          className="bg-primary/10 text-primary border-primary/20 flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium"
        >
          <span>Year: {year}</span>
          <button
            type="button"
            onClick={() => onYearChange("All")}
            className="hover:opacity-75"
            aria-label="Remove year filter"
          >
            <X className="size-3" />
          </button>
        </Badge>
      )}

      <Button
        variant="ghost"
        size="sm"
        onClick={onResetFilters}
        className="text-muted-foreground hover:text-foreground h-7 gap-1 rounded-lg px-2 text-xs font-semibold"
      >
        <RotateCcw className="size-3" />
        <span>Reset Filters</span>
      </Button>
    </div>
  );
}
