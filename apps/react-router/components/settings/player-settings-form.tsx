"use client";

import { Tv, Save } from "lucide-react";
import { Label } from "@goxstream/ui/components/label";
import { Button } from "@goxstream/ui/components/button";
import { Switch } from "@goxstream/ui/components/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@goxstream/ui/components/select";
import type { UserSettings } from "@/types/user";

interface PlayerSettingsFormProps {
  settings: UserSettings;
  setSettings: React.Dispatch<React.SetStateAction<UserSettings>>;
  onSave: (e: React.FormEvent) => void;
}

export function PlayerSettingsForm({ settings, setSettings, onSave }: PlayerSettingsFormProps) {
  return (
    <form
      onSubmit={onSave}
      className="border-border/60 bg-card space-y-6 rounded-2xl border p-6 shadow-xs"
    >
      <div>
        <h3 className="text-foreground flex items-center gap-2 text-base font-bold">
          <Tv className="text-primary size-4" />
          Video & Audio Preferences
        </h3>
        <p className="text-muted-foreground mt-0.5 text-xs">
          Set your default streaming resolution, subtitle language, and automated playback rules.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-3">
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
            <SelectTrigger className="bg-background border-border/60 rounded-xl text-xs">
              <SelectValue placeholder="Select quality" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border/80 border text-xs">
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
            <SelectTrigger className="bg-background border-border/60 rounded-xl text-xs">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border/80 border text-xs">
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
            <SelectTrigger className="bg-background border-border/60 rounded-xl text-xs">
              <SelectValue placeholder="Select audio" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border/80 border text-xs">
              <SelectItem value="subbed">Japanese Original (Subbed)</SelectItem>
              <SelectItem value="dubbed">English Dubbed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border-border/40 space-y-4 border-t pt-4">
        <div className="border-border/40 bg-background/50 flex items-center justify-between rounded-xl border p-3">
          <div className="space-y-0.5">
            <span className="text-foreground block text-xs font-semibold">
              Autoplay Next Episode
            </span>
            <span className="text-muted-foreground text-[11px]">
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

        <div className="border-border/40 bg-background/50 flex items-center justify-between rounded-xl border p-3">
          <div className="space-y-0.5">
            <span className="text-foreground block text-xs font-semibold">
              Auto-Skip Opening & Ending Fillers
            </span>
            <span className="text-muted-foreground text-[11px]">
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

      <div className="border-border/40 flex justify-end border-t pt-4">
        <Button type="submit" className="gap-2 rounded-xl text-xs font-semibold">
          <Save className="size-3.5" />
          Save Player Preferences
        </Button>
      </div>
    </form>
  );
}
