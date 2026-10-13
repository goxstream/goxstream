"use client";

import { useState, useEffect } from "react";
import type { UserProfile, WatchlistItem, WatchHistoryItem } from "@/types/user";
import type { UserProfileResponse } from "@/lib/api/types";

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [history, setHistory] = useState<WatchHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    fetch("/api/user/profile")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch user profile");
        }
        return res.json() as Promise<UserProfileResponse>;
      })
      .then((data) => {
        if (!isMounted) return;
        setProfile(data.profile);
        setWatchlist(data.activity.watchlist || []);
        setHistory(data.activity.history || []);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : "An error occurred");
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    profile,
    watchlist,
    history,
    isLoading,
    error,
  };
}
