"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Role } from "@/lib/auth/permissions";

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
  const [user, setUser] = useState<ActiveUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;
    async function fetchMe() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = (await res.json()) as { user?: any };
          if (isMounted) {
            if (data.user) {
              setUser({
                id: data.user.id,
                displayName: data.user.displayName || data.user.username,
                username: data.user.username,
                email: data.user.email,
                avatarUrl: data.user.avatarUrl,
                role: (data.user.role as Role) || "user",
                isVip: data.user.membershipTier === "vip_pro" || Boolean(data.user.isVip),
              });
            } else {
              setUser(null);
            }
          }
        } else if (isMounted) {
          setUser(null);
        }
      } catch {
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    fetchMe();
    return () => {
      isMounted = false;
    };
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout request error:", error);
    }
    setUser(null);
    router.push("/login");
    router.refresh();
  }, [router]);

  return { user, isLoading, logout };
}

