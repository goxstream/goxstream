import { NextResponse } from "next/server";
import { getEpisodeWatchDetails, getEpisodesByAnimeSlug } from "@/lib/db/queries/episodes";
import { getTrendingAnime } from "@/lib/db/queries/anime";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { FEATURED_ANIME, LATEST_EPISODES, TRENDING_ANIME } from "@/lib/mock-anime";
import type { EpisodeWatchDetails } from "@/types/anime";

function parseEpisodeNumber(epParam: string): number {
  const match = epParam.match(/\d+/);
  return match ? parseInt(match[0], 10) : 1;
}

function getFallbackWatchDetails(slug: string, epNum: number): EpisodeWatchDetails {
  const anime = { ...FEATURED_ANIME, slug, title: slug.replace(/-/g, " ").toUpperCase() };
  const episode = {
    id: `ep-${epNum}`,
    animeId: anime.id,
    animeSlug: slug,
    animeTitle: anime.title,
    episodeNumber: epNum,
    episodeTitle: `Episode ${epNum}`,
    thumbnail: anime.coverImage,
    duration: "24 min",
    releasedAt: "Recently",
    isSub: true,
    isDub: false,
  };

  return {
    anime,
    episode,
    sources: [
      {
        id: `src-${epNum}`,
        serverName: "GoxStream CDN Alpha",
        quality: "1080p",
        url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
        type: "hls",
        isPrimary: true,
      },
    ],
  };
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
    try {
      const { env } = await getCloudflareContext();
      if (env?.KV) {
        const cached = await env.KV.get(CACHE_KEY, "json");
        if (cached) {
          return NextResponse.json(cached, {
            headers: {
              "Cache-Control": "public, max-age=60, s-maxage=300",
              "X-Cache": "HIT-KV",
            },
          });
        }
      }
    } catch {
      // Fallback
    }

    const details = await getEpisodeWatchDetails(slug, epNum).catch(() => null);

    if (!details) {
      const fallbackDetails = getFallbackWatchDetails(slug, epNum);
      return NextResponse.json({
        details: fallbackDetails,
        episodes: LATEST_EPISODES,
        recommendations: TRENDING_ANIME.slice(0, 4),
      }, { status: 200 });
    }

    const [episodes, trending] = await Promise.all([
      getEpisodesByAnimeSlug(slug).catch(() => LATEST_EPISODES),
      getTrendingAnime(5).catch(() => TRENDING_ANIME.slice(0, 5)),
    ]);

    const recommendations = trending.filter((item) => item.slug !== details.anime.slug).slice(0, 4);

    const data = { details, episodes, recommendations };

    try {
      const { env } = await getCloudflareContext();
      if (env?.KV) {
        await env.KV.put(CACHE_KEY, JSON.stringify(data), { expirationTtl: CACHE_TTL });
      }
    } catch {
      // Fallback
    }

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=300",
        "X-Cache": "MISS-KV",
      },
    });
  } catch {
    const fallbackDetails = getFallbackWatchDetails(slug, epNum);
    return NextResponse.json({
      details: fallbackDetails,
      episodes: LATEST_EPISODES,
      recommendations: TRENDING_ANIME.slice(0, 4),
    }, { status: 200 });
  }
}
