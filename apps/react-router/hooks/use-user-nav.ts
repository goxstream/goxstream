import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router";
import { authClient } from "@/lib/auth-client";

export type Role = "user" | "uploader" | "admin";

export interface ActiveUser {
  id: string;
  displayName: string;
  username: string;
  email?: string;
  avatarUrl?: string | null;
  role: Role;
  isVip: boolean;
}

export function useUserNav() {
  const { data: session, isPending: isLoading } = authClient.useSession();
  const navigate = useNavigate();

  const user = useMemo<ActiveUser | null>(() => {
    if (!session?.user) return null;
    const u = session.user as any;
    return {
      id: u.id,
      displayName: u.name || u.displayName || u.email?.split("@")[0] || "User",
      username: u.username || u.name || "user",
      email: u.email,
      avatarUrl: u.image || u.avatarUrl,
      role: (u.role as Role) || "user",
      isVip: u.membershipTier === "vip_pro" || Boolean(u.isVip),
    };
  }, [session]);

  const logout = useCallback(async () => {
    try {
      await authClient.signOut();
    } catch (error) {
      console.error("Logout request error:", error);
    }
    navigate("/login");
  }, [navigate]);

  return { user, isLoading, logout };
}
