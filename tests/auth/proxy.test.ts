import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { proxy } from "@/proxy";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session";

describe("Next.js 16 Edge Proxy Guard (proxy.ts)", () => {
  it("should allow guest access to public routes", () => {
    const req = new NextRequest("https://goxstream.com/anime/solo-leveling");
    const res = proxy(req);

    // Pass-through response (headers/status 200 without redirect)
    expect(res.headers.get("location")).toBeNull();
  });

  it("should redirect unauthenticated users away from /dashboard to /login?redirect=/dashboard", () => {
    const req = new NextRequest("https://goxstream.com/dashboard/anime");
    const res = proxy(req);

    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("https://goxstream.com/login?redirect=%2Fdashboard%2Fanime");
  });

  it("should redirect unauthenticated users away from /profile to /login?redirect=/profile", () => {
    const req = new NextRequest("https://goxstream.com/profile/settings");
    const res = proxy(req);

    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("https://goxstream.com/login?redirect=%2Fprofile%2Fsettings");
  });

  it("should redirect authenticated users away from /login to /", () => {
    const req = new NextRequest("https://goxstream.com/login", {
      headers: {
        cookie: `${SESSION_COOKIE_NAME}=valid_session_token_123`,
      },
    });
    const res = proxy(req);

    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("https://goxstream.com/");
  });

  it("should allow authenticated requests to pass through to private routes", () => {
    const req = new NextRequest("https://goxstream.com/dashboard", {
      headers: {
        cookie: `${SESSION_COOKIE_NAME}=valid_session_token_123`,
      },
    });
    const res = proxy(req);

    expect(res.headers.get("location")).toBeNull();
  });
});
