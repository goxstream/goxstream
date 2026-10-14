export const API_BASE_URL = import.meta.env.VITE_API_URL || "https://api.goxstream.dpdns.org";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  [key: string]: unknown;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Universal type-safe fetch wrapper for GoxStream API.
 * Ensures credentials (cookies) are sent for cross-subdomain Better Auth.
 */
export async function apiClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  const body = (await res.json().catch(() => null)) as Record<string, unknown> | null;

  if (!res.ok) {
    const errorMsg =
      (typeof body?.error === "string" ? body.error : null) ||
      (typeof body?.message === "string" ? body.message : null) ||
      `Request failed with status ${res.status}`;
    throw new ApiError(res.status, errorMsg, body);
  }

  // If response uses the { success: true, data: ... } envelope, return data if present
  if (body && typeof body === "object" && "success" in body) {
    if (body.success === false) {
      const errorMsg = typeof body.error === "string" ? body.error : "API returned failure";
      throw new ApiError(res.status, errorMsg, body);
    }
  }

  return body as T;
}
