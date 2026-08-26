"use client";

import { useState, useEffect } from "react";
import { MOCK_MODERATION_QUEUE } from "@/app/dashboard/users/moderation/constants";
import type { ReportedComment } from "@/app/dashboard/users/moderation/types";

export function useDashboardModeration() {
  const [reports, setReports] = useState<ReportedComment[]>(MOCK_MODERATION_QUEUE);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchModerationReports() {
      try {
        const res = await fetch("/api/dashboard/moderation");
        if (res.ok) {
          const data = (await res.json()) as { reports?: ReportedComment[] };
          if (isMounted && data.reports && data.reports.length > 0) {
            setReports(data.reports);
          }
        }
      } catch {
        // Fallback
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
