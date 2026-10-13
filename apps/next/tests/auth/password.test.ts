import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "@/lib/auth/password";

describe("Password Hashing & Verification (WebCrypto)", () => {
  it("should hash a password into <salt_hex>:<hash_hex> format", async () => {
    const password = "SuperSecretPassword123!";
    const hash = await hashPassword(password);

    expect(hash).toBeTypeOf("string");
    expect(hash).toContain(":");

    const parts = hash.split(":");
    expect(parts).toHaveLength(2);
    expect(parts[0].length).toBe(32); // 16 bytes = 32 hex chars
    expect(parts[1].length).toBe(64); // 32 bytes = 64 hex chars
  });

  it("should generate unique salts for the same password", async () => {
    const password = "SamePassword123";
    const hash1 = await hashPassword(password);
    const hash2 = await hashPassword(password);

    expect(hash1).not.toBe(hash2);
  });

  it("should verify correct password successfully", async () => {
    const password = "CorrectHorseBatteryStaple";
    const hash = await hashPassword(password);

    const isValid = await verifyPassword(password, hash);
    expect(isValid).toBe(true);
  });

  it("should reject incorrect password", async () => {
    const password = "CorrectPassword";
    const hash = await hashPassword(password);

    const isValid = await verifyPassword("WrongPassword", hash);
    expect(isValid).toBe(false);
  });

  it("should handle malformed hashes gracefully without throwing", async () => {
    expect(await verifyPassword("password", "invalidhash")).toBe(false);
    expect(await verifyPassword("password", "part1:part2:part3")).toBe(false);
    expect(await verifyPassword("password", "")).toBe(false);
  });
});
