"use client";

import { useState, useEffect } from "react";

export interface SidebarUser {
  name: string;
  email: string;
  avatar: string;
  role: string;
}

export function useSidebarUser() {
  const [currentUser, setCurrentUser] = useState<SidebarUser>({
    name: "Alex Rivera",
    email: "alex@goxstream.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    role: "Super Admin",
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
              email: data.user.email,
              avatar: data.user.avatarUrl,
              role: data.user.role === "admin" ? "Super Admin" : "Content Moderator",
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

  return { currentUser };
}
