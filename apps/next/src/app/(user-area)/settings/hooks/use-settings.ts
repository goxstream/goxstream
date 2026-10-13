"use client";

import { useState, useEffect } from "react";
import type { UserSettings } from "@/types/user";

const DEFAULT_SETTINGS: UserSettings = {
  profile: {
    displayName: "",
    bio: "",
    avatarUrl: "",
  },
  player: {
    defaultQuality: "1080p",
    defaultSubtitle: "id",
    autoPlayNext: true,
    autoSkipIntro: false,
    preferredAudio: "subbed",
  },
  notifications: {
    newEpisodeAlerts: true,
    watchlistUpdates: true,
    marketingEmails: false,
    publicWatchlist: true,
  },
};

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchSettings() {
      try {
        const res = await fetch("/api/user/settings");
        if (res.ok) {
          const data = (await res.json()) as { settings?: UserSettings };
          if (isMounted && data.settings) {
            setSettings(data.settings);
          }
        }
      } catch {
        // Fallback
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    fetchSettings();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/user/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch {
      // Save error
    }
  };

  return {
    settings,
    setSettings,
    isLoading,
    savedSuccess,
    handleSave,
  };
}

