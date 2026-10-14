import { Link } from "react-router";
import { Play, Clock, CheckCircle2, Star, Radio } from "lucide-react";
import { Badge } from "@goxstream/ui/components/badge";
import { buttonVariants } from "@goxstream/ui/components/button";
import { TIMEZONE_CONFIG } from "@/lib/constants";
import { getImageStyle } from "@/lib/utils";
import type { ScheduleItem } from "@/types/schedule";

interface TimelineViewProps {
  items: ScheduleItem[];
  dayLabel: string;
}

export function TimelineView({ items, dayLabel }: TimelineViewProps) {
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
    <div className="before:bg-border/60 relative space-y-6 pl-4 before:absolute before:top-3 before:bottom-3 before:left-2 before:w-0.5 md:pl-8 md:before:left-4">
      {items.map((item) => {
        const isAiringNow = item.status === "airing_now";
        const isUpcoming = item.status === "upcoming";
        const isAired = item.status === "aired";
        const isGradient = item.coverImage && item.coverImage.startsWith("linear-gradient");

        return (
          <div key={item.id} className="group relative">
            {/* Timeline node icon */}
            <div className="bg-background border-border absolute top-4 -left-4 z-10 flex h-5 w-5 -translate-x-1/2 items-center justify-center rounded-full border shadow-xs md:-left-8 md:h-6 md:w-6">
              {isAiringNow && (
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500"></span>
                </span>
              )}
              {isUpcoming && <Clock className="text-primary h-3.5 w-3.5" />}
              {isAired && <CheckCircle2 className="text-muted-foreground h-3.5 w-3.5" />}
            </div>

            {/* Main card */}
            <div className="border-border/60 bg-card/60 hover:bg-card/90 hover:border-border rounded-xl border p-4 shadow-xs transition-all duration-200 md:p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                {/* Anime cover thumbnail */}
                <Link
                  to={`/anime/${item.slug}`}
                  className="border-border/40 group/cover bg-muted relative aspect-2/3 w-24 shrink-0 overflow-hidden rounded-lg border sm:w-28"
                >
                  {isGradient ? (
                    <div
                      className="absolute inset-0 transition-transform duration-300 group-hover/cover:scale-105"
                      style={getImageStyle(item.coverImage)}
                    />
                  ) : (
                    <img
                      src={item.coverImage || ""}
                      alt={item.title}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 size-full object-cover transition-transform duration-300 group-hover/cover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.opacity = "0";
                      }}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Episode pill */}
                  <div className="absolute top-1.5 left-1.5 z-10">
                    <Badge className="border-0 bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white">
                      Ep {item.episodeNumber}
                    </Badge>
                  </div>

                  {/* Play icon hover overlay */}
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover/cover:opacity-100">
                    <Play className="h-6 w-6 fill-white text-white" />
                  </div>
                </Link>

                {/* Info & Metadata */}
                <div className="flex min-w-0 flex-1 flex-col justify-between self-stretch">
                  <div>
                    {/* Time & Status Row */}
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <Badge
                        variant="outline"
                        className="bg-background/80 font-mono text-xs font-semibold"
                      >
                        {item.airTime} {TIMEZONE_CONFIG.defaultShortLabel}
                      </Badge>

                      {isAiringNow && (
                        <Badge className="animate-pulse gap-1 border border-emerald-500/30 bg-emerald-500/15 text-[11px] font-bold text-emerald-500">
                          <Radio className="h-3 w-3" />
                          <span>AIRING NOW</span>
                        </Badge>
                      )}

                      {isUpcoming && item.countdownText && (
                        <Badge
                          variant="secondary"
                          className="text-primary bg-primary/10 border-primary/20 gap-1 text-xs"
                        >
                          <Clock className="h-3 w-3" />
                          <span>{item.countdownText}</span>
                        </Badge>
                      )}

                      {isAired && (
                        <Badge
                          variant="outline"
                          className="text-muted-foreground border-border/60 text-xs"
                        >
                          Released
                        </Badge>
                      )}

                      <Badge
                        variant="secondary"
                        className="text-[10px] font-semibold tracking-wider uppercase"
                      >
                        {item.subOrDub}
                      </Badge>
                    </div>

                    {/* Anime Title */}
                    <Link
                      to={`/anime/${item.slug}`}
                      className="group-hover:text-primary inline-block transition-colors"
                    >
                      <h3 className="text-foreground line-clamp-1 text-base leading-snug font-bold md:text-lg">
                        {item.title}
                      </h3>
                    </Link>

                    {item.japaneseTitle && (
                      <p className="text-muted-foreground/80 mb-2 line-clamp-1 text-xs">
                        {item.japaneseTitle}
                      </p>
                    )}

                    {/* Studio, Rating & Season info */}
                    <div className="text-muted-foreground mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                      <span className="text-foreground font-medium">{item.studio}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-semibold text-amber-400">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        {item.rating ? item.rating.toFixed(2) : "N/A"}
                      </span>
                      <span>•</span>
                      <span>
                        {item.season} {item.year}
                      </span>
                    </div>

                    {/* Genres */}
                    <div className="flex flex-wrap gap-1.5">
                      {item.genres.map((genre) => (
                        <Badge
                          key={genre}
                          variant="secondary"
                          className="bg-muted/60 text-muted-foreground px-2 py-0.5 text-[10px]"
                        >
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Quick Action */}
                  <div className="border-border/40 mt-4 flex items-center justify-between border-t pt-3">
                    <span className="text-muted-foreground text-xs">
                      Episode {item.episodeNumber} Simulcast Release
                    </span>
                    <Link
                      to={`/anime/${item.slug}/${item.episodeNumber}`}
                      className={buttonVariants({
                        variant: "default",
                        size: "sm",
                        className: "h-8 gap-1.5 text-xs font-semibold",
                      })}
                    >
                      <Play className="h-3.5 w-3.5 fill-current" />
                      <span>Watch Episode {item.episodeNumber}</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
