"use client";

import { useState, useEffect } from "react";
import type { ReportedComment } from "@/app/dashboard/users/moderation/types";

export function useDashboardModeration() {
  const [reports, setReports] = useState<ReportedComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchModerationReports() {
      try {
        const res = await fetch("/api/dashboard/moderation");
        if (res.ok) {
          const data = (await res.json()) as { reports?: ReportedComment[] };
          if (isMounted) {
            setReports(data.reports || []);
          }
        }
      } catch {
        if (isMounted) setReports([]);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchModerationReports();

    return () => {
      isMounted = false;
    };
  }, []);

  return { reports, isLoading, setReports };
}
