import Link from "next/link";
import { Play, Star, Tv } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { AnimeItem } from "@/types/anime";

interface AnimeCardProps {
  anime: AnimeItem;
  priority?: boolean;
}

export function AnimeCard({ anime }: AnimeCardProps) {
  return (
    <Link
      href={`#watch-${anime.slug}`}
      className="group flex flex-col rounded-xl overflow-hidden bg-card border border-border/80 hover:border-primary/60 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {/* Poster Artwork Area */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
        {/* Dynamic Visual Gradient Artwork */}
        <div
          className="absolute inset-0 size-full transition-transform duration-500 group-hover:scale-105"
          style={{ background: anime.coverImage }}
        >
          {/* Abstract SVG Pattern */}
          <div className="absolute inset-0 opacity-20 mix-blend-overlay">
            <svg className="size-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none">
              <defs>
                <pattern id={`grid-${anime.id}`} width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill={`url(#grid-${anime.id})`} />
            </svg>
          </div>
        </div>

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
          <Badge className="bg-background/85 text-foreground backdrop-blur-md border border-border/60 text-[10px] font-bold tracking-wide px-2 py-0.5">
            {anime.subOrDub}
          </Badge>

          <Badge className="bg-black/70 text-amber-400 backdrop-blur-md border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 flex items-center gap-1">
            <Star className="size-3 fill-amber-400 stroke-amber-400" />
            {anime.rating.toFixed(1)}
          </Badge>
        </div>

        {/* Hover Overlay with Play Icon */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10 backdrop-blur-[2px]">
          <div className="size-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center border border-primary-foreground/20 transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <Play className="size-6 fill-primary-foreground stroke-primary-foreground ml-0.5" />
          </div>
        </div>

        {/* Bottom Card Shadow Gradient */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/80 to-transparent z-0" />
      </div>

      {/* Card Info Content */}
      <div className="p-3.5 flex flex-col gap-1.5 flex-1 bg-card">
        <h3 className="font-bold text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors">
          {anime.title}
        </h3>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="line-clamp-1">{anime.genres.slice(0, 2).join(" • ")}</span>
          <span className="font-medium shrink-0 flex items-center gap-1">
            <Tv className="size-3 text-muted-foreground" />
            Ep {anime.latestEpisode || anime.episodesCount}
          </span>
        </div>
      </div>
    </Link>
  );
}
