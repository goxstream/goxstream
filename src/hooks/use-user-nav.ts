"use client";

import { useState, useEffect } from "react";

export interface ActiveUser {
  displayName: string;
  username: string;
  avatarUrl: string;
  isVip: boolean;
}

export const DEFAULT_USER: ActiveUser = {
  displayName: "Alex Rivera",
  username: "alex_otaku",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  isVip: true,
};

export function useUserNav() {
  const [user, setUser] = useState<ActiveUser>(DEFAULT_USER);

  useEffect(() => {
    let isMounted = true;
    async function fetchMe() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = (await res.json()) as { user?: any };
          if (isMounted && data.user) {
            setUser({
              displayName: data.user.displayName,
              username: data.user.username,
              avatarUrl: data.user.avatarUrl,
              isVip: Boolean(data.user.isVip),
            });
          }
        }
      } catch {
        // Fallback
      }
    }
    fetchMe();
    return () => {
      isMounted = false;
    };
  }, []);

  return { user };
}
