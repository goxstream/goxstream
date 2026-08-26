import { NextRequest, NextResponse } from "next/server";
import { loginUserAccount } from "@/lib/db/queries/users";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { usernameOrEmail?: string; password?: string };
    const { usernameOrEmail } = body;

    if (!usernameOrEmail) {
      return NextResponse.json({ error: "Username or email is required" }, { status: 400 });
    }

    const user = await loginUserAccount(usernameOrEmail);

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
