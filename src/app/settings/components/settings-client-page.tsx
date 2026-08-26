"use client";

import { useState } from "react";
import {
  User,
  Shield,
  Tv,
  Bell,
  Check,
  Save,
  Lock,
  Sparkles,
  Volume2,
  Subtitles,
  Smartphone,
  Eye,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MOCK_USER_SETTINGS, MOCK_USER_PROFILE } from "@/lib/mock-user";
import type { UserSettings } from "@/types/user";

export function SettingsClientPage() {
  const [settings, setSettings] = useState<UserSettings>(MOCK_USER_SETTINGS);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl border border-border/60 bg-gradient-to-r from-card via-card to-primary/5">
        <div className="flex items-center gap-3.5">
          <div className="size-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <User className="size-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
              Account & Application Settings
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Customize your profile, streaming video player defaults, and security.
            </p>
          </div>
        </div>

        {savedSuccess && (
          <Badge variant="secondary" className="px-3 py-1.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-semibold gap-1.5 self-start sm:self-auto">
            <Check className="size-3.5" />
            Changes Saved Successfully!
          </Badge>
        )}
      </div>

      {/* Main Settings Tabs */}
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="bg-card border border-border/60 p-1.5 rounded-2xl w-full grid grid-cols-2 md:grid-cols-4 h-auto gap-1">
          <TabsTrigger
            value="profile"
            className="px-3 py-2 text-xs font-semibold rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all gap-2"
          >
            <User className="size-4" />
            Profile Info
          </TabsTrigger>
          <TabsTrigger
            value="player"
            className="px-3 py-2 text-xs font-semibold rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all gap-2"
          >
            <Tv className="size-4" />
            Player Defaults
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="px-3 py-2 text-xs font-semibold rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all gap-2"
          >
            <Shield className="size-4" />
            Account Security
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="px-3 py-2 text-xs font-semibold rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all gap-2"
          >
            <Bell className="size-4" />
            Notifications
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Profile Info */}
        <TabsContent value="profile" className="mt-6">
          <form onSubmit={handleSave} className="p-6 rounded-2xl border border-border/60 bg-card space-y-6 shadow-xs">
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
        </TabsContent>

        {/* Tab 2: Player & Streaming Defaults */}
        <TabsContent value="player" className="mt-6">
          <form onSubmit={handleSave} className="p-6 rounded-2xl border border-border/60 bg-card space-y-6 shadow-xs">
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
              {/* Default Quality */}
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

              {/* Subtitle Language */}
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

              {/* Audio Track */}
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
              {/* Auto Play Next */}
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

              {/* Auto Skip Intro */}
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
        </TabsContent>

        {/* Tab 3: Security & Account */}
        <TabsContent value="security" className="mt-6">
          <form onSubmit={handleSave} className="p-6 rounded-2xl border border-border/60 bg-card space-y-6 shadow-xs">
            <div>
              <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                <Lock className="size-4 text-primary" />
                Account Credentials & Security
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Update your registered email address or change your account password.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2 max-w-md">
                <Label className="text-xs font-medium">Email Address</Label>
                <Input
                  value={MOCK_USER_PROFILE.email}
                  disabled
                  className="rounded-xl text-xs bg-muted/50 border-border/60 cursor-not-allowed opacity-80"
                />
              </div>

              <div className="pt-2 border-t border-border/40 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Current Password</Label>
                  <Input
                    type="password"
                    placeholder="••••••••••••"
                    className="rounded-xl text-xs bg-background border-border/60"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-medium">New Password</Label>
                  <Input
                    type="password"
                    placeholder="Minimum 8 characters"
                    className="rounded-xl text-xs bg-background border-border/60"
                  />
                </div>
              </div>
            </div>

            {/* Active Sessions */}
            <div className="pt-4 border-t border-border/40 space-y-3">
              <h4 className="font-semibold text-xs text-foreground flex items-center gap-2">
                <Smartphone className="size-3.5 text-muted-foreground" />
                Active Logged-in Devices
              </h4>
              <div className="p-3 rounded-xl border border-border/40 bg-background/50 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="font-medium text-xs text-foreground block">
                    Chrome on Windows (Current Session)
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    Jakarta, Indonesia • IP 180.252.xx.xx
                  </span>
                </div>
                <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                  Active Now
                </Badge>
              </div>
            </div>

            <div className="pt-4 border-t border-border/40 flex justify-end">
              <Button type="submit" className="rounded-xl text-xs font-semibold gap-2">
                <Save className="size-3.5" />
                Update Security Settings
              </Button>
            </div>
          </form>
        </TabsContent>

        {/* Tab 4: Notifications & Privacy */}
        <TabsContent value="notifications" className="mt-6">
          <form onSubmit={handleSave} className="p-6 rounded-2xl border border-border/60 bg-card space-y-6 shadow-xs">
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
