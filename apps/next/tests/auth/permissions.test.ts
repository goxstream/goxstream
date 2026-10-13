import { describe, it, expect } from "vitest";
import { hasRole, canAccessVipContent, canAccessQuality } from "@/lib/auth/permissions";

describe("Permissions & RBAC Helpers", () => {
  describe("hasRole()", () => {
    it("should allow super_admin to access all role levels", () => {
      expect(hasRole("super_admin", ["user"])).toBe(true);
      expect(hasRole("super_admin", ["moderator"])).toBe(true);
      expect(hasRole("super_admin", ["content_manager"])).toBe(true);
      expect(hasRole("super_admin", ["admin"])).toBe(true);
      expect(hasRole("super_admin", ["super_admin"])).toBe(true);
    });

    it("should allow admin to access admin, content_manager, moderator, user levels", () => {
      expect(hasRole("admin", ["user"])).toBe(true);
      expect(hasRole("admin", ["admin"])).toBe(true);
      expect(hasRole("admin", ["super_admin"])).toBe(false);
    });

    it("should restrict user from admin or super_admin roles", () => {
      expect(hasRole("user", ["user"])).toBe(true);
      expect(hasRole("user", ["admin"])).toBe(false);
      expect(hasRole("user", ["super_admin"])).toBe(false);
    });

    it("should return false for null or undefined user roles", () => {
      expect(hasRole(null, ["user"])).toBe(false);
      expect(hasRole(undefined, ["admin"])).toBe(false);
    });
  });

  describe("canAccessVipContent()", () => {
    it("should allow vip_pro users", () => {
      expect(canAccessVipContent({ membership_tier: "vip_pro" })).toBe(true);
    });

    it("should reject free users", () => {
      expect(canAccessVipContent({ membership_tier: "free" })).toBe(false);
    });

    it("should reject unauthenticated / null users", () => {
      expect(canAccessVipContent(null)).toBe(false);
    });
  });

  describe("canAccessQuality()", () => {
    it("should allow 720p, 480p, 360p for free users", () => {
      expect(canAccessQuality({ membership_tier: "free" }, "720p")).toBe(true);
      expect(canAccessQuality({ membership_tier: "free" }, "480p")).toBe(true);
      expect(canAccessQuality({ membership_tier: "free" }, "360p")).toBe(true);
    });

    it("should restrict 1080p to vip_pro users only", () => {
      expect(canAccessQuality({ membership_tier: "free" }, "1080p")).toBe(false);
      expect(canAccessQuality({ membership_tier: "vip_pro" }, "1080p")).toBe(true);
    });
  });
});
