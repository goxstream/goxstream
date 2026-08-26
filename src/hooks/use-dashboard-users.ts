"use client";

import { useState, useEffect } from "react";
import type { UserProfile } from "@/types/user";

const MOCK_ADMIN_USERS: UserProfile[] = [
  {
    id: "usr-1",
    username: "alex_otaku",
    displayName: "Alex Rivera",
    email: "alex@example.com",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80",
    joinDate: "Jan 2025",
    isVip: true,
    vipTier: "Ultra VIP",
    bio: "Anime enthusiast & platform moderator.",
    stats: {
      animeCompleted: 15,
      episodesWatched: 120,
      hoursWatched: 48,
      watchlistCount: 24,
      favoriteGenres: [
        { genre: "Action", percentage: 45 },
        { genre: "Sci-Fi", percentage: 30 },
      ],
    },
  },
  {
    id: "usr-2",
    username: "kenji_streams",
    displayName: "Kenji Sato",
    email: "kenji@example.com",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80",
    joinDate: "Feb 2025",
    isVip: true,
    vipTier: "VIP Supporter",
    bio: "Lover of 90s classic cyber-punk anime.",
    stats: {
      animeCompleted: 8,
      episodesWatched: 85,
      hoursWatched: 32,
      watchlistCount: 16,
      favoriteGenres: [
        { genre: "Cyberpunk", percentage: 60 },
        { genre: "Action", percentage: 25 },
      ],
    },
  },
  {
    id: "usr-3",
    username: "yuki_san",
    displayName: "Yuki Tanaka",
    email: "yuki@example.com",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80",
    joinDate: "Mar 2025",
    isVip: false,
    bio: "Casual watcher & community reviewer.",
    stats: {
      animeCompleted: 4,
      episodesWatched: 42,
      hoursWatched: 16,
      watchlistCount: 10,
      favoriteGenres: [
        { genre: "Slice of Life", percentage: 50 },
        { genre: "Romance", percentage: 35 },
      ],
    },
  },
];

export function useDashboardUsers() {
  const [users, setUsers] = useState<UserProfile[]>(MOCK_ADMIN_USERS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchDashboardUsers() {
      try {
        const res = await fetch("/api/dashboard/users");
        if (res.ok) {
          const data = (await res.json()) as { users?: UserProfile[] };
          if (isMounted && data.users && data.users.length > 0) {
            setUsers(data.users);
          }
        }
      } catch {
        // Fallback
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchDashboardUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  return { users, isLoading };
}
