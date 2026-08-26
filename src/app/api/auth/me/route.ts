import { NextResponse } from "next/server";
import { getActiveUserSession } from "@/lib/db/queries/users";

export async function GET() {
  const user = await getActiveUserSession();
  return NextResponse.json({ user });
}
