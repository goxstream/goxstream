import { NextRequest, NextResponse } from "next/server";
import { registerUserAccount } from "@/lib/db/queries/users";

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

    const newId = await registerUserAccount({
      username,
      email,
      passwordHash: password,
      displayName,
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
