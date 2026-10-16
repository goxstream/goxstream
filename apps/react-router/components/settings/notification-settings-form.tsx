"use client";

import { Bell, Save } from "lucide-react";
import { Button } from "@goxstream/ui/components/button";
import { Switch } from "@goxstream/ui/components/switch";
import type { UserSettings } from "@/types/user";

interface NotificationSettingsFormProps {
  settings: UserSettings;
  setSettings: React.Dispatch<React.SetStateAction<UserSettings>>;
  onSave: (e: React.FormEvent) => void;
}

export function NotificationSettingsForm({
  settings,
  setSettings,
  onSave,
}: NotificationSettingsFormProps) {
  return (
    <form
      onSubmit={onSave}
      className="border-border/60 bg-card space-y-6 rounded-2xl border p-6 shadow-xs"
    >
      <div>
        <h3 className="text-foreground flex items-center gap-2 text-base font-bold">
          <Bell className="text-primary size-4" />
          Notifications & Privacy Options
        </h3>
        <p className="text-muted-foreground mt-0.5 text-xs">
          Control email alerts for new simulcast episodes and watchlist privacy.
        </p>
      </div>

      <div className="space-y-4">
        <div className="border-border/40 bg-background/50 flex items-center justify-between rounded-xl border p-3">
          <div className="space-y-0.5">
            <span className="text-foreground block text-xs font-semibold">
              New Episode Airing Alerts
            </span>
            <span className="text-muted-foreground text-[11px]">
              Receive instant notifications when anime in your Watching list releases a new episode.
            </span>
          </div>
          <Switch
            checked={settings.notifications.newEpisodeAlerts}
            onCheckedChange={(checked) =>
              setSettings({
                ...settings,
                notifications: { ...settings.notifications, newEpisodeAlerts: checked },
              })
            }
          />
        </div>

        <div className="border-border/40 bg-background/50 flex items-center justify-between rounded-xl border p-3">
          <div className="space-y-0.5">
            <span className="text-foreground block text-xs font-semibold">
              Public Watchlist Profile
            </span>
            <span className="text-muted-foreground text-[11px]">
              Allow other users to view your public anime watchlist and stats.
            </span>
          </div>
          <Switch
            checked={settings.notifications.publicWatchlist}
            onCheckedChange={(checked) =>
              setSettings({
                ...settings,
                notifications: { ...settings.notifications, publicWatchlist: checked },
              })
            }
          />
        </div>
      </div>

      <div className="border-border/40 flex justify-end border-t pt-4">
        <Button type="submit" className="gap-2 rounded-xl text-xs font-semibold">
          <Save className="size-3.5" />
          Save Preferences
        </Button>
      </div>
    </form>
  );
}
