"use client";

import { useState, useEffect } from "react";
import { Search, Film, Star, Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { TRENDING_ANIME } from "@/lib/mock-anime";

export function SearchDialog() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="relative h-9 w-full justify-start rounded-lg bg-card/60 text-sm text-muted-foreground border-border/60 hover:border-border hover:bg-muted/50 sm:w-64 md:w-80 px-3 shadow-none"
      >
        <Search className="mr-2 size-4 text-muted-foreground" />
        <span className="inline-flex">Search anime, genres...</span>
        <kbd className="pointer-events-none absolute right-2.5 top-2 hidden h-5 select-none items-center gap-0.5 rounded border border-border bg-muted/80 px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden bg-card border-border shadow-2xl rounded-xl">
          <DialogHeader className="sr-only">
            <DialogTitle>Search Anime Catalog</DialogTitle>
          </DialogHeader>
          <Command className="bg-transparent border-0">
            <div className="flex items-center px-4 border-b border-border/80">
              <Search className="size-4 shrink-0 text-muted-foreground mr-2" />
              <CommandInput
                placeholder="Search series title, Japanese name, or studio..."
                className="h-12 text-sm border-0 focus:ring-0 shadow-none bg-transparent"
              />
            </div>
            <CommandList className="max-h-[380px] p-2 overflow-y-auto">
              <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
                No anime found matching your query.
              </CommandEmpty>

              <CommandGroup heading="Popular & Trending Anime">
                {TRENDING_ANIME.map((anime) => (
                  <CommandItem
                    key={anime.id}
                    onSelect={() => setOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-lg cursor-pointer hover:bg-muted/80 aria-selected:bg-muted/80 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="size-9 rounded-md flex items-center justify-center shrink-0 text-white font-bold text-xs shadow-sm"
                        style={{ background: anime.coverImage }}
                      >
                        <Play className="size-4 fill-white" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm text-foreground line-clamp-1">
                          {anime.title}
                        </span>
                        <span className="text-xs text-muted-foreground line-clamp-1">
                          {anime.genres.join(" • ")} • {anime.studio}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">
                        <Star className="size-3 fill-amber-500 stroke-amber-500" />
                        {anime.rating}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-muted text-muted-foreground">
                        {anime.subOrDub}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}
