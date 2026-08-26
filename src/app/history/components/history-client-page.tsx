"use client";

import { useState } from "react";
import Link from "next/link";
import { History, Play, Trash2, Clock, CheckCircle2, RotateCcw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MOCK_WATCH_HISTORY } from "@/lib/mock-user";
import type { WatchHistoryItem } from "@/types/user";

export function HistoryClientPage() {
  const [historyList, setHistoryList] = useState<WatchHistoryItem[]>(MOCK_WATCH_HISTORY);

  const handleRemoveItem = (id: string) => {
    setHistoryList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAll = () => {
    setHistoryList([]);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl border border-border/60 bg-gradient-to-r from-card via-card to-primary/5">
        <div className="flex items-center gap-3.5">
          <div className="size-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <History className="size-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
              Watch History & Progress
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Resume watching where you left off or clear your past streaming logs.
            </p>
          </div>
        </div>

        {historyList.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger render={<Button variant="outline" size="sm" className="rounded-xl text-xs gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20 self-start sm:self-auto" />}>
              <Trash2 className="size-3.5" />
              Clear History
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-popover border border-border/80 rounded-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2 text-foreground">
                  <AlertTriangle className="size-5 text-amber-500" />
                  Clear Entire Watch History?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-xs text-muted-foreground">
                  This action cannot be undone. All your saved watch positions and timestamp history will be permanently cleared.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="mt-4">
                <AlertDialogCancel className="rounded-xl text-xs">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleClearAll}
                  className="rounded-xl text-xs bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Confirm Clear
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {/* History Timeline */}
      {historyList.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-border/70 rounded-2xl bg-card/50 flex flex-col items-center gap-3">
          <History className="size-10 text-muted-foreground/40" />
          <h3 className="font-semibold text-base text-foreground">Your History is Empty</h3>
          <p className="text-xs text-muted-foreground max-w-sm">
            You haven't watched any anime episodes yet. Episodes you stream will automatically appear here with progress tracking.
          </p>
          <Link
            href="/trending"
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-xl shadow-xs hover:bg-primary/90 transition-colors"
          >
            Explore Trending Anime
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {historyList.map((item) => (
            <div
              key={item.id}
              className="group p-4 rounded-xl border border-border/60 bg-card hover:border-primary/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
            >
              <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
                {/* Poster / Cover */}
                <div
                  className="h-20 w-32 rounded-lg shrink-0 overflow-hidden relative shadow-xs flex items-center justify-center text-white"
                  style={{ background: item.animeCover }}
                >
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                  <Link
                    href={`/anime/${item.animeSlug}/${item.episodeNumber}`}
                    className="size-9 rounded-full bg-primary/90 hover:scale-110 transition-transform flex items-center justify-center text-primary-foreground relative z-10 shadow-md"
                  >
                    <Play className="size-4 fill-primary-foreground ml-0.5" />
                  </Link>

                  {/* Progress Indicator Tag */}
                  <div className="absolute bottom-1 right-1 bg-black/80 backdrop-blur-xs text-[9px] px-1.5 py-0.5 rounded font-mono font-bold text-white z-10">
                    {item.progressPercent}%
                  </div>
                </div>

                {/* Episode Details */}
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link
                      href={`/anime/${item.animeSlug}`}
                      className="font-bold text-sm text-foreground hover:text-primary transition-colors truncate"
                    >
                      {item.animeTitle}
                    </Link>
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 font-mono">
                      Ep. {item.episodeNumber}
                    </Badge>
                  </div>

                  <span className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                    {item.episodeTitle}
                  </span>

                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-2">
                    <span className="flex items-center gap-1">
                      <Clock className="size-3 text-muted-foreground/70" />
                      {item.lastWatchedAt}
                    </span>
                    <span>•</span>
                    <span className="font-mono text-foreground/80">
                      {Math.floor(item.watchedSeconds / 60)}m / {Math.floor(item.durationSeconds / 60)}m
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full max-w-md mt-2">
                    <Progress value={item.progressPercent} className="h-1.5 bg-muted" />
                  </div>
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <Link
                  href={`/anime/${item.animeSlug}/${item.episodeNumber}`}
                  className="px-3 py-1.5 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="size-3.5" />
                  Resume Ep. {item.episodeNumber}
                </Link>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => handleRemoveItem(item.id)}
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl"
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
