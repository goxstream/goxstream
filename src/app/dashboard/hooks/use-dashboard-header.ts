"use client";

import { useState, useEffect } from "react";

export interface HeaderUser {
  name: string;
  avatar: string;
}

export function useDashboardHeader() {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<HeaderUser>({
    name: "Alex Rivera",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  });

  useEffect(() => {
    let isMounted = true;
    async function fetchMe() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = (await res.json()) as { user?: any };
          if (isMounted && data.user) {
            setCurrentUser({
              name: data.user.displayName,
              avatar: data.user.avatarUrl,
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

  return {
    currentUser,
    notificationsOpen,
    setNotificationsOpen,
  };
}
