"use client";

import { User, Shield, Tv, Bell, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileSettingsForm } from "./profile-settings-form";
import { PlayerSettingsForm } from "./player-settings-form";
import { SecuritySettingsForm } from "./security-settings-form";
import { NotificationSettingsForm } from "./notification-settings-form";
import { useSettings } from "../hooks/use-settings";

export function SettingsClientPage() {
  const { settings, setSettings, savedSuccess, handleSave } = useSettings();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
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

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="bg-card border border-border/60 p-1.5 rounded-2xl w-full grid grid-cols-2 md:grid-cols-4 h-auto gap-1">
          <TabsTrigger value="profile" className="px-3 py-2 text-xs font-semibold rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all gap-2">
            <User className="size-4" />
            Profile Info
          </TabsTrigger>
          <TabsTrigger value="player" className="px-3 py-2 text-xs font-semibold rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all gap-2">
            <Tv className="size-4" />
            Player Defaults
          </TabsTrigger>
          <TabsTrigger value="security" className="px-3 py-2 text-xs font-semibold rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all gap-2">
            <Shield className="size-4" />
            Account Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="px-3 py-2 text-xs font-semibold rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all gap-2">
            <Bell className="size-4" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <ProfileSettingsForm settings={settings} setSettings={setSettings} onSave={handleSave} />
        </TabsContent>

        <TabsContent value="player" className="mt-6">
          <PlayerSettingsForm settings={settings} setSettings={setSettings} onSave={handleSave} />
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <SecuritySettingsForm onSave={handleSave} />
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <NotificationSettingsForm settings={settings} setSettings={setSettings} onSave={handleSave} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
