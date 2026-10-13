"use client";

import { CalendarDays, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SeasonQuarter } from "../types";

interface SeasonsHeaderProps {
  selectedYear: number;
  selectedQuarter: SeasonQuarter;
  onYearChange: (year: number) => void;
  onQuarterChange: (quarter: SeasonQuarter) => void;
  onOpenAddSheet: () => void;
}

export function SeasonsHeader({
  selectedYear,
  selectedQuarter,
  onYearChange,
  onQuarterChange,
  onOpenAddSheet,
}: SeasonsHeaderProps) {
  return (
    <div className="border-border/60 flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="text-foreground flex items-center gap-2 text-2xl font-bold tracking-tight">
          <CalendarDays className="text-primary size-6" />
          Season Schedule Management
        </h1>
        <p className="text-muted-foreground text-sm">
          Manage seasonal anime line-ups, broadcast day time slots, and seasonal calendar releases.
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Season Pickers */}
        <div className="flex items-center gap-2">
          <Select
            value={String(selectedYear)}
            onValueChange={(val) => val && onYearChange(Number(val))}
          >
            <SelectTrigger className="h-8 w-[90px] rounded-lg text-xs font-semibold">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2026" className="text-xs">
                2026
              </SelectItem>
              <SelectItem value="2025" className="text-xs">
                2025
              </SelectItem>
              <SelectItem value="2024" className="text-xs">
                2024
              </SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={selectedQuarter}
            onValueChange={(val) => val && onQuarterChange(val as SeasonQuarter)}
          >
            <SelectTrigger className="h-8 w-[125px] rounded-lg text-xs font-semibold">
              <SelectValue placeholder="Quarter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="WINTER" className="text-xs">
                Winter (Q1)
              </SelectItem>
              <SelectItem value="SPRING" className="text-xs">
                Spring (Q2)
              </SelectItem>
              <SelectItem value="SUMMER" className="text-xs">
                Summer (Q3)
              </SelectItem>
              <SelectItem value="FALL" className="text-xs">
                Fall (Q4)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button variant="default" size="sm" onClick={onOpenAddSheet} className="gap-1.5 rounded-lg">
          <Plus className="size-4" />
          Add Season
        </Button>
      </div>
    </div>
  );
}
