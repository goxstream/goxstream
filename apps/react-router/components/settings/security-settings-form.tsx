"use client";

import { Lock, Save, Smartphone } from "lucide-react";
import { Input } from "@shionstream/ui/components/input";
import { Label } from "@shionstream/ui/components/label";
import { Button } from "@shionstream/ui/components/button";
import { Badge } from "@shionstream/ui/components/badge";

interface SecuritySettingsFormProps {
  onSave: (e: React.FormEvent) => void;
  email?: string;
}

export function SecuritySettingsForm({
  onSave,
  email = "user@example.com",
}: SecuritySettingsFormProps) {
  return (
    <form
      onSubmit={onSave}
      className="border-border/60 bg-card space-y-6 rounded-2xl border p-6 shadow-xs"
    >
      <div>
        <h3 className="text-foreground flex items-center gap-2 text-base font-bold">
          <Lock className="text-primary size-4" />
          Account Credentials & Security
        </h3>
        <p className="text-muted-foreground mt-0.5 text-xs">
          Update your registered email address or change your account password.
        </p>
      </div>

      <div className="space-y-4">
        <div className="max-w-md space-y-2">
          <Label className="text-xs font-medium">Email Address</Label>
          <Input
            value={email}
            disabled
            className="bg-muted/50 border-border/60 cursor-not-allowed rounded-xl text-xs opacity-80"
          />
        </div>

        <div className="border-border/40 grid grid-cols-1 gap-4 border-t pt-2 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-xs font-medium">Current Password</Label>
            <Input
              type="password"
              placeholder="••••••••••••"
              className="bg-background border-border/60 rounded-xl text-xs"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium">New Password</Label>
            <Input
              type="password"
              placeholder="Minimum 8 characters"
              className="bg-background border-border/60 rounded-xl text-xs"
            />
          </div>
        </div>
      </div>

      <div className="border-border/40 space-y-3 border-t pt-4">
        <h4 className="text-foreground flex items-center gap-2 text-xs font-semibold">
          <Smartphone className="text-muted-foreground size-3.5" />
          Active Logged-in Devices
        </h4>
        <div className="border-border/40 bg-background/50 flex items-center justify-between rounded-xl border p-3">
          <div className="space-y-0.5">
            <span className="text-foreground block text-xs font-medium">
              Chrome on Windows (Current Session)
            </span>
            <span className="text-muted-foreground text-[10px]">
              Jakarta, Indonesia • IP 180.252.xx.xx
            </span>
          </div>
          <Badge
            variant="outline"
            className="border-emerald-500/20 bg-emerald-500/10 text-[10px] text-emerald-500"
          >
            Active Now
          </Badge>
        </div>
      </div>

      <div className="border-border/40 flex justify-end border-t pt-4">
        <Button type="submit" className="gap-2 rounded-xl text-xs font-semibold">
          <Save className="size-3.5" />
          Update Security Settings
        </Button>
      </div>
    </form>
  );
}
