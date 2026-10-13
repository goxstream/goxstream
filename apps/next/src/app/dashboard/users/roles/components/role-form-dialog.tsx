"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { PERMISSION_ITEMS } from "../constants";

interface RoleFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSaveRole: (roleData: { name: string; description: string; permissions: string[] }) => void;
}

export function RoleFormDialog({
  isOpen,
  onOpenChange,
  onSaveRole,
}: RoleFormDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPerms, setSelectedPerms] = useState<string[]>([]);

  const handleTogglePerm = (key: string) => {
    setSelectedPerms((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSaveRole({
      name,
      description,
      permissions: selectedPerms,
    });
    setName("");
    setDescription("");
    setSelectedPerms([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md overflow-y-auto max-h-[90vh]">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <DialogHeader className="text-left">
            <DialogTitle className="text-lg font-bold">Create Custom Role</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Define a custom staff role and assign granular platform capabilities.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 text-xs">
            <div className="flex flex-col gap-2">
              <Label htmlFor="role-name" className="text-xs font-medium">Role Name</Label>
              <Input
                id="role-name"
                placeholder="e.g. Subtitle Editor"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-9 text-xs border-border/60"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="role-desc" className="text-xs font-medium">Description</Label>
              <Textarea
                id="role-desc"
                placeholder="Briefly describe the responsibilities of this role..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="text-xs border-border/60 min-h-[60px]"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-xs font-medium">Assign Permissions:</Label>
              <div className="rounded-lg border border-border/60 bg-muted/20 p-3 space-y-3">
                {PERMISSION_ITEMS.map((perm) => {
                  const isChecked = selectedPerms.includes(perm.key);
                  return (
                    <div key={perm.id} className="flex items-start gap-2.5">
                      <Checkbox
                        id={`perm-${perm.id}`}
                        checked={isChecked}
                        onCheckedChange={() => handleTogglePerm(perm.key)}
                        className="mt-0.5"
                      />
                      <div className="flex flex-col gap-0.5">
                        <label
                          htmlFor={`perm-${perm.id}`}
                          className="font-semibold text-foreground cursor-pointer"
                        >
                          {perm.name}
                        </label>
                        <span className="text-[11px] text-muted-foreground">{perm.description}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
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
              Create Role
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
