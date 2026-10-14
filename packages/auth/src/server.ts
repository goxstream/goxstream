import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getDb, schema } from "@goxstream/db";

/**
 * Module-level isolate singleton for the Better Auth instance.
 * Re-creating auth on every request wastes CPU and risks hitting
 * the 10ms free-plan limit.
 */
let cachedAuth: any = null;
let cachedEnvKey: string | null = null;

interface AuthEnv {
  DB: D1Database;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  COOKIE_DOMAIN?: string;
  TRUSTED_ORIGINS?: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
}

function buildEnvKey(env: AuthEnv): string {
  return `${env.BETTER_AUTH_SECRET}|${env.BETTER_AUTH_URL}|${env.COOKIE_DOMAIN ?? ""}|${env.TRUSTED_ORIGINS ?? ""}`;
}

export function getAuth(env: AuthEnv) {
  const key = buildEnvKey(env);
  if (cachedAuth && cachedEnvKey === key) {
    return cachedAuth;
  }

  const db = getDb(env.DB);
  const isSecure = env.BETTER_AUTH_URL.startsWith("https://");
  const isGoxDomain = env.BETTER_AUTH_URL.includes("gox.my.id");
  const cookieDomain = env.COOKIE_DOMAIN ?? (isGoxDomain ? ".gox.my.id" : undefined);
  const enableCrossSubdomain = Boolean(cookieDomain);

  const extraOrigins = env.TRUSTED_ORIGINS
    ? env.TRUSTED_ORIGINS.split(",").map((o) => o.trim()).filter(Boolean)
    : [];

  const trustedOrigins = [
    "https://gox.my.id",
    "https://www.gox.my.id",
    "https://api.gox.my.id",
    "https://*.gox.my.id",
    "https://api.goxstream.dpdns.org",
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:8787",
    ...extraOrigins,
  ];

  const auth = betterAuth({
    database: drizzleAdapter(db, {
      provider: "sqlite",
      schema,
    }),
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    trustedOrigins,
    advanced: {
      cookiePrefix: "goxstream",
      useSecureCookies: isSecure,
      crossSubDomainCookies: {
        enabled: enableCrossSubdomain,
        ...(cookieDomain ? { domain: cookieDomain } : {}),
      },
      defaultCookieAttributes: {
        sameSite: "lax",
        secure: isSecure,
        path: "/",
      },
    },
    emailAndPassword: {
      enabled: true,
    },
    socialProviders: {
      ...(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
        ? {
            google: {
              clientId: env.GOOGLE_CLIENT_ID,
              clientSecret: env.GOOGLE_CLIENT_SECRET,
            },
          }
        : {}),
    },
  });

  cachedAuth = auth;
  cachedEnvKey = key;
  return auth;
}
