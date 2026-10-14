export const SITE_CONFIG = {
  name: "GoxStream",
  description: "Modern & ad-free online anime streaming platform",
  url: "https://goxstream.com",
} as const;

export interface TimeZoneOption {
  id: string;
  label: string;
  shortLabel: string;
  offset: string;
  iana: string;
}

export const TIMEZONE_CONFIG = {
  defaultTimezone: "Asia/Jakarta",
  defaultLabel: "WIB (UTC+7)",
  defaultShortLabel: "WIB",
  supportedTimezones: [
    {
      id: "WIB",
      label: "Western Indonesia Time (WIB)",
      shortLabel: "WIB",
      offset: "+07:00",
      iana: "Asia/Jakarta",
    },
    {
      id: "WITA",
      label: "Central Indonesia Time (WITA)",
      shortLabel: "WITA",
      offset: "+08:00",
      iana: "Asia/Makassar",
    },
    {
      id: "WIT",
      label: "Eastern Indonesia Time (WIT)",
      shortLabel: "WIT",
      offset: "+09:00",
      iana: "Asia/Jayapura",
    },
    {
      id: "JST",
      label: "Japan Standard Time (JST)",
      shortLabel: "JST",
      offset: "+09:00",
      iana: "Asia/Tokyo",
    },
    {
      id: "UTC",
      label: "Coordinated Universal Time (UTC)",
      shortLabel: "UTC",
      offset: "+00:00",
      iana: "UTC",
    },
  ] as TimeZoneOption[],
} as const;

export const DAYS_OF_WEEK_MAP = [
  { id: "monday", label: "Monday", shortLabel: "Mon" },
  { id: "tuesday", label: "Tuesday", shortLabel: "Tue" },
  { id: "wednesday", label: "Wednesday", shortLabel: "Wed" },
  { id: "thursday", label: "Thursday", shortLabel: "Thu" },
  { id: "friday", label: "Friday", shortLabel: "Fri" },
  { id: "saturday", label: "Saturday", shortLabel: "Sat" },
  { id: "sunday", label: "Sunday", shortLabel: "Sun" },
] as const;

export const ANIME_GENRES = [
  "All",
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Fantasy",
  "Isekai",
  "Mecha",
  "Mystery",
  "Psychological",
  "Romance",
  "Sci-Fi",
  "Slice of Life",
  "Sports",
  "Supernatural",
  "Thriller",
];

export const ANIME_STATUSES = ["All", "Ongoing", "Completed", "Upcoming"];
export const ANIME_FORMATS = ["All", "TV", "Movie", "OVA", "ONA", "Special"];
export const ANIME_AUDIO_OPTIONS = ["All", "SUB", "DUB"];
export const ANIME_SEASONS = ["All", "Winter", "Spring", "Summer", "Fall"];
export const ANIME_YEARS = ["All", "2026", "2025", "2024", "2023", "2022"];
export const SORT_OPTIONS = [
  { label: "Most Popular", value: "popular" },
  { label: "Highest Rated", value: "rating" },
  { label: "Recently Added", value: "newest" },
];
