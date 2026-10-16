"use client";

import { useState, useEffect, useMemo } from "react";
import { userApi, animeApi } from "@/lib/api-client";
import { mapCatalogAnimeToItem } from "@/lib/anime-mappers";
import type { WatchlistItem, WatchlistStatus } from "@/types/user";
import type { AnimeItem } from "@/types/anime";

export type WatchlistTabValue =
  | "all"
  | "watching"
  | "plan_to_watch"
  | "completed"
  | "on_hold"
  | "dropped"
  | "favorites";

export type WatchlistViewMode = "grid" | "list";

export function useWatchlist() {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<WatchlistTabValue>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<WatchlistViewMode>("grid");

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    userApi
      .v1UserWatchlistGet()
      .then(async (res) => {
        if (!isMounted) return;

        const rawItems = res.data || [];
        // Enrich watchlist items with anime data
        const animeMap = new Map<string, AnimeItem>();
        try {
          const catalogRes = await animeApi.v1AnimeGet({ limit: "50" });
          (catalogRes.data || []).forEach((a) => {
            const item = mapCatalogAnimeToItem(a);
            animeMap.set(item.id, item);
          });
        } catch {
          // Best-effort enrichment
        }

        const mapped: WatchlistItem[] = rawItems.map((w: any) => ({
          id: w.id,
          anime: animeMap.get(w.animeId) || {
            id: w.animeId,
            slug: w.animeId,
            title: "Unknown Anime",
            coverImage: "",
            bannerImage: "",
            rating: 0,
            episodesCount: 0,
            status: "Ongoing",
            type: "TV",
            season: "",
            year: 0,
            genres: [],
            studio: "",
            subOrDub: "SUB",
            synopsis: "",
          },
          status: (w.status as WatchlistStatus) || "plan_to_watch",
          isFavorite: w.isFavorite ?? false,
          currentEpisode: w.currentEpisode ?? 0,
          totalEpisodes: animeMap.get(w.animeId)?.episodesCount ?? 0,
          rating: w.userRating,
          updatedAt: w.updatedAt || w.createdAt || "",
        }));

        setItems(mapped);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : "Failed to load watchlist");
        setItems([]);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleStatusChange = (id: string, newStatus: WatchlistStatus) => {
    const target = items.find((i) => i.id === id);
    if (target) {
      userApi
        .v1UserWatchlistAnimeIdPatch({
          animeId: target.anime.id,
          v1UserWatchlistAnimeIdPatchRequest: { status: newStatus },
        })
        .catch(() => {});
    }
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item)),
    );
  };

  const handleToggleFavorite = (id: string) => {
    const target = items.find((i) => i.id === id);
    if (target) {
      userApi
        .v1UserWatchlistAnimeIdPatch({
          animeId: target.anime.id,
          v1UserWatchlistAnimeIdPatchRequest: { isFavorite: !target.isFavorite },
        })
        .catch(() => {});
    }
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isFavorite: !item.isFavorite } : item)),
    );
  };

  const handleRemove = (id: string) => {
    const target = items.find((i) => i.id === id);
    if (target) {
      userApi
        .v1UserWatchlistAnimeIdDelete({ animeId: target.anime.id })
        .catch(() => {});
    }
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (activeTab === "favorites") {
        if (!item.isFavorite) return false;
      } else if (activeTab !== "all") {
        if (item.status !== activeTab) return false;
      }

      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        return (
          item.anime.title.toLowerCase().includes(q) ||
          item.anime.genres.some((g) => g.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [items, activeTab, searchQuery]);

  const getItemCount = (tabValue: WatchlistTabValue) => {
    if (tabValue === "all") return items.length;
    if (tabValue === "favorites") return items.filter((i) => i.isFavorite).length;
    return items.filter((i) => i.status === tabValue).length;
  };

  return {
    items: filteredItems,
    allItemsCount: items.length,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    isLoading,
    error,
    handleStatusChange,
    handleToggleFavorite,
    handleRemove,
    getItemCount,
  };
}
