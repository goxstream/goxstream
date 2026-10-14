import { OpenAPIHono } from "@hono/zod-openapi";
import { apiReference } from "@scalar/hono-api-reference";
import { cors } from "hono/cors";
import type { CloudflareEnv } from "@goxstream/cloudflare";
import { getAuth } from "@goxstream/auth";
import { healthApp } from "./routes/health";
import { protectedApp } from "./routes/protected";
import { animeApp } from "./routes/anime";
import { episodesApp } from "./routes/episodes";

const app = new OpenAPIHono<{ Bindings: CloudflareEnv }>();

function isAllowedOrigin(origin: string): boolean {
  if (!origin) return false;
  try {
    const url = new URL(origin);
    const host = url.hostname;
    // Allow gox.my.id and all subdomains (api.gox.my.id, www.gox.my.id, etc.)
    if (host === "gox.my.id" || host.endsWith(".gox.my.id")) return true;
    if (host === "goxstream.dpdns.org" || host.endsWith(".goxstream.dpdns.org")) return true;
    if (host === "localhost" || host === "127.0.0.1") return true;
    return false;
  } catch {
    return false;
  }
}

// ── Global Middlewares ──────────────────────────────────────────────────
app.use(
  "*",
  cors({
    origin: (origin) => {
      if (!origin) return null;
      return isAllowedOrigin(origin) ? origin : null;
    },
    allowHeaders: ["Content-Type", "Authorization", "x-api-key"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  }),
);

// ── Better Auth Handler ────────────────────────────────────────────────
// Mounts all Better Auth handlers (sign-up, sign-in, session, OAuth, sign-out)
app.on(["POST", "GET"], "/api/auth/*", (c) => {
  const auth = getAuth(c.env);
  return auth.handler(c.req.raw);
});

// ── Route Sub-Apps ─────────────────────────────────────────────────────
app.route("/", healthApp);
app.route("/v1/protected", protectedApp);
app.route("/", animeApp);
app.route("/", episodesApp);

// ── Scalar Interactive API Documentation ────────────────────────────────
app.get(
  "/reference",
  apiReference({
    theme: "purple",
    pageTitle: "GoxStream API Reference",
    spec: {
      url: "/v1/openapi.json",
    },
  }),
);

// Redirect root to /reference for developer convenience
app.get("/", (c) => c.redirect("/reference"));

// ── OpenAPI 3.1 Document Spec ──────────────────────────────────────────
app.doc("/v1/openapi.json", {
  openapi: "3.1.0",
  info: {
    title: "GoxStream API",
    version: "1.0.0",
    description: "Modular anime streaming and metadata API built with Hono on Cloudflare Workers.",
  },
});

// Register Bearer Security Scheme for Swagger / Scalar "Try It" console
app.openAPIRegistry.registerComponent("securitySchemes", "Bearer", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT / API-Key",
  description: "Provide a Better Auth session token or Bearer API key.",
});

export default app;
