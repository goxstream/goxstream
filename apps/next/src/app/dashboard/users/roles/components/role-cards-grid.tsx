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

export function RoleCardsGrid({ roles, selectedRoleSlug, onSelectRole }: RoleCardsGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {roles.map((role) => {
        const isSelected = role.slug === selectedRoleSlug;

        return (
          <Card
            key={role.id}
            onClick={() => onSelectRole(role.slug)}
            className={`border-border/60 bg-card hover:border-foreground/30 cursor-pointer shadow-xs transition-all ${
              isSelected ? "ring-primary/40 border-primary ring-2" : ""
            }`}
          >
            <CardContent className="flex h-full flex-col justify-between gap-4 p-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="border-border/60 bg-muted/40 text-foreground flex size-8 items-center justify-center rounded-md border">
                      <Shield className="size-4" />
                    </div>
                    <span className="text-foreground text-sm font-semibold">{role.name}</span>
                  </div>
                  {role.isDefault && (
                    <Badge variant="secondary" className="text-[10px]">
                      Default
                    </Badge>
                  )}
                </div>

                <p className="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
                  {role.description}
                </p>
              </div>

              <div className="border-border/40 text-muted-foreground flex items-center justify-between border-t pt-2 text-xs">
                <div className="flex items-center gap-1.5 font-medium">
                  <Users className="size-3.5" />
                  <span>{role.memberCount} members</span>
                </div>
                <div className="text-foreground flex items-center gap-1 font-medium">
                  <Lock className="text-muted-foreground size-3.5" />
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
