"use client";

import { useState } from "react";
import { Check, ChevronsUpDown, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

interface AnimeOption {
  id: string;
  title: string;
}

interface AnimeSelectComboboxProps {
  value: string;
  onValueChange: (val: string) => void;
  options: AnimeOption[];
  placeholder?: string;
  allowAllOption?: boolean;
  className?: string;
}

export function AnimeSelectCombobox({
  value,
  onValueChange,
  options,
  placeholder = "Search anime series...",
  allowAllOption = true,
  className = "",
}: AnimeSelectComboboxProps) {
  const [open, setOpen] = useState(false);

  const selectedOption =
    value === "all"
      ? { id: "all", title: "All Anime Series" }
      : options.find((opt) => opt.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            type="button"
            role="combobox"
            aria-expanded={open}
            className={`justify-between h-9 text-xs border-border/60 bg-card font-normal ${className}`}
          />
        }
      >
        <div className="flex items-center gap-2 truncate">
          <Film className="size-3.5 text-primary shrink-0" />
          <span className="truncate">
            {selectedOption ? selectedOption.title : placeholder}
          </span>
        </div>
        <ChevronsUpDown className="size-3.5 text-muted-foreground shrink-0 opacity-70 ml-2" />
      </PopoverTrigger>

      <PopoverContent align="start" className="w-[320px] p-0 text-xs border-border/60 bg-card">
        <Command>
          <CommandInput placeholder="Type to search anime..." className="h-9 text-xs" />
          <CommandList className="max-h-60 overflow-y-auto">
            <CommandEmpty className="py-3 text-center text-xs text-muted-foreground">
              No anime series found.
            </CommandEmpty>
            <CommandGroup>
              {allowAllOption && (
                <CommandItem
                  value="All Anime Series"
                  onSelect={() => {
                    onValueChange("all");
                    setOpen(false);
                  }}
                  className="text-xs cursor-pointer"
                >
                  <Check
                    className={`mr-2 size-3.5 text-primary ${
                      value === "all" ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  All Anime Series
                </CommandItem>
              )}
              {options.map((opt) => {
                const isSelected = value === opt.id;
                return (
                  <CommandItem
                    key={opt.id}
                    value={opt.title}
                    onSelect={() => {
                      onValueChange(opt.id);
                      setOpen(false);
                    }}
                    className="text-xs cursor-pointer"
                  >
                    <Check
                      className={`mr-2 size-3.5 text-primary ${
                        isSelected ? "opacity-100" : "opacity-0"
                      }`}
                    />
                    <span className="truncate">{opt.title}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
