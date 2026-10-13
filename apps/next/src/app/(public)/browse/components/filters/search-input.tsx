"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { SearchInputProps } from "../../types";

export function SearchInput({ query, onQueryChange, className }: SearchInputProps) {
  const [localValue, setLocalValue] = useState(query);
  const isFirstRender = useRef(true);

  // Sync external query changes (e.g. Reset All) to localValue
  useEffect(() => {
    setLocalValue(query);
  }, [query]);

  // Debounce propagate localValue to parent onQueryChange
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      if (localValue !== query) {
        onQueryChange(localValue);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [localValue, query, onQueryChange]);

  return (
    <div className={cn("relative w-full", className)}>
      <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
      <Input
        type="text"
        placeholder="Search anime title, japanese name, studio..."
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        className="bg-card border-border/80 focus-visible:ring-primary/40 h-10 rounded-xl pr-9 pl-10 text-xs font-medium"
      />
      {localValue && (
        <button
          type="button"
          onClick={() => {
            setLocalValue("");
            onQueryChange("");
          }}
          className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 p-1 transition-colors"
          aria-label="Clear search query"
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  );
}
