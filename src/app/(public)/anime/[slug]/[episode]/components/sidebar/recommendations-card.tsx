"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import type { AnimeItem } from "@/types/anime";

interface RecommendationsCardProps {
  recommendations: AnimeItem[];
}

export function RecommendationsCard({ recommendations }: RecommendationsCardProps) {
  return (
    <div className="bg-card border border-border/60 rounded-xl p-4 shadow-xs">
      <h2 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
        <Star className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
        You Might Also Like
      </h2>

      <div className="flex flex-col gap-3">
        {recommendations.map((rec) => (
          <Link
            key={rec.id}
            href={`/anime/${rec.slug}`}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 border border-transparent hover:border-border/60 transition-all group"
          >
            <div className="relative w-14 h-20 rounded-md shrink-0 overflow-hidden border border-border/40 group-hover:scale-105 transition-transform bg-muted">
              {rec.coverImage ? (
                <img
                  src={rec.coverImage.startsWith("url(") ? rec.coverImage.slice(5, -2) : rec.coverImage}
                  alt={rec.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center text-[10px] text-muted-foreground">
                  No Image
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                {rec.title}
              </h3>
              <div className="flex items-center gap-1.5 my-1">
                <Badge variant="outline" className="text-[10px] py-0 px-1 font-mono border-border/60">
                  {rec.type}
                </Badge>
                <span className="text-[10px] text-muted-foreground">{rec.year}</span>
                <span className="text-[10px] text-amber-500 font-semibold flex items-center">
                  ★ {rec.rating}
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground line-clamp-1">
                {rec.genres.slice(0, 2).join(", ")}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
