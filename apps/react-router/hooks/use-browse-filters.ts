import { useSearchParams } from "react-router";
import { useState, useMemo, useCallback } from "react";
import { useBrowseAnime } from "@/hooks/use-browse-anime";
import { parseActiveGenres, filterAnimeByStrictAll } from "@/lib/filter-utils";

const ITEMS_PER_PAGE = 12;

export function useBrowseFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialQuery = searchParams.get("q") || "";
  const initialGenre = searchParams.get("genre") || "All";
  const initialStatus = searchParams.get("status") || "All";
  const initialFormat = searchParams.get("format") || "All";
  const initialAudio = searchParams.get("audio") || "All";
  const initialSeason = searchParams.get("season") || "All";
  const initialYear = searchParams.get("year") || "All";
  const initialSort = searchParams.get("sort") || "rating-desc";

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

  const { animeList: fetchedList, isLoading, error } = useBrowseAnime({
    genre,
    query,
    status,
    type: format,
  });

  const activeGenres = useMemo(() => parseActiveGenres(genre), [genre]);

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

  const updateUrlParams = useCallback(
    (newParams: Record<string, string>) => {
      const params = new URLSearchParams(searchParams);

      Object.entries(newParams).forEach(([key, val]) => {
        if (val && val !== "All" && val !== "") {
          params.set(key, val);
        } else {
          params.delete(key);
        }
      });

      setSearchParams(params, { preventScrollReset: true });
    },
    [searchParams, setSearchParams],
  );

  const handleQueryChange = useCallback(
    (q: string) => {
      setQuery(q);
      setCurrentPage(1);
      updateUrlParams({ q });
    },
    [updateUrlParams],
  );

  const handleGenreChange = useCallback(
    (g: string) => {
      setGenre(g);
      setCurrentPage(1);
      updateUrlParams({ genre: g });
    },
    [updateUrlParams],
  );

  const handleStatusChange = useCallback(
    (s: string) => {
      setStatus(s);
      setCurrentPage(1);
      updateUrlParams({ status: s });
    },
    [updateUrlParams],
  );

  const handleFormatChange = useCallback(
    (f: string) => {
      setFormat(f);
      setCurrentPage(1);
      updateUrlParams({ format: f });
    },
    [updateUrlParams],
  );

  const handleAudioChange = useCallback(
    (a: string) => {
      setAudio(a);
      setCurrentPage(1);
      updateUrlParams({ audio: a });
    },
    [updateUrlParams],
  );

  const handleSeasonChange = useCallback(
    (s: string) => {
      setSeason(s);
      setCurrentPage(1);
      updateUrlParams({ season: s });
    },
    [updateUrlParams],
  );

  const handleYearChange = useCallback(
    (y: string) => {
      setYear(y);
      setCurrentPage(1);
      updateUrlParams({ year: y });
    },
    [updateUrlParams],
  );

  const handleSortChange = useCallback(
    (s: string) => {
      setSort(s);
      setCurrentPage(1);
      updateUrlParams({ sort: s });
    },
    [updateUrlParams],
  );

  const handleResetFilters = useCallback(() => {
    setQuery("");
    setGenre("All");
    setStatus("All");
    setFormat("All");
    setAudio("All");
    setSeason("All");
    setYear("All");
    setSort("rating-desc");
    setCurrentPage(1);
    setSearchParams(new URLSearchParams(), { preventScrollReset: true });
  }, [setSearchParams]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (activeGenres.length > 0) count += activeGenres.length;
    if (status !== "All") count++;
    if (format !== "All") count++;
    if (audio !== "All") count++;
    if (season !== "All") count++;
    if (year !== "All") count++;
    if (query) count++;
    return count;
  }, [activeGenres, status, format, audio, season, year, query]);

  const sortedAnimeList = useMemo(() => {
    const list = [...filteredAnimeList];
    if (sort === "rating-desc") list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    else if (sort === "rating-asc") list.sort((a, b) => (a.rating || 0) - (b.rating || 0));
    else if (sort === "year-desc") list.sort((a, b) => (b.year || 0) - (a.year || 0));
    else if (sort === "year-asc") list.sort((a, b) => (a.year || 0) - (b.year || 0));
    else if (sort === "title-asc") list.sort((a, b) => a.title.localeCompare(b.title));
    else if (sort === "title-desc") list.sort((a, b) => b.title.localeCompare(a.title));
    return list;
  }, [filteredAnimeList, sort]);

  const totalPages = Math.ceil(sortedAnimeList.length / ITEMS_PER_PAGE) || 1;
  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedAnimeList.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedAnimeList, currentPage]);

  return {
    query,
    onQueryChange: handleQueryChange,
    genre,
    onGenreChange: handleGenreChange,
    status,
    onStatusChange: handleStatusChange,
    format,
    onFormatChange: handleFormatChange,
    audio,
    onAudioChange: handleAudioChange,
    season,
    onSeasonChange: handleSeasonChange,
    year,
    onYearChange: handleYearChange,
    sort,
    onSortChange: handleSortChange,
    viewMode,
    onViewModeChange: setViewMode,
    currentPage,
    onPageChange: setCurrentPage,
    totalPages,
    totalResults: sortedAnimeList.length,
    activeFiltersCount,
    onResetFilters: handleResetFilters,
    paginatedList,
    activeGenres,
    isLoading,
    error,
  };
}
