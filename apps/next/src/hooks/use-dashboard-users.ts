"use client";

import { useState, useEffect } from "react";
import type { UserProfile } from "@/types/user";

export function useDashboardUsers() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchDashboardUsers() {
      try {
        const res = await fetch("/api/dashboard/users");
        if (res.ok) {
          const data = (await res.json()) as { users?: UserProfile[] };
          if (isMounted) {
            setUsers(data.users || []);
          }
        }
      } catch {
        if (isMounted) setUsers([]);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchDashboardUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  return { users, isLoading };
}
