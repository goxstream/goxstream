"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useState, useMemo, useCallback } from "react";
import { useBrowseAnime } from "@/hooks/use-browse-anime";
import { parseActiveGenres, filterAnimeByStrictAll } from "../lib/filter-utils";

const ITEMS_PER_PAGE = 12;

export function useBrowseFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Initial values from URL SearchParams
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

  // Fetch via HTTP GET API (/api/anime/browse) - NO Direct DB Query in Client!
  const { animeList: fetchedList, isLoading } = useBrowseAnime({
    genre,
    query,
    status,
    type: format,
  });

  // Parse active genres array
  const activeGenres = useMemo(() => parseActiveGenres(genre), [genre]);

  // Strict Client-Side Multi-Criteria AND (&&) Filtering
  const filteredAnimeList = useMemo(() => {
    return filterAnimeByStrictAll(fetchedList, {
      query,
      genre,
      status,
      format,
      audio,
      season,
      year,
    });
  }, [fetchedList, query, genre, status, format, audio, season, year]);

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
    if (activeGenres.length > 0) count += activeGenres.length;
    if (status !== "All") count++;
    if (format !== "All") count++;
    if (audio !== "All") count++;
    if (season !== "All") count++;
    if (year !== "All") count++;
    return count;
  }, [query, activeGenres, status, format, audio, season, year]);

  // Pagination Slicing
  const totalResults = filteredAnimeList.length;
  const totalPages = Math.ceil(totalResults / ITEMS_PER_PAGE);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAnimeList.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAnimeList, currentPage]);

  return {
    filtersProps: {
      query,
      genre,
      status,
      format,
      audio,
      season,
      year,
      sort,
      activeFiltersCount,
      onQueryChange: handleQueryChange,
      onGenreChange: handleGenreChange,
      onStatusChange: handleStatusChange,
      onFormatChange: handleFormatChange,
      onAudioChange: handleAudioChange,
      onSeasonChange: handleSeasonChange,
      onYearChange: handleYearChange,
      onSortChange: handleSortChange,
      onResetFilters: handleResetFilters,
    },
    gridProps: {
      items: paginatedItems,
      totalResults,
      totalAnimeCount: fetchedList.length,
      viewMode,
      onViewModeChange: setViewMode,
      onResetFilters: handleResetFilters,
    },
    paginationProps: {
      currentPage,
      totalPages,
      onPageChange: setCurrentPage,
    },
    isLoading,
  };
}
