"use client";

import Link from "next/link";
import { Bookmark, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WatchlistHeader } from "./watchlist-header";
import { WatchlistGridItem } from "./watchlist-grid-item";
import { WatchlistListItem } from "./watchlist-list-item";
import { useWatchlist } from "../hooks/use-watchlist";
import { WATCHLIST_TABS } from "../constants";

export function WatchlistClientPage() {
  const {
    items,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    handleStatusChange,
    handleToggleFavorite,
    handleRemove,
    getItemCount,
  } = useWatchlist();

  return (
    <div className="space-y-6">
      <WatchlistHeader viewMode={viewMode} onViewModeChange={setViewMode} />

      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <Tabs
          value={activeTab}
          onValueChange={(v: any) => setActiveTab(v)}
          className="w-full lg:w-auto"
        >
          <TabsList className="bg-card border-border/60 flex h-auto flex-wrap gap-1 rounded-xl border p-1">
            {WATCHLIST_TABS.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="data-active:bg-primary data-active:text-primary-foreground cursor-pointer gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all"
              >
                {tab.label}
                <Badge
                  variant="outline"
                  className="h-4 border-current px-1.5 py-0 text-[10px] opacity-80"
                >
                  {getItemCount(tab.value)}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="relative w-full lg:w-72">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            placeholder="Search watchlist..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-card border-border/60 h-9 rounded-xl pl-9 text-xs"
          />
        </div>
      </div>

      {items.length === 0 ? (
        <div className="border-border/70 bg-card/50 flex flex-col items-center gap-3 rounded-2xl border border-dashed p-12 text-center">
          <Bookmark className="text-muted-foreground/40 size-10" />
          <h3 className="text-foreground text-base font-semibold">No Titles Found</h3>
          <p className="text-muted-foreground max-w-sm text-xs">
            There are no anime titles matching your current filter criteria.
          </p>
          <Link
            href="/browse"
            className="bg-primary text-primary-foreground hover:bg-primary/90 mt-2 inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold shadow-xs transition-colors"
          >
            Explore Browse Catalog
          </Link>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <WatchlistGridItem
              key={item.id}
              item={item}
              onStatusChange={handleStatusChange}
              onToggleFavorite={handleToggleFavorite}
              onRemove={handleRemove}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((item) => (
            <WatchlistListItem
              key={item.id}
              item={item}
              onToggleFavorite={handleToggleFavorite}
              onRemove={handleRemove}
            />
          ))}
        </div>
      )}
    </div>
  );
}
