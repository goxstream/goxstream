import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { users } from "@/lib/db/schema";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      username?: string;
      email?: string;
      password?: string;
      displayName?: string;
    };
    const { username, email, password, displayName } = body;

    if (!username || !email || !password) {
      return NextResponse.json({ error: "Username, email, and password are required" }, { status: 400 });
    }

    const db = await getDb();
    const newId = `usr-${Date.now()}`;

    await db.insert(users).values({
      id: newId,
      username,
      email,
      passwordHash: password, // In production, hash with bcrypt/scrypt
      displayName: displayName || username,
      role: "user",
      status: "active",
      membershipTier: "free",
    });

    return NextResponse.json({
      success: true,
      user: {
        id: newId,
        username,
        email,
        displayName: displayName || username,
        role: "user",
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Registration failed" }, { status: 500 });
  }
}
