import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { registerUserAccount, getUserByEmail, getUserByUsername, createSession } from "@/lib/db/queries/users";
import { hashPassword } from "@/lib/auth/password";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session";

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

    const existingEmail = await getUserByEmail(email);
    if (existingEmail) {
      return NextResponse.json({ error: "Email address is already registered" }, { status: 400 });
    }

    const existingUsername = await getUserByUsername(username);
    if (existingUsername) {
      return NextResponse.json({ error: "Username is already taken" }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);

    const newId = await registerUserAccount({
      username,
      email,
      passwordHash: hashedPassword,
      displayName: displayName || username,
    });

    const userAgent = req.headers.get("user-agent") || undefined;
    const ipAddress = req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip") || undefined;

    const sessionToken = await createSession(newId, userAgent, ipAddress);

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: newId,
        username,
        email,
        displayName: displayName || username,
        role: "user",
      },
    });

    response.headers.set(
      "Set-Cookie",
      `${SESSION_COOKIE_NAME}=${sessionToken}; Path=/; Max-Age=604800; HttpOnly; SameSite=Lax`
    );

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Registration failed" }, { status: 500 });
  }
}
