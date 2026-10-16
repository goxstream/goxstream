import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Search, Star, Play } from "lucide-react";
import { Button } from "@shionstream/ui/components/button";
import { Skeleton } from "@shionstream/ui/components/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@shionstream/ui/components/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@shionstream/ui/components/command";
import { useAnimeSearch } from "@/hooks/use-anime-search";
import { getImageStyle } from "@/lib/utils";

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { results, isLoading, error } = useAnimeSearch(query);

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
        className="bg-card/60 text-muted-foreground border-border/60 hover:border-border hover:bg-muted/50 relative h-8 w-auto max-w-[160px] min-w-[110px] flex-1 shrink justify-center rounded-lg p-0 text-sm shadow-none sm:h-9 sm:max-w-[200px] sm:justify-start sm:px-3 lg:max-w-[240px] xl:max-w-[280px]"
      >
        <Search className="text-muted-foreground size-4 shrink-0 sm:mr-2" />
        <span className="hidden truncate sm:inline-flex">Search anime...</span>
        <kbd className="border-border bg-muted/80 pointer-events-none absolute top-2 right-2.5 hidden h-5 items-center gap-0.5 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none lg:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-card border-border/80 w-full gap-0 overflow-hidden rounded-2xl border p-0 shadow-md sm:max-w-2xl">
          <DialogHeader className="sr-only">
            <DialogTitle>Search Anime Catalog</DialogTitle>
          </DialogHeader>
          <Command
            className="overflow-hidden rounded-2xl border-0 bg-transparent p-2"
            shouldFilter={false}
          >
            <div className="border-border/60 border-b pt-1.5 pr-10 pb-2.5 pl-2">
              <CommandInput
                value={query}
                onValueChange={setQuery}
                placeholder="Search series title, Japanese name, or studio..."
                className="h-10 text-sm"
              />
            </div>
            <CommandList className="max-h-[420px] overflow-y-auto p-2">
              {isLoading ? (
                <div className="space-y-2 p-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-2">
                      <Skeleton className="size-9 shrink-0 rounded-md" />
                      <div className="flex-1 space-y-1.5">
                        <Skeleton className="h-4 w-1/2 rounded" />
                        <Skeleton className="h-3 w-1/3 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-destructive py-6 text-center text-sm font-medium">
                  {error}
                </div>
              ) : results.length === 0 ? (
                <CommandEmpty className="text-muted-foreground py-6 text-center text-sm">
                  No anime found matching your query.
                </CommandEmpty>
              ) : (
                <CommandGroup
                  heading={
                    query ? `Search Results (${results.length})` : "Popular & Trending Anime"
                  }
                >
                  {results.map((anime) => {
                    const isGradient =
                      anime.coverImage && anime.coverImage.startsWith("linear-gradient");

                    return (
                      <CommandItem
                        key={anime.id}
                        value={anime.title}
                        onSelect={() => setOpen(false)}
                        className="hover:bg-muted/80 aria-selected:bg-muted/80 flex cursor-pointer items-center justify-between rounded-lg p-2.5 transition-colors"
                      >
                        <Link
                          to={`/anime/${anime.slug}`}
                          onClick={() => setOpen(false)}
                          className="flex w-full items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div className="bg-muted relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md">
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
                              <Play className="relative z-10 size-3.5 fill-white text-white" />
                            </div>
                            <div className="flex flex-col text-left">
                              <span className="text-foreground line-clamp-1 text-sm font-semibold">
                                {anime.title}
                              </span>
                              <span className="text-muted-foreground line-clamp-1 text-xs">
                                {anime.genres.join(" • ")} • {anime.studio}
                              </span>
                            </div>
                          </div>

                          <div className="flex shrink-0 items-center gap-2">
                            <span className="inline-flex items-center gap-1 rounded bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-500">
                              <Star className="size-3 fill-amber-500 stroke-amber-500" />
                              {anime.rating}
                            </span>
                            <span className="bg-muted text-muted-foreground rounded px-2 py-0.5 text-xs font-semibold">
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
