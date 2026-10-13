import { NextResponse } from "next/server";
import { getEpisodeWatchDetails, getEpisodesByAnimeSlug } from "@/lib/db/queries/episodes";
import { getTrendingAnime } from "@/lib/db/queries/anime";
import { getCacheItem, setCacheItem } from "@/lib/cache";
import type { EpisodeWatchDetails, AnimeItem, EpisodeItem } from "@/types/anime";

function parseEpisodeNumber(epParam: string): number {
  const match = epParam.match(/\d+/);
  return match ? parseInt(match[0], 10) : 1;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string; episode: string }> }
) {
  const { slug, episode: epParam } = await params;
  const epNum = parseEpisodeNumber(epParam);

  const CACHE_KEY = `kv_episode_watch_${slug}_${epNum}`;
  const CACHE_TTL = 300;

  try {
    const cached = await getCacheItem<{
      details: EpisodeWatchDetails;
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

    const details = await getEpisodeWatchDetails(slug, epNum).catch(() => null);

    if (!details) {
      return NextResponse.json({ error: "Episode watch details not found" }, { status: 404 });
    }

    const [episodes, trending] = await Promise.all([
      getEpisodesByAnimeSlug(slug).catch(() => []),
      getTrendingAnime(5).catch(() => []),
    ]);

    const recommendations = trending.filter((item) => item.slug !== details.anime.slug).slice(0, 4);

    const data = { details, episodes, recommendations };

    await setCacheItem(CACHE_KEY, data, CACHE_TTL);

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=300",
        "X-Cache": "MISS-CACHE",
      },
    });
  } catch {
    return NextResponse.json({ error: "Server error fetching episode details" }, { status: 500 });
  }
}
