import { NextResponse } from "next/server";
import { getUserWatchHistoryItems } from "@/lib/db/queries/user-activity";

export async function GET() {
  const items = await getUserWatchHistoryItems();
  return NextResponse.json({ items });
}
