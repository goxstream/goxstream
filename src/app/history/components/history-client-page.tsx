"use client";

import Link from "next/link";
import { History } from "lucide-react";
import { HistoryTimelineItem } from "./history-timeline-item";
import { ClearHistoryDialog } from "./clear-history-dialog";
import { useHistory } from "../hooks/use-history";

export function HistoryClientPage() {
  const { historyList, handleRemoveItem, handleClearAll } = useHistory();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
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

        {historyList.length > 0 && <ClearHistoryDialog onConfirmClear={handleClearAll} />}
      </div>

      {historyList.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-border/70 rounded-2xl bg-card/50 flex flex-col items-center gap-3">
          <History className="size-10 text-muted-foreground/40" />
          <h3 className="font-semibold text-base text-foreground">Your History is Empty</h3>
          <p className="text-xs text-muted-foreground max-w-sm">
            You haven't watched any anime episodes yet. Episodes you stream will automatically appear here.
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
            <HistoryTimelineItem key={item.id} item={item} onRemove={handleRemoveItem} />
          ))}
        </div>
      )}
    </div>
  );
}
