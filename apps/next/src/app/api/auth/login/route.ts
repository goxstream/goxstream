import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { loginUserAccount, createSession } from "@/lib/db/queries/users";
import { verifyPassword } from "@/lib/auth/password";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { usernameOrEmail?: string; password?: string };
    const { usernameOrEmail, password } = body;

    if (!usernameOrEmail || !password) {
      return NextResponse.json({ error: "Username/email and password are required" }, { status: 400 });
    }

    const user = await loginUserAccount(usernameOrEmail);

    if (!user) {
      return NextResponse.json({ error: "Invalid username/email or password" }, { status: 401 });
    }

    // Verify password if hash exists
    if (user.passwordHash) {
      const isValid = await verifyPassword(password, user.passwordHash);
      if (!isValid && user.passwordHash !== password) {
        return NextResponse.json({ error: "Invalid username/email or password" }, { status: 401 });
      }
    }

    const userAgent = req.headers.get("user-agent") || undefined;
    const ipAddress = req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip") || undefined;

    const sessionToken = await createSession(user.id, userAgent, ipAddress);

    const cookieStore = await cookies();
    const cookieOptions = {
      path: "/",
      httpOnly: true,
      sameSite: "lax" as const,
      maxAge: 60 * 60 * 24 * 7, // 7 days
    };

    cookieStore.set(SESSION_COOKIE_NAME, sessionToken, cookieOptions);

    const response = NextResponse.json({
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

    response.headers.set(
      "Set-Cookie",
      `${SESSION_COOKIE_NAME}=${sessionToken}; Path=/; Max-Age=604800; HttpOnly; SameSite=Lax`
    );

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Login failed" }, { status: 500 });
  }
}
