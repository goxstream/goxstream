import { BrowseFilters } from "./browse-filters";
import { BrowseGrid } from "./browse-grid";
import { BrowsePagination } from "./browse-pagination";
import { useBrowseFilters } from "@/hooks/use-browse-filters";
import { ApiError } from "@/components/api-error";

export function BrowseContent() {
  const {
    query,
    onQueryChange,
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
    viewMode,
    onViewModeChange,
    currentPage,
    onPageChange,
    totalPages,
    totalResults,
    activeFiltersCount,
    onResetFilters,
    paginatedList,
    isLoading,
    error,
  } = useBrowseFilters();

  return (
    <div className="space-y-8">
      <BrowseFilters
        query={query}
        onQueryChange={onQueryChange}
        genre={genre}
        onGenreChange={onGenreChange}
        status={status}
        onStatusChange={onStatusChange}
        format={format}
        onFormatChange={onFormatChange}
        audio={audio}
        onAudioChange={onAudioChange}
        season={season}
        onSeasonChange={onSeasonChange}
        year={year}
        onYearChange={onYearChange}
        sort={sort}
        onSortChange={onSortChange}
        onResetFilters={onResetFilters}
        activeFiltersCount={activeFiltersCount}
      />
      {error ? (
        <ApiError message={error} onRetry={() => window.location.reload()} />
      ) : (
        <BrowseGrid
          items={paginatedList}
          totalResults={totalResults}
          totalAnimeCount={totalResults}
          viewMode={viewMode}
          onViewModeChange={onViewModeChange}
          onResetFilters={onResetFilters}
          isLoading={isLoading}
        />
      )}
      <BrowsePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}
