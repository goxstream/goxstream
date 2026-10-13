"use client";

export function BrowseHeader() {
  return (
    <div className="space-y-2">
      <h1 className="text-foreground flex items-center gap-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
        Browse Anime Catalog
        <span className="bg-primary/10 text-primary rounded-full px-2.5 py-1 text-xs font-semibold tracking-wider uppercase">
          Library
        </span>
      </h1>
      <p className="text-muted-foreground max-w-3xl text-sm sm:text-base">
        Filter through thousands of streaming titles by genre, release format, audio dubbing,
        season, and release year.
      </p>
    </div>
  );
}
