import { useState } from "react";
import { Link } from "react-router";
import { Sparkles, ArrowRight } from "lucide-react";
import { buttonVariants } from "@shionstream/ui/components/button";
import { Skeleton } from "@shionstream/ui/components/skeleton";
import { AnimeCard } from "@/components/anime/anime-card";
import { ApiError } from "@/components/api-error";
import { useTrendingAnime } from "@/hooks/use-trending-anime";
import type { AnimeItem } from "@/types/anime";

interface TrendingSectionProps {
  initialTrending?: AnimeItem[];
  initialGenres?: string[];
}

export function TrendingSection({ initialTrending, initialGenres }: TrendingSectionProps) {
  const [selectedGenre, setSelectedGenre] = useState("All");
  const { trendingAnime, genresList, isLoading, error } = useTrendingAnime(initialTrending, initialGenres);

  const filteredAnime =
    selectedGenre === "All"
      ? trendingAnime
      : trendingAnime.filter((item) =>
          item.genres.some((g) => g.toLowerCase() === selectedGenre.toLowerCase()),
        );

  return (
    <section id="trending" className="bg-background py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="space-y-1">
            <div className="text-primary flex items-center gap-2 text-xs font-bold tracking-wider uppercase">
              <Sparkles className="size-4" />
              <span>Trending Series</span>
            </div>
            <h2 className="text-foreground text-2xl font-extrabold tracking-tight sm:text-3xl">
              Most Popular Right Now
            </h2>
          </div>

          <Link
            to="/browse"
            className={buttonVariants({
              variant: "ghost",
              className:
                "text-primary hover:text-primary hover:bg-primary/10 group self-start rounded-lg text-sm font-semibold sm:self-auto",
            })}
          >
            View Complete Library
            <ArrowRight className="ml-1.5 size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {error ? (
          <ApiError message={error} onRetry={() => window.location.reload()} />
        ) : isLoading ? (
          <div className="space-y-6">
            <div className="flex items-center gap-2 overflow-hidden pb-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-20 rounded-full" />
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <AnimeCard key={i} isLoading={true} />
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {genresList.length > 1 && (
              <div className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-2">
                {genresList.slice(0, 10).map((genre) => (
                  <button
                    key={genre}
                    onClick={() => setSelectedGenre(genre)}
                    className={`rounded-full px-3.5 py-1 text-xs font-medium whitespace-nowrap transition-colors ${
                      selectedGenre === genre
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {filteredAnime.slice(0, 12).map((anime) => (
                <AnimeCard key={anime.id} anime={anime} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
