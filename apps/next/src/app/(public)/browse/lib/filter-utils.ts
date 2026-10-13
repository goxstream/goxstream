import type { AnimeItem } from "@/types/anime";

export interface BrowseFilterCriteria {
  query?: string;
  genre?: string;
  status?: string;
  format?: string;
  audio?: string;
  season?: string;
  year?: string;
}

/**
 * Parses comma-separated genre string into cleaned array of individual genres.
 */
export function parseActiveGenres(genreStr?: string): string[] {
  if (!genreStr || genreStr === "All") return [];
  return genreStr
    .split(",")
    .map((g) => g.trim())
    .filter(Boolean);
}

/**
 * Removes a target genre from comma-separated genre selection string.
 * Returns 'All' if no genres remain selected.
 */
export function removeGenreFromSelection(
  currentGenreStr: string,
  targetGenre: string
): string {
  const genres = parseActiveGenres(currentGenreStr);
  const updated = genres.filter((g) => g !== targetGenre);
  return updated.length === 0 ? "All" : updated.join(",");
}

/**
 * Filters anime list strictly requiring ALL conditions to match (AND / && logic across all filters).
 */
export function filterAnimeByStrictAll(
  items: AnimeItem[],
  criteria: BrowseFilterCriteria
): AnimeItem[] {
  const activeGenres = parseActiveGenres(criteria.genre);

  return items.filter((anime) => {
    // 1. Strict AND (&&) Multi-Genre Matching
    if (activeGenres.length > 0) {
      const hasAllGenres = activeGenres.every((sg) =>
        anime.genres.some((ag) => ag.toLowerCase() === sg.toLowerCase())
      );
      if (!hasAllGenres) return false;
    }

    // 2. Strict AND (&&) Search Query Matching
    if (criteria.query && criteria.query.trim() !== "") {
      const q = criteria.query.toLowerCase().trim();
      const titleMatch =
        anime.title.toLowerCase().includes(q) ||
        (anime.japaneseTitle && anime.japaneseTitle.toLowerCase().includes(q));
      if (!titleMatch) return false;
    }

    // 3. Strict AND (&&) Status Matching
    if (criteria.status && criteria.status !== "All") {
      if (anime.status.toLowerCase() !== criteria.status.toLowerCase())
        return false;
    }

    // 4. Strict AND (&&) Format / Type Matching
    if (criteria.format && criteria.format !== "All") {
      if (anime.type.toLowerCase() !== criteria.format.toLowerCase())
        return false;
    }

    // 5. Strict AND (&&) Sub/Dub Audio Matching
    if (criteria.audio && criteria.audio !== "All") {
      if (anime.subOrDub.toLowerCase() !== criteria.audio.toLowerCase())
        return false;
    }

    // 6. Strict AND (&&) Season Matching
    if (criteria.season && criteria.season !== "All") {
      if (anime.season.toLowerCase() !== criteria.season.toLowerCase())
        return false;
    }

    // 7. Strict AND (&&) Release Year Matching
    if (criteria.year && criteria.year !== "All") {
      if (String(anime.year) !== criteria.year) return false;
    }

    return true;
  });
}
