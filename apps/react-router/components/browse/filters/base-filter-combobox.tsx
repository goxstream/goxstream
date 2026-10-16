import { useState, useMemo, useRef } from "react";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@shionstream/ui/components/combobox";
import { cn } from "@/lib/utils";
import type { BaseFilterComboboxProps, ComboboxOption } from "@/types/browse";

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

  const normalizedOptions = useMemo<ComboboxOption[]>(() => {
    return options.map((opt) => (typeof opt === "string" ? { label: opt, value: opt } : opt));
  }, [options]);

  const currentOption = useMemo(() => {
    return (
      normalizedOptions.find((opt) => opt.value === value) || {
        label: value,
        value,
      }
    );
  }, [normalizedOptions, value]);

  const filteredOptions = useMemo(() => {
    if (!query.trim()) return normalizedOptions;
    const lowerQuery = query.toLowerCase();
    return normalizedOptions.filter(
      (opt) =>
        opt.label.toLowerCase().includes(lowerQuery) ||
        opt.value.toLowerCase().includes(lowerQuery),
    );
  }, [normalizedOptions, query]);

  return (
    <div className="flex w-full flex-col gap-1.5">
      {label && (
        <label className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
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
        <div ref={inputContainerRef} className="relative w-full">
          <ComboboxInput
            value={query}
            onInput={(e: React.FormEvent<HTMLInputElement>) => {
              setQuery(e.currentTarget.value);
            }}
            placeholder={currentOption.label || label}
            showTrigger
            className={cn(
              "bg-card border-border/80 focus-within:border-primary/50 h-10 w-full rounded-xl border text-xs font-medium shadow-xs transition-colors",
              className,
            )}
          />
        </div>

        <ComboboxContent
          anchor={inputContainerRef}
          sideOffset={6}
          align="start"
          className={cn(
            "bg-popover border-border/60 z-50 !w-[var(--anchor-width)] !max-w-[var(--anchor-width)] !min-w-[var(--anchor-width)] rounded-xl border p-1 shadow-md",
            contentClassName,
          )}
        >
          <ComboboxList className="no-scrollbar max-h-56">
            {filteredOptions.length === 0 ? (
              <ComboboxEmpty className="text-muted-foreground px-2 py-3 text-center text-xs">
                No option found
              </ComboboxEmpty>
            ) : (
              filteredOptions.map((opt) => (
                <ComboboxItem
                  key={opt.value}
                  value={opt}
                  className="hover:bg-accent hover:text-accent-foreground data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary cursor-pointer rounded-lg px-2.5 py-2 text-xs font-medium transition-colors"
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
