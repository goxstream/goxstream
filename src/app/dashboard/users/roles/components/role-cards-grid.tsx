"use client";

import { Shield, Users, Lock, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { RoleDefinition } from "../types";

interface RoleCardsGridProps {
  roles: RoleDefinition[];
  selectedRoleSlug: string;
  onSelectRole: (roleSlug: string) => void;
}

export function RoleCardsGrid({
  roles,
  selectedRoleSlug,
  onSelectRole,
}: RoleCardsGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {roles.map((role) => {
        const isSelected = role.slug === selectedRoleSlug;

        return (
          <Card
            key={role.id}
            onClick={() => onSelectRole(role.slug)}
            className={`cursor-pointer transition-all border-border/60 bg-card shadow-xs hover:border-foreground/30 ${
              isSelected ? "ring-2 ring-primary/40 border-primary" : ""
            }`}
          >
            <CardContent className="p-4 flex flex-col justify-between h-full gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-md border border-border/60 bg-muted/40 text-foreground">
                      <Shield className="size-4" />
                    </div>
                    <span className="font-semibold text-foreground text-sm">{role.name}</span>
                  </div>
                  {role.isDefault && (
                    <Badge variant="secondary" className="text-[10px]">Default</Badge>
                  )}
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {role.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5 font-medium">
                  <Users className="size-3.5" />
                  <span>{role.memberCount} members</span>
                </div>
                <div className="flex items-center gap-1 font-medium text-foreground">
                  <Lock className="size-3.5 text-muted-foreground" />
                  <span>{role.permissions.length} perms</span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
