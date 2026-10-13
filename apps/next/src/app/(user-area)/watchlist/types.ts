import type { WatchlistItem, WatchlistStatus } from "@/types/user";

export type WatchlistTabValue = "all" | "watching" | "plan_to_watch" | "completed" | "favorites";

export type WatchlistViewMode = "grid" | "list";

export interface WatchlistTabOption {
  label: string;
  value: WatchlistTabValue;
}
