/**
 * AniList GraphQL API Fetcher (with Pagination & Rate-Limit Handling)
 */

export interface AniListMedia {
  id: number;
  title: {
    romaji: string;
    english: string | null;
    native: string | null;
    userPreferred: string;
  };
  description: string | null;
  coverImage: {
    extraLarge: string | null;
    large: string | null;
  };
  bannerImage: string | null;
  format: string | null;
  status: string | null;
  season: string | null;
  seasonYear: number | null;
  episodes: number | null;
  duration: number | null;
  averageScore: number | null;
  trending: number | null;
  genres: string[];
  studios: {
    nodes: Array<{
      id: number;
      name: string;
    }>;
  };
}

const ANILIST_GRAPHQL_URL = "https://graphql.anilist.co";

const POPULAR_ANIME_QUERY = `
query ($page: Int, $perPage: Int) {
  Page(page: $page, perPage: $perPage) {
    pageInfo {
      hasNextPage
      total
    }
    media(type: ANIME, sort: [POPULARITY_DESC]) {
      id
      title {
        romaji
        english
        native
        userPreferred
      }
      description(asHtml: false)
      coverImage {
        extraLarge
        large
      }
      bannerImage
      format
      status
      season
      seasonYear
      episodes
      duration
      averageScore
      trending
      genres
      studios {
        nodes {
          id
          name
        }
      }
    }
  }
}
`;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchPopularAnime(count = 50): Promise<AniListMedia[]> {
  const perPage = 50;
  const pagesNeeded = Math.ceil(count / perPage);
  const allMedia: AniListMedia[] = [];

  console.log(`[Scraper] Starting fetch for ${count} anime across ${pagesNeeded} page(s)...`);

  for (let page = 1; page <= pagesNeeded; page++) {
    const fetchLimit = Math.min(perPage, count - allMedia.length);
    if (fetchLimit <= 0) break;

    console.log(`[Scraper] Fetching page ${page}/${pagesNeeded} (${fetchLimit} items)...`);

    const response = await fetch(ANILIST_GRAPHQL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: POPULAR_ANIME_QUERY,
        variables: {
          page,
          perPage: fetchLimit,
        },
      }),
    });

    if (!response.ok) {
      console.warn(`[Scraper] Warning: Page ${page} failed with status ${response.status}`);
      break;
    }

    const json = (await response.json()) as {
      data?: {
        Page?: {
          pageInfo?: { hasNextPage: boolean };
          media?: AniListMedia[];
        };
      };
    };

    const items = json.data?.Page?.media || [];
    allMedia.push(...items);

    const hasNext = json.data?.Page?.pageInfo?.hasNextPage;
    if (!hasNext) break;

    // Polite delay (350ms) to stay within public rate limits (max 90 req/min)
    if (page < pagesNeeded) {
      await sleep(350);
    }
  }

  console.log(`[Scraper] Total anime successfully fetched: ${allMedia.length}`);
  return allMedia;
}
