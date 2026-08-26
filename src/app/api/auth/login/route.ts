import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { usernameOrEmail?: string; password?: string };
    const { usernameOrEmail, password } = body;
    const db = await getDb();

    if (!usernameOrEmail) {
      return NextResponse.json({ error: "Username or email is required" }, { status: 400 });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.username, usernameOrEmail),
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
        role: user.role,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Login failed" }, { status: 500 });
  }
}
