import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session";

/**
 * Route Handler for user session termination (Logout).
 * Invalidates and deletes the session cookie from the client's browser.
 */
export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete({
      name: SESSION_COOKIE_NAME,
      path: "/",
    });
  } catch {}

  const response = NextResponse.json(
    {
      success: true,
      message: "Logged out successfully",
    },
    { status: 200 }
  );

  // Set-Cookie header for robust cookie deletion across all environments
  response.headers.set(
    "Set-Cookie",
    `${SESSION_COOKIE_NAME}=; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax`
  );

  return response;
}

// Support DELETE method as well
export async function DELETE() {
  return POST();
}
