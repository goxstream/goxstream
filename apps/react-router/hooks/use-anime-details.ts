import { useState, useEffect } from "react";
import type { AnimeItem, EpisodeItem } from "@/types/anime";
import { animeApi, episodesApi } from "@/lib/api-client";
import { V1AnimeGetSortEnum } from "@goxstream/goxstream-sdk";
import { mapDetailAnimeToItem, mapCatalogAnimeToItem, mapSdkEpisodeToItem } from "@/lib/anime-mappers";

export function useAnimeDetails(slug: string) {
  const [anime, setAnime] = useState<AnimeItem | null>(null);
  const [episodes, setEpisodes] = useState<EpisodeItem[]>([]);
  const [recommendations, setRecommendations] = useState<AnimeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFoundError, setNotFoundError] = useState(false);

  useEffect(() => {
    if (!slug) return;

    let isMounted = true;
    setIsLoading(true);
    setNotFoundError(false);

    Promise.all([
      animeApi.v1AnimeSlugGet({ slug }).catch(() => null),
      episodesApi.v1AnimeSlugEpisodesGet({ slug }).catch(() => null),
      animeApi.v1AnimeGet({ limit: "8", sort: V1AnimeGetSortEnum.Popular }).catch(() => null),
    ])
      .then(([animeRes, episodesRes, recRes]) => {
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

        const mappedRecs = (recRes?.data || [])
          .filter((r) => r.slug !== slug)
          .slice(0, 4)
          .map(mapCatalogAnimeToItem);

        setAnime(mappedAnime);
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
  }, [slug]);

  return {
    anime,
    episodes,
    recommendations,
    isLoading,
    notFoundError,
  };
}
