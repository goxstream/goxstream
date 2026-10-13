"use client";

import { createContext, useContext, ReactNode } from "react";
import type { EpisodeFormContextType } from "../types";
import { useEpisodeFormState } from "../hooks/use-episode-form-state";

const EpisodeFormContext = createContext<EpisodeFormContextType | undefined>(undefined);

export function EpisodeFormProvider({ children }: { children: ReactNode }) {
  const formState = useEpisodeFormState();

  return (
    <EpisodeFormContext.Provider value={formState}>
      {children}
    </EpisodeFormContext.Provider>
  );
}

export function useEpisodeForm() {
  const context = useContext(EpisodeFormContext);
  if (!context) {
    throw new Error("useEpisodeForm must be used within an EpisodeFormProvider");
  }
  return context;
}
