"use client";

import { useState, useEffect } from "react";
import { userApi } from "@/lib/api-client";
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
  const [error, setError] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    userApi
      .v1UserSettingsGet()
      .then((res) => {
        if (!isMounted) return;
        const data = (res as any).data;
        if (data) {
          setSettings({
            profile: {
              displayName: data.profile?.displayName ?? "",
              bio: data.profile?.bio ?? "",
              avatarUrl: data.profile?.avatarUrl ?? "",
            },
            player: {
              defaultQuality: data.player?.defaultQuality ?? "1080p",
              defaultSubtitle: data.player?.defaultSubtitle ?? "id",
              autoPlayNext: data.player?.autoPlayNext ?? true,
              autoSkipIntro: data.player?.autoSkipIntro ?? false,
              preferredAudio: data.player?.preferredAudio ?? "subbed",
            },
            notifications: {
              newEpisodeAlerts: data.notifications?.newEpisodeAlerts ?? true,
              watchlistUpdates: data.notifications?.watchlistUpdates ?? true,
              marketingEmails: data.notifications?.marketingEmails ?? false,
              publicWatchlist: data.notifications?.publicWatchlist ?? true,
            },
          });
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : "Failed to load settings");
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await userApi.v1UserSettingsPatch({
        v1UserSettingsPatchRequest: settings as any,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch {
      setError("Failed to save settings");
    }
  };

  return {
    settings,
    setSettings,
    isLoading,
    error,
    savedSuccess,
    handleSave,
  };
}
