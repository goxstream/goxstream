import type { WatchlistTabValue, WatchlistViewMode } from "@/hooks/use-watchlist";

export type { WatchlistTabValue, WatchlistViewMode };

export interface WatchlistTabOption {
  label: string;
  value: WatchlistTabValue;
}

export const WATCHLIST_TABS: WatchlistTabOption[] = [
  { label: "All Titles", value: "all" },
  { label: "Watching", value: "watching" },
  { label: "Plan to Watch", value: "plan_to_watch" },
  { label: "Completed", value: "completed" },
  { label: "Favorites Only", value: "favorites" },
];
