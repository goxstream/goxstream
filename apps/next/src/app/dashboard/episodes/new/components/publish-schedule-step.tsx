"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, FileText, Bell } from "lucide-react";
import type { EpisodeStatus } from "../types";

interface PublishScheduleStepProps {
  status: EpisodeStatus;
  notifySubscribers: boolean;
  onStatusChange: (val: EpisodeStatus) => void;
  onNotifyChange: (val: boolean) => void;
}

export function PublishScheduleStep({
  status,
  notifySubscribers,
  onStatusChange,
  onNotifyChange,
}: PublishScheduleStepProps) {
  return (
    <div className="space-y-6 bg-card p-4 sm:p-6 rounded-xl border border-border/60 min-w-0">
      <div className="border-b border-border/60 pb-3">
        <h3 className="text-base font-semibold text-foreground">Publishing & Notifications</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Select release status and configure push notifications for mobile & web apps.
        </p>
      </div>

      <div className="space-y-4 min-w-0">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Publication Status
        </Label>

        <RadioGroup
          value={status}
          onValueChange={(val) => onStatusChange(val as EpisodeStatus)}
          className="grid gap-3 sm:grid-cols-3 min-w-0"
        >
          {/* Published */}
          <label
            htmlFor="status-published"
            className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between min-w-0 ${
              status === "published"
                ? "border-emerald-500 bg-emerald-500/5 ring-1 ring-emerald-500"
                : "border-border/60 bg-muted/20 hover:border-border"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 min-w-0">
                <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                <span className="font-semibold text-sm text-foreground truncate">Publish Now</span>
              </div>
              <RadioGroupItem value="published" id="status-published" className="shrink-0" />
            </div>
            <p className="text-xs text-muted-foreground">
              Make episode available to viewers immediately upon saving.
            </p>
          </label>

          {/* Scheduled */}
          <label
            htmlFor="status-scheduled"
            className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between min-w-0 ${
              status === "scheduled"
                ? "border-sky-500 bg-sky-500/5 ring-1 ring-sky-500"
                : "border-border/60 bg-muted/20 hover:border-border"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 min-w-0">
                <Clock className="size-4 text-sky-500 shrink-0" />
                <span className="font-semibold text-sm text-foreground truncate">Schedule Release</span>
              </div>
              <RadioGroupItem value="scheduled" id="status-scheduled" className="shrink-0" />
            </div>
            <p className="text-xs text-muted-foreground">
              Auto-release episode on the specified airing date/time.
            </p>
          </label>

          {/* Draft */}
          <label
            htmlFor="status-draft"
            className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between min-w-0 ${
              status === "draft"
                ? "border-primary bg-primary/5 ring-1 ring-primary"
                : "border-border/60 bg-muted/20 hover:border-border"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="size-4 text-primary shrink-0" />
                <span className="font-semibold text-sm text-foreground truncate">Save as Draft</span>
              </div>
              <RadioGroupItem value="draft" id="status-draft" className="shrink-0" />
            </div>
            <p className="text-xs text-muted-foreground">
              Keep hidden for internal review and video stream encoding.
            </p>
          </label>
        </RadioGroup>
      </div>

      {/* Push Notification Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-border/60 bg-muted/20 min-w-0">
        <div className="flex items-start gap-3 min-w-0">
          <div className="p-2 rounded-lg bg-primary/10 text-primary mt-0.5 shrink-0">
            <Bell className="size-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap min-w-0">
              <span className="text-sm font-semibold text-foreground truncate">
                Push Notification to Watchlist Followers
              </span>
              <Badge variant="outline" className="text-[10px] shrink-0">Recommended</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Send instant mobile & browser notifications to users following this anime series.
            </p>
          </div>
        </div>
        <Switch
          checked={notifySubscribers}
          onCheckedChange={onNotifyChange}
          className="shrink-0 self-end sm:self-center"
        />
      </div>
    </div>
  );
}
