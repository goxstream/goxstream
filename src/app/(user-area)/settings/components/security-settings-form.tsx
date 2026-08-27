"use client";

import { Lock, Save, Smartphone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MOCK_USER_PROFILE } from "@/lib/mock-user";

interface SecuritySettingsFormProps {
  onSave: (e: React.FormEvent) => void;
}

export function SecuritySettingsForm({ onSave }: SecuritySettingsFormProps) {
  return (
    <form onSubmit={onSave} className="p-6 rounded-2xl border border-border/60 bg-card space-y-6 shadow-xs">
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
  );
}
