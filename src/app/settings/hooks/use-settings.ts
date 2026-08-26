"use client";

import { useState } from "react";
import { MOCK_USER_SETTINGS } from "@/lib/mock-user";
import type { UserSettings } from "@/types/user";

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings>(MOCK_USER_SETTINGS);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return {
    settings,
    setSettings,
    savedSuccess,
    handleSave,
  };
}
