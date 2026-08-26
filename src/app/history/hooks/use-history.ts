"use client";

import { useState } from "react";
import { MOCK_WATCH_HISTORY } from "@/lib/mock-user";
import type { WatchHistoryItem } from "@/types/user";

export function useHistory() {
  const [historyList, setHistoryList] = useState<WatchHistoryItem[]>(MOCK_WATCH_HISTORY);

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
