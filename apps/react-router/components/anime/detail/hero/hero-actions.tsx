import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Play, Bookmark, BookmarkCheck, Share2, Check } from "lucide-react";
import { Skeleton } from "@goxstream/ui/components/skeleton";
import { Button, buttonVariants } from "@goxstream/ui/components/button";

interface HeroActionsProps {
  slug?: string;
  latestEpisodeNum?: number;
  isLoading?: boolean;
}

export function HeroActions({ slug, latestEpisodeNum, isLoading }: HeroActionsProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);

  // Initialize favorite status from localStorage
  useEffect(() => {
    if (!slug || typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("goxstream_favorites");
      if (stored) {
        const favs: string[] = JSON.parse(stored);
        if (Array.isArray(favs) && favs.includes(slug)) {
          setIsBookmarked(true);
        }
      }
    } catch {
      // Ignore localStorage errors
    }
  }, [slug]);

  const handleToggleFavorite = () => {
    if (!slug) return;
    const nextState = !isBookmarked;
    setIsBookmarked(nextState);

    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("goxstream_favorites");
        let favs: string[] = stored ? JSON.parse(stored) : [];
        if (!Array.isArray(favs)) favs = [];

        if (nextState) {
          if (!favs.includes(slug)) favs.push(slug);
        } else {
          favs = favs.filter((s) => s !== slug);
        }
        localStorage.setItem("goxstream_favorites", JSON.stringify(favs));
      } catch {
        // Ignore localStorage errors
      }
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading || !slug) {
    return (
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <Skeleton className="h-11 w-44 rounded-lg" />
        <Skeleton className="h-11 w-[165px] rounded-lg" />
        <Skeleton className="h-11 w-[135px] rounded-lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3 pt-2">
      <Link
        to={`/anime/${slug}/${latestEpisodeNum || 1}`}
        className={buttonVariants({ size: "lg", className: "gap-2 font-semibold shadow-xs" })}
      >
        <Play className="fill-primary-foreground size-4" />
        <span>Watch Episode {latestEpisodeNum || 1}</span>
      </Link>

      <Button
        variant={isBookmarked ? "secondary" : "outline"}
        size="lg"
        onClick={handleToggleFavorite}
        className="border-border/80 w-[165px] min-w-[165px] justify-center gap-2 font-medium"
      >
        {isBookmarked ? (
          <>
            <BookmarkCheck className="size-4 shrink-0 text-emerald-500" />
            <span>Favorited</span>
          </>
        ) : (
          <>
            <Bookmark className="size-4 shrink-0" />
            <span>Add to Favorites</span>
          </>
        )}
      </Button>

      <Button
        variant="outline"
        size="lg"
        onClick={handleShare}
        className="border-border/80 w-[135px] min-w-[135px] justify-center gap-2 font-medium"
      >
        {copied ? (
          <>
            <Check className="size-4 shrink-0 text-emerald-500" />
            <span>Link Copied</span>
          </>
        ) : (
          <>
            <Share2 className="size-4 shrink-0" />
            <span>Share</span>
          </>
        )}
      </Button>
    </div>
  );
}
