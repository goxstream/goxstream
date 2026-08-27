"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

import type { SearchInputProps } from "../../types";

export function SearchInput({ query, onQueryChange }: SearchInputProps) {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
      <Input
        type="text"
        placeholder="Search anime title, japanese name, studio..."
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        className="pl-10 pr-9 h-11 bg-card border-border/80 rounded-xl focus-visible:ring-primary/40 text-sm"
      />
      {query && (
        <button
          type="button"
          onClick={() => onQueryChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Clear search query"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}
