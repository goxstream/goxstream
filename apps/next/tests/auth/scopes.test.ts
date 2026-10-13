import { describe, it, expect } from "vitest";
import { hasPermission, getRoleDefaultScopes, type PermissionScope } from "@/lib/auth/permissions";

describe("Granular Scope Permissions (hasPermission)", () => {
  it("should deny ALL staff scope permissions for regular 'user' role", () => {
    const regularUser = { role: "user" as const, permissions: [] };

    const scopesToTest: PermissionScope[] = [
      "anime:read",
      "anime:create",
      "anime:delete",
      "episodes:publish",
      "comments:moderate",
      "users:suspend",
      "analytics:read",
      "system:update",
    ];

    scopesToTest.forEach((scope) => {
      expect(hasPermission(regularUser, scope)).toBe(false);
    });
  });

  it("should grant ALL scope permissions to 'super_admin' role", () => {
    const superAdmin = { role: "super_admin" as const, permissions: [] };

    expect(hasPermission(superAdmin, "anime:create")).toBe(true);
    expect(hasPermission(superAdmin, "episodes:publish")).toBe(true);
    expect(hasPermission(superAdmin, "comments:delete")).toBe(true);
    expect(hasPermission(superAdmin, "system:update")).toBe(true);
  });

  it("should correctly evaluate 'content_manager' scope permissions", () => {
    const contentManager = { role: "content_manager" as const, permissions: null };

    expect(hasPermission(contentManager, "anime:create")).toBe(true);
    expect(hasPermission(contentManager, "episodes:publish")).toBe(true);
    expect(hasPermission(contentManager, "analytics:read")).toBe(true);

    // Should be denied for admin / system / moderation scopes
    expect(hasPermission(contentManager, "system:update")).toBe(false);
    expect(hasPermission(contentManager, "users:suspend")).toBe(false);
    expect(hasPermission(contentManager, "comments:moderate")).toBe(false);
  });

  it("should correctly evaluate 'moderator' scope permissions", () => {
    const moderator = { role: "moderator" as const, permissions: null };

    expect(hasPermission(moderator, "comments:moderate")).toBe(true);
    expect(hasPermission(moderator, "comments:delete")).toBe(true);
    expect(hasPermission(moderator, "users:suspend")).toBe(true);

    // Should be denied for content publishing and system settings
    expect(hasPermission(moderator, "episodes:publish")).toBe(false);
    expect(hasPermission(moderator, "system:update")).toBe(false);
  });

  it("should evaluate custom staff permissions if specified on user object", () => {
    const customStaffUser = {
      role: "content_manager" as const,
      permissions: ["anime:read", "comments:moderate"], // custom scopes
    };

    expect(hasPermission(customStaffUser, "comments:moderate")).toBe(true);
    expect(hasPermission(customStaffUser, "anime:read")).toBe(true);
    // Unlisted scope
    expect(hasPermission(customStaffUser, "episodes:publish")).toBe(false);
  });

  it("should handle null or unauthenticated users safely", () => {
    expect(hasPermission(null, "anime:read")).toBe(false);
    expect(hasPermission({ role: null as any }, "anime:read")).toBe(false);
  });
});
