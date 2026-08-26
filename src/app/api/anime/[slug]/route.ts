import { NextResponse } from "next/server";
import { getAnimeBySlug, getTrendingAnime } from "@/lib/db/queries/anime";
import { getEpisodesByAnimeSlug } from "@/lib/db/queries/episodes";
import { getCacheItem, setCacheItem } from "@/lib/cache";
import { FEATURED_ANIME as FALLBACK_ANIME, LATEST_EPISODES, TRENDING_ANIME } from "@/lib/mock-anime";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const CACHE_KEY = `kv_anime_details_${slug}`;
  const CACHE_TTL = 300;

  try {
    const cached = await getCacheItem<{
      anime: typeof FALLBACK_ANIME;
      episodes: typeof LATEST_EPISODES;
      recommendations: typeof TRENDING_ANIME;
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
      const mockAnime = { ...FALLBACK_ANIME, slug, title: slug.replace(/-/g, " ").toUpperCase() };
      return NextResponse.json({
        anime: mockAnime,
        episodes: LATEST_EPISODES,
        recommendations: TRENDING_ANIME.slice(0, 4),
      }, { status: 200 });
    }

    const [episodes, trending] = await Promise.all([
      getEpisodesByAnimeSlug(slug).catch(() => LATEST_EPISODES),
      getTrendingAnime(5).catch(() => TRENDING_ANIME.slice(0, 5)),
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
    const mockAnime = { ...FALLBACK_ANIME, slug, title: slug.replace(/-/g, " ").toUpperCase() };
    return NextResponse.json({
      anime: mockAnime,
      episodes: LATEST_EPISODES,
      recommendations: TRENDING_ANIME.slice(0, 4),
    }, { status: 200 });
  }
}
