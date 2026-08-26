import { NextResponse } from "next/server";
import { getFeaturedAnime } from "@/lib/db/queries/anime";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { FEATURED_ANIME as FALLBACK_FEATURED } from "@/lib/mock-anime";

export async function GET() {
  const CACHE_KEY = "kv_featured_anime_v1";
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

    const featuredAnime = await getFeaturedAnime().catch(() => FALLBACK_FEATURED);
    const data = { featuredAnime: featuredAnime || FALLBACK_FEATURED };

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
    return NextResponse.json({ featuredAnime: FALLBACK_FEATURED }, { status: 200 });
  }
}
