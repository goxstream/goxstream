"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { RoleDefinition } from "../types";

interface InviteStaffDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  roles: RoleDefinition[];
  onInviteStaff: (staffData: { name: string; email: string; roleSlug: string }) => void;
}

export function InviteStaffDialog({
  isOpen,
  onOpenChange,
  roles,
  onInviteStaff,
}: InviteStaffDialogProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [roleSlug, setRoleSlug] = useState<string>("moderator");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    onInviteStaff({ name, email, roleSlug });
    setName("");
    setEmail("");
    setRoleSlug("moderator");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <DialogHeader className="text-left">
            <DialogTitle className="text-lg font-bold">Invite Staff Member</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Send an invitation link to a team member and assign their initial platform role.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 text-xs">
            <div className="flex flex-col gap-2">
              <Label htmlFor="staff-name" className="text-xs font-medium">Full Name</Label>
              <Input
                id="staff-name"
                placeholder="e.g. Alice Smith"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-9 text-xs border-border/60"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="staff-email" className="text-xs font-medium">Work Email Address</Label>
              <Input
                id="staff-email"
                type="email"
                placeholder="e.g. alice@goxstream.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-9 text-xs border-border/60"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-xs font-medium">Assign Initial Role</Label>
              <Select value={roleSlug} onValueChange={(val) => setRoleSlug(val ?? "moderator")}>
                <SelectTrigger className="h-9 text-xs border-border/60">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((r) => (
                    <SelectItem key={r.id} value={r.slug} className="text-xs">
                      {r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-9 text-xs"
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" className="h-9 text-xs bg-primary text-primary-foreground">
              Send Invitation
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
