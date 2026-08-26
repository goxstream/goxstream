import type {
  AnimeItem,
  EpisodeItem,
  EpisodeWatchDetails,
  PlatformStat,
  StreamSource,
} from "@/types/anime";

// High-fidelity SVG card placeholders with custom visual themes
export const FEATURED_ANIME: AnimeItem = {
  id: "featured-1",
  slug: "solo-leveling-season-2",
  title: "Solo Leveling: Arise from the Shadows",
  japaneseTitle: "俺だけレベルアップな件",
  synopsis:
    "When a gate connecting our world to a dimension of monsters appeared, Sung Jin-woo gained the ability to level up infinitely. Now facing monarch-level threats, humanity's weakest hunter becomes the Shadow Monarch.",
  coverImage: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)",
  bannerImage: "linear-gradient(135deg, #020617 0%, #0f172a 40%, #1e1b4b 100%)",
  rating: 4.9,
  episodesCount: 24,
  latestEpisode: 14,
  status: "Ongoing",
  type: "TV",
  season: "Winter",
  year: 2026,
  genres: ["Action", "Fantasy", "Supernatural", "Adventure"],
  studio: "A-1 Pictures",
  isTrending: true,
  isFeatured: true,
  subOrDub: "SUB & DUB",
};

export const TRENDING_ANIME: AnimeItem[] = [
  {
    id: "anime-1",
    slug: "demon-slayer-infinity-castle",
    title: "Demon Slayer: Infinity Castle Arc",
    japaneseTitle: "鬼滅の刃 無限城編",
    synopsis:
      "The Demon Slayer Corps plunges into the Infinity Castle to confront Muzan Kibutsuji and the remaining Upper Ranks in the final battle.",
    coverImage: "linear-gradient(135deg, #18181b 0%, #3f3f46 50%, #15803d 100%)",
    rating: 4.95,
    episodesCount: 12,
    latestEpisode: 8,
    status: "Ongoing",
    type: "TV",
    season: "Summer",
    year: 2026,
    genres: ["Action", "Demons", "Historical", "Shounen"],
    studio: "ufotable",
    isTrending: true,
    subOrDub: "SUB & DUB",
  },
  {
    id: "anime-2",
    slug: "jujutsu-kaisen-culling-game",
    title: "Jujutsu Kaisen: Culling Game",
    japaneseTitle: "呪術廻戦 死滅回游",
    synopsis:
      "Sorcerers and ancient resurrected curse users collide in a battle royale orchestrated by Kenjaku across Japan.",
    coverImage: "linear-gradient(135deg, #09090b 0%, #1c1917 50%, #991b1b 100%)",
    rating: 4.88,
    episodesCount: 24,
    latestEpisode: 18,
    status: "Ongoing",
    type: "TV",
    season: "Winter",
    year: 2026,
    genres: ["Action", "Supernatural", "Dark Fantasy"],
    studio: "MAPPA",
    isTrending: true,
    subOrDub: "SUB & DUB",
  },
  {
    id: "anime-3",
    slug: "chainsaw-man-reze-arc",
    title: "Chainsaw Man: Reze Arc",
    japaneseTitle: "チェンソーマン レゼ編",
    synopsis:
      "Denji encounters Reze, a mystery girl working at a coffee shop, unaware of her explosive true identity.",
    coverImage: "linear-gradient(135deg, #18181b 0%, #713f12 50%, #ea580c 100%)",
    rating: 4.91,
    episodesCount: 1,
    latestEpisode: 1,
    status: "Completed",
    type: "Movie",
    season: "Spring",
    year: 2026,
    genres: ["Action", "Dark Fantasy", "Horror"],
    studio: "MAPPA",
    isTrending: true,
    subOrDub: "SUB & DUB",
  },
  {
    id: "anime-4",
    slug: "frieren-beyond-journeys-end-s2",
    title: "Frieren: Beyond Journey's End S2",
    japaneseTitle: "葬送のフリーレン",
    synopsis:
      "Elven mage Frieren continues her journey north to Ende, learning what it truly means to connect with humans along the way.",
    coverImage: "linear-gradient(135deg, #064e3b 0%, #047857 50%, #0d9488 100%)",
    rating: 4.97,
    episodesCount: 24,
    latestEpisode: 6,
    status: "Ongoing",
    type: "TV",
    season: "Winter",
    year: 2026,
    genres: ["Adventure", "Drama", "Fantasy"],
    studio: "Madhouse",
    isTrending: true,
    subOrDub: "SUB",
  },
  {
    id: "anime-5",
    slug: "spy-x-family-season-3",
    title: "SPY x FAMILY Season 3",
    japaneseTitle: "スパイファミリー",
    synopsis:
      "Spy Twilight, assassin Yor, and telepathic Anya balance secret covert missions with suburban family life.",
    coverImage: "linear-gradient(135deg, #1e293b 0%, #334155 50%, #0284c7 100%)",
    rating: 4.82,
    episodesCount: 12,
    latestEpisode: 10,
    status: "Ongoing",
    type: "TV",
    season: "Autumn",
    year: 2026,
    genres: ["Comedy", "Action", "Slice of Life"],
    studio: "CloverWorks x WIT",
    isTrending: true,
    subOrDub: "SUB & DUB",
  },
];

export const EXTRA_ANIME: AnimeItem[] = [
  {
    id: "anime-6",
    slug: "bleach-thousand-year-blood-war-p3",
    title: "Bleach: Thousand-Year Blood War - The Conflict",
    japaneseTitle: "BLEACH 千年血戦篇-相剋譚-",
    synopsis:
      "The war between Soul Reapers and Quincies escalates as Ichigo Kurosaki ascends to the Royal Palace to halt Yhwach's ascension.",
    coverImage: "linear-gradient(135deg, #1e1b4b 0%, #4338ca 50%, #6366f1 100%)",
    rating: 4.89,
    episodesCount: 13,
    latestEpisode: 13,
    status: "Completed",
    type: "TV",
    season: "Autumn",
    year: 2025,
    genres: ["Action", "Supernatural", "Shounen"],
    studio: "Studio Pierrot",
    subOrDub: "SUB & DUB",
  },
  {
    id: "anime-7",
    slug: "attack-on-titan-the-last-attack",
    title: "Attack on Titan: The Last Attack",
    japaneseTitle: "進撃の巨人 THE LAST ATTACK",
    synopsis:
      "The final feature-length theatrical experience chronicling the Rumbling and humanity's desperate last stand against Eren Yeager.",
    coverImage: "linear-gradient(135deg, #451a03 0%, #78350f 50%, #b45309 100%)",
    rating: 4.94,
    episodesCount: 1,
    latestEpisode: 1,
    status: "Completed",
    type: "Movie",
    season: "Autumn",
    year: 2025,
    genres: ["Action", "Drama", "Dark Fantasy"],
    studio: "MAPPA",
    subOrDub: "SUB & DUB",
  },
  {
    id: "anime-8",
    slug: "oshi-no-ko-season-3",
    title: "Oshi no Ko Season 3",
    japaneseTitle: "推しの子",
    synopsis:
      "Aqua and Ruby navigate the dark underbelly of the entertainment industry while seeking the truth behind their mother's tragic past.",
    coverImage: "linear-gradient(135deg, #831843 0%, #be185d 50%, #db2777 100%)",
    rating: 4.86,
    episodesCount: 12,
    latestEpisode: 4,
    status: "Ongoing",
    type: "TV",
    season: "Winter",
    year: 2026,
    genres: ["Drama", "Supernatural", "Mystery"],
    studio: "Doga Kobo",
    subOrDub: "SUB",
  },
  {
    id: "anime-9",
    slug: "vinland-saga-season-3",
    title: "Vinland Saga Season 3",
    japaneseTitle: "ヴィンランド・サガ",
    synopsis:
      "Thorfinn embarks on his ambitious expedition to Greece to finance the ultimate journey west towards the peaceful land of Vinland.",
    coverImage: "linear-gradient(135deg, #14532d 0%, #15803d 50%, #22c55e 100%)",
    rating: 4.93,
    episodesCount: 24,
    status: "Upcoming",
    type: "TV",
    season: "Spring",
    year: 2026,
    genres: ["Action", "Adventure", "Drama", "Historical"],
    studio: "MAPPA",
    subOrDub: "SUB & DUB",
  },
  {
    id: "anime-10",
    slug: "cyberpunk-edgerunners-overdrive",
    title: "Cyberpunk: Edgerunners Overdrive",
    japaneseTitle: "サイバーパンク エッジランナーズ",
    synopsis:
      "A new standalone story set in Night City following a street kid attempting to survive in a technology and body modification obsessed city.",
    coverImage: "linear-gradient(135deg, #701a75 0%, #a21caf 50%, #d946ef 100%)",
    rating: 4.87,
    episodesCount: 10,
    status: "Upcoming",
    type: "TV",
    season: "Summer",
    year: 2026,
    genres: ["Sci-Fi", "Action", "Cyberpunk"],
    studio: "Studio Trigger",
    subOrDub: "SUB & DUB",
  },
  {
    id: "anime-11",
    slug: "kaguya-sama-first-kiss-never-ends",
    title: "Kaguya-sama: Love Is War - First Kiss",
    japaneseTitle: "かぐや様は告らせたい",
    synopsis:
      "Following their iconic Christmas kiss, Kaguya Shinomiya and Miyuki Shirogane navigate their evolving feelings without their usual prideful facades.",
    coverImage: "linear-gradient(135deg, #881337 0%, #e11d48 50%, #f43f5e 100%)",
    rating: 4.9,
    episodesCount: 1,
    latestEpisode: 1,
    status: "Completed",
    type: "Movie",
    season: "Winter",
    year: 2024,
    genres: ["Romance", "Comedy", "Slice of Life"],
    studio: "A-1 Pictures",
    subOrDub: "SUB & DUB",
  },
  {
    id: "anime-12",
    slug: "mob-psycho-100-iii",
    title: "Mob Psycho 100 III",
    japaneseTitle: "モブサイコ100 III",
    synopsis:
      "Shigeo Kageyama (Mob) struggles to choose his career path while dealing with supernatural divine trees and telepathic cults.",
    coverImage: "linear-gradient(135deg, #312e81 0%, #4338ca 50%, #818cf8 100%)",
    rating: 4.92,
    episodesCount: 12,
    latestEpisode: 12,
    status: "Completed",
    type: "TV",
    season: "Autumn",
    year: 2023,
    genres: ["Action", "Comedy", "Supernatural"],
    studio: "BONES",
    subOrDub: "SUB & DUB",
  },
  {
    id: "anime-13",
    slug: "your-name-kimi-no-na-wa",
    title: "Your Name.",
    japaneseTitle: "君の名は。",
    synopsis:
      "Two strangers find themselves mysteriously connected through body swapping across space and time, racing to save each other from catastrophe.",
    coverImage: "linear-gradient(135deg, #0c4a6e 0%, #0284c7 50%, #38bdf8 100%)",
    rating: 4.96,
    episodesCount: 1,
    latestEpisode: 1,
    status: "Completed",
    type: "Movie",
    season: "Summer",
    year: 2021,
    genres: ["Romance", "Drama", "Supernatural"],
    studio: "CoMix Wave Films",
    subOrDub: "SUB & DUB",
  },
  {
    id: "anime-14",
    slug: "one-punch-man-season-3",
    title: "One Punch Man Season 3",
    japaneseTitle: "ワンパンマン",
    synopsis:
      "Saitama and the Hero Association launch a full-scale assault on the Monster Association headquarters to rescue Waganma.",
    coverImage: "linear-gradient(135deg, #7f1d1d 0%, #dc2626 50%, #f87171 100%)",
    rating: 4.81,
    episodesCount: 12,
    latestEpisode: 5,
    status: "Ongoing",
    type: "TV",
    season: "Spring",
    year: 2026,
    genres: ["Action", "Comedy", "Sci-Fi"],
    studio: "J.C.Staff",
    subOrDub: "SUB & DUB",
  },
  {
    id: "anime-15",
    slug: "violet-evergarden-special-ova",
    title: "Violet Evergarden: Special Memory",
    japaneseTitle: "ヴァイオレット・エヴァーガーデン",
    synopsis:
      "Auto Memory Doll Violet Evergarden writes a heartfelt letter for an opera singer struggling to compose her final aria.",
    coverImage: "linear-gradient(135deg, #134e4a 0%, #0d9488 50%, #2dd4bf 100%)",
    rating: 4.88,
    episodesCount: 1,
    latestEpisode: 1,
    status: "Completed",
    type: "OVA",
    season: "Summer",
    year: 2023,
    genres: ["Drama", "Slice of Life"],
    studio: "Kyoto Animation",
    subOrDub: "SUB",
  },
  {
    id: "anime-16",
    slug: "re-zero-starting-life-in-another-world-s3",
    title: "Re:ZERO - Starting Life in Another World S3",
    japaneseTitle: "Re:ゼロから始める異世界生活",
    synopsis:
      "Subaru Natsuki receives an invitation to the Water Gate City of Priestella, where the Sin Archbishops of the Witch Cult launch a surprise raid.",
    coverImage: "linear-gradient(135deg, #581c87 0%, #7e22ce 50%, #a855f7 100%)",
    rating: 4.91,
    episodesCount: 16,
    latestEpisode: 16,
    status: "Completed",
    type: "TV",
    season: "Autumn",
    year: 2025,
    genres: ["Fantasy", "Drama", "Dark Fantasy"],
    studio: "White Fox",
    subOrDub: "SUB & DUB",
  },
];

export const ALL_ANIME: AnimeItem[] = [
  FEATURED_ANIME,
  ...TRENDING_ANIME,
  ...EXTRA_ANIME,
];

export const LATEST_EPISODES: EpisodeItem[] = [
  {
    id: "ep-101",
    animeId: "featured-1",
    animeSlug: "solo-leveling-season-2",
    animeTitle: "Solo Leveling: Arise from the Shadows",
    episodeNumber: 14,
    episodeTitle: "The Sovereign's Command",
    thumbnail: "linear-gradient(135deg, #0f172a 0%, #312e81 100%)",
    duration: "24m",
    releasedAt: "12 minutes ago",
    isSub: true,
    isDub: true,
  },
  {
    id: "ep-102",
    animeId: "anime-1",
    animeSlug: "demon-slayer-infinity-castle",
    animeTitle: "Demon Slayer: Infinity Castle Arc",
    episodeNumber: 8,
    episodeTitle: "Upper Rank Three: Akaza",
    thumbnail: "linear-gradient(135deg, #18181b 0%, #15803d 100%)",
    duration: "26m",
    releasedAt: "45 minutes ago",
    isSub: true,
    isDub: false,
  },
  {
    id: "ep-103",
    animeId: "anime-4",
    animeSlug: "frieren-beyond-journeys-end-s2",
    animeTitle: "Frieren: Beyond Journey's End S2",
    episodeNumber: 6,
    episodeTitle: "The Northern Frontier",
    thumbnail: "linear-gradient(135deg, #064e3b 0%, #0d9488 100%)",
    duration: "23m",
    releasedAt: "2 hours ago",
    isSub: true,
    isDub: true,
  },
  {
    id: "ep-104",
    animeId: "anime-2",
    animeSlug: "jujutsu-kaisen-culling-game",
    animeTitle: "Jujutsu Kaisen: Culling Game",
    episodeNumber: 18,
    episodeTitle: "Tokyo No. 1 Colony",
    thumbnail: "linear-gradient(135deg, #1c1917 0%, #991b1b 100%)",
    duration: "24m",
    releasedAt: "3 hours ago",
    isSub: true,
    isDub: true,
  },
  {
    id: "ep-105",
    animeId: "anime-5",
    animeSlug: "spy-x-family-season-3",
    animeTitle: "SPY x FAMILY Season 3",
    episodeNumber: 10,
    episodeTitle: "Anya's Secret Operation",
    thumbnail: "linear-gradient(135deg, #1e293b 0%, #0284c7 100%)",
    duration: "22m",
    releasedAt: "5 hours ago",
    isSub: true,
    isDub: true,
  },
];

export const GENRES_LIST = [
  "All",
  "Action",
  "Adventure",
  "Fantasy",
  "Sci-Fi",
  "Romance",
  "Comedy",
  "Supernatural",
  "Dark Fantasy",
  "Drama",
  "Slice of Life",
  "Historical",
  "Shounen",
  "Horror",
  "Mystery",
];

export const ANIME_STATUSES = ["All", "Ongoing", "Completed", "Upcoming"];
export const ANIME_FORMATS = ["All", "TV", "Movie", "OVA"];
export const ANIME_AUDIO_OPTIONS = ["All", "SUB", "DUB", "SUB & DUB"];
export const ANIME_SEASONS = ["All", "Winter", "Spring", "Summer", "Autumn"];
export const ANIME_YEARS = ["All", "2026", "2025", "2024", "2023", "2022", "2021"];

export const SORT_OPTIONS = [
  { label: "Highest Rated", value: "rating-desc" },
  { label: "Title (A-Z)", value: "title-asc" },
  { label: "Title (Z-A)", value: "title-desc" },
  { label: "Newest Year", value: "year-desc" },
  { label: "Oldest Year", value: "year-asc" },
];

export interface FilterOptions {
  query?: string;
  genre?: string;
  status?: string;
  format?: string;
  audio?: string;
  season?: string;
  year?: string;
  sort?: string;
}

export function filterAnime(animeList: AnimeItem[], options: FilterOptions = {}): AnimeItem[] {
  let filtered = [...animeList];

  const { query, genre, status, format, audio, season, year, sort } = options;

  // Search Query
  if (query && query.trim() !== "") {
    const q = query.toLowerCase().trim();
    filtered = filtered.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        (a.japaneseTitle && a.japaneseTitle.toLowerCase().includes(q)) ||
        a.synopsis.toLowerCase().includes(q) ||
        a.studio.toLowerCase().includes(q)
    );
  }

  // Genre Filter
  if (genre && genre !== "All") {
    filtered = filtered.filter((a) => a.genres.includes(genre));
  }

  // Status Filter
  if (status && status !== "All") {
    filtered = filtered.filter((a) => a.status === status);
  }

  // Format / Type Filter
  if (format && format !== "All") {
    filtered = filtered.filter((a) => a.type === format);
  }

  // Audio / SubDub Filter
  if (audio && audio !== "All") {
    filtered = filtered.filter((a) => a.subOrDub === audio || a.subOrDub === "SUB & DUB");
  }

  // Season Filter
  if (season && season !== "All") {
    filtered = filtered.filter((a) => a.season === season);
  }

  // Year Filter
  if (year && year !== "All") {
    filtered = filtered.filter((a) => a.year === parseInt(year, 10));
  }

  // Sorting
  const sortType = sort || "rating-desc";
  filtered.sort((a, b) => {
    if (sortType === "rating-desc") return b.rating - a.rating;
    if (sortType === "title-asc") return a.title.localeCompare(b.title);
    if (sortType === "title-desc") return b.title.localeCompare(a.title);
    if (sortType === "year-desc") return b.year - a.year;
    if (sortType === "year-asc") return a.year - b.year;
    return 0;
  });

  return filtered;
}

export const PLATFORM_STATS: PlatformStat[] = [
  {
    label: "Simulcast Speed",
    value: "< 5 Min",
    description: "Available minutes after official Japanese broadcast",
  },
  {
    label: "Video Fidelity",
    value: "1080p / 4K",
    description: "High bitrate, 60fps unlocked streaming",
  },
  {
    label: "Ad-Free",
    value: "100%",
    description: "Zero popups, video ads, or forced interruptions",
  },
  {
    label: "Active Anime",
    value: "10,000+",
    description: "Full library of subbed & dubbed series and films",
  },
];

export function getAnimeBySlug(slug: string): AnimeItem | undefined {
  return ALL_ANIME.find((a) => a.slug === slug || a.id === slug);
}

export function getEpisodesForAnime(anime: AnimeItem): EpisodeItem[] {
  const maxEp = anime.latestEpisode || anime.episodesCount || 12;
  const isSubOnly = anime.subOrDub === "SUB";

  const epTitles = [
    "The Beginning of the Journey",
    "Unseen Powers Awakening",
    "Clash of Ideals",
    "Shadows in the Dark",
    "Boundaries Tested",
    "The Hidden Truth",
    "Echoes of the Past",
    "Fierce Determination",
    "Breakthrough Moment",
    "Rising Storm",
    "Desperate Counterattack",
    "The Ultimate Showdown",
    "New Horizons",
    "The Sovereign's Command",
    "Unshakable Will",
    "Crossroads of Fate",
    "The Fallen Champion",
    "Silent Resolve",
    "Awakening Spirit",
    "Final Reckoning",
    "Beyond the Horizon",
    "The Last Stand",
    "Legacy of Hope",
    "Endless Tomorrow",
  ];

  const episodes: EpisodeItem[] = [];
  for (let i = 1; i <= maxEp; i++) {
    const titleIndex = (i - 1) % epTitles.length;
    episodes.push({
      id: `${anime.id}-ep-${i}`,
      animeId: anime.id,
      animeSlug: anime.slug,
      animeTitle: anime.title,
      episodeNumber: i,
      episodeTitle: `Episode ${i}: ${epTitles[titleIndex]}`,
      thumbnail: anime.coverImage,
      duration: anime.type === "Movie" ? "1h 55m" : "24m",
      releasedAt: i === maxEp ? "Latest Release" : `${maxEp - i + 1} days ago`,
      isSub: true,
      isDub: !isSubOnly,
    });
  }
  return episodes.reverse();
}

export function getRecommendedAnime(currentSlug: string, count = 4): AnimeItem[] {
  const current = getAnimeBySlug(currentSlug);
  if (!current) return ALL_ANIME.slice(0, count);

  return ALL_ANIME.filter((a) => a.slug !== currentSlug)
    .sort((a, b) => {
      const aMatches = a.genres.filter((g) => current.genres.includes(g)).length;
      const bMatches = b.genres.filter((g) => current.genres.includes(g)).length;
      return bMatches - aMatches;
    })
    .slice(0, count);
}

export function getEpisodeWatchDetails(
  animeSlug: string,
  epNum: number
): EpisodeWatchDetails | null {
  const anime = getAnimeBySlug(animeSlug);
  if (!anime) return null;

  const episodes = getEpisodesForAnime(anime);
  // Note: getEpisodesForAnime returns array in descending order (highest ep first)
  const episode = episodes.find((e) => e.episodeNumber === epNum);
  if (!episode) return null;

  const prevEp = episodes.find((e) => e.episodeNumber === epNum - 1);
  const nextEp = episodes.find((e) => e.episodeNumber === epNum + 1);

  // Synchronized Stream Sources (Default Primary R2/S3 HLS Master + Mirror 1080p, 720p, 480p, 360p)
  const sources: StreamSource[] = [
    {
      id: "default-r2-primary",
      serverName: "Default (Primary R2/S3)",
      quality: "Auto (1080p Master)",
      url: "https://files.vidstack.io/sprite-fight/hls/stream.m3u8",
      type: "hls",
      isPrimary: true,
      qualityUrls: {
        url1080p: "https://files.vidstack.io/sprite-fight/hls/stream.m3u8",
        url720p: "https://files.vidstack.io/sprite-fight/hls/stream.m3u8",
        url480p: "https://files.vidstack.io/sprite-fight/hls/stream.m3u8",
        url360p: "https://files.vidstack.io/sprite-fight/hls/stream.m3u8",
      },
    },
    {
      id: "mirror-1080p",
      serverName: "Mirror 1080p",
      quality: "1080p Full HD",
      url: "https://files.vidstack.io/sprite-fight/720p.mp4",
      type: "mp4",
      qualityUrls: {
        url1080p: "https://files.vidstack.io/sprite-fight/720p.mp4",
      },
    },
    {
      id: "mirror-720p",
      serverName: "Mirror 720p",
      quality: "720p HD",
      url: "https://files.vidstack.io/sprite-fight/720p.mp4",
      type: "mp4",
      qualityUrls: {
        url720p: "https://files.vidstack.io/sprite-fight/720p.mp4",
      },
    },
    {
      id: "mirror-480p",
      serverName: "Mirror 480p",
      quality: "480p SD",
      url: "https://files.vidstack.io/sprite-fight/720p.mp4",
      type: "mp4",
      qualityUrls: {
        url480p: "https://files.vidstack.io/sprite-fight/720p.mp4",
      },
    },
    {
      id: "mirror-360p",
      serverName: "Mirror 360p",
      quality: "360p Mobile",
      url: "https://files.vidstack.io/sprite-fight/720p.mp4",
      type: "mp4",
      qualityUrls: {
        url360p: "https://files.vidstack.io/sprite-fight/720p.mp4",
      },
    },
  ];

  return {
    anime,
    episode,
    prevEpisode: prevEp,
    nextEpisode: nextEp,
    sources,
  };
}


