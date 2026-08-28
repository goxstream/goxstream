"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Star, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useAnimeSearch } from "@/hooks/use-anime-search";
import { getImageStyle } from "@/lib/utils";

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { results, isLoading } = useAnimeSearch(query);

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
        aria-label="Search anime catalog"
        className="relative h-8 w-8 sm:h-9 sm:w-44 md:w-56 lg:w-72 p-0 sm:px-3 justify-center sm:justify-start rounded-lg bg-card/60 text-sm text-muted-foreground border-border/60 hover:border-border hover:bg-muted/50 shadow-none shrink-0"
      >
        <Search className="size-4 text-muted-foreground sm:mr-2 shrink-0" />
        <span className="hidden sm:inline-flex truncate">Search anime...</span>
        <kbd className="pointer-events-none absolute right-2.5 top-2 hidden h-5 select-none items-center gap-0.5 rounded border border-border bg-muted/80 px-1.5 font-mono text-[10px] font-medium opacity-100 lg:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>



      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl w-full p-0 gap-0 overflow-hidden bg-card border border-border/80 shadow-md rounded-2xl">
          <DialogHeader className="sr-only">
            <DialogTitle>Search Anime Catalog</DialogTitle>
          </DialogHeader>
          <Command className="bg-transparent border-0 rounded-2xl overflow-hidden p-2" shouldFilter={false}>
            <div className="pl-2 pr-10 pt-1.5 pb-2.5 border-b border-border/60">
              <CommandInput
                value={query}
                onValueChange={setQuery}
                placeholder="Search series title, Japanese name, or studio..."
                className="h-10 text-sm"
              />
            </div>
            <CommandList className="max-h-[420px] p-2 overflow-y-auto">
              {isLoading ? (
                <div className="space-y-2 p-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-2">
                      <Skeleton className="size-9 rounded-md shrink-0" />
                      <div className="space-y-1.5 flex-1">
                        <Skeleton className="h-4 w-1/2 rounded" />
                        <Skeleton className="h-3 w-1/3 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : results.length === 0 ? (
                <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
                  No anime found matching your query.
                </CommandEmpty>
              ) : (
                <CommandGroup heading={query ? `Search Results (${results.length})` : "Popular & Trending Anime"}>
                  {results.map((anime) => {
                    const isGradient = anime.coverImage && anime.coverImage.startsWith("linear-gradient");

                    return (
                      <CommandItem
                        key={anime.id}
                        value={anime.title}
                        onSelect={() => setOpen(false)}
                        className="flex items-center justify-between p-2.5 rounded-lg cursor-pointer hover:bg-muted/80 aria-selected:bg-muted/80 transition-colors"
                      >
                        <Link
                          href={`/anime/${anime.slug}`}
                          onClick={() => setOpen(false)}
                          className="flex items-center justify-between w-full"
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative size-9 rounded-md overflow-hidden shrink-0 bg-muted flex items-center justify-center">
                              {isGradient ? (
                                <div
                                  className="absolute inset-0 size-full"
                                  style={getImageStyle(anime.coverImage)}
                                />
                              ) : (
                                <img
                                  src={anime.coverImage || ""}
                                  alt={anime.title}
                                  loading="lazy"
                                  decoding="async"
                                  className="absolute inset-0 size-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.opacity = "0";
                                  }}
                                />
                              )}
                              <Play className="relative size-3.5 fill-white text-white z-10" />
                            </div>
                            <div className="flex flex-col text-left">
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
                        </Link>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}
