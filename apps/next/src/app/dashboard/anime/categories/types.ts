export type FormatCategoryCode = "TV" | "MOVIE" | "OVA" | "ONA" | "SPECIAL" | "MUSIC";

export interface CategoryItem {
  id: string;
  code: FormatCategoryCode;
  name: string;
  slug: string;
  animeCount: number;
  description: string;
  isActive: boolean;
  updatedAt: string;
}

export type GenreGroup = "Main Genre" | "Demographic" | "Theme" | "Explicit";

export interface GenreItem {
  id: string;
  name: string;
  slug: string;
  group: GenreGroup;
  animeCount: number;
  description?: string;
  colorBadge: string; // e.g. "primary" | "secondary" | "outline"
  isActive: boolean;
}

export interface CategoryFilterState {
  search: string;
  group: string;
  status: "all" | "active" | "inactive";
}
