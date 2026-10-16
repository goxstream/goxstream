"use client";

import { useState, useEffect } from "react";
import { userApi, animeApi } from "@/lib/api-client";
import { mapCatalogAnimeToItem } from "@/lib/anime-mappers";
import type { UserProfile, WatchlistItem, WatchHistoryItem } from "@/types/user";
import type { WatchlistStatus } from "@/types/user";
import type { AnimeItem } from "@/types/anime";

function mapSdkProfile(data: any): UserProfile {
  return {
    id: data.id,
    username: data.name || data.email?.split("@")[0] || "user",
    displayName: data.name || "User",
    email: data.email || "",
    avatarUrl: data.image,
    bio: "",
    joinDate: data.createdAt || new Date().toISOString(),
    isVip: data.role === "vip" || data.membershipTier === "vip_pro",
    vipTier: data.membershipTier,
    stats: {
      animeCompleted: data.activity?.stats?.animeCompleted ?? 0,
      episodesWatched: data.activity?.stats?.episodesWatched ?? 0,
      hoursWatched: data.activity?.stats?.hoursWatched ?? 0,
      watchlistCount: data.activity?.stats?.watchlistCount ?? 0,
      favoriteGenres: data.activity?.stats?.favoriteGenres ?? [],
    },
  };
}

function mapSdkWatchlistItem(item: any, animeMap: Map<string, AnimeItem>): WatchlistItem {
  const anime = animeMap.get(item.animeId);
  return {
    id: item.id,
    anime: anime || {
      id: item.animeId,
      slug: item.animeId,
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
    status: (item.status as WatchlistStatus) || "plan_to_watch",
    isFavorite: item.isFavorite ?? false,
    currentEpisode: item.currentEpisode ?? 0,
    totalEpisodes: anime?.episodesCount ?? 0,
    rating: item.userRating,
    updatedAt: item.updatedAt || item.createdAt || "",
  };
}

function mapSdkHistoryItem(item: any): WatchHistoryItem {
  return {
    id: item.id,
    animeId: item.animeId,
    animeSlug: item.anime?.slug || `anime-${item.animeId}`,
    animeTitle: item.anime?.title || "Anime Series",
    animeCover: item.anime?.coverImage || "",
    episodeNumber: item.episodeNumber || 1,
    episodeTitle: item.episode?.title || `Episode ${item.episodeNumber || 1}`,
    progressPercent: item.progressPercent || 0,
    durationSeconds: item.durationSeconds || 0,
    watchedSeconds: item.progressSeconds || 0,
    lastWatchedAt: item.lastWatchedAt
      ? new Date(item.lastWatchedAt).toLocaleDateString()
      : "Recently",
  };
}

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

    userApi
      .v1UserProfileGet()
      .then(async (res) => {
        if (!isMounted) return;

        const data = res.data as any;
        setProfile(mapSdkProfile(data));

        // Map watchlist items — need anime details
        const watchlistRaw = data.activity?.watchlist || [];
        if (watchlistRaw.length > 0) {
          // Fetch anime details for watchlist items
          const animeMap = new Map<string, AnimeItem>();
          try {
            // Batch fetch from catalog
            const catalogRes = await animeApi.v1AnimeGet({ limit: "50" });
            (catalogRes.data || []).forEach((a) => {
              const item = mapCatalogAnimeToItem(a);
              animeMap.set(item.id, item);
            });
          } catch {
            // Best-effort enrichment
          }
          setWatchlist(watchlistRaw.map((w: any) => mapSdkWatchlistItem(w, animeMap)));
        }

        // Map history items
        const historyRaw = data.activity?.history || [];
        setHistory(historyRaw.map(mapSdkHistoryItem));
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : "Failed to load profile");
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
