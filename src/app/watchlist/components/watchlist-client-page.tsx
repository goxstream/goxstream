"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bookmark,
  Search,
  Filter,
  Grid,
  List,
  Star,
  Play,
  Trash2,
  CheckCircle2,
  Clock,
  ChevronDown,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MOCK_WATCHLIST } from "@/lib/mock-user";
import type { WatchlistItem, WatchlistStatus } from "@/types/user";

const STATUS_TABS: { label: string; value: string; count?: number }[] = [
  { label: "All Titles", value: "all" },
  { label: "Watching", value: "watching" },
  { label: "Plan to Watch", value: "plan_to_watch" },
  { label: "Completed", value: "completed" },
  { label: "Favorites Only", value: "favorites" },
];

export function WatchlistClientPage() {
  const [items, setItems] = useState<WatchlistItem[]>(MOCK_WATCHLIST);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const handleStatusChange = (id: string, newStatus: WatchlistStatus) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
  };

  const handleToggleFavorite = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  const handleRemove = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Filter items based on activeTab and searchQuery
  const filteredItems = items.filter((item) => {
    if (activeTab === "favorites") {
      if (!item.isFavorite) return false;
    } else if (activeTab !== "all") {
      if (item.status !== activeTab) return false;
    }

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      return (
        item.anime.title.toLowerCase().includes(q) ||
        item.anime.genres.some((g) => g.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl border border-border/60 bg-gradient-to-r from-card via-card to-primary/5">
        <div className="flex items-center gap-3.5">
          <div className="size-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Bookmark className="size-6 fill-primary/20" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
              My Watchlist Library
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Manage your saved series, track episode progress, and organize favorites.
            </p>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-muted/60 p-1 rounded-xl border border-border/60">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="icon-sm"
            onClick={() => setViewMode("grid")}
            className="rounded-lg"
          >
            <Grid className="size-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="icon-sm"
            onClick={() => setViewMode("list")}
            className="rounded-lg"
          >
            <List className="size-4" />
          </Button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Tabs */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full lg:w-auto">
          <TabsList className="bg-card border border-border/60 p-1 rounded-xl h-auto flex flex-wrap gap-1">
            {STATUS_TABS.map((tab) => {
              const count =
                tab.value === "all"
                  ? items.length
                  : tab.value === "favorites"
                  ? items.filter((i) => i.isFavorite).length
                  : items.filter((i) => i.status === tab.value).length;

              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all gap-1.5"
                >
                  {tab.label}
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 border-current opacity-80">
                    {count}
                  </Badge>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>

        {/* Search */}
        <div className="relative w-full lg:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search watchlist..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs rounded-xl bg-card border-border/60 h-9"
          />
        </div>
      </div>

      {/* Content Display */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-border/70 rounded-2xl bg-card/50 flex flex-col items-center gap-3">
          <Bookmark className="size-10 text-muted-foreground/40" />
          <h3 className="font-semibold text-base text-foreground">No Titles Found</h3>
          <p className="text-xs text-muted-foreground max-w-sm">
            There are no anime titles matching your current filter criteria. Browse anime to add to your library!
          </p>
          <Link
            href="/browse"
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-xl shadow-xs hover:bg-primary/90 transition-colors"
          >
            Explore Browse Catalog
          </Link>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group rounded-xl border border-border/60 bg-card overflow-hidden hover:border-primary/40 transition-all flex flex-col justify-between shadow-xs"
            >
              {/* Anime Card Top */}
              <div className="relative h-44 w-full overflow-hidden" style={{ background: item.anime.coverImage }}>
                <div className="absolute inset-0 bg-gradient-to-t from-card via-black/30 to-black/10" />

                {/* Status Badge */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
                  <Badge
                    variant="secondary"
                    className="capitalize text-[10px] px-2 py-0.5 font-bold bg-background/80 backdrop-blur-md border border-border/50 text-foreground"
                  >
                    {item.status.replace("_", " ")}
                  </Badge>
                </div>

                {/* Favorite Button */}
                <button
                  onClick={() => handleToggleFavorite(item.id)}
                  className="absolute top-2.5 right-2.5 size-7 rounded-lg bg-background/80 backdrop-blur-md border border-border/50 flex items-center justify-center text-amber-500 hover:scale-110 transition-transform z-10"
                >
                  <Star className={`size-3.5 ${item.isFavorite ? "fill-amber-500" : ""}`} />
                </button>

                {/* Play Action Overlay */}
                <Link
                  href={`/anime/${item.anime.slug}`}
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 backdrop-blur-xs transition-opacity z-0"
                >
                  <div className="size-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg transform group-hover:scale-105 transition-transform">
                    <Play className="size-5 fill-primary-foreground ml-0.5" />
                  </div>
                </Link>
              </div>

              {/* Anime Card Content */}
              <div className="p-4 flex flex-col gap-3 flex-1">
                <div>
                  <Link
                    href={`/anime/${item.anime.slug}`}
                    className="font-bold text-sm text-foreground hover:text-primary transition-colors line-clamp-1 block"
                  >
                    {item.anime.title}
                  </Link>
                  <span className="text-[11px] text-muted-foreground block mt-0.5">
                    {item.anime.genres.slice(0, 3).join(" • ")}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-medium">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="text-foreground font-mono">
                      Ep. {item.currentEpisode} / {item.totalEpisodes}
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{
                        width: `${Math.min(
                          100,
                          (item.currentEpisode / (item.totalEpisodes || 1)) * 100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs mt-auto">
                  {/* Status Selector Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger render={<button className="flex items-center gap-1 font-medium text-muted-foreground hover:text-foreground text-[11px] px-2 py-1 rounded-md hover:bg-muted/60" />}>
                      <span className="capitalize">{item.status.replace("_", " ")}</span>
                      <ChevronDown className="size-3" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-36 bg-popover/95 backdrop-blur-md border border-border/80 p-1 text-xs">
                      <DropdownMenuItem onClick={() => handleStatusChange(item.id, "watching")}>
                        Watching
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(item.id, "plan_to_watch")}>
                        Plan to Watch
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(item.id, "completed")}>
                        Completed
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(item.id, "on_hold")}>
                        On Hold
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(item.id, "dropped")}>
                        Dropped
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Remove Button */}
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => handleRemove(item.id)}
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="flex flex-col gap-2">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-xl border border-border/60 bg-card hover:border-primary/40 transition-colors flex items-center justify-between gap-4 shadow-xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="size-14 rounded-lg shrink-0 overflow-hidden relative"
                  style={{ background: item.anime.coverImage }}
                />
                <div className="flex flex-col min-w-0">
                  <Link
                    href={`/anime/${item.anime.slug}`}
                    className="font-bold text-sm text-foreground hover:text-primary transition-colors truncate"
                  >
                    {item.anime.title}
                  </Link>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                    <span>{item.anime.type}</span>
                    <span>•</span>
                    <span className="capitalize">{item.status.replace("_", " ")}</span>
                    <span>•</span>
                    <span className="font-mono">
                      Ep. {item.currentEpisode}/{item.totalEpisodes}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleToggleFavorite(item.id)}
                  className="p-2 rounded-lg text-amber-500 hover:bg-amber-500/10"
                >
                  <Star className={`size-4 ${item.isFavorite ? "fill-amber-500" : ""}`} />
                </button>
                <Link
                  href={`/anime/${item.anime.slug}`}
                  className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 flex items-center gap-1.5"
                >
                  <Play className="size-3 fill-primary-foreground" />
                  Watch
                </Link>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => handleRemove(item.id)}
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
