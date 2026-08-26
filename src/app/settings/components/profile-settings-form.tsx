"use client";

import { Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MOCK_USER_PROFILE } from "@/lib/mock-user";
import type { UserSettings } from "@/types/user";

interface ProfileSettingsFormProps {
  settings: UserSettings;
  setSettings: React.Dispatch<React.SetStateAction<UserSettings>>;
  onSave: (e: React.FormEvent) => void;
}

export function ProfileSettingsForm({
  settings,
  setSettings,
  onSave,
}: ProfileSettingsFormProps) {
  return (
    <form onSubmit={onSave} className="p-6 rounded-2xl border border-border/60 bg-card space-y-6 shadow-xs">
      <div className="flex items-center gap-4">
        <Avatar className="size-20 border-2 border-primary/20">
          <AvatarImage src={settings.profile.avatarUrl} alt={settings.profile.displayName} />
          <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
            {settings.profile.displayName.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <h3 className="font-semibold text-sm text-foreground">Avatar & Display Picture</h3>
          <p className="text-xs text-muted-foreground">
            JPG, PNG or GIF. Recommended resolution 400x400px.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <Button variant="outline" size="xs" type="button" className="rounded-lg text-xs">
              Change Avatar
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            className="rounded-xl text-xs bg-background border-border/60"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-medium">Username Handle</Label>
          <Input
            value={`@${MOCK_USER_PROFILE.username}`}
            disabled
            className="rounded-xl text-xs bg-muted/50 border-border/60 cursor-not-allowed opacity-80"
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
          className="rounded-xl text-xs bg-background border-border/60 resize-none"
        />
      </div>

      <div className="pt-4 border-t border-border/40 flex justify-end">
        <Button type="submit" className="rounded-xl text-xs font-semibold gap-2">
          <Save className="size-3.5" />
          Save Profile Changes
        </Button>
      </div>
    </form>
  );
}
