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

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)} className="w-full lg:w-auto">
          <TabsList className="bg-card border border-border/60 p-1 rounded-xl h-auto flex flex-wrap gap-1">
            {WATCHLIST_TABS.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="px-3 py-1.5 text-xs font-medium rounded-lg data-active:bg-primary data-active:text-primary-foreground transition-all gap-1.5 cursor-pointer"
              >
                {tab.label}
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 border-current opacity-80">
                  {getItemCount(tab.value)}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

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

      {items.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-border/70 rounded-2xl bg-card/50 flex flex-col items-center gap-3">
          <Bookmark className="size-10 text-muted-foreground/40" />
          <h3 className="font-semibold text-base text-foreground">No Titles Found</h3>
          <p className="text-xs text-muted-foreground max-w-sm">
            There are no anime titles matching your current filter criteria.
          </p>
          <Link
            href="/browse"
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-xl shadow-xs hover:bg-primary/90 transition-colors cursor-pointer"
          >
            Explore Browse Catalog
          </Link>

        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
