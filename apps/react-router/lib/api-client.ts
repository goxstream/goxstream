import {
  Configuration,
  AnimeApi,
  EpisodesApi,
  CommentsApi,
  UserApi,
  DashboardApi,
  SystemApi,
  UploadApi,
} from "@shionstream/shionstream-sdk";

/**
 * Single source of truth for the API base URL.
 * Consumed by both SDK configuration and Better Auth client.
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://api.goxstream.dpdns.org";

/**
 * Shared SDK configuration with credentials for Better Auth cookie support.
 */
const sdkConfig = new Configuration({
  basePath: API_BASE_URL,
  credentials: "include",
});

// Module-level singleton API instances (one per isolate lifetime)
export const animeApi = new AnimeApi(sdkConfig);
export const episodesApi = new EpisodesApi(sdkConfig);
export const commentsApi = new CommentsApi(sdkConfig);
export const userApi = new UserApi(sdkConfig);
export const dashboardApi = new DashboardApi(sdkConfig);
export const systemApi = new SystemApi(sdkConfig);
export const uploadApi = new UploadApi(sdkConfig);
