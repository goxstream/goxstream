import { NextResponse } from "next/server";
import { getLatestEpisodes } from "@/lib/db/queries/episodes";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { LATEST_EPISODES as FALLBACK_EPISODES } from "@/lib/mock-anime";

export async function GET() {
  const CACHE_KEY = "kv_latest_episodes_v1";
  const CACHE_TTL = 300; // 5 minutes

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

    const latestEpisodes = await getLatestEpisodes(6).catch(() => FALLBACK_EPISODES);
    const data = {
      latestEpisodes: latestEpisodes.length > 0 ? latestEpisodes : FALLBACK_EPISODES,
    };

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
    return NextResponse.json({ latestEpisodes: FALLBACK_EPISODES }, { status: 200 });
  }
}
