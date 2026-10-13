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
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
}

function buildEnvKey(env: AuthEnv): string {
  return `${env.BETTER_AUTH_SECRET}|${env.BETTER_AUTH_URL}`;
}

export function getAuth(env: AuthEnv) {
  const key = buildEnvKey(env);
  if (cachedAuth && cachedEnvKey === key) {
    return cachedAuth;
  }

  const db = getDb(env.DB);

  const auth = betterAuth({
    database: drizzleAdapter(db, {
      provider: "sqlite",
      schema,
    }),
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
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
