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
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
      <Input
        type="text"
        placeholder="Search anime title, japanese name, studio..."
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        className="pl-10 pr-9 h-10 bg-card border-border/80 rounded-xl focus-visible:ring-primary/40 text-xs font-medium"
      />
      {localValue && (
        <button
          type="button"
          onClick={() => {
            setLocalValue("");
            onQueryChange("");
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Clear search query"
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  );
}
