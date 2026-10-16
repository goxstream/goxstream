import { Link } from "react-router";
import { Play, Clock, Star, Radio } from "lucide-react";
import { Badge } from "@shionstream/ui/components/badge";
import { buttonVariants } from "@shionstream/ui/components/button";
import { TIMEZONE_CONFIG } from "@/lib/constants";
import { getImageStyle } from "@/lib/utils";
import type { ScheduleItem } from "@/types/schedule";

interface GridViewProps {
  items: ScheduleItem[];
  dayLabel: string;
}

export function GridView({ items, dayLabel }: GridViewProps) {
  if (items.length === 0) {
    return (
      <div className="border-border/60 bg-card/30 flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center">
        <Clock className="text-muted-foreground/50 mb-3 h-12 w-12" />
        <h3 className="text-foreground text-lg font-semibold">No Release Schedule Found</h3>
        <p className="text-muted-foreground mt-1 max-w-md text-sm">
          No anime releases found for {dayLabel} matching your search query.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => {
        const isAiringNow = item.status === "airing_now";
        const isUpcoming = item.status === "upcoming";
        const isGradient = item.coverImage && item.coverImage.startsWith("linear-gradient");

        return (
          <div
            key={item.id}
            className="group border-border/60 bg-card/60 hover:bg-card hover:border-border flex flex-col overflow-hidden rounded-xl border shadow-xs transition-all duration-200"
          >
            {/* Cover image container */}
            <Link
              to={`/anime/${item.slug}`}
              className="bg-muted relative aspect-16/9 overflow-hidden"
            >
              {isGradient ? (
                <div
                  className="absolute inset-0 transition-transform duration-300 group-hover:scale-105"
                  style={getImageStyle(item.coverImage)}
                />
              ) : (
                <img
                  src={item.coverImage || ""}
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 size-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.opacity = "0";
                  }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              {/* Time pill top-left */}
              <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5">
                <Badge className="border-0 bg-black/75 font-mono text-[11px] text-white">
                  {item.airTime} {TIMEZONE_CONFIG.defaultShortLabel}
                </Badge>
              </div>

              {/* Status pill top-right */}
              <div className="absolute top-2 right-2 z-10">
                {isAiringNow ? (
                  <Badge className="animate-pulse gap-1 bg-emerald-500 text-[10px] font-bold text-white">
                    <Radio className="h-3 w-3" />
                    LIVE
                  </Badge>
                ) : (
                  <Badge
                    variant="secondary"
                    className="border-0 bg-black/60 text-[10px] font-medium text-white backdrop-blur-xs"
                  >
                    Ep {item.episodeNumber}
                  </Badge>
                )}
              </div>

              {/* Play button hover overlay */}
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="bg-primary/90 text-primary-foreground flex size-10 items-center justify-center rounded-full shadow-xs">
                  <Play className="ml-0.5 h-4 w-4 fill-current" />
                </div>
              </div>

              {/* Bottom overlay: title & sub/dub */}
              <div className="absolute right-2.5 bottom-2.5 left-2.5 z-10 flex items-end justify-between gap-2 text-white">
                <div className="min-w-0">
                  <h4 className="line-clamp-1 text-sm font-bold drop-shadow-sm">{item.title}</h4>
                  <p className="text-[11px] text-zinc-300 drop-shadow-sm">{item.studio}</p>
                </div>
                <Badge
                  variant="secondary"
                  className="shrink-0 border-0 bg-black/60 text-[10px] font-bold text-white"
                >
                  {item.subOrDub}
                </Badge>
              </div>
            </Link>

            {/* Content info bottom card */}
            <div className="flex flex-1 flex-col justify-between p-3.5">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Episode {item.episodeNumber}</span>
                  <div className="flex items-center gap-1 font-semibold text-amber-500">
                    <Star className="h-3.5 w-3.5 fill-amber-500 stroke-amber-500" />
                    <span>{item.rating ? item.rating.toFixed(2) : "N/A"}</span>
                  </div>
                </div>

                {isUpcoming && item.countdownText && (
                  <div className="bg-muted/50 text-muted-foreground flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs">
                    <Clock className="text-primary h-3.5 w-3.5" />
                    <span>Air in: {item.countdownText}</span>
                  </div>
                )}
              </div>

              <div className="border-border/40 mt-3 border-t pt-3">
                <Link
                  to={`/anime/${item.slug}/${item.episodeNumber}`}
                  className={buttonVariants({
                    variant: isAiringNow ? "default" : "outline",
                    size: "sm",
                    className: "w-full gap-1.5 text-xs font-semibold",
                  })}
                >
                  <Play className="h-3 w-3 fill-current" />
                  <span>Watch Episode {item.episodeNumber}</span>
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
