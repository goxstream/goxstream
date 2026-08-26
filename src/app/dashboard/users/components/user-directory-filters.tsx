"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ROLE_OPTIONS, STATUS_OPTIONS, TIER_OPTIONS } from "../constants";
import type { UserFilters } from "../types";

interface UserDirectoryFiltersProps {
  filters: UserFilters;
  onFilterChange: (newFilters: Partial<UserFilters>) => void;
  onResetFilters: () => void;
}

export function UserDirectoryFilters({
  filters,
  onFilterChange,
  onResetFilters,
}: UserDirectoryFiltersProps) {
  const isFiltered =
    filters.search !== "" ||
    filters.role !== "all" ||
    filters.status !== "all" ||
    filters.membershipTier !== "all";

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border/60 bg-card p-3 shadow-xs md:flex-row md:items-center md:justify-between">
      <div className="relative flex-1 md:max-w-xs">
        <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search name, email, or @username..."
          value={filters.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          className="h-9 border-border/60 pl-9 text-xs"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={filters.role}
          onValueChange={(val) => onFilterChange({ role: val ?? "all" })}
        >
          <SelectTrigger className="h-9 w-[130px] border-border/60 text-xs">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            {ROLE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value} className="text-xs">
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.status}
          onValueChange={(val) => onFilterChange({ status: val ?? "all" })}
        >
          <SelectTrigger className="h-9 w-[130px] border-border/60 text-xs">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value} className="text-xs">
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.membershipTier}
          onValueChange={(val) => onFilterChange({ membershipTier: val ?? "all" })}
        >
          <SelectTrigger className="h-9 w-[130px] border-border/60 text-xs">
            <SelectValue placeholder="Membership" />
          </SelectTrigger>
          <SelectContent>
            {TIER_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value} className="text-xs">
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetFilters}
            className="h-9 gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="size-3.5" />
            <span>Reset</span>
          </Button>
        )}
      </div>
    </div>
  );
}
