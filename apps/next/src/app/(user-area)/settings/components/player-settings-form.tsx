"use client";

import { Tv, Save } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { UserSettings } from "@/types/user";

interface PlayerSettingsFormProps {
  settings: UserSettings;
  setSettings: React.Dispatch<React.SetStateAction<UserSettings>>;
  onSave: (e: React.FormEvent) => void;
}

export function PlayerSettingsForm({
  settings,
  setSettings,
  onSave,
}: PlayerSettingsFormProps) {
  return (
    <form onSubmit={onSave} className="p-6 rounded-2xl border border-border/60 bg-card space-y-6 shadow-xs">
      <div>
        <h3 className="font-bold text-base text-foreground flex items-center gap-2">
          <Tv className="size-4 text-primary" />
          Video & Audio Preferences
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Set your default streaming resolution, subtitle language, and automated playback rules.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div className="space-y-2">
          <Label className="text-xs font-medium">Default Resolution</Label>
          <Select
            value={settings.player.defaultQuality}
            onValueChange={(val: any) =>
              setSettings({
                ...settings,
                player: { ...settings.player, defaultQuality: val },
              })
            }
          >
            <SelectTrigger className="rounded-xl text-xs bg-background border-border/60">
              <SelectValue placeholder="Select quality" />
            </SelectTrigger>
            <SelectContent className="bg-popover border border-border/80 text-xs">
              <SelectItem value="auto">Auto (Adaptive)</SelectItem>
              <SelectItem value="1080p">1080p Full HD</SelectItem>
              <SelectItem value="720p">720p HD</SelectItem>
              <SelectItem value="480p">480p SD</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-medium">Default Subtitles</Label>
          <Select
            value={settings.player.defaultSubtitle}
            onValueChange={(val: any) =>
              setSettings({
                ...settings,
                player: { ...settings.player, defaultSubtitle: val },
              })
            }
          >
            <SelectTrigger className="rounded-xl text-xs bg-background border-border/60">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent className="bg-popover border border-border/80 text-xs">
              <SelectItem value="id">Indonesian (Bahasa)</SelectItem>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="jp">Japanese (Romaji)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-medium">Audio Preference</Label>
          <Select
            value={settings.player.preferredAudio}
            onValueChange={(val: any) =>
              setSettings({
                ...settings,
                player: { ...settings.player, preferredAudio: val },
              })
            }
          >
            <SelectTrigger className="rounded-xl text-xs bg-background border-border/60">
              <SelectValue placeholder="Select audio" />
            </SelectTrigger>
            <SelectContent className="bg-popover border border-border/80 text-xs">
              <SelectItem value="subbed">Japanese Original (Subbed)</SelectItem>
              <SelectItem value="dubbed">English Dubbed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="pt-4 border-t border-border/40 space-y-4">
        <div className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-background/50">
          <div className="space-y-0.5">
            <span className="font-semibold text-xs text-foreground block">
              Autoplay Next Episode
            </span>
            <span className="text-[11px] text-muted-foreground">
              Automatically start the next episode when current video ends.
            </span>
          </div>
          <Switch
            checked={settings.player.autoPlayNext}
            onCheckedChange={(checked) =>
              setSettings({
                ...settings,
                player: { ...settings.player, autoPlayNext: checked },
              })
            }
          />
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-background/50">
          <div className="space-y-0.5">
            <span className="font-semibold text-xs text-foreground block">
              Auto-Skip Opening & Ending Fillers
            </span>
            <span className="text-[11px] text-muted-foreground">
              Automatically jump over opening song intros and preview outro themes.
            </span>
          </div>
          <Switch
            checked={settings.player.autoSkipIntro}
            onCheckedChange={(checked) =>
              setSettings({
                ...settings,
                player: { ...settings.player, autoSkipIntro: checked },
              })
            }
          />
        </div>
      </div>

      <div className="pt-4 border-t border-border/40 flex justify-end">
        <Button type="submit" className="rounded-xl text-xs font-semibold gap-2">
          <Save className="size-3.5" />
          Save Player Preferences
        </Button>
      </div>
    </form>
  );
}
