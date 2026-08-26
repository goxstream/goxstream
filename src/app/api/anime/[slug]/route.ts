import { NextResponse } from "next/server";
import { getAnimeBySlug, getTrendingAnime } from "@/lib/db/queries/anime";
import { getEpisodesByAnimeSlug } from "@/lib/db/queries/episodes";
import { getCacheItem, setCacheItem } from "@/lib/cache";
import type { AnimeItem, EpisodeItem } from "@/types/anime";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const CACHE_KEY = `kv_anime_details_${slug}`;
  const CACHE_TTL = 300;

  try {
    const cached = await getCacheItem<{
      anime: AnimeItem | null;
      episodes: EpisodeItem[];
      recommendations: AnimeItem[];
    }>(CACHE_KEY);

    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          "Cache-Control": "public, max-age=60, s-maxage=300",
          "X-Cache": "HIT-CACHE",
        },
      });
    }

    const anime = await getAnimeBySlug(slug).catch(() => null);

    if (!anime) {
      return NextResponse.json({ error: "Anime not found" }, { status: 404 });
    }

    const [episodes, trending] = await Promise.all([
      getEpisodesByAnimeSlug(slug).catch(() => []),
      getTrendingAnime(5).catch(() => []),
    ]);

    const recommendations = trending.filter((item) => item.slug !== anime.slug).slice(0, 4);

    const data = { anime, episodes, recommendations };

    await setCacheItem(CACHE_KEY, data, CACHE_TTL);

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=300",
        "X-Cache": "MISS-CACHE",
      },
    });
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
