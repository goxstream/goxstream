import Link from "next/link";
import { Compass, Sparkles, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function BrowseHeader() {
  return (
    <section className="relative border-b border-border/60 bg-gradient-to-b from-muted/50 via-background to-background py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="size-3 text-muted-foreground/60" />
          <span className="text-foreground font-medium">Browse Anime</span>
        </nav>

        {/* Header Title & Subtitle */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs font-semibold px-2.5 py-0.5">
                <Compass className="size-3.5 mr-1" /> Complete Library
              </Badge>
              <Badge variant="outline" className="text-muted-foreground text-xs font-normal">
                <Sparkles className="size-3 mr-1 text-amber-500" /> Updated Daily
              </Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Browse Anime Directory
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Explore thousands of anime series, movies, and OVAs. Filter by genre, format, release year, or search by title.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
