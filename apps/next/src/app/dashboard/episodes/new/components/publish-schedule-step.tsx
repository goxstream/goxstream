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
    <div className="bg-card border-border/60 min-w-0 space-y-6 rounded-xl border p-4 sm:p-6">
      <div className="border-border/60 border-b pb-3">
        <h3 className="text-foreground text-base font-semibold">Publishing & Notifications</h3>
        <p className="text-muted-foreground mt-0.5 text-xs">
          Select release status and configure push notifications for mobile & web apps.
        </p>
      </div>

      <div className="min-w-0 space-y-4">
        <Label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
          Publication Status
        </Label>

        <RadioGroup
          value={status}
          onValueChange={(val) => onStatusChange(val as EpisodeStatus)}
          className="grid min-w-0 gap-3 sm:grid-cols-3"
        >
          {/* Published */}
          <label
            htmlFor="status-published"
            className={`flex min-w-0 cursor-pointer flex-col justify-between rounded-xl border p-4 transition-all ${
              status === "published"
                ? "border-emerald-500 bg-emerald-500/5 ring-1 ring-emerald-500"
                : "border-border/60 bg-muted/20 hover:border-border"
            }`}
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="flex min-w-0 items-center gap-2">
                <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
                <span className="text-foreground truncate text-sm font-semibold">Publish Now</span>
              </div>
              <RadioGroupItem value="published" id="status-published" className="shrink-0" />
            </div>
            <p className="text-muted-foreground text-xs">
              Make episode available to viewers immediately upon saving.
            </p>
          </label>

          {/* Scheduled */}
          <label
            htmlFor="status-scheduled"
            className={`flex min-w-0 cursor-pointer flex-col justify-between rounded-xl border p-4 transition-all ${
              status === "scheduled"
                ? "border-sky-500 bg-sky-500/5 ring-1 ring-sky-500"
                : "border-border/60 bg-muted/20 hover:border-border"
            }`}
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="flex min-w-0 items-center gap-2">
                <Clock className="size-4 shrink-0 text-sky-500" />
                <span className="text-foreground truncate text-sm font-semibold">
                  Schedule Release
                </span>
              </div>
              <RadioGroupItem value="scheduled" id="status-scheduled" className="shrink-0" />
            </div>
            <p className="text-muted-foreground text-xs">
              Auto-release episode on the specified airing date/time.
            </p>
          </label>

          {/* Draft */}
          <label
            htmlFor="status-draft"
            className={`flex min-w-0 cursor-pointer flex-col justify-between rounded-xl border p-4 transition-all ${
              status === "draft"
                ? "border-primary bg-primary/5 ring-primary ring-1"
                : "border-border/60 bg-muted/20 hover:border-border"
            }`}
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="flex min-w-0 items-center gap-2">
                <FileText className="text-primary size-4 shrink-0" />
                <span className="text-foreground truncate text-sm font-semibold">
                  Save as Draft
                </span>
              </div>
              <RadioGroupItem value="draft" id="status-draft" className="shrink-0" />
            </div>
            <p className="text-muted-foreground text-xs">
              Keep hidden for internal review and video stream encoding.
            </p>
          </label>
        </RadioGroup>
      </div>

      {/* Push Notification Toggle */}
      <div className="border-border/60 bg-muted/20 flex min-w-0 flex-col justify-between gap-4 rounded-xl border p-4 sm:flex-row sm:items-center">
        <div className="flex min-w-0 items-start gap-3">
          <div className="bg-primary/10 text-primary mt-0.5 shrink-0 rounded-lg p-2">
            <Bell className="size-5" />
          </div>
          <div className="min-w-0">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <span className="text-foreground truncate text-sm font-semibold">
                Push Notification to Watchlist Followers
              </span>
              <Badge variant="outline" className="shrink-0 text-[10px]">
                Recommended
              </Badge>
            </div>
            <p className="text-muted-foreground mt-0.5 text-xs">
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
