"use client";

import { useState, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { EpisodeHeader } from "./components/episode-header";
import { EpisodeStatsCards } from "./components/episode-stats";
import { EpisodeFilters } from "./components/episode-filters";
import { EpisodeTable } from "./components/episode-table";
import { EpisodePreviewModal } from "./components/episode-preview-modal";
import { useDashboardEpisodes } from "@/hooks/use-dashboard-episodes";
import { MOCK_EPISODES, MOCK_EPISODE_STATS } from "./constants";
import type { EpisodeItem, EpisodeFilterState } from "./types";

export default function EpisodeManagerPage() {
  const { isLoading } = useDashboardEpisodes();
  const [episodes, setEpisodes] = useState<EpisodeItem[]>(MOCK_EPISODES);
  const [previewEpisode, setPreviewEpisode] = useState<EpisodeItem | null>(null);

  // Filter state
  const [filters, setFilters] = useState<EpisodeFilterState>({
    search: "",
    animeId: "all",
    status: "all",
    serverStatus: "all",
    sortBy: "newest",
  });

  const animeOptions = useMemo(() => {
    const map = new Map<string, string>();
    episodes.forEach((ep) => {
      if (!map.has(ep.animeId)) {
        map.set(ep.animeId, ep.animeTitle);
      }
    });
    return Array.from(map.entries()).map(([id, title]) => ({ id, title }));
  }, [episodes]);

  const handleFilterChange = (key: keyof EpisodeFilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      animeId: "all",
      status: "all",
      serverStatus: "all",
      sortBy: "newest",
    });
  };

  const handleDeleteEpisode = (id: string) => {
    setEpisodes((prev) => prev.filter((ep) => ep.id !== id));
  };

  // Filtered and sorted dataset
  const filteredEpisodes = useMemo(() => {
    return episodes
      .filter((ep) => {
        if (filters.search) {
          const q = filters.search.toLowerCase();
          const matchesTitle = ep.title.toLowerCase().includes(q);
          const matchesAnime = ep.animeTitle.toLowerCase().includes(q);
          const matchesNum = ep.episodeNumber.toString() === q;
          if (!matchesTitle && !matchesAnime && !matchesNum) return false;
        }

        if (filters.animeId !== "all" && ep.animeId !== filters.animeId) return false;
        if (filters.status !== "all" && ep.status !== filters.status) return false;

        if (filters.serverStatus !== "all") {
          const hasMatchingHealth = ep.servers?.some(
            (srv) => srv.health === filters.serverStatus
          );
          if (!hasMatchingHealth) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === "newest") return new Date(b.airDate).getTime() - new Date(a.airDate).getTime();
        if (filters.sortBy === "oldest") return new Date(a.airDate).getTime() - new Date(b.airDate).getTime();
        if (filters.sortBy === "views") return b.viewsCount - a.viewsCount;
        if (filters.sortBy === "number") return b.episodeNumber - a.episodeNumber;
        return 0;
      });
  }, [episodes, filters]);

  return (
    <div className="space-y-6 p-6">
      <EpisodeHeader />

      {isLoading ? (
        <Skeleton className="h-28 w-full rounded-xl bg-card border border-border/60" />
      ) : (
        <EpisodeStatsCards stats={MOCK_EPISODE_STATS} />
      )}

      <EpisodeFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        animeOptions={animeOptions}
      />

      {isLoading ? (
        <Skeleton className="h-96 w-full rounded-xl bg-card border border-border/60" />
      ) : (
        <EpisodeTable
          episodes={filteredEpisodes}
          onPreview={(ep) => setPreviewEpisode(ep)}
          onDelete={handleDeleteEpisode}
        />
      )}

      <EpisodePreviewModal
        episode={previewEpisode}
        isOpen={!!previewEpisode}
        onClose={() => setPreviewEpisode(null)}
      />
    </div>
  );
}
