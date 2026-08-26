import { NextResponse } from "next/server";
import { getEpisodeWatchDetails, getEpisodesByAnimeSlug } from "@/lib/db/queries/episodes";
import { getTrendingAnime } from "@/lib/db/queries/anime";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export const runtime = "edge";

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
    } catch {}

    const details = await getEpisodeWatchDetails(slug, epNum).catch(() => null);

    if (!details) {
      return NextResponse.json({ details: null, episodes: [], recommendations: [] }, { status: 404 });
    }

    const [episodes, trending] = await Promise.all([
      getEpisodesByAnimeSlug(slug).catch(() => []),
      getTrendingAnime(5).catch(() => []),
    ]);

    const recommendations = trending.filter((item) => item.slug !== details.anime.slug).slice(0, 4);

    const data = { details, episodes, recommendations };

    try {
      const { env } = await getCloudflareContext();
      if (env?.KV) {
        await env.KV.put(CACHE_KEY, JSON.stringify(data), { expirationTtl: CACHE_TTL });
      }
    } catch {}

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=300",
        "X-Cache": "MISS-KV",
      },
    });
  } catch {
    return NextResponse.json({ details: null, episodes: [], recommendations: [] }, { status: 500 });
  }
}
