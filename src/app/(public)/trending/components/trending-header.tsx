"use client";

export function TrendingHeader() {
  return (
    <div className="space-y-2">
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
        Anime Trending Rankings
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary uppercase tracking-wider">
          Live Leaderboard
        </span>
      </h1>
      <p className="text-sm sm:text-base text-muted-foreground max-w-3xl">
        Track real-time weekly simulcast popularity, monthly hyped titles, and all-time top streaming hits filtered by your favorite genres.
      </p>
    </div>
  );
}
