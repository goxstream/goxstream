"use client";

import { useState, useEffect } from "react";
import { MOCK_WATCH_HISTORY } from "@/lib/mock-user";
import type { WatchHistoryItem } from "@/types/user";

export function useHistory() {
  const [historyList, setHistoryList] = useState<WatchHistoryItem[]>(MOCK_WATCH_HISTORY);

  useEffect(() => {
    let isMounted = true;

    async function fetchHistory() {
      try {
        const res = await fetch("/api/user/history");
        if (res.ok) {
          const data = (await res.json()) as { items?: WatchHistoryItem[] };
          if (isMounted && data.items && data.items.length > 0) {
            setHistoryList(data.items);
          }
        }
      } catch {
        // Fallback to initial mock if DB empty
      }
    }

    fetchHistory();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleRemoveItem = (id: string) => {
    setHistoryList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAll = () => {
    setHistoryList([]);
  };

  return {
    historyList,
    handleRemoveItem,
    handleClearAll,
  };
}
