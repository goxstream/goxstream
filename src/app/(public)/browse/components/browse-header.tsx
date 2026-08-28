"use client";

export function BrowseHeader() {
  return (
    <div className="space-y-2">
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
        Browse Anime Catalog
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary uppercase tracking-wider">
          Library
        </span>
      </h1>
      <p className="text-sm sm:text-base text-muted-foreground max-w-3xl">
        Filter through thousands of streaming titles by genre, release format, audio dubbing, season, and release year.
      </p>
    </div>
  );
}
