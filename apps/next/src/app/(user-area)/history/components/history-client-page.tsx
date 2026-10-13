"use client";

import Link from "next/link";
import { History } from "lucide-react";
import { HistoryTimelineItem } from "./history-timeline-item";
import { ClearHistoryDialog } from "./clear-history-dialog";
import { useHistory } from "../hooks/use-history";

export function HistoryClientPage() {
  const { historyList, handleRemoveItem, handleClearAll } = useHistory();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="border-border/60 from-card via-card to-primary/5 flex flex-col justify-between gap-4 rounded-2xl border bg-gradient-to-r p-6 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3.5">
          <div className="bg-primary/10 border-primary/20 text-primary flex size-12 items-center justify-center rounded-xl border">
            <History className="size-6" />
          </div>
          <div>
            <h1 className="text-foreground text-2xl font-extrabold tracking-tight">
              Watch History & Progress
            </h1>
            <p className="text-muted-foreground mt-0.5 text-xs">
              Resume watching where you left off or clear your past streaming logs.
            </p>
          </div>
        </div>

        {historyList.length > 0 && <ClearHistoryDialog onConfirmClear={handleClearAll} />}
      </div>

      {historyList.length === 0 ? (
        <div className="border-border/70 bg-card/50 flex flex-col items-center gap-3 rounded-2xl border border-dashed p-12 text-center">
          <History className="text-muted-foreground/40 size-10" />
          <h3 className="text-foreground text-base font-semibold">Your History is Empty</h3>
          <p className="text-muted-foreground max-w-sm text-xs">
            You haven't watched any anime episodes yet. Episodes you stream will automatically
            appear here.
          </p>
          <Link
            href="/trending"
            className="bg-primary text-primary-foreground hover:bg-primary/90 mt-2 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold shadow-xs transition-colors"
          >
            Explore Trending Anime
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {historyList.map((item) => (
            <HistoryTimelineItem key={item.id} item={item} onRemove={handleRemoveItem} />
          ))}
        </div>
      )}
    </div>
  );
}
