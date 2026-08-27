"use client";

import { useState, useEffect } from "react";
import type { RoleDefinition } from "@/app/dashboard/users/roles/types";

export function useDashboardRoles() {
  const [roles, setRoles] = useState<RoleDefinition[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchRoles() {
      try {
        const res = await fetch("/api/dashboard/roles");
        if (res.ok) {
          const data = (await res.json()) as { roles?: RoleDefinition[] };
          if (isMounted) {
            setRoles(data.roles || []);
          }
        }
      } catch {
        if (isMounted) setRoles([]);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchRoles();

    return () => {
      isMounted = false;
    };
  }, []);

  return { roles, isLoading, setRoles };
}
