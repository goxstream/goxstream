"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { VercelSpinner } from "@/components/vercel-spinner";
import { Badge } from "@/components/ui/badge";
import { getImageStyle } from "@/lib/utils";
import type { AnimeItem } from "@/types/anime";

interface HeroPosterProps {
  anime?: AnimeItem | null;
  isLoading?: boolean;
}

export function HeroPoster({ anime, isLoading }: HeroPosterProps) {
  const [isPosterLoaded, setIsPosterLoaded] = useState(false);

  if (isLoading || !anime) {
    return <Skeleton className="mx-auto md:mx-0 w-full max-w-[260px] md:max-w-none aspect-[2/3] rounded-xl" />;
  }

  const isPosterGradient = anime.coverImage && anime.coverImage.startsWith("linear-gradient");

  return (
    <div className="relative group mx-auto md:mx-0 w-full max-w-[260px] md:max-w-none aspect-[2/3] rounded-xl overflow-hidden shadow-md border border-border/80 bg-muted">
      {!isPosterGradient && !isPosterLoaded && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-xs transition-opacity duration-300">
          <VercelSpinner size="md" />
        </div>
      )}

      {isPosterGradient ? (
        <div
          className="w-full h-full transition-transform duration-500 group-hover:scale-105"
          style={getImageStyle(anime.coverImage)}
        />
      ) : (
        <img
          src={anime.coverImage || ""}
          alt={anime.title}
          loading="eager"
          decoding="async"
          onLoad={() => setIsPosterLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
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
      <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
        <Badge className="bg-amber-500 text-amber-950 border-amber-400 font-bold px-2 py-0.5 text-xs shadow-xs flex items-center gap-1">
          <Star className="size-3 fill-amber-950" />
          {anime.rating ? anime.rating.toFixed(2) : "N/A"}
        </Badge>
        <Badge className="bg-black/60 backdrop-blur-md text-white border-white/20 font-medium px-2 py-0.5 text-xs">
          {anime.type}
        </Badge>
      </div>

      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white/90 font-medium z-10">
        <span>{anime.subOrDub}</span>
        <span className="bg-primary/90 text-primary-foreground px-2 py-0.5 rounded text-[11px] font-semibold">
          {anime.status}
        </span>
      </div>
    </div>
  );
}
