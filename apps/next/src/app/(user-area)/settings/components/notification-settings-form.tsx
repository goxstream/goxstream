"use client";

import { Bell, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
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
    <form onSubmit={onSave} className="p-6 rounded-2xl border border-border/60 bg-card space-y-6 shadow-xs">
      <div>
        <h3 className="font-bold text-base text-foreground flex items-center gap-2">
          <Bell className="size-4 text-primary" />
          Notifications & Privacy Options
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Control email alerts for new simulcast episodes and watchlist privacy.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-background/50">
          <div className="space-y-0.5">
            <span className="font-semibold text-xs text-foreground block">
              New Episode Airing Alerts
            </span>
            <span className="text-[11px] text-muted-foreground">
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

        <div className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-background/50">
          <div className="space-y-0.5">
            <span className="font-semibold text-xs text-foreground block">
              Public Watchlist Profile
            </span>
            <span className="text-[11px] text-muted-foreground">
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

      <div className="pt-4 border-t border-border/40 flex justify-end">
        <Button type="submit" className="rounded-xl text-xs font-semibold gap-2">
          <Save className="size-3.5" />
          Save Preferences
        </Button>
      </div>
    </form>
  );
}
