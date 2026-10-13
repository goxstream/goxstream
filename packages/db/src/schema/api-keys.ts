import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
import { users } from "./auth";

/**
 * API client & key tables — foundation for future self-serve dashboard.
 *
 * Flow: User creates an ApiClient → generates ApiKeys for that client.
 * Keys are hashed (SHA-256) and only the prefix is stored in plain text
 * for quick lookup before hash verification.
 */

export const apiClients = sqliteTable("api_clients", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  tier: text("tier")
    .notNull()
    .$default(() => "free"),
  isActive: integer("is_active", { mode: "boolean" })
    .notNull()
    .$default(() => true),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const apiKeys = sqliteTable(
  "api_keys",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    clientId: text("client_id")
      .notNull()
      .references(() => apiClients.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    /** SHA-256 hash of the full key — never store raw keys. */
    keyHash: text("key_hash").notNull(),
    /** Visible prefix for quick identification, e.g. "gox_live_abc1". */
    prefix: text("prefix").notNull(),
    /** JSON array of allowed scopes, e.g. ["anime:read", "anime:write"]. */
    scopes: text("scopes").$default(() => "[]"),
    rateLimitPerMin: integer("rate_limit_per_min")
      .notNull()
      .$default(() => 60),
    lastUsedAt: integer("last_used_at", { mode: "timestamp" }),
    expiresAt: integer("expires_at", { mode: "timestamp" }),
    revokedAt: integer("revoked_at", { mode: "timestamp" }),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table: any) => [
    index("idx_api_keys_key_hash").on(table.keyHash),
    index("idx_api_keys_prefix").on(table.prefix),
    index("idx_api_keys_user_id").on(table.userId),
  ],
);
