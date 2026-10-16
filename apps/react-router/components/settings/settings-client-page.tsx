"use client";

import { User, Shield, Tv, Bell, Check } from "lucide-react";
import { Badge } from "@shionstream/ui/components/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@shionstream/ui/components/tabs";
import { ApiError } from "@/components/api-error";
import { ProfileSettingsForm } from "./profile-settings-form";
import { PlayerSettingsForm } from "./player-settings-form";
import { SecuritySettingsForm } from "./security-settings-form";
import { NotificationSettingsForm } from "./notification-settings-form";
import { useSettings } from "@/hooks/use-settings";

export function SettingsClientPage() {
  const { settings, setSettings, isLoading, error, savedSuccess, handleSave } = useSettings();

  if (error) {
    return <ApiError message={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="border-border/60 from-card via-card to-primary/5 flex flex-col justify-between gap-4 rounded-2xl border bg-gradient-to-r p-6 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3.5">
          <div className="bg-primary/10 border-primary/20 text-primary flex size-12 items-center justify-center rounded-xl border">
            <User className="size-6" />
          </div>
          <div>
            <h1 className="text-foreground text-2xl font-extrabold tracking-tight">
              Account & Application Settings
            </h1>
            <p className="text-muted-foreground mt-0.5 text-xs">
              Customize your profile, streaming video player defaults, and security.
            </p>
          </div>
        </div>

        {savedSuccess && (
          <Badge
            variant="secondary"
            className="gap-1.5 self-start border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 font-semibold text-emerald-500 sm:self-auto"
          >
            <Check className="size-3.5" />
            Changes Saved Successfully!
          </Badge>
        )}
      </div>

      {isLoading ? (
        <div className="border-border/60 bg-card/60 space-y-6 rounded-2xl border p-6 shadow-xs animate-pulse h-96" />
      ) : (
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="bg-card border-border/60 grid h-auto w-full grid-cols-2 gap-1 rounded-2xl border p-1.5 md:grid-cols-4">
            <TabsTrigger
              value="profile"
              className="data-active:bg-primary data-active:text-primary-foreground cursor-pointer gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-all"
            >
              <User className="size-4" />
              Profile Info
            </TabsTrigger>
            <TabsTrigger
              value="player"
              className="data-active:bg-primary data-active:text-primary-foreground cursor-pointer gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-all"
            >
              <Tv className="size-4" />
              Player Defaults
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="data-active:bg-primary data-active:text-primary-foreground cursor-pointer gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-all"
            >
              <Shield className="size-4" />
              Account Security
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="data-active:bg-primary data-active:text-primary-foreground cursor-pointer gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-all"
            >
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
            <NotificationSettingsForm
              settings={settings}
              setSettings={setSettings}
              onSave={handleSave}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
