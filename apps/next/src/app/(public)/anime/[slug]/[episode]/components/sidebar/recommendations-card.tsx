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
    <div className="bg-card border-border/60 rounded-xl border p-4 shadow-xs">
      <h2 className="text-foreground mb-3 flex items-center gap-2 text-sm font-bold">
        <Star className="h-4 w-4 shrink-0 fill-amber-500 text-amber-500" />
        You Might Also Like
      </h2>

      <div className="flex flex-col gap-3">
        {recommendations.map((rec) => (
          <Link
            key={rec.id}
            href={`/anime/${rec.slug}`}
            className="hover:bg-muted/50 hover:border-border/60 group flex items-center gap-3 rounded-lg border border-transparent p-2 transition-all"
          >
            <div className="border-border/40 bg-muted relative h-20 w-14 shrink-0 overflow-hidden rounded-md border transition-transform group-hover:scale-105">
              {rec.coverImage ? (
                <img
                  src={
                    rec.coverImage.startsWith("url(") ? rec.coverImage.slice(5, -2) : rec.coverImage
                  }
                  alt={rec.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="bg-muted text-muted-foreground flex h-full w-full items-center justify-center text-[10px]">
                  No Image
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-foreground group-hover:text-primary line-clamp-1 text-xs font-semibold transition-colors">
                {rec.title}
              </h3>
              <div className="my-1 flex items-center gap-1.5">
                <Badge
                  variant="outline"
                  className="border-border/60 px-1 py-0 font-mono text-[10px]"
                >
                  {rec.type}
                </Badge>
                <span className="text-muted-foreground text-[10px]">{rec.year}</span>
                <span className="flex items-center text-[10px] font-semibold text-amber-500">
                  ★ {rec.rating}
                </span>
              </div>
              <p className="text-muted-foreground line-clamp-1 text-[10px]">
                {rec.genres.slice(0, 2).join(", ")}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
