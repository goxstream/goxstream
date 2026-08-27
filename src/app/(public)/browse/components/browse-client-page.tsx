"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useMemo, useState, useCallback } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useBrowseAnime } from "@/hooks/use-browse-anime";
import { BrowseFilters } from "./browse-filters";
import { BrowseGrid } from "./browse-grid";
import { BrowsePagination } from "./browse-pagination";

const ITEMS_PER_PAGE = 12;

export function BrowseClientPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Extract initial values from URL SearchParams
  const initialQuery = searchParams.get("q") || "";
  const initialGenre = searchParams.get("genre") || "All";
  const initialStatus = searchParams.get("status") || "All";
  const initialFormat = searchParams.get("format") || "All";
  const initialAudio = searchParams.get("audio") || "All";
  const initialSeason = searchParams.get("season") || "All";
  const initialYear = searchParams.get("year") || "All";
  const initialSort = searchParams.get("sort") || "rating-desc";

  // Client States
  const [query, setQuery] = useState(initialQuery);
  const [genre, setGenre] = useState(initialGenre);
  const [status, setStatus] = useState(initialStatus);
  const [format, setFormat] = useState(initialFormat);
  const [audio, setAudio] = useState(initialAudio);
  const [season, setSeason] = useState(initialSeason);
  const [year, setYear] = useState(initialYear);
  const [sort, setSort] = useState(initialSort);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);

  // Custom Hook Lazy Loading
  const { animeList: fetchedList, isLoading } = useBrowseAnime({
    genre,
    query,
    status,
    type: format,
  });

  // Sync state to URL search parameters
  const updateUrlParams = useCallback(
    (newParams: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(newParams).forEach(([key, val]) => {
        if (val && val !== "All" && val !== "") {
          params.set(key, val);
        } else {
          params.delete(key);
        }
      });

      const queryString = params.toString();
      const newPath = queryString ? `${pathname}?${queryString}` : pathname;
      router.replace(newPath, { scroll: false });
    },
    [searchParams, pathname, router]
  );

  // Handle individual filter updates
  const handleQueryChange = (q: string) => {
    setQuery(q);
    setCurrentPage(1);
    updateUrlParams({ q, genre, status, format, audio, season, year, sort });
  };

  const handleGenreChange = (g: string) => {
    setGenre(g);
    setCurrentPage(1);
    updateUrlParams({ q: query, genre: g, status, format, audio, season, year, sort });
  };

  const handleStatusChange = (s: string) => {
    setStatus(s);
    setCurrentPage(1);
    updateUrlParams({ q: query, genre, status: s, format, audio, season, year, sort });
  };

  const handleFormatChange = (f: string) => {
    setFormat(f);
    setCurrentPage(1);
    updateUrlParams({ q: query, genre, status, format: f, audio, season, year, sort });
  };

  const handleAudioChange = (a: string) => {
    setAudio(a);
    setCurrentPage(1);
    updateUrlParams({ q: query, genre, status, format, audio: a, season, year, sort });
  };

  const handleSeasonChange = (s: string) => {
    setSeason(s);
    setCurrentPage(1);
    updateUrlParams({ q: query, genre, status, format, audio, season: s, year, sort });
  };

  const handleYearChange = (y: string) => {
    setYear(y);
    setCurrentPage(1);
    updateUrlParams({ q: query, genre, status, format, audio, season, year: y, sort });
  };

  const handleSortChange = (s: string) => {
    setSort(s);
    setCurrentPage(1);
    updateUrlParams({ q: query, genre, status, format, audio, season, year, sort: s });
  };

  const handleResetFilters = () => {
    setQuery("");
    setGenre("All");
    setStatus("All");
    setFormat("All");
    setAudio("All");
    setSeason("All");
    setYear("All");
    setSort("rating-desc");
    setCurrentPage(1);
    router.replace(pathname, { scroll: false });
  };

  // Compute Active Filters Count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (query) count++;
    if (genre !== "All") count++;
    if (status !== "All") count++;
    if (format !== "All") count++;
    if (audio !== "All") count++;
    if (season !== "All") count++;
    if (year !== "All") count++;
    return count;
  }, [query, genre, status, format, audio, season, year]);

  // Pagination Slicing
  const totalResults = fetchedList.length;
  const totalPages = Math.ceil(totalResults / ITEMS_PER_PAGE);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return fetchedList.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [fetchedList, currentPage]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        <BrowseFilters
          query={query}
          onQueryChange={handleQueryChange}
          genre={genre}
          onGenreChange={handleGenreChange}
          status={status}
          onStatusChange={handleStatusChange}
          format={format}
          onFormatChange={handleFormatChange}
          audio={audio}
          onAudioChange={handleAudioChange}
          season={season}
          onSeasonChange={handleSeasonChange}
          year={year}
          onYearChange={handleYearChange}
          sort={sort}
          onSortChange={handleSortChange}
          onResetFilters={handleResetFilters}
          activeFiltersCount={activeFiltersCount}
        />

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[3/4] w-full rounded-xl" />
                <Skeleton className="h-4 w-4/5 rounded" />
                <Skeleton className="h-3 w-1/2 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <BrowseGrid
            items={paginatedItems}
            totalResults={totalResults}
            totalAnimeCount={fetchedList.length}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onResetFilters={handleResetFilters}
          />
        )}

        <BrowsePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </main>
    </div>
  );
}
