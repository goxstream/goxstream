import type { AnimeItem } from "@/types/anime";

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
 * Filters anime list strictly requiring ALL selected genres (AND / && logic).
 */
export function filterAnimeByStrictGenres(
  items: AnimeItem[],
  selectedGenres: string[]
): AnimeItem[] {
  if (selectedGenres.length === 0) return items;

  const normalizedSelected = selectedGenres.map((sg) => sg.toLowerCase());

  return items.filter((anime) =>
    normalizedSelected.every((sg) =>
      anime.genres.some((ag) => ag.toLowerCase() === sg)
    )
  );
}
