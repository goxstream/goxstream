"use client";

import { useState, useMemo, useRef } from "react";
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
  const inputContainerRef = useRef<HTMLDivElement>(null);

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

  // Filter options based on user input query
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
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
          {label}
        </label>
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
        <div ref={inputContainerRef} className="w-full relative">
          <ComboboxInput
            value={query}
            onInput={(e: React.FormEvent<HTMLInputElement>) => {
              setQuery(e.currentTarget.value);
            }}
            placeholder={currentOption.label || label}
            showTrigger
            className={cn(
              "w-full h-10 text-xs font-medium bg-card rounded-xl border border-border/80 shadow-xs focus-within:border-primary/50 transition-colors",
              className
            )}
          />
        </div>

        <ComboboxContent
          anchor={inputContainerRef}
          sideOffset={6}
          align="start"
          className={cn(
            "!w-[var(--anchor-width)] !min-w-[var(--anchor-width)] !max-w-[var(--anchor-width)] z-50 bg-popover border border-border/60 shadow-md rounded-xl p-1",
            contentClassName
          )}
        >
          <ComboboxList className="max-h-56 no-scrollbar">
            {filteredOptions.length === 0 ? (
              <ComboboxEmpty className="text-xs py-3 px-2 text-center text-muted-foreground">
                No option found
              </ComboboxEmpty>
            ) : (
              filteredOptions.map((opt) => (
                <ComboboxItem
                  key={opt.value}
                  value={opt}
                  className="text-xs py-2 px-2.5 rounded-lg cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary font-medium"
                >
                  {opt.label}
                </ComboboxItem>
              ))
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}
