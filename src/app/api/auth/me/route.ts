import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  try {
    const db = await getDb();
    const activeUser = await db.query.users.findFirst();

    if (activeUser) {
      return NextResponse.json({
        user: {
          id: activeUser.id,
          username: activeUser.username,
          displayName: activeUser.displayName,
          email: activeUser.email,
          avatarUrl: activeUser.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          bannerUrl: activeUser.bannerUrl || "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80",
          role: activeUser.role || "admin",
          isVip: activeUser.membershipTier === "vip" || activeUser.membershipTier === "ultra_vip",
        },
      });
    }
  } catch {
    // Fallback
  }

  return NextResponse.json({
    user: {
      id: "usr-admin",
      username: "alex_admin",
      displayName: "Alex Rivera",
      email: "alex@goxstream.com",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      bannerUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80",
      role: "admin",
      isVip: true,
    },
  });
}
