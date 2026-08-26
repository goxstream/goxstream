import { NextResponse } from "next/server";
import { getBrowseAnime } from "@/lib/db/queries/anime";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const genre = searchParams.get("genre") || undefined;
  const query = searchParams.get("query") || undefined;
  const status = searchParams.get("status") || undefined;
  const type = searchParams.get("type") || undefined;
  const limit = parseInt(searchParams.get("limit") || "40", 10);

  const cacheKeyRaw = `kv_browse_${genre || "all"}_${query || "all"}_${status || "all"}_${type || "all"}_${limit}`;
  const CACHE_KEY = encodeURIComponent(cacheKeyRaw);
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

    const items = await getBrowseAnime({ genre, query, status, type, limit }).catch(() => []);
    const data = { animeList: items };

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
    return NextResponse.json({ animeList: [] }, { status: 500 });
  }
}
