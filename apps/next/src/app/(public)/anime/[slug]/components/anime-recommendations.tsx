"use client";

import Link from "next/link";
import { Sparkles, Star, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getImageStyle } from "@/lib/utils";
import type { AnimeItem } from "@/types/anime";

interface AnimeRecommendationsProps {
  recommendations: AnimeItem[];
}

export function AnimeRecommendations({ recommendations }: AnimeRecommendationsProps) {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <section className="my-8">
      <Card className="border-border/60 bg-card/40 shadow-xs">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg font-bold">
            <Sparkles className="text-primary size-5" />
            <span>Recommended Anime</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {recommendations.map((anime) => {
              const isGradient = anime.coverImage && anime.coverImage.startsWith("linear-gradient");

              return (
                <Link
                  key={anime.id}
                  href={`/anime/${anime.slug}`}
                  className="group border-border/60 bg-card hover:border-primary/50 flex flex-col overflow-hidden rounded-xl border transition-all duration-200 hover:shadow-xs"
                >
                  {/* Poster Cover */}
                  <div className="bg-muted relative aspect-[2/3] w-full overflow-hidden">
                    {isGradient ? (
                      <div
                        className="h-full w-full transition-transform duration-300 group-hover:scale-105"
                        style={getImageStyle(anime.coverImage)}
                      />
                    ) : (
                      <img
                        src={anime.coverImage || ""}
                        alt={anime.title}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.opacity = "0";
                        }}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                      <div className="bg-primary/90 text-primary-foreground flex size-10 items-center justify-center rounded-full shadow-lg">
                        <Play className="fill-primary-foreground ml-0.5 size-5" />
                      </div>
                    </div>

                    {/* Rating Badge */}
                    <div className="absolute top-2 left-2 z-10">
                      <Badge className="flex items-center gap-1 border-amber-400 bg-amber-500 px-1.5 py-0 text-[10px] font-bold text-amber-950 shadow-xs">
                        <Star className="size-2.5 fill-amber-950" />
                        {anime.rating ? anime.rating.toFixed(1) : "N/A"}
                      </Badge>
                    </div>

                    {/* Type Badge */}
                    <div className="absolute bottom-2 left-2 z-10">
                      <Badge className="border-white/20 bg-black/60 px-1.5 py-0 text-[10px] font-medium text-white backdrop-blur-md">
                        {anime.type}
                      </Badge>
                    </div>
                  </div>

                  {/* Info Content */}
                  <div className="space-y-1 p-2.5">
                    <h4 className="text-foreground group-hover:text-primary line-clamp-1 text-xs font-semibold transition-colors">
                      {anime.title}
                    </h4>
                    <p className="text-muted-foreground line-clamp-1 text-[11px]">
                      {anime.studio} • {anime.genres[0]}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
