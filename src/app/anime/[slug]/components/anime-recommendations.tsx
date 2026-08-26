"use client";

import Link from "next/link";
import { Sparkles, Star, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Sparkles className="size-5 text-primary" />
            <span>Rekomendasi Anime Serupa</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {recommendations.map((anime) => (
              <Link
                key={anime.id}
                href={`/anime/${anime.slug}`}
                className="group flex flex-col rounded-xl overflow-hidden border border-border/60 bg-card hover:border-primary/50 transition-all duration-200 hover:shadow-xs"
              >
                {/* Poster Cover */}
                <div className="relative aspect-[2/3] w-full overflow-hidden bg-muted">
                  <div
                    className="w-full h-full transition-transform duration-300 group-hover:scale-105"
                    style={{ background: anime.coverImage }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="size-10 rounded-full bg-primary/90 text-primary-foreground flex items-center justify-center shadow-lg">
                      <Play className="size-5 fill-primary-foreground ml-0.5" />
                    </div>
                  </div>

                  {/* Rating Badge */}
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-amber-500 text-amber-950 border-amber-400 font-bold px-1.5 py-0 text-[10px] flex items-center gap-1 shadow-xs">
                      <Star className="size-2.5 fill-amber-950" />
                      {anime.rating.toFixed(1)}
                    </Badge>
                  </div>

                  {/* Type Badge */}
                  <div className="absolute bottom-2 left-2">
                    <Badge className="bg-black/60 backdrop-blur-md text-white border-white/20 text-[10px] font-medium py-0 px-1.5">
                      {anime.type}
                    </Badge>
                  </div>
                </div>

                {/* Info Content */}
                <div className="p-2.5 space-y-1">
                  <h4 className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {anime.title}
                  </h4>
                  <p className="text-[11px] text-muted-foreground line-clamp-1">
                    {anime.studio} • {anime.genres[0]}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
