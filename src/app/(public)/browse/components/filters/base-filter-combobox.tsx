"use client";

import { useState, useMemo } from "react";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@/components/ui/combobox";
import { cn } from "@/lib/utils";

import type { BaseFilterComboboxProps, ComboboxOption } from "../../types";

export function BaseFilterCombobox({
  label,
  value,
  onValueChange,
  options,
  className,
  contentClassName,
}: BaseFilterComboboxProps) {
  const [query, setQuery] = useState("");

  // Normalize options array to uniform ComboboxOption format
  const normalizedOptions = useMemo<ComboboxOption[]>(() => {
    return options.map((opt) =>
      typeof opt === "string" ? { label: opt, value: opt } : opt
    );
  }, [options]);

  // Find currently selected option
  const currentOption = useMemo(() => {
    return (
      normalizedOptions.find((opt) => opt.value === value) || {
        label: value,
        value,
      }
    );
  }, [normalizedOptions, value]);

  // Filter options based on user input
  const filteredOptions = useMemo(() => {
    if (!query.trim()) return normalizedOptions;
    const lowerQuery = query.toLowerCase();
    return normalizedOptions.filter(
      (opt) =>
        opt.label.toLowerCase().includes(lowerQuery) ||
        opt.value.toLowerCase().includes(lowerQuery)
    );
  }, [normalizedOptions, query]);

  return (
    <div className="flex items-center gap-1.5">
      {label && (
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider shrink-0">
          {label}:
        </span>
      )}
      <Combobox
        value={currentOption}
        onValueChange={(selected: ComboboxOption | null) => {
          if (selected) {
            onValueChange(selected.value);
            setQuery("");
          }
        }}
      >
        <ComboboxInput
          value={query}
          onInput={(e: React.FormEvent<HTMLInputElement>) => {
            setQuery(e.currentTarget.value);
          }}
          placeholder={currentOption.label || label}
          showTrigger
          className={cn(
            "h-9 min-w-28 text-xs font-medium bg-card rounded-lg border-border/80",
            className
          )}
        />
        <ComboboxContent
          sideOffset={6}
          align="start"
          className={cn("z-50 min-w-36 bg-popover border-border/60 shadow-md", contentClassName)}
        >
          <ComboboxList>
            <ComboboxEmpty className="text-xs py-2 px-3 text-center text-muted-foreground">
              Option not found
            </ComboboxEmpty>
            {filteredOptions.map((opt) => (
              <ComboboxItem
                key={opt.value}
                value={opt}
                className="text-xs cursor-pointer hover:bg-accent hover:text-accent-foreground"
              >
                {opt.label}
              </ComboboxItem>
            ))}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}
