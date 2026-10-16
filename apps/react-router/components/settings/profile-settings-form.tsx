"use client";

import { Save } from "lucide-react";
import { Input } from "@shionstream/ui/components/input";
import { Label } from "@shionstream/ui/components/label";
import { Button } from "@shionstream/ui/components/button";
import { Textarea } from "@shionstream/ui/components/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@shionstream/ui/components/avatar";
import type { UserSettings } from "@/types/user";

interface ProfileSettingsFormProps {
  settings: UserSettings;
  setSettings: React.Dispatch<React.SetStateAction<UserSettings>>;
  onSave: (e: React.FormEvent) => void;
}

export function ProfileSettingsForm({ settings, setSettings, onSave }: ProfileSettingsFormProps) {
  return (
    <form
      onSubmit={onSave}
      className="border-border/60 bg-card space-y-6 rounded-2xl border p-6 shadow-xs"
    >
      <div className="flex items-center gap-4">
        <Avatar className="border-primary/20 size-20 border-2">
          <AvatarImage src={settings.profile.avatarUrl} alt={settings.profile.displayName} />
          <AvatarFallback className="bg-primary/10 text-primary text-lg font-bold">
            {(settings.profile.displayName || "US").substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <h3 className="text-foreground text-sm font-semibold">Avatar & Display Picture</h3>
          <p className="text-muted-foreground text-xs">
            JPG, PNG or GIF. Recommended resolution 400x400px.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <Button variant="outline" size="xs" type="button" className="rounded-lg text-xs">
              Change Avatar
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-xs font-medium">Display Name</Label>
          <Input
            value={settings.profile.displayName}
            onChange={(e) =>
              setSettings({
                ...settings,
                profile: { ...settings.profile, displayName: e.target.value },
              })
            }
            className="bg-background border-border/60 rounded-xl text-xs"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-medium">Username Handle</Label>
          <Input
            value={`@${(settings.profile.displayName || "user").toLowerCase().replace(/\s+/g, "_")}`}
            disabled
            className="bg-muted/50 border-border/60 cursor-not-allowed rounded-xl text-xs opacity-80"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-medium">Profile Bio</Label>
        <Textarea
          rows={3}
          value={settings.profile.bio}
          onChange={(e) =>
            setSettings({
              ...settings,
              profile: { ...settings.profile, bio: e.target.value },
            })
          }
          className="bg-background border-border/60 resize-none rounded-xl text-xs"
        />
      </div>

      <div className="border-border/40 flex justify-end border-t pt-4">
        <Button type="submit" className="gap-2 rounded-xl text-xs font-semibold">
          <Save className="size-3.5" />
          Save Profile Changes
        </Button>
      </div>
    </form>
  );
}
