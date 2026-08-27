"use client";

import { useState, useEffect, useMemo } from "react";
import type { WatchlistItem, WatchlistStatus } from "@/types/user";
import type { WatchlistTabValue, WatchlistViewMode } from "../types";

export function useWatchlist() {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<WatchlistTabValue>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<WatchlistViewMode>("grid");

  useEffect(() => {
    let isMounted = true;

    async function fetchWatchlist() {
      try {
        const res = await fetch("/api/user/watchlist");
        if (res.ok) {
          const data = (await res.json()) as { items?: WatchlistItem[] };
          if (isMounted) {
            setItems(data.items || []);
          }
        }
      } catch {
        if (isMounted) {
          setItems([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchWatchlist();

    return () => {
      isMounted = false;
    };
  }, []);


  const handleStatusChange = (id: string, newStatus: WatchlistStatus) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
  };

  const handleToggleFavorite = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  const handleRemove = (id: string) => {
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
    handleStatusChange,
    handleToggleFavorite,
    handleRemove,
    getItemCount,
  };
}
