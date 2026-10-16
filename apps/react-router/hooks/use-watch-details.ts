import { useState, useEffect } from "react";
import type { EpisodeWatchDetails, EpisodeItem, AnimeItem, StreamSource } from "@/types/anime";
import { animeApi, episodesApi } from "@/lib/api-client";
import { V1AnimeGetSortEnum } from "@goxstream/goxstream-sdk";
import {
  mapDetailAnimeToItem,
  mapCatalogAnimeToItem,
  mapSdkEpisodeToItem,
  mapSdkStreamSource,
} from "@/lib/anime-mappers";

function parseEpisodeNumber(epParam: string): number {
  const match = epParam.match(/\d+/);
  return match ? parseInt(match[0], 10) : 1;
}

export function useWatchDetails(slug: string, episodeNumParam: string) {
  const [details, setDetails] = useState<EpisodeWatchDetails | null>(null);
  const [episodes, setEpisodes] = useState<EpisodeItem[]>([]);
  const [recommendations, setRecommendations] = useState<AnimeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFoundError, setNotFoundError] = useState(false);

  const epNum = parseEpisodeNumber(episodeNumParam);

  useEffect(() => {
    if (!slug) return;

    let isMounted = true;
    setIsLoading(true);
    setNotFoundError(false);

    Promise.all([
      animeApi.v1AnimeSlugGet({ slug }).catch(() => null),
      episodesApi.v1AnimeSlugEpisodesGet({ slug }).catch(() => null),
      animeApi.v1AnimeGet({ limit: "8", sort: V1AnimeGetSortEnum.Popular }).catch(
        () => null,
      ),
    ])
      .then(async ([animeRes, episodesRes, recRes]) => {
        if (!isMounted) return;

        if (!animeRes || !animeRes.data) {
          setNotFoundError(true);
          return;
        }

        const a = animeRes.data;
        const mappedAnime = mapDetailAnimeToItem(a);

        const mappedEpisodes = (episodesRes?.data || []).map((ep) =>
          mapSdkEpisodeToItem(ep, {
            id: a.id,
            slug: a.slug,
            title: mappedAnime.title,
            coverImage: a.coverImage,
          }),
        );

        // Find current episode matching epNum or fallback to first
        let currentEpisode = mappedEpisodes.find((e) => e.episodeNumber === epNum);
        if (!currentEpisode && mappedEpisodes.length > 0) {
          currentEpisode = mappedEpisodes[0];
        }

        if (!currentEpisode) {
          // Virtual episode if none in database yet
          currentEpisode = {
            id: `ep-${epNum}`,
            animeId: a.id,
            animeSlug: a.slug,
            animeTitle: mappedAnime.title,
            episodeNumber: epNum,
            episodeTitle: `Episode ${epNum}`,
            thumbnail: a.coverImage || "",
            duration: "24m",
            releasedAt: "Just now",
            isSub: true,
            isDub: false,
          };
        }

        // Fetch stream sources for the episode
        let streamSources: StreamSource[] = [];
        if (currentEpisode.id && !currentEpisode.id.startsWith("ep-")) {
          try {
            const streamRes = await episodesApi.v1EpisodesIdStreamGet({
              id: currentEpisode.id,
            });
            if (streamRes?.sources?.length) {
              streamSources = streamRes.sources.map(mapSdkStreamSource);
            }
          } catch {
            // Silently handle stream fetch failures
          }
        }

        // No fallback — if no stream sources exist, UI should show an error message

        const currentIndex = mappedEpisodes.findIndex(
          (e) => e.episodeNumber === currentEpisode?.episodeNumber,
        );
        const prevEpisode = currentIndex > 0 ? mappedEpisodes[currentIndex - 1] : undefined;
        const nextEpisode =
          currentIndex >= 0 && currentIndex < mappedEpisodes.length - 1
            ? mappedEpisodes[currentIndex + 1]
            : undefined;

        const mappedRecs = (recRes?.data || [])
          .filter((r) => r.slug !== slug)
          .slice(0, 4)
          .map(mapCatalogAnimeToItem);

        setDetails({
          anime: mappedAnime,
          episode: currentEpisode,
          prevEpisode,
          nextEpisode,
          sources: streamSources,
        });
        setEpisodes(mappedEpisodes);
        setRecommendations(mappedRecs);
      })
      .catch(() => {
        if (!isMounted) return;
        setNotFoundError(true);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slug, epNum]);

  return {
    details,
    episodes,
    recommendations,
    isLoading,
    notFoundError,
  };
}
