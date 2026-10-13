"use client";

export function TrendingHeader() {
  return (
    <div className="space-y-2">
      <h1 className="text-foreground flex items-center gap-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
        Anime Trending Rankings
        <span className="bg-primary/10 text-primary rounded-full px-2.5 py-1 text-xs font-semibold tracking-wider uppercase">
          Live Leaderboard
        </span>
      </h1>
      <p className="text-muted-foreground max-w-3xl text-sm sm:text-base">
        Track real-time weekly simulcast popularity, monthly hyped titles, and all-time top
        streaming hits filtered by your favorite genres.
      </p>
    </div>
  );
}
