"use client";

import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { UserAccount, UserRole, UserStatus, MembershipTier } from "../types";

interface UserFormSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingUser: UserAccount | null;
  onSave: (userData: Partial<UserAccount>) => void;
}

export function UserFormSheet({
  isOpen,
  onOpenChange,
  editingUser,
  onSave,
}: UserFormSheetProps) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("user");
  const [status, setStatus] = useState<UserStatus>("active");
  const [membershipTier, setMembershipTier] = useState<MembershipTier>("free");

  useEffect(() => {
    if (editingUser) {
      setName(editingUser.name);
      setUsername(editingUser.username);
      setEmail(editingUser.email);
      setRole(editingUser.role);
      setStatus(editingUser.status);
      setMembershipTier(editingUser.membershipTier);
    } else {
      setName("");
      setUsername("");
      setEmail("");
      setRole("user");
      setStatus("active");
      setMembershipTier("free");
    }
  }, [editingUser, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      username,
      email,
      role,
      status,
      membershipTier,
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 h-full">
          <SheetHeader className="text-left">
            <SheetTitle className="text-xl font-bold">
              {editingUser ? "Edit User Profile" : "Add New User Account"}
            </SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground">
              {editingUser
                ? "Update details, status, and role for this user account."
                : "Create a new audience or staff account in the GoXStream directory."}
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-col gap-4 text-xs flex-1">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name" className="text-xs font-medium">Full Name</Label>
              <Input
                id="name"
                placeholder="e.g. John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-9 text-xs border-border/60"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="username" className="text-xs font-medium">Username</Label>
              <Input
                id="username"
                placeholder="e.g. johndoe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="h-9 text-xs border-border/60"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="email" className="text-xs font-medium">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="e.g. john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-9 text-xs border-border/60"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-xs font-medium">User Role</Label>
              <Select value={role} onValueChange={(val) => setRole((val as UserRole) ?? "user")}>
                <SelectTrigger className="h-9 text-xs border-border/60">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user" className="text-xs">User / Viewer</SelectItem>
                  <SelectItem value="moderator" className="text-xs">Moderator</SelectItem>
                  <SelectItem value="content_manager" className="text-xs">Content Manager</SelectItem>
                  <SelectItem value="admin" className="text-xs">Admin</SelectItem>
                  <SelectItem value="super_admin" className="text-xs">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-medium">Account Status</Label>
                <Select value={status} onValueChange={(val) => setStatus((val as UserStatus) ?? "active")}>
                  <SelectTrigger className="h-9 text-xs border-border/60">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active" className="text-xs">Active</SelectItem>
                    <SelectItem value="suspended" className="text-xs">Suspended</SelectItem>
                    <SelectItem value="pending" className="text-xs">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-xs font-medium">Membership Tier</Label>
                <Select value={membershipTier} onValueChange={(val) => setMembershipTier((val as MembershipTier) ?? "free")}>
                  <SelectTrigger className="h-9 text-xs border-border/60">
                    <SelectValue placeholder="Tier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free" className="text-xs">Free Tier</SelectItem>
                    <SelectItem value="vip_pro" className="text-xs">VIP Pro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <SheetFooter className="mt-auto flex flex-col gap-2 sm:flex-row sm:justify-end">
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
              {editingUser ? "Save Changes" : "Create Account"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
