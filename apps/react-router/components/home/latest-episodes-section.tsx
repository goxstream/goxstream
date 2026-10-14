import { Link } from "react-router";
import { ArrowRight, Radio } from "lucide-react";
import { buttonVariants } from "@goxstream/ui/components/button";
import { EpisodeCard } from "@/components/anime/episode-card";
import { useLatestEpisodes } from "@/hooks/use-latest-episodes";
import type { EpisodeItem } from "@/types/anime";

interface LatestEpisodesSectionProps {
  initialEpisodes?: EpisodeItem[];
}

export function LatestEpisodesSection({ initialEpisodes }: LatestEpisodesSectionProps) {
  const { episodesList, isLoading } = useLatestEpisodes(initialEpisodes);

  return (
    <section
      id="latest"
      className="bg-muted/30 border-border/60 overflow-hidden border-y py-12 md:py-16"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="space-y-1">
            <div className="text-primary flex items-center gap-2 text-xs font-bold tracking-wider uppercase">
              <Radio className="size-4 animate-pulse text-emerald-500" />
              <span>Simulcast Feed</span>
            </div>
            <h2 className="text-foreground text-2xl font-extrabold tracking-tight sm:text-3xl">
              Just Released Episodes
            </h2>
          </div>

          <Link
            to="/schedule"
            className={buttonVariants({
              variant: "ghost",
              className:
                "text-primary hover:text-primary hover:bg-primary/10 group self-start rounded-lg text-sm font-semibold sm:self-auto",
            })}
          >
            Simulcast Schedule
            <ArrowRight className="ml-1.5 size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <EpisodeCard key={i} isLoading={true} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {episodesList.map((episode) => (
              <EpisodeCard key={episode.id} episode={episode} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
