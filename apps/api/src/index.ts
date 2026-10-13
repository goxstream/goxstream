import { OpenAPIHono } from "@hono/zod-openapi";
import { apiReference } from "@scalar/hono-api-reference";
import { cors } from "hono/cors";
import type { CloudflareEnv } from "@goxstream/cloudflare";
import { getAuth } from "@goxstream/auth";
import { healthApp } from "./routes/health";
import { protectedApp } from "./routes/protected";

const app = new OpenAPIHono<{ Bindings: CloudflareEnv }>();

// ── Global Middlewares ──────────────────────────────────────────────────
app.use(
  "*",
  cors({
    origin: (origin) => origin || "*",
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
  servers: [
    { url: "http://localhost:8787", description: "Local Development" },
    { url: "https://api.goxstream.com", description: "Production" },
  ],
});

// Register Bearer Security Scheme for Swagger / Scalar "Try It" console
app.openAPIRegistry.registerComponent("securitySchemes", "Bearer", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT / API-Key",
  description: "Provide a Better Auth session token or Bearer API key.",
});

export default app;
