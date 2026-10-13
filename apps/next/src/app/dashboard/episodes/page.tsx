"use client";

import { useState, useEffect, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { EpisodeHeader } from "./components/episode-header";
import { EpisodeStatsCards } from "./components/episode-stats";
import { EpisodeFilters } from "./components/episode-filters";
import { EpisodeTable } from "./components/episode-table";
import { EpisodePreviewModal } from "./components/episode-preview-modal";
import { useDashboardEpisodes } from "@/hooks/use-dashboard-episodes";
import type { EpisodeItem, EpisodeFilterState, EpisodeStats } from "./types";

export default function EpisodeManagerPage() {
  const { episodes: fetchedEpisodes, isLoading } = useDashboardEpisodes();
  const [episodes, setEpisodes] = useState<EpisodeItem[]>([]);
  const [previewEpisode, setPreviewEpisode] = useState<EpisodeItem | null>(null);

  useEffect(() => {
    if (fetchedEpisodes && fetchedEpisodes.length > 0) {
      const mapped: EpisodeItem[] = fetchedEpisodes.map((ep: any) => ({
        id: ep.id,
        animeId: ep.animeId || "ani-1",
        animeSlug: ep.animeSlug || "anime-slug",
        animeTitle: ep.animeTitle || "Anime Series",
        episodeNumber: ep.episodeNumber || 1,
        title: ep.title || `Episode ${ep.episodeNumber || 1}`,
        duration: "24:15",
        status: "published",
        airDate: ep.airDate || new Date().toISOString(),
        thumbnail: ep.thumbnail || "",
        viewsCount: ep.viewsCount || 0,
        subtitles: [
          {
            id: "sub-1",
            language: "Indonesian",
            label: "Indonesian (Sub)",
            code: "id",
            url: "/subs/id.vtt",
            isDefault: true,
            format: "vtt",
          },
        ],
        audioTracks: [
          {
            id: "aud-1",
            language: "Japanese",
            label: "Japanese (Original)",
            type: "original",
            isDefault: true,
          },
        ],
        isVip: false,
        servers: [
          {
            id: "srv-1",
            name: "Server #1 (Primary)",
            type: "hls",
            url: "https://stream.goxstream.com/hls/1.m3u8",
            isPrimary: true,
            health: "online",
            quality: "1080p",
            latencyMs: 45,
          },
        ],
      }));
      setEpisodes(mapped);
    }
  }, [fetchedEpisodes]);


  const stats: EpisodeStats = useMemo(() => {
    return {
      totalEpisodes: episodes.length,
      publishedEpisodes: episodes.filter((e) => e.status === "published").length,
      processingEpisodes: episodes.filter((e) => e.status === "processing").length,
      draftEpisodes: episodes.filter((e) => e.status === "draft").length,
      serverIssues: 0,
      totalViews: 0,
    };
  }, [episodes]);




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
        <EpisodeStatsCards stats={stats} />
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
