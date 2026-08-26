import Link from "next/link";
import { Tv, ArrowRight, Radio } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { EpisodeCard } from "@/components/episode-card";
import { LATEST_EPISODES } from "@/lib/mock-anime";

export function LatestEpisodesSection() {
  return (
    <section id="latest" className="py-12 md:py-16 bg-muted/30 border-y border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
              <Radio className="size-4 animate-pulse text-emerald-500" />
              <span>Simulcast Feed</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Just Released Episodes
            </h2>
          </div>

          <Link
            href="#schedule"
            className={buttonVariants({
              variant: "ghost",
              className: "self-start sm:self-auto text-sm font-semibold text-primary hover:text-primary hover:bg-primary/10 rounded-lg group",
            })}
          >
            Simulcast Schedule
            <ArrowRight className="ml-1.5 size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Episode Card List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {LATEST_EPISODES.map((episode) => (
            <EpisodeCard key={episode.id} episode={episode} />
          ))}
        </div>
      </div>
    </section>
  );
}
