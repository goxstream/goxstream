import { NextResponse } from "next/server";
import { getLatestEpisodes } from "@/lib/db/queries/episodes";
import { getTrendingAnime } from "@/lib/db/queries/anime";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export const runtime = "edge";

export async function GET() {
  const CACHE_KEY = "kv_schedule_anime_v1";
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

    const [latestEpisodes, trendingAnime] = await Promise.all([
      getLatestEpisodes(10).catch(() => []),
      getTrendingAnime(10).catch(() => []),
    ]);

    const data = { latestEpisodes, trendingAnime };

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
    return NextResponse.json({ latestEpisodes: [], trendingAnime: [] }, { status: 500 });
  }
}
