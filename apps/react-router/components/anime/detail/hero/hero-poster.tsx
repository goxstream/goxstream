import { useState } from "react";
import { Star } from "lucide-react";
import { Skeleton } from "@goxstream/ui/components/skeleton";
import { Badge } from "@goxstream/ui/components/badge";
import { getImageStyle } from "@/lib/utils";
import type { AnimeItem } from "@/types/anime";

interface HeroPosterProps {
  anime?: AnimeItem | null;
  isLoading?: boolean;
}

export function HeroPoster({ anime, isLoading }: HeroPosterProps) {
  const [isPosterLoaded, setIsPosterLoaded] = useState(false);

  if (isLoading || !anime) {
    return (
      <Skeleton className="mx-auto aspect-[2/3] w-full max-w-[260px] rounded-xl md:mx-0 md:max-w-none" />
    );
  }

  const isPosterGradient = anime.coverImage && anime.coverImage.startsWith("linear-gradient");

  return (
    <div className="group border-border/80 bg-muted relative mx-auto aspect-[2/3] w-full max-w-[260px] overflow-hidden rounded-xl border shadow-xs md:mx-0 md:max-w-none">
      {isPosterGradient ? (
        <div
          className="h-full w-full transition-transform duration-500 group-hover:scale-105"
          style={getImageStyle(anime.coverImage)}
        />
      ) : (
        <img
          src={anime.coverImage || ""}
          alt={anime.title}
          loading="eager"
          decoding="async"
          onLoad={() => setIsPosterLoaded(true)}
          className={`h-full w-full object-cover transition-all duration-500 group-hover:scale-105 ${
            isPosterLoaded ? "opacity-100" : "opacity-0"
          }`}
          onError={(e) => {
            setIsPosterLoaded(true);
            (e.target as HTMLImageElement).style.opacity = "0";
          }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

      {/* Poster Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        <Badge className="flex items-center gap-1 border-amber-400 bg-amber-500 px-2 py-0.5 text-xs font-bold text-amber-950 shadow-xs">
          <Star className="size-3 fill-amber-950" />
          {anime.rating ? anime.rating.toFixed(2) : "N/A"}
        </Badge>
        <Badge className="border-white/20 bg-black/60 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-md">
          {anime.type}
        </Badge>
      </div>

      <div className="absolute right-3 bottom-3 left-3 z-10 flex items-center justify-between text-xs font-medium text-white/90">
        <span>{anime.subOrDub}</span>
        <span className="bg-primary/90 text-primary-foreground rounded px-2 py-0.5 text-[11px] font-semibold">
          {anime.status}
        </span>
      </div>
    </div>
  );
}
