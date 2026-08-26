import { NextResponse } from "next/server";
import { getLatestEpisodes } from "@/lib/db/queries/episodes";
import { getTrendingAnime } from "@/lib/db/queries/anime";
import { getCacheItem, setCacheItem } from "@/lib/cache";
import { LATEST_EPISODES, TRENDING_ANIME } from "@/lib/mock-anime";

export async function GET() {
  const CACHE_KEY = "kv_schedule_anime_v1";
  const CACHE_TTL = 300;

  try {
    const cached = await getCacheItem<{
      latestEpisodes: typeof LATEST_EPISODES;
      trendingAnime: typeof TRENDING_ANIME;
    }>(CACHE_KEY);

    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          "Cache-Control": "public, max-age=60, s-maxage=300",
          "X-Cache": "HIT-CACHE",
        },
      });
    }

    const [latestEpisodes, trendingAnime] = await Promise.all([
      getLatestEpisodes(10).catch(() => LATEST_EPISODES),
      getTrendingAnime(10).catch(() => TRENDING_ANIME),
    ]);

    const data = {
      latestEpisodes: latestEpisodes.length > 0 ? latestEpisodes : LATEST_EPISODES,
      trendingAnime: trendingAnime.length > 0 ? trendingAnime : TRENDING_ANIME,
    };

    await setCacheItem(CACHE_KEY, data, CACHE_TTL);

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=300",
        "X-Cache": "MISS-CACHE",
      },
    });
  } catch {
    return NextResponse.json(
      { latestEpisodes: LATEST_EPISODES, trendingAnime: TRENDING_ANIME },
      { status: 200 }
    );
  }
}
