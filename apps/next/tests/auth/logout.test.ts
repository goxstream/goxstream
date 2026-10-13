import { describe, it, expect } from "vitest";
import { POST, DELETE } from "@/app/api/auth/logout/route";

describe("API Route Handler: /api/auth/logout", () => {
  it("should respond with 200 OK and JSON success payload on POST", async () => {
    const res = await POST();
    const data = (await res.json()) as { success: boolean; message?: string };

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.message).toContain("Logged out");
  });

  it("should respond with 200 OK on DELETE", async () => {
    const res = await DELETE();
    const data = (await res.json()) as { success: boolean; message?: string };

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
  });
});
