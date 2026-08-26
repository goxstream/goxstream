import { NextResponse } from "next/server";
import { getBrowseAnime } from "@/lib/db/queries/anime";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { TRENDING_ANIME as FALLBACK_SEARCH } from "@/lib/mock-anime";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") || "").trim().toLowerCase();

  const CACHE_KEY = `kv_search_${encodeURIComponent(query || "default")}`;
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
      // KV unavailable or local dev mode
    }

    const items = await getBrowseAnime({ query, limit: 12 }).catch(() => FALLBACK_SEARCH);
    const data = { results: items.length > 0 ? items : (query ? [] : FALLBACK_SEARCH) };

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
    return NextResponse.json({ results: FALLBACK_SEARCH }, { status: 200 });
  }
}
